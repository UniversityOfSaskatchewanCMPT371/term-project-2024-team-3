/*
 * Developed by Arastoo Bozorgi.
 * a.bozorgi67@gmail.com
 */

package com.beaplab.BeaplabEngine.service;

import com.beaplab.BeaplabEngine.metadata.PredictedDataDto;
import com.beaplab.BeaplabEngine.model.PredictedData;
import com.beaplab.BeaplabEngine.model.ProcessedData;
import com.beaplab.BeaplabEngine.model.RawData;
import com.beaplab.BeaplabEngine.repository.PredictedDataDao;
import com.beaplab.BeaplabEngine.util.Util;
import com.beaplab.BeaplabEngine.util.objectMapper.PredictedDataMapper;
import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.Calendar;
import java.util.ArrayList;
import java.util.Date;
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
        String year = String.valueOf(cal.get(Calendar.YEAR));

        PredictedData predictedData = new PredictedData(data, predictionType, timestamp, year);

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
}
