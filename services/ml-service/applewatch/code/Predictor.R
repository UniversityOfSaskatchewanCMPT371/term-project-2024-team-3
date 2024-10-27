#====================== Apple Watch Data Predictor with Tidymodels ======================
# Programmed by Arastoo Bozorgi
# Email: ab1502@mun.ca
#=======================================================================

# Clear the workspace
rm(list = ls())

#======================== Load Required Libraries ======================
if (!require("pacman")) install.packages("pacman")
pacman::p_load(
  imputeTS, lubridate, data.table, dplyr, tidymodels, pryr, ranger, caret, doParallel, zoo
)

#======================= Set Time Zone & Arguments =====================
Sys.setenv(TZ = "America/St_Johns")

args <- c(
  "C:/Users/glenn/Desktop/BeapR/term-project-2024-team-3/services/",
  "C:/Users/glenn/Desktop/BeapR/term-project-2024-team-3/services/ml-service/SavedModels/",
  "C:/Users/glenn/Desktop/BeapR/term-project-2024-team-3/services/ml-service/aggregated_fitbit_applewatch_jaeger.csv",
  "C:/Users/glenn/Desktop/BeapR/term-project-2024-team-3/services/ml-service/applewatch/data/applewatch_data.csv",
  "randomForest"
)

if (length(args) != 5) {
  stop("Five arguments must be supplied: main path, model path, training file, data file, model type.", call. = FALSE)
}

main_path <- args[1]
model_path <- args[2]
training_file <- args[3]
file_name <- args[4]
model <- args[5]

#===================== Utility Function for Correlation ===========================
correlation <- function(x) {
  if (sd(x[, 1]) == 0 || sd(x[, 2]) == 0) {
    return(NA)  # Return NA if standard deviation is zero to avoid divide-by-zero error
  } else {
    return(cor(x[, 1], x[, 2], method = "pearson"))
  }
}

#===================== Load and Prepare Data ==========================
applewatch_data <- fread(file_name, data.table = F)

# Check and add missing columns if required
required_columns <- c("Heart", "Calories", "Steps", "Distance")
missing_columns <- setdiff(required_columns, colnames(applewatch_data))
if (length(missing_columns) > 0) {
  warning(paste("Missing columns:", paste(missing_columns, collapse = ", ")))
  applewatch_data[missing_columns] <- NA
}

# Impute missing values using linear interpolation
applewatch_data <- applewatch_data %>%
  mutate(
    Heart = na_interpolation(Heart, option = "linear"),
    Calories = if ("Calories" %in% colnames(applewatch_data)) na_interpolation(Calories, option = "linear") else NA,
    Steps = na_interpolation(Steps, option = "linear"),
    Distance = na_interpolation(Distance, option = "linear"),
    Applewatch.Heart_LE = Heart,
    Applewatch.Steps_LE = Steps,
    Applewatch.Distance_LE = Distance,
    Applewatch.Calories_LE = if ("Calories" %in% colnames(applewatch_data)) Calories else NA
  )

# Calculate additional engineered features
applewatch_data <- applewatch_data %>%
  mutate(
    EntropyApplewatchHeartPerDay_LE = -sum(table(Applewatch.Heart_LE) / length(Applewatch.Heart_LE) * 
                                             log2(table(Applewatch.Heart_LE) / length(Applewatch.Heart_LE))),
    EntropyApplewatchStepsPerDay_LE = -sum(table(Applewatch.Steps_LE) / length(Applewatch.Steps_LE) * 
                                             log2(table(Applewatch.Steps_LE) / length(Applewatch.Steps_LE))),
    RestingApplewatchHeartrate_LE = quantile(Applewatch.Heart_LE, 0.05, na.rm = TRUE),
    NormalizedApplewatchHeartrate_LE = Applewatch.Heart_LE - RestingApplewatchHeartrate_LE,
    ApplewatchIntensity_LE = NormalizedApplewatchHeartrate_LE / (220 - 40 - RestingApplewatchHeartrate_LE),
    SDNormalizedApplewatchHR_LE = rollapply(NormalizedApplewatchHeartrate_LE, width = 10, FUN = sd, by.column = FALSE, fill = NA),
    ApplewatchStepsXDistance_LE = Applewatch.Steps_LE * Applewatch.Distance_LE
  )

