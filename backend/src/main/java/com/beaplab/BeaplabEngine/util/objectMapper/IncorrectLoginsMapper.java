package com.beaplab.BeaplabEngine.util.objectMapper;

import com.beaplab.BeaplabEngine.metadata.IncorrectLoginsDto;
import com.beaplab.BeaplabEngine.metadata.LoginUserDto;
import com.beaplab.BeaplabEngine.metadata.UserDto;
import com.beaplab.BeaplabEngine.model.IncorrectLogins;
import com.beaplab.BeaplabEngine.model.LoginUser;
import com.beaplab.BeaplabEngine.model.User;
import com.beaplab.BeaplabEngine.util.objectMapper.base.BaseMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

@Component("incorrectLoginsMapper")
public class IncorrectLoginsMapper  implements BaseMapper<IncorrectLogins, IncorrectLoginsDto> {

    /**
     * injecting UserMapper into this class
     */
    @Autowired
    UserMapper userMapper;

    /**
     * converting LoginUser to LoginUserDto
     * @param incorrectLogins
     * @param incorrectLoginsDto
     * @return
     */
    @Override
    public IncorrectLoginsDto model2Dto(IncorrectLogins incorrectLogins, IncorrectLoginsDto incorrectLoginsDto) {
        incorrectLoginsDto.setId(incorrectLogins.getId());
        incorrectLoginsDto.setIncorrectAttempts(incorrectLogins.getIncorrectAttempts());
        incorrectLoginsDto.setLocked(incorrectLogins.getLocked());
        incorrectLoginsDto.setLockedDate(incorrectLogins.getLockedDate());

        if (incorrectLogins.isUserLoaded())
            incorrectLoginsDto.setUserDto(userMapper.model2Dto(incorrectLogins.getUser(), new UserDto()));

        return incorrectLoginsDto;
    }


    /**
     * converting a list of LoginUser to a list of LoginUserDto
     * @param incorrectLoginsList
     * @param incorrectLoginsDtos
     * @return
     */
    @Override
    public List<IncorrectLoginsDto> model2Dto(List<IncorrectLogins> incorrectLoginsList, List<IncorrectLoginsDto> incorrectLoginsDtos) {
        for (IncorrectLogins incorrectLogins: incorrectLoginsList){
            incorrectLoginsDtos.add(model2Dto(incorrectLogins, new IncorrectLoginsDto()));
        }
        return incorrectLoginsDtos;
    }


    /**
     * converting LoginUserDto to LoginUser
     * @param incorrectLoginsDto
     * @param incorrectLogins
     * @return
     */
    @Override
    public IncorrectLogins dto2Model(IncorrectLoginsDto incorrectLoginsDto, IncorrectLogins incorrectLogins) {
        incorrectLogins.setId(incorrectLoginsDto.getId());
        incorrectLogins.setIncorrectAttempts(incorrectLoginsDto.getIncorrectAttempts());
        incorrectLogins.setLocked(incorrectLoginsDto.getLocked());
        incorrectLogins.setLockedDate(incorrectLoginsDto.getLockedDate());

        if (incorrectLoginsDto.getUserDto()!= null)
            incorrectLogins.setUser(userMapper.dto2Model(incorrectLoginsDto.getUserDto(), new User()));

        return incorrectLogins;
    }


    /**
     * converting a list of LoginUserDto to a list of LoginUser
     * @param incorrectLoginsDtos
     * @param incorrectLoginsList
     * @return
     */
    @Override
    public List<IncorrectLogins> dto2Model(List<IncorrectLoginsDto> incorrectLoginsDtos, List<IncorrectLogins> incorrectLoginsList) {
        for (IncorrectLoginsDto incorrectLoginsDto: incorrectLoginsDtos){
            incorrectLoginsList.add(dto2Model(incorrectLoginsDto, new IncorrectLogins()));
        }
        return incorrectLoginsList;
    }
}
