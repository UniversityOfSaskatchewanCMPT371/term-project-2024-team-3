/*
 * Developed by Arastoo Bozorgi.
 * a.bozorgi67@gmail.com
 */

package com.beaplab.BeaplabEngine.metadata;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.io.Serializable;
import java.util.UUID;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class RoleDto implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * attributes
     */
    private Long id;
    private String roleName;
    private String description;


    /**
     * constructors
     */
    public RoleDto() {
    }

    public RoleDto(String roleName, String description) {
        this.roleName = roleName;
        this.description = description;
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

    public String getRoleName() {
        return roleName;
    }

    public void setRoleName(String roleName) {
        this.roleName = roleName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }


    @Override
    public String toString() {
        return "Role{" +
                "id=" + id +
                ", roleName='" + roleName + '\'' +
                ", description='" + description + '\'' +
                '}';
    }
}
