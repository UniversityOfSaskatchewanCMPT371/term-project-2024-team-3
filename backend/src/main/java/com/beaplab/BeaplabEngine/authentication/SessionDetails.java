/*
 * Developed by Arastoo Bozorgi.
 * a.bozorgi67@gmail.com
 */

package com.beaplab.BeaplabEngine.authentication;

import org.springframework.security.core.Authentication;

import java.io.Serializable;

public class SessionDetails implements Serializable {

    private static final long serialVersionUID = 8850489178248613501L;

    private String accessType;
    private Authentication authToken;
    private Long userId;


    /**
     * constructors
     */
    public SessionDetails() {
    }

    public SessionDetails(String accessType, Authentication authToken, Long userId) {
        this.accessType = accessType;
        this.authToken = authToken;
        this.userId = userId;
    }


    /**
     * getter and setter methods
     * @return
     */
    public String getAccessType() {
        return this.accessType;
    }

    public void setAccessType(String accessType) {
        this.accessType = accessType;
    }

    public Authentication getAuthToken() {
        return authToken;
    }

    public void setAuthToken(Authentication authToken) {
        this.authToken = authToken;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }
}
