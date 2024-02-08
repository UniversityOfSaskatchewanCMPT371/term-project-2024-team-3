/*
 * Developed by Arastoo Bozorgi.
 * a.bozorgi67@gmail.com
 */

package com.beaplab.BeaplabEngine.model;

import javax.persistence.*;
import java.sql.Timestamp;
import java.util.Arrays;

@Entity
@Table(name = "tbl_predicted_data")
public class PredictedData {

    public enum predictionType {
        svm {
            public String toString() {
                return "svm";
            }
        },
        randomForest{
            public String toString() {
                return "randomForest";
            }
        },
        rotationForest{
            public String toString() {
                return "rotationForest";
            }
        },
        decissionTree{
            public String toString() {
                return "decissionTree";
            }
        }
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
    private predictionType predictionType;

    @Column
    private java.sql.Timestamp dateTime;


    public PredictedData() {
    }

    public PredictedData(byte[] data, PredictedData.predictionType predictionType, Timestamp dateTime) {
        this.data = data;
        this.predictionType = predictionType;
        this.dateTime = dateTime;
    }

    public PredictedData(Long id, byte[] data, PredictedData.predictionType predictionType, Timestamp dateTime) {
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
        return "PredictedData{" +
                "id=" + id +
                ", data=" + Arrays.toString(data) +
                ", predictionType=" + predictionType +
                ", dateTime=" + dateTime +
                '}';
    }
}
