/*
 * Developed by Arastoo Bozorgi.
 * a.bozorgi67@gmail.com
 */

package com.beaplab.BeaplabEngine.service;

import com.beaplab.BeaplabEngine.constants.BeapEngineConstants;
import com.beaplab.BeaplabEngine.metadata.PredictedDataDto;
import com.beaplab.BeaplabEngine.metadata.ProcessedDataDto;
import com.beaplab.BeaplabEngine.metadata.RawDataDto;
import com.beaplab.BeaplabEngine.model.PredictedData;
import com.beaplab.BeaplabEngine.model.RawData;
import com.beaplab.BeaplabEngine.util.ArchiveUtil;
import com.beaplab.BeaplabEngine.util.DownloadUtil;
import com.beaplab.BeaplabEngine.util.ZipUtil;
import org.apache.commons.io.IOUtils;
import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.nio.file.Files;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

@Service("appleWatchService")
@ComponentScan("com.beaplab.BeaplabEngine")
@PropertySource("classpath:r_repo.properties")
public class AppleWatchService {

    final static Logger logger = LogManager.getLogger(AppleWatchService.class.getName());

    @Autowired
    private ZipUtil zipUtil;

    @Autowired
    DownloadUtil downloadUtil;

    @Autowired
    private ArchiveUtil archiveUtil;

    @Autowired
    Environment environment;

    @Autowired
    RawDataService rawDataService;

    @Autowired
    ProcessedDataService processedDataService;

    @Autowired
    PredictedDataService predictedDataService;


    // persisting the input zip file
    public JSONObject UploadAndPersist(Map<String, MultipartFile> fileMap, Long userId) {
        logger.info("in AppleWatchService/UploadAndPersist");

        JSONObject jsonObject = new JSONObject();

        String tmpFilePath = environment.getProperty("r_repo.path") + File.separator + "tmp" + File.separator;

        // create tmp directory if it doesn't exist
        File tmpDir = new File(tmpFilePath);
        if(!tmpDir.exists()) tmpDir.mkdirs();


        List<String> uploadedFileNames = new ArrayList<String>();


        // save the zip file in tmp
        File uploadedFile = null;
        for (MultipartFile multipartFile : fileMap.values()) {

            if(!multipartFile.getContentType().equals("application/zip")) {
                jsonObject.put(BeapEngineConstants.SUCCESS_STR, false);
                jsonObject.put("message", "Invalid file type");
                jsonObject.put("status_code", HttpStatus.UNSUPPORTED_MEDIA_TYPE.value());
                return jsonObject;
            }

            uploadedFile = new File(tmpFilePath + multipartFile.getOriginalFilename());
            uploadedFileNames.add(tmpFilePath + multipartFile.getOriginalFilename());

            try {
                // transfer the uploaded files into tmp path
                multipartFile.transferTo(uploadedFile);

            } catch (IOException e) {
                e.printStackTrace();
                jsonObject.put(BeapEngineConstants.SUCCESS_STR, false);
                jsonObject.put("message", e.getMessage());
                jsonObject.put("status_code", HttpStatus.INTERNAL_SERVER_ERROR.value());
                return jsonObject;
            }
        }

        // convert the zip file to array of bytes
        byte[] bZipFile = new byte[0];
        try {
            bZipFile = Files.readAllBytes(uploadedFile.toPath());
        } catch (IOException e) {
            e.printStackTrace();
            jsonObject.put(BeapEngineConstants.SUCCESS_STR, false);
            jsonObject.put("message", e.getMessage());
            jsonObject.put("status_code", HttpStatus.INTERNAL_SERVER_ERROR.value());
            return jsonObject;
        }

        Long rawDataId  = rawDataService.save(bZipFile, RawData.dataType.AppleWatch, userId);
        if (rawDataId != -1) {
            // the data is persisted to database, so remove the zip file
            cleanup(uploadedFile.getAbsolutePath());

        } else {
            jsonObject.put(BeapEngineConstants.SUCCESS_STR, false);
            jsonObject.put("message", "Persisting raw data failed");
            jsonObject.put("status_code", HttpStatus.INTERNAL_SERVER_ERROR.value());
        }

        jsonObject.put(BeapEngineConstants.SUCCESS_STR, true);
        jsonObject.put("raw_data_id", rawDataId);
        jsonObject.put("status_code", HttpStatus.OK.value());
        return jsonObject;
    }


