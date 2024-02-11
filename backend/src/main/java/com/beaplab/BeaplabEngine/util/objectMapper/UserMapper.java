/*
 * Developed by Arastoo Bozorgi.
 * a.bozorgi67@gmail.com
 */

package com.beaplab.BeaplabEngine.util.objectMapper;

import com.beaplab.BeaplabEngine.metadata.AccessGroupDto;
import com.beaplab.BeaplabEngine.metadata.RawDataDto;
import com.beaplab.BeaplabEngine.metadata.RoleDto;
import com.beaplab.BeaplabEngine.metadata.UserDto;
import com.beaplab.BeaplabEngine.model.AccessGroup;
import com.beaplab.BeaplabEngine.model.RawData;
import com.beaplab.BeaplabEngine.model.Role;
import com.beaplab.BeaplabEngine.model.User;
import com.beaplab.BeaplabEngine.util.objectMapper.base.BaseMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.List;

/**
 * this class converts User to UserDto and vice versa
 */
@Component("userMapper")
public class UserMapper implements BaseMapper<User, UserDto> {

    /**
     * injecting AccessGroupMapper into this class
     */
    @Autowired
    AccessGroupMapper accessGroupMapper;

    /**
     * injecting RoleMapper into this class
     */
    @Autowired
    RoleMapper roleMapper;


    @Autowired
    RawDataMapper rawDataMapper;


    /**
     * converting User to UserDto
     * @param user
     * @param userDto
     * @return
     */
    @Override
    public UserDto model2Dto(User user, UserDto userDto) {
        userDto.setId(user.getId());
        userDto.setFirstName(user.getFirstName());
        userDto.setLastName(user.getLastName());
        userDto.setUsername(user.getUsername());
        userDto.setPassword(user.getPassword());

        if(user.isAccesGroupIDsLoaded())
            userDto.setAccessGroupIDs(accessGroupMapper.model2Dto(user.getAccessGroupIDs(), new HashSet<AccessGroupDto>()));

        if (user.isRoleIDsLoaded())
            userDto.setRoleDtoIDs(roleMapper.model2Dto(user.getRoleIDs(), new HashSet<RoleDto>()));

        if (user.isRawDataIDsLoaded())
            userDto.setRawDataIDs(rawDataMapper.model2Dto(user.getRawDataIDs(), new HashSet<RawDataDto>()));


        return userDto;
    }


    /**
     * converting a list of User to a list of UserDto
     * @param users
     * @param userDtos
     * @return
     */
    @Override
    public List<UserDto> model2Dto(List<User> users, List<UserDto> userDtos) {
        for (User user: users){
            userDtos.add(model2Dto(user, new UserDto()));
        }
        return userDtos;
    }


    /**
     * converting UserDto to User
     * @param userDto
     * @param user
     * @return
     */
    @Override
    public User dto2Model(UserDto userDto, User user) {
        user.setId(userDto.getId());
        user.setFirstName(userDto.getFirstName());
        user.setLastName(userDto.getLastName());
        user.setUsername(userDto.getUsername());
        user.setPassword(userDto.getPassword());

        if (userDto.getAccessGroupIDs() != null)
            user.setAccessGroupIDs(accessGroupMapper.dto2Model(userDto.getAccessGroupIDs(), new HashSet<AccessGroup>()));


        if (userDto.getRoleDtoIDs() != null)
            user.setRoleIDs(roleMapper.dto2Model(userDto.getRoleDtoIDs(), new HashSet<Role>()));

        if (userDto.getRawDataIDs() != null)
            user.setRawDataIDs(rawDataMapper.dto2Model(userDto.getRawDataIDs(), new HashSet<RawData>()));

        return user;
    }


    /**
     * converting a list of UserDto to a list of User
     * @param userDtos
     * @param users
     * @return
     */
    @Override
    public List<User> dto2Model(List<UserDto> userDtos, List<User> users) {
        for (UserDto userDto:userDtos){
            users.add(dto2Model(userDto, new User()));
        }
        return users;
    }
}
