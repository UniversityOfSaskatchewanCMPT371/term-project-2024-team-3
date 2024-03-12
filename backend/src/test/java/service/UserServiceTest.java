package service;

import com.beaplab.BeaplabEngine.constants.BeapEngineConstants;
import com.beaplab.BeaplabEngine.metadata.UserDto;
import com.beaplab.BeaplabEngine.model.User;
import com.beaplab.BeaplabEngine.repository.UserDao;
import com.beaplab.BeaplabEngine.service.IncorrectLoginsService;
import com.beaplab.BeaplabEngine.service.UserService;
import com.beaplab.BeaplabEngine.util.error.UserAlreadyExistException;
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
public class UserServiceTest {

    @InjectMocks
    private UserService userService;
    @Mock
    private UserMapper userMapper;

    @Mock
    private UserDao userDao;

    @Mock
    private IncorrectLoginsService incorrectLoginsService;

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

    }

    @Test
    public void testValidLoginLocked() {

    }

    @Test
    public void testValidLoginWithUnlock() {

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