    public JSONObject processData(Long rawDataId) {

        logger.info("in AppleWatchService/processData");

        JSONObject jsonObject = new JSONObject();

        String rCodePath = environment.getProperty("r_repo.path") + File.separator + "applewatch" +
                File.separator +"code" + File.separator + "DataProcessor.R";

        String dataPath = environment.getProperty("r_repo.path") + File.separator +
                "applewatch" + File.separator + "data" + File.separator;

        String outputPath = environment.getProperty("r_repo.path") + File.separator + "applewatch" +
                File.separator + "data" + File.separator + "output" + File.separator;

        String rawPath = environment.getProperty("r_repo.path") + File.separator + "applewatch" +
                File.separator + "data" + File.separator + "raw";

        String zipFilePath = rawPath + File.separator + rawDataId + ".zip";

        // create required directories if it not exist
        File rawDir = new File(rawPath);
        if(!rawDir.exists()) rawDir.mkdirs();

        File outputDir = new File(outputPath);
        if(!outputDir.exists()) outputDir.mkdirs();

        File dataDir = new File(dataPath);
        if(!dataDir.exists()) dataDir.mkdirs();


        // before starting the data processing, check the data is not processed before
        Long processedDataId = rawDataService.getProcessDataId(rawDataId);
        if (processedDataId != -1) {
            // the data is already processed, just return the id of the processed data
            jsonObject.put(BeapEngineConstants.SUCCESS_STR, true);
            jsonObject.put("processed_id", processedDataId);
            jsonObject.put("status_code", HttpStatus.OK.value());
            return jsonObject;
        }


        // get the raw data
        RawDataDto rawDataDto = rawDataService.get(rawDataId);
        if (rawDataDto == null) {
            // raw data does not exists
            jsonObject.put(BeapEngineConstants.SUCCESS_STR, false);
            jsonObject.put("message", "Invalid id provided");
            jsonObject.put("status_code", HttpStatus.INTERNAL_SERVER_ERROR.value());
            return jsonObject;
        }
        byte[] data = rawDataDto.getData();

        // convert the rawDataDto.data, which is an array of bytes to zip
        File file = new File(zipFilePath);
        try {
            OutputStream os = new FileOutputStream(file);
            os.write(data);
            os.close();
        } catch (Exception e) {
            e.printStackTrace();
            jsonObject.put(BeapEngineConstants.SUCCESS_STR, false);
            jsonObject.put("message", e.getMessage());
            jsonObject.put("status_code", HttpStatus.INTERNAL_SERVER_ERROR.value());
            return jsonObject;
        }

        // unzip the fetched zip file to a directory with name rawDataId inside rawPath
        if (!zipUtil.unzip(zipFilePath, rawPath + File.separator + rawDataId)) {
            jsonObject.put(BeapEngineConstants.SUCCESS_STR, false);
            jsonObject.put("message", "Unzipping failed");
            jsonObject.put("status_code", HttpStatus.INTERNAL_SERVER_ERROR.value());
            return jsonObject;
        }

        Process child = null;
        String out = "";

        File rawDataDir = new File(rawPath + File.separator + rawDataId + File.separator);
        File[] rawFile = rawDataDir.listFiles();
        if (rawFile.length != 1 || !rawFile[0].getName().contains(".xml")) {
            jsonObject.put(BeapEngineConstants.SUCCESS_STR, false);
            jsonObject.put("message", "Invalid raw file fetched to be processed");
            jsonObject.put("status_code", HttpStatus.INTERNAL_SERVER_ERROR.value());
            return jsonObject;
        }

        String fileName = rawFile[0].getName();
        logger.info("Rscript " + rCodePath + " " + dataPath + " " + rawPath + File.separator + rawDataId
                + File.separator + fileName);

        try {
            child = Runtime.getRuntime().exec("Rscript " + rCodePath + " " +
                    dataPath + " " +
                    rawPath + File.separator + rawDataId + File.separator + fileName);

            int code = child.waitFor();
            switch (code) {
                case 0:
                    //normal termination, everything is fine

                    out = zipUtil.zip1(outputPath, outputPath, rawDataId.toString());

                    // persist the processed zip file to database
                    File zipFile = new File(out);
                    byte[] bZipFile = new byte[0];
                    try {
                        bZipFile = Files.readAllBytes(new File(out).toPath());
                    } catch (IOException e) {
                        e.printStackTrace();
                        jsonObject.put(BeapEngineConstants.SUCCESS_STR, false);
                        jsonObject.put("message", e.getMessage());
                        jsonObject.put("status_code", HttpStatus.INTERNAL_SERVER_ERROR.value());
                        return jsonObject;
                    }

                    processedDataId  = processedDataService.save(bZipFile, rawDataId);
                    if (processedDataId != -1) {
                        // remove the zip file containing raw data and its extracted from raw/{userId}
                        cleanup(zipFilePath);
                        cleanup(rawPath + File.separator + rawDataId);

                        // remove everything in outputPath
                        File[] generatedFiles = outputDir.listFiles();
                        for (File file1: generatedFiles) {
                            file1.delete();
                        }

                        jsonObject.put(BeapEngineConstants.SUCCESS_STR, true);
                        jsonObject.put("processed_id", processedDataId);
                        jsonObject.put("status_code", HttpStatus.OK.value());

                    } else {
                        jsonObject.put(BeapEngineConstants.SUCCESS_STR, false);
                        jsonObject.put("message", "Persisting raw data failed");
                        jsonObject.put("status_code", HttpStatus.INTERNAL_SERVER_ERROR.value());
                    }



                    break;
                case 1:
                    //Read the error stream then
                    jsonObject.put(BeapEngineConstants.SUCCESS_STR, false);
                    jsonObject.put("message", IOUtils.toString(child.getErrorStream()));
                    jsonObject.put("status_code", HttpStatus.INTERNAL_SERVER_ERROR.value());
                    return jsonObject;
            }
        } catch (IOException e) {
            e.printStackTrace();
            jsonObject.put(BeapEngineConstants.SUCCESS_STR, false);
            jsonObject.put("message", e.getMessage());
            jsonObject.put("status_code", HttpStatus.INTERNAL_SERVER_ERROR.value());
            return jsonObject;
        } catch (InterruptedException e) {
            e.printStackTrace();
            jsonObject.put(BeapEngineConstants.SUCCESS_STR, false);
            jsonObject.put("message", e.getMessage());
            jsonObject.put("status_code", HttpStatus.INTERNAL_SERVER_ERROR.value());
            return jsonObject;
        }

        return jsonObject;
    }



