package service;

import com.beaplab.BeaplabEngine.constants.BeapEngineConstants;
import com.beaplab.BeaplabEngine.metadata.IncorrectLoginsDto;
import com.beaplab.BeaplabEngine.metadata.UserDto;
import com.beaplab.BeaplabEngine.model.User;
import com.beaplab.BeaplabEngine.repository.UserDao;
import com.beaplab.BeaplabEngine.service.IncorrectLoginsService;
import com.beaplab.BeaplabEngine.service.UserService;
import com.beaplab.BeaplabEngine.util.Util;
import com.beaplab.BeaplabEngine.util.error.UserAlreadyExistException;
import com.beaplab.BeaplabEngine.util.objectMapper.UserMapper;
import org.json.simple.JSONObject;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.*;
import org.mockito.runners.MockitoJUnitRunner;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.UserDetails;

import static org.junit.Assert.*;
import static utils.MockFactory.*;
import static utils.TestHelper.*;
import static org.mockito.Mockito.*;

@RunWith(MockitoJUnitRunner.class)
public class UserServiceTest {

    @InjectMocks
    private UserService userService;
    @Mock
    private UserMapper userMapper;

    @Mock
    private UserDao userDao;

    @Mock
    private IncorrectLoginsService incorrectLoginsService;

    @Mock
    Util util;

    @Before
    public void setUp() {
        MockitoAnnotations.initMocks(this);
    }

    @Test
    public void testList() {
        List<User> users = new ArrayList<>();

        users.add(
                mockUser(
                        "Michael",
                        "Scott",
                        "PrisonMike"
                )
        );

        users.add(
                mockUser(
                        "Dwight",
                        "Schrute",
                        "MonkeyTrainer"
                )
        );

        when(userDao.list()).thenReturn(users);

        List<UserDto> expected = userMapper.model2Dto(users, new ArrayList<UserDto>());
        List<UserDto> result = userService.list();

        assertEquals(expected, result);
    }

    @Test
    public void testListEmpty() {
        List<User> users = new ArrayList<>();
        when(userDao.list()).thenReturn(users);

        List<UserDto> result = userService.list();

        assertTrue(result.isEmpty());
    }

    @Test
    public void testSave() throws UserAlreadyExistException {
        User user = mockUser();
        UserDto userDto = mockUserDto();

        JSONObject expected = new JSONObject();

        expected.put(BeapEngineConstants.SUCCESS_STR, true);
        expected.put("userDto", userDto);
        expected.put("status_code", HttpStatus.CREATED.value());

        when(userDao.findByUsername(user.getUsername())).thenReturn(null);
        when(userDao.save(Mockito.any(User.class))).thenReturn(1L);

        JSONObject result = userService.save(userDto);

        verify(userMapper).dto2Model(eq(userDto), any(User.class));
        assertEquals(expected, result);
    }

    @Test
    public void testSaveUserAlreadyExists() throws UserAlreadyExistException {
        User user = mockUser();
        UserDto userDto = mockUserDto();

        JSONObject expected = new JSONObject();

        expected.put(BeapEngineConstants.SUCCESS_STR, false);
        expected.put("message", "There is already another account with username: " + userDto.getUsername());
        expected.put("status_code", HttpStatus.INTERNAL_SERVER_ERROR.value());

        when(userDao.findByUsername(user.getUsername())).thenReturn(user);
        when(userDao.save(Mockito.any(User.class))).thenReturn(1L);

        JSONObject result = userService.save(userDto);

        assertEquals(expected, result);
    }

    @Test
    public void testUpdate() {
        UserDto userDto = mockUserDto();

        userService.update(userDto);
        verify(userMapper).dto2Model(eq(userDto), any(User.class));
    }

    @Test
    public void testGet() {
        User user = mockUser();
        UserDto expected = mockUserDto();

        when(userDao.get(anyLong())).thenReturn(user);
        when(userMapper.model2Dto(Mockito.<User>anyObject(), Mockito.<UserDto>anyObject())).thenReturn(expected);

        UserDto result = userService.get("1");

        assertEquals(expected, result);
    }

    @Test
    public void testGetNull() {
        when(userDao.get(1L)).thenReturn(null);

        UserDto result = userService.get("1");
        assertNull(result);
    }

    @Test
    public void testDelete() {
        String id = "1";

        userService.delete(id);
        verify(userDao).delete(eq(Long.parseLong(id)));
    }

