/*
 * Developed by Arastoo Bozorgi.
 * a.bozorgi67@gmail.com
 */

package com.beaplab.BeaplabEngine.service;

import com.beaplab.BeaplabEngine.metadata.PredictedDataDto;
import com.beaplab.BeaplabEngine.model.PredictedData;
import com.beaplab.BeaplabEngine.model.RawData;
import com.beaplab.BeaplabEngine.repository.PredictedDataDao;
import com.beaplab.BeaplabEngine.util.Util;
import com.beaplab.BeaplabEngine.util.objectMapper.PredictedDataMapper;
import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;
import org.hibernate.SQLQuery;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.util.Calendar;
import java.util.ArrayList;
import java.util.List;


@Service("predictedDataService")
public class PredictedDataService {

    final static Logger logger = LogManager.getLogger(PredictedDataService.class.getName());

    @Autowired
    PredictedDataDao predictedDataDao;

    @Autowired
    PredictedDataMapper predictedDataMapper;

    @Autowired
    Util util;

    public Long save(byte[] data, PredictedData.predictionType predictionType, Long processedDataId) {
        logger.info("in PredictedDataService: save");

        Timestamp timestamp = util.getCurrentTimeStamp();

        Calendar cal = Calendar.getInstance();
        cal.setTime(timestamp);

        PredictedData predictedData = new PredictedData(data, predictionType, timestamp);

        return predictedDataDao.save(predictedData, processedDataId);
    }

    public PredictedDataDto get(Long id) {
        logger.info("in PredictedDataService: get");

        PredictedData predictedData = predictedDataDao.get(id);

        if(predictedData != null)
            return predictedDataMapper.model2Dto(predictedData, new PredictedDataDto());
        return null;
    }


    public List<PredictedDataDto> list(Long userId, RawData.dataType type) {
        logger.info("in RawDataService: list");

        List<PredictedDataDto> predictedDataDtos = predictedDataMapper.model2Dto(predictedDataDao.list(userId, type), new ArrayList<PredictedDataDto>());

        return predictedDataDtos;
    }

/***
 * a method to delete a piece of predicted data from the database using the predicted data DAO
 * @param id where id is the id of the predicted data entry in the datbase
 * @return a boolean indicating whether the delete operation succeeded.
 */
    public Boolean delete(Long id){
        logger.info("in PredictedDataService: delete");

        return predictedDataDao.delete(id);
    }


    /***
     * a method to delete a list of predicted data from the database
     * @param ids where ids is an array of the ids of the predicted data entries to be deleted from
     * @return a boolean indicating whether the delete operation succeeded.
     */
    public Boolean groupDelete(Long[] ids ) {
        logger.info("In PredictedDataService: groupDelete");
        boolean totalSuccess= true;

        for (long id : ids) {
            // Perform deletion operation for each ID
            totalSuccess= totalSuccess && delete(id);
        }
        return totalSuccess;
    }
}
