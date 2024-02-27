# Programmed by Arastoo Bozorgi
# ab1502@mun.ca

# This code extract data from XML files exported from Health Data app

rm(list = ls())
#========================Libraries=========================
list.of.packages <-
  c("Rcpp",
    "stringi",
    "lubridate",
    "xml2",
    "data.table",
    "dplyr")

new.packages <-
  list.of.packages[!(list.of.packages %in% installed.packages()[, "Package"])]
if (length(new.packages))
  install.packages(new.packages)

library(data.table)
library(lubridate)
library(dplyr)
library(xml2)

#=========================Variables========================
# OS <- Sys.info()
# if (OS["sysname"] == "Windows") {
#   path <-
#     "/Users/dfuller/Desktop/Arastoo/Spring/RCodeForBeapEngine/applewatch/data/"
# } else {
#   path <-
#     "/Users/dfuller/Desktop/Arastoo/Spring/RCodeForBeapEngine/applewatch/data/"
# }
# setwd(path)

# Get the data and savedModels path
# path <- here::here("applewatch", "data")
# print(path)
# setwd(path)

#Timezone
timeZone <- "America/St_Johns"
Sys.setenv(TZ = timeZone)



#!/usr/bin/env Rscript
args = commandArgs(trailingOnly=TRUE)

#====================Read in data files====================
# test if there is at least one argument: if not, return an error
if (length(args) != 2) {
  stop("Two input arguments must be supplied (input file).n", call.=FALSE)
} else {

  # rawData <-
  #   dir(path,
  #       pattern = "data.xml",
  #       full.names = TRUE)
  
  path <- args[1]
  rawData <- read_xml(args[2])
   # path <- "/home/arastoo/Desktop/Files/Walkabilly/BEAPLab/RCodeForBeapEngine/applewatch/data/"
   # rawData <- read_xml("/home/arastoo/Desktop/Files/Walkabilly/BEAPLab/RCodeForBeapEngine/applewatch/data/raw/140/export.xml")
  
  dataRecords <- xml_find_all(rawData, "//Record")
  
  startDate <-
    as.data.frame(trimws(xml_attr(dataRecords, "startDate")))
  #endDate <- as.data.frame(trimws(xml_attr(dataRecords, "endDate")))
  type <-
    unlist(strsplit(trimws(xml_attr(dataRecords, "type")), "HKQuantityTypeIdentifier"))
  type <- as.data.frame(type[type != ""])
  value <- as.data.frame(trimws(xml_attr(dataRecords, "value")))
  
  data <- cbind(startDate, type, value)
  colnames(data) <- c("DateTime", "type", "value")
  data$DateTime <-
    as.POSIXct(substr(data$DateTime, 1, 19), tz = timeZone, format = "%Y-%m-%d %H:%M:%S")
  
  heartrate <- data[data$type == "HeartRate",]
  calories <- data[data$type == "BasalEnergyBurned",]
  steps <- data[data$type == "StepCount",]
  distance <- data[data$type == "DistanceWalkingRunning",]
  
  heartrate <- heartrate[order(heartrate[, 1]), ]
  calories <- calories[order(calories[, 1]), ]
  steps <- steps[order(steps[, 1]), ]
  distance <- distance[order(distance[, 1]), ]
  
  heartrateTMP <- heartrate[, c(1, 3)]
  names(heartrateTMP) <- c("DateTime", "Heart")
  caloriesTMP <- calories[, c(1, 3)]
  names(caloriesTMP) <- c("DateTime", "Calories")
  stepsTMP <- steps[, c(1, 3)]
  names(stepsTMP) <- c("DateTime", "Steps")
  distanceTMP <- distance[, c(1, 3)]
  names(distanceTMP) <- c("DateTime", "Distance")
  
  output <- full_join(heartrateTMP, caloriesTMP)
  output <- full_join(output, stepsTMP)
  output <- full_join(output, distanceTMP)
  
  
  #Save the results as a CSV file
  write.csv(output,
            paste0(path, "output/applewatch_data", ".csv"),
            row.names = FALSE)
  
  write.csv(heartrateTMP,
            paste0(path, "output/heartrate", ".csv"),
            row.names = FALSE)
  
  write.csv(stepsTMP,
            paste0(path, "output/steps", ".csv"),
            row.names = FALSE)
  
  write.csv(caloriesTMP,
            paste0(path, "output/calories", ".csv"),
            row.names = FALSE)
  
  write.csv(distanceTMP,
            paste0(path, "output/distance", ".csv"),
            row.names = FALSE)
}





