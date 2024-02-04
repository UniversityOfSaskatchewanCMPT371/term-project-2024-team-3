/*
 * Developed by Arastoo Bozorgi.
 * a.bozorgi67@gmail.com
 */

package com.beaplab.BeaplabEngine.repository;

import com.beaplab.BeaplabEngine.model.User;
import com.beaplab.BeaplabEngine.repository.base.BaseRepository;
import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;
import org.hibernate.Criteria;
import org.hibernate.Query;
import org.hibernate.SQLQuery;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * The UserDao repository class which implements BaseRepository interface methods
 */
@Repository("userDao")
@EnableTransactionManagement(proxyTargetClass = true)
public class UserDao implements BaseRepository<User> {


    final static Logger logger = LogManager.getLogger(UserDao.class.getName());


    /**
     * injecting SessionFactory into this class
     */
    @Autowired
    private SessionFactory sessionFactory;


    /**
     * constructors
     */
    public UserDao() {
    }

    public UserDao(SessionFactory sessionFactory) {
        this.sessionFactory = sessionFactory;
    }


    /**
     * retrieving a list of Users
     * @return List<User>
     */
    @Override
    @Transactional
    public List<User> list() {
        logger.info("in UserDao: list");

        @SuppressWarnings("unchecked")
        List<User> list = (List<User>) sessionFactory.getCurrentSession()
                .createCriteria(User.class)
                .setResultTransformer(Criteria.DISTINCT_ROOT_ENTITY).list();
        return list;
    }


    /**
     * creating an User
     * @param user
     */
    @Override
    @Transactional
    public Long save(User user) {
        logger.info("in UserDao: save");

         sessionFactory.getCurrentSession().save(user);

        return user.getId();
    }


    /**
     * updating an existing User
     * @param user
     */
    @Override
    @Transactional
    public void update(User user) {
        logger.info("in UserDao: save");

        sessionFactory.getCurrentSession().update(user);
    }


    /**
     * retrieving a specific User by its id
     * @param uuid
     * @return
     */
    @Override
    @Transactional
    public User get(Long uuid) {
        logger.info("in UserDao: get");

        String hql = "from User where id =:uuid";
        Query query = sessionFactory.getCurrentSession().createQuery(hql);
        query.setParameter("uuid", uuid);


        @SuppressWarnings("unchecked")
        List<User> listUser = (List<User>) query.list();

        if (listUser != null && !listUser.isEmpty()) {
            return listUser.get(0);
        }

        return null;
    }


    /**
     * deleting a specific User by its id
     * @param id
     */
    @Override
    @Transactional
    public void delete(Long id) {
        logger.info("in UserDao: delete");

        User userToDelete = new User();
        userToDelete.setId(id);
        sessionFactory.getCurrentSession().delete(userToDelete);
    }



    /**
     * retrieving a user by its username and password
     * @param username
     * @param password
     * @return
     */
    @Transactional
    public User findByUserPass(String username, String password){
        logger.info("in UserDao: findByUserPass");

        SQLQuery query = (SQLQuery) sessionFactory.getCurrentSession().createSQLQuery("SELECT * FROM login_user(:username, :password)")
                .addEntity(User.class)
                .setParameter("username", username)
                .setParameter("password", password);

        @SuppressWarnings("unchecked")
        List<User> listUser = (List<User>) query.list();

        if (listUser != null && !listUser.isEmpty()) {
            return listUser.get(0);
        }

        return null;
    }


    /**
     * retrieving a specific User by its username
     * @param username
     * @return
     */
    @Transactional
    public User findByUsername(String username) {
        logger.info("in UserDao: findByUsername");

        String hql = "from User where username =:username";
        Query query = sessionFactory.getCurrentSession().createQuery(hql);
        query.setParameter("username", username);


        @SuppressWarnings("unchecked")
        List<User> listUser = (List<User>) query.list();

        if (listUser != null && !listUser.isEmpty()) {
            return listUser.get(0);
        }

        return null;
    }

}
