# Programmed by Arastoo Bozorgi
# ab1502@mun.ca

# This code extract data from RAW JSON files downloaded from Fitbit server

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
library(jsonlite)
library(lubridate)
library(dplyr)
library(parallel)

#=========================Functions=========================
readJSON <- function(filename) {
  result <- fromJSON(filename)
  return(result)
}

list2frame <- function(inputList) {
  result <- as.data.frame(inputList)
  return(result)
}

#=========================Variables========================
# OS <- Sys.info()
# if (OS["sysname"] == "Windows") {
#   path <-
#     "/Users/dfuller/Desktop/Arastoo/Spring/RCodeForBeapEngine/fitbit/data"
# } else {
#   path <-
#     "/Users/dfuller/Desktop/Arastoo/Spring/RCodeForBeapEngine/fitbit/data"
# }
# setwd(path)

#Timezone
timeZone <- "America/St_Johns"
Sys.setenv(TZ = timeZone)

#!/usr/bin/env Rscript
args = commandArgs(trailingOnly=TRUE)

# test if there is at least one argument: if not, return an error
if (length(args) != 2) {
  stop("Two input arguments must be supplied (input file).n", call.=FALSE)
} else {
  
  # path <- "/home/arastoo/Desktop/Files/Walkabilly/BEAPLab/RCodeForBeapEngine/fitbit/data/" # args[1] contains the main path
  # raw_files_path <-"/home/arastoo/Desktop/Files/Walkabilly/BEAPLab/RCodeForBeapEngine/fitbit/data/raw/3"  #args[2] contains the raw directory path
  
  path <- args[1] # args[1] contains the main path
  raw_files_path <- args[2] #args[2] contains the raw directory path
  
  # extract the json files related to each feture
  heartrateDataFiles <-
    dir(raw_files_path,
        pattern = "^heart_rate-([0-9])+",
        full.names = T)
  
  caloriesDataFiles <-
    dir(raw_files_path,
        pattern = "^calories-([0-9])+",
        full.names = TRUE)
  
  stepsDateFiles <-
    dir(raw_files_path,
        pattern = "^steps-([0-9])+",
        full.names = TRUE)
  
  distanceDataFiles <-
    dir(raw_files_path,
        pattern = "^distance-([0-9])+",
        full.names = TRUE)
    
    
  
  # detect the number of cores
  n.cores <- detectCores()
  clust <- makeCluster(n.cores)

  
  # create empty data frames
  heartrate <- data.frame(DateTime=as.POSIXct(character(), format = "%m/%d/%y %H:%M:%S"),
                   Heart=numeric()) 
  calories <- data.frame(DateTime=as.POSIXct(character(), format = "%m/%d/%y %H:%M:%S"),
                         Calories=numeric()) 
  steps <- data.frame(DateTime=as.POSIXct(character(), format = "%m/%d/%y %H:%M:%S"),
                      Steps=numeric())
  distance <- data.frame(DateTime=as.POSIXct(character(), format = "%m/%d/%y %H:%M:%S"),
                         Distance=numeric())
  
  
  if (length(heartrateDataFiles) != 0 ) {
    # heartrate <- sapply(heartrateDataFiles, readJSON)
    heartrate <- parSapply(clust, heartrateDataFiles, fromJSON)
    
    bpm <-
      sapply(heartrate[seq(1, length(heartrate), 2) + 1], list2frame)
    
    bpm <- as.data.frame(unlist(bpm[seq(1, length(heartrate), 2)]))
    
    heartrate <- unlist(heartrate[seq(1, length(heartrate), 2)])
    heartrate <- data.frame(matrix(heartrate, nrow=length(heartrate), byrow=T),stringsAsFactors=FALSE)
    heartrate <- dplyr::bind_cols(heartrate, bpm)
    
    colnames(heartrate) <- c("DateTime", "Heart")
    
    heartrate[, "DateTime"] <-
      as.POSIXct(heartrate[, "DateTime"], format = "%m/%d/%y %H:%M:%S")
    
    heartrate <- heartrate[order(heartrate[, 1]), ]
    
    write.csv(heartrate,
              paste0(path, "output/heartrate", ".csv"),
              row.names = FALSE)
  }
  
  
  if (length(caloriesDataFiles) != 0 ) {
    #calories <- sapply(caloriesDataFiles, readJSON)
    calories <- parSapply(clust, caloriesDataFiles, fromJSON)
    
    calories <-
      dplyr::bind_cols(
        data.frame(matrix(
          unlist(calories[seq(1, length(calories), 2)])), 
          unlist(calories[seq(1, length(calories), 2) + 1])
        )
      )
    
    
    # calories <-
    #   data.frame(matrix(cbind(unlist(calories[seq(1, length(calories), 2)]), unlist(calories[seq(1, length(calories), 2) +
    #                                                                                        1]))))
    
    colnames(calories) <- c("DateTime", "Calories")
    calories[, "DateTime"] <-
      as.POSIXct(calories[, "DateTime"], format = "%m/%d/%y %H:%M:%S")
    calories <- calories[order(calories[, 1]), ]
    
    write.csv(calories,
              paste0(path, "output/calories", ".csv"),
              row.names = FALSE)
  }
  
  
  if (length(stepsDateFiles) != 0 ) {
    #steps <- sapply(stepsDateFiles, readJSON)
    steps <- parSapply(clust, stepsDateFiles, fromJSON)
    
    steps <-
      dplyr::bind_cols(
        data.frame(matrix(
          unlist(steps[seq(1, length(steps), 2)])), 
          unlist(steps[seq(1, length(steps), 2) + 1])
        )
      )
    
    # steps <-
    #   as.data.frame(cbind(unlist(steps[seq(1, length(steps), 2)]), unlist(steps[seq(1, length(steps), 2) +
    #                                                                               1])))
    
    colnames(steps) <- c("DateTime", "Steps")
    steps[, "DateTime"] <-
      as.POSIXct(steps[, "DateTime"], format = "%m/%d/%y %H:%M:%S")
    steps <- steps[order(steps[, 1]), ]
    
    write.csv(steps,
              paste0(path, "output/steps", ".csv"),
              row.names = FALSE)
  }
  
  
  if (length(distanceDataFiles) != 0 ) {
    #distance <- sapply(distanceDataFiles, readJSON)
    distance <- parSapply(clust, distanceDataFiles, fromJSON)
    
    distance <-
      dplyr::bind_cols(
        data.frame(matrix(
          unlist(distance[seq(1, length(distance), 2)])), 
          unlist(distance[seq(1, length(distance), 2) + 1])
        )
      )
    
    # distance <-
    #   as.data.frame(cbind(unlist(distance[seq(1, length(distance), 2)]), unlist(distance[seq(1, length(distance), 2) +
    #                                                                                        1])))
    colnames(distance) <- c("DateTime", "Distance")
    distance[, "DateTime"] <-
      as.POSIXct(distance[, "DateTime"], format = "%m/%d/%y %H:%M:%S")
    distance <- distance[order(distance[, 1]), ]
    
    write.csv(distance,
              paste0(path, "output/distance", ".csv"),
              row.names = FALSE)
  }

  output <- full_join(heartrate, calories)
  output <- full_join(output, steps)
  output <- full_join(output, distance)
  
  #Save the results as a CSV file
  write.csv(output,
            paste0(path, "output/fitbit_data", ".csv"),
            row.names = FALSE)

}








