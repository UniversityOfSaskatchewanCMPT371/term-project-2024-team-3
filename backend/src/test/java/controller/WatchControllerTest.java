package controller;

import com.beaplab.BeaplabEngine.constants.BeapEngineConstants;
import com.beaplab.BeaplabEngine.controller.AccessGroupController;
import com.beaplab.BeaplabEngine.controller.WatchController;
import com.beaplab.BeaplabEngine.metadata.AccessGroupDto;
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
import org.json.simple.JSONObject;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.*;
import org.mockito.runners.MockitoJUnitRunner;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import static org.junit.Assert.*;
import static utils.MockFactory.*;
import static org.mockito.Mockito.*;

@RunWith(MockitoJUnitRunner.class)
public class WatchControllerTest {
    @InjectMocks
    private WatchController watchController;

    @Mock
    private AppleWatchService appleWatchService;

    @Mock
    private FitbitService fitbitService;

    @Before
    public void setUp() {
        MockitoAnnotations.initMocks(this);
    }



    /**
     * 
     */
    @Test
    public void testGetUploadView(){
        
    }

    /**
     * 
     */
    @Test
    public void testUpload(){
        
    }


    /**
     * 
     */
    @Test
    public void testProcessFiles(){
        
    }


    /**
     * 
     */
    @Test
    public void testPredictWatch(){
        
    }

    /**
     * 
     */
    @Test
    public void testDownloadFile(){
        
    }


    /**
     * 
     */
    @Test
    public void testList(){
        
    }

}
