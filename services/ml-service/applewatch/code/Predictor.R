#====================== Apple Watch Data Predictor with Tidymodels ======================

# Programmed by Arastoo Bozorgi & Glenn Tanjoh
# Email: glenntanjoh@gmail.com
# Email: ab1502@mun.ca
#=======================================================================

# Clears the environment to start fresh
#rm(list = ls())

#======================== Load Required Libraries ======================

# Explicitly load the parallel package
library(parallel)

# Installs and loads required libraries with 'pacman' for better dependency management
required_pkgs <- c("imputeTS", "lubridate", "data.table", "dplyr", "yardstick", "vip", "tidymodels", 
                   "pryr", "ranger", "caret", "doParallel", "zoo")

new_pkgs <- required_pkgs[!(required_pkgs %in% installed.packages()[,"Package"])]

if (length(new_pkgs)) install.packages(new_pkgs)

pacman::p_load(char = required_pkgs)



#======================= Set Up Parallel Backend ======================
# Detects the number of available cores and sets up a parallel backend
num_cores <- detectCores() - 1  # Leave one core free to keep system responsive
cl <- makeCluster(num_cores)
registerDoParallel(cl)

#======================= Set Time Zone & Arguments =====================

# Sets timezone for all operations and checks argument requirements
Sys.setenv(TZ = "America/St_Johns")

args <- c(
file.path("C:", "Users", "glenn", "Desktop", "Walkabilly", "BeapEngine2024", "services"),
file.path("C:", "Users", "glenn", "Desktop", "Walkabilly", "BeapEngine2024", "services", "ml-service", "SavedModels"),
file.path("C:", "Users", "glenn", "Desktop", "Walkabilly", "BeapEngine2024", "services", "ml-service", "aggregated_fitbit_applewatch_jaeger.csv"),
file.path("C:", "Users", "glenn", "Desktop", "Walkabilly", "BeapEngine2024", "services", "ml-service", "applewatch", "data", "applewatch_data.csv"),
"randomForest"
)

# Parse command-line arguments
# args <- commandArgs(trailingOnly = TRUE)

# Verifies that required arguments are provided
if (length(args) != 5) {
  stop("Five arguments must be supplied: main path, model path, training file, data file, model type.", call. = FALSE)
}


main_path <- args[1]
model_path <- args[2]
training_file <- args[3]
file_name <- args[4]
model <- args[5]

# Check paths for validity
if (!dir.exists(main_path) || !dir.exists(model_path)) {
  stop("Error: Main path or model path does not exist.")
}
if (!file.exists(training_file) || !file.exists(file_name)) {
  stop("Error: Training file or data file does not exist.")
}

#===================== Utility Function for Correlation ===========================

# Computes Pearson correlation, returning NA if there's zero variance in either column
correlation <- function(x) {
  if (!is.data.frame(x) || ncol(x) != 2) {
    stop("Error: Input must be a data frame with exactly two numeric columns.")
  }
  
  if (any(is.na(x))) {
    return(NA)  # Avoid computing correlation with missing values
  }
  
  if (sd(x[, 1]) == 0 || sd(x[, 2]) == 0) {
    return(NA) # Return NA if standard deviation is zero to avoid divide-by-zero error
  }
  
  return(cor(x[, 1], x[, 2], method = "pearson"))
}


#===================== Load and Prepare Data ==========================

# Check if the file exists before loading
if (!file.exists(file_name)) {
  stop(paste("Error: File not found at specified path:", file_name))
} else {
  applewatch_data <- fread(file_name, na.strings = c("", "NA"))
  message("Data loaded successfully.")
}

# Make a copy of the data.table to avoid internal self-reference issues
applewatch_data <- data.table::copy(applewatch_data)

# Define required columns
required_columns <- c("Heart", "Calories", "Steps", "Distance")

# Check if all required columns are present in the data
missing_columns <- setdiff(required_columns, names(applewatch_data))
if (length(missing_columns) > 0) {
  stop(paste("Error: The following required columns are missing from the dataset:", 
             paste(missing_columns, collapse = ", ")))
} else {
  message("All required columns are present.")
}

