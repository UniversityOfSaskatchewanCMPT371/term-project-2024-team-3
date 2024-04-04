/*
 * Developed by Arastoo Bozorgi.
 * a.bozorgi67@gmail.com
 */

package com.beaplab.BeaplabEngine.repository;

import com.beaplab.BeaplabEngine.model.AccessGroup;
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
 * The AccessGroupDao repository class which implements BaseRepository interface methods
 */
@Repository("accessGroupDao")
public class AccessGroupDao implements BaseRepository<AccessGroup> {

    final static Logger logger = LogManager.getLogger(AccessGroupDao.class.getName());


    /**
     * injecting SessionFactory into this class
     */
    @Autowired
    private SessionFactory sessionFactory;


    /**
     * constructors
     */
    public AccessGroupDao() {
    }

    public AccessGroupDao(SessionFactory sessionFactory) {
        this.sessionFactory = sessionFactory;
    }


    /**
     * retrieving a list of all AccessGroup objects found in system
     * @return a list of access group objects
     */
    @Override
    @Transactional
    public List<AccessGroup> list() {
        logger.info("in AccessGroupDao: list");

        @SuppressWarnings("unchecked")
        List<AccessGroup> list = (List<AccessGroup>) sessionFactory.getCurrentSession()
                .createCriteria(AccessGroup.class)
                .setResultTransformer(Criteria.DISTINCT_ROOT_ENTITY).list();
        return list;
    }


    /**
     * Saving an AccessGroup object to the database, effectively adding the access group to the system
     * @param accessGroup : the access group to be saved
     * @return the id of the saved access group object
     */
    @Override
    @Transactional
    public Long save(AccessGroup accessGroup) {
        logger.info("in AccessGroupDao: save");

        sessionFactory.getCurrentSession().save(accessGroup);

        return accessGroup.getId();
    }


    /**
     * Updating an existing AccessGroup object
     * @param accessGroup: the access group to be updated
     */
    @Override
    @Transactional
    public void update(AccessGroup accessGroup) {
        logger.info("in AccessGroupDao: save");

        sessionFactory.getCurrentSession().update(accessGroup);
    }


    /**
     * Retrieving a specific AccessGroup object from the database by its id
     * @param uuid : the id of the access group to be retrieved
     * @return : the access group (if found), or null if nothing is found
     */
    @Override
    @Transactional
    public AccessGroup get(Long uuid) {
        logger.info("in AccessGroupDao: get");

        String hql = "from AccessGroup where id =:uuid";
        Query query = sessionFactory.getCurrentSession().createQuery(hql);
        query.setParameter("uuid", uuid);


        @SuppressWarnings("unchecked")
        List<AccessGroup> listAccessLevel = (List<AccessGroup>) query.list();

        if (listAccessLevel != null && !listAccessLevel.isEmpty()) {
            return listAccessLevel.get(0);
        }

        return null;
    }


    /**
     * deleting a specific AccessGroup from the database by its id
     * @param id : the id of the access group to be deleted
     */
    @Override
    @Transactional
    public void delete(Long id) {
        logger.info("in AccessGroupDao: delete");

        AccessGroup accessGroupToDelete = new AccessGroup();
        accessGroupToDelete.setId(id);
        sessionFactory.getCurrentSession().delete(accessGroupToDelete);
    }
}
