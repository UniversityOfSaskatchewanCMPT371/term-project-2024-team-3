package utils;

import com.beaplab.BeaplabEngine.model.AccessGroup;
import com.beaplab.BeaplabEngine.model.RawData;
import com.beaplab.BeaplabEngine.model.Role;
import com.beaplab.BeaplabEngine.model.User;

import java.sql.Timestamp;
import java.util.Calendar;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

public class MockFactory {
    public static RawData mockRawData(RawData.dataType watchType) {
        Calendar cal = Calendar.getInstance();
        cal.set(Calendar.YEAR, 2023);
        cal.set(Calendar.MONTH, Calendar.JANUARY);
        cal.set(Calendar.DAY_OF_MONTH, 11);

        return new RawData(
                1L,
                new byte[]{0x01, 0x02, 0x03},
                watchType,
                1L,
                new Timestamp(cal.getTimeInMillis()),
                "2023"
        );
    }

    public static AccessGroup mockAccessGroup() {
        Calendar cal = Calendar.getInstance();
        cal.set(Calendar.YEAR, 2023);
        cal.set(Calendar.MONTH, Calendar.JANUARY);
        cal.set(Calendar.DAY_OF_MONTH, 11);

        return new AccessGroup(
                "User",
                "USER",
                new Date(cal.getTimeInMillis()),
                new Date(cal.getTimeInMillis())
            );
    }

    public static Role mockRole() {
        return new Role(
                "ROLE_USER",
                "User role"
            );
    }

    public static User mockUser(
            String firstName,
            String lastName,
            String userName
    ) {
        Set<AccessGroup> accessGroups = new HashSet<>();
        accessGroups.add(mockAccessGroup());

        Set<Role> roles = new HashSet<>();
        roles.add(mockRole());

        Set<RawData> rawData = new HashSet<>();
        rawData.add(mockRawData(RawData.dataType.FitBit));
        return new User(
                firstName,
                lastName,
                accessGroups,
                roles,
                rawData,
                userName,
                "password123"
        );
    }
}
