/*
 * Developed by Arastoo Bozorgi.
 * a.bozorgi67@gmail.com
 */

package com.beaplab.BeaplabEngine.controller;

import com.beaplab.BeaplabEngine.authentication.MyAuthentication;
import com.beaplab.BeaplabEngine.constants.BeapEngineConstants;
import com.beaplab.BeaplabEngine.metadata.IncorrectLoginsDto;
import com.beaplab.BeaplabEngine.metadata.LoginUserDto;
import com.beaplab.BeaplabEngine.metadata.UserDto;
import com.beaplab.BeaplabEngine.service.IncorrectLoginsService;
import com.beaplab.BeaplabEngine.service.LoginUserService;
import com.beaplab.BeaplabEngine.service.UserService;
import com.beaplab.BeaplabEngine.util.objectMapper.UserMapper;

import com.rollbar.notifier.Rollbar;

import io.swagger.annotations.ApiOperation;
import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.session.ExpiringSession;
import org.springframework.session.FindByIndexNameSessionRepository;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;
import springfox.documentation.annotations.ApiIgnore;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.io.Serializable;
import java.util.*;

@Controller
public class LoginUserController {

    
    final static Logger logger = LogManager.getLogger(LoginUserController.class.getName());
    Rollbar rollbar;
    /**
     * injecting LoginUserService into this class
     */
    @Autowired
    private LoginUserService loginUserService;


    /**
     * injecting IncorrectLoginsService into this class
     */
    @Autowired
    private IncorrectLoginsService incorrectLoginsService;


    /**
     * injecting UserService into this class
     */
    @Autowired
    private UserService userService;


    /**
     * injecting MyAuthentication into this class
     */
    @Autowired
    private MyAuthentication myAuthentication;


    /**
     * injecting UserMapper into this class
     */
    @Autowired
    UserMapper userMapper;


    @Autowired
    FindByIndexNameSessionRepository<? extends ExpiringSession> sessions;


    @RequestMapping(value = "/login", method = RequestMethod.GET)
    @ApiIgnore
    public ModelAndView getLoginView() throws Exception {
        logger.info("in LoginUserController/getLoginView");

        ModelAndView model = new ModelAndView("login");
        return model;
    }


    /**
     * TODO this is a test method which should be removed later
     * @param request
     * @return
     */
    @RequestMapping(value = "/checkauth", method = RequestMethod.GET)
    @ApiIgnore
    public ResponseEntity<String> checkAuth(HttpServletRequest request) {

        String username = request.getSession(false).getAttribute(FindByIndexNameSessionRepository.PRINCIPAL_NAME_INDEX_NAME).toString();
        logger.info("request.getUserPrincipal(): " + request.getSession(false).getAttribute(FindByIndexNameSessionRepository.PRINCIPAL_NAME_INDEX_NAME));

        logger.info("sessions: " + sessions);

        Collection<? extends ExpiringSession> usersSessions = sessions
                .findByIndexNameAndIndexValue(
                        FindByIndexNameSessionRepository.PRINCIPAL_NAME_INDEX_NAME,
                        username)
                .values();

        Iterator<? extends ExpiringSession> iterator = usersSessions.iterator();
        while (iterator.hasNext()) {
            Set<String> set = iterator.next().getAttributeNames();
            for (String str: set){
                logger.info("str: " + str);
                rollbar.info("str: " + str);
            }

        }

        if (!usersSessions.isEmpty()){
            logger.info("A valid session exists for username: " + username);
            rollbar.info("A valid session exists for username: " + username);
            Authentication authToken = (Authentication) request.getSession(false).getAttribute("token");
            logger.info("auth: " + authToken);
            rollbar.info("auth: " + authToken);

        }
        else {
            logger.info("A valid session doesn't exists for username: " + username);
            rollbar.info("A valid session doesn't exists for username: " + username);

        }
        return new ResponseEntity<String>("checkAuth", HttpStatus.OK);
    }



