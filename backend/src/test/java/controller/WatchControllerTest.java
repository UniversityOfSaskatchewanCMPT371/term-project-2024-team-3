package controller;

import com.beaplab.BeaplabEngine.authentication.SessionDetails;
import com.beaplab.BeaplabEngine.constants.BeapEngineConstants;
import com.beaplab.BeaplabEngine.controller.WatchController;
import com.beaplab.BeaplabEngine.metadata.ProcessedDataDto;
import com.beaplab.BeaplabEngine.service.AppleWatchService;
import com.beaplab.BeaplabEngine.service.FitbitService;
import com.rollbar.notifier.Rollbar;

import org.json.simple.JSONObject;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.*;
import org.mockito.runners.MockitoJUnitRunner;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.mock.web.MockMultipartHttpServletRequest;
import org.springframework.web.servlet.ModelAndView;

import java.util.ArrayList;

import javax.servlet.http.HttpSession;

import static org.junit.Assert.*;
import static utils.MockFactory.*;
import static org.mockito.Mockito.*;

@RunWith(MockitoJUnitRunner.class)
public class WatchControllerTest {
    @InjectMocks
    private WatchController watchController;

    // mock services
    @Mock
    private AppleWatchService appleWatchService;

    @Mock
    private FitbitService fitbitService;

    @Mock
    private Rollbar rollbar;

    @Mock
    private HttpSession httpSession;

    @Before
    public void setUp() {
        MockitoAnnotations.initMocks(this);
    }

    /**
     * T5.43
     * 
     */
    @Test
    public void testGetUploadViewFitbit() {
        ModelAndView expected = new ModelAndView("fitbitFileUpload");

        ModelAndView result = watchController.getUploadView("fitbit");

        assertEquals(expected.getViewName(), result.getViewName());
    }

    /**
     * T5.44
     * 
     */
    @Test
    public void testGetUploadViewAppleWatch() {
        ModelAndView expected = new ModelAndView("appleWatchFileUpload");
        ModelAndView result = watchController.getUploadView("applewatch");

        assertEquals(expected.getViewName(), result.getViewName());
    }

    /**
     * T5.45
     * 
     */
    @Test
    public void testGetUploadViewInvalidWatch() {
        ModelAndView result = watchController.getUploadView("jibberish");

        assertNull(null, result);
    }

    /**
     * T5.46
     */
    @Test
    public void testUploadFitbit() {
        JSONObject mockedReturn = new JSONObject();
        mockedReturn.put(BeapEngineConstants.SUCCESS_STR, true);
        mockedReturn.put("raw_data_id", 123);
        mockedReturn.put("status_code", HttpStatus.OK.value());

        // mocking request and session details
        byte[] bytes = { 1, 2, 3 };
        MockMultipartFile file = new MockMultipartFile("123", bytes);

        MockMultipartHttpServletRequest request = new MockMultipartHttpServletRequest();
        request.setSession(httpSession);
        request.addFile(file);

        SessionDetails session = new SessionDetails();
        session.setUserId(1L);

        when(fitbitService.UploadAndPersist(request.getFileMap(), 1L)).thenReturn(mockedReturn);
        when(httpSession.getAttribute("SESSION_DETAILS")).thenReturn(session);

        /**
         * fitbit
         */
        ResponseEntity<JSONObject> responseEntity = watchController.upload("fitbit", request);

        HttpStatus expectedStatus = HttpStatus.OK;
        HttpStatus resultStatus = responseEntity.getStatusCode();

        assertEquals(expectedStatus, resultStatus);
        assertEquals(mockedReturn, responseEntity.getBody());
    }

