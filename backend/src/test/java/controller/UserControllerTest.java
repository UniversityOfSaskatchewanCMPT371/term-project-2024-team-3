package controller;
import com.beaplab.BeaplabEngine.constants.BeapEngineConstants;
import com.beaplab.BeaplabEngine.controller.AccessGroupController;
import com.beaplab.BeaplabEngine.controller.UserController;
import com.beaplab.BeaplabEngine.metadata.AccessGroupDto;
import com.beaplab.BeaplabEngine.metadata.UserDto;
import com.beaplab.BeaplabEngine.model.AccessGroup;
import com.beaplab.BeaplabEngine.model.User;
import com.beaplab.BeaplabEngine.repository.AccessGroupDao;
import com.beaplab.BeaplabEngine.repository.UserDao;
import com.beaplab.BeaplabEngine.repository.base.BaseRepository;
import com.beaplab.BeaplabEngine.service.AccessGroupService;
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
public class UserControllerTest {

    @InjectMocks
    private UserController userController;

    @Mock
    private UserService userService;

    @Before
    public void setUp() {
        MockitoAnnotations.initMocks(this);
    }

    /**
     * T5.67
     *
     * */
    @Test
    public void testSaveController(){
        UserDto userDto = mockUserDto();
        JSONObject jsonObject = new JSONObject();

        //Mocking success save
        jsonObject.put(BeapEngineConstants.SUCCESS_STR, true);
        jsonObject.put("userDto", userDto);
        jsonObject.put("status_code", HttpStatus.CREATED.value());

        when(userService.save(Mockito.<UserDto>anyObject())).thenReturn(jsonObject);

        ResponseEntity<JSONObject> responseEntity = userController.save(userDto);

        assertEquals(jsonObject,responseEntity.getBody());

        int expected = HttpStatus.CREATED.value();
        int result= responseEntity.getStatusCode().value();

        assertEquals(expected,result);

    }

    /**
     * T5.68
     *
     * */
    @Test
    public void testSaveNull(){
        UserDto userDto = null;
        JSONObject jsonObject = new JSONObject();

        //simulate bad result
        jsonObject.put(BeapEngineConstants.SUCCESS_STR, false);
        jsonObject.put("message", "Invalid User information provided");
        jsonObject.put("status_code", HttpStatus.BAD_REQUEST.value());

        ResponseEntity<JSONObject> responseEntity = userController.save(userDto);

        assertEquals(jsonObject,responseEntity.getBody());

        int expected = HttpStatus.BAD_REQUEST.value();
        int result= responseEntity.getStatusCode().value();

        assertEquals(expected,result);
    }


    /**
     * T5.69
     *
     * */
    @Test
    public void testList(){

        List<UserDto> userDtos= new ArrayList<>();

        userDtos.add(mockUserDto());
        userDtos.add(mockUserDto());

        when(userService.list()).thenReturn(userDtos);

        ResponseEntity<List<UserDto>> responseEntity = userController.list();

        HttpStatus expected = HttpStatus.OK;

        HttpStatus result= responseEntity.getStatusCode();

        assertEquals(expected,result);

        assertEquals(userDtos,responseEntity.getBody());

    }

    /**
     * T5.70
     *
     * */
    @Test
    public void testListNull(){
        List<UserDto> userDtos= null;

        when(userService.list()).thenReturn(userDtos);


        ResponseEntity<List<UserDto>> responseEntity = userController.list();

        assertNull(responseEntity.getBody());

        HttpStatus expected = HttpStatus.NOT_FOUND;

        HttpStatus result= responseEntity.getStatusCode();

        assertEquals(expected,result);

    }

    /**
     * T5.71
     *
     * */
    @Test
    public void testUpdate(){
        UserDto userDto = mockUserDto();

        ResponseEntity<UserDto> responseEntity = userController.update(userDto);

        verify(userService).update(eq(userDto));

        HttpStatus expected = HttpStatus.CREATED;
        HttpStatus result = responseEntity.getStatusCode();
        assertEquals(expected,result );

        assertEquals(userDto,responseEntity.getBody());

    }

    /**
     * T5.72
     *
     * */
    @Test
    public void testUpdateNull(){
        UserDto userDto = null;

        ResponseEntity<UserDto> responseEntity = userController.update(userDto);

        HttpStatus expected = HttpStatus.BAD_REQUEST;
        HttpStatus result = responseEntity.getStatusCode();
        assertEquals(expected, result);

    }

    /**
     * T5.73
     *
     * */
    @Test
    public void testGet(){

        UserDto userDto = mockUserDto();

        when(userService.get(Mockito.<String>anyObject())).thenReturn(userDto);

        ResponseEntity<UserDto> responseEntity = userController.get("1");

        HttpStatus expected = HttpStatus.OK;

        HttpStatus result= responseEntity.getStatusCode();

        assertEquals(expected,result);
        assertEquals(userDto, responseEntity.getBody());

    }

    /**
     * T5.74
     *
     * */
    @Test
    public void testGetNull(){
        UserDto userDto = null;

        when(userService.get(Mockito.<String>anyObject())).thenReturn(userDto);


        ResponseEntity<UserDto> responseEntity = userController.get("1");

        HttpStatus expected = HttpStatus.NOT_FOUND;

        HttpStatus result= responseEntity.getStatusCode();

        assertEquals(expected,result);

        assertNull(responseEntity.getBody());

    }

    /**
     * T5.75
     *
     * */
    @Test
    public void testDelete(){
        UserDto userDto = mockUserDto();

        when(userService.get(Mockito.<String>anyObject())).thenReturn(userDto);

        ResponseEntity<UserDto> responseEntity = userController.delete("1");

        verify(userService).delete(eq("1"));


        HttpStatus expected = HttpStatus.NO_CONTENT;

        HttpStatus result= responseEntity.getStatusCode();

        assertEquals(expected,result);

        assertNull(responseEntity.getBody());
    }

    /**
     * T5.76
     *
     * */
    @Test
    public void testDeleteNull(){
        UserDto userDto = null;

        when(userService.get(Mockito.<String>anyObject())).thenReturn(userDto);

        ResponseEntity<UserDto> responseEntity = userController.delete("1");


        HttpStatus expected = HttpStatus.NOT_FOUND;

        HttpStatus result= responseEntity.getStatusCode();

        assertEquals(expected,result);

        assertNull(responseEntity.getBody());
    }
}
