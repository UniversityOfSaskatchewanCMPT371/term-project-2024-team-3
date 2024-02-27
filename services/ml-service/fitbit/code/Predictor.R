# Programmed by Arastoo Bozorgi
# ab1502@mun.ca


rm(list = ls())
#========================Libraries=========================
list.of.packages <-
  c("imputeTS",
    "lubridate",
    "data.table",
    "dplyr",
    "tm",
    "mice",
    "zoo",
    "mlbench",
    "randomForest",
    "e1071",
    "stats",
    "caret",
    "rpart",
    "RWeka")

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


#=========================Functions========================
correlation <- function(x) {
  val = cor(x[, 1], x[, 2], method = "pearson")
  return(val)
}
#=========================================================
# OS <- Sys.info()
# if (OS["sysname"] == "Windows") {
#   path <- "/Users/dfuller/Desktop/Arastoo/Spring/RCodeForBeapEngine/fitbit/data/"
#   model_path <- "/Users/dfuller/Desktop/Arastoo/Spring/RCodeForBeapEngine/SavedModels/"
# } else {
#   path <- "/Users/dfuller/Desktop/Arastoo/Spring/RCodeForBeapEngine/fitbit/data/"
#   model_path <- "/Users/dfuller/Desktop/Arastoo/Spring/RCodeForBeapEngine/SavedModels/"
# }
# setwd(path)

#Timezone
timeZone <- "America/St_Johns"
Sys.setenv(TZ = timeZone)

#!/usr/bin/env Rscript
args = commandArgs(trailingOnly=TRUE)

