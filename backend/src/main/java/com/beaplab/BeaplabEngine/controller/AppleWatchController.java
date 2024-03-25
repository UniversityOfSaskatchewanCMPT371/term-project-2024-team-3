/*
 * Developed by Arastoo Bozorgi.
 * a.bozorgi67@gmail.com
 */

package com.beaplab.BeaplabEngine.controller;

import com.beaplab.BeaplabEngine.authentication.SessionDetails;
import com.beaplab.BeaplabEngine.constants.BeapEngineConstants;
import com.beaplab.BeaplabEngine.service.AppleWatchService;
import com.beaplab.BeaplabEngine.util.DownloadUtil;
import io.swagger.annotations.*;
import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.servlet.ModelAndView;
import springfox.documentation.annotations.ApiIgnore;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.*;
import java.nio.file.Files;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping(BeapEngineConstants.REQUEST_MAPPING_PATTERN)
@Secured({"ROLE_ADMIN", "ROLE_USER"})
public class AppleWatchController {

    final static Logger logger = LogManager.getLogger(AppleWatchController.class.getName());

    /**
     * injecting AppleWatchService into this class
     */
    @Autowired
    private AppleWatchService appleWatchService;

    @Autowired
    private DownloadUtil downloadUtil;



    @RequestMapping(value = "/applewatch/uploadview", method = RequestMethod.GET)
    @ApiOperation(value = "Apple Watch view", notes = "Returns the Apple Watch view page", response = ModelAndView.class)
    public ModelAndView getUploadView() throws Exception {
        logger.info("in AppleWatchController/getUploadView");

        ModelAndView model = new ModelAndView("appleWatchFileUpload");
        return model;
    }


    @RequestMapping(value = "/applewatch/upload", method = RequestMethod.POST)
    @ApiOperation(value = "Zip file upload", notes = "Uploading a zip file containing Apple Watch raw data and persisting it to database")
    @ApiResponses(value = {
            @ApiResponse(code = 415, message = "{success: false, message: Invalid file type}"),
            @ApiResponse(code = 200, message = "{success: true}, raw_data_id: XXXX}"),
            @ApiResponse(code = 406, message = "{success: false, message: One zip file is acceptable}"),
            @ApiResponse(code = 500, message = "{success: false, message: XYZ}")
    })
    @ApiImplicitParams({
            @ApiImplicitParam(name = "file", value = "the zipped file to be uploaded as multipart/form-data, " +
                    "being processData: false, contentType: false in the ajax request.\n" +
                    "A sample ajax request is as follows:\n\n" +
                    "--------begin example-------\n" +
                    "var formData = new FormData();\n" +
                    "formData.append('fname', 'applewatch.zip');\n" +
                    "formData.append('data', blob);\n" +
                    "$.ajax({\n" +
                    "type: 'POST',\n" +
                    "                            url: '/rest/beapengine/applewatch/upload',\n" +
                    "                            data: formData,\n" +
                    "                            processData: false,\n" +
                    "                            contentType: false,\n" +
                    "                            success: function (data, status, xhr) {\n" +
                    "                                console.log('status: ' + status + ', data: ' + data);\n" +
                    "                            },\n" +
                    "                            error: function (jqXhr, textStatus, errorMessage) {\n" +
                    "                                var result = JSON.parse(jqXhr.responseText);\n" +
                    "                                console.log(\"error: \" + result)\n" +
                    "                            }\n" +
                    "                        });\n" +
                    "--------end example-------\n",
                    type = "POST",
                    required = true, paramType = "blob")
    })
    public ResponseEntity<JSONObject> upload(@ApiIgnore MultipartHttpServletRequest request) {

        logger.info("in AppleWatchController/upload");

        HttpSession session = request.getSession(false);
        if(session == null || !request.isRequestedSessionIdValid()) { // invalid session
            JSONObject jsonObject = new JSONObject();
            jsonObject.put(BeapEngineConstants.SUCCESS_STR, false);
            jsonObject.put("message", "Invalid session");
            jsonObject.put("status_code", HttpStatus.NON_AUTHORITATIVE_INFORMATION.value());

            return new ResponseEntity<>(jsonObject, (HttpStatus.valueOf((int)jsonObject.get("status_code"))));
        }

        SessionDetails sessionDetails = (SessionDetails) session.getAttribute("SESSION_DETAILS");

        JSONObject result = appleWatchService.UploadAndPersist(request.getFileMap(), sessionDetails.getUserId());
        return new ResponseEntity<>(result, (HttpStatus.valueOf((int)result.get("status_code"))));
    }


