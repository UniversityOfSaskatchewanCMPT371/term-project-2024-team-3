/*
 * Developed by Arastoo Bozorgi.
 * a.bozorgi67@gmail.com
 */

package com.beaplab.BeaplabEngine.service;

import com.beaplab.BeaplabEngine.metadata.RoleDto;
import com.beaplab.BeaplabEngine.model.Role;
import com.beaplab.BeaplabEngine.repository.base.BaseRepository;
import com.beaplab.BeaplabEngine.service.base.BaseService;
import com.beaplab.BeaplabEngine.util.objectMapper.RoleMapper;
import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * The RoleService service class which implements BaseService interface methods
 */

@Service("roleService")
public class RoleService implements BaseService<RoleDto> {


    final static Logger logger = LogManager.getLogger(RoleService.class.getName());

    /**
     * injecting RoleDao into this class
     */
    @Autowired
    private BaseRepository<Role> roleDao;

    /**
     * injecting RoleMapper into this class
     */
    @Autowired
    private RoleMapper roleMapper;


    /**
     * retrieving a list of type Role
     * @return List<RoleDto>
     */
    @Override
    public List<RoleDto> list() {
        logger.info("in RoleService: list");

        List<RoleDto> roleDtos = roleMapper.model2Dto(roleDao.list(), new ArrayList<RoleDto>());
        return roleDtos;
    }


    /**
     * creating a new Role
     * @param roleDto
     */
    @Override
    public Serializable save(RoleDto roleDto) {
        logger.info("in RoleService: save");

        Role role = roleMapper.dto2Model(roleDto, new Role());
        return roleDao.save(role);
    }


    /**
     * updating an existing Role
     * @param roleDto
     */
    @Override
    public void update(RoleDto roleDto) {
        logger.info("in RoleService: Update");

        Role role = roleMapper.dto2Model(roleDto, new Role());
        roleDao.update(role);
    }


    /**
     * retrieving a specific Role by its id
     * @param id
     * @return RoleDto
     */
    @Override
    public RoleDto get(String id) {
        logger.info("in RoleService: get");

        Long uuid = Long.parseLong(id);
        Role role = roleDao.get(uuid);
        if(role != null)
            return roleMapper.model2Dto(role, new RoleDto());
        return null;
    }


    /**
     * deleting a specific Role by its id
     * @param id
     */
    @Override
    public void delete(String id) {
        logger.info("in RoleService: delete");

        Long uuid = Long.parseLong(id);
        roleDao.delete(uuid);
    }
}
