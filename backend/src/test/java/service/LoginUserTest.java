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
import com.beaplab.BeaplabEngine.util.objectMapper.LoginUserMapper;
import org.json.simple.JSONObject;
import org.springframework.http.HttpStatus;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.*;
import org.mockito.runners.MockitoJUnitRunner;


import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.junit.runner.RunWith;
import org.mockito.runners.MockitoJUnitRunner;

import static org.junit.Assert.*;
import static utils.MockFactory.*;
import static utils.TestHelper.*;
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
        loginUser.setId(new Long("123456789"));

        LoginUserDto loginUserDto = mockLoginUserDto();

        JSONObject expected = new JSONObject();

        expected.put(BeapEngineConstants.SUCCESS_STR, true);
        expected.put("loginUserDto", loginUserDto);
        expected.put("status_code", HttpStatus.CREATED.value());

        when(loginUserDao.get(loginUser.getId())).thenReturn(null);
        when(loginUserMapper.dto2Model(loginUserDto, new LoginUser())).thenReturn(loginUser);
        when(loginUserDao.save(loginUser)).thenReturn(new Long("123456789"));

    }

    @Test
    /**
     * Preconditions: The LoginUser is already in the database
     * Post-conditions: Returns an error message indicating the LoginUser already exists
     */
    public void testSaveLoginAlreadyExists(){
        
    }

    @Test
    /**
     * Preconditions: LoginUser exists in the database
     * Post-conditions: LoginUser details are updated
     */
    public void testUpdate(){
        
    }

    @Test
    /**
     * Preconditions: LoginUser exists in the database
     * Post-conditions: Returns LoginUserDto object
     */
    public void testGet(){
        
    }

    @Test
    /**
     * Preconditions: LoginUser is not in the database
     * Post-conditions: Returns null
     */
    public void testGetNull(){
        
    }

    @Test
    /**
     * Preconditions: LoginUser is in the database
     * Post-conditions: deletes the LoginUser
     */
    public void testDelete(){
        
    }
}