# test if there is at least one argument: if not, return an error
if (length(args) != 5) {
  stop("At least one argument must be supplied (input file).n", call.=FALSE)
} else {
  
  main_path <- args[1]
  model_path <- args[2]
  trainging_file <- args[3]
  file_name <- args[4]
  model <- args[5]
  
  # main_path <- "/home/arastoo/Desktop/Files/Walkabilly/BEAPLab/RCodeForBeapEngine/fitbit/data/"
  # model_path <- "/home/arastoo/Desktop/Files/Walkabilly/BEAPLab/RCodeForBeapEngine/SavedModels/"
  # trainging_file <- "/home/arastoo/Desktop/Files/Walkabilly/BEAPLab/RCodeForBeapEngine/aggregated_fitbit_applewatch_jaeger.csv"
  # file_name <- "/home/arastoo/Desktop/Files/Walkabilly/BEAPLab/RCodeForBeapEngine/fitbit/data/raw/183/fitbit_data.csv"
  # model <- "svm"
  
  fitbit_data <- fread(paste0(file_name), data.table = F)
  
  # keep the uninterpolated HR data for fitbit in another column
  fitbit_data$Fitbit.Heart_LE <- fitbit_data$Heart
  
  # keep the uninterpolated Calories data for fitbit in another column
  fitbit_data$Fitbit.Calories_LE <- fitbit_data$Calories
  
  # keep the uninterpolated Steps data for fitbit in another column
  fitbit_data$Fitbit.Steps_LE <- fitbit_data$Steps
  
  # keep the uninterpolated Distance data for fitbit in another column
  fitbit_data$Fitbit.Distance_LE <- fitbit_data$Distance
  
  
  # linear interpolation on fitbit data 
  fitbit_data$Fitbit.Heart_LE <- na.interpolation(fitbit_data$Fitbit.Heart_LE, option = "linear")
  fitbit_data$Fitbit.Calories_LE <- na.interpolation(fitbit_data$Fitbit.Calories_LE, option = "linear")
  fitbit_data$Fitbit.Steps_LE <- na.interpolation(fitbit_data$Fitbit.Steps_LE, option = "linear")
  fitbit_data$Fitbit.Distance_LE <- na.interpolation(fitbit_data$Fitbit.Distance_LE, option = "linear")
  
  
  
  #===================================Generating features===============================================
  fitbit_data$time <-
    ymd_hms(fitbit_data$DateTime)
  fitbit_data$day <-
    day(fitbit_data$time)
  fitbit_data$hour <-
    hour(fitbit_data$time)
  fitbit_data$minute <-
    minute(fitbit_data$time)
  
  
  #Generate entropy of heartrate and steps per day, and resting hearrate
  fitbit_data <- fitbit_data %>%
    group_by(day) %>%
    mutate(EntropyFitbitHeartPerDay_LE = rep(-sum(table(Fitbit.Heart_LE)/length(Fitbit.Heart_LE) * log2(table(Fitbit.Heart_LE)/length(Fitbit.Heart_LE))), length(Fitbit.Heart_LE)),
           EntropyFitbitStepsPerDay_LE = rep(-sum(table(Fitbit.Steps_LE)/length(Fitbit.Steps_LE) * log2(table(Fitbit.Steps_LE)/length(Fitbit.Steps_LE))), length(Fitbit.Heart_LE)),
           RestingFitbitHeartrate_LE = rep(quantile(Fitbit.Heart_LE, c(0.05), type = 1, na.rm = T), length(Fitbit.Heart_LE))
    )
  
  #Generate labels based on Todur Locke paper
  fitbit_data <- fitbit_data %>% 
    mutate(
      TodurLockeLabels_LE = case_when(
          Fitbit.Steps_LE < 60 ~ "Sedentary",
          Fitbit.Steps_LE >= 60 && Fitbit.Steps_LE < 100 ~ "Moderate",
          Fitbit.Steps_LE >= 100 ~ "Vigorous"
        )
    )
  
  
  # fitbit_data$TodurLockeLabels_LE <-
  #   dplyr::recode(
  #     fitbit_data$Fitbit.Steps_LE,
  #     "lo:60='Sedentary';
  #   60:100='Moderate';
  #   100:hi='Vigorous';",
  #     as.factor = TRUE
  #   )
  
  
  out <- rollapply(fitbit_data[, c("Fitbit.Heart_LE", "Fitbit.Steps_LE")], width = 10, FUN = correlation, by.column = FALSE, fill = TRUE)
  fitbit_data[1:(1+length(out)-1), "CorrelationFitbitHeartrateSteps_LE"] <- out
  
  
  
  #Normalized HR
  fitbit_data$NormalizedFitbitHeartrate_LE = fitbit_data$Fitbit.Heart_LE - fitbit_data$RestingFitbitHeartrate_LE
  
  #*********************************there is no age here?????????????????????
  # #Karvonen formula to calculate Intensity
  #fitbit_data$NormalizedFitbitHeartrate_LE <- fitbit_data$NormalizedFitbitHeartrate_LE / (220 - fitbit_data$age - fitbit_data$RestingFitbitHeartrate_LE)
  fitbit_data$FitbitIntensity_LE <- fitbit_data$NormalizedFitbitHeartrate_LE / (220 - 40 -  fitbit_data$RestingFitbitHeartrate_LE)
  
  
  #SD of HR normalized HR
  fitbit_data$SDNormalizedFitbitHR_LE <- rollapply(fitbit_data[, "NormalizedFitbitHeartrate_LE"], width = 10, FUN = sd , by.column = FALSE, fill = TRUE)
  
  #Steps multiply by distance
  fitbit_data$FitbitStepsXDistance_LE <- fitbit_data$Fitbit.Steps_LE * fitbit_data$Fitbit.Distance_LE
  
  
  
  
  
  
  if (model == "decissionTree") {
    loaded_Model <- readRDS(paste0(model_path, "/DecissionTreeModel_Fitbit.rds"))
  }
  
  if (model == "svm") {
    loaded_Model <- readRDS(paste0(model_path, "/SVMModel_Fitbit.rds"))
    
    x_columns_FB_LE <- c(
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
    
    fitbit_data <- fitbit_data %>% select(x_columns_FB_LE)
    idx <- which(is.na(fitbit_data), arr.ind = T)[, 1]
    fitbit_data <- fitbit_data[-idx, ]
    fitbit_data$day <- NULL
  }
  
  if (model == "randomForest") {
    loaded_Model <- readRDS(paste0(model_path, "/RandomForestModel_Fitbit.rds"))
    
    x_columns_FB_LE <- c(
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
    
    fitbit_data <- fitbit_data %>% select(x_columns_FB_LE)
    idx <- which(is.na(fitbit_data), arr.ind = T)[, 1]
    fitbit_data <- fitbit_data[-idx, ]
    fitbit_data$day <- NULL
  }
  
  if (model == "rotationForest") {
    # Reading the generated data to train the model
    aggregated_data <- fread(trainging_file, data.table = F)[ ,-1]
    
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
    
    x <- aggregated_data %>% select(x_columns_FB)
    x$activity_trimmed <- as.factor(x$activity_trimmed)
    
    # generate the RotationForest model for fitbit
    loaded_Model <- rotation_forest(activity_trimmed ~ ., x)
    
    
    
    x_columns_FB_LE <- c(
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
    
    fitbit_data <- fitbit_data %>% select(x_columns_FB_LE)
    idx <- which(is.na(fitbit_data), arr.ind = T)[, 1]
    fitbit_data <- fitbit_data[-idx, ]
    fitbit_data$day <- NULL
  }
  
  # run the model on the last participant's data
  fitbit_data$activity_trimmed <- predict(loaded_Model, fitbit_data, type = 'class')
  
  
  #Save the results as a CSV file
  write.csv(fitbit_data,
            paste0(main_path, "output/fitbit_data_predicted", ".csv"),
            row.names = FALSE)
  
}





