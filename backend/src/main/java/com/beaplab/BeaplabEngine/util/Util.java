package com.beaplab.BeaplabEngine.util;

import org.springframework.stereotype.Component;

import java.util.Date;
@Component("util")
public class Util {
    public long dateDifference(Date start, Date end) {

        long diff = end.getTime() - start.getTime();
        long diffHours = diff / (60 * 60 * 1000);
        return diffHours;
    }
}