    @RequestMapping(value = "/applewatch/process/{id}", method = RequestMethod.GET)
    @ApiOperation(value = "Apple Watch data processing", notes = "Processing the user's Apple Watch data, which has been uploaded before.")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "{success: true, processed_id: XXXX}"),
            @ApiResponse(code = 500, message = "{success: false, message: XYZ}")
    })
    public ResponseEntity<JSONObject> processFiles(
            @ApiParam(value = "id of the file to be processed, which is the raw data id", required = true)
            @PathVariable("id") String rawDataId) {

        logger.info("in AppleWatchController/processFiles");

        JSONObject result = appleWatchService.processData(Long.parseLong(rawDataId));

        return new ResponseEntity<>(result, (HttpStatus.valueOf((int)result.get("status_code"))));
    }


    @RequestMapping(value = "/applewatch/predict/{id}/{predictionmodel}", method = RequestMethod.GET)
    @ApiOperation(value = "Apple Watch data prediction", notes = "Predicting the user's Apple Watch data, which has been processed before.")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "{success: true, predicted_id: XXXX}"),
            @ApiResponse(code = 406, message = "{success: false, message: Invalid predictionModel}"),
            @ApiResponse(code = 500, message = "{success: false, message: XYZ}")
    })
    public ResponseEntity<JSONObject> predictAppleWatch(
            @ApiParam(value = "id of the file to be predicted, which is the processed data id", required = true)
            @PathVariable("id") String processedDataId,
            @ApiParam(value = "the machine learning model: svm, randomForest, rotationForest, decissionTree", required = true)
            @PathVariable("predictionmodel") String predictionModel) {

        logger.info("in AppleWatchController/predictFitbit");

        JSONObject result = appleWatchService.predictData(Long.parseLong(processedDataId), predictionModel);

        return new ResponseEntity<>(result, (HttpStatus.valueOf((int)result.get("status_code"))));
    }


    @RequestMapping(value = "/applewatch/download_file/{id}/{type}", method = RequestMethod.GET)
    @ApiOperation(value = "Apple Watch file download", notes = "Downloading the processed/predicted Apple Watch files")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "{success: true, file: the_file}"),
            @ApiResponse(code = 404, message = "{success: false, message: Requested .zip file not found at the server}"),
    })
    public ResponseEntity<JSONObject> downloadAppleWatch(HttpServletRequest req, HttpServletResponse resp,
                                                     @ApiParam(value = "id of the file to be downloaded", required = true)
                                                     @PathVariable("id") String id,
                                                     @ApiParam(value = "type of file to be downloaded: process or predict", required = true)
                                                     @PathVariable("type") String type) {

        logger.info("in AppleWatchController/downloadFitbit");
        JSONObject jsonObject = new JSONObject();

        byte[] downloadedFile = appleWatchService.download(id, type);

        if (downloadedFile != null) {

            jsonObject.put(BeapEngineConstants.SUCCESS_STR, true);
            jsonObject.put("status_code", HttpStatus.OK.value());
            jsonObject.put("file", downloadedFile);
            return new ResponseEntity<>(jsonObject, HttpStatus.OK);

        } else {
            logger.info("Requested .zip file not found at the server");
            jsonObject.put(BeapEngineConstants.SUCCESS_STR, false);
            jsonObject.put("message", "Requested .zip file not found at the server");
            jsonObject.put("status_code", HttpStatus.NOT_FOUND.value());
            return new ResponseEntity<>(jsonObject, HttpStatus.NOT_FOUND);
        }
    }


    @RequestMapping(value = "/applewatch/list/{type}", method = RequestMethod.GET)
    @ApiOperation(value = "Apple Watch data list", notes = "List the user's Apple Watch data.")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "{success: true, predicted_id: XXXX}"),
            @ApiResponse(code = 406, message = "{success: false, message: Invalid predictionModel}"),
            @ApiResponse(code = 500, message = "{success: false, message: XYZ}")
    })
    public ResponseEntity<JSONObject> list(HttpServletRequest request,
                                           @ApiParam(value = "type of the apple watch data to be listed: raw, processed, predicted", required = true)
                                           @PathVariable("type") String type) {

        logger.info("in AppleWatchController/list");

        HttpSession session = request.getSession(false);
        if(session == null || !request.isRequestedSessionIdValid()) { // invalid session
            JSONObject jsonObject = new JSONObject();
            jsonObject.put(BeapEngineConstants.SUCCESS_STR, false);
            jsonObject.put("message", "Invalid session");
            jsonObject.put("status_code", HttpStatus.NON_AUTHORITATIVE_INFORMATION.value());

            return new ResponseEntity<>(jsonObject, (HttpStatus.valueOf((int)jsonObject.get("status_code"))));
        }

        SessionDetails sessionDetails = (SessionDetails) session.getAttribute("SESSION_DETAILS");

        JSONObject result = appleWatchService.list(sessionDetails.getUserId(), type);

        return new ResponseEntity<>(result, (HttpStatus.valueOf((int)result.get("status_code"))));
    }
}