    public JSONObject predictData(Long processedDataId, String predictionModel) {

        logger.info("in AppleWatchService/predictData");

        JSONObject jsonObject = new JSONObject();

        String rCodePath = environment.getProperty("r_repo.path") + File.separator + "applewatch" +
                File.separator +"code" + File.separator + "Predictor.R";

        String dataPath = environment.getProperty("r_repo.path") + File.separator +
                "applewatch" + File.separator + "data" + File.separator;

        String outputPath = environment.getProperty("r_repo.path") + File.separator + "applewatch" +
                File.separator + "data" + File.separator + "output" + File.separator;

        String rawPath = environment.getProperty("r_repo.path") + File.separator + "applewatch" +
                File.separator + "data" + File.separator + "raw";

        String modelPath = environment.getProperty("r_repo.path") + File.separator + BeapEngineConstants.MODELS_DIR + File.separator;

        String trainingFilePath = environment.getProperty("r_repo.path") + File.separator + "aggregated_fitbit_applewatch_jaeger.csv";

        // convert the input predictionModel to predictionType
        PredictedData.predictionType predictionType = null;
        try {
            predictionType = PredictedData.predictionType.valueOf(predictionModel);
        } catch (IllegalArgumentException e) {
            jsonObject.put(BeapEngineConstants.SUCCESS_STR, false);
            jsonObject.put("message", "Invalid predictionModel. Valid predictionModel values are: "
                    + PredictedData.predictionType.svm.toString() + ", "
                    + PredictedData.predictionType.decissionTree.toString() + ", "
                    + PredictedData.predictionType.randomForest.toString() + ", "
                    + PredictedData.predictionType.rotationForest.toString()
            );
            jsonObject.put("status_code", HttpStatus.NOT_ACCEPTABLE.value());
            return jsonObject;
        }

        // create required directories if it not exist
        File rawDir = new File(rawPath);
        if(!rawDir.exists()) rawDir.mkdirs();

        File outputDir = new File(outputPath);
        if(!outputDir.exists()) outputDir.mkdirs();

        File dataDir = new File(dataPath);
        if(!dataDir.exists()) dataDir.mkdirs();

//        // get the processed data id by the raw data id
//        Long processedDataId = rawDataService.getProcessDataId(rawDataId);
//        if (processedDataId == -1) {
//            // data is not processed yet, it should be processed before being predicted
//            jsonObject.put(BeapEngineConstants.SUCCESS_STR, false);
//            jsonObject.put("message", "Data not processed yet.");
//            jsonObject.put("status_code", HttpStatus.INTERNAL_SERVER_ERROR.value());
//            return jsonObject;
//        }

        String zipFilePath = rawPath + File.separator + processedDataId + ".zip";

        // before going into the prediction process, check the data is not predicted before
        Long predictedDataId = processedDataService.getPredictedDataId(processedDataId, predictionType);
        if (predictedDataId != -1) {
            // the data is already predicted, just return the id of the predicted data
            jsonObject.put(BeapEngineConstants.SUCCESS_STR, true);
            jsonObject.put("predicted_id", predictedDataId);
            jsonObject.put("status_code", HttpStatus.OK.value());
            return jsonObject;
        }


        // get the processed data
        ProcessedDataDto processedDataDto = processedDataService.get(processedDataId);
        if (processedDataDto == null) {
            // raw data does not exists
            jsonObject.put(BeapEngineConstants.SUCCESS_STR, false);
            jsonObject.put("message", "Invalid id provided");
            jsonObject.put("status_code", HttpStatus.INTERNAL_SERVER_ERROR.value());
            return jsonObject;
        }
        byte[] data = processedDataDto.getData();

        // convert the processedDataDto.data, which is an array of bytes to zip
        File file = new File(zipFilePath);
        try {
            OutputStream os = new FileOutputStream(file);
            os.write(data);
            os.close();
        } catch (Exception e) {
            e.printStackTrace();
            jsonObject.put(BeapEngineConstants.SUCCESS_STR, false);
            jsonObject.put("message", e.getMessage());
            jsonObject.put("status_code", HttpStatus.INTERNAL_SERVER_ERROR.value());
            return jsonObject;
        }

        // unzip the fetched zip file to a directory with name processedDataId inside rawPath
        if (!zipUtil.unzip(zipFilePath, rawPath + File.separator + processedDataId)) {
            jsonObject.put(BeapEngineConstants.SUCCESS_STR, false);
            jsonObject.put("message", "Unzipping failed");
            jsonObject.put("status_code", HttpStatus.INTERNAL_SERVER_ERROR.value());
            return jsonObject;
        }


        Process child = null;
        String out = "";


        // check the file including all processed data
        String fileName = rawPath + File.separator + processedDataId + File.separator + "applewatch_data.csv";
        logger.info("fileName: " + fileName);
        // check the existence of the file
        if (!new File(fileName).exists()) {
            jsonObject.put(BeapEngineConstants.SUCCESS_STR, false);
            jsonObject.put("message", "File does not exist to generate predictions.");
            jsonObject.put("status_code", HttpStatus.INTERNAL_SERVER_ERROR.value());
            return jsonObject;
        }

        logger.info("Rscript " + rCodePath + " " + dataPath + " " +
                modelPath + " " + trainingFilePath + " " + fileName + " " + predictionModel);

        try {
            child = Runtime.getRuntime().exec("Rscript " + rCodePath + " " + dataPath + " " +
                    modelPath + " " + trainingFilePath + " " + fileName + " " + predictionModel);

            int code = child.waitFor();
            switch (code) {
                case 0:
                    //normal termination, everything is fine

                    out = zipUtil.zip1(outputPath, outputPath, processedDataId.toString());

                    // persist the predicted zip file to database
                    File zipFile = new File(out);
                    byte[] bZipFile = new byte[0];
                    try {
                        bZipFile = Files.readAllBytes(new File(out).toPath());
                    } catch (IOException e) {
                        e.printStackTrace();
                        jsonObject.put(BeapEngineConstants.SUCCESS_STR, false);
                        jsonObject.put("message", e.getMessage());
                        jsonObject.put("status_code", HttpStatus.INTERNAL_SERVER_ERROR.value());
                        return jsonObject;
                    }

                    predictedDataId  = predictedDataService.save(bZipFile, predictionType, processedDataId);
                    if (predictedDataId != -1) {
                        // remove the zip file containing raw data and its extracted from raw/{processedDataId}
                        cleanup(zipFilePath);
                        cleanup(rawPath + File.separator + processedDataId);

                        // remove everything in outputPath
                        File[] generatedFiles = outputDir.listFiles();
                        for (File file1: generatedFiles) {
                            file1.delete();
                        }


                        jsonObject.put(BeapEngineConstants.SUCCESS_STR, true);
                        jsonObject.put("predicted_id", predictedDataId);
                        jsonObject.put("status_code", HttpStatus.OK.value());

                    } else {
                        jsonObject.put(BeapEngineConstants.SUCCESS_STR, false);
                        jsonObject.put("message", "Persisting raw data failed");
                        jsonObject.put("status_code", HttpStatus.INTERNAL_SERVER_ERROR.value());
                    }



                    break;
                case 1:
                    //Read the error stream then
                    logger.error(IOUtils.toString(child.getErrorStream()));
                    jsonObject.put(BeapEngineConstants.SUCCESS_STR, false);
                    jsonObject.put("message", IOUtils.toString(child.getErrorStream()));
                    jsonObject.put("status_code", HttpStatus.INTERNAL_SERVER_ERROR.value());
                    return jsonObject;
            }
        } catch (IOException e) {
            e.printStackTrace();
            logger.error(e);
            jsonObject.put(BeapEngineConstants.SUCCESS_STR, false);
            jsonObject.put("message", e.getMessage());
            jsonObject.put("status_code", HttpStatus.INTERNAL_SERVER_ERROR.value());
            return jsonObject;
        } catch (InterruptedException e) {
            e.printStackTrace();
            logger.error(e);
            jsonObject.put(BeapEngineConstants.SUCCESS_STR, false);
            jsonObject.put("message", e.getMessage());
            jsonObject.put("status_code", HttpStatus.INTERNAL_SERVER_ERROR.value());
            return jsonObject;
        }


        return jsonObject;
    }


