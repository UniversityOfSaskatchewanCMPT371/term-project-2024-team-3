/*
 * Developed by Arastoo Bozorgi.
 * a.bozorgi67@gmail.com
 */

package com.beaplab.BeaplabEngine.service;

import com.beaplab.BeaplabEngine.metadata.LoginUserDto;
import com.beaplab.BeaplabEngine.model.LoginUser;
import com.beaplab.BeaplabEngine.repository.base.BaseRepository;
import com.beaplab.BeaplabEngine.service.base.BaseService;
import com.beaplab.BeaplabEngine.util.objectMapper.LoginUserMapper;
import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * The LoginUserService service class which implements BaseService interface methods
 */
@Service("loginUserService")
public class LoginUserService implements BaseService<LoginUserDto> {



    final static Logger logger = LogManager.getLogger(LoginUserService.class.getName());

    /**
     * injecting LoginUserDao into this class
     */
    @Autowired
    private BaseRepository<LoginUser> loginUserDao;

    /**
     * injecting LoginUserMapper into this class
     */
    @Autowired
    private LoginUserMapper loginUserMapper;


    /**
     * retrieving a list of type LoginUser
     * @return List<LoginUserDto>
     */
    @Override
    public List<LoginUserDto> list() {
        logger.info("in LoginUserService: list");

        List<LoginUserDto> loginUserDtos = loginUserMapper.model2Dto(loginUserDao.list(), new ArrayList<LoginUserDto>());
        return loginUserDtos;
    }


    /**
     * creating a new LoginUser
     * @param loginUserDto
     */
    @Override
    public Serializable save(LoginUserDto loginUserDto) {
        logger.info("in LoginUserService: save");

        LoginUser loginUser = loginUserMapper.dto2Model(loginUserDto, new LoginUser());
        return loginUserDao.save(loginUser);
    }


    /**
     * updating an existing LoginUser
     * @param loginUserDto
     */
    @Override
    public void update(LoginUserDto loginUserDto) {
        logger.info("in LoginUserService: Update");

        LoginUser loginUser = loginUserMapper.dto2Model(loginUserDto, new LoginUser());
        loginUserDao.update(loginUser);
    }


    /**
     * retrieving a specific LoginUser by its id
     * @param id
     * @return LoginUserDto
     */
    @Override
    public LoginUserDto get(String id) {
        logger.info("in LoginUserService: get");

        Long uuid = Long.parseLong(id);
        LoginUser loginUser = loginUserDao.get(uuid);
        if(loginUser != null)
            return loginUserMapper.model2Dto(loginUser, new LoginUserDto());
        return null;
    }


    /**
     * deleting a specific LoginUser by its id
     * @param id
     */
    @Override
    public void delete(String id) {
        logger.info("in LoginUserService: delete");

        Long uuid = Long.parseLong(id);
        loginUserDao.delete(uuid);
    }
}