    /**
     * handles user login request - this request will not pass through AuthInterceptor as it doesn't have /rest/v1/ in the beginning of its uri
     * @param request
     * @param username
     * @param password
     * @return
     */
    @RequestMapping(value = "/loginuser", method = RequestMethod.POST)
    @ApiOperation(value = "Login User", notes = "Logging in a user with username and password", response = LoginUserDto.class)
    public @ResponseBody ResponseEntity<JSONObject> login(HttpServletRequest request,
                                                          @RequestParam("username") String username,
                                                          @RequestParam("password") String password) {

        logger.info("in LoginUserController: login");

        HttpHeaders headers = new HttpHeaders();

        JSONObject jsonObject = userService.login(username, password);
        if ((boolean) jsonObject.get(BeapEngineConstants.SUCCESS_STR)) {
            UserDetails userDetails = (UserDetails) jsonObject.get("userDetails");
            UserDto userDto = (UserDto) jsonObject.get("userDto");


            String sessionID = myAuthentication.authenticate(userDetails, request.getSession(true),
                    request.getRemoteAddr(), request.getHeader("User-Agent"), userDto.getId());

            // saving the login info in LoginUser
            LoginUserDto loginUserDto = new LoginUserDto(null, userDto, new Date(), "");
            loginUserService.save(loginUserDto);

            headers.add(BeapEngineConstants.AUTH_TOKEN, sessionID);

            JSONObject result = new JSONObject();
            result.put(BeapEngineConstants.SUCCESS_STR, true);
            result.put("status_code", HttpStatus.OK.value());
            result.put("Authorities", userDetails.getAuthorities());
            result.put("userID", userDto.getId());

            return new ResponseEntity<JSONObject>(result, headers, HttpStatus.OK);
        }
        else {
            return new ResponseEntity<JSONObject>(jsonObject, headers, (HttpStatus.valueOf((int)jsonObject.get("status_code"))));
        }
    }


    /**
     * handles user logout - this request will not pass through AuthInterceptor as it doesn't have /rest/v1/ in the beginning of its uri
     * @param request
     * @return
     */
    @RequestMapping(value = "/logoutuser", method = RequestMethod.GET)
    @ApiOperation(value = "Logout User", notes = "Logging out a user with username", response = LoginUserDto.class)
    public ResponseEntity<JSONObject> logout(HttpServletRequest request) {

        logger.info("in LoginUserController: logout");

        JSONObject jsonObject = new JSONObject();

        HttpSession session = request.getSession(false);

        if(session==null || !request.isRequestedSessionIdValid() ||
                session.getAttribute(FindByIndexNameSessionRepository.PRINCIPAL_NAME_INDEX_NAME) == null) {   // invalid session
            logger.info("invalid session");

            jsonObject.put(BeapEngineConstants.SUCCESS_STR, false);
            jsonObject.put("message", "Invalid username");
            jsonObject.put("status_code", HttpStatus.NOT_FOUND.value());

            return new ResponseEntity<>(jsonObject, HttpStatus.NOT_FOUND);
        }

        /**
         * extracting username from httpServletRequest session
         */
        String username = session.getAttribute(FindByIndexNameSessionRepository.PRINCIPAL_NAME_INDEX_NAME).toString();

        UserDetails userDetails = userService.loadUserByUsername(username);
        if (userDetails != null) {
            myAuthentication.logout(session);

            jsonObject.put(BeapEngineConstants.SUCCESS_STR, true);
            jsonObject.put("message", "user: " + username + " logged out successfully");
            jsonObject.put("status_code", HttpStatus.OK.value());

            return new ResponseEntity<>(jsonObject, HttpStatus.OK);
        }

        jsonObject.put(BeapEngineConstants.SUCCESS_STR, false);
        jsonObject.put("message", "Invalid username");
        jsonObject.put("status_code", HttpStatus.NOT_FOUND.value());

        return new ResponseEntity<>(jsonObject, HttpStatus.NOT_FOUND);
    }



