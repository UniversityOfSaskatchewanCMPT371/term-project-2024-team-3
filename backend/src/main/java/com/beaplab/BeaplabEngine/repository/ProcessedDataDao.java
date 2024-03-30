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
import com.beaplab.BeaplabEngine.service.PredictedDataService;
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

    @Autowired
    PredictedDataDao predictedDataDao;

    /**
     * constructors
     */
    public ProcessedDataDao() {
    }

    public ProcessedDataDao(SessionFactory sessionFactory) {
        this.sessionFactory = sessionFactory;
    }

    @Autowired
    PredictedDataService predictedDataService;

    /**
     * A function that saves processed data using the data object and the id of the raw data it corresponds to
     * @param processedData : the processed data to be saved
     * @param rawDataId : the id of the corresponding raw data
     * @return : the id of the saved processed data
     */
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

    /**
     * A function that retrieves the id of the predicted data that corresponds to the processed data whose id is passed in
     * @param id : the id of the processed data whose corresponding predicted data's id is to be found
     * @param predictionType : the type of the prediction that the predicted data to be found was generated with
     * @return : the id of the predicted data found ( if found), or -1 if nothing is found
     */
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

    /**
     * A function that retrieves processed data using its id
     * @param id: the id of the processed data to be retrieved from the database
     * @return : the processed data object
     */
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


    /**
     * A function that retrieves a list of processed data objects for a specific user and coming from a specific device type ( fitbit or Apple Watch)
     * @param userId : the id of the user whose processed data is to be retrieved.
     * @param type :  the type of device that the raw data was generated from.
     * @return : the list of processed data objects (if found), or null if nothing is found
     */
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


    /**
     * A function that searches for processed data entry inside a list of processed data using an id
     * @param processedDataList : the list of processed data objects to be searched
     * @param id : the id of the processed data entry to be found
     * @return : the processed data objected (if found), or null if nothing is found
     */
    private ProcessedData searchProcessedDataId (List<ProcessedData> processedDataList, BigInteger id) {
        for (ProcessedData processedData: processedDataList) {
            if (processedData.getId().equals(id.longValue()))
                return processedData;
        }
        return null;
    }


    /***
     * a method to delete a piece of processed data from the database
     * Post-conditions:
     *   if processed data is found:
     *       - if any linked predicted data is found, all is deleted.
     *       - processed data is deleted
     *
     * @param id where id is the id of the predicted data entry in the datbase
     * @return a boolean indicating whether the delete operation succeeded.
     *
     */
    @Transactional
    public Boolean delete(Long id) {
        logger.info("In ProcessedDataDao: delete");

        // first check if there is a linkage to any predicted data
        SQLQuery searchQuery = (SQLQuery) sessionFactory.getCurrentSession().createSQLQuery("SELECT predicteddataids_id FROM tbl_processed_data_tbl_predicted_data WHERE tbl_processed_data_id = :processed_data_id")
                .setParameter("processed_data_id", id);
        List<Object> resultList = searchQuery.list();

        // if there is go through them and delete all the corresponding predicted data and all the linkages.
        if (resultList != null && !resultList.isEmpty()) {
            logger.info("found predicted Data linked to processed data of id: " + id);
            for (Object predictedDataIdsId : resultList) {
                assert (predictedDataIdsId instanceof BigInteger);
                Long linkedPredictedDataId = ((BigInteger) predictedDataIdsId).longValue(); // typecast
                predictedDataDao.delete(linkedPredictedDataId);
            }
        } else {
            // No data found
            logger.info("No predicted Data found linked to processed data of id: " + id);
        }

        SQLQuery deleteQuery = (SQLQuery) sessionFactory.getCurrentSession().createSQLQuery("DELETE FROM tbl_processed_data WHERE id = :processed_data_id")
                .setParameter("processed_data_id", id);

        int rowsAffected = deleteQuery.executeUpdate();
        if (rowsAffected > 0) {
            logger.info("Deleted ProcessedData with id: " + id);
            return true;
        } else {
            logger.warn("No ProcessedData found with id: " + id + " to delete");
            return false;
        }
    }


}
