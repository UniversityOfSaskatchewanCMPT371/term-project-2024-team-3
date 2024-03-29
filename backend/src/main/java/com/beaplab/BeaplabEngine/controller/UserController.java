package com.beaplab.BeaplabEngine.controller;

import com.beaplab.BeaplabEngine.authentication.SessionDetails;
import com.beaplab.BeaplabEngine.constants.BeapEngineConstants;
import com.beaplab.BeaplabEngine.metadata.UserDto;
import com.beaplab.BeaplabEngine.service.UserService;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import springfox.documentation.annotations.ApiIgnore;
import springfox.documentation.spring.web.json.Json;

import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

@Controller
@ApiIgnore
public class UserController {


    final static Logger logger = LogManager.getLogger(UserController.class.getName());

    /**
     * injecting UserService into this class
     */
    @Autowired
    private UserService userService;


    /**
     * handles a POST request for creating an User
     * @param userDto
     * @return ResponseEntity<UserDto>
     */
    @RequestMapping(value = "/user", method = RequestMethod.POST)
    @ApiOperation(value = "Add a new User", notes = "Saving an User and returning the saved User in an object of type UserDto")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "{success: true, userDto: XXXX}"),
            @ApiResponse(code = 400, message = "{success: false, message: Invalid User information provided}")
    })
    public ResponseEntity<JSONObject> save(@RequestBody UserDto userDto) {

        logger.info("in UserController/user POST method");
        JSONObject jsonObject = new JSONObject();

        if (userDto == null) {
            jsonObject.put(BeapEngineConstants.SUCCESS_STR, false);
            jsonObject.put("message", "Invalid User information provided");
            jsonObject.put("status_code", HttpStatus.BAD_REQUEST.value());

            return new ResponseEntity<>(jsonObject, HttpStatus.BAD_REQUEST);
        }

        jsonObject = userService.save(userDto);

        return new ResponseEntity(jsonObject, (HttpStatus.valueOf((int)jsonObject.get("status_code"))));
    }


    /**
     * handles a GET request for User list
     * @return ResponseEntity<List<UserDto>>
     */
    @Secured("ADMIN")
    @RequestMapping(value = "/rest/beapengine/user", method = RequestMethod.GET, produces = "application/json")
    @ApiOperation(value = "List all Users", notes = "Returns a list of type UserDto", response = UserDto.class)
    public ResponseEntity<List<UserDto>> list() {

        logger.info("in UserController/user GET method");

        List<UserDto> userDtos = userService.list();

        if (userDtos == null) {
            return new ResponseEntity<List<UserDto>>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<List<UserDto>>(userDtos, HttpStatus.OK);
    }



    /**
     * handles a PUT request for updating an User
     * @param userDto
     * @return ResponseEntity<UserDto>
     */
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_USER')")
    @RequestMapping(value = "/rest/beapengine/user", method = RequestMethod.PUT, consumes = MediaType.APPLICATION_JSON_VALUE, produces = "application/json")
    @ApiOperation(value = "Update existing User", notes = "Updating an existing User and returning the updated User in an object of type UserDto", response = UserDto.class)
    public ResponseEntity<UserDto> update(@RequestBody UserDto userDto) {

        logger.info("in UserController/user PUT method");

        if (userDto == null) {
            return new ResponseEntity<UserDto>(HttpStatus.BAD_REQUEST);
        }
        userService.update(userDto);

        return new ResponseEntity<UserDto>(userDto, HttpStatus.CREATED);
    }



    /**
     * handles a GET request for retrieving an User by its id
     * @param id
     * @return ResponseEntity<UserDto>
     */
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @RequestMapping(value = "/rest/beapengine/user/{id}", method = RequestMethod.GET, produces = "application/json")
    @ApiOperation(value = "Find User by ID", notes = "Finding an User by input id and returning the result in an object of type UserDto", response = UserDto.class)
    public ResponseEntity<UserDto> get(@PathVariable("id") String id) {

        logger.info("in UserController/user/{" + id + "} GET method");

        UserDto userDto = userService.get(id);

        if (userDto == null) {
            return new ResponseEntity<UserDto>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<UserDto>(userDto, HttpStatus.OK);
    }



    /**
     * handles a DELETE request for deleting an User by its id
     * @param id
     * @return ResponseEntity<UserDto>
     */
    @PreAuthorize("hasRole('ROLE_ADMIN') ")
    @RequestMapping(value = "/rest/beapengine/user/{id}", method = RequestMethod.DELETE, consumes = MediaType.APPLICATION_JSON_VALUE, produces = "application/json")
    @ApiOperation(value = "Delete User by ID", notes = "Deleting an User with ID = id", response = UserDto.class)
    public ResponseEntity<UserDto> delete(@PathVariable("id") String id) {

        logger.info("in UserController/user/{" + id + "} DELETE method");

        UserDto userDto = userService.get(id);

        if (userDto == null) {
            return new ResponseEntity<UserDto>(HttpStatus.NOT_FOUND);
        }
        userService.delete(id);

        return new ResponseEntity<UserDto>(HttpStatus.NO_CONTENT);
    }


    /**
     * handles a user's request to DELETE their account including all of their information
     * @param request
     * @return ResponseEntity<UserDto>
     */
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_USER')")
    @RequestMapping(value = "/rest/beapengine/user/deleteProfile", method = RequestMethod.DELETE,  produces = "application/json")
    @ApiOperation(value = "Delete User profile by ID", notes = "Deleting current User's account and data", response = JSONObject.class)
    public ResponseEntity<JSONObject> deleteProfile( HttpServletRequest request) {

        // log for debugging
        logger.info("in UserController/user/deleteProfile method");

        // confirm user session is valid 
        HttpSession session = request.getSession(false);
        if(session == null || !request.isRequestedSessionIdValid()) { // invalid session
            JSONObject jsonObject = new JSONObject();
            jsonObject.put(BeapEngineConstants.SUCCESS_STR, false);
            jsonObject.put("message", "Invalid session");
            jsonObject.put("status_code", HttpStatus.NON_AUTHORITATIVE_INFORMATION.value());

            return new ResponseEntity<JSONObject>(HttpStatus.NOT_FOUND);
        }

        // get current user's info from session. This is more secure as id is abstracted.
        SessionDetails sessionDetails = (SessionDetails) session.getAttribute("SESSION_DETAILS");
        Long id = sessionDetails.getUserId();
        String idAsString = id.toString();
        UserDto userDto = userService.get(idAsString);

        // if user is not found
        if (userDto == null)
        {
            return new ResponseEntity<JSONObject>(HttpStatus.NOT_FOUND);
        }
        //if found
        userService.delete(idAsString);
        

        // sessionDetails.getUserId();
        // UserDto userDto = userService.get(id);

        // if (userDto == null) {
        //     return new ResponseEntity<UserDto>(HttpStatus.NOT_FOUND);
        // }
        // userService.delete(id);

        return new ResponseEntity<JSONObject>(HttpStatus.NO_CONTENT);
    }



}
