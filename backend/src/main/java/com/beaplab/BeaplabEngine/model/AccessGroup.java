/*
 * Developed by Arastoo Bozorgi.
 * a.bozorgi67@gmail.com
 */

package com.beaplab.BeaplabEngine.model;

import org.hibernate.Hibernate;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.util.Date;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "tbl_access_group")
public class AccessGroup {

    /**
     * attributes
     */
//    @Id
//    @GeneratedValue(generator = "uuid")
//    @GenericGenerator(name = "uuid", strategy = "uuid2")
//    @Column(name = "id", unique = true)
//    private UUID id;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    @Column(name = "id", updatable = false, nullable = false)
    private Long id;

    @Column(name = "description")
    private String description;

    @Column(name = "access_group_name")
    private String accessGroupName;

    @Column(name = "created_date")
    private Date createdDate;

    @Column(name = "last_modified_date")
    private Date lastModifiedDate;



    /**
     * constructors
     */
    public AccessGroup() {
    }

    public AccessGroup(String description, String accessGroupName, Date createdDate, Date lastModifiedDate) {
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
