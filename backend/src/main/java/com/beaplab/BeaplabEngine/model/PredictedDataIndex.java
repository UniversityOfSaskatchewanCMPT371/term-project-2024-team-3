/*
 * Developed by Arastoo Bozorgi.
 * a.bozorgi67@gmail.com
 */

package com.beaplab.BeaplabEngine.model;

import java.math.BigInteger;
import java.sql.Timestamp;

public class PredictedDataIndex {

    private BigInteger id;
    private java.sql.Timestamp datetime;
    private String predictiontype;

    public PredictedDataIndex() {
    }

    public PredictedDataIndex(BigInteger id, Timestamp datetime, String predictiontype) {
        this.id = id;
        this.datetime = datetime;
        this.predictiontype = predictiontype;
    }

    public BigInteger getId() {
        return id;
    }

    public void setId(BigInteger id) {
        this.id = id;
    }

    public Timestamp getDatetime() {
        return datetime;
    }

    public void setDatetime(Timestamp datetime) {
        this.datetime = datetime;
    }

    public String getPredictionType() {
        return predictiontype;
    }

    public void setPredictionType(String predictiontype) {
        this.predictiontype = predictiontype;
    }


    public PredictedData toPredictedData() {
        return new PredictedData(this.id.longValue(), null, PredictedData.predictionType.valueOf(this.predictiontype), this.datetime);
    }

    @Override
    public String toString() {
        return "PredictedDataIndex{" +
                "id=" + id +
                ", datetime=" + datetime +
                ", predictionType=" + predictiontype +
                '}';
    }
}
