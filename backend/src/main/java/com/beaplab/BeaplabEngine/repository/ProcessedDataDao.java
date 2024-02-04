/*
 * Developed by Arastoo Bozorgi.
 * a.bozorgi67@gmail.com
 */

package com.beaplab.BeaplabEngine.repository;

import com.beaplab.BeaplabEngine.model.PredictedData;
import com.beaplab.BeaplabEngine.model.ProcessedData;
import com.beaplab.BeaplabEngine.model.ProcessedDataIndex;
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

@Repository("processedDataDao")
@ComponentScan("com.beaplab.BeaplabEngine")
@PropertySource("classpath:postgresql.properties")
public class ProcessedDataDao {

    final static Logger logger = LogManager.getLogger(ProcessedDataDao.class.getName());


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
    public ProcessedDataDao() {
    }

    public ProcessedDataDao(SessionFactory sessionFactory) {
        this.sessionFactory = sessionFactory;
    }


    @Transactional
    public Long save(ProcessedData processedData, Long rawDataId) {
        logger.info("in ProcessedDataDao: save");

        SQLQuery query = (SQLQuery) sessionFactory.getCurrentSession().createSQLQuery("select * from save_tbl_processed_data(:data, :datetime, :raw_data_id, :sym_key)")
                .setParameter("data", processedData.getData())
                .setParameter("datetime", processedData.getDateTime())
                .setParameter("raw_data_id", rawDataId)
                .setParameter("sym_key", environment.getProperty("pg_crypto.key"));

        List result = query.list();
        if (result == null || result.isEmpty())
            return Long.valueOf(-1);

        BigInteger retId = (BigInteger) result.get(0);
        return retId.longValue();
    }

    @Transactional
    public Long getPredictedDataId(Long id, PredictedData.predictionType predictionType) {
        logger.info("in ProcessedDataDao: getPredictedDataId");

        SQLQuery query = (SQLQuery) sessionFactory.getCurrentSession().createSQLQuery("select * from get_predicted_data_id(:processed_data_id, :in_predictiontype)")
                .setParameter("processed_data_id", id)
                .setParameter("in_predictiontype", predictionType.name());

        List result = query.list();
        if (result == null || result.isEmpty())
            return Long.valueOf(-1);

        BigInteger retId = (BigInteger) result.get(0);
        return retId.longValue();

    }


    @Transactional
    public ProcessedData get(Long id) {
        logger.info("in ProcessedDataDao: get");

        SQLQuery query = (SQLQuery) sessionFactory.getCurrentSession().createSQLQuery("select * from get_by_id_tbl_processed_data(:processed_data_id, :sym_key)")
                .addEntity(ProcessedData.class)
                .setParameter("processed_data_id", id)
                .setParameter("sym_key", environment.getProperty("pg_crypto.key"));


        @SuppressWarnings("unchecked")
        List<ProcessedData> list = (List<ProcessedData>) query.list();

        if (list != null && !list.isEmpty()) {
            return list.get(0);
        }

        return null;
    }


    @Transactional
    public List<ProcessedData> list(Long userId, RawData.dataType type) {
        logger.info("in ProcessedDataDao: list");

        SQLQuery query = (SQLQuery) sessionFactory.getCurrentSession().createSQLQuery("select * from list_processed_data(:user_id, :type)")
                .setParameter("user_id", userId)
                .setParameter("type", type.name())
                .setResultTransformer(new AliasToBeanResultTransformer(ProcessedDataIndex.class));

        List<ProcessedDataIndex> list = (List<ProcessedDataIndex>) query.list();

        if (list == null || list.isEmpty())
            return null;

        // convert the RawDataIndex list to RawData
        List<ProcessedData> processedDataList = new ArrayList<ProcessedData>();
        for (ProcessedDataIndex processedDataIndex: list) {
            // if we have an existing processData in our list, we should add to its predictedData set
            ProcessedData theProcessedData = searchProcessedDataId(processedDataList, processedDataIndex.getId());
            if (theProcessedData != null) {
                processedDataIndex.addToPredictedDataSet(theProcessedData, processedDataIndex.getPredicted_data_id());
            }
            else {
                processedDataList.add(processedDataIndex.toProcessedData());
            }
        }

        return processedDataList;

    }


    private ProcessedData searchProcessedDataId (List<ProcessedData> processedDataList, BigInteger id) {
        for (ProcessedData processedData: processedDataList) {
            if (processedData.getId().equals(id.longValue()))
                return processedData;
        }
        return null;
    }

}
