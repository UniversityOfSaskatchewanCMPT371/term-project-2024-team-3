/*
 * Developed by Arastoo Bozorgi.
 * a.bozorgi67@gmail.com
 */

package com.beaplab.BeaplabEngine.constants;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;

public final class BeapEngineConstants {


    protected BeapEngineConstants(){};
    /**
     * Types of tokens
     */
    public static final String ACCOUNT_ACTIVATION = "accountActivation";
    public static final String PASSWORD_RESET     = "passwordReset";
    public static final String EMAIL_CHANGE       = "emailChange";
    public static final int TOKEN_EXPIRY_TIME_IN_MINS = 60 * 24;


    public static final int SPRING_SERVLET_STARTUP = 1;
    public static final String AUTH_TOKEN = "token";
    public static final String SUCCESS_STR = "success";
    public static final String ERROR_STR = "error";
    public static final String OUTPUT_ZIP = "output.zip";
    public static final String RAW_DIR = "raw";
    public static final String AUTH_INTERCEPTOR_PATTERN = "/rest/v1/**";
    public static final String REQUEST_MAPPING_PATTERN = "/rest/beapengine/*";
    public static final String R_REPOSITORY_URL = "./R";
    public static final String ARCHIVE_DIR = "Archive";
    public static final String MODELS_DIR = "SavedModels";
}
