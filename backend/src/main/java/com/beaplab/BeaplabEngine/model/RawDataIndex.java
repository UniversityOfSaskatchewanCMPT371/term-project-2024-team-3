/*
 * Developed by Arastoo Bozorgi.
 * a.bozorgi67@gmail.com
 */

package com.beaplab.BeaplabEngine.model;

import java.math.BigInteger;
import java.sql.Timestamp;

public class RawDataIndex {

    private BigInteger id;
    private java.sql.Timestamp datetime;
    private BigInteger processed_data_id;

    public RawDataIndex() {
    }

    public RawDataIndex(BigInteger id, Timestamp datetime, BigInteger processedDataId) {
        this.id = id;
        this.datetime = datetime;
        this.processed_data_id = processedDataId;
    }

    public BigInteger getId() {
        return id;
    }

    public void setId(BigInteger id) {
        this.id = id;
    }

    public Timestamp getDateTime() {
        return datetime;
    }

    public void setDateTime(Timestamp datetime) {
        this.datetime = datetime;
    }

    public BigInteger getProcessed_data_id() {
        return processed_data_id;
    }

    public void setProcessed_data_id(BigInteger processed_data_id) {
        this.processed_data_id = processed_data_id;
    }

    public RawData toRawData() {
        return new RawData(this.id.longValue(), null, null, this.processed_data_id.longValue() , this.datetime);
    }


    @Override
    public String toString() {
        return "RawDataIndex{" +
                "id=" + id +
                ", datetime=" + datetime +
                ", processedDataId=" + processed_data_id +
                '}';
    }
}
