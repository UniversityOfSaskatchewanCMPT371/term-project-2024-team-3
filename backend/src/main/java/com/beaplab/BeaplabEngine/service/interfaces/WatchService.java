package com.beaplab.BeaplabEngine.service.interfaces;

import org.json.simple.JSONObject;
import org.springframework.web.multipart.MultipartFile;
import java.util.Map;


public interface WatchService {

    /**
     * persist the input zip file to the database
     * @param   fileMap maps a string to a multipart file. The actual file data.
     * @param   userId the ID of the user
     * @return  a response with a success signal, a message, and a status code
     */
    public JSONObject UploadAndPersist(Map<String, MultipartFile> fileMap, Long userId);
    
    /**
     * Sends the file to the R-repo for processing
     * @param   rawDataId the ID for a raw data file
     * @return  a JSON object with a success signal, message, and a status code
     */
    public JSONObject processData(Long rawDataId);


    /**
     * predicts a processed file using the selected prediction model
     * @param   processedDataId the ID of the processed file to be predicted
     * @param   predictionModel the model you want to predict with
     * @return  a JSON object with a success signal, message, and a status code
     */
    public JSONObject predictData(Long processedDataId, String predictionModel);


    /**
     * Downloads a file with a specific type
     * @param   id the string ID of the file to be downloaded
     * @param   type the type of download (predict or process)
     * @return  An array of byte data
     */
    public byte[] download(String id, String type);


    /**
     * 
     * @param   userId the ID of the user
     * @param   type the type of data to list (raw, processed, predicted)
     * @return  a JSON object with the list of data, a success message, a message, and a status code
     */
    public JSONObject list(Long userId, String type);


    /**
     * 
     * @param path
     * @return
     */
    public boolean cleanup(String path);

}
