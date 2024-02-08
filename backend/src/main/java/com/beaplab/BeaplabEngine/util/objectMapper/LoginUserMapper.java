/*
 * Developed by Arastoo Bozorgi.
 * a.bozorgi67@gmail.com
 */

package com.beaplab.BeaplabEngine.util.objectMapper;

import com.beaplab.BeaplabEngine.metadata.LoginUserDto;
import com.beaplab.BeaplabEngine.metadata.UserDto;
import com.beaplab.BeaplabEngine.model.LoginUser;
import com.beaplab.BeaplabEngine.model.User;
import com.beaplab.BeaplabEngine.util.objectMapper.base.BaseMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * this class converts LoginUser to LoginUserDto and vice versa
 */
@Component("loginUserMapper")
public class LoginUserMapper implements BaseMapper<LoginUser, LoginUserDto> {


    /**
     * injecting UserMapper into this class
     */
    @Autowired
    UserMapper userMapper;


    /**
     * converting LoginUser to LoginUserDto
     * @param loginUser
     * @param loginUserDto
     * @return
     */
    @Override
    public LoginUserDto model2Dto(LoginUser loginUser, LoginUserDto loginUserDto) {
        loginUserDto.setId(loginUser.getId());
        loginUserDto.setPasswordToken(loginUser.getPasswordToken());
        loginUserDto.setDate(loginUser.getDate());

        if (loginUser.isUserLoaded())
            loginUserDto.setUserDto(userMapper.model2Dto(loginUser.getUser(), new UserDto()));

        return loginUserDto;
    }


    /**
     * converting a list of LoginUser to a list of LoginUserDto
     * @param loginUsers
     * @param loginUserDtos
     * @return
     */
    @Override
    public List<LoginUserDto> model2Dto(List<LoginUser> loginUsers, List<LoginUserDto> loginUserDtos) {
        for (LoginUser loginUser: loginUsers){
            loginUserDtos.add(model2Dto(loginUser, new LoginUserDto()));
        }
        return loginUserDtos;
    }


    /**
     * converting LoginUserDto to LoginUser
     * @param loginUserDto
     * @param loginUser
     * @return
     */
    @Override
    public LoginUser dto2Model(LoginUserDto loginUserDto, LoginUser loginUser) {
        loginUser.setId(loginUserDto.getId());
        loginUser.setPasswordToken(loginUserDto.getPasswordToken());
        loginUser.setDate(loginUserDto.getDate());

        if (loginUserDto.getUserDto()!= null)
            loginUser.setUser(userMapper.dto2Model(loginUserDto.getUserDto(), new User()));

        return loginUser;
    }


    /**
     * converting a list of LoginUserDto to a list of LoginUser
     * @param loginUserDtos
     * @param loginUsers
     * @return
     */
    @Override
    public List<LoginUser> dto2Model(List<LoginUserDto> loginUserDtos, List<LoginUser> loginUsers) {
        for (LoginUserDto loginUserDto: loginUserDtos){
            loginUsers.add(dto2Model(loginUserDto, new LoginUser()));
        }
        return loginUsers;
    }
}
