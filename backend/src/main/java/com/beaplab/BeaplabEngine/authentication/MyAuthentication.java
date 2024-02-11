/*
 * Developed by Arastoo Bozorgi.
 * a.bozorgi67@gmail.com
 */

package com.beaplab.BeaplabEngine.authentication;

import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.session.FindByIndexNameSessionRepository;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpSession;

@Component("myAuthentication")
public class MyAuthentication {

    final static Logger logger = LogManager.getLogger(MyAuthentication.class.getName());


    /**
     * authenticate a valid user: creating Authentication token and setting required session attributes (the session is saved in Redis)
     * @param userDetails
     * @param session
     * @param remoteAddr
     * @param accessType
     */
    public String authenticate(UserDetails userDetails, HttpSession session, String remoteAddr, String accessType,
                               Long userId){

        logger.info("in MyAuthentication: authenticate");

        Authentication authToken = new UsernamePasswordAuthenticationToken(userDetails.getUsername(), userDetails.getPassword(), userDetails.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(authToken);

        SessionDetails sessionDetails = new SessionDetails(accessType, authToken, userId);

        session.setAttribute(FindByIndexNameSessionRepository.PRINCIPAL_NAME_INDEX_NAME, userDetails.getUsername());
        session.setAttribute("SESSION_DETAILS", sessionDetails);
        return session.getId();
    }


    /**
     * invalidate the current session which removes the session from the redis server and clear SecurityContextHolder including Authentication token.
     * @param session
     */
    public void logout(HttpSession session){

        logger.info("in MyAuthentication: logout");

        SecurityContextHolder.clearContext();
        if (session != null) {
            session.invalidate();
        }
    }


   }
