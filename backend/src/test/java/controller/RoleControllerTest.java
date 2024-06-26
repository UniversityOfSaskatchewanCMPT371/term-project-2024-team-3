package controller;


import com.beaplab.BeaplabEngine.controller.RoleController;
import com.beaplab.BeaplabEngine.metadata.RoleDto;
import com.beaplab.BeaplabEngine.service.RoleService;
import com.rollbar.notifier.Rollbar;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
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
public class RoleControllerTest {

    @InjectMocks
    private RoleController roleController;

    @Mock
    private Rollbar rollbar;

    @Mock
    private RoleService roleService;


    /**
     * T5.77
     * pre: List<RoleDto> has a RoleDto in it
     * result: list of RoleDto and OK status
     */
    @Test
    public void testList(){

        List<RoleDto> roleDtoList = new ArrayList<>();

        roleDtoList.add(mockRoleDto());

        when(roleService.list()).thenReturn(roleDtoList);

        ResponseEntity<List<RoleDto>> expected = new ResponseEntity<>(roleDtoList, HttpStatus.OK);

        ResponseEntity<List<RoleDto>> result = roleController.list();

        assertEquals(expected, result);
    }

    /**
     * T5.78
     * pre: the list doesn't exist
     * result: NOT_FOUND status
     */
    @Test
    public void testListNull(){
        when(roleService.list()).thenReturn(null);

        ResponseEntity<List<RoleDto>> expected = new ResponseEntity<>(HttpStatus.NOT_FOUND);

        ResponseEntity<List<RoleDto>> result = roleController.list();

        assertEquals(expected, result);
    }

    /**
     * T5.79
     * pre: RoleDto exits
     * result: RoleDto and CREATED status
     */
    @Test
    public void testSave(){
        RoleDto roleDto = mockRoleDto();
        Serializable id = 4;

        when(roleService.save(eq(roleDto))).thenReturn(id);

        ResponseEntity<RoleDto> expected = new ResponseEntity<>(roleDto, HttpStatus.CREATED);
        ResponseEntity<RoleDto> result = roleController.save(roleDto);

        assertEquals(expected, result);

    }

    /**
     * T5.80
     * pre: no role exits
     * result: BAD_REQUEST status
     */
    @Test
    public void testSaveNull(){
        ResponseEntity<RoleDto> expected = new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        ResponseEntity<RoleDto> result = roleController.save(null);

        assertEquals(expected, result);
    }

    /**
     * T5.81
     * pre: roleDto exits
     * result: the RoleDto and a CREATED status
     */
    @Test
    public void testUpdate(){
        RoleDto roleDto = mockRoleDto();

        ResponseEntity<RoleDto> expected = new ResponseEntity<>(roleDto, HttpStatus.CREATED);
        ResponseEntity<RoleDto> result = roleController.update(roleDto);
        verify(roleService).update(eq(roleDto));
        assertEquals(expected, result);
    }

    /**
     * T5.82
     * pre: roleDto is null
     * result: BAD_REQUEST status
     */
    @Test
    public void testUpdateNull(){
        ResponseEntity<RoleDto> expected = new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        ResponseEntity<RoleDto> result = roleController.update(null);
        assertEquals(expected, result);
    }

    /**
     * T5.83
     * pre: ID has matching RoleDto
     * result: the matching RoleDto and OK status
     */
    @Test
    public void testGet(){

        RoleDto roleDto = mockRoleDto();

        when(roleService.get(eq("1"))).thenReturn(roleDto);

        ResponseEntity<RoleDto> expected = new ResponseEntity<>(roleDto, HttpStatus.OK);
        ResponseEntity<RoleDto> result = roleController.get("1");
        assertEquals(expected, result);

    }

    /**
     * T5.84
     * pre: ID doesn't have a match
     * result: NOT_FOUND status
     */
    @Test
    public void testGetNull(){

        when(roleService.get(eq("1"))).thenReturn(null);

        ResponseEntity<RoleDto> expected = new ResponseEntity<>(HttpStatus.NOT_FOUND);
        ResponseEntity<RoleDto> result = roleController.get("1");
        assertEquals(expected, result);

    }

    /**
     * T5.85
     * pre: ID has a matching RoleDto
     * result: RoleDto is deleted and receive NO_CONTENT status
     */
    @Test
    public void testDelete(){
        RoleDto roleDto = mockRoleDto();

        when(roleService.get(eq("1"))).thenReturn(roleDto);

        ResponseEntity<RoleDto> expected = new ResponseEntity<>(HttpStatus.NO_CONTENT);
        ResponseEntity<RoleDto> result = roleController.delete("1");
        verify(roleService).delete(eq("1"));
        assertEquals(expected, result);

    }

    /**
     * T5.86
     * pre: ID doesn't have a match
     * result: NOT_FOUND status
     */
    @Test
    public void testDeleteNull(){

        when(roleService.get(eq("1"))).thenReturn(null);

        ResponseEntity<RoleDto> expected = new ResponseEntity<>(HttpStatus.NOT_FOUND);
        ResponseEntity<RoleDto> result = roleController.delete("1");

        assertEquals(expected, result);

    }

}
