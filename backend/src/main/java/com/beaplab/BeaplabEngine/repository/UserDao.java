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
import org.springframework.jdbc.object.SqlQuery;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * The UserDao repository class which implements BaseRepository interface
 * methods
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
     * 
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
     * 
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
     * 
     * @param user
     */
    @Override
    @Transactional
    public void update(User user) {
        logger.info("in UserDao: save");

        sessionFactory.getCurrentSession().update(user);
    }

    /**
     * New user update method written by 371 students
     * 
     * @param user
     * @return (boolean) user found and succefully updated
     */
    @Transactional
    public Boolean newUpdate(User user) {
        logger.info("in UserDao: newUpdate");

        // find user with id to update

        Boolean userUpdated = false;

        long id = user.getId();
        String firstName = user.getFirstName();
        String lastName = user.getLastName();
        String username = user.getUsername();
        String password = user.getPassword();

        SQLQuery searchQuery = (SQLQuery) sessionFactory.getCurrentSession()
                .createSQLQuery("SELECT * FROM tbl_user WHERE id = :user_id")
                .setParameter("user_id", id);

        List<Object> searchResultList = searchQuery.list();

        // if user exists
        if (searchResultList != null && !searchResultList.isEmpty()) {
            logger.info("in newUpdate: found user to update with id " + id);
        } else {
            logger.info("in newUpdate: User with id:  " + id + " not found and couldnt be updated");
            return userUpdated;
        }

        // update user

        SQLQuery updateQuery = (SQLQuery) sessionFactory.getCurrentSession().createSQLQuery(
                "UPDATE tbl_user SET first_name= :new_first_name, last_name= :new_last_name,"
                        + " password= :new_password, username= :new_username WHERE id = :user_id")
                .setParameter("new_first_name", firstName)
                .setParameter("new_last_name", lastName)
                .setParameter("new_password", password)
                .setParameter("new_username", username)
                .setParameter("user_id", id);

        int rowsAffected = updateQuery.executeUpdate();

        if (rowsAffected > 0) {
            logger.info("User with id: " + id + " was found and updated");
            userUpdated = true;
        } else {
            logger.warn("User with id: " + id + " was found but could not be updated");
            userUpdated = false;
            return userUpdated;
        }

        return userUpdated;
    }

    /**
     * retrieving a specific User by its id
     * 
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
     * 
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
     * 
     * @param username
     * @param password
     * @return
     */
    @Transactional
    public User findByUserPass(String username, String password) {
        logger.info("in UserDao: findByUserPass");

        SQLQuery query = (SQLQuery) sessionFactory.getCurrentSession()
                .createSQLQuery("SELECT * FROM login_user(:username, :password)")
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
     * 
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
