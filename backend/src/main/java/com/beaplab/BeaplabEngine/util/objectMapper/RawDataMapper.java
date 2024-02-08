/*
 * Developed by Arastoo Bozorgi.
 * a.bozorgi67@gmail.com
 */

package com.beaplab.BeaplabEngine.util.objectMapper;

import com.beaplab.BeaplabEngine.metadata.PredictedDataDto;
import com.beaplab.BeaplabEngine.metadata.ProcessedDataDto;
import com.beaplab.BeaplabEngine.metadata.RawDataDto;
import com.beaplab.BeaplabEngine.model.PredictedData;
import com.beaplab.BeaplabEngine.model.ProcessedData;
import com.beaplab.BeaplabEngine.model.RawData;
import com.beaplab.BeaplabEngine.util.objectMapper.base.BaseMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Set;

/**
 * this class converts User to UserDto and vice versa
 */
@Component("rawDataMapper")
public class RawDataMapper implements BaseMapper<RawData, RawDataDto> {

    @Autowired
    ProcessedDataMapper processedDataMapper;


    /**
     * converting ProcessedData to ProcessedDataDto
     * @param rawData
     * @param rawDataDto
     * @return
     */
    @Override
    public RawDataDto model2Dto(RawData rawData, RawDataDto rawDataDto) {
        rawDataDto.setId(rawData.getId());
        rawDataDto.setData(rawData.getData());
        rawDataDto.setType(rawData.getType());
        rawDataDto.setProcessedDataID(rawData.getProcessedDataID());
        rawDataDto.setDateTime(rawData.getDateTime());

//        if(rawData.isProcessedDataIDLoaded())
//            rawDataDto.setProcessedDataID(processedDataMapper.model2Dto(rawData.getProcessedDataID(), new ProcessedDataDto()));

        return rawDataDto;
    }

    /**
     * converting a list of ProcessedData to a list of ProcessedDataDto
     * @param rawDatas
     * @param rawDataDtos
     * @return
     */
    @Override
    public List<RawDataDto> model2Dto(List<RawData> rawDatas, List<RawDataDto> rawDataDtos) {
        for (RawData rawData: rawDatas){
            rawDataDtos.add(model2Dto(rawData, new RawDataDto()));
        }
        return rawDataDtos;
    }


    /**
     * converting a set of RawData to a set of RawDataDto
     * @param rawDatas
     * @param rawDataDtos
     * @return
     */
    public Set<RawDataDto> model2Dto(Set<RawData> rawDatas, Set<RawDataDto> rawDataDtos) {
        for (RawData rawData: rawDatas){
            rawDataDtos.add(model2Dto(rawData, new RawDataDto()));
        }
        return rawDataDtos;
    }


    /**
     * converting ProcessedDataDto to ProcessedData
     * @param rawDataDto
     * @param rawData
     * @return
     */
    @Override
    public RawData dto2Model(RawDataDto rawDataDto, RawData rawData) {
        rawData.setId(rawDataDto.getId());
        rawData.setData(rawDataDto.getData());
        rawData.setType(rawDataDto.getType());
        rawData.setProcessedDataID(rawDataDto.getProcessedDataID());
        rawData.setDateTime(rawDataDto.getDateTime());

//        if (rawDataDto.getProcessedDataID() != null)
//            rawData.setProcessedDataID(processedDataMapper.dto2Model(rawDataDto.getProcessedDataID(), new ProcessedData()));

        return rawData;
    }

    /**
     * converting a list of ProcessedDataDto to a list of ProcessedData
     * @param rawDataDtos
     * @param rawDatas
     * @return
     */
    @Override
    public List<RawData> dto2Model(List<RawDataDto> rawDataDtos, List<RawData> rawDatas) {
        for (RawDataDto rawDataDto: rawDataDtos){
            rawDatas.add(dto2Model(rawDataDto, new RawData()));
        }
        return rawDatas;
    }


    /**
     * converting a set of RawDataDto to a set of RawData
     * @param rawDataDtos
     * @param rawDatas
     * @return
     */
    public Set<RawData> dto2Model(Set<RawDataDto> rawDataDtos, Set<RawData> rawDatas) {
        for (RawDataDto rawDataDto: rawDataDtos){
            rawDatas.add(dto2Model(rawDataDto, new RawData()));
        }
        return rawDatas;
    }
}
