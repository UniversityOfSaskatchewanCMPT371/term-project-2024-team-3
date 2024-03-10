#
# Developed by Arastoo Bozorgi (ab1502@mun.ca)
# 

# ====================== libraries ============================
list.of.packages <-
  c("imputeTS",
    "lubridate",
    "data.table",
    "dplyr",
    "tidyverse",
    "tm",
    "mice",
    "zoo",
    "mlbench",
    "randomForest",
    "e1071",
    "stats",
    "caret",
    "rpart",
    "RWeka",
    "here",
    "rJava")

new.packages <-
  list.of.packages[!(list.of.packages %in% installed.packages()[, "Package"])]
if (length(new.packages))
  install.packages(new.packages)

library(imputeTS)
library(data.table)
library(dplyr)
library(lubridate)
library(tidyverse)
library(tm)
library(mice)
library(zoo)
library(mlbench)
library(randomForest)
library(e1071)
library(stats)
library(caret)
library(rpart)
library(RWeka)
library(here)
library(rJava)

# Get the current path
path <- paste0(here(), "/")
setwd(path)


# Reading the generated data
aggregated_data <- fread(paste0(path, "aggregated_fitbit_applewatch_jaeger.csv"), data.table = F)[ ,-1]

#========================= Decission Tree============================
# required columns for the models
x_columns_AW <- c(
  "Applewatch.Steps_LE",
  "Applewatch.Heart_LE",
  "Applewatch.Calories_LE",
  "Applewatch.Distance_LE",
  "EntropyApplewatchHeartPerDay_LE",
  "EntropyApplewatchStepsPerDay_LE",
  "RestingApplewatchHeartrate_LE",
  "CorrelationApplewatchHeartrateSteps_LE",
  "NormalizedApplewatchHeartrate_LE",
  "ApplewatchIntensity_LE",
  "SDNormalizedApplewatchHR_LE",
  "ApplewatchStepsXDistance_LE",
  "activity_trimmed"
)

x_columns_FB <- c(
  "Fitbit.Steps_LE",
  "Fitbit.Heart_LE",
  "Fitbit.Calories_LE",
  "Fitbit.Distance_LE",
  "EntropyFitbitHeartPerDay_LE",
  "EntropyFitbitStepsPerDay_LE",
  "RestingFitbitHeartrate_LE",
  "CorrelationFitbitHeartrateSteps_LE",
  "NormalizedFitbitHeartrate_LE",
  "FitbitIntensity_LE",
  "SDNormalizedFitbitHR_LE",
  "FitbitStepsXDistance_LE",
  "activity_trimmed"
)

# generating the Decision tree models
#y <- aggregated_data$activity_trimmed

x <- aggregated_data %>% select(x_columns_AW)
x$activity_trimmed <- as.factor(x$activity_trimmed)
dtModel_aw <- rpart(activity_trimmed ~ ., x)


x <- aggregated_data %>% select(x_columns_FB)
x$activity_trimmed <- as.factor(x$activity_trimmed)
dtModel_fb <- rpart(activity_trimmed ~ ., x)

# save the models
saveRDS(dtModel_aw, paste0(path, "SavedModels/DecissionTreeModel_AppleWatch.rds"))
saveRDS(dtModel_fb, paste0(path, "SavedModels/DecissionTreeModel_Fitbit.rds"))


#========================= Random Forest and SVM ============================

x_columns_AW <- c(
  "Applewatch.Steps_LE",
  "Applewatch.Heart_LE",
  "Applewatch.Calories_LE",
  "Applewatch.Distance_LE",
  "EntropyApplewatchHeartPerDay_LE",
  "EntropyApplewatchStepsPerDay_LE",
  "RestingApplewatchHeartrate_LE",
  "CorrelationApplewatchHeartrateSteps_LE",
  "NormalizedApplewatchHeartrate_LE",
  "ApplewatchIntensity_LE",
  "SDNormalizedApplewatchHR_LE",
  "ApplewatchStepsXDistance_LE"
)

