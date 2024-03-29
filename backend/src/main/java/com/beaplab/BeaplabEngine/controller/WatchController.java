package com.beaplab.BeaplabEngine.controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.servlet.ModelAndView;

import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import springfox.documentation.annotations.ApiIgnore;

import com.beaplab.BeaplabEngine.authentication.SessionDetails;
import com.beaplab.BeaplabEngine.constants.BeapEngineConstants;
import com.beaplab.BeaplabEngine.service.AppleWatchService;
import com.beaplab.BeaplabEngine.service.FitbitService;
import com.rollbar.notifier.Rollbar;



@Controller
@RequestMapping(BeapEngineConstants.REQUEST_MAPPING_PATTERN)
@Secured({"ROLE_ADMIN", "ROLE_USER"})
public class WatchController {

    @Autowired
    private final Rollbar rollbar;

    @Autowired
    private AppleWatchService appleWatchService;

    @Autowired
    private FitbitService fitbitService;

    public WatchController(Rollbar rollbar){
        this.rollbar = rollbar;
    }    

    // getUploadView
    @RequestMapping(value = "/{watchType}/uploadview", method = RequestMethod.GET)
    @ApiOperation(value = "WatchType view", notes = "Returns the watchType view page", response = ModelAndView.class)
        public ModelAndView getUploadView(@PathVariable("watchType") String watchType) throws Exception{
            rollbar.info("In WatchController/getUploadView with api parameter: " + watchType);
            // getting the appropriate viewName
            String viewName = "";
            switch (watchType) {
                case "applewatch":
                    viewName = "appleWatch";
                    break;
                case "fitbit":
                    viewName = "fitbit";
                    break;
                default:
                    rollbar.error("Incorrect watch type selected: " + watchType);
                    throw new Exception("Incorrect watch type selected: " + watchType);
            }

            ModelAndView model = new ModelAndView(viewName + "FileUpload");
            return model;
    }



    // upload
    @RequestMapping(value = "/{watchType}/upload", method = RequestMethod.POST)
    @ApiOperation(value = "Zip file upload", notes = "Uploading a zip file containing Apple Watch raw data and persisting it to database")
    @ApiResponses(value = {
            @ApiResponse(code = 415, message = "{success: false, message: Invalid file type}"),
            @ApiResponse(code = 200, message = "{success: true}, raw_data_id: XXXX}"),
            @ApiResponse(code = 400, message = "{success: false, message: Invalid watch type}"),
            @ApiResponse(code = 406, message = "{success: false, message: One zip file is acceptable}"),
            @ApiResponse(code = 500, message = "{success: false, message: XYZ}")
    })
    @ApiImplicitParams({
            @ApiImplicitParam(
                name = "file",
                value = "the zipped file to be uploaded as multipart/form-data",
                type = "POST",
                required = true,
                paramType = "blob")
    })
    public ResponseEntity<JSONObject> upload(
        @ApiParam(value = "The watch type to be uploaded", required = true)
        @PathVariable("watchType") String watchType,
        @ApiIgnore MultipartHttpServletRequest request) throws Exception {

        rollbar.info("in WatchController/upload");

        HttpSession session = request.getSession(false);
        if(session == null || !request.isRequestedSessionIdValid()) { // invalid session
            JSONObject jsonObject = new JSONObject();
            jsonObject.put(BeapEngineConstants.SUCCESS_STR, false);
            jsonObject.put("message", "Invalid session");
            jsonObject.put("status_code", HttpStatus.NON_AUTHORITATIVE_INFORMATION.value());

            return new ResponseEntity<>(jsonObject, (HttpStatus.valueOf((int)jsonObject.get("status_code"))));
        }


        if(!watchType.equals("applewatch") && !watchType.equals("fitbit")){
            JSONObject jsonObject = new JSONObject();
            jsonObject.put(BeapEngineConstants.SUCCESS_STR, false);
            jsonObject.put("message", "Invalid watch type in url");
            jsonObject.put("status_code", 400);
            return new ResponseEntity<>(jsonObject, (HttpStatus.valueOf((int)jsonObject.get("status_code"))));
        }

        SessionDetails sessionDetails = (SessionDetails) session.getAttribute("SESSION_DETAILS");

        JSONObject result = new JSONObject();
        switch (watchType) {
            case "applewatch":
                result = appleWatchService.UploadAndPersist(request.getFileMap(), sessionDetails.getUserId());
                break;
        
            case "fitbit":
                result = fitbitService.UploadAndPersist(request.getFileMap(), sessionDetails.getUserId());
                break;
            default:
                rollbar.error("Incorrect watch type selected: " + watchType);
                throw new Exception("Incorrect watch type selected: " + watchType);

        }

        return new ResponseEntity<>(result, (HttpStatus.valueOf((int)result.get("status_code"))));
    }




