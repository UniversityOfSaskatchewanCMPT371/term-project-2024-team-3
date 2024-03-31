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


    /**
     * A function that saves predicted data using the data object and the id of the corresponding processed data
     * @param predictedData : the predicted data to be saved
     * @param processedDataId : the id of the corresponding processed data
     * @return :
     */
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


    /**
     * A function that retrieves predicted data using its id
     * @param id : the id of the predicted data to be retrieved
     * @return : the predicted data object corresponding to the id ( if found), if not, null is returned
     */
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

    /**
     * A function that lists a user's predicted data of a specific type ( Apple Watch or fitbit)
     * @param userId : the id of the user whose predicted data is to be retrieved
     * @param type: the type of device the data belongs to
     * @return : a list of predicted data objects (if found), if not then null is returned.
     */
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


    /***
     * a method to delete a piece of predicted data from the database
     * @param id where id is the id of the predicted data entry in the database
     * @return a boolean indicating whether the delete operation succeeded.
     */
    @Transactional
    public Boolean delete(Long id) {
        logger.info("In PredictedDataDao: delete");

        Boolean relationdeleted=  deleteRelationToProcessed(id);
//        if (!relationdeleted) {
//            logger.warn("Deletion of PredictedData with id: " + id + "failed due to failure to delete linkage");
//        }

        SQLQuery query = (SQLQuery) sessionFactory.getCurrentSession().createSQLQuery("DELETE FROM tbl_predicted_data WHERE id = :predict_data_id")
                .setParameter("predict_data_id", id);

        int rowsAffected = query.executeUpdate();
        if (rowsAffected > 0) {
            logger.info("Deleted PredictedData with id: " + id);
            return true;
        } else {
            logger.warn("No PredictedData found with id: " + id + " to delete");
            return false;
        }
    }

    /***
     * a method to delete a relational entry in the tbl-processed-data-tbl-predicted-data table in the database
     * @param id where id is the id of the predicted data entry in the database
     * @return a boolean indicating whether the delete operation succeeded.
     */
    @Transactional
    public Boolean deleteRelationToProcessed(Long id) {
        logger.info("In PredictedDataDao: delete");

        SQLQuery query = (SQLQuery) sessionFactory.getCurrentSession().createSQLQuery("DELETE FROM tbl_processed_data_tbl_predicted_data WHERE predicteddataids_id = :predict_data_id")
                .setParameter("predict_data_id", id);

        int rowsAffected = query.executeUpdate();
        if (rowsAffected > 0) {
            logger.info("Deleted relation between PredictedData with id: " + id + " and its corresponding processed data");
            return true;
        } else {
            logger.warn("No linkage to processed data found for Predicted data with id: " + id + " to delete");
            return false;
        }
    }
}