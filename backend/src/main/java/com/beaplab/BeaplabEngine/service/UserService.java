package com.beaplab.BeaplabEngine.service;

import com.beaplab.BeaplabEngine.constants.BeapEngineConstants;
import com.beaplab.BeaplabEngine.metadata.IncorrectLoginsDto;
import com.beaplab.BeaplabEngine.metadata.UserDto;
import com.beaplab.BeaplabEngine.model.Role;
import com.beaplab.BeaplabEngine.model.User;
import com.beaplab.BeaplabEngine.repository.UserDao;
import com.beaplab.BeaplabEngine.util.Util;
import com.beaplab.BeaplabEngine.util.error.UserAlreadyExistException;
import com.beaplab.BeaplabEngine.util.objectMapper.UserMapper;
import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import java.sql.Timestamp;
import java.util.*;

/**
 * The UserService service class which implements UserDetailsService interface. The UserDetailsService interface is used to retrieve user-related data. It has one method named loadUserByUsername() which finds a user entity based on the username and can be overridden to customize the process of finding the user.
 */
@Service("userService")
public class UserService implements UserDetailsService {


    final static Logger logger = LogManager.getLogger(UserService.class.getName());

    @Autowired
    private UserDao userDao;

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private IncorrectLoginsService incorrectLoginsService;

    @Autowired
    private Util util;

    /**
     * retrieving a list of type User
     * @return List<UserDto>
     */
    public List<UserDto> list() {
        logger.info("in UserService: list");

        return userMapper.model2Dto(userDao.list(), new ArrayList<UserDto>());
    }


    /**
     * creating a new User
     * @param userDto: the data transfer object allowing for information encapsulation and transfer
     */
    public JSONObject save(UserDto userDto)  throws UserAlreadyExistException {
        logger.info("in UserService: save");

        JSONObject jsonObject = new JSONObject();

        if (usernameExist(userDto.getUsername())) {
            jsonObject.put(BeapEngineConstants.SUCCESS_STR, false);
            jsonObject.put("message", "There is already another account with username: " + userDto.getUsername());
            jsonObject.put("status_code", HttpStatus.INTERNAL_SERVER_ERROR.value());
            return jsonObject;
        }

        User user = userMapper.dto2Model(userDto, new User());
        Long userId = userDao.save(user);

        userDto.setId(Long.parseLong(userId.toString()));

        jsonObject.put(BeapEngineConstants.SUCCESS_STR, true);
        jsonObject.put("userDto", userDto);
        jsonObject.put("status_code", HttpStatus.CREATED.value());
        return jsonObject;
    }



    /**
     * check to see the username already exists
     * @param username : the name of the user being checked to see if the user already exists
     * @return : a boolean indicating whether the username exists or not
     */
    private boolean usernameExist(String username) {
        User user = userDao.findByUsername(username);
        return user != null;
    }



    /**
     * updating an existing User
     * @param userDto: the data transfer object providing access to data transfer and encapsulation between system layers
     */
    public void update(UserDto userDto) {
        logger.info("in UserService: Update");

        User user = userMapper.dto2Model(userDto, new User());
        userDao.update(user);
    }


    /**
     * retrieving a specific User by its id
     * @param id : the id of the user that the method gets
     * @return UserDto
     */
    public UserDto get(String id) {
        logger.info("in UserService: get");

        Long uuid = Long.parseLong(id);
        User user = userDao.get(uuid);
        if(user != null)
            return userMapper.model2Dto(user, new UserDto());
        return null;
    }


    /**
     * deleting a specific User by its id
     * @param id: the id of the user that the method deletes
     */
    public void delete(String id) {
        logger.info("in UserService: delete");

        Long uuid = Long.parseLong(id);
        userDao.delete(uuid);
    }