    /**
     * T5.47
     */
    @Test
    public void testUploadFitbitNoData() {
        JSONObject mockedReturn = new JSONObject();
        mockedReturn.put(BeapEngineConstants.SUCCESS_STR, false);
        mockedReturn.put("message", "Persisting raw data failed");
        mockedReturn.put("status_code", HttpStatus.INTERNAL_SERVER_ERROR.value());

        // mocking request and session details
        byte[] bytes = { 1, 2, 3 };
        MockMultipartFile file = new MockMultipartFile("123", bytes);

        MockMultipartHttpServletRequest request = new MockMultipartHttpServletRequest();
        request.setSession(httpSession);
        request.addFile(file);

        SessionDetails session = new SessionDetails();
        session.setUserId(1L);

        when(fitbitService.UploadAndPersist(request.getFileMap(), 1L)).thenReturn(mockedReturn);
        when(httpSession.getAttribute("SESSION_DETAILS")).thenReturn(session);

        /**
         * apple
         */
        ResponseEntity<JSONObject> responseEntity = watchController.upload("fitbit", request);

        HttpStatus expectedStatus = HttpStatus.INTERNAL_SERVER_ERROR;
        HttpStatus resultStatus = responseEntity.getStatusCode();

        assertEquals(expectedStatus, resultStatus);
        assertEquals(mockedReturn, responseEntity.getBody());
    }

    /**
     * T5.48
     */
    @Test
    public void testUploadApple() {
        JSONObject mockedReturn = new JSONObject();
        mockedReturn.put(BeapEngineConstants.SUCCESS_STR, true);
        mockedReturn.put("raw_data_id", 123);
        mockedReturn.put("status_code", HttpStatus.OK.value());

        // mocking request and session details
        byte[] bytes = { 1, 2, 3 };
        MockMultipartFile file = new MockMultipartFile("123", bytes);

        MockMultipartHttpServletRequest request = new MockMultipartHttpServletRequest();
        request.setSession(httpSession);
        request.addFile(file);

        SessionDetails session = new SessionDetails();
        session.setUserId(1L);

        when(appleWatchService.UploadAndPersist(request.getFileMap(), 1L)).thenReturn(mockedReturn);
        when(httpSession.getAttribute("SESSION_DETAILS")).thenReturn(session);

        /**
         * apple
         */
        ResponseEntity<JSONObject> responseEntity = watchController.upload("applewatch", request);

        HttpStatus expectedStatus = HttpStatus.OK;
        HttpStatus resultStatus = responseEntity.getStatusCode();

        assertEquals(expectedStatus, resultStatus);
        assertEquals(mockedReturn, responseEntity.getBody());
    }

    /**
     * T5.49
     */
    @Test
    public void testUploadAppleNoData() {
        JSONObject mockedReturn = new JSONObject();
        mockedReturn.put(BeapEngineConstants.SUCCESS_STR, false);
        mockedReturn.put("message", "Persisting raw data failed");
        mockedReturn.put("status_code", HttpStatus.INTERNAL_SERVER_ERROR.value());

        // mocking request and session details
        byte[] bytes = { 1, 2, 3 };
        MockMultipartFile file = new MockMultipartFile("123", bytes);

        MockMultipartHttpServletRequest request = new MockMultipartHttpServletRequest();
        request.setSession(httpSession);
        request.addFile(file);

        SessionDetails session = new SessionDetails();
        session.setUserId(1L);

        when(appleWatchService.UploadAndPersist(request.getFileMap(), 1L)).thenReturn(mockedReturn);
        when(httpSession.getAttribute("SESSION_DETAILS")).thenReturn(session);

        /**
         * apple
         */
        ResponseEntity<JSONObject> responseEntity = watchController.upload("applewatch", request);

        HttpStatus expectedStatus = HttpStatus.INTERNAL_SERVER_ERROR;
        HttpStatus resultStatus = responseEntity.getStatusCode();

        assertEquals(expectedStatus, resultStatus);
        assertEquals(mockedReturn, responseEntity.getBody());
    }

    /**
     * T5.50
     */
    @Test
    public void testUploadInvalidWatch() {
        JSONObject mockedReturn = new JSONObject();
        mockedReturn.put(BeapEngineConstants.SUCCESS_STR, false);
        mockedReturn.put("message", "Invalid watch type in url");
        mockedReturn.put("status_code", 400);

        // mocking request and session details
        byte[] bytes = { 1, 2, 3 };
        MockMultipartFile file = new MockMultipartFile("123", bytes);

        MockMultipartHttpServletRequest request = new MockMultipartHttpServletRequest();
        request.setSession(httpSession);
        request.addFile(file);

        SessionDetails session = new SessionDetails();
        session.setUserId(1L);

        when(httpSession.getAttribute("SESSION_DETAILS")).thenReturn(session);

        ResponseEntity<JSONObject> responseEntity = watchController.upload("jibberish", request);

        HttpStatus expectedStatus = HttpStatus.valueOf(400);
        HttpStatus resultStatus = responseEntity.getStatusCode();

        assertEquals(expectedStatus, resultStatus);
        assertEquals(mockedReturn, responseEntity.getBody());
    }

