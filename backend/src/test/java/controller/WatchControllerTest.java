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
     * T5.43
     * 
     */
    @Test
    public void testGetUploadViewAppleWatch() {
        ModelAndView expected = new ModelAndView("appleWatchFileUpload");
        ModelAndView result = watchController.getUploadView("applewatch");

        assertEquals(expected.getViewName(), result.getViewName());
    }

    /**
     * T5.43
     * 
     */
    @Test
    public void testGetUploadViewInvalidWatch() {
        ModelAndView result = watchController.getUploadView("jibberish");

        assertNull(null, result);
    }

    /**
     * T5.44
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
     * T5.44
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
     * T5.44
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
     * T5.44
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
     * T5.44
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
     * 
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
    * 
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
    * 
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
     * 
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
    * 
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
    * 
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
     * 
     */
    @Test
    public void testDownloadFile() {

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
     * 
     */
    @Test
    public void testListProcessed() {
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

}