# Check if required columns are numeric
non_numeric_cols <- required_columns[sapply(applewatch_data[, ..required_columns], function(col) !is.numeric(col))]
if (length(non_numeric_cols) > 0) {
  stop(paste("Error: The following columns are not numeric:", paste(non_numeric_cols, collapse = ", ")))
} else {
  message("All required columns are numeric.")
}


# Applies interpolation directly to specified columns with imputeTS in-place to handle missing values
#cat("Checking for missing values before interpolation...\n")
to_impute <- c("Heart", "Calories", "Steps", "Distance")

# Check for missing values before interpolation
# na_counts_before <- colSums(is.na(applewatch_data[, ..to_impute]))
# print(na_counts_before)

# Apply interpolation
# cat("Applying linear interpolation on specified columns...\n")
for (col in to_impute) {
  applewatch_data[[col]] <- imputeTS::na_interpolation(applewatch_data[[col]], option = "linear")
}

# Check for NAs in key columns after interpolation
na_columns <- required_columns[sapply(applewatch_data[, ..required_columns], function(col) any(is.na(col)))]
if (length(na_columns) > 0) {
  stop(paste("Error: NA values found in columns after interpolation:", paste(na_columns, collapse = ", ")))
} else {
  message("No NA values in required columns.")
}

# Check for missing values after interpolation
# na_counts_after <- sapply(applewatch_data[, ..to_impute], function(col) sum(is.na(col)))
# print(na_counts_after)

# Verify that all missing values were handled
# if (any(na_counts_after > 0)) {
#  warning("Warning: Some columns still contain NA values after interpolation.")
# } else {
#   message("No NA values remaining in required columns after interpolation.")
# }

# Add Heart_bin for stratification or analysis
set(applewatch_data, j = "Heart_bin", value = cut(applewatch_data$Heart, breaks = 5))
# print(prop.table(table(applewatch_data$Heart_bin)))


#====================== Feature Engineering ============================
# Efficient calculation of entropy, resting heart rate, normalized heart rate, and others in-place

# Use := for each column to avoid .internal.selfref issues in data.table
# Group by date (extracting date from DateTime)

# Calculate entropy per day
applewatch_data[, EntropyApplewatchHeartPerDay_LE := -sum(prop.table(table(Heart)) * log2(prop.table(table(Heart)))), 
                by = .(Date = as.Date(DateTime))]
applewatch_data[, EntropyApplewatchStepsPerDay_LE := -sum(prop.table(table(Steps)) * log2(prop.table(table(Steps)))), 
                by = .(Date = as.Date(DateTime))]



#==================== Initial Feature Engineering (Before Split) ====================
# Compute initial features required in later calculations
# Calculate resting heart rate and normalized heart rate
applewatch_data[, RestingHR := quantile(Heart, 0.05, na.rm = TRUE)]
applewatch_data[, NormalizedHR := Heart - RestingHR]


# Computes rolling standard deviation and other engineered features
applewatch_data[, SDNormalizedApplewatchHR_LE := zoo::rollapply(NormalizedHR, width = 10, FUN = sd, fill = NA, align = "right")]
applewatch_data[, ApplewatchStepsXDistance_LE := Steps * Distance]
applewatch_data[, Heart_RollMean := zoo::rollmean(Heart, k = 5, fill = NA, align = "right")]
applewatch_data[, Steps_RollMean := zoo::rollmean(Steps, k = 5, fill = NA, align = "right")]
applewatch_data[, Heart_Lag1 := shift(Heart, type = "lag")]
applewatch_data[, Steps_Lag1 := shift(Steps, type = "lag")]
applewatch_data[, Heart_RateOfChange := c(NA, diff(Heart))]


#==================== Activity Level Labeling ==========================
# Creates activity_trimmed column based on Steps thresholds
applewatch_data[, activity_trimmed := fifelse(Steps < 60, "Sedentary",
                                              fifelse(Steps >= 60 & Steps < 100, "Moderate",
                                                      fifelse(Steps >= 100, "Vigorous", NA_character_)))]

# Drops rows with NA in activity_trimmed
applewatch_data <- applewatch_data[!is.na(activity_trimmed)]
applewatch_data[, activity_trimmed := as.factor(activity_trimmed)]

