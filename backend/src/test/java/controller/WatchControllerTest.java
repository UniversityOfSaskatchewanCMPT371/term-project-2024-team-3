package controller;

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
import org.springframework.web.servlet.ModelAndView;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

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

    @Before
    public void setUp() {
        MockitoAnnotations.initMocks(this);
    }

    @Autowired
    // private final Rollbar rollbar;

    // public WatchControllerTest(Rollbar rollbar) {
    // this.rollbar = rollbar;
    // }

    /**
     * 
     */
    @Test
    public void testGetUploadView() {
        ModelAndView expected = new ModelAndView("fitbitFileUpload");

        ModelAndView result = watchController.getUploadView("fitbit");

        assertEquals(expected, result);
    }

    /**
     * 
     */
    @Test
    public void testUpload() {

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

        when(appleWatchService.list(1234L, "processed")).thenReturn(mockedReturn);

        MockHttpServletRequest request = new MockHttpServletRequest();
        request.getSession(true);

        ResponseEntity<JSONObject> responseEntity = watchController.list(request, "processed", "applewatch");

        HttpStatus expectedStatus = HttpStatus.OK;
        HttpStatus resultStatus = responseEntity.getStatusCode();

        assertEquals(expectedStatus, resultStatus);
        assertEquals(responseEntity.getBody(), mockedData);

    }

}
