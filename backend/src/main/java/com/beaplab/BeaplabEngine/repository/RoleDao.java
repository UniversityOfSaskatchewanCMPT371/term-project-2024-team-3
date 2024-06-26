/*
 * Developed by Arastoo Bozorgi.
 * a.bozorgi67@gmail.com
 */

package com.beaplab.BeaplabEngine.repository;

import com.beaplab.BeaplabEngine.model.Role;
import com.beaplab.BeaplabEngine.repository.base.BaseRepository;
import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;
import org.hibernate.Criteria;
import org.hibernate.Query;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.io.Serializable;
import java.math.BigInteger;
import java.util.List;
import java.util.UUID;

/**
 * The RoleDao repository class which implements BaseRepository interface methods
 */
@Repository("roleDao")
public class RoleDao implements BaseRepository<Role> {


    final static Logger logger = LogManager.getLogger(RoleDao.class.getName());


    /**
     * injecting SessionFactory into this class
     */
    @Autowired
    private SessionFactory sessionFactory;


    /**
     * constructors
     */
    public RoleDao() {
    }

    public RoleDao(SessionFactory sessionFactory) {
        this.sessionFactory = sessionFactory;
    }


    /**
     * retrieving a list of all available Roles
     * @return a list of objects of type Role corresponding to the available roles in the system
     */
    @Override
    @Transactional
    public List<Role> list() {
        logger.info("in RoleDao: list");

        @SuppressWarnings("unchecked")
        List<Role> list = (List<Role>) sessionFactory.getCurrentSession()
                .createCriteria(Role.class)
                .setResultTransformer(Criteria.DISTINCT_ROOT_ENTITY).list();
        return list;
    }


    /**
     * Saving a Role object to the Database effectively adding it to the system
     * @param role : the object representing the role to be saved into the database
     * @return : the id of the new role entry that was added to the database
     */
    @Override
    @Transactional
    public Long save(Role role) {
        logger.info("in RoleDao: save");

        sessionFactory.getCurrentSession().save(role);

        return role.getId();
    }


    /**
     * updating an existing Role
     * @param role : the role object corresponding to the role to be updated
     */
    @Override
    @Transactional
    public void update(Role role) {
        logger.info("in RoleDao: save");

        sessionFactory.getCurrentSession().update(role);
    }


    /**
     * retrieving a specific Role by its id
     * @param uuid : the id of the role object to be retrieved
     * @return: the retrieved role object (if found), or null if nothing is found
     */
    @Override
    @Transactional
    public Role get(Long uuid) {
        logger.info("in RoleDao: get");

        String hql = "from Role where id =:uuid";
        Query query = sessionFactory.getCurrentSession().createQuery(hql);
        query.setParameter("uuid", uuid);


        @SuppressWarnings("unchecked")
        List<Role> listAccessLevel = (List<Role>) query.list();

        if (listAccessLevel != null && !listAccessLevel.isEmpty()) {
            return listAccessLevel.get(0);
        }

        return null;
    }


    /**
     * deleting a specific Role from the database by its id
     * @param id: the id of the role entry to be deleted
     */
    @Override
    @Transactional
    public void delete(Long id) {
        logger.info("in RoleDao: delete");

        Role roleToDelete = new Role();
        roleToDelete.setId(id);
        sessionFactory.getCurrentSession().delete(roleToDelete);
    }
}
