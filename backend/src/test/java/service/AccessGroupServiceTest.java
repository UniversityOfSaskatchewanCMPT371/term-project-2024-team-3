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

import static org.junit.Assert.*;
import static utils.MockFactory.*;
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


    /**
     * Preconditions: Access Groups List is not empty
     * Post-conditions: Returns a list of AccessGroupDto Objects
     */
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
    /**
     * Preconditions: Access Groups List is empty
     * Post-conditions: Returns an empty list
     */
    @Test
    public void testListEmpty(){
        List<AccessGroup> accessGroups = new ArrayList<>();
        when(accessGroupDao.list()).thenReturn(accessGroups);

        List<AccessGroupDto> result = accessGroupService.list();

        assertTrue(result.isEmpty());

    }

    /**
     * Preconditions: Access Group does not exist in the database
     * Post-conditions: New Access Group is saved successfully
     */
    @Test
    public void testSave(){

        AccessGroupDto accessGroupDto = mockAccessGroupDto();
        AccessGroup accessGroup = mockAccessGroup();

        accessGroup.setId(1L);

        Serializable expected = 1L;

        when(accessGroupMapper.dto2Model(Mockito.<AccessGroupDto>anyObject(),
                Mockito.<AccessGroup>anyObject())).thenReturn(accessGroup);

        when(accessGroupDao.save(Mockito.any(AccessGroup.class))).thenReturn(accessGroup.getId());

        Serializable result  = accessGroupService.save(accessGroupDto);

        //Not too necessary but sanity check
        verify(accessGroupMapper).dto2Model(eq(accessGroupDto),any(AccessGroup.class));

        assertEquals(expected,result);

    }

    /**
     * Precondition : Access Group exists in the database
     * Post-condition: Access Group details are updated
     */
    @Test
    public void testUpdate(){

        AccessGroupDto accessGroupDto = mockAccessGroupDto();

        accessGroupService.update(accessGroupDto);
        verify(accessGroupMapper).dto2Model(eq(accessGroupDto),any(AccessGroup.class));
    }

    /**
     * Precondition : Access Group exists in the database
     * Post-condition: Returns AccessGroupDto object based on its id
     */
    @Test
    public void testGet(){

        AccessGroup accessGroup = mockAccessGroup();

        AccessGroupDto expected = mockAccessGroupDto();

        when(accessGroupDao.get(anyLong())).thenReturn(accessGroup);

        when(accessGroupMapper.model2Dto(Mockito.<AccessGroup>anyObject(),
                Mockito.<AccessGroupDto>anyObject())).thenReturn(expected);

        AccessGroupDto result = accessGroupService.get("1");

        assertEquals(expected,result);


    }

    /**
     * Precondition : Access Group does not exist in the database
     * Post-condition: Returns null
     */
    @Test
    public void testGetNull(){

            when(accessGroupDao.get(anyLong())).thenReturn(null);

            AccessGroupDto result  = accessGroupService.get("1");

            assertNull(result);


        }


        /**
        * Precondition : Access Group exists in the database
        * Post-condition: Access Group is deleted from the database
        */
        @Test
        public void testDelete(){

            String id = "1";

            accessGroupService.delete(id);

            verify(accessGroupDao).delete(eq(Long.parseLong((id))));

        }



}
