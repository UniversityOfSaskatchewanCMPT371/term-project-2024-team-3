/*
 * Developed by Arastoo Bozorgi.
 * a.bozorgi67@gmail.com
 */

package com.beaplab.BeaplabEngine.model;

import java.math.BigInteger;
import java.sql.Timestamp;
import java.util.Calendar;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.Set;

public class ProcessedDataIndex {

    private BigInteger id;
    private java.sql.Timestamp datetime;
    private BigInteger predicted_data_id;
    private String prediction_type;
    private String year;

    public ProcessedDataIndex() {
    }

    public ProcessedDataIndex(BigInteger id, Timestamp datetime, BigInteger predicted_data_id, String prediction_type) {
        this.id = id;
        this.datetime = datetime;
        this.predicted_data_id = predicted_data_id;
        this.prediction_type = prediction_type;
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

    public BigInteger getPredicted_data_id() {
        return predicted_data_id;
    }

    public void setPredicted_data_id(BigInteger predicted_data_id) {
        this.predicted_data_id = predicted_data_id;
    }

    public String getPrediction_type() {
        return prediction_type;
    }

    public void setPrediction_type(String prediction_type) {
        this.prediction_type = prediction_type;
    }
    
    public void setYear(String year) {
        this.year = year;
    }

    public String getYear() {
        return year;
    }

    public ProcessedData toProcessedData() {
        if (this.getPredicted_data_id() != null) {
            PredictedData.predictionType predictionType = null;
            if (!this.getPrediction_type().isEmpty())
                predictionType = PredictedData.predictionType.valueOf(this.getPrediction_type());
            PredictedData predictedData = new PredictedData(this.getPredicted_data_id().longValue(), null, predictionType, this.datetime);
            Set<PredictedData> predictedDataSet= new HashSet<>();
            predictedDataSet.add(predictedData);
            return new ProcessedData(this.id.longValue(), null, predictedDataSet, this.datetime);
        }
        else
            return new ProcessedData(this.id.longValue(), null, null, this.datetime);
    }

    public ProcessedData addToPredictedDataSet(ProcessedData processedData, BigInteger predictedDataId) {
        PredictedData.predictionType predictionType = null;
        if (!this.getPrediction_type().isEmpty())
            predictionType = PredictedData.predictionType.valueOf(this.getPrediction_type());

        PredictedData predictedData = new PredictedData(predictedDataId.longValue(), null, predictionType, this.datetime);
        processedData.getPredictedDataIDs().add(predictedData);
        return processedData;
    }


    @Override
    public String toString() {
        return "ProcessedDataIndex{" +
                "id=" + id +
                ", datetime=" + datetime +
                ", predictedDataId=" + predicted_data_id +
                ", year='" + year +
                '}';
    }
}
