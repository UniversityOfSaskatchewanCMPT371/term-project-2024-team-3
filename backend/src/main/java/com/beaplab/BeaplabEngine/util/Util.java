package com.beaplab.BeaplabEngine.util;

import org.springframework.stereotype.Component;

import java.sql.Timestamp;
import java.util.Calendar;
import java.util.Date;
@Component("util")
public class Util {
    public long dateDifference(Date start, Date end) {

        long diff = end.getTime() - start.getTime();
        long diffHours = diff / (60 * 60 * 1000);
        return diffHours;
    }

    public Timestamp getCurrentTimeStamp() {
        Date date = new Date();
        Timestamp timestamp = new Timestamp(date.getTime());

        return timestamp;
    }
}