    /**
     * T5.51
     */
    @Test
    public void testUploadInvalidSession() {
        JSONObject mockedReturn = new JSONObject();
        mockedReturn.put(BeapEngineConstants.SUCCESS_STR, false);
        mockedReturn.put("message", "Invalid session");
        mockedReturn.put("status_code", HttpStatus.NON_AUTHORITATIVE_INFORMATION.value());

        // mocking request and session details
        byte[] bytes = { 1, 2, 3 };
        MockMultipartFile file = new MockMultipartFile("123", bytes);

        MockMultipartHttpServletRequest request = new MockMultipartHttpServletRequest();
        request.setSession(null);
        request.addFile(file);

        SessionDetails session = new SessionDetails();
        session.setUserId(1L);

        ResponseEntity<JSONObject> responseEntity = watchController.upload("apple", request);

        HttpStatus expectedStatus = HttpStatus.NON_AUTHORITATIVE_INFORMATION;
        HttpStatus resultStatus = responseEntity.getStatusCode();

        assertEquals(expectedStatus, resultStatus);
        assertEquals(mockedReturn, responseEntity.getBody());
    }

    /**
     * T5.52
     */
    @Test
    public void testProcessFilesApple() {
        JSONObject mockedReturn = new JSONObject();
        mockedReturn.put(BeapEngineConstants.SUCCESS_STR, true);
        mockedReturn.put("processed_id", "processedDataId");
        mockedReturn.put("status_code", HttpStatus.OK.value());

        SessionDetails session = new SessionDetails();
        session.setUserId(1L);

        when(appleWatchService.processData(123L)).thenReturn(mockedReturn);

        when(httpSession.getAttribute("SESSION_DETAILS")).thenReturn(session);

        /**
         * apple
         */
        ResponseEntity<JSONObject> responseEntity = watchController.processFiles("123", "applewatch");

        HttpStatus expectedStatus = HttpStatus.OK;
        HttpStatus resultStatus = responseEntity.getStatusCode();

        assertEquals(expectedStatus, resultStatus);
        assertEquals(mockedReturn, responseEntity.getBody());
    }

    /**
     * T5.53
     */
    @Test
    public void testProcessFilesFitbit() {
        JSONObject mockedReturn = new JSONObject();
        mockedReturn.put(BeapEngineConstants.SUCCESS_STR, true);
        mockedReturn.put("processed_id", "processedDataId");
        mockedReturn.put("status_code", HttpStatus.OK.value());

        SessionDetails session = new SessionDetails();
        session.setUserId(1L);

        when(fitbitService.processData(123L)).thenReturn(mockedReturn);

        when(httpSession.getAttribute("SESSION_DETAILS")).thenReturn(session);

        /**
         * fitbit
         */
        ResponseEntity<JSONObject> responseEntity = watchController.processFiles("123", "fitbit");

        HttpStatus expectedStatus = HttpStatus.OK;
        HttpStatus resultStatus = responseEntity.getStatusCode();

        assertEquals(expectedStatus, resultStatus);
        assertEquals(mockedReturn, responseEntity.getBody());
    }

    /**
     * T5.54
     */
    @Test
    public void testProcessFilesInvalidWatch() {
        JSONObject mockedReturn = new JSONObject();
        mockedReturn.put(BeapEngineConstants.SUCCESS_STR, false);
        mockedReturn.put("message", "Invalid watch type in url");
        mockedReturn.put("status_code", 400);

        SessionDetails session = new SessionDetails();
        session.setUserId(1L);

        when(httpSession.getAttribute("SESSION_DETAILS")).thenReturn(session);

        /**
         * invalid
         */
        ResponseEntity<JSONObject> responseEntity = watchController.processFiles("123", "jibberish");

        HttpStatus expectedStatus = HttpStatus.valueOf(400);
        HttpStatus resultStatus = responseEntity.getStatusCode();

        assertEquals(expectedStatus, resultStatus);
        assertEquals(mockedReturn, responseEntity.getBody());
    }

