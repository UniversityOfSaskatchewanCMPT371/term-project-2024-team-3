package controller;
import com.beaplab.BeaplabEngine.authentication.SessionDetails;
import com.beaplab.BeaplabEngine.constants.BeapEngineConstants;
import com.beaplab.BeaplabEngine.controller.AccessGroupController;
import com.beaplab.BeaplabEngine.controller.UserController;
import com.beaplab.BeaplabEngine.metadata.AccessGroupDto;
import com.beaplab.BeaplabEngine.metadata.UpdatePasswordObject;
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
import org.springframework.mock.web.MockHttpServletRequest;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
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
    @Mock
    private HttpSession httpSession;

    private final MockHttpServletRequest request = new MockHttpServletRequest();

    @Before
    public void setUp() {

        MockitoAnnotations.initMocks(this);
        // mocking request and session details

        request.setSession(httpSession);
        SessionDetails session = new SessionDetails();
        session.setUserId(1L);
        when(httpSession.getAttribute("SESSION_DETAILS")).thenReturn(session);
    }

    /**
     * T5.67
     *
     *   Preconditions: UserDto is not null
     *   Post-conditions: Returns a Response Entity with a JSON Object and
     *   the int value of CREATED status. The UserDto is saved into
     *   the database
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
     * Preconditions: UserDto is null
     * Post-conditions: Returns a Response Entity with the int value of BAD_REQUEST status
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
     * Preconditions: User Dto List is not empty
     * Postconditions: Returns a Response Entity with a list of User Dto Objects
     * and an OK status
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
     * Preconditions: UserDto List is empty
     * Post-conditions: Returns a Response Entity with null
     * and a NOT_FOUND status
     *
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
     * Preconditions: UserDto is not null
     * Post-conditions: Returns a Response Entity with a CREATED status and the updated UserDto.
     * The UserDto information is updated in the database
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
     * Preconditions: UserDto is null
     * Post-conditions: Returns a Response Entity with a BAD_REQUEST status
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
     * Preconditions: UsertDto is not null
     * Post-conditions: Returns a Response Entity with an OK status and the desired
     * UserDto specified by the id
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
     * Precondition: UserDto is null
     * Post-condition: Returns a Response Entity with a NOT_FOUND status
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
     * Preconditions: UserDto is not null
     * Post-conditions: Returns a Response Entity with a NO_CONTENT status,
     * and User is deleted from database
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
     * Preconditions: UserDto is null
     * Post-condition: Returns a Response Entity with a NOT_FOUND status
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

    /**
     * T5.??
     * Preconditions: User exists
     * Post-condition: Updates user password
     * */
    @Test
    public void testUpdatePassword() {
        UserDto userDto = mockUserDto();
        UpdatePasswordObject passwordObject = new UpdatePasswordObject();
        passwordObject.setPassword("123");
        userDto.setPassword("123");
        when(userService.get("1")).thenReturn(userDto);

        when(userService.newUpdateUser(userDto)).thenReturn(true);

        ResponseEntity<UserDto> responseEntity = userController.updatePassword(request, passwordObject);

        HttpStatus expected = HttpStatus.OK;

        HttpStatus result= responseEntity.getStatusCode();

        assertEquals(expected, result);
    }

    /**
     * T5.??
     * Preconditions: User exists
     * Post-condition: User is returned
     * */
    @Test
    public void testGetUser() {
        UserDto userDto = mockUserDto();

        when(userService.get("1")).thenReturn(userDto);

        when(userService.newUpdateUser(userDto)).thenReturn(true);

        ResponseEntity<JSONObject> responseEntity = userController.getUsername(request);

        HttpStatus expected = HttpStatus.OK;

        HttpStatus result= responseEntity.getStatusCode();

        assertEquals(expected, result);
    }

    /**
     * T5.76
     * A function that tests the case where the delete user data function is called but the DTO is null
     * Preconditions: User exists
     * Post-condition: User profile and data is deleted
     * */
    @Test
    public void testDeleteUserProfile(){
        UserDto userDto = mockUserDto();

        when(userService.get("1")).thenReturn(userDto);

        when(userService.deleteUserAccount(1L)).thenReturn(true);

        ResponseEntity<JSONObject> responseEntity = userController.deleteProfile(request);

        HttpStatus expected = HttpStatus.OK;

        HttpStatus result= responseEntity.getStatusCode();

        assertEquals(expected, result);
    }

    /**
     * T5.??
     * Preconditions: User exists
     * Post-condition: User data is deleted
     * */
    @Test
    public void testDeleteUserData(){
        UserDto userDto = mockUserDto();

        when(userService.get("1")).thenReturn(userDto);

        ResponseEntity<JSONObject> responseEntity = userController.deleteUserData(request);

        verify(userService).deleteUserData(1L);

        HttpStatus expected = HttpStatus.OK;

        HttpStatus result= responseEntity.getStatusCode();

        assertEquals(expected, result);
    }
}
