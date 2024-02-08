/*
 * Developed by Arastoo Bozorgi.
 * a.bozorgi67@gmail.com
 */

package com.beaplab.BeaplabEngine.metadata;

import com.beaplab.BeaplabEngine.model.PredictedData;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.io.Serializable;
import java.sql.Timestamp;
import java.util.Arrays;
import java.util.Set;

//@JsonInclude(JsonInclude.Include.NON_NULL)
public class ProcessedDataDto implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * attributes
     */
    private Long id;
    private byte[] data;
    @JsonProperty("predictedData")
    private Set<PredictedDataDto> predictedDataIDs;
    private java.sql.Timestamp dateTime;


    public ProcessedDataDto() {
    }

    public ProcessedDataDto(Long id, byte[] data, Set<PredictedDataDto> predictedDataIDs, Timestamp dateTime) {
        this.id = id;
        this.data = data;
        this.predictedDataIDs = predictedDataIDs;
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

    public Set<PredictedDataDto> getPredictedDataIDs() {
        return predictedDataIDs;
    }

    public void setPredictedDataIDs(Set<PredictedDataDto> predictedDataIDs) {
        this.predictedDataIDs = predictedDataIDs;
    }

    public Timestamp getDateTime() {
        return dateTime;
    }

    public void setDateTime(Timestamp dateTime) {
        this.dateTime = dateTime;
    }

    @Override
    public String toString() {
        return "ProcessedDataDto{" +
                "id=" + id +
                ", data=" + Arrays.toString(data) +
                ", predictedDataIDs=" + predictedDataIDs +
                ", dateTime=" + dateTime +
                '}';
    }
}
