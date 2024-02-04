/*
 * Developed by Arastoo Bozorgi.
 * a.bozorgi67@gmail.com
 */

package com.beaplab.BeaplabEngine.model;

import org.hibernate.Hibernate;

import javax.persistence.*;
import java.sql.Timestamp;
import java.util.Arrays;
import java.util.Date;
import java.util.Set;

@Entity
@Table(name = "tbl_raw_data")
public class RawData {

    public enum dataType {
        AppleWatch,
        FitBit
    }

    /**
     * attributes
     */
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    @Column(name = "id", updatable = false, nullable = false)
    private Long id;

    @Column
    private byte[] data;

    @Column
    @Enumerated(EnumType.STRING)
    private dataType type;

    @Column(name = "processed_data_id", nullable = true)
    private Long processedDataID;

    @Column
    private java.sql.Timestamp dateTime;



    public RawData() {
    }

    public RawData(byte[] data, dataType type, Long processedDataID, Timestamp dateTime) {
        this.data = data;
        this.type = type;
        this.processedDataID = processedDataID;
        this.dateTime = dateTime;
    }

    public RawData(Long id, byte[] data, dataType type, Long processedDataID, Timestamp dateTime) {
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

    public dataType getType() {
        return type;
    }

    public void setType(dataType type) {
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

    public String getStringType() {

        if (this.type == dataType.AppleWatch)
            return "AppleWatch";

        if (this.type == dataType.FitBit)
            return "FitBit";

        return "";
    }


    @Override
    public String toString() {
        return "RawData{" +
                "id=" + id +
                ", data=" + Arrays.toString(data) +
                ", type=" + type +
                ", processedDataID=" + processedDataID +
                ", dateTime=" + dateTime +
                '}';
    }
}
