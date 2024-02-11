/*
 * Developed by Arastoo Bozorgi.
 * a.bozorgi67@gmail.com
 */

package com.beaplab.BeaplabEngine.service;

import com.beaplab.BeaplabEngine.metadata.AccessGroupDto;
import com.beaplab.BeaplabEngine.model.AccessGroup;
import com.beaplab.BeaplabEngine.repository.base.BaseRepository;
import com.beaplab.BeaplabEngine.service.base.BaseService;
import com.beaplab.BeaplabEngine.util.objectMapper.AccessGroupMapper;
import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * The AccessGroupService service class which implements BaseService interface methods
 */
@Service("accessGroupService")
public class AccessGroupService implements BaseService<AccessGroupDto> {

    final static Logger logger = LogManager.getLogger(AccessGroupService.class.getName());

    /**
     * injecting AccessGroupDao into this class
     */
    @Autowired
    private BaseRepository<AccessGroup> accessGroupDao;

    /**
     * injecting AccessGroupMapper into this class
     */
    @Autowired
    private AccessGroupMapper accessGroupMapper;


    /**
     * retrieving a list of type AccessGroup
     * @return List<AccessGroupDto>
     */
    @Override
    public List<AccessGroupDto> list() {
        logger.info("in AccessGroupService: list");

        List<AccessGroupDto> accessGroupDtos = accessGroupMapper.model2Dto(accessGroupDao.list(), new ArrayList<AccessGroupDto>());
        return accessGroupDtos;
    }


    /**
     * creating a new AccessGroup
     * @param accessGroupDto
     */
    @Override
    public Serializable save(AccessGroupDto accessGroupDto) {
        logger.info("in AccessGroupService: save");

        AccessGroup accessGroup = accessGroupMapper.dto2Model(accessGroupDto, new AccessGroup());
        return accessGroupDao.save(accessGroup);
    }


    /**
     * updating an existing AccessGroup
     * @param accessGroupDto
     */
    @Override
    public void update(AccessGroupDto accessGroupDto) {
        logger.info("in AccessGroupService: Update");

        AccessGroup accessGroup = accessGroupMapper.dto2Model(accessGroupDto, new AccessGroup());
        accessGroupDao.update(accessGroup);
    }


    /**
     * retrieving a specific AccessGroup by its id
     * @param id
     * @return AccessGroupDto
     */
    @Override
    public AccessGroupDto get(String id) {
        logger.info("in AccessGroupService: get");

        Long uuid = Long.parseLong(id);
        AccessGroup accessGroup = accessGroupDao.get(uuid);
        if(accessGroup != null)
            return accessGroupMapper.model2Dto(accessGroup, new AccessGroupDto());
        return null;
    }


    /**
     * deleting a specific AccessGroup by its id
     * @param id
     */
    @Override
    public void delete(String id) {
        logger.info("in AccessGroupService: delete");

        Long uuid = Long.parseLong(id);
        accessGroupDao.delete(uuid);
    }
}
