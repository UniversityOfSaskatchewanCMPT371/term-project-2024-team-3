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

import java.math.BigInteger;
import java.util.ArrayList;
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

    @Autowired
    RawDataDao rawDataDao;
    @Autowired
    ProcessedDataDao processedDataDao;

    /**
     * constructors
     */
    public UserDao() {
    }

    public UserDao(SessionFactory sessionFactory) {
        this.sessionFactory = sessionFactory;
    }

    /**
     * retrieving a list of all Users in the system
     * 
     * @return List<User>: a list of user objects corresponding to all users found
     *         in the database
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
     * Saving a User object to the database effectively adding it to the system
     * 
     * @param user : the user object to be saved to the database
     * @return : the id of the saved user
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
     * @param user: the user object of the user being updated
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
                        + " password= crypt(:new_password, gen_salt ('md5')), username= :new_username WHERE id = :user_id")
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
     * retrieving a specific User object from the database using its id
     * 
     * @param uuid: the id of the user object to be retrieved
     * @return the retrieved user object ( if found) . If not, null is returned
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
     * deleting a specific User Object from the database by its id
     * 
     * @param id : the id of the user who is to be deleted
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
     * retrieving a user Object by its username and password properties
     * 
     * @param username : the username of the user to be found
     * @param password : the password of the user to be found
     * @return : the user ( if found), if not then null is returned
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
     * @param username : the username of the user to be found
     * @return : the user ( if found), if not then null is returned
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

    /***
     * a method to delete a relational entry in the tbl_user_tbl_role table in the
     * database
     * 
     * @param id where id is the id of the user whose linkage is to be removed
     * @return a boolean indicating whether the delete operation succeeded.
     */
    @Transactional
    public Boolean deleteRelationToRole(Long id) {
        logger.info("In UserDao: deleteRelationToRole");

        SQLQuery query = (SQLQuery) sessionFactory.getCurrentSession()
                .createSQLQuery("DELETE FROM tbl_user_tbl_role WHERE tbl_user_id = :user_id")
                .setParameter("user_id", id);

        int rowsAffected = query.executeUpdate();
        if (rowsAffected > 0) {
            logger.info("Deleted relation between user with id: " + id + " and its corresponding role");
            return true;
        } else {
            logger.warn("No linkage to role found for user with id: " + id + " to delete");
            return false;
        }
    }

    /***
     * a method to delete a relational entry in the tbl_user_tbl_access_group table
     * in the database
     * 
     * @param id where id is the id of the user whose linkage is to be removed
     * @return a boolean indicating whether the delete operation succeeded.
     */
    @Transactional
    public Boolean deleteRelationToAccessGroup(Long id) {
        logger.info("In UserDao: deleteRelationToAccessGroup");

        SQLQuery query = (SQLQuery) sessionFactory.getCurrentSession()
                .createSQLQuery("DELETE FROM tbl_user_tbl_access_group WHERE tbl_user_id = :user_id")
                .setParameter("user_id", id);

        int rowsAffected = query.executeUpdate();
        if (rowsAffected > 0) {
            logger.info("Deleted relation between user with id: " + id + " and its corresponding access group");
            return true;
        } else {
            logger.warn("No linkage to access group found for user with id: " + id + " to delete");
            return false;
        }
    }

    /***
     * a method to delete a relational entry in the tbl_login_user table in the
     * database
     * 
     * @param id where id is the id of the user whose linkage is to be removed
     * @return a boolean indicating whether the delete operation succeeded.
     */
    @Transactional
    public Boolean deleteUserLoginHistory(Long id) {
        logger.info("In UserDao: deleteUserLoginHistory");

        SQLQuery query = (SQLQuery) sessionFactory.getCurrentSession()
                .createSQLQuery("DELETE FROM tbl_login_user WHERE user_id = :passed_user_id")
                .setParameter("passed_user_id", id);

        int rowsAffected = query.executeUpdate();
        if (rowsAffected > 0) {
            logger.info("Deleted login history for user with id: " + id);
            return true;
        } else {
            logger.warn("No login history found for user with id: " + id + " to delete");
            return false;
        }
    }

    /***
     * a method to delete a relational entry in the tbl_incorrect_logins table in
     * the database
     * 
     * @param id where id is the id of the user whose linkage is to be removed
     * @return a boolean indicating whether the delete operation succeeded.
     */
    @Transactional
    public Boolean deleteUserIncorrectLoginHistory(Long id) {
        logger.info("In UserDao: deleteUserIncorrectLoginHistory");

        SQLQuery query = (SQLQuery) sessionFactory.getCurrentSession()
                .createSQLQuery("DELETE FROM tbl_incorrect_logins WHERE user_id = :passed_user_id")
                .setParameter("passed_user_id", id);

        int rowsAffected = query.executeUpdate();
        if (rowsAffected > 0) {
            logger.info("Deleted incorrect login history for user with id: " + id);
            return true;
        } else {
            logger.warn("No incorrect login history found for user with id: " + id + " to delete");
            return false;
        }
    }

    /***
     * a method to delete the users account including all information related to
     * them or uploaded by them.
     * 
     * @param id where id is the id of the user whose account is to be deleted
     * @return a boolean indicating whether the delete operation succeeded.
     */
    @Transactional
    public Boolean deleteUserAccount(Long id) {
        logger.info("In UserDao: deleteUserAccount");

        // delete the user's raw, processed, and predicted data.
        deleteUserData(id);

        // delete related role, accessGroup, and loginHistory information
        Boolean deleteRelationToRole = deleteRelationToRole(id);
        Boolean deleteRelationToAccessGroup = deleteRelationToAccessGroup(id);
        Boolean deleteUserLoginHistory = deleteUserLoginHistory(id);
        Boolean deleteUserIncorrectLoginHistory = deleteUserIncorrectLoginHistory(id);

        // delete user himself
        SQLQuery query = (SQLQuery) sessionFactory.getCurrentSession()
                .createSQLQuery("DELETE FROM tbl_user WHERE id = :user_id")
                .setParameter("user_id", id);

        int rowsAffected = query.executeUpdate();
        if (rowsAffected > 0) {
            logger.info("Deleted user with id: " + id);
            return true;
        } else {
            logger.warn("No user with id: " + id + " to delete");
            return false;
        }
    }

    /***
     * a method to delete the user's uploaded raw, processed, and predicted data
     * 
     * @param id where id is the id of the user whose data is to be deleted
     */
    @Transactional
    public void deleteUserData(Long id) {
        logger.info("In UserDao: deleteUserData");
        // find list of raw data ids
        // use it to find list of processed data ids
        // delete processed data using ids
        // delete raw data using ids.

        // first check if there is a linkage to any raw data
        SQLQuery searchQueryForRawData = (SQLQuery) sessionFactory.getCurrentSession()
                .createSQLQuery("SELECT rawdataids_id FROM tbl_user_tbl_raw_data WHERE tbl_user_id = :user_id")
                .setParameter("user_id", id);

        System.out.println(searchQueryForRawData);
        List<Object> listOfRawData = searchQueryForRawData.list();
        List<Long> longListOfRawData = new ArrayList<Long>();

        // if there is raw data linked, type cast into datatype Long.
        if (listOfRawData != null && !listOfRawData.isEmpty()) {
            logger.info("found raw Data linked to user of id: " + id);
            for (Object rawDataId : listOfRawData) {
                assert (rawDataId instanceof BigInteger);
                Long linkedRawDataId = ((BigInteger) rawDataId).longValue(); // typecast
                longListOfRawData.add(linkedRawDataId);
            }
            for (Long rawDataId : longListOfRawData) {
                SQLQuery searchQueryForProcessedData = (SQLQuery) sessionFactory.getCurrentSession()
                        .createSQLQuery("SELECT processed_data_id FROM tbl_raw_data WHERE id = :raw_data_id")
                        .setParameter("raw_data_id", rawDataId);

                System.out.println(searchQueryForProcessedData);

                List<Object> listOfProcessedData = searchQueryForProcessedData.list();

                // if there is processed data linked, type cast into datatype Long and delete by
                // id.
                if (listOfProcessedData != null && !listOfProcessedData.isEmpty()) {
                    logger.info("found processed Data linked to raw data of id: " + rawDataId);
                    for (Object processedDataId : listOfProcessedData) {
                        assert (processedDataId instanceof BigInteger);
                        Long linkedProcessedDataId = ((BigInteger) processedDataId).longValue(); // typecast
                        processedDataDao.delete(linkedProcessedDataId);
                    }
                } else {
                    // No data found
                    logger.info("No processed Data found linked to raw data of id: " + rawDataId);
                }
                rawDataDao.delete(rawDataId);
            }
        } else {
            // No data found
            logger.info("No raw Data found linked to user of id: " + id);
        }
    }
}
