/*
 * Developed by Arastoo Bozorgi.
 * a.bozorgi67@gmail.com
 */

package com.beaplab.BeaplabEngine.util.objectMapper;

import com.beaplab.BeaplabEngine.metadata.AccessGroupDto;
import com.beaplab.BeaplabEngine.metadata.PredictedDataDto;
import com.beaplab.BeaplabEngine.metadata.ProcessedDataDto;
import com.beaplab.BeaplabEngine.model.AccessGroup;
import com.beaplab.BeaplabEngine.model.PredictedData;
import com.beaplab.BeaplabEngine.model.ProcessedData;
import com.beaplab.BeaplabEngine.util.objectMapper.base.BaseMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * this class converts ProcessedData to ProcessedDataDto and vice versa
 */
@Component("processedDataMapper")
public class ProcessedDataMapper implements BaseMapper<ProcessedData, ProcessedDataDto> {

    @Autowired
    PredictedDataMapper predictedDataMapper;


    /**
     * converting ProcessedData to ProcessedDataDto
     * @param processedData
     * @param processedDataDto
     * @return
     */
    @Override
    public ProcessedDataDto model2Dto(ProcessedData processedData, ProcessedDataDto processedDataDto) {
        processedDataDto.setId(processedData.getId());
        processedDataDto.setData(processedData.getData());
        processedDataDto.setDateTime(processedData.getDateTime());

        if(processedData.isPredictedDataIDLoaded())
            processedDataDto.setPredictedDataIDs(predictedDataMapper.model2Dto(processedData.getPredictedDataIDs(), new HashSet<PredictedDataDto>()));

        return processedDataDto;
    }


    /**
     * converting a list of ProcessedData to a list of ProcessedDataDto
     * @param processedDatas
     * @param processedDataDtos
     * @return
     */
    @Override
    public List<ProcessedDataDto> model2Dto(List<ProcessedData> processedDatas, List<ProcessedDataDto> processedDataDtos) {
        for (ProcessedData processedData: processedDatas){
            processedDataDtos.add(model2Dto(processedData, new ProcessedDataDto()));
        }
        return processedDataDtos;
    }


    /**
     * converting a set of PredictedData to a list of PredictedDataDto
     * @param processedDatas
     * @param processedDataDtos
     * @return
     */
    public Set<ProcessedDataDto> model2Dto(Set<ProcessedData> processedDatas, Set<ProcessedDataDto> processedDataDtos) {
        for (ProcessedData processedData: processedDatas){
            processedDataDtos.add(model2Dto(processedData, new ProcessedDataDto()));
        }
        return processedDataDtos;
    }


    /**
     * converting ProcessedDataDto to ProcessedData
     * @param processedDataDto
     * @param processedData
     * @return
     */
    @Override
    public ProcessedData dto2Model(ProcessedDataDto processedDataDto, ProcessedData processedData) {
        processedData.setId(processedDataDto.getId());
        processedData.setData(processedDataDto.getData());
        processedData.setDateTime(processedDataDto.getDateTime());

        if (processedDataDto.getPredictedDataIDs() != null)
            processedData.setPredictedDataIDs(predictedDataMapper.dto2Model(processedDataDto.getPredictedDataIDs(), new HashSet<PredictedData>()));

        return processedData;
    }


    /**
     * converting a list of ProcessedDataDto to a list of ProcessedData
     * @param processedDataDtos
     * @param processedDatas
     * @return
     */
    @Override
    public List<ProcessedData> dto2Model(List<ProcessedDataDto> processedDataDtos, List<ProcessedData> processedDatas) {
        for (ProcessedDataDto processedDataDto: processedDataDtos){
            processedDatas.add(dto2Model(processedDataDto, new ProcessedData()));
        }
        return processedDatas;
    }

    /**
     * converting a set of PredictedDataDto to a list of PredictedData
     * @param processedDataDtos
     * @param processedDatas
     * @return
     */
    public Set<ProcessedData> dto2Model(Set<ProcessedDataDto> processedDataDtos, Set<ProcessedData> processedDatas) {
        for (ProcessedDataDto processedDataDto: processedDataDtos){
            processedDatas.add(dto2Model(processedDataDto, new ProcessedData()));
        }
        return processedDatas;
    }
}
