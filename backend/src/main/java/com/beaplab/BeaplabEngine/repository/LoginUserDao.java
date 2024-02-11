/*
 * Developed by Arastoo Bozorgi.
 * a.bozorgi67@gmail.com
 */

package com.beaplab.BeaplabEngine.repository;

import com.beaplab.BeaplabEngine.model.LoginUser;
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
 * The LoginUserDao repository class which implements BaseRepository interface methods
 */
@Repository("loginUserDao")
public class LoginUserDao implements BaseRepository<LoginUser> {

    final static Logger logger = LogManager.getLogger(LoginUserDao.class.getName());


    /**
     * injecting SessionFactory into this class
     */
    @Autowired
    private SessionFactory sessionFactory;


    /**
     * constructors
     */
    public LoginUserDao() {
    }

    public LoginUserDao(SessionFactory sessionFactory) {
        this.sessionFactory = sessionFactory;
    }



    /**
     * retrieving a list of LoginUsers
     * @return List<LoginUser>
     */
    @Override
    @Transactional
    public List<LoginUser> list() {
        logger.info("in LoginUserDao: list");

        @SuppressWarnings("unchecked")
        List<LoginUser> list = (List<LoginUser>) sessionFactory.getCurrentSession()
                .createCriteria(LoginUser.class)
                .setResultTransformer(Criteria.DISTINCT_ROOT_ENTITY).list();
        return list;
    }


    /**
     * creating an LoginUser
     * @param loginUser
     */
    @Override
    @Transactional
    public Long save(LoginUser loginUser) {
        logger.info("in LoginUserDao: save");

        sessionFactory.getCurrentSession().save(loginUser);

        return loginUser.getId();
    }


    /**
     * updating an existing LoginUser
     * @param loginUser
     */
    @Override
    @Transactional
    public void update(LoginUser loginUser) {
        logger.info("in LoginUserDao: save");

        sessionFactory.getCurrentSession().update(loginUser);
    }


    /**
     * retrieving a specific LoginUser by its id
     * @param uuid
     * @return
     */
    @Override
    @Transactional
    public LoginUser get(Long uuid) {
        logger.info("in LoginUserDao: get");

        String hql = "from LoginUser where id =:uuid";
        Query query = sessionFactory.getCurrentSession().createQuery(hql);
        query.setParameter("uuid", uuid);


        @SuppressWarnings("unchecked")
        List<LoginUser> loginUserList = (List<LoginUser>) query.list();

        if (loginUserList != null && !loginUserList.isEmpty()) {
            return loginUserList.get(0);
        }

        return null;
    }


    /**
     * deleting a specific LoginUser by its id
     * @param id
     */
    @Override
    @Transactional
    public void delete(Long id) {
        logger.info("in LoginUserDao: delete");

        LoginUser loginUserToDelete = new LoginUser();
        loginUserToDelete.setId(id);
        sessionFactory.getCurrentSession().delete(loginUserToDelete);
    }
}
