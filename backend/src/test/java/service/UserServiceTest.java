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
    private Util util;

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
                        2,
                        getTimestamp(2023, 0, 1, 0, 0)
                )
        );
        when(util.dateDifference(Matchers.<Date>any(), Matchers.<Date>any())).thenReturn(25L);

        JSONObject results = userService.login(user.getUsername(), user.getPassword());

        ArgumentCaptor<IncorrectLoginsDto> argument = ArgumentCaptor.forClass(IncorrectLoginsDto.class);
        verify(incorrectLoginsService).update(argument.capture());
        assertEquals(results, expected);
        assertEquals(0, argument.getValue().getIncorrectAttempts());
        assertFalse(argument.getValue().getLocked());
        assertNull(argument.getValue().getLockedDate());
    }

    @Test
    public void testInvalidLogin() {
        User user = mockUser();
        UserDto userDto = mockUserDto();
        JSONObject expected = new JSONObject();

        expected.put(BeapEngineConstants.SUCCESS_STR, false);
        expected.put("status_code", HttpStatus.UNAUTHORIZED.value());
        expected.put("message", "invalid username or password");

        when(userDao.findByUserPass(user.getUsername(), user.getPassword())).thenReturn(null);
        when(userDao.findByUsername(user.getUsername())).thenReturn(user);
        when(userMapper.model2Dto(Mockito.<User>anyObject(), Mockito.<UserDto>anyObject())).thenReturn(userDto);
        when(incorrectLoginsService.getByUserId(Mockito.anyLong())).thenReturn(
                mockIncorrectLoginsDto(
                        userDto,
                        false,
                        0,
                        getTimestamp(2023, 0, 1, 0, 0)
                )
        );

        JSONObject result = userService.login(user.getUsername(), user.getPassword());

        ArgumentCaptor<IncorrectLoginsDto> argument = ArgumentCaptor.forClass(IncorrectLoginsDto.class);
        verify(incorrectLoginsService).update(argument.capture());
        assertEquals(result, expected);
        assertEquals(1, argument.getValue().getIncorrectAttempts());
    }

    @Test
    public void testInvalidLoginFirstTime() {
        User user = mockUser();
        UserDto userDto = mockUserDto();
        JSONObject expected = new JSONObject();

        expected.put(BeapEngineConstants.SUCCESS_STR, false);
        expected.put("status_code", HttpStatus.UNAUTHORIZED.value());
        expected.put("message", "invalid username or password");

        when(userDao.findByUserPass(user.getUsername(), user.getPassword())).thenReturn(null);
        when(userDao.findByUsername(user.getUsername())).thenReturn(user);
        when(userMapper.model2Dto(Mockito.<User>anyObject(), Mockito.<UserDto>anyObject())).thenReturn(userDto);

        when(incorrectLoginsService.getByUserId(Mockito.anyLong())).thenReturn(null);

        JSONObject result = userService.login(user.getUsername(), user.getPassword());

        ArgumentCaptor<IncorrectLoginsDto> argument = ArgumentCaptor.forClass(IncorrectLoginsDto.class);
        verify(incorrectLoginsService).save(argument.capture());
        assertEquals(result, expected);
        assertEquals(1, argument.getValue().getIncorrectAttempts());
        assertEquals(userDto, argument.getValue().getUserDto());
        assertFalse(argument.getValue().getLocked());
        assertNull(argument.getValue().getLockedDate());
    }

    @Test
    public void testInvalidLoginLocked() {
        User user = mockUser();
        UserDto userDto = mockUserDto();
        JSONObject expected = new JSONObject();

        expected.put(BeapEngineConstants.SUCCESS_STR, false);
        expected.put("status_code", HttpStatus.LOCKED.value());
        expected.put("message", "Your account is locked for 24 hours.");

        when(userDao.findByUserPass(user.getUsername(), user.getPassword())).thenReturn(null);
        when(userDao.findByUsername(user.getUsername())).thenReturn(user);
        when(userMapper.model2Dto(Mockito.<User>anyObject(), Mockito.<UserDto>anyObject())).thenReturn(userDto);
        when(util.dateDifference(Mockito.<Date>any(), Mockito.<Date>any())).thenReturn(2L);
        when(incorrectLoginsService.getByUserId(Mockito.anyLong())).thenReturn(
                mockIncorrectLoginsDto(
                        userDto,
                        true,
                        0,
                        getTimestamp(2023, 0, 1, 0, 0)
                )
        );

        JSONObject result = userService.login(user.getUsername(), user.getPassword());

        assertEquals(result, expected);
    }

    @Test
    public void testInvalidLoginUnlock() {
        User user = mockUser();
        UserDto userDto = mockUserDto();
        UserDetails userDetails = mockUserDetails(user);
        JSONObject expected = new JSONObject();

        expected.put(BeapEngineConstants.SUCCESS_STR, true);
        expected.put("status_code", HttpStatus.OK.value());
        expected.put("Authorities", userDetails.getAuthorities());
        expected.put("userDetails", userDetails);
        expected.put("userDto", userDto);

        when(userDao.findByUserPass(user.getUsername(), user.getPassword())).thenReturn(null);
        when(userDao.findByUsername(user.getUsername())).thenReturn(user);
        when(userMapper.model2Dto(Mockito.<User>anyObject(), Mockito.<UserDto>anyObject())).thenReturn(userDto);
        when(userMapper.dto2Model(Mockito.<UserDto>anyObject(), Mockito.<User>anyObject())).thenReturn(user);

        when(util.dateDifference(Mockito.<Date>any(), Mockito.<Date>any())).thenReturn(24L);
        when(incorrectLoginsService.getByUserId(Mockito.anyLong())).thenReturn(
                mockIncorrectLoginsDto(
                        userDto,
                        true,
                        0,
                        getTimestamp(2023, 0, 1, 0, 0)
                )
        );

        JSONObject result = userService.login(user.getUsername(), user.getPassword());

        ArgumentCaptor<IncorrectLoginsDto> argument = ArgumentCaptor.forClass(IncorrectLoginsDto.class);
        verify(incorrectLoginsService).update(argument.capture());
        assertEquals(result, expected);
        assertEquals(0, argument.getValue().getIncorrectAttempts());
        assertNull(argument.getValue().getLockedDate());
        assertFalse(argument.getValue().getLocked());
    }

    @Test
    public void testInvalidUsernameAndPasswordLogin() {
        User user = mockUser();
        JSONObject expected = new JSONObject();

        expected.put(BeapEngineConstants.SUCCESS_STR, false);
        expected.put("status_code", HttpStatus.UNAUTHORIZED.value());
        expected.put("message", "invalid username or password");

        when(userDao.findByUserPass(user.getUsername(), user.getPassword())).thenReturn(null);
        when(userDao.findByUsername(user.getUsername())).thenReturn(null);

        JSONObject result = userService.login(user.getUsername(), user.getPassword());
        assertEquals(result, expected);
    }

    @Test
    public void testGetUserByUsername() {
        User user = mockUser();
        UserDto userDto = mockUserDto();

        when(userDao.findByUsername(user.getUsername())).thenReturn(user);
        when(userMapper.model2Dto(Mockito.<User>anyObject(), Mockito.<UserDto>anyObject())).thenReturn(userDto);
        UserDto result = userService.getUserByUsername(user.getUsername());
        assertEquals(result, userDto);
    }

    @Test
    public void testGetUserByUsernameNull() {
        String username = "test";

        when(userDao.findByUsername(username)).thenReturn(null);

        UserDto result = userService.getUserByUsername(username);
        assertNull(result);
    }

    @Test
    public void testLoadUserByUsername() {
        User user = mockUser();
        UserDetails expected = mockUserDetails(user);

        when(userDao.findByUsername(user.getUsername())).thenReturn(user);

        UserDetails result = userService.loadUserByUsername(user.getUsername());
        assertEquals(result, expected);
    }

    @Test
    public void testLoadUserByUsernameNull() {
        User user = mockUser();

        when(userDao.findByUsername(user.getUsername())).thenReturn(null);

        UserDetails result = userService.loadUserByUsername(user.getUsername());
        assertNull(result);
    }

    @Test
    public void testLoadUserDetails() {
        UserDto userDto = mockUserDto();
        User user = mockUser();
        UserDetails expected = mockUserDetails(user);

        when(userMapper.dto2Model(Mockito.<UserDto>anyObject(), Mockito.<User>anyObject())).thenReturn(user);

        UserDetails result = userService.loadUserDetails(userDto);
        assertEquals(result, expected);
    }
}
