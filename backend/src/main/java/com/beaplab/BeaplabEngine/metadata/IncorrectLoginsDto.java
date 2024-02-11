package com.beaplab.BeaplabEngine.metadata;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.io.Serializable;
import java.sql.Timestamp;
import java.util.Date;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class IncorrectLoginsDto  implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long id;
    @JsonProperty("user")
    private UserDto userDto;
    private boolean locked;
    private int incorrectAttempts;
    private java.sql.Timestamp lockedDate;


    public IncorrectLoginsDto() {
    }

    public IncorrectLoginsDto(Long id, UserDto userDto, boolean locked, int incorrectAttempts, java.sql.Timestamp lockedDate) {
        this.id = id;
        this.userDto = userDto;
        this.locked = locked;
        this.incorrectAttempts = incorrectAttempts;
        this.lockedDate = lockedDate;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public UserDto getUserDto() {
        return userDto;
    }

    public void setUserDto(UserDto userDto) {
        this.userDto = userDto;
    }

    public boolean getLocked() {
        return locked;
    }

    public void setLocked(boolean locked) {
        this.locked = locked;
    }

    public int getIncorrectAttempts() {
        return incorrectAttempts;
    }

    public void setIncorrectAttempts(int incorrectAttempts) {
        this.incorrectAttempts = incorrectAttempts;
    }

    public Timestamp getLockedDate() {
        return lockedDate;
    }

    public void setLockedDate(Timestamp lockedDate) {
        this.lockedDate = lockedDate;
    }

    @Override
    public String toString() {
        return "IncorrectLoginsDto{" +
                "id=" + id +
                ", userDto=" + userDto +
                ", locked=" + locked +
                ", incorrectAttempts=" + incorrectAttempts +
                ", lockedDate=" + lockedDate +
                '}';
    }
}
