package com.beaplab.BeaplabEngine.model;

import org.hibernate.Hibernate;

import javax.persistence.*;
import java.sql.Timestamp;
import java.util.Date;

@Entity
@Table(name = "tbl_incorrect_logins")
public class IncorrectLogins {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    @Column(name = "id", updatable = false, nullable = false)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = true)
    private User user;

    @Column
    private boolean locked;

    @Column
    private java.sql.Timestamp lockedDate;

    @Column
    private int incorrectAttempts;

    public IncorrectLogins() {
    }

    public IncorrectLogins(User user, boolean locked, java.sql.Timestamp lockedDate, int incorrectAttempts) {
        this.user = user;
        this.locked = locked;
        this.lockedDate = lockedDate;
        this.incorrectAttempts = incorrectAttempts;
    }

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

    /**
     * check to see whether user is loaded or not (for Lazy fetchType)
     * @return
     */
    public boolean isUserLoaded() {
        return  Hibernate.isInitialized(this.user) && this.user != null;
    }


    @Override
    public String toString() {
        return "IncorrectLogins{" +
                "id=" + id +
                ", user=" + user +
                ", locked=" + locked +
                ", lockedDate=" + lockedDate +
                ", incorrectAttempts=" + incorrectAttempts +
                '}';
    }
}
