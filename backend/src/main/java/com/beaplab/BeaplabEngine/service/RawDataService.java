/*
 * Developed by Arastoo Bozorgi.
 * a.bozorgi67@gmail.com
 */

package com.beaplab.BeaplabEngine.service;

import com.beaplab.BeaplabEngine.metadata.RawDataDto;
import com.beaplab.BeaplabEngine.model.RawData;
import com.beaplab.BeaplabEngine.repository.RawDataDao;
import com.beaplab.BeaplabEngine.util.objectMapper.RawDataMapper;
import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service("rawDataService")
public class RawDataService {
    final static Logger logger = LogManager.getLogger(RawDataService.class.getName());

    @Autowired
    RawDataDao rawDataDao;

    @Autowired
    RawDataMapper rawDataMapper;


    public Long save(byte[] data, RawData.dataType type, Long userId) {
        logger.info("in RawDataService: save");

        Date date = new Date();
        RawData rawData = new RawData(data, type, Long.valueOf(-1), new Timestamp(date.getTime()));

        return rawDataDao.save(rawData, userId);
    }


    public RawDataDto get(Long id) {
        logger.info("in RawDataService: get");

        RawData rawData = rawDataDao.get(id);

        if(rawData != null)
            return rawDataMapper.model2Dto(rawData, new RawDataDto());
        return null;
    }

    public Long getProcessDataId(long id) {
        logger.info("in RawDataService: getProcessDataId");

        return rawDataDao.getProcessDataId(id);
    }

    public List<RawDataDto> list(Long userId, RawData.dataType type) {
        logger.info("in RawDataService: list");

        List<RawData> rawDataList = rawDataDao.list(userId, type);
        if (rawDataList == null)
            return null;

        List<RawDataDto> rawDataDtos = rawDataMapper.model2Dto(rawDataList, new ArrayList<RawDataDto>());
        return rawDataDtos;
    }
}
