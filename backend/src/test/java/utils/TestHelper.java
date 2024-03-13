package utils;

import java.sql.Timestamp;
import java.util.Calendar;

public class TestHelper {

    // month starts from 0, so january is 0
    public static Timestamp getTimestamp(int year, int month, int day, int minute, int hour) {
        Calendar cal = Calendar.getInstance();
        cal.set(Calendar.YEAR, year);
        cal.set(Calendar.MONTH, month);
        cal.set(Calendar.DAY_OF_MONTH, day);
        cal.set(Calendar.MINUTE, minute);
        cal.set(Calendar.HOUR, hour);

        return new Timestamp(cal.getTimeInMillis());
    }
}