    /**
     * T5.55
     */
    @Test
    public void testPredictWatchApple() {
        JSONObject mockedReturn = new JSONObject();
        mockedReturn.put(BeapEngineConstants.SUCCESS_STR, true);
        mockedReturn.put("predicted_id", 123);
        mockedReturn.put("status_code", HttpStatus.OK.value());

        SessionDetails session = new SessionDetails();
        session.setUserId(1L);

        when(appleWatchService.predictData(123L, "svm")).thenReturn(mockedReturn);

        when(httpSession.getAttribute("SESSION_DETAILS")).thenReturn(session);

        /**
         * apple
         */
        ResponseEntity<JSONObject> responseEntity = watchController.predictWatch("123", "svm", "applewatch");

        HttpStatus expectedStatus = HttpStatus.OK;
        HttpStatus resultStatus = responseEntity.getStatusCode();

        assertEquals(expectedStatus, resultStatus);
        assertEquals(mockedReturn, responseEntity.getBody());
    }

    /**
     * T5.56
     */
    @Test
    public void testPredictWatchFitbit() {
        JSONObject mockedReturn = new JSONObject();
        mockedReturn.put(BeapEngineConstants.SUCCESS_STR, true);
        mockedReturn.put("predicted_id", 123);
        mockedReturn.put("status_code", HttpStatus.OK.value());

        SessionDetails session = new SessionDetails();
        session.setUserId(1L);

        when(fitbitService.predictData(123L, "svm")).thenReturn(mockedReturn);

        when(httpSession.getAttribute("SESSION_DETAILS")).thenReturn(session);

        /**
         * fitbit
         */
        ResponseEntity<JSONObject> responseEntity = watchController.predictWatch("123", "svm", "fitbit");

        HttpStatus expectedStatus = HttpStatus.OK;
        HttpStatus resultStatus = responseEntity.getStatusCode();

        assertEquals(expectedStatus, resultStatus);
        assertEquals(mockedReturn, responseEntity.getBody());
    }

    /**
     * T5.57
     */
    @Test
    public void testPredictWatchInvalidWatch() {
        JSONObject mockedReturn = new JSONObject();
        mockedReturn.put(BeapEngineConstants.SUCCESS_STR, false);
        mockedReturn.put("message", "Invalid watch type in url");
        mockedReturn.put("status_code", 400);

        SessionDetails session = new SessionDetails();
        session.setUserId(1L);

        when(httpSession.getAttribute("SESSION_DETAILS")).thenReturn(session);

        /**
         * invalid
         */
        ResponseEntity<JSONObject> responseEntity = watchController.predictWatch("123", "svm", "jibberish");

        HttpStatus expectedStatus = HttpStatus.valueOf(400);
        HttpStatus resultStatus = responseEntity.getStatusCode();

        assertEquals(expectedStatus, resultStatus);
        assertEquals(mockedReturn, responseEntity.getBody());
    }

    /**
     * T5.58
     */
    @Test
    public void testDownloadFileApple() {

        byte[] bytes = { 1, 2, 3 };

        JSONObject mockedReturn = new JSONObject();
        mockedReturn.put(BeapEngineConstants.SUCCESS_STR, true);
        mockedReturn.put("file", bytes);
        mockedReturn.put("status_code", HttpStatus.OK.value());

        when(appleWatchService.download("1", "process")).thenReturn(bytes);

        // mocking request and session details
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setSession(httpSession);

        MockHttpServletResponse response = new MockHttpServletResponse();

        SessionDetails session = new SessionDetails();
        session.setUserId(1L);

        when(httpSession.getAttribute("SESSION_DETAILS")).thenReturn(session);

        ResponseEntity<JSONObject> responseEntity = watchController.downloadFile(request, response, "1", "process",
                "applewatch");

        HttpStatus expectedStatus = HttpStatus.OK;
        HttpStatus resultStatus = responseEntity.getStatusCode();

        assertEquals(expectedStatus, resultStatus);
        assertEquals(mockedReturn, responseEntity.getBody());
    }

