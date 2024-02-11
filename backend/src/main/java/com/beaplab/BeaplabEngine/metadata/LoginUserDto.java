/*
 * Developed by Arastoo Bozorgi.
 * a.bozorgi67@gmail.com
 */

package com.beaplab.BeaplabEngine.metadata;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.io.Serializable;
import java.util.Date;
import java.util.UUID;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class LoginUserDto implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long id;
    @JsonProperty("user")
    private UserDto userDto;
    private Date date;
    private String passwordToken;


    /**
     * constructors
     */
    public LoginUserDto() {
    }

    public LoginUserDto(Long id, UserDto userDto, Date date, String passwordToken) {
        this.id = id;
        this.userDto = userDto;
        this.date = date;
        this.passwordToken = passwordToken;
    }



    /**
     * getter and setter methods
     */
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

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public String getPasswordToken() {
        return passwordToken;
    }

    public void setPasswordToken(String passwordToken) {
        this.passwordToken = passwordToken;
    }

    @Override
    public String toString() {
        return "LoginUserDto{" +
                "id=" + id +
                ", userDto=" + userDto +
                ", date=" + date +
                ", passwordToken='" + passwordToken + '\'' +
                '}';
    }
}