    /**
     * handles a GET request for LoginUser list
     * @return ResponseEntity<List<LoginUserDto>>
     */
    @PreAuthorize("hasRole('ADMIN')")
    @RequestMapping(value = "/rest/beapengine/loginuser", method = RequestMethod.GET, produces = "application/json")
    @ApiOperation(value = "List all LoginUsers", notes = "Returns a list of type LoginUserDto", response = LoginUserDto.class)
    public ResponseEntity<List<LoginUserDto>> list() {

        logger.info("in LoginUserController/loginuser GET method");

        List<LoginUserDto> loginUserDtos = loginUserService.list();

        if (loginUserDtos == null) {
            return new ResponseEntity<List<LoginUserDto>>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<List<LoginUserDto>>(loginUserDtos, HttpStatus.OK);
    }



    /**
     * handles a POST request for creating an LoginUser
     * @param loginUserDto
     * @return ResponseEntity<LoginUserDto>
     */
    @PreAuthorize("hasRole('ADMIN')")
    @RequestMapping(value = "/rest/beapengine/loginuser", method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_VALUE, produces = "application/json")
    @ApiOperation(value = "Add a new LoginUser", notes = "Saving an LoginUser and returning the saved LoginUser in an object of type LoginUserDto", response = LoginUserDto.class)
    public ResponseEntity<LoginUserDto> save(@RequestBody LoginUserDto loginUserDto) {

        logger.info("in LoginUserController/loginuser POST method");

        if (loginUserDto == null) {
            return new ResponseEntity<LoginUserDto>(HttpStatus.BAD_REQUEST);
        }

        Serializable savedId = loginUserService.save(loginUserDto);
        loginUserDto.setId(Long.parseLong(savedId.toString()));

        return new ResponseEntity<LoginUserDto>(loginUserDto, HttpStatus.CREATED);
    }



    /**
     * handles a PUT request for updating an LoginUser
     * @param loginUserDto
     * @return ResponseEntity<LoginUserDto>
     */
    @PreAuthorize("hasRole('ADMIN')")
    @RequestMapping(value = "/rest/beapengine/loginuser", method = RequestMethod.PUT, consumes = MediaType.APPLICATION_JSON_VALUE, produces = "application/json")
    @ApiOperation(value = "Update existing LoginUser", notes = "Updating an existing LoginUser and returning the updated LoginUser in an object of type LoginUserDto", response = LoginUserDto.class)
    public ResponseEntity<LoginUserDto> update(@RequestBody LoginUserDto loginUserDto) {

        logger.info("in LoginUserController/loginuser PUT method");

        if (loginUserDto == null) {
            return new ResponseEntity<LoginUserDto>(HttpStatus.BAD_REQUEST);
        }
        loginUserService.update(loginUserDto);

        return new ResponseEntity<LoginUserDto>(loginUserDto, HttpStatus.CREATED);
    }



    /**
     * handles a GET request for retrieving an LoginUser by its id
     * @param id
     * @return ResponseEntity<LoginUserDto>
     */
    @PreAuthorize("hasRole('ADMIN')")
    @RequestMapping(value = "/rest/beapengine/loginuser/{id}", method = RequestMethod.GET, produces = "application/json")
    @ApiOperation(value = "Find LoginUser by ID", notes = "Finding an LoginUser by input id and returning the result in an object of type LoginUserDto", response = LoginUserDto.class)
    public ResponseEntity<LoginUserDto> get(@PathVariable("id") String id) {

        logger.info("in LoginUserController/loginuser/{" + id + "} GET method");

        LoginUserDto loginUserDto = loginUserService.get(id);

        if (loginUserDto == null) {
            return new ResponseEntity<LoginUserDto>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<LoginUserDto>(loginUserDto, HttpStatus.OK);
    }



    /**
     * handles a DELETE request for deleting an LoginUser by its id
     * @param id
     * @return ResponseEntity<LoginUserDto>
     */
    @PreAuthorize("hasRole('ADMIN')")
    @RequestMapping(value = "/rest/beapengine/loginuser/{id}", method = RequestMethod.DELETE, consumes = MediaType.APPLICATION_JSON_VALUE, produces = "application/json")
    @ApiOperation(value = "Delete LoginUser by ID", notes = "Deleting an LoginUser with ID = id", response = LoginUserDto.class)
    public ResponseEntity<LoginUserDto> delete(@PathVariable("id") String id) {

        logger.info("in LoginUserController/loginuser/{" + id + "} DELETE method");

        LoginUserDto loginUserDto = loginUserService.get(id);

        if (loginUserDto == null) {
            return new ResponseEntity<LoginUserDto>(HttpStatus.NOT_FOUND);
        }
        loginUserService.delete(id);

        return new ResponseEntity<LoginUserDto>(HttpStatus.NO_CONTENT);
    }
    
}