# Remove 'activity' column if present
if ("activity" %in% colnames(applewatch_data)) {
  applewatch_data <- applewatch_data[, !("activity")]
  message("'activity' column detected and removed from predictors.")
} else {
  message("'activity' column not found among predictors. Proceeding...")
}


#===================== Model and Tuning Setup ==========================
set.seed(123)
data_split <- initial_split(applewatch_data, prop = 0.8, strata = "Steps")
train_data <- training(data_split)
test_data <- testing(data_split)

# Ensure DateTime is POSIXct
if ("DateTime" %in% names(train_data)) {
  train_data[, DateTime := as.POSIXct(DateTime, tz = "America/St_Johns", origin = "1970-01-01")]
} else {
  warning("DateTime column not found in train_data.")
}

if ("DateTime" %in% names(test_data)) {
  test_data[, DateTime := as.POSIXct(DateTime, tz = "America/St_Johns", origin = "1970-01-01")]
} else {
  warning("DateTime column not found in test_data.")
}



#==================== Apply Feature Engineering (AFTER Splitting) ====================
# print(str(train_data$DateTime))  # Should return 'POSIXct' NOT 'double'
# print(str(test_data$DateTime))   # Should return 'POSIXct'
# print(summary(train_data$DateTime))


feature_engineering <- function(data) {
  # Ensure DateTime is properly formatted
  if ("DateTime" %in% names(data)) {
    if (!inherits(data$DateTime, "POSIXct")) {
      data[, DateTime := as.POSIXct(DateTime, origin = "1970-01-01", tz = "America/St_Johns")]
    }
    print(str(data$DateTime))  # Check type after conversion
    data[, date_col := as.Date(DateTime)]
  } else {
    warning("Warning: `DateTime` column is missing. Features requiring it may fail.")
  }
  
  # Print check for debugging using the local temporary date column
  if ("date_col" %in% names(data)) {
    print(head(data$date_col))  # Should show dates, not NULL
    print(class(data$date_col)) # Should return "Date"
  }
  
  
  
  # Calculate resting heart rate per day
  data[, RestingHR := quantile(Heart, 0.05, na.rm = TRUE), by = date_col]
  data[, RestingHR := ifelse(is.na(RestingHR), median(RestingHR, na.rm = TRUE), RestingHR)]
  data[, NormalizedHR := Heart - RestingHR]
  data[, NormalizedHR := ifelse(is.na(NormalizedHR), 0, NormalizedHR)]
  
  
  # Compute rolling standard deviation safely
  data[, SDNormalizedApplewatchHR_LE := zoo::rollapply(NormalizedHR, width = 10, FUN = sd, fill = NA, align = "right")]
  data[, SDNormalizedApplewatchHR_LE := ifelse(is.na(SDNormalizedApplewatchHR_LE), 0, SDNormalizedApplewatchHR_LE)]  # Impute NA
  
  # Compute rolling means safely
  data[, Heart_RollMean := zoo::rollmean(Heart, k = 5, fill = NA, align = "right")]
  data[, Steps_RollMean := zoo::rollmean(Steps, k = 5, fill = NA, align = "right")]
  data[, Heart_RollMean := ifelse(is.na(Heart_RollMean), median(Heart, na.rm = TRUE), Heart_RollMean)]
  data[, Steps_RollMean := ifelse(is.na(Steps_RollMean), median(Steps, na.rm = TRUE), Steps_RollMean)]
  
  
  
  # Calculate entropy per day
  data[, EntropyApplewatchHeartPerDay_LE := {
    h_table <- table(Heart)
    probs <- prop.table(h_table)
    -sum(probs * log2(probs))
  }, by = date_col]
  
  data[, EntropyApplewatchStepsPerDay_LE := {
    s_table <- table(Steps)
    probs <- prop.table(s_table)
    -sum(probs * log2(probs))
  }, by = date_col]
  
  
  # Fill NA values in entropy calculations
  data[, EntropyApplewatchHeartPerDay_LE := ifelse(is.na(EntropyApplewatchHeartPerDay_LE), 0, EntropyApplewatchHeartPerDay_LE)]
  data[, EntropyApplewatchStepsPerDay_LE := ifelse(is.na(EntropyApplewatchStepsPerDay_LE), 0, EntropyApplewatchStepsPerDay_LE)]
  
  
  # Other features (remove StepsXDistance if Distance is unreliable)
  data[, Intensity := ifelse((220 - 40 - RestingHR) > 0, NormalizedHR / (220 - 40 - RestingHR), NA_real_)]
  
  # Handle missing values in Distance using mean imputation
  if ("Distance" %in% names(data)) {
    data[, Distance := ifelse(is.na(Distance), mean(Distance, na.rm = TRUE), Distance)]
  }
  
  
  # Only create StepsXDistance if Distance is kept and imputed
  if ("Distance" %in% names(data)) {
    data[, StepsXDistance := Steps * Distance]
  }
  
  
  # Remove temporary date column
  data[, date_col := NULL]
  
  data
}


