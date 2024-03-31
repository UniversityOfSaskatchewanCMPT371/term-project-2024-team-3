/*
 * Developed by Arastoo Bozorgi.
 * a.bozorgi67@gmail.com
 */

package com.beaplab.BeaplabEngine.controller;

import com.beaplab.BeaplabEngine.constants.BeapEngineConstants;
import com.beaplab.BeaplabEngine.metadata.RoleDto;
import com.beaplab.BeaplabEngine.service.RoleService;
import com.rollbar.notifier.Rollbar;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import springfox.documentation.annotations.ApiIgnore;

import java.io.Serializable;
import java.util.List;
import java.util.UUID;

@Controller
@RequestMapping(BeapEngineConstants.REQUEST_MAPPING_PATTERN)
@Secured("ROLE_ADMIN")
@ApiIgnore
public class RoleController {



    @Autowired
    private Rollbar rollbar;

    /**
     * injecting RoleService into this class
     */
    @Autowired
    private RoleService roleService;


    /**
     * handles a GET request for Role list
     * @return ResponseEntity<List<RoleDto>>
     */
    @RequestMapping(value = "/role", method = RequestMethod.GET, produces = "application/json")
    @ApiOperation(value = "List all Roles", notes = "Returns a list of type RoleDto", response = RoleDto.class)
    public ResponseEntity<List<RoleDto>> list() {

        rollbar.info("in RoleController/role GET method");

        List<RoleDto> roleDtos = roleService.list();

        if (roleDtos == null) {
            return new ResponseEntity<List<RoleDto>>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<List<RoleDto>>(roleDtos, HttpStatus.OK);
    }



    /**
     * handles a POST request for creating an Role
     * @param roleDto
     * @return ResponseEntity<RoleDto>
     */
    @RequestMapping(value = "/role", method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_VALUE, produces = "application/json")
    @ApiOperation(value = "Add a new Role", notes = "Saving an Role and returning the saved Role in an object of type RoleDto", response = RoleDto.class)
    public ResponseEntity<RoleDto> save(@RequestBody RoleDto roleDto) {

        rollbar.info("in RoleController/role POST method");

        if (roleDto == null) {
            return new ResponseEntity<RoleDto>(HttpStatus.BAD_REQUEST);
        }

        Serializable savedId = roleService.save(roleDto);
        roleDto.setId(Long.parseLong(savedId.toString()));

        return new ResponseEntity<RoleDto>(roleDto, HttpStatus.CREATED);
    }



    /**
     * handles a PUT request for updating an Role
     * @param roleDto
     * @return ResponseEntity<RoleDto>
     */
    @RequestMapping(value = "/role", method = RequestMethod.PUT, consumes = MediaType.APPLICATION_JSON_VALUE, produces = "application/json")
    @ApiOperation(value = "Update existing Role", notes = "Updating an existing Role and returning the updated Role in an object of type RoleDto", response = RoleDto.class)
    public ResponseEntity<RoleDto> update(@RequestBody RoleDto roleDto) {

        rollbar.info("in RoleController/role PUT method");

        if (roleDto == null) {
            return new ResponseEntity<RoleDto>(HttpStatus.BAD_REQUEST);
        }
        roleService.update(roleDto);

        return new ResponseEntity<RoleDto>(roleDto, HttpStatus.CREATED);
    }



    /**
     * handles a GET request for retrieving an Role by its id
     * @param id
     * @return ResponseEntity<RoleDto>
     */
    @RequestMapping(value = "/role/{id}", method = RequestMethod.GET, produces = "application/json")
    @ApiOperation(value = "Find Role by ID", notes = "Finding an Role by input id and returning the result in an object of type RoleDto", response = RoleDto.class)
    public ResponseEntity<RoleDto> get(@PathVariable("id") String id) {

        rollbar.info("in RoleController/role/{" + id + "} GET method");

        RoleDto roleDto = roleService.get(id);

        if (roleDto == null) {
            return new ResponseEntity<RoleDto>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<RoleDto>(roleDto, HttpStatus.OK);
    }



    /**
     * handles a DELETE request for deleting an Role by its id
     * @param id
     * @return ResponseEntity<RoleDto>
     */
    @RequestMapping(value = "/role/{id}", method = RequestMethod.DELETE, consumes = MediaType.APPLICATION_JSON_VALUE, produces = "application/json")
    @ApiOperation(value = "Delete Role by ID", notes = "Deleting an Role with ID = id", response = RoleDto.class)
    public ResponseEntity<RoleDto> delete(@PathVariable("id") String id) {

        rollbar.info("in RoleController/role/{" + id + "} DELETE method");

        RoleDto roleDto = roleService.get(id);

        if (roleDto == null) {
            return new ResponseEntity<RoleDto>(HttpStatus.NOT_FOUND);
        }
        roleService.delete(id);

        return new ResponseEntity<RoleDto>(HttpStatus.NO_CONTENT);
    }
}
