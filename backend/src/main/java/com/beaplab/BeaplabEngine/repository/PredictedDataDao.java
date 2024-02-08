/*
 * Developed by Arastoo Bozorgi.
 * a.bozorgi67@gmail.com
 */

package com.beaplab.BeaplabEngine.repository;

import com.beaplab.BeaplabEngine.model.PredictedData;
import com.beaplab.BeaplabEngine.model.PredictedDataIndex;
import com.beaplab.BeaplabEngine.model.RawData;
import com.beaplab.BeaplabEngine.repository.base.BaseRepository;
import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;
import org.hibernate.Criteria;
import org.hibernate.Query;
import org.hibernate.SQLQuery;
import org.hibernate.SessionFactory;
import org.hibernate.transform.AliasToBeanResultTransformer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigInteger;
import java.util.ArrayList;
import java.util.List;

@Repository("predictedDataDao")
@ComponentScan("com.beaplab.BeaplabEngine")
@PropertySource("classpath:postgresql.properties")
public class PredictedDataDao {

    final static Logger logger = LogManager.getLogger(PredictedDataDao.class.getName());


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
    public PredictedDataDao() {
    }

    public PredictedDataDao(SessionFactory sessionFactory) {
        this.sessionFactory = sessionFactory;
    }


    @Transactional
    public Long save(PredictedData predictedData, long processedDataId) {
        logger.info("in PredictedDataDao: save");

        SQLQuery query = (SQLQuery) sessionFactory.getCurrentSession().createSQLQuery("select * from save_tbl_predicted_data(:data, :predictiontype, :datetime, :processed_data_id, :sym_key)")
                .setParameter("data", predictedData.getData())
                .setParameter("predictiontype", predictedData.getPredictionType().name())
                .setParameter("datetime", predictedData.getDateTime())
                .setParameter("processed_data_id", processedDataId)
                .setParameter("sym_key", environment.getProperty("pg_crypto.key"));

        List result = query.list();
        if (result == null || result.isEmpty())
            return Long.valueOf(-1);

        BigInteger retId = (BigInteger) result.get(0);
        return retId.longValue();
    }


    @Transactional
    public PredictedData get(Long id) {
        logger.info("in PredictedDataDao: get");

        SQLQuery query = (SQLQuery) sessionFactory.getCurrentSession().createSQLQuery("select * from get_by_id_tbl_predict_data(:predict_data_id, :sym_key)")
                .addEntity(PredictedData.class)
                .setParameter("predict_data_id", id)
                .setParameter("sym_key", environment.getProperty("pg_crypto.key"));


        @SuppressWarnings("unchecked")
        List<PredictedData> list = (List<PredictedData>) query.list();

        if (list != null && !list.isEmpty()) {
            return list.get(0);
        }

        return null;
    }

    @Transactional
    public List<PredictedData> list(Long userId, RawData.dataType type) {
        logger.info("in RawDataDao: list");

        SQLQuery query = (SQLQuery) sessionFactory.getCurrentSession().createSQLQuery("select * from list_predicted_data(:user_id, :type)")
                .setParameter("user_id", userId)
                .setParameter("type", type.name())
                .setResultTransformer(new AliasToBeanResultTransformer(PredictedDataIndex.class));

        List<PredictedDataIndex> list = (List<PredictedDataIndex>) query.list();
        if (list == null || list.isEmpty())
            return null;

        // convert the RawDataIndex list to RawData
        List<PredictedData> predictedDataList = new ArrayList<PredictedData>();
        for (PredictedDataIndex predictedDataIndex: list)
            predictedDataList.add(predictedDataIndex.toPredictedData());

        return predictedDataList;
    }
}
