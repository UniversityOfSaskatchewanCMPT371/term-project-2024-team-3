/*
 * Developed by Arastoo Bozorgi.
 * a.bozorgi67@gmail.com
 */

package com.beaplab.BeaplabEngine.model;

import java.util.Calendar;
import java.math.BigInteger;
import java.sql.Timestamp;

public class PredictedDataIndex {

    private BigInteger id;
    private java.sql.Timestamp datetime;
    private String predictiontype;
    private String year;

    public PredictedDataIndex() {
    }

    public PredictedDataIndex(BigInteger id, Timestamp datetime, String predictiontype) {
        this.id = id;
        this.datetime = datetime;
        this.predictiontype = predictiontype;
        // TODO: Implement passing of the year
        
        Calendar cal = Calendar.getInstance();
        cal.setTime(datetime);
        this.year = String.valueOf(cal.get(Calendar.YEAR));
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

    public void setYear(String year) {
        this.year = year;
    }

    public String getYear() {
        return year;
    }

    public PredictedData toPredictedData() {
        return new PredictedData(this.id.longValue(), null, PredictedData.predictionType.valueOf(this.predictiontype), this.datetime, this.year);
    }

    @Override
    public String toString() {
        return "PredictedDataIndex{" +
                "id=" + id +
                ", datetime=" + datetime +
                ", predictionType=" + predictiontype +
                ", year='" + year +
                '}';
    }
}