# Ensure the columns exist before applying rollapply()
if (!all(c("Applewatch.Heart_LE", "Applewatch.Steps_LE") %in% colnames(applewatch_data))) {
  stop("Required columns 'Applewatch.Heart_LE' or 'Applewatch.Steps_LE' are missing.")
}

# Parse 'DateTime' to extract 'day', handling parsing issues
applewatch_data$day <- tryCatch(
  day(lubridate::ymd_hms(applewatch_data$DateTime)),
  error = function(e) {
    warning("Error parsing DateTime; setting to NA.")
    return(NA)
  }
)

# Replace NAs in 'day' with a placeholder
applewatch_data$day[is.na(applewatch_data$day)] <- 1

# Apply rollapply to calculate correlation
applewatch_data$CorrelationApplewatchHeartrateSteps_LE <- rollapply(
  applewatch_data[, c("Applewatch.Heart_LE", "Applewatch.Steps_LE")], 
  width = 10, 
  FUN = function(x) correlation(x), 
  by.column = FALSE, 
  fill = NA
)

# Simplify imputation for CorrelationApplewatchHeartrateSteps_LE
applewatch_data$CorrelationApplewatchHeartrateSteps_LE <- na.fill(
  applewatch_data$CorrelationApplewatchHeartrateSteps_LE, fill = 0
)

# Reduce dataset size for testing (use 10% of data)
set.seed(123)
applewatch_data_sample <- sample_frac(applewatch_data, 0.1)

# Add other features
applewatch_data_sample <- applewatch_data_sample %>%
  mutate(
    ApplewatchStepsXDistance_LE = Applewatch.Steps_LE * Applewatch.Distance_LE,
    activity_trimmed = as.factor(sample(c("Low", "Medium", "High"), nrow(applewatch_data_sample), replace = TRUE))
  )

#===================== Prepare Data with Tidymodels ===================
# Convert to tibble
applewatch_data_sample <- as_tibble(applewatch_data_sample)

# Remove zero-variance columns from data before creating the recipe
zero_variance_cols <- nearZeroVar(applewatch_data_sample, saveMetrics = TRUE) %>%
  filter(zeroVar) %>%
  rownames()


# Ensure required columns are present after feature engineering
required_features <- c(
  "EntropyApplewatchHeartPerDay_LE", "EntropyApplewatchStepsPerDay_LE", 
  "RestingApplewatchHeartrate_LE", "Applewatch.Steps_LE", "Applewatch.Heart_LE",
  "Applewatch.Calories_LE", "Applewatch.Distance_LE"
)

# Exclude required features from zero-variance removal
zero_variance_cols <- setdiff(zero_variance_cols, required_features)

# Check for columns with missing values before processing
missing_cols_before <- colnames(applewatch_data_sample)[colSums(is.na(applewatch_data_sample)) > 0]
print(paste("Columns with missing values before processing:", paste(missing_cols_before, collapse = ", ")))



# Check if required features are present
missing_features <- setdiff(required_features, colnames(applewatch_data_sample))
if (length(missing_features) > 0) {
  stop(paste("The following required features are missing:", paste(missing_features, collapse = ", ")))
}

# Specify a simpler recipe for data preprocessing
available_predictors <- colnames(applewatch_data_sample)
applewatch_recipe <- recipe(activity_trimmed ~ ., data = applewatch_data_sample) %>%
  update_role(activity_trimmed, new_role = "outcome") %>%
  update_role(all_of(intersect(available_predictors, c(
    "Applewatch.Steps_LE", "Applewatch.Heart_LE", "Applewatch.Calories_LE",
    "Applewatch.Distance_LE", "EntropyApplewatchHeartPerDay_LE",
    "EntropyApplewatchStepsPerDay_LE", "RestingApplewatchHeartrate_LE",
    "CorrelationApplewatchHeartrateSteps_LE", "NormalizedApplewatchHeartrate_LE",
    "ApplewatchIntensity_LE", "SDNormalizedApplewatchHR_LE",
    "ApplewatchStepsXDistance_LE", "day"
  ))), new_role = "predictor") %>%
  step_rm(all_of(zero_variance_cols)) %>%  # Step 1: Remove zero-variance columns
  step_impute_median(all_numeric_predictors(), -all_outcomes()) %>%  # Step 2: Impute missing values
  step_naomit(all_predictors(), -all_outcomes()) %>%  # Step 3: Remove rows with remaining NAs
  step_normalize(all_numeric_predictors())  # Step 4: Normalize predictors

