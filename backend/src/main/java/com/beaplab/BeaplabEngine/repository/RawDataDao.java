/*
 * Developed by Arastoo Bozorgi.
 * a.bozorgi67@gmail.com
 */

package com.beaplab.BeaplabEngine.repository;

import com.beaplab.BeaplabEngine.model.RawData;
import com.beaplab.BeaplabEngine.model.RawDataIndex;
import com.beaplab.BeaplabEngine.model.User;
import com.beaplab.BeaplabEngine.repository.base.BaseRepository;
import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;
import org.hibernate.Criteria;
import org.hibernate.Query;
import org.hibernate.SQLQuery;
import org.hibernate.SessionFactory;
import org.hibernate.transform.AliasToBeanConstructorResultTransformer;
import org.hibernate.transform.AliasToBeanResultTransformer;
import org.hibernate.transform.ResultTransformer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigInteger;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * The RawDataDao repository class which implements BaseRepository interface methods
 */
@Repository("rawDataDao")
@ComponentScan("com.beaplab.BeaplabEngine")
@PropertySource("classpath:postgresql.properties")
@EnableTransactionManagement(proxyTargetClass = true)
public class RawDataDao {

    final static Logger logger = LogManager.getLogger(RawDataDao.class.getName());


    /**
     * injecting SessionFactory into this class
     */
    @Autowired
    private SessionFactory sessionFactory;

    @Autowired
    Environment environment;


    /**
     * constructors
     */
    public RawDataDao() {
    }

    public RawDataDao(SessionFactory sessionFactory) {
        this.sessionFactory = sessionFactory;
    }


    @Transactional
    public Long save(RawData rawData, Long userId) {
        logger.info("in RawDataDao: save");

        SQLQuery query = (SQLQuery) sessionFactory.getCurrentSession().createSQLQuery("select * from save_tbl_raw_data(:data, :type, :processed_data_id, :user_id, :datetime, :sym_key)")
                .setParameter("data", rawData.getData())
                .setParameter("type", rawData.getStringType())
                .setParameter("processed_data_id", rawData.getProcessedDataID())
                .setParameter("user_id", userId)
                .setParameter("datetime", rawData.getDateTime())
                .setParameter("sym_key", environment.getProperty("pg_crypto.key"));

        List result = query.list();
        if (result == null || result.isEmpty())
            return Long.valueOf(-1);

        BigInteger retId = (BigInteger) result.get(0);
        return retId.longValue();
    }


    @Transactional
    public RawData get(Long id) {
        logger.info("in RawDataDao: get");

        SQLQuery query = (SQLQuery) sessionFactory.getCurrentSession().createSQLQuery("select * from get_by_id_tbl_raw_data(:raw_data_id, :sym_key)")
                .addEntity(RawData.class)
                .setParameter("raw_data_id", id)
                .setParameter("sym_key", environment.getProperty("pg_crypto.key"));


        @SuppressWarnings("unchecked")
        List<RawData> listRawData = (List<RawData>) query.list();

        if (listRawData != null && !listRawData.isEmpty()) {
            return listRawData.get(0);
        }

        return null;
    }

    @Transactional
    public Long getProcessDataId(long id) {
        logger.info("in RawDataDao: getProcessDataId");

        SQLQuery query = (SQLQuery) sessionFactory.getCurrentSession().createSQLQuery("select * from get_process_data_id(:raw_data_id)")
                .setParameter("raw_data_id", id);

        List result = query.list();
        if (result == null || result.isEmpty())
            return Long.valueOf(-1);

        BigInteger retId = (BigInteger) result.get(0);
        return retId.longValue();
    }

    @Transactional
    public List<RawData> list(Long userId, RawData.dataType type) {
        logger.info("in RawDataDao: list");

        SQLQuery query = (SQLQuery) sessionFactory.getCurrentSession().createSQLQuery("select * from list_raw_data(:user_id, :type)")
                .setParameter("user_id", userId)
                .setParameter("type", type.name())
                .setResultTransformer(new AliasToBeanResultTransformer(RawDataIndex.class));

        List<RawDataIndex> list = (List<RawDataIndex>) query.list();

        if (list == null || list.isEmpty())
            return null;

        // convert the RawDataIndex list to RawData
        List<RawData> rawDataList = new ArrayList<RawData>();
        for (RawDataIndex rawDataIndex: list)
            rawDataList.add(rawDataIndex.toRawData());

        return rawDataList;

    }

}
