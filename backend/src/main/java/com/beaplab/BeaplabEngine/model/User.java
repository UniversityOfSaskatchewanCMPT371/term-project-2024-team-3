/*
 * Developed by Arastoo Bozorgi.
 * a.bozorgi67@gmail.com
 */

package com.beaplab.BeaplabEngine.model;

import org.hibernate.Hibernate;
import org.hibernate.annotations.ColumnTransformer;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Type;

import javax.persistence.*;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "tbl_user")
public class User {


    /**
     * attributes
     */
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    @Column(name = "id", updatable = false, nullable = false)
    private Long id;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    @OneToMany
    @Column(name = "access_group_ids")
    private Set<AccessGroup> accessGroupIDs;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinColumn(name = "role_ids", nullable = true)
    private Set<Role> roleIDs;

    @OneToMany
    @Column(name = "raw_data_ids")
    private Set<RawData> rawDataIDs;

    @Column(name = "username")
    private String username;

    @ColumnTransformer(
            write = "crypt(?, gen_salt('md5'))"
    )
    @Column
    private String password;



    /**
     * constructors
     */
    public User() {
    }

    public User(String firstName, String lastName, Set<AccessGroup> accessGroupIDs, Set<Role> roleIDs, Set<RawData> rawDataIDs, String username, String password) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.accessGroupIDs = accessGroupIDs;
        this.roleIDs = roleIDs;
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

    public Set<AccessGroup> getAccessGroupIDs() {
        return accessGroupIDs;
    }

    public void setAccessGroupIDs(Set<AccessGroup> accessGroupIDs) {
        this.accessGroupIDs = accessGroupIDs;
    }

    public Set<Role> getRoleIDs() {
        return roleIDs;
    }

    public void setRoleIDs(Set<Role> roleIDs) {
        this.roleIDs = roleIDs;
    }

    public Set<RawData> getRawDataIDs() {
        return rawDataIDs;
    }

    public void setRawDataIDs(Set<RawData> rawDataIDs) {
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

    /**
     * check to see whether accessGroupIDs is loaded or not (for Lazy fetchType)
     * @return
     */
    public boolean isAccesGroupIDsLoaded() {
        return  Hibernate.isInitialized(this.accessGroupIDs) && this.accessGroupIDs != null;
    }


    /**
     * check to see whether roleIDs is loaded or not (for Lazy fetchType)
     * @return
     */
    public boolean isRoleIDsLoaded() {
        return  Hibernate.isInitialized(this.roleIDs) && this.roleIDs != null;
    }


    /**
     * check to see whether roleIDs is loaded or not (for Lazy fetchType)
     * @return
     */
    public boolean isRawDataIDsLoaded() {
        return  Hibernate.isInitialized(this.rawDataIDs) && this.rawDataIDs != null;
    }


    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", accessGroupIDs=" + accessGroupIDs +
                ", roleIDs=" + roleIDs +
                ", rawDataIDs=" + rawDataIDs +
                ", username='" + username + '\'' +
                ", password='" + password + '\'' +
                '}';
    }
}
