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
#   path <- "/Users/dfuller/Desktop/Arastoo/Spring/RCodeForBeapEngine/applewatch/data/"
#   model_path <- "/Users/dfuller/Desktop/Arastoo/Spring/RCodeForBeapEngine/SavedModels/"
# } else {
#   path <- "/Users/dfuller/Desktop/Arastoo/Spring/RCodeForBeapEngine/applewatch/data/"
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
  
  
  # main_path <- "/home/arastoo/Desktop/Files/Walkabilly/BEAPLab/RCodeForBeapEngine/applewatch/data/"
  # model_path <- "/home/arastoo/Desktop/Files/Walkabilly/BEAPLab/RCodeForBeapEngine/SavedModels/"
  # trainging_file <- "/home/arastoo/Desktop/Files/Walkabilly/BEAPLab/RCodeForBeapEngine/aggregated_fitbit_applewatch_jaeger.csv"
  # file_name <- "/home/arastoo/Desktop/Files/Walkabilly/BEAPLab/RCodeForBeapEngine/applewatch/data/raw/141/applewatch_data.csv"
  # model <- "svm"
  
  applewatch_data <- fread(paste0(file_name), data.table = F)
  
  # keep the uninterpolated HR data for apple watch in another column
  applewatch_data$Applewatch.Heart_LE <- applewatch_data$Heart

  # keep the uninterpolated Calories data for apple watch in another column
  applewatch_data$Applewatch.Calories_LE <- applewatch_data$Calories

  # keep the uninterpolated Steps data for apple watch in another column
  applewatch_data$Applewatch.Steps_LE <- applewatch_data$Steps

  # keep the uninterpolated Distance data for apple watch in another column
  applewatch_data$Applewatch.Distance_LE <- applewatch_data$Distance

  
  # linear interpolation on applewatchdata 
  applewatch_data$Applewatch.Heart_LE <- na.interpolation(applewatch_data$Applewatch.Heart_LE, option = "linear")
  applewatch_data$Applewatch.Calories_LE <- na.interpolation(applewatch_data$Applewatch.Calories_LE, option = "linear")
  applewatch_data$Applewatch.Steps_LE <- na.interpolation(applewatch_data$Applewatch.Steps_LE, option = "linear")
  applewatch_data$Applewatch.Distance_LE <- na.interpolation(applewatch_data$Applewatch.Distance_LE, option = "linear")
  
  
  
  #===================================Generating features===============================================
  applewatch_data$time <-
    ymd_hms(applewatch_data$DateTime)
  applewatch_data$day <-
    day(applewatch_data$time)
  applewatch_data$hour <-
    hour(applewatch_data$time)
  applewatch_data$minute <-
    minute(applewatch_data$time)
  
  
  #Generate entropy of heartrate and steps per day, and resting hearrate
  applewatch_data <- applewatch_data %>%
    group_by(day) %>%
    mutate(EntropyApplewatchHeartPerDay_LE = rep(-sum(table(Applewatch.Heart_LE)/length(Applewatch.Heart_LE) * log2(table(Applewatch.Heart_LE)/length(Applewatch.Heart_LE))), length(Applewatch.Heart_LE)),
           EntropyApplewatchStepsPerDay_LE = rep(-sum(table(Applewatch.Steps_LE)/length(Applewatch.Steps_LE) * log2(table(Applewatch.Steps_LE)/length(Applewatch.Steps_LE))), length(Applewatch.Heart_LE)),
           RestingApplewatchHeartrate_LE = rep(quantile(Applewatch.Heart_LE, c(0.05), type = 1, na.rm = T), length(Applewatch.Heart_LE))
    )
  
  #Generate labels based on Todur Locke paper
  applewatch_data <- applewatch_data %>% 
    mutate(
      TodurLockeLabels_LE = case_when(
        Applewatch.Steps_LE < 60 ~ "Sedentary",
        Applewatch.Steps_LE >= 60 && Applewatch.Steps_LE < 100 ~ "Moderate",
        Applewatch.Steps_LE >= 100 ~ "Vigorous"
      )
    )
  
  # applewatch_data$TodurLockeLabels_LE <-
  #   car::recode(
  #     applewatch_data$Applewatch.Steps_LE,
  #     "lo:60='Sedentary';
  #   60:100='Moderate';
  #   100:hi='Vigorous';",
  #     as.factor = TRUE
  #   )
  

  out <- rollapply(applewatch_data[, c("Applewatch.Heart_LE", "Applewatch.Steps_LE")], width = 10, FUN = correlation, by.column = FALSE, fill = TRUE)
  applewatch_data[1:(1+length(out)-1), "CorrelationApplewatchHeartrateSteps_LE"] <- out
  
  
  
  #Normalized HR
  applewatch_data$NormalizedApplewatchHeartrate_LE = applewatch_data$Applewatch.Heart_LE - applewatch_data$RestingApplewatchHeartrate_LE
  
  #*********************************there is no age here?????????????????????
  # #Karvonen formula to calculate Intensity
  #applewatch_data$ApplewatchIntensity_LE <- applewatch_data$NormalizedApplewatchHeartrate_LE / (220 - applewatch_data$age - applewatch_data$RestingApplewatchHeartrate_LE)
  applewatch_data$ApplewatchIntensity_LE <- applewatch_data$NormalizedApplewatchHeartrate_LE / (220 - 40 - applewatch_data$RestingApplewatchHeartrate_LE)
  
  
  #SD of HR normalized HR
  applewatch_data$SDNormalizedApplewatchHR_LE <- rollapply(applewatch_data[, "NormalizedApplewatchHeartrate_LE"], width = 10, FUN = sd , by.column = FALSE, fill = TRUE)
  
  #Steps multiply by distance
  applewatch_data$ApplewatchStepsXDistance_LE <- applewatch_data$Applewatch.Steps_LE * applewatch_data$Applewatch.Distance_LE

  
  if (model == "decissionTree") {
    loaded_Model <- readRDS(paste0(model_path, "DecissionTreeModel_AppleWatch.rds"))
  }
  
  if (model == "svm") {
    loaded_Model <- readRDS(paste0(model_path, "SVMModel_AppleWatch.rds"))
    
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
    
    applewatch_data <- applewatch_data %>% select(x_columns_AW)
    idx <- which(is.na(applewatch_data), arr.ind = T)[, 1]
    applewatch_data <- applewatch_data[-idx, ]
    applewatch_data$day <- NULL
  }
  
  if (model == "randomForest") {
    loaded_Model <- readRDS(paste0(model_path, "RandomForestModel_AppleWatch.rds"))
    
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
    
    applewatch_data <- applewatch_data %>% select(x_columns_AW)
    idx <- which(is.na(applewatch_data), arr.ind = T)[, 1]
    applewatch_data <- applewatch_data[-idx, ]
    applewatch_data$day <- NULL
  }
  
  if (model == "rotationForest") {
    
    # Reading the generated data to train the model
    aggregated_data <- fread(trainging_file, data.table = F)[ ,-1]
    
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
    
    #load the RotationForest package as it's not from the default weka packages (note that the package should be installed before on weka using weka package manager)
    WPM("load-package", "RotationForest")
    
    # load the RotationForest classifier using RWeka
    rotation_forest <- make_Weka_classifier("weka/classifiers/meta/RotationForest")
    
    y <- aggregated_data$activity_trimmed
    
    x <- aggregated_data %>% select(x_columns_AW)
    x$activity_trimmed <- as.factor(x$activity_trimmed)
    
    # generate the RotationForest model for apple watch
    loaded_Model <- rotation_forest(activity_trimmed ~ ., x)
    

    
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
    
    applewatch_data <- applewatch_data %>% select(x_columns_AW)
    idx <- which(is.na(applewatch_data), arr.ind = T)[, 1]
    applewatch_data <- applewatch_data[-idx, ]
    applewatch_data$day <- NULL
  }
  
  
  
  # run the model on the participant's data
  applewatch_data$activity_trimmed <- predict(loaded_Model, applewatch_data, type = "class")
  
  
  #Save the results as a CSV file
  write.csv(applewatch_data,
            paste0(main_path, "output/applewatch_data_predicted", ".csv"),
            row.names = FALSE)
  
}





