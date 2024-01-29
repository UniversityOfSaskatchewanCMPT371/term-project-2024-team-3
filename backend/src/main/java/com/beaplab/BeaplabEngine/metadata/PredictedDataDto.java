/*
 * Developed by Arastoo Bozorgi.
 * a.bozorgi67@gmail.com
 */

package com.beaplab.BeaplabEngine.metadata;

import com.beaplab.BeaplabEngine.model.PredictedData;
import com.fasterxml.jackson.annotation.JsonInclude;
import java.io.Serializable;
import java.sql.Timestamp;
import java.util.Arrays;

//@JsonInclude(JsonInclude.Include.NON_NULL)
public class PredictedDataDto implements Serializable {

    private static final long serialVersionUID = 1L;


    /**
     * attributes
     */
    private Long id;
    private byte[] data;
    private PredictedData.predictionType predictionType;
    private java.sql.Timestamp dateTime;


    public PredictedDataDto() {
    }

    public PredictedDataDto(Long id, byte[] data, PredictedData.predictionType predictionType, Timestamp dateTime) {
        this.id = id;
        this.data = data;
        this.predictionType = predictionType;
        this.dateTime = dateTime;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public byte[] getData() {
        return data;
    }

    public void setData(byte[] data) {
        this.data = data;
    }

    public PredictedData.predictionType getPredictionType() {
        return predictionType;
    }

    public void setPredictionType(PredictedData.predictionType predictionType) {
        this.predictionType = predictionType;
    }

    public Timestamp getDateTime() {
        return dateTime;
    }

    public void setDateTime(Timestamp dateTime) {
        this.dateTime = dateTime;
    }

    @Override
    public String toString() {
        return "PredictedDataDto{" +
                "id=" + id +
                ", data=" + Arrays.toString(data) +
                ", predictionType=" + predictionType +
                ", dateTime=" + dateTime +
                '}';
    }
}