# Prepare the recipe
prepared_recipe <- prep(applewatch_recipe, training = applewatch_data_sample, verbose = TRUE)
print(prepared_recipe)  # Debugging check
applewatch_data_prepared <- bake(prepared_recipe, new_data = applewatch_data_sample)

# Check for missing values after baking
missing_cols_after <- colnames(applewatch_data_prepared)[colSums(is.na(applewatch_data_prepared)) > 0]
if (length(missing_cols_after) > 0) {
  stop(paste("There are still missing values in the prepared data for columns:", paste(missing_cols_after, collapse = ", ")))
} else {
  print("No missing values in the prepared data.")
}

# Save preprocessed data for reuse
write.csv(applewatch_data_prepared, paste0(main_path, "output/preprocessed_data.csv"), row.names = FALSE)

#====================== Train Model with Tidymodels ====================
# Define a basic Random Forest model
rf_model <- rand_forest(mode = "classification", mtry = 3, trees = 20) %>%
  set_engine("ranger")

# Create a workflow
rf_workflow <- workflow() %>%
  add_model(rf_model) %>%
  add_recipe(applewatch_recipe)

# Perform a simple train-test split to validate model
set.seed(123)
data_split <- initial_split(applewatch_data_prepared, prop = 0.8)
train_data <- training(data_split)
test_data <- testing(data_split)

#============ Parallel Processing ===============
library(doParallel)
cl <- makeCluster(detectCores() - 1)  # Use all but one core
registerDoParallel(cl)

# Fit the model on training data
rf_fit <- fit(rf_workflow, data = train_data)

stopCluster(cl)  # Stop the cluster after training

#================= Measure Execution Time and Memory ===================
start_time <- Sys.time()
start_mem <- pryr::mem_used()

# Make predictions on test data
predictions <- predict(rf_fit, test_data, type = "class") %>%
  bind_cols(test_data)

end_time <- Sys.time()
end_mem <- pryr::mem_used()

# Calculate accuracy
accuracy <- mean(predictions$.pred_class == predictions$activity_trimmed)
print(paste("Accuracy of the Tidymodels model:", accuracy))

# Print execution time and memory usage for predictions
execution_time <- end_time - start_time
memory_used <- end_mem - start_mem
print(paste("Execution time for predictions:", execution_time))
print(paste("Memory used for predictions:", memory_used, "bytes"))

# Reorder columns to match the original output
output_columns <- c(
  'day', 'Applewatch.Steps_LE', 'Applewatch.Heart_LE', 'Applewatch.Calories_LE',
  'Applewatch.Distance_LE', 'EntropyApplewatchHeartPerDay_LE', 
  'EntropyApplewatchStepsPerDay_LE', 'RestingApplewatchHeartrate_LE',
  'CorrelationApplewatchHeartrateSteps_LE', 'NormalizedApplewatchHeartrate_LE',
  'ApplewatchIntensity_LE', 'SDNormalizedApplewatchHR_LE', 
  'ApplewatchStepsXDistance_LE', 'activity_trimmed'
)

# Ensure all columns are present in the predictions
predictions <- predictions %>% select(all_of(output_columns))

#======================= Save Model and Predictions ============================
output_file <- paste0(main_path, "output/applewatch_data_predicted_TinyModels.csv")
if (file.access(dirname(output_file), 2) == 0) {
  write.csv(predictions, output_file, row.names = FALSE)
} else {
  warning("Permission denied: Unable to save predictions. Check the output directory permissions.")
}

# Extract the fitted model from the workflow
fitted_rf_model <- extract_fit_parsnip(rf_fit)

# Save the fitted model using saveRDS
model_file <- paste0(model_path, "Tidymodels_RFModel_AppleWatch.rds")
if (file.access(dirname(model_file), 2) == 0) {
  saveRDS(fitted_rf_model, file = model_file)
} else {
  warning("Permission denied: Unable to save the model. Check the model directory permissions.")
}

# Final message indicating completion
print("Model training and prediction process completed successfully!")
