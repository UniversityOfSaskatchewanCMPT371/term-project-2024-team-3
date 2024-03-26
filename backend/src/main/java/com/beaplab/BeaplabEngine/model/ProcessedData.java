/*
 * Developed by Arastoo Bozorgi.
 * a.bozorgi67@gmail.com
 */

package com.beaplab.BeaplabEngine.model;

import org.hibernate.Hibernate;

import javax.persistence.*;
import java.sql.Timestamp;
import java.util.Arrays;
import java.util.Set;

@Entity
@Table(name = "tbl_processed_data")
public class ProcessedData {

    /**
     * attributes
     */
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    @Column(name = "id", updatable = false, nullable = false)
    private Long id;

    @Column
    private byte[] data;

    @OneToMany
    @Column(name = "predicted_data_ids")
    private Set<PredictedData> predictedDataIDs;

    @Column
    private java.sql.Timestamp dateTime;

    public ProcessedData() {
    }


    public ProcessedData(byte[] data, Set<PredictedData> predictedDataIDs, Timestamp dateTime) {
        this.data = data;
        this.predictedDataIDs = predictedDataIDs;
        this.dateTime = dateTime;
    }

    public ProcessedData(Long id, byte[] data, Set<PredictedData> predictedDataIDs, Timestamp dateTime) {
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

    public Set<PredictedData> getPredictedDataIDs() {
        return predictedDataIDs;
    }

    public void setPredictedDataIDs(Set<PredictedData> predictedDataIDs) {
        this.predictedDataIDs = predictedDataIDs;
    }

    public Timestamp getDateTime() {
        return dateTime;
    }

    public void setDateTime(Timestamp dateTime) {
        this.dateTime = dateTime;
    }

    /**
     * check to see whether predictedDataIDs is loaded or not (for Lazy fetchType)
     * @return
     */
    public boolean isPredictedDataIDLoaded() {
        return  Hibernate.isInitialized(this.predictedDataIDs) && this.predictedDataIDs != null;
    }


    @Override
    public String toString() {
        return "ProcessedData{" +
                "id=" + id +
                ", data=" + Arrays.toString(data) +
                ", predictedDataIDs=" + predictedDataIDs +
                ", dateTime=" + dateTime +
                '}';
    }
}
