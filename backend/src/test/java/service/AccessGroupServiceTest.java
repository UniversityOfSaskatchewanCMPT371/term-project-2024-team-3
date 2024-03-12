package service;

import com.beaplab.BeaplabEngine.constants.BeapEngineConstants;
import com.beaplab.BeaplabEngine.metadata.UserDto;
import com.beaplab.BeaplabEngine.model.AccessGroup;
import com.beaplab.BeaplabEngine.model.User;
import com.beaplab.BeaplabEngine.repository.UserDao;
import com.beaplab.BeaplabEngine.repository.base.BaseRepository;
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
import java.util.ArrayList;
import java.util.List;
import org.springframework.http.HttpStatus;

import static org.junit.Assert.*;
import static utils.UserMockFactory.*;
import static org.mockito.Mockito.*;

@RunWith(MockitoJUnitRunner.class)

public class AccessGroupServiceTest {

    @InjectMocks
    private UserService userService;

    @Mock
    private AccessGroupMapper accessGroupMapper;

    @Mock
    private BaseRepository<AccessGroup> accessGroupDao;


    @Before
    public void setUp() {
        MockitoAnnotations.initMocks(this);
    }





}
