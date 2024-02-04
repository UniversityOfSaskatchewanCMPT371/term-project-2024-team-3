/*
 * Developed by Arastoo Bozorgi.
 * a.bozorgi67@gmail.com
 */

package com.beaplab.BeaplabEngine.model;

import org.hibernate.Hibernate;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.util.Date;
import java.util.UUID;

@Entity
@Table(name = "tbl_login_user")
public class LoginUser {

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

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = true)
    private User user;

    @Column(name = "date")
    private Date date;

    @Column(name = "password_token")
    private String passwordToken;


    /**
     * constructors
     */
    public LoginUser() {
    }

    public LoginUser(User user, Date date, String passwordToken) {
        this.user = user;
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

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
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

    /**
     * check to see whether user is loaded or not (for Lazy fetchType)
     * @return
     */
    public boolean isUserLoaded() {
        return  Hibernate.isInitialized(this.user) && this.user != null;
    }


    @Override
    public String toString() {
        return "LoginUser{" +
                "id=" + id +
                ", user=" + user +
                ", date=" + date +
                ", passwordToken='" + passwordToken + '\'' +
                '}';
    }
}
