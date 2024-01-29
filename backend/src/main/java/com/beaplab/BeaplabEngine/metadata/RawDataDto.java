/*
 * Developed by Arastoo Bozorgi.
 * a.bozorgi67@gmail.com
 */

package com.beaplab.BeaplabEngine.metadata;

import com.beaplab.BeaplabEngine.model.ProcessedData;
import com.beaplab.BeaplabEngine.model.RawData;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.io.Serializable;
import java.sql.Timestamp;
import java.util.Arrays;
import java.util.Set;

//@JsonInclude(JsonInclude.Include.NON_NULL)
public class RawDataDto implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * attributes
     */
    private Long id;
    private byte[] data;
    private RawData.dataType type;
    @JsonProperty("processedDataID")
    private Long processedDataID;
    private java.sql.Timestamp dateTime;


    public RawDataDto() {
    }

    public RawDataDto(Long id, byte[] data, RawData.dataType type, Long processedDataID, Timestamp dateTime) {
        this.id = id;
        this.data = data;
        this.type = type;
        this.processedDataID = processedDataID;
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

    public RawData.dataType getType() {
        return type;
    }

    public void setType(RawData.dataType type) {
        this.type = type;
    }

    public Long getProcessedDataID() {
        return processedDataID;
    }

    public void setProcessedDataID(Long processedDataID) {
        this.processedDataID = processedDataID;
    }

    public Timestamp getDateTime() {
        return dateTime;
    }

    public void setDateTime(Timestamp dateTime) {
        this.dateTime = dateTime;
    }

    @Override
    public String toString() {
        return "RawDataDto{" +
                "id=" + id +
                ", data=" + Arrays.toString(data) +
                ", type=" + type +
                ", processedDataID=" + processedDataID +
                ", dateTime=" + dateTime +
                '}';
    }
}