    @Test
    public void testValidLogin() {
        User user = mockUser();
        UserDto userDto = mockUserDto();
        UserDetails userDetails = mockUserDetails(user);
        JSONObject expected = new JSONObject();

        expected.put(BeapEngineConstants.SUCCESS_STR, true);
        expected.put("status_code", HttpStatus.OK.value());
        expected.put("Authorities", userDetails.getAuthorities());
        expected.put("userDetails", userDetails);
        expected.put("userDto", userDto);

        when(userDao.findByUserPass(user.getUsername(), user.getPassword())).thenReturn(user);
        when(userMapper.model2Dto(Mockito.<User>anyObject(), Mockito.any(UserDto.class))).thenReturn(userDto);
        when(userMapper.dto2Model(Mockito.<UserDto>anyObject(), Mockito.any(User.class))).thenReturn(user);
        when(incorrectLoginsService.getByUserId(Mockito.anyLong())).thenReturn(
                mockIncorrectLoginsDto(
                        userDto,
                        false,
                        0,
                        getTimestamp(2023, 0, 1, 0, 0)
                )
        );

        JSONObject results = userService.login(user.getUsername(), user.getPassword());

        assertEquals(results, expected);
    }

    @Test
    public void testValidLoginLocked() {
        User user = mockUser();
        UserDto userDto = mockUserDto();
        JSONObject expected = new JSONObject();

        expected.put(BeapEngineConstants.SUCCESS_STR, false);
        expected.put("status_code", HttpStatus.LOCKED.value());
        expected.put("message", "Your account is locked for 24 hours.");

        when(util.dateDifference(Matchers.<Date>any(), Matchers.<Date>any())).thenReturn(0L);
        when(userDao.findByUserPass(user.getUsername(), user.getPassword())).thenReturn(user);
        when(userMapper.model2Dto(Mockito.<User>anyObject(), Mockito.any(UserDto.class))).thenReturn(userDto);
        when(incorrectLoginsService.getByUserId(Mockito.anyLong())).thenReturn(
                mockIncorrectLoginsDto(
                        userDto,
                        true,
                        0,
                        getTimestamp(2023, 0, 1, 30, 9)
                )
        );

        JSONObject results = userService.login(user.getUsername(), user.getPassword());

        assertEquals(results, expected);
    }

    @Test
    public void testValidLoginWithUnlock() {
        User user = mockUser();
        UserDto userDto = mockUserDto();
        UserDetails userDetails = mockUserDetails(user);
        JSONObject expected = new JSONObject();

        expected.put(BeapEngineConstants.SUCCESS_STR, true);
        expected.put("status_code", HttpStatus.OK.value());
        expected.put("Authorities", userDetails.getAuthorities());
        expected.put("userDetails", userDetails);
        expected.put("userDto", userDto);

        when(userDao.findByUserPass(user.getUsername(), user.getPassword())).thenReturn(user);
        when(userMapper.model2Dto(Mockito.<User>anyObject(), Mockito.any(UserDto.class))).thenReturn(userDto);
        when(userMapper.dto2Model(Mockito.<UserDto>anyObject(), Mockito.any(User.class))).thenReturn(user);
        when(incorrectLoginsService.getByUserId(Mockito.anyLong())).thenReturn(
                mockIncorrectLoginsDto(
                        userDto,
                        true,
                        0,
                        getTimestamp(2023, 0, 1, 0, 0)
                )
        );
        when(util.dateDifference(Matchers.<Date>any(), Matchers.<Date>any())).thenReturn(25L);

        JSONObject results = userService.login(user.getUsername(), user.getPassword());

        assertEquals(results, expected);
        verify(incorrectLoginsService).update(Matchers.<IncorrectLoginsDto>any());
    }

    @Test
    public void testInvalidLogin() {

    }

    @Test
    public void testInvalidLoginFirstTime() {

    }

    @Test
    public void testInvalidLoginAttempt() {

    }

    @Test
    public void testInvalidLoginLocked() {

    }

    @Test
    public void testInvalidUsernameAndPasswordLogin() {

    }

    @Test
    public void testGetUserByUsername() {

    }

    @Test
    public void testGetUserByUsernameNull() {

    }

    @Test
    public void testLoadUserByUsername() {

    }

    @Test
    public void testLoadUserDetails() {

    }
}
