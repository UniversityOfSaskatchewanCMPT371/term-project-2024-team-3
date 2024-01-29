package com.beaplab.BeaplabEngine.repository;

import com.beaplab.BeaplabEngine.model.IncorrectLogins;
import com.beaplab.BeaplabEngine.model.LoginUser;
import com.beaplab.BeaplabEngine.model.RawData;
import com.beaplab.BeaplabEngine.repository.base.BaseRepository;
import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;
import org.hibernate.Criteria;
import org.hibernate.Query;
import org.hibernate.SQLQuery;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.PropertySource;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository("incorrectLoginsDao")
@ComponentScan("com.beaplab.BeaplabEngine")
@PropertySource("classpath:postgresql.properties")
@EnableTransactionManagement(proxyTargetClass = true)
public class IncorrectLoingsDao {

    final static Logger logger = LogManager.getLogger(LoginUserDao.class.getName());


    /**
     * injecting SessionFactory into this class
     */
    @Autowired
    private SessionFactory sessionFactory;

    /**
     * constructors
     */
    public IncorrectLoingsDao() {
    }

    public IncorrectLoingsDao(SessionFactory sessionFactory) {
        this.sessionFactory = sessionFactory;
    }



    /**
     * retrieving a list of IncorrectLogins
     * @return List<IncorrectLogins>
     */
    @Transactional
    public List<IncorrectLogins> list() {
        logger.info("in IncorrectLoginsDao: list");

        @SuppressWarnings("unchecked")
        List<IncorrectLogins> list = (List<IncorrectLogins>) sessionFactory.getCurrentSession()
                .createCriteria(LoginUser.class)
                .setResultTransformer(Criteria.DISTINCT_ROOT_ENTITY).list();
        return list;
    }


    /**
     * creating an IncorrectLogins
     * @param incorrectLogins
     */
    @Transactional
    public Long save(IncorrectLogins incorrectLogins) {
        logger.info("in IncorrectLoginsDao: save");

        sessionFactory.getCurrentSession().save(incorrectLogins);

        return incorrectLogins.getId();
    }


    /**
     * updating an existing IncorrectLogins
     * @param incorrectLogins
     */
    @Transactional
    public void update(IncorrectLogins incorrectLogins) {
        logger.info("in IncorrectLoginsDao: save");

        sessionFactory.getCurrentSession().update(incorrectLogins);
    }


    /**
     * retrieving a specific LoginUser by its id
     * @param uuid
     * @return
     */
    @Transactional
    public IncorrectLogins get(Long uuid) {
        logger.info("in IncorrectLoginsDao: get");

        String hql = "from IncorrectLogins where id =:uuid";
        Query query = sessionFactory.getCurrentSession().createQuery(hql);
        query.setParameter("uuid", uuid);


        @SuppressWarnings("unchecked")
        List<IncorrectLogins> incorrectLoginsList = (List<IncorrectLogins>) query.list();

        if (incorrectLoginsList != null && !incorrectLoginsList.isEmpty()) {
            return incorrectLoginsList.get(0);
        }

        return null;
    }


    /**
     * deleting a specific IncorrectLogins by its id
     * @param id
     */
    @Transactional
    public void delete(Long id) {
        logger.info("in IncorrectLoginsDao: delete");

        IncorrectLogins incorrectLoginsToDelete = new IncorrectLogins();
        incorrectLoginsToDelete.setId(id);
        sessionFactory.getCurrentSession().delete(incorrectLoginsToDelete);
    }


    @Transactional
    public IncorrectLogins getByUserID(Long userId) {
        logger.info("in IncorrectLoginsDao: getByUserID");

        SQLQuery query = (SQLQuery) sessionFactory.getCurrentSession().createSQLQuery("select * from get_incorrect_logins_by_user_id(:user_id)")
                .addEntity(IncorrectLogins.class)
                .setParameter("user_id", userId);


        @SuppressWarnings("unchecked")
        List<IncorrectLogins> incorrectLoginsList = (List<IncorrectLogins>) query.list();

        if (incorrectLoginsList != null && !incorrectLoginsList.isEmpty()) {
            return incorrectLoginsList.get(0);
        }

        return null;
    }
}
