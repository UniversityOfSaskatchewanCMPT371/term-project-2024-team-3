package service;

import com.beaplab.BeaplabEngine.metadata.UserDto;
import com.beaplab.BeaplabEngine.model.User;
import com.beaplab.BeaplabEngine.repository.UserDao;
import com.beaplab.BeaplabEngine.service.IncorrectLoginsService;
import com.beaplab.BeaplabEngine.service.UserService;
import com.beaplab.BeaplabEngine.util.objectMapper.UserMapper;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.mockito.runners.MockitoJUnitRunner;
import utils.MockFactory;
import java.util.ArrayList;
import java.util.List;

import static org.junit.Assert.*;

@RunWith(MockitoJUnitRunner.class)
public class UserServiceTest {

    @Mock
    private UserMapper userMapper;

    @Mock
    private UserDao userDao;

    @Mock
    private IncorrectLoginsService incorrectLoginsService;

    @InjectMocks
    private UserService userService;

    @Before
    public void setUp() {
        MockitoAnnotations.initMocks(this);
    }

    @Test
    public void testList() {
        List<User> users = new ArrayList<>();

        users.add(
                MockFactory.mockUser(
                        "Michael",
                        "Scott",
                        "PrisonMike"
                )
        );

        users.add(
                MockFactory.mockUser(
                        "Dwight",
                        "Schrute",
                        "MonkeyTrainer"
                )
        );

        Mockito.when(userDao.list()).thenReturn(users);

        List<UserDto> expected = userMapper.model2Dto(users, new ArrayList<UserDto>());
        List<UserDto> result = userService.list();

        assertEquals(result, expected);
    }

    @Test
    public void testListEmpty() {
        List<User> users = new ArrayList<>();
        Mockito.when(userDao.list()).thenReturn(users);

        List<UserDto> result = userService.list();

        assertTrue(result.isEmpty());
    }
}