    /**
     * checking the validity of a pair of username and password
     * @param username : the entered username of the user attempting to log in
     * @param password : the entered password of the user attempting to log in
     * @return : a json document containing a variety of possible fields such as the status code, a message to the user, user details, user DTO, or user Authorities
     */
    public JSONObject login(String username, String password){

        logger.info("in UserService: login");

        JSONObject jsonObject = new JSONObject();

        User user = userDao.findByUserPass(username, password);
        if (user != null) { // valid username and password
            UserDto userDto = userMapper.model2Dto(user, new UserDto());

            IncorrectLoginsDto incorrectLoginsDto = incorrectLoginsService.getByUserId(userDto.getId());

            if (incorrectLoginsDto != null) {
                if (incorrectLoginsDto.getLocked()) { // account is locked
                    Date currentDate = new Date();
                    long difference = util.dateDifference(incorrectLoginsDto.getLockedDate(), currentDate);
                    if (difference > 23) { // unlock the account
                        incorrectLoginsDto.setLocked(false);
                        incorrectLoginsDto.setIncorrectAttempts(0);
                        incorrectLoginsDto.setLockedDate(null);
                        incorrectLoginsService.update(incorrectLoginsDto);
                    }
                    else {
                        jsonObject.put(BeapEngineConstants.SUCCESS_STR, false);
                        jsonObject.put("status_code", HttpStatus.LOCKED.value());
                        jsonObject.put("message", "Your account is locked for 24 hours.");
                        return jsonObject;
                    }
                }
            }



            UserDetails userDetails = loadUserDetails(userDto);

            jsonObject.put(BeapEngineConstants.SUCCESS_STR, true);
            jsonObject.put("status_code", HttpStatus.OK.value());
            jsonObject.put("Authorities", userDetails.getAuthorities());
            jsonObject.put("userDetails", userDetails);
            jsonObject.put("userDto", userDto);

            return jsonObject;
        }
        else {
            UserDto userDto = getUserByUsername(username);

            if (userDto != null) { // valid username, invalid password
                IncorrectLoginsDto incorrectLoginsDto = incorrectLoginsService.getByUserId(userDto.getId());

                if (incorrectLoginsDto == null) { // incorrect login attempt for the first time by invalid password
                    incorrectLoginsDto = new IncorrectLoginsDto(null, userDto, false, 1,
                            null);
                    incorrectLoginsService.save(incorrectLoginsDto);

                    jsonObject.put(BeapEngineConstants.SUCCESS_STR, false);
                    jsonObject.put("status_code", HttpStatus.UNAUTHORIZED.value());
                    jsonObject.put("message", "invalid username or password");
                    return jsonObject;
                }
                else { // existing incorrect login attempts by invalid password

                    if (incorrectLoginsDto.getLocked()) { // account is locked
                        Date currentDate = new Date();
                        long difference = util.dateDifference(incorrectLoginsDto.getLockedDate(), currentDate);

                        if (difference > 23) { // unlock the account
                            incorrectLoginsDto.setLocked(false);
                            incorrectLoginsDto.setIncorrectAttempts(0);
                            incorrectLoginsDto.setLockedDate(null);
                            incorrectLoginsService.update(incorrectLoginsDto);

                            UserDetails userDetails = loadUserDetails(userDto);

                            jsonObject.put(BeapEngineConstants.SUCCESS_STR, true);
                            jsonObject.put("status_code", HttpStatus.OK.value());
                            jsonObject.put("Authorities", userDetails.getAuthorities());
                            jsonObject.put("userDetails", userDetails);
                            jsonObject.put("userDto", userDto);

                            return jsonObject;
                        }
                        else {
                            jsonObject.put(BeapEngineConstants.SUCCESS_STR, false);
                            jsonObject.put("status_code", HttpStatus.LOCKED.value());
                            jsonObject.put("message", "Your account is locked for 24 hours.");
                            return jsonObject;
                        }
                    }

                    if (incorrectLoginsDto.getIncorrectAttempts() == 5) { // lock the account for 24 hours
                        incorrectLoginsDto.setLocked(true);
                        Date date = new Date();
                        incorrectLoginsDto.setLockedDate(new Timestamp(date.getTime()));
                        incorrectLoginsService.update(incorrectLoginsDto);

                        jsonObject.put(BeapEngineConstants.SUCCESS_STR, false);
                        jsonObject.put("status_code", HttpStatus.LOCKED.value());
                        jsonObject.put("message", "Your account is locked for 24 hours.");
                        return jsonObject;
                    }

                    if (incorrectLoginsDto.getIncorrectAttempts() < 5) { // increase the incorrect attempts by one
                        incorrectLoginsDto.setIncorrectAttempts(incorrectLoginsDto.getIncorrectAttempts() + 1);
                        incorrectLoginsService.update(incorrectLoginsDto);

                        jsonObject.put(BeapEngineConstants.SUCCESS_STR, false);
                        jsonObject.put("status_code", HttpStatus.UNAUTHORIZED.value());
                        jsonObject.put("message", "invalid username or password");
                        return jsonObject;
                    }
                }
            }
            else {
                jsonObject.put(BeapEngineConstants.SUCCESS_STR, false);
                jsonObject.put("status_code", HttpStatus.UNAUTHORIZED.value());
                jsonObject.put("message", "invalid username or password");
                return jsonObject;
            }
        }
        return null;
    }