train_data <- feature_engineering(copy(train_data))
test_data <- feature_engineering(copy(test_data))

# Debugging: Check columns after feature engineering
# print("Columns in train_data after feature engineering:")
# print(colnames(train_data))
# print("Columns in test_data after feature engineering:")
# print(colnames(test_data))

# Explicitly re-convert DateTime to POSIXct again in case it got altered
train_data[, DateTime := as.POSIXct(DateTime, tz = "America/St_Johns", origin = "1970-01-01")]
test_data[, DateTime := as.POSIXct(DateTime, tz = "America/St_Johns", origin = "1970-01-01")]

print(str(train_data$DateTime))  # Should return 'POSIXct'
print(str(test_data$DateTime))   # Should return 'POSIXct'


# print("Missing values after feature engineering:")
# print(colSums(is.na(train_data)))



# After feature engineering and splitting into train_data and test_data
unwanted_vars <- c("Steps", "Steps_RollMean", "Steps_Lag1", "StepsXDistance", 
                   "ApplewatchStepsXDistance_LE", "EntropyApplewatchStepsPerDay_LE")

train_data <- train_data[, !unwanted_vars, with = FALSE]
test_data <- test_data[, !unwanted_vars, with = FALSE]

# Debugging: Check columns after removing unwanted variables
# print("Columns in train_data after removing unwanted variables:")
# print(colnames(train_data))
# print("Columns in test_data after removing unwanted variables:")
# print(colnames(test_data))


#===================== Tidymodels Recipe ===========================
applewatch_recipe <- recipe(activity_trimmed ~ ., data = train_data) %>%
  update_role(DateTime, new_role = "ID") %>%
  step_zv(all_predictors()) %>%
  step_naomit(all_predictors()) %>%
  step_normalize(all_numeric_predictors())


#Check if all required columns exist before calling prep()
required_features <- c("EntropyApplewatchHeartPerDay_LE", "RestingHR")

# Debugging: Check available columns before the required features check
# print("Columns in train_data before required features check:")
# print(colnames(train_data))

missing_features <- setdiff(required_features, colnames(train_data))
if (length(missing_features) > 0) {
  stop(glue::glue("Error: Missing required features: {paste(missing_features, collapse = ', ')}"))
}

# Prepares the recipe for processing and applies to data
prepared_recipe <- prep(applewatch_recipe, training = train_data, verbose = TRUE)

# Apply the transformations (bake) separately to training and testing data
train_data_prepared <- bake(prepared_recipe, new_data = train_data)
test_data_prepared <- bake(prepared_recipe, new_data = test_data)

# Debugging: Check columns in prepared data
# print("Columns in train_data_prepared after baking:")
# print(colnames(train_data_prepared))
# print("Columns in test_data_prepared after baking:")
# print(colnames(test_data_prepared))

# Explicitly ensure that DateTime is POSIXct after baking
if ("DateTime" %in% names(test_data_prepared)) {
  test_data_prepared$DateTime <- as.POSIXct(test_data_prepared$DateTime, 
                                            tz = "America/St_Johns", 
                                            origin = "1970-01-01")
}

# cat("Total missing values in test_data_prepared:", sum(is.na(test_data_prepared)))
test_data_prepared <- test_data_prepared %>%
  mutate(across(where(is.numeric), ~ ifelse(is.na(.), median(., na.rm = TRUE), .)))
# cat("Total missing values in test_data_prepared after removal:", sum(is.na(test_data_prepared)))


