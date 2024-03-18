package utils;

import com.beaplab.BeaplabEngine.util.Util;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.runners.MockitoJUnitRunner;

import java.util.Calendar;
import java.util.Date;

import static org.junit.Assert.assertEquals;

@RunWith(MockitoJUnitRunner.class)
public class UtilTest {

    @InjectMocks
    private Util util;
    @Test
    //T4.87
    // Preconditions: Start date is before end date
    // Post-conditions: Returns the correct difference in hours
    public void testDateDifference() {
        Date startDate = new Date(2024, Calendar.MARCH, 12, 10, 0, 0); // March 12, 2024, 10:00:00
        Date endDate = new Date(2024, Calendar.MARCH, 12, 14, 0, 0);   // March 12, 2024, 14:00:00

        long expectedDifference = 4;

        long difference = util.dateDifference(startDate, endDate);

        assertEquals(expectedDifference, difference);
    }

    @Test
    //T4.88
    // Preconditions: Start date is after end date
    // Post-conditions: Returns -4 as difference
    public void testDateDifferenceStartDateAfterEndDate() {
        Date startDate = new Date(2024, Calendar.MARCH, 12, 14, 0, 0); // March 12, 2024, 14:00:00
        Date endDate = new Date(2024, Calendar.MARCH, 12, 10, 0, 0);   // March 12, 2024, 10:00:00

        long expectedDifference = -4;  // -4 hours

        long difference = util.dateDifference(startDate, endDate);

        assertEquals(expectedDifference, difference);
    }

    @Test
    //T4.89
    // Preconditions: Start date and end date are the same
    // Post-conditions: Returns 0 as difference
    public void testDateDifferenceSameStartDateAndEndDate() {
        Date startDate = new Date(2024, Calendar.MARCH, 12, 10, 0, 0); // March 12, 2024, 10:00:00
        Date endDate = new Date(2024, Calendar.MARCH, 12, 10, 0, 0);   // March 12, 2024, 10:00:00

        long expectedDifference = 0;

        long difference = util.dateDifference(startDate, endDate);

        assertEquals(expectedDifference, difference);
    }
}
