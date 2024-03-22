package utils;

import com.beaplab.BeaplabEngine.util.Util;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.runners.MockitoJUnitRunner;

import java.sql.Timestamp;
import java.util.Calendar;
import java.util.Date;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

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

    @Test
    /*
     * Preconditions: None, as the method does not take any arguments
     * Post-conditions: The method should return a Timestamp object representing the current time
     */
    public void testGetCurrentTimeStamp() {
        // Get the current timestamp before calling the method
        Timestamp before = new Timestamp(new Date().getTime());

        // Call the method to get the current timestamp
        Timestamp result = util.getCurrentTimeStamp();

        // Get the current timestamp after calling the method
        Timestamp after = new Timestamp(new Date().getTime());

        // Check if the result is within the range
        assertTrue(result.compareTo(before) >= 0 && result.compareTo(after) <= 0);

        // Additional check to make the test more comprehensive:
        // Check if the result is within a reasonable time of the current time (e.g., within 1 second)
        long diff = after.getTime() - result.getTime();
        assertTrue(diff >= 0 && diff < 1000);
    }




}
