/*
 * Developed by Arastoo Bozorgi.
 * a.bozorgi67@gmail.com
 */

package com.beaplab.BeaplabEngine.service;

import com.beaplab.BeaplabEngine.metadata.ProcessedDataDto;
import com.beaplab.BeaplabEngine.metadata.RawDataDto;
import com.beaplab.BeaplabEngine.model.PredictedData;
import com.beaplab.BeaplabEngine.model.ProcessedData;
import com.beaplab.BeaplabEngine.model.RawData;
import com.beaplab.BeaplabEngine.repository.ProcessedDataDao;
import com.beaplab.BeaplabEngine.util.Util;
import com.beaplab.BeaplabEngine.util.objectMapper.ProcessedDataMapper;
import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

@Service("processedDataService")
public class ProcessedDataService {
    final static Logger logger = LogManager.getLogger(ProcessedDataService.class.getName());

    @Autowired
    ProcessedDataDao processedDataDao;

    @Autowired
    ProcessedDataMapper processedDataMapper;

    @Autowired
    Util util;


    public Long save(byte[] data, Long rawDataId) {
        logger.info("in ProcessedDataService: save");

        Timestamp timestamp = util.getCurrentTimeStamp();

        Calendar cal = Calendar.getInstance();
        cal.setTime(timestamp);
        String year = String.valueOf(cal.get(Calendar.YEAR));

        ProcessedData processedData = new ProcessedData(data, null, timestamp, year); //TODO is sending null correct?

        return processedDataDao.save(processedData, rawDataId);
    }


    public ProcessedDataDto get(Long id) {
        logger.info("in ProcessedDataService: get");

        ProcessedData processedData = processedDataDao.get(id);

        if(processedData != null)
            return processedDataMapper.model2Dto(processedData, new ProcessedDataDto());
        return null;
    }

    public Long getPredictedDataId(Long id, PredictedData.predictionType predictionType) {
        logger.info("in ProcessedDataService: getPredictedDataId");

        return processedDataDao.getPredictedDataId(id, predictionType);
    }

    public List<ProcessedDataDto> list(Long userId, RawData.dataType type) {
        logger.info("in ProcessedDataService: list");

        List<ProcessedData> processedDataList = processedDataDao.list(userId, type);
        if (processedDataList == null)
            return null;

        List<ProcessedDataDto> processedDataDtoList = processedDataMapper.model2Dto(processedDataList, new ArrayList<ProcessedDataDto>());

        return processedDataDtoList;
    }
}
