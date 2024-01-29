/*
 * Developed by Arastoo Bozorgi.
 * a.bozorgi67@gmail.com
 */

package com.beaplab.BeaplabEngine.metadata;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.io.Serializable;
import java.util.Date;
import java.util.Set;
import java.util.UUID;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class AccessGroupDto implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * attributes
     */
    private Long id;
    private String description;
    private String accessGroupName;
    private Date createdDate;
    private Date lastModifiedDate;



    /**
     * constructors
     */
    public AccessGroupDto() {
    }

    public AccessGroupDto(String description, String accessGroupName, Date createdDate, Date lastModifiedDate) {
        this.description = description;
        this.accessGroupName = accessGroupName;
        this.createdDate = createdDate;
        this.lastModifiedDate = lastModifiedDate;
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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getAccessGroupName() {
        return accessGroupName;
    }

    public void setAccessGroupName(String accessGroupName) {
        this.accessGroupName = accessGroupName;
    }

    public Date getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(Date createdDate) {
        this.createdDate = createdDate;
    }

    public Date getLastModifiedDate() {
        return lastModifiedDate;
    }

    public void setLastModifiedDate(Date lastModifiedDate) {
        this.lastModifiedDate = lastModifiedDate;
    }

    @Override
    public String toString() {
        return "AccessGroup{" +
                "id=" + id +
                ", description='" + description + '\'' +
                ", accessGroupName='" + accessGroupName + '\'' +
                ", createdDate=" + createdDate +
                ", lastModifiedDate=" + lastModifiedDate +
                '}';
    }
}
