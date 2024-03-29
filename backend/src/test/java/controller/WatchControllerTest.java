package controller;

import com.beaplab.BeaplabEngine.authentication.SessionDetails;
import com.beaplab.BeaplabEngine.constants.BeapEngineConstants;
import com.beaplab.BeaplabEngine.controller.AccessGroupController;
import com.beaplab.BeaplabEngine.controller.WatchController;
import com.beaplab.BeaplabEngine.metadata.AccessGroupDto;
import com.beaplab.BeaplabEngine.metadata.ProcessedDataDto;
import com.beaplab.BeaplabEngine.metadata.UserDto;
import com.beaplab.BeaplabEngine.model.AccessGroup;
import com.beaplab.BeaplabEngine.model.User;
import com.beaplab.BeaplabEngine.repository.AccessGroupDao;
import com.beaplab.BeaplabEngine.repository.UserDao;
import com.beaplab.BeaplabEngine.repository.base.BaseRepository;
import com.beaplab.BeaplabEngine.service.AccessGroupService;
import com.beaplab.BeaplabEngine.service.AppleWatchService;
import com.beaplab.BeaplabEngine.service.FitbitService;
import com.beaplab.BeaplabEngine.service.IncorrectLoginsService;
import com.beaplab.BeaplabEngine.service.UserService;
import com.beaplab.BeaplabEngine.util.error.UserAlreadyExistException;
import com.beaplab.BeaplabEngine.util.objectMapper.AccessGroupMapper;
import com.beaplab.BeaplabEngine.util.objectMapper.UserMapper;
import com.rollbar.notifier.Rollbar;

import javassist.bytecode.ByteArray;

import org.springframework.web.multipart.MultipartFile;

import org.json.simple.JSONObject;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.*;
import org.mockito.runners.MockitoJUnitRunner;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.mock.web.MockMultipartHttpServletRequest;
import org.springframework.web.servlet.ModelAndView;

import java.io.InputStream;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpSession;
import javax.swing.tree.ExpandVetoException;

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
     */
    @Test
    public void testGetUploadView() {
        ModelAndView expected = new ModelAndView("fitbitFileUpload");

        ModelAndView result = watchController.getUploadView("fitbit");
        assertEquals(expected.getViewName(), result.getViewName());

        expected = new ModelAndView("appleWatchFileUpload");
        result = watchController.getUploadView("applewatch");
        assertEquals(expected.getViewName(), result.getViewName());

    }

    /**
     * T5.44
     */
    @Test
    public void testUpload() {
        // upload Apple
        JSONObject mockedReturn = new JSONObject();
        mockedReturn.put(BeapEngineConstants.SUCCESS_STR, true);
        mockedReturn.put("raw_data_id", 123);
        mockedReturn.put("status_code", HttpStatus.OK.value());

        Map<String, MultipartFile> fileMap;

        // mocking request and session details
        // MockHttpServletRequest request = new MockHttpServletRequest();

        byte[] bytes = { 1, 2, 3 };
        MockMultipartFile file = new MockMultipartFile("123", bytes);

        MockMultipartHttpServletRequest request = new MockMultipartHttpServletRequest();
        request.setSession(httpSession);
        request.addFile(file);

        SessionDetails session = new SessionDetails();
        session.setUserId(1L);

        when(appleWatchService.UploadAndPersist(request.getFileMap(), 1L)).thenReturn(mockedReturn);
        when(fitbitService.UploadAndPersist(request.getFileMap(), 1L)).thenReturn(mockedReturn);

        when(httpSession.getAttribute("SESSION_DETAILS")).thenReturn(session);

        /**
         * apple
         */
        ResponseEntity<JSONObject> responseEntity = watchController.upload("applewatch", request);

        HttpStatus expectedStatus = HttpStatus.OK;
        HttpStatus resultStatus = responseEntity.getStatusCode();

        assertEquals(expectedStatus, resultStatus);
        assertEquals(mockedReturn, responseEntity.getBody());

        /**
         * fitbit
         */
        responseEntity = watchController.upload("fitbit", request);
        resultStatus = responseEntity.getStatusCode();

        assertEquals(expectedStatus, resultStatus);
        assertEquals(mockedReturn, responseEntity.getBody());
    }

    /**
     * T5.44
     */
    @Test
    public void testUploadWithInvalidData() {

    }

    /**
     * 
     */
    @Test
    public void testProcessFiles() {

    }

    /**
     * 
     */
    @Test
    public void testPredictWatch() {

    }

    /**
     * 
     */
    @Test
    public void testDownloadFile() {

    }

    /**
     * 
     */
    @Test
    public void testListAppleProcessed() {
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