    @RequestMapping(value = "/{watchType}/process/{id}", method = RequestMethod.GET)
    @ApiOperation(value = "Watch data processing", notes = "Processing the user's Watch data, which has been uploaded before.")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "{success: true, processed_id: XXXX}"),
            @ApiResponse(code = 400, message = "{success: false, message: Invalid watch type}"),
            @ApiResponse(code = 500, message = "{success: false, message: XYZ}")
    })
    public ResponseEntity<JSONObject> processFiles(
            @ApiParam(value = "id of the file to be processed, which is the raw data id", required = true)
            @PathVariable("id") String rawDataId,
            @ApiParam(value = "The watch type to be processed", required = true)
            @PathVariable("watchType") String watchType
            ) throws Exception {

        rollbar.info("in WatchController/processFiles");


        if(!watchType.equals("applewatch") && !watchType.equals("fitbit")){
            JSONObject jsonObject = new JSONObject();
            jsonObject.put(BeapEngineConstants.SUCCESS_STR, false);
            jsonObject.put("message", "Invalid watch type in url");
            jsonObject.put("status_code", 400);
            return new ResponseEntity<>(jsonObject, (HttpStatus.valueOf((int)jsonObject.get("status_code"))));
        }

        JSONObject result = new JSONObject();

        switch (watchType) {
            case "applewatch":
                result = appleWatchService.processData(Long.parseLong(rawDataId));
            break;
        
            case "fitbit":
                result = fitbitService.processData(Long.parseLong(rawDataId));
            break;
            default:
                rollbar.error("Incorrect watch type selected: " + watchType);
                throw new Exception("Incorrect watch type selected: " + watchType);
        }

        return new ResponseEntity<>(result, (HttpStatus.valueOf((int)result.get("status_code"))));
    }


    
    @RequestMapping(value = "/{watchType}/predict/{id}/{predictionmodel}", method = RequestMethod.GET)
    @ApiOperation(value = "Watch data prediction", notes = "Predicting the user's Watch data, which has been processed before.")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "{success: true, predicted_id: XXXX}"),
            @ApiResponse(code = 400, message = "{success: false, message: Invalid watch type}"),
            @ApiResponse(code = 406, message = "{success: false, message: Invalid predictionModel}"),
            @ApiResponse(code = 500, message = "{success: false, message: XYZ}")
    })
    public ResponseEntity<JSONObject> predictWatch(
            @ApiParam(value = "id of the file to be predicted, which is the processed data id", required = true)
            @PathVariable("id") String processedDataId,
            @ApiParam(value = "the machine learning model: svm, randomForest, rotationForest, decissionTree", required = true)
            @PathVariable("predictionmodel") String predictionModel,
            @ApiParam(value = "the watch type to be predicted", required = true)
            @PathVariable("watchType") String watchType
            ) throws Exception {

        rollbar.info("in WatchController/predictFitbit");


        JSONObject result = new JSONObject();

        if(!watchType.equals("applewatch") && !watchType.equals("fitbit")){
            JSONObject jsonObject = new JSONObject();
            jsonObject.put(BeapEngineConstants.SUCCESS_STR, false);
            jsonObject.put("message", "Invalid watch type in url");
            jsonObject.put("status_code", 400);
            return new ResponseEntity<>(jsonObject, (HttpStatus.valueOf((int)jsonObject.get("status_code"))));
        }


        switch (watchType) {
            case "applewatch":
                result = appleWatchService.predictData(Long.parseLong(processedDataId), predictionModel);
            break;
        
            case "fitbit":
                result = fitbitService.predictData(Long.parseLong(processedDataId), predictionModel);
            break;
            default:
                rollbar.error("Incorrect watch type selected: " + watchType);
                throw new Exception("Incorrect watch type selected: " + watchType);
        }

        return new ResponseEntity<>(result, (HttpStatus.valueOf((int)result.get("status_code"))));
    }





    @RequestMapping(value = "/{watchType}/download_file/{id}/{type}", method = RequestMethod.GET)
    @ApiOperation(value = "Watch file download", notes = "Downloading the processed/predicted Watch files")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "{success: true, file: the_file}"),
            @ApiResponse(code = 400, message = "{success: false, message: Invalid watch type}"),
            @ApiResponse(code = 404, message = "{success: false, message: Requested .zip file not found at the server}"),
    })
    public ResponseEntity<JSONObject> downloadFile(HttpServletRequest req, HttpServletResponse resp,
                                                     @ApiParam(value = "id of the file to be downloaded", required = true)
                                                     @PathVariable("id") String id,
                                                     @ApiParam(value = "type of file to be downloaded: process or predict", required = true)
                                                     @PathVariable("type") String type,
                                                     @ApiParam(value = "the watch type to be downloaded", required = true)
                                                     @PathVariable("watchType") String watchType
                                                     ) throws Exception {

        rollbar.info("in WatchController/download_file");
        JSONObject jsonObject = new JSONObject();
        byte[] downloadedFile = null;


        if(!watchType.equals("applewatch") && !watchType.equals("fitbit")){
            jsonObject.put(BeapEngineConstants.SUCCESS_STR, false);
            jsonObject.put("message", "Invalid watch type in url");
            jsonObject.put("status_code", 400);
            return new ResponseEntity<>(jsonObject, (HttpStatus.valueOf((int)jsonObject.get("status_code"))));
        }


        switch (watchType) {
            case "applewatch":
                downloadedFile = appleWatchService.download(id, type);
                break;
        
            case "fitbit":
                downloadedFile = fitbitService.download(id, type);
                break;
            default:
                rollbar.error("Incorrect watch type selected: " + watchType);
                jsonObject.put(BeapEngineConstants.SUCCESS_STR, false);
                jsonObject.put("message", "Invalid watch type in url " + watchType);
                jsonObject.put("status_code", 400);
                return new ResponseEntity<>(jsonObject, (HttpStatus.valueOf((int)jsonObject.get("status_code"))));
                
                // throw new Exception("Incorrect watch type selected: " + watchType);
        }


        if (downloadedFile != null) {

            jsonObject.put(BeapEngineConstants.SUCCESS_STR, true);
            jsonObject.put("status_code", HttpStatus.OK.value());
            jsonObject.put("file", downloadedFile);
            return new ResponseEntity<>(jsonObject, HttpStatus.OK);

        } else {
            rollbar.info("Requested .zip file not found at the server");
            jsonObject.put(BeapEngineConstants.SUCCESS_STR, false);
            jsonObject.put("message", "Requested .zip file not found at the server");
            jsonObject.put("status_code", HttpStatus.NOT_FOUND.value());
            return new ResponseEntity<>(jsonObject, HttpStatus.NOT_FOUND);
        }
    }


    @RequestMapping(value = "/{watchType}/list/{type}", method = RequestMethod.GET)
    @ApiOperation(value = "Apple Watch data list", notes = "List the user's Apple Watch data.")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "{success: true, predicted_id: XXXX}"),
            @ApiResponse(code = 400, message = "{success: false, message: Invalid watch type}"),
            @ApiResponse(code = 406, message = "{success: false, message: Invalid predictionModel}"),
            @ApiResponse(code = 500, message = "{success: false, message: XYZ}")
    })
    public ResponseEntity<JSONObject> list(HttpServletRequest request,
                                           @ApiParam(value = "type of the apple watch data to be listed: raw, processed, predicted", required = true)
                                           @PathVariable("type") String type,
                                           @ApiParam(value = "the watch type to be downloaded", required = true)
                                           @PathVariable("watchType") String watchType
                                           ) throws Exception {

        rollbar.info("in WatchController/list");

        HttpSession session = request.getSession(false);
        if(session == null || !request.isRequestedSessionIdValid()) { // invalid session
            JSONObject jsonObject = new JSONObject();
            jsonObject.put(BeapEngineConstants.SUCCESS_STR, false);
            jsonObject.put("message", "Invalid session");
            jsonObject.put("status_code", HttpStatus.NON_AUTHORITATIVE_INFORMATION.value());

            return new ResponseEntity<>(jsonObject, (HttpStatus.valueOf((int)jsonObject.get("status_code"))));
        }

        if(!watchType.equals("applewatch") && !watchType.equals("fitbit")){
            JSONObject jsonObject = new JSONObject();
            jsonObject.put(BeapEngineConstants.SUCCESS_STR, false);
            jsonObject.put("message", "Invalid watch type in url");
            // wrong status_code
            jsonObject.put("status_code", 400);
            return new ResponseEntity<>(jsonObject, (HttpStatus.valueOf((int)jsonObject.get("status_code"))));
        }

        SessionDetails sessionDetails = (SessionDetails) session.getAttribute("SESSION_DETAILS");

        JSONObject result = new JSONObject();
        switch (watchType) {
            case "applewatch":
                result = appleWatchService.list(sessionDetails.getUserId(), type);
                break;
            case "fitbit":
                result = fitbitService.list(sessionDetails.getUserId(), type);
                break;
            default:
                rollbar.error("Incorrect watch type selected: " + watchType);
                throw new Exception("Incorrect watch type selected: " + watchType);
        }
        
        return new ResponseEntity<>(result, (HttpStatus.valueOf((int)result.get("status_code"))));
    }

}
