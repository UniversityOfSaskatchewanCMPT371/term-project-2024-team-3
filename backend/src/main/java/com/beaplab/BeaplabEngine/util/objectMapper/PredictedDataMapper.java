/*
 * Developed by Arastoo Bozorgi.
 * a.bozorgi67@gmail.com
 */

package com.beaplab.BeaplabEngine.util.objectMapper;

import com.beaplab.BeaplabEngine.metadata.PredictedDataDto;
import com.beaplab.BeaplabEngine.metadata.RoleDto;
import com.beaplab.BeaplabEngine.model.PredictedData;
import com.beaplab.BeaplabEngine.model.Role;
import com.beaplab.BeaplabEngine.util.objectMapper.base.BaseMapper;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Set;

/**
 * this class converts PredictedData to PredictedDataDto and vice versa
 */
@Component("predictedDataMapper")
public class PredictedDataMapper implements BaseMapper<PredictedData, PredictedDataDto> {

    /**
     * converting PredictedData to PredictedDataDto
     * @param predictedData
     * @param predictedDataDto
     * @return
     */
    @Override
    public PredictedDataDto model2Dto(PredictedData predictedData, PredictedDataDto predictedDataDto) {
        predictedDataDto.setId(predictedData.getId());
        predictedDataDto.setData(predictedData.getData());
        predictedDataDto.setPredictionType(predictedData.getPredictionType());
        predictedDataDto.setDateTime(predictedData.getDateTime());

        return predictedDataDto;
    }

    /**
     * converting a list of predictedData to a list of predictedDataDto
     * @param predictedDatas
     * @param predictedDataDtos
     * @return
     */
    @Override
    public List<PredictedDataDto> model2Dto(List<PredictedData> predictedDatas, List<PredictedDataDto> predictedDataDtos) {
        for (PredictedData predictedData: predictedDatas){
            predictedDataDtos.add(model2Dto(predictedData, new PredictedDataDto()));
        }
        return predictedDataDtos;
    }


    /**
     * converting a set of PredictedData to a list of PredictedDataDto
     * @param predictedDatas
     * @param predictedDataDtos
     * @return
     */
    public Set<PredictedDataDto> model2Dto(Set<PredictedData> predictedDatas, Set<PredictedDataDto> predictedDataDtos) {
        for (PredictedData predictedData: predictedDatas){
            predictedDataDtos.add(model2Dto(predictedData, new PredictedDataDto()));
        }
        return predictedDataDtos;
    }

    /**
     * converting PredictedDataDto to PredictedData
     * @param predictedDataDto
     * @param predictedData
     * @return
     */
    @Override
    public PredictedData dto2Model(PredictedDataDto predictedDataDto, PredictedData predictedData) {
        predictedData.setId(predictedDataDto.getId());
        predictedData.setData(predictedDataDto.getData());
        predictedData.setPredictionType(predictedDataDto.getPredictionType());
        predictedData.setDateTime(predictedDataDto.getDateTime());

        return predictedData;
    }

    /**
     * converting a list of PredictedDataDto to a list of PredictedData
     * @param predictedDataDtos
     * @param predictedDatas
     * @return
     */
    @Override
    public List<PredictedData> dto2Model(List<PredictedDataDto> predictedDataDtos, List<PredictedData> predictedDatas) {
        for (PredictedDataDto predictedDataDto: predictedDataDtos){
            predictedDatas.add(dto2Model(predictedDataDto, new PredictedData()));
        }
        return predictedDatas;
    }

    /**
     * converting a set of PredictedDataDto to a list of PredictedData
     * @param predictedDataDtos
     * @param predictedDatas
     * @return
     */
    public Set<PredictedData> dto2Model(Set<PredictedDataDto> predictedDataDtos, Set<PredictedData> predictedDatas) {
        for (PredictedDataDto predictedDataDto: predictedDataDtos){
            predictedDatas.add(dto2Model(predictedDataDto, new PredictedData()));
        }
        return predictedDatas;
    }
}
