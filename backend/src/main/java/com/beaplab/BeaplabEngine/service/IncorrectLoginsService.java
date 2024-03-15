package com.beaplab.BeaplabEngine.service;

import com.beaplab.BeaplabEngine.metadata.IncorrectLoginsDto;
import com.beaplab.BeaplabEngine.metadata.LoginUserDto;
import com.beaplab.BeaplabEngine.model.IncorrectLogins;
import com.beaplab.BeaplabEngine.model.LoginUser;
import com.beaplab.BeaplabEngine.repository.IncorrectLoingsDao;
import com.beaplab.BeaplabEngine.repository.base.BaseRepository;
import com.beaplab.BeaplabEngine.service.base.BaseService;
import com.beaplab.BeaplabEngine.util.objectMapper.IncorrectLoginsMapper;
import com.beaplab.BeaplabEngine.util.objectMapper.LoginUserMapper;
import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

@Service("incorrectLoginsService")
public class IncorrectLoginsService implements BaseService<IncorrectLoginsDto> {

    final static Logger logger = LogManager.getLogger(LoginUserService.class.getName());

    /**
     * injecting LoginUserDao into this class
     */
    @Autowired
    private IncorrectLoingsDao incorrectLoginsDao;

    /**
     * injecting LoginUserMapper into this class
     */
    @Autowired
    private IncorrectLoginsMapper incorrectLoginsMapper;



    /**
     * retrieving a list of type LoginUser
     * @return List<IncorrectLoginsDto>
     */
    @Override
    public List<IncorrectLoginsDto> list() {
        logger.info("in IncorrectLoginsService: list");

        return incorrectLoginsMapper.model2Dto(incorrectLoginsDao.list(), new ArrayList<IncorrectLoginsDto>());
    }


    /**
     * creating a new IncorrectLogins
     * @param incorrectLoginsDto
     */
    @Override
    public Serializable save(IncorrectLoginsDto incorrectLoginsDto) {
        logger.info("in IncorrectLoginsService: save");

        IncorrectLogins incorrectLogins = incorrectLoginsMapper.dto2Model(incorrectLoginsDto, new IncorrectLogins());
        return incorrectLoginsDao.save(incorrectLogins);
    }


    /**
     * updating an existing IncorrectLogins
     * @param incorrectLoginsDto
     */
    @Override
    public void update(IncorrectLoginsDto incorrectLoginsDto) {
        logger.info("in IncorrectLoginsService: Update");

        IncorrectLogins incorrectLogins = incorrectLoginsMapper.dto2Model(incorrectLoginsDto, new IncorrectLogins());
        incorrectLoginsDao.update(incorrectLogins);
    }


    /**
     * retrieving a specific IncorrectLogins by its id
     * @param id
     * @return IncorrectLoginsDto
     */
    @Override
    public IncorrectLoginsDto get(String id) {
        logger.info("in IncorrectLoginsService: get");

        Long uuid = Long.parseLong(id);
        IncorrectLogins incorrectLogins = incorrectLoginsDao.get(uuid);
        if(incorrectLogins != null)
            return incorrectLoginsMapper.model2Dto(incorrectLogins, new IncorrectLoginsDto());
        return null;
    }


    /**
     * deleting a specific IncorrectLogins by its id
     * @param id
     */
    @Override
    public void delete(String id) {
        logger.info("in IncorrectLoginsService: delete");

        Long uuid = Long.parseLong(id);
        incorrectLoginsDao.delete(uuid);
    }


    /**
     * retrieving a specific IncorrectLogins by user id
     * @param userId
     * @return IncorrectLoginsDto
     */
    public IncorrectLoginsDto getByUserId(Long userId) {
        logger.info("in IncorrectLoginsService: getByUSerId");

        IncorrectLogins incorrectLogins = incorrectLoginsDao.getByUserID(userId);
        if(incorrectLogins != null)
            return incorrectLoginsMapper.model2Dto(incorrectLogins, new IncorrectLoginsDto());
        return null;
    }
}