    /**
     * T5.59
     */
    @Test
    public void testDownloadFileAppleFileNotFound() {
        JSONObject mockedReturn = new JSONObject();
        mockedReturn.put(BeapEngineConstants.SUCCESS_STR, false);
        mockedReturn.put("message", "Requested .zip file not found at the server");
        mockedReturn.put("status_code", HttpStatus.NOT_FOUND.value());

        when(appleWatchService.download("1", "process")).thenReturn(null);

        // mocking request and session details
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setSession(httpSession);

        MockHttpServletResponse response = new MockHttpServletResponse();

        SessionDetails session = new SessionDetails();
        session.setUserId(1L);

        when(httpSession.getAttribute("SESSION_DETAILS")).thenReturn(session);

        ResponseEntity<JSONObject> responseEntity = watchController.downloadFile(request, response, "1", "process",
                "applewatch");

        HttpStatus expectedStatus = HttpStatus.NOT_FOUND;
        HttpStatus resultStatus = responseEntity.getStatusCode();

        assertEquals(expectedStatus, resultStatus);
        assertEquals(mockedReturn, responseEntity.getBody());
    }

    /**
     * T5.60
     */
    @Test
    public void testDownloadFileFitbit() {

        byte[] bytes = { 1, 2, 3 };

        JSONObject mockedReturn = new JSONObject();
        mockedReturn.put(BeapEngineConstants.SUCCESS_STR, true);
        mockedReturn.put("file", bytes);
        mockedReturn.put("status_code", HttpStatus.OK.value());

        when(fitbitService.download("1", "process")).thenReturn(bytes);

        // mocking request and session details
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setSession(httpSession);

        MockHttpServletResponse response = new MockHttpServletResponse();

        SessionDetails session = new SessionDetails();
        session.setUserId(1L);

        when(httpSession.getAttribute("SESSION_DETAILS")).thenReturn(session);

        ResponseEntity<JSONObject> responseEntity = watchController.downloadFile(request, response, "1", "process",
                "fitbit");

        HttpStatus expectedStatus = HttpStatus.OK;
        HttpStatus resultStatus = responseEntity.getStatusCode();

        assertEquals(expectedStatus, resultStatus);
        assertEquals(mockedReturn, responseEntity.getBody());
    }

    /**
     * T5.61
     */
    @Test
    public void testDownloadFileFitbitFileNotFound() {
        JSONObject mockedReturn = new JSONObject();
        mockedReturn.put(BeapEngineConstants.SUCCESS_STR, false);
        mockedReturn.put("message", "Requested .zip file not found at the server");
        mockedReturn.put("status_code", HttpStatus.NOT_FOUND.value());

        when(fitbitService.download("1", "process")).thenReturn(null);

        // mocking request and session details
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setSession(httpSession);

        MockHttpServletResponse response = new MockHttpServletResponse();

        SessionDetails session = new SessionDetails();
        session.setUserId(1L);

        when(httpSession.getAttribute("SESSION_DETAILS")).thenReturn(session);

        ResponseEntity<JSONObject> responseEntity = watchController.downloadFile(request, response, "1", "process",
                "fitbit");

        HttpStatus expectedStatus = HttpStatus.NOT_FOUND;
        HttpStatus resultStatus = responseEntity.getStatusCode();

        assertEquals(expectedStatus, resultStatus);
        assertEquals(mockedReturn, responseEntity.getBody());
    }

    /**
     * T5.62
     */
    @Test
    public void testDownloadFileInvalidWatch() {
        JSONObject mockedReturn = new JSONObject();
        mockedReturn.put(BeapEngineConstants.SUCCESS_STR, false);
        mockedReturn.put("message", "Invalid watch type in url");
        mockedReturn.put("status_code", 400);

        // mocking request and session details
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setSession(httpSession);

        MockHttpServletResponse response = new MockHttpServletResponse();

        SessionDetails session = new SessionDetails();
        session.setUserId(1L);

        when(httpSession.getAttribute("SESSION_DETAILS")).thenReturn(session);

        ResponseEntity<JSONObject> responseEntity = watchController.downloadFile(request, response, "1", "process",
                "jibberish");

        HttpStatus expectedStatus = HttpStatus.valueOf(400);
        HttpStatus resultStatus = responseEntity.getStatusCode();

        assertEquals(expectedStatus, resultStatus);
        assertEquals(mockedReturn, responseEntity.getBody());
    }

