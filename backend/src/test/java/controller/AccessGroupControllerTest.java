package controller;

import com.beaplab.BeaplabEngine.constants.BeapEngineConstants;
import com.beaplab.BeaplabEngine.controller.AccessGroupController;
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
public class AccessGroupControllerTest {
    @InjectMocks
    private AccessGroupController accessGroupController;

    @Mock
    private AccessGroupService  accessGroupService;

    @Before
    public void setUp() {
        MockitoAnnotations.initMocks(this);
    }

    /**
     *   Preconditions: Access Groups List is not empty
     *   Post-conditions: Returns a Response Entity with a list of AccessGroupDto Objects and
     *   an OK status
     */
    @Test
    public void testListController(){
        List<AccessGroupDto>  accessGroupDtos = new ArrayList<>();

        accessGroupDtos.add(mockAccessGroupDto());
        accessGroupDtos.add(mockAccessGroupDto());

        when(accessGroupService.list()).thenReturn(accessGroupDtos);


        ResponseEntity<List<AccessGroupDto>> responseEntity = accessGroupController.list();

        HttpStatus expected = HttpStatus.OK;

        HttpStatus result= responseEntity.getStatusCode();

        assertEquals(expected, result);
        assertEquals(accessGroupDtos, responseEntity.getBody());

    }
    /**
     *   Preconditions: Access Groups List is null
     *   Post-conditions: Returns a Response Entity with a list of AccessGroupDto Objects and
     *   an OK status
     */
    @Test
    public void testListControllerNull(){
        List<AccessGroupDto>  accessGroupDtos = null;

        when(accessGroupService.list()).thenReturn(accessGroupDtos);

        ResponseEntity<List<AccessGroupDto>> responseEntity = accessGroupController.list();

        assertNull(responseEntity.getBody());


        HttpStatus expected = HttpStatus.NOT_FOUND;

        HttpStatus result= responseEntity.getStatusCode();

        assertEquals(expected,result);

    }

    /**
     *   Preconditions: Access GroupDto is not null
     *   Post-conditions: Returns a Response Entity with an AccessGroupDto Object and
     *   a CREATED status. The AccessGroupDto is saved into the database
     */
    @Test
    public void testSave(){

        AccessGroupDto accessGroupDto = mockAccessGroupDto();
        Serializable id = 4;

        accessGroupDto.setId( Long.parseLong(id.toString()));

        when(accessGroupService.save(Mockito.<AccessGroupDto>anyObject())).thenReturn(id);

        ResponseEntity<AccessGroupDto> responseEntity = accessGroupController.save(accessGroupDto);

        assertEquals(accessGroupDto,responseEntity.getBody());

        HttpStatus expected = HttpStatus.CREATED;

        HttpStatus result= responseEntity.getStatusCode();

        assertEquals(expected, result);


    }

    /**
     *   Preconditions: Access GroupDto is null
     *   Post-conditions: Returns a Response Entity with a BAD_REQUEST status
     */
    @Test
    public void testSaveNull(){

        AccessGroupDto accessGroupDto = null;

        ResponseEntity<AccessGroupDto> responseEntity = accessGroupController.save(accessGroupDto);

        HttpStatus expected = HttpStatus.BAD_REQUEST;
        HttpStatus result = responseEntity.getStatusCode();


        assertEquals(expected, result);

    }

    /**
     *   Preconditions: Access GroupDto is not null
     *   Post-conditions: Returns a Response Entity with a CREATED status and the updated access group. The Access
     *   Group information is updated in the database
     */
    @Test
    public void testUpdate(){

        AccessGroupDto accessGroupDto = mockAccessGroupDto();

        ResponseEntity<AccessGroupDto> responseEntity = accessGroupController.update(accessGroupDto);

        verify(accessGroupService).update(eq(accessGroupDto));

        HttpStatus expected = HttpStatus.CREATED;
        HttpStatus result = responseEntity.getStatusCode();
        assertEquals(expected,result );

    }

    /**
     *   Preconditions: Access GroupDto is null
     *   Post-conditions: Returns a Response Entity with a BAD_REQUEST status
     */
    @Test
    public void testUpdateNull(){

        AccessGroupDto accessGroupDto =null;

        ResponseEntity<AccessGroupDto> responseEntity = accessGroupController.update(accessGroupDto);

        HttpStatus expected = HttpStatus.BAD_REQUEST;
        HttpStatus result = responseEntity.getStatusCode();
        assertEquals(expected, result);

    }

    /**
     *   Preconditions: Access GroupDto is not null
     *   Post-conditions: Returns a Response Entity with an OK status and the desired
     *   Access Group Dto specified by the id
     */
    @Test
    public void testGet(){

        AccessGroupDto accessGroupDto = mockAccessGroupDto();

        when(accessGroupService.get(Mockito.<String>anyObject())).thenReturn(accessGroupDto);

        ResponseEntity<AccessGroupDto> responseEntity = accessGroupController.get("1");


        HttpStatus expected = HttpStatus.OK;

        HttpStatus result= responseEntity.getStatusCode();

        assertEquals(expected,result);
        assertEquals(accessGroupDto, responseEntity.getBody());

    }


    /**
     *   Preconditions: Access GroupDto is null
     *   Post-conditions: Returns a Response Entity with a NOT_FOUND status
     */
    @Test
    public void testGetNull(){

        AccessGroupDto accessGroupDto = null;

        when(accessGroupService.get(Mockito.<String>anyObject())).thenReturn(accessGroupDto);

        ResponseEntity<AccessGroupDto> responseEntity = accessGroupController.get("1");


        HttpStatus expected = HttpStatus.NOT_FOUND;

        HttpStatus result= responseEntity.getStatusCode();

        assertEquals(expected,result);

        assertNull(responseEntity.getBody());

    }

    /**
     *   Preconditions: Access GroupDto is not null
     *   Post-conditions: Returns a Response Entity with a NO_CONTENT status, and access group is deleted from
     *   database
     */
    @Test
    public void testDelete(){

        AccessGroupDto accessGroupDto = mockAccessGroupDto();

        when(accessGroupService.get(Mockito.<String>anyObject())).thenReturn(accessGroupDto);

        ResponseEntity<AccessGroupDto> responseEntity = accessGroupController.delete("1");


        HttpStatus expected = HttpStatus.NO_CONTENT;

        HttpStatus result= responseEntity.getStatusCode();

        assertEquals(expected,result);

        //make sure it was deleted
        assertNull(responseEntity.getBody());

    }

    /**
     *   Preconditions: Access GroupDto is null
     *   Post-conditions: Returns a Response Entity with a NOT_FOUND status
     */
    @Test
    public void testDeleteNull(){

        AccessGroupDto accessGroupDto = null;

        when(accessGroupService.get(Mockito.<String>anyObject())).thenReturn(accessGroupDto);

        ResponseEntity<AccessGroupDto> responseEntity = accessGroupController.delete("1");


        HttpStatus expected = HttpStatus.NOT_FOUND;

        HttpStatus result= responseEntity.getStatusCode();

        assertEquals(expected,result);

        assertNull(responseEntity.getBody());

    }


}