    public byte[] download(String id, String type) {
        logger.info("in AppleWatchService/download");

        if (type.equals("process")) {
            ProcessedDataDto processedDataDto = processedDataService.get(Long.parseLong(id));
            if (processedDataDto != null) {
                byte[] data = processedDataDto.getData();
                return data;
            }
        }

        if (type.equals("predict")) {
            PredictedDataDto predictedDataDto = predictedDataService.get(Long.parseLong(id));
            if (predictedDataDto != null) {
                byte[] data = predictedDataDto.getData();
                return data;
            }
        }
        return null;
    }


    public JSONObject list(Long userId, String type) {

        logger.info("in AppleWatchService/list");

        JSONObject jsonObject = new JSONObject();

        switch (type) {
            case "raw":
                List<RawDataDto> rawDataDtoList = rawDataService.list(userId, RawData.dataType.AppleWatch);
                if (rawDataDtoList == null) {
                    jsonObject.put(BeapEngineConstants.SUCCESS_STR, false);
                    jsonObject.put("message", "Raw data not found");
                    jsonObject.put("status_code", HttpStatus.INTERNAL_SERVER_ERROR.value());
                } else {
                    jsonObject.put(BeapEngineConstants.SUCCESS_STR, true);
                    jsonObject.put("list", rawDataDtoList);
                    jsonObject.put("status_code", HttpStatus.OK.value());
                }
                break;
            case "processed":
                List<ProcessedDataDto> processedDataDtoList = processedDataService.list(userId, RawData.dataType.AppleWatch);
                if (processedDataDtoList == null) {
                    jsonObject.put(BeapEngineConstants.SUCCESS_STR, false);
                    jsonObject.put("message", "Processed data not found");
                    jsonObject.put("status_code", HttpStatus.INTERNAL_SERVER_ERROR.value());
                } else {
                    jsonObject.put(BeapEngineConstants.SUCCESS_STR, true);
                    jsonObject.put("list", processedDataDtoList);
                    jsonObject.put("status_code", HttpStatus.OK.value());
                }
                break;
            case "predicted":
                List<PredictedDataDto> predictedDataDtoList = predictedDataService.list(userId, RawData.dataType.AppleWatch);
                if (predictedDataDtoList == null) {
                    jsonObject.put(BeapEngineConstants.SUCCESS_STR, false);
                    jsonObject.put("message", "Predicted data not found");
                    jsonObject.put("status_code", HttpStatus.INTERNAL_SERVER_ERROR.value());
                } else {
                    jsonObject.put(BeapEngineConstants.SUCCESS_STR, true);
                    jsonObject.put("list", predictedDataDtoList);
                    jsonObject.put("status_code", HttpStatus.OK.value());
                }
                break;

            default:
                jsonObject.put(BeapEngineConstants.SUCCESS_STR, false);
                jsonObject.put("message", "Invalid list type. Valid type values are: " +
                        "raw, processed, predicted"
                );
                jsonObject.put("status_code", HttpStatus.NOT_ACCEPTABLE.value());
                return jsonObject;
        }


        return jsonObject;
    }


    public boolean cleanup(String path) {

        logger.info("in AppleWatchService/cleanup");

        File file = new File(path);
        if (file.isDirectory()) {
            File[] allContents = file.listFiles();
            if (allContents != null) {
                for (File entry : allContents) {
                    entry.delete();
                }
            }
        }

        file.delete();

        return true;
    }

}