# Define the random forest model with tunable parameters
rf_model <- rand_forest(
  mode = "classification",
  mtry = tune(),
  min_n = tune(),
  trees = 500
) %>%
  set_engine("ranger", num.threads = 1, importance = "impurity")

rf_workflow <- workflow() %>%
  add_model(rf_model) %>%
  add_recipe(applewatch_recipe)


# Define the file path to save/load the model
model_file <- file.path(model_path, "Tidymodels_RFModel_AppleWatch.rds")


if (file.exists(model_file)){
  message("Loading saved model...")
  final_rf_fit <- readRDS(model_file)
} else {
  message("Training Model. This may take a while...")
  
  #===================== Hyperparameter Tuning ============================
  set.seed(123)
  applewatch_folds <- vfold_cv(train_data_prepared, v = 5)
  
  library(dials)
  mtry_range <- mtry(c(2, 10))
  min_n_range <- min_n(c(1, 20))
  rf_grid <- grid_space_filling(mtry_range, min_n_range, size = 50)
  
  
  rf_result <- rf_workflow %>%
    tune_grid(
      resamples = applewatch_folds,
      grid = rf_grid,  # Changed from grid = 20
      control = control_grid(save_pred = TRUE, verbose = TRUE),
      metrics = metric_set(roc_auc, accuracy, spec)
    )
  
  autoplot(rf_result)
  
  predictions <- rf_result %>% collect_predictions()
  
  rf_best <- rf_result %>% select_best(metric = "accuracy")
  
  #===================== Finalize Model ================================
  final_rf_model <- finalize_model(rf_model, rf_best)
  
  final_rf_workflow <- workflow() %>%
    add_model(final_rf_model) %>%
    add_recipe(applewatch_recipe)
  
  #================= Training and Evaluation on Test Data ===============
  final_rf_fit <- final_rf_workflow %>% fit(data = train_data_prepared)
  
  # Save the fitted model using saveRDS
  saveRDS(final_rf_fit, file = model_file)
  if (file.exists(model_file)) {
    message("Model saved successfully at:", model_file)
  } else {
    stop("Error: Model file was not saved.")
  }
}


#================= Measure Execution Time and Memory ===================

# Measures and prints execution time and memory usage for predictions
start_time <- Sys.time()
start_mem <- pryr::mem_used()

# Predictions and evaluation on test data
test_predictions <- predict(final_rf_fit, test_data_prepared, type = "class") %>%
  bind_cols(test_data_prepared)


# Compute accuracy and ROC AUC
final_metrics <- test_predictions %>%
  yardstick::metrics(truth = activity_trimmed, estimate = .pred_class)

print(final_metrics)


end_time <- Sys.time()
end_mem <- pryr::mem_used()

# Calculate accuracy
accuracy <- yardstick::accuracy(test_predictions, truth = activity_trimmed, estimate = .pred_class)
print(paste("Final model accuracy on test data:", accuracy$.estimate))

# Print execution time for predictions
execution_time <- end_time - start_time
print(paste("Execution time for predictions:", execution_time))

# Print memory usage for predictions
memory_used <- end_mem - start_mem
memory_used_MB <- memory_used / (1024^2)  # Convert to MB
print(paste("Memory used for predictions:", round(memory_used_MB, 2), "MB"))


#================= Feature Importance ====================
# Save feature importance plot to a file
vip_plot <- vip::vip(final_rf_fit$fit$fit)
output_dir <- file.path(main_path, "ml-service", "applewatch", "data", "output")
ggsave(file.path(output_dir, "feature_importance.png"), vip_plot)

#======================= Save Model and Predictions ============================
# Define output directory and ensure it exists
output_dir <- file.path(main_path, "ml-service", "applewatch", "data", "output")
if (!dir.exists(output_dir)) {
  dir.create(output_dir, recursive = TRUE)  # Create directory if it doesn’t exist
}

# Check if the directory for saving output exists
if (!dir.exists(dirname(output_file))) {
  stop(paste("Error: The specified directory does not exist:", dirname(output_file)))
} else {
  # If the directory exists, proceed with saving the file
  write.csv(predictions, output_file, row.names = FALSE)
  message("Predictions saved successfully.")
}



# Stop the cluster after training is complete
stopCluster(cl)
registerDoSEQ()  # Return to sequential processing
print("Model training and prediction process completed successfully!")
