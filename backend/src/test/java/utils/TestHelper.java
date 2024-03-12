package utils;

import java.sql.Timestamp;
import java.util.Calendar;

public class TestHelper {

    // month starts from 0, so january is 0
    public static Timestamp getTimestamp(int year, int month, int day) {
        Calendar cal = Calendar.getInstance();
        cal.set(Calendar.YEAR, year);
        cal.set(Calendar.MONTH, month);
        cal.set(Calendar.DAY_OF_MONTH, day);

        return new Timestamp(cal.getTimeInMillis());
    }
}