x_columns_FB <- c(
  "Fitbit.Steps_LE",
  "Fitbit.Heart_LE",
  "Fitbit.Calories_LE",
  "Fitbit.Distance_LE",
  "EntropyFitbitHeartPerDay_LE",
  "EntropyFitbitStepsPerDay_LE",
  "RestingFitbitHeartrate_LE",
  "CorrelationFitbitHeartrateSteps_LE",
  "NormalizedFitbitHeartrate_LE",
  "FitbitIntensity_LE",
  "SDNormalizedFitbitHR_LE",
  "FitbitStepsXDistance_LE"
)

x <- aggregated_data %>% select(x_columns_AW)
idx <- which(is.na(x), arr.ind = T)[, 1]
x <- x[-idx, ]
y <- as.factor(aggregated_data$activity_trimmed[-idx])

rfModel_aw <- randomForest(x, y, ntree = 500)
svmModel_aw <- svm(x, y)


x <- aggregated_data %>% select(x_columns_FB)
idx <- which(is.na(x), arr.ind = T)[, 1]
x <- x[-idx, ]
y <- as.factor(aggregated_data$activity_trimmed[-idx])

rfModel_fb <- randomForest(x, y, ntree = 500)
svmModel_fb <- svm(x, y)

# save the models
saveRDS(rfModel_aw, paste0(path, "SavedModels/RandomForestModel_AppleWatch.rds"))
saveRDS(svmModel_aw, paste0(path, "SavedModels/SVMModel_AppleWatch.rds"))

saveRDS(rfModel_fb, paste0(path, "SavedModels/RandomForestModel_Fitbit.rds"))
saveRDS(svmModel_fb, paste0(path, "SavedModels/SVMModel_Fitbit.rds"))

#========================= Rotation Forest ============================
# required columns for the models
x_columns_AW <- c(
  "Applewatch.Steps_LE",
  "Applewatch.Heart_LE",
  "Applewatch.Calories_LE",
  "Applewatch.Distance_LE",
  "EntropyApplewatchHeartPerDay_LE",
  "EntropyApplewatchStepsPerDay_LE",
  "RestingApplewatchHeartrate_LE",
  "CorrelationApplewatchHeartrateSteps_LE",
  "NormalizedApplewatchHeartrate_LE",
  "ApplewatchIntensity_LE",
  "SDNormalizedApplewatchHR_LE",
  "ApplewatchStepsXDistance_LE",
  "activity_trimmed"
)

x_columns_FB <- c(
  "Fitbit.Steps_LE",
  "Fitbit.Heart_LE",
  "Fitbit.Calories_LE",
  "Fitbit.Distance_LE",
  "EntropyFitbitHeartPerDay_LE",
  "EntropyFitbitStepsPerDay_LE",
  "RestingFitbitHeartrate_LE",
  "CorrelationFitbitHeartrateSteps_LE",
  "NormalizedFitbitHeartrate_LE",
  "FitbitIntensity_LE",
  "SDNormalizedFitbitHR_LE",
  "FitbitStepsXDistance_LE",
  "activity_trimmed"
)


#load the RotationForest package as it's not from the default weka packages (note that the package should be installed before on weka using weka package manager)
WPM("load-package", "RotationForest")

# load the RotationForest classifier using RWeka
rotation_forest <- make_Weka_classifier("weka/classifiers/meta/RotationForest")

y <- aggregated_data$activity_trimmed

x <- aggregated_data %>% select(x_columns_AW)
x$activity_trimmed <- as.factor(x$activity_trimmed)

# generate the RotationForest model for apple watch
rotationForestModel_aw <- rotation_forest(activity_trimmed ~ ., x)
.jcache(rotationForestModel_aw$classifier)

# save the model
save(rotationForestModel_aw, file = paste0(path, "SavedModels/RotationForestModel_AppleWatch.rda"))

x <- aggregated_data %>% select(x_columns_FB)
x$activity_trimmed <- as.factor(x$activity_trimmed)

# generate the RotationForest model for fitbit
rotationForestModel_fb <- rotation_forest(activity_trimmed ~ ., x)
.jcache(rotationForestModel_fb$classifier)

# save the models
save(rotationForestModel_fb, file = paste0(path, "SavedModels/RotationForestModel_Fitbit.rds"))








