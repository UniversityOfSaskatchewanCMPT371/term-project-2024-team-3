/*
 * Developed by Arastoo Bozorgi.
 * a.bozorgi67@gmail.com
 */

package com.beaplab.BeaplabEngine.interceptor;

import com.beaplab.BeaplabEngine.authentication.SessionDetails;
import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.session.ExpiringSession;
import org.springframework.session.FindByIndexNameSessionRepository;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.util.Collection;

/**
 * this interceptor handles all rest requests
 */
public class AuthInterceptor implements HandlerInterceptor {

    final static Logger logger = LogManager.getLogger(AuthInterceptor.class.getName());


    /**
     * injecting FindByIndexNameSessionRepository into this class
     */
    @Autowired
    FindByIndexNameSessionRepository<? extends ExpiringSession> sessions;


    @Override
    public boolean preHandle(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, Object handler) throws Exception {

        logger.info("in AuthInterceptor: preHandle");

        HttpSession session = httpServletRequest.getSession(false);

        if(session==null || !httpServletRequest.isRequestedSessionIdValid() ||
                session.getAttribute(FindByIndexNameSessionRepository.PRINCIPAL_NAME_INDEX_NAME) == null) {   // invalid session
            logger.info("invalid session");

            httpServletResponse.sendError(HttpServletResponse.SC_UNAUTHORIZED, "UnAuthorized access, Login Required");
            return false;
        }
        else {   // valid session
            logger.info("valid session");

            /**
             * extracting username from httpServletRequest session
             */
            String username = session.getAttribute(FindByIndexNameSessionRepository.PRINCIPAL_NAME_INDEX_NAME).toString();

            /**
             * searching for extracted username in Redis session repository
             */
            Collection<? extends ExpiringSession> usersSessions = sessions
                    .findByIndexNameAndIndexValue(
                            FindByIndexNameSessionRepository.PRINCIPAL_NAME_INDEX_NAME,
                            username)
                    .values();

            if (!usersSessions.isEmpty()){  // valid username for the session
                logger.info("A valid session exists for username: " + username);

                // set the sessio timeout to 30 Min
                session.setMaxInactiveInterval(30 * 60);

                SessionDetails sessionDetails = (SessionDetails) session.getAttribute("SESSION_DETAILS");
//                System.out.println("sessionDetails.getAuthToken(): " + sessionDetails.getAuthToken());
                SecurityContextHolder.getContext().setAuthentication(sessionDetails.getAuthToken());

                return true;
            }
            else { // invalid username for the session
                logger.info("A valid session doesn't exists for username: " + username);
                httpServletResponse.sendError(HttpServletResponse.SC_NON_AUTHORITATIVE_INFORMATION, "No valid session found for username.");
                return false;
            }
        }
    }

    @Override
    public void postHandle(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, Object handler, ModelAndView modelAndView) throws Exception {
        logger.info("in AuthInterceptor: postHandle");


    }

    @Override
    public void afterCompletion(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, Object o, Exception e) throws Exception {

    }

}
