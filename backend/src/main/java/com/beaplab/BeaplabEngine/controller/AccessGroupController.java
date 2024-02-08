/*
 * Developed by Arastoo Bozorgi.
 * a.bozorgi67@gmail.com
 */

package com.beaplab.BeaplabEngine.controller;

import com.beaplab.BeaplabEngine.constants.BeapEngineConstants;
import com.beaplab.BeaplabEngine.metadata.AccessGroupDto;
import com.beaplab.BeaplabEngine.service.AccessGroupService;
import io.swagger.annotations.ApiOperation;
import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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
@PreAuthorize("hasAnyRole('ADMIN', 'PROVIDER')")
@ApiIgnore
public class AccessGroupController {

    final static Logger logger = LogManager.getLogger(AccessGroupController.class.getName());

    /**
     * injecting AccessGroupService into this class
     */
    @Autowired
    private AccessGroupService accessGroupService;



    /**
     * handles a GET request for AccessGroup list
     * @return ResponseEntity<List<AccessGroupDto>>
     */
    @RequestMapping(value = "/accessgroup", method = RequestMethod.GET, produces = "application/json")
    @ApiOperation(value = "List all AccessGroups", notes = "Returns a list of type AccessGroupDto", response = AccessGroupDto.class)
    public ResponseEntity<List<AccessGroupDto>> list() {

        logger.info("in AccessGroupController/accessgroup GET method");

        List<AccessGroupDto> accessGroupDtos = accessGroupService.list();

        if (accessGroupDtos == null) {
            return new ResponseEntity<List<AccessGroupDto>>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<List<AccessGroupDto>>(accessGroupDtos, HttpStatus.OK);
    }



    /**
     * handles a POST request for creating an AccessGroup
     * @param accessGroupDto
     * @return ResponseEntity<AccessGroupDto>
     */
    @RequestMapping(value = "/accessgroup", method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_VALUE, produces = "application/json")
    @ApiOperation(value = "Add a new AccessGroup", notes = "Saving an AccessGroup and returning the saved AccessGroup in an object of type AccessGroupDto", response = AccessGroupDto.class)
    public ResponseEntity<AccessGroupDto> save(@RequestBody AccessGroupDto accessGroupDto) {

        logger.info("in AccessGroupController/accessgroup POST method");

        if (accessGroupDto == null) {
            return new ResponseEntity<AccessGroupDto>(HttpStatus.BAD_REQUEST);
        }

        Serializable savedId = accessGroupService.save(accessGroupDto);
        accessGroupDto.setId(Long.parseLong(savedId.toString()));

        return new ResponseEntity<AccessGroupDto>(accessGroupDto, HttpStatus.CREATED);
    }



    /**
     * handles a PUT request for updating an AccessGroup
     * @param accessGroupDto
     * @return ResponseEntity<AccessGroupDto>
     */
    @RequestMapping(value = "/accessgroup", method = RequestMethod.PUT, consumes = MediaType.APPLICATION_JSON_VALUE, produces = "application/json")
    @ApiOperation(value = "Update existing AccessGroup", notes = "Updating an existing AccessGroup and returning the updated AccessGroup in an object of type AccessGroupDto", response = AccessGroupDto.class)
    public ResponseEntity<AccessGroupDto> update(@RequestBody AccessGroupDto accessGroupDto) {

        logger.info("in AccessGroupController/accessgroup PUT method");

        if (accessGroupDto == null) {
            return new ResponseEntity<AccessGroupDto>(HttpStatus.BAD_REQUEST);
        }
        accessGroupService.update(accessGroupDto);

        return new ResponseEntity<AccessGroupDto>(accessGroupDto, HttpStatus.CREATED);
    }



    /**
     * handles a GET request for retrieving an AccessGroup by its id
     * @param id
     * @return ResponseEntity<AccessGroupDto>
     */
    @RequestMapping(value = "/accessgroup/{id}", method = RequestMethod.GET, produces = "application/json")
    @ApiOperation(value = "Find AccessGroup by ID", notes = "Finding an AccessGroup by input id and returning the result in an object of type AccessGroupDto", response = AccessGroupDto.class)
    public ResponseEntity<AccessGroupDto> get(@PathVariable("id") String id) {

        logger.info("in AccessGroupController/accessgroup/{" + id + "} GET method");

        AccessGroupDto accessGroupDto = accessGroupService.get(id);

        if (accessGroupDto == null) {
            return new ResponseEntity<AccessGroupDto>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<AccessGroupDto>(accessGroupDto, HttpStatus.OK);
    }



    /**
     * handles a DELETE request for deleting an AccessGroup by its id
     * @param id
     * @return ResponseEntity<AccessGroupDto>
     */
    @RequestMapping(value = "/accessgroup/{id}", method = RequestMethod.DELETE, consumes = MediaType.APPLICATION_JSON_VALUE, produces = "application/json")
    @ApiOperation(value = "Delete AccessGroup by ID", notes = "Deleting an AccessGroup with ID = id", response = AccessGroupDto.class)
    public ResponseEntity<AccessGroupDto> delete(@PathVariable("id") String id) {

        logger.info("in AccessGroupController/accessgroup/{" + id + "} DELETE method");

        AccessGroupDto accessGroupDto = accessGroupService.get(id);

        if (accessGroupDto == null) {
            return new ResponseEntity<AccessGroupDto>(HttpStatus.NOT_FOUND);
        }
        accessGroupService.delete(id);

        return new ResponseEntity<AccessGroupDto>(HttpStatus.NO_CONTENT);
    }


}