    public UserDto getUserByUsername(String username) {
        logger.info("in UserService: getUserByUsername");

        User user = userDao.findByUsername(username);

        if (user != null)
            return userMapper.model2Dto(user, new UserDto());
        return null;
    }



    /**
     * loading UserDetails by its username
     * @param username : the username of the user who is to be loaded
     * @return : the details of the loaded user
     * throws : UsernameNotFoundException
     */
    @Override
    public UserDetails loadUserByUsername(String username) /*throws UsernameNotFoundException*/ {

        logger.info("in UserService: loadUserByUsername");

        User user = userDao.findByUsername(username);

        if (user == null)
            return null;

        boolean enabled = true;
        boolean accountNonExpired = true;
        boolean credentialsNonExpired = true;
        boolean accountNonLocked = true;
        return  new org.springframework.security.core.userdetails.User
                (user.getUsername(),
                        user.getPassword().toLowerCase(), enabled, accountNonExpired,
                        credentialsNonExpired, accountNonLocked,
                        getAuthorities(user.getRoleIDs()));
    }


    /**
     * loading UserDetails for an input user
     * @param userDto : the data transfer object of the user whose details are to be loaded
     * @return : the details of the user
     */
    public UserDetails loadUserDetails(UserDto userDto){

        logger.info("in UserService: loadUserDetails");

        User user = userMapper.dto2Model(userDto, new User());

        boolean enabled = true;
        boolean accountNonExpired = true;
        boolean credentialsNonExpired = true;
        boolean accountNonLocked = true;
        return  new org.springframework.security.core.userdetails.User
                (user.getUsername(),
                        user.getPassword().toLowerCase(), enabled, accountNonExpired,
                        credentialsNonExpired, accountNonLocked,
                        getAuthorities(user.getRoleIDs()));
    }



    private static List<GrantedAuthority> getAuthorities (Set<Role> roles) {
        List<GrantedAuthority> authorities = new ArrayList<>();
        for (Role role : roles) {
            authorities.add(new SimpleGrantedAuthority(role.getRoleName()));
        }
        return authorities;
    }

    /***
     * a method to delete the users account including all information related to them or uploaded by them using the user DAO
     * @param id where id is the id of the user whose account is to be deleted
     * @return a boolean indicating whether the delete operation succeeded.
     */
    public Boolean deleteUserAccount(Long id){
        logger.info("in UserService: deleteUserAccount");

        Boolean deleteSuccess = userDao.deleteUserAccount(id);
        return deleteSuccess;

    }


    /***
     * a method to delete the user's uploaded raw, processed, and predicted data using User DAO
     * @param id where id is the id of the user whose data is to be deleted
     */
    public void deleteUserData(Long id){
        logger.info("in UserService: deleteUserData");
        userDao.deleteUserData(id);

    }



}
