package service;

import com.beaplab.BeaplabEngine.service.LoginUserService;
import com.beaplab.BeaplabEngine.util.objectMapper.UserMapper;
import com.beaplab.BeaplabEngine.constants.BeapEngineConstants;
import com.beaplab.BeaplabEngine.metadata.IncorrectLoginsDto;
import com.beaplab.BeaplabEngine.metadata.LoginUserDto;
import com.beaplab.BeaplabEngine.model.LoginUser;
import com.beaplab.BeaplabEngine.repository.LoginUserDao;
import com.beaplab.BeaplabEngine.service.IncorrectLoginsService;
import com.beaplab.BeaplabEngine.service.LoginUserService;
import com.beaplab.BeaplabEngine.util.Util;
import com.beaplab.BeaplabEngine.util.error.UserAlreadyExistException;
import com.beaplab.BeaplabEngine.util.objectMapper.LoginUserMapper;
import org.json.simple.JSONObject;
import org.springframework.http.HttpStatus;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.*;
import org.mockito.runners.MockitoJUnitRunner;

import java.io.Serializable;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.junit.runner.RunWith;
import org.mockito.runners.MockitoJUnitRunner;

import static org.junit.Assert.*;
import static utils.MockFactory.*;
import static utils.TestHelper.*;
import static org.mockito.Matchers.any;
import static org.mockito.Matchers.eq;
import static org.mockito.Mockito.*;



@RunWith(MockitoJUnitRunner.class)
public class LoginUserTest {
    
    @InjectMocks
    private LoginUserService loginUserService;

    @Mock
    private LoginUserMapper loginUserMapper;

    @Mock
    private LoginUserDao loginUserDao;

    @Mock
    private IncorrectLoginsService incorrectLoginsService;

    @Mock
    private Util util;

    @Before
    public void setup(){
        MockitoAnnotations.initMocks(this);
    }
    
    // test list, save, update, get, delete

    // testing list

    @Test
    /**
     * Preconditions: Login list is empty
     * Post-conditions: Returns an empty list
     */
    public void testListEmpty() {
        List<LoginUser> loginUsers = new ArrayList<>();
        when(loginUserDao.list()).thenReturn(loginUsers);

        List<LoginUserDto> result = loginUserService.list();

        assertTrue(result.isEmpty());
    }

    @Test
    /**
     * Preconditions: Login list is not empty
     * Post-conditions: Returns a list of LoginDto objects
     */
    public void testList() {
        List<LoginUser> loginUsers = new ArrayList<>();

        loginUsers.add(
            mockLoginUser(
                mockUser(
                    "Michael",
                    "Scott",
                    "PrisonMike"
                ),
                "ThisIsAPassword"
            )
        );
        loginUsers.add(
            mockLoginUser(
                mockUser(
                    "Dwight",
                    "Schrute",
                    "BeetLover73"
                ),
                "thisTooIsAPassword"
            )
        );

        when(loginUserDao.list()).thenReturn(loginUsers);

        List<LoginUserDto> expected = loginUserMapper.model2Dto(loginUsers, new ArrayList<LoginUserDto>());
        List<LoginUserDto> result = loginUserService.list();

        assertEquals(expected, result);
    }

    @Test
    /**
     * Preconditions: LoginUser does not exist in the database
     * Post-conditions: new LoginUser is saved successfully
     */
    public void testSave(){
        LoginUser loginUser = mockLoginUser(
            mockUser(
                "Dan",
                 "Manly",
                  "The Man"
            ), 
             "password"
        );
        loginUser.setId(123456789L);

        LoginUserDto loginUserDto = mockLoginUserDto();

        Serializable expected = 123456789L;

        // expected.put(BeapEngineConstants.SUCCESS_STR, true);
        // expected.put("loginUserDto", loginUserDto);
        // expected.put("status_code", HttpStatus.CREATED.value());

        when(loginUserDao.get(loginUser.getId())).thenReturn(null);
        when(loginUserMapper.dto2Model(eq(loginUserDto), any(LoginUser.class))).thenReturn(loginUser);
        when(loginUserDao.save(loginUser)).thenReturn(123456789L);


        // NEED HELP WITH THIS
        Serializable result = loginUserService.save(loginUserDto);

        assertEquals(expected, result);
    }

    @Test
    /**
     * Preconditions: The LoginUser is already in the database
     * Post-conditions: Returns an error message indicating the LoginUser already exists
     */
    public void testSaveLoginAlreadyExists() throws UserAlreadyExistException{
        LoginUser loginUser = mockLoginUser(
            mockUser(
                "michael",
                "Scott",
                "The Destroyer"
            ), 
            "123"
            );
            loginUser.setId(1234L);
            Serializable expected = loginUser.getId();

            LoginUserDto loginUserDto = mockLoginUserDto();

            when(loginUserDao.get(loginUser.getId())).thenReturn(loginUser);
            
            Serializable result = loginUserService.save(loginUserDto);

            assertEquals(expected, result);
    }

    @Test
    /**
     * Preconditions: LoginUser exists in the database
     * Post-conditions: LoginUser details are updated
     */
    public void testUpdate(){
        LoginUserDto loginUserDto = mockLoginUserDto();

        loginUserService.update(loginUserDto);
        verify(loginUserMapper).dto2Model(eq(loginUserDto), any(LoginUser.class));
    }

    @Test
    /**
     * Preconditions: LoginUser exists in the database
     * Post-conditions: Returns LoginUserDto object
     */
    public void testGet(){
        LoginUser loginUser = mockLoginUser( 
            mockUser(
                "first",
                "last",
                "first-last"
            ), 
            "Password"
            );
            LoginUserDto expected = mockLoginUserDto();
            String id="1";

            when(loginUserDao.get(Long.parseLong(id))).thenReturn(loginUser);
            when(loginUserMapper.model2Dto(eq(loginUser), any(LoginUserDto.class))).thenReturn(expected);

            LoginUserDto result = loginUserService.get(id);

            assertEquals(expected, result);
    }

    @Test
    /**
     * Preconditions: LoginUser is not in the database
     * Post-conditions: Returns null
     */
    public void testGetNull(){
        when(loginUserDao.get(1L)).thenReturn(null);

        LoginUserDto result = loginUserService.get("1");
        assertNull(result);
    }

    @Test
    /**
     * Preconditions: LoginUser is in the database
     * Post-conditions: deletes the LoginUser
     */
    public void testDelete(){
        String id = "1";

        loginUserService.delete(id);
        verify(loginUserDao).delete(eq(Long.parseLong(id)));
    }
}
