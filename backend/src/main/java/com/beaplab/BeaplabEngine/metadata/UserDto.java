/*
 * Developed by Arastoo Bozorgi.
 * a.bozorgi67@gmail.com
 */

package com.beaplab.BeaplabEngine.metadata;

import com.beaplab.BeaplabEngine.model.RawData;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.io.Serializable;
import java.util.Set;
import java.util.UUID;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class UserDto implements Serializable {

    private static final long serialVersionUID = 1L;


    /**
     * attributes
     */
    private Long id;
    private String firstName;
    private String lastName;
    @JsonProperty("accessGroup")
    private Set<AccessGroupDto> accessGroupIDs;
    @JsonProperty("role")
    private Set<RoleDto> roleDtoIDs;
    @JsonProperty("rawData")
    private Set<RawDataDto> rawDataIDs;
    private String username;
    private String password;



    /**
     * constructors
     */
    public UserDto() {
    }

    public UserDto(Long id, String firstName, String lastName, Set<AccessGroupDto> accessGroupIDs, Set<RoleDto> roleDtoIDs, Set<RawDataDto> rawDataIDs, String username, String password) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.accessGroupIDs = accessGroupIDs;
        this.roleDtoIDs = roleDtoIDs;
        this.rawDataIDs = rawDataIDs;
        this.username = username;
        this.password = password;
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

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public Set<AccessGroupDto> getAccessGroupIDs() {
        return accessGroupIDs;
    }

    public void setAccessGroupIDs(Set<AccessGroupDto> accessGroupIDs) {
        this.accessGroupIDs = accessGroupIDs;
    }

    public Set<RoleDto> getRoleDtoIDs() {
        return roleDtoIDs;
    }

    public void setRoleDtoIDs(Set<RoleDto> roleDtoIDs) {
        this.roleDtoIDs = roleDtoIDs;
    }

    public Set<RawDataDto> getRawDataIDs() {
        return rawDataIDs;
    }

    public void setRawDataIDs(Set<RawDataDto> rawDataIDs) {
        this.rawDataIDs = rawDataIDs;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    @Override
    public String toString() {
        return "UserDto{" +
                "id=" + id +
                ", firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", accessGroupIDs=" + accessGroupIDs +
                ", roleDtoIDs=" + roleDtoIDs +
                ", rawDataIDs=" + rawDataIDs +
                ", username='" + username + '\'' +
                ", password='" + password + '\'' +
                '}';
    }
}
