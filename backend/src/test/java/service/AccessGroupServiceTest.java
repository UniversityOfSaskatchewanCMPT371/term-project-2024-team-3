package service;

import com.beaplab.BeaplabEngine.constants.BeapEngineConstants;
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

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import org.springframework.http.HttpStatus;

import static org.junit.Assert.*;
import static utils.UserMockFactory.*;
import static org.mockito.Mockito.*;

@RunWith(MockitoJUnitRunner.class)

public class AccessGroupServiceTest {

    @InjectMocks
    private AccessGroupService accessGroupService;

    @Mock
    private AccessGroupMapper accessGroupMapper;

    @Mock
    private BaseRepository<AccessGroup> accessGroupDao;


    @Before
    public void setUp() {
        MockitoAnnotations.initMocks(this);
    }


    @Test
    public void testList() {
        List<AccessGroup> accessGroups = new ArrayList<>();

        accessGroups.add(
                mockAccessGroup()
        );

        accessGroups.add(
            mockAccessGroup()
        );

        when(accessGroupDao.list()).thenReturn(accessGroups);

        List<AccessGroupDto> expected = accessGroupMapper.model2Dto(accessGroups, new ArrayList<AccessGroupDto>());
        List<AccessGroupDto> result = accessGroupService.list();

        assertEquals(expected, result);
    }
    @Test
    public void testListEmpty(){
        List<AccessGroup> accessGroups = new ArrayList<>();
        when(accessGroupDao.list()).thenReturn(accessGroups);

        List<AccessGroupDto> result = accessGroupService.list();

        assertTrue(result.isEmpty());

    }

    @Test
    public void testSave(){

        AccessGroupDto accessGroupDto = mockAccessGroupDto();

        Serializable expected = 1L;

        when(accessGroupDao.save(Mockito.any(AccessGroup.class))).thenReturn(1L);

        Serializable result  = accessGroupService.save(accessGroupDto);

        //Not too necessary but sanity check
        verify(accessGroupMapper).dto2Model(eq(accessGroupDto),any(AccessGroup.class));

        assertEquals(expected,result);

    }

    @Test
    public void testUpdate(){}


}