    /**
     * T5.63
     */
    @Test
    public void testListProcessedApple() {
        ArrayList<ProcessedDataDto> mockedData = new ArrayList<>();
        mockedData.add(mockProcessedDataDto());
        mockedData.add(mockProcessedDataDto());

        JSONObject mockedReturn = new JSONObject();
        mockedReturn.put(BeapEngineConstants.SUCCESS_STR, true);
        mockedReturn.put("list", mockedData);
        mockedReturn.put("status_code", HttpStatus.OK.value());

        when(appleWatchService.list(1L, "processed")).thenReturn(mockedReturn);

        // mocking request and session details
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setSession(httpSession);

        SessionDetails session = new SessionDetails();
        session.setUserId(1L);

        when(httpSession.getAttribute("SESSION_DETAILS")).thenReturn(session);

        ResponseEntity<JSONObject> responseEntity = watchController.list(request, "processed", "applewatch");

        HttpStatus expectedStatus = HttpStatus.OK;
        HttpStatus resultStatus = responseEntity.getStatusCode();

        assertEquals(expectedStatus, resultStatus);
        assertEquals(mockedReturn, responseEntity.getBody());
    }

    /**
     * T5.64
     */
    @Test
    public void testListProcessedFitbit() {
        ArrayList<ProcessedDataDto> mockedData = new ArrayList<>();
        mockedData.add(mockProcessedDataDto());
        mockedData.add(mockProcessedDataDto());

        JSONObject mockedReturn = new JSONObject();
        mockedReturn.put(BeapEngineConstants.SUCCESS_STR, true);
        mockedReturn.put("list", mockedData);
        mockedReturn.put("status_code", HttpStatus.OK.value());

        when(fitbitService.list(1L, "processed")).thenReturn(mockedReturn);

        // mocking request and session details
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setSession(httpSession);

        SessionDetails session = new SessionDetails();
        session.setUserId(1L);

        when(httpSession.getAttribute("SESSION_DETAILS")).thenReturn(session);

        ResponseEntity<JSONObject> responseEntity = watchController.list(request, "processed", "fitbit");

        HttpStatus expectedStatus = HttpStatus.OK;
        HttpStatus resultStatus = responseEntity.getStatusCode();

        assertEquals(expectedStatus, resultStatus);
        assertEquals(mockedReturn, responseEntity.getBody());
    }

    /**
     * T5.65
     */
    @Test
    public void testListProcessedInvalidWatch() {
        ArrayList<ProcessedDataDto> mockedData = new ArrayList<>();
        mockedData.add(mockProcessedDataDto());
        mockedData.add(mockProcessedDataDto());

        JSONObject mockedReturn = new JSONObject();
        mockedReturn.put(BeapEngineConstants.SUCCESS_STR, false);
        mockedReturn.put("message", "Invalid watch type in url");
        mockedReturn.put("status_code", 400);

        // mocking request and session details
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setSession(httpSession);

        SessionDetails session = new SessionDetails();
        session.setUserId(1L);

        when(httpSession.getAttribute("SESSION_DETAILS")).thenReturn(session);

        ResponseEntity<JSONObject> responseEntity = watchController.list(request, "processed", "jibberish");

        HttpStatus expectedStatus = HttpStatus.valueOf(400);
        HttpStatus resultStatus = responseEntity.getStatusCode();

        assertEquals(expectedStatus, resultStatus);
        assertEquals(mockedReturn, responseEntity.getBody());
    }

    /**
     * T5.66
     */
    @Test
    public void testListInvalidSession() {
        JSONObject mockedReturn = new JSONObject();
        mockedReturn.put(BeapEngineConstants.SUCCESS_STR, false);
        mockedReturn.put("message", "Invalid session");
        mockedReturn.put("status_code", HttpStatus.NON_AUTHORITATIVE_INFORMATION.value());

        // mocking request and session details
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setSession(null);

        MockHttpServletResponse response = new MockHttpServletResponse();

        SessionDetails session = new SessionDetails();
        session.setUserId(1L);

        ResponseEntity<JSONObject> responseEntity = watchController.list(request, "process",
                "applewatch");

        HttpStatus expectedStatus = HttpStatus.NON_AUTHORITATIVE_INFORMATION;
        HttpStatus resultStatus = responseEntity.getStatusCode();

        assertEquals(expectedStatus, resultStatus);
        assertEquals(mockedReturn, responseEntity.getBody());
    }

}
