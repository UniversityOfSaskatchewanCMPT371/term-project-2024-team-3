package utils;

import com.beaplab.BeaplabEngine.metadata.*;
import com.beaplab.BeaplabEngine.model.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.sql.Timestamp;
import java.util.*;

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

    public static RawDataDto mockRawDataDto(RawData.dataType watchType) {
        Calendar cal = Calendar.getInstance();
        cal.set(Calendar.YEAR, 2023);
        cal.set(Calendar.MONTH, Calendar.JANUARY);
        cal.set(Calendar.DAY_OF_MONTH, 11);

        return new RawDataDto(
                1L,
                new byte[]{0x01, 0x02, 0x03},
                watchType,
                1L,
                new Timestamp(cal.getTimeInMillis())
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

    public static AccessGroupDto mockAccessGroupDto() {
        Calendar cal = Calendar.getInstance();
        cal.set(Calendar.YEAR, 2023);
        cal.set(Calendar.MONTH, Calendar.JANUARY);
        cal.set(Calendar.DAY_OF_MONTH, 11);

        return new AccessGroupDto(
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

    public static RoleDto mockRoleDto() {
        return new RoleDto(
                "ROLE_USER",
                "User role"
        );
    }

    public static User mockUser() {
        Set<AccessGroup> accessGroups = new HashSet<>();
        accessGroups.add(mockAccessGroup());

        Set<Role> roles = new HashSet<>();
        roles.add(mockRole());

        Set<RawData> rawData = new HashSet<>();
        rawData.add(mockRawData(RawData.dataType.FitBit));
        return new User(
                "Michael",
                "Scott",
                accessGroups,
                roles,
                rawData,
                "PrisonMikeForTwenty",
                "password123"
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

    public static UserDto mockUserDto() {
        Set<AccessGroupDto> accessGroups = new HashSet<>();
        accessGroups.add(mockAccessGroupDto());

        Set<RoleDto> roles = new HashSet<>();
        roles.add(mockRoleDto());

        Set<RawDataDto> rawData = new HashSet<>();
        rawData.add(mockRawDataDto(RawData.dataType.FitBit));
        return new UserDto(
                1L,
                "Michael",
                "Scott",
                accessGroups,
                roles,
                rawData,
                "PrisonMikeForTwenty",
                "password123"
        );
    }

    public static List<GrantedAuthority> mockAuthorities(Set<Role> roles) {
        List<GrantedAuthority> authorities = new ArrayList<>();
        for (Role role : roles) {
            authorities.add(new SimpleGrantedAuthority(role.getRoleName()));
        }
        return authorities;
    }

    public static UserDetails mockUserDetails(User user) {
        boolean enabled = true;
        boolean accountNonExpired = true;
        boolean credentialsNonExpired = true;
        boolean accountNonLocked = true;
        return  new org.springframework.security.core.userdetails.User
                (
                        user.getUsername(),
                        user.getPassword().toLowerCase(),
                        enabled,
                        accountNonExpired,
                        credentialsNonExpired,
                        accountNonLocked,
                        mockAuthorities(user.getRoleIDs())
                );
    }

    public static IncorrectLoginsDto mockIncorrectLoginsDto(
            UserDto userDto,
            boolean isLocked,
            int attemptsIncorrect,
            Timestamp lockedDate
    ) {
        return new IncorrectLoginsDto(
                1L,
                userDto,
                isLocked,
                attemptsIncorrect,
                lockedDate
        );
    }

    public static IncorrectLogins mockIncorrectLogins(
            User user,
            boolean locked,
            Timestamp lockedDate,
            int incorrectAttempts
    ){
        return new IncorrectLogins(
                user,
                locked,
                lockedDate,
                incorrectAttempts
        );
    }


}
