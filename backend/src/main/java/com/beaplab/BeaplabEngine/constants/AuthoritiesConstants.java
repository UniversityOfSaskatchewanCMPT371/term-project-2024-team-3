/*
 * Developed by Arastoo Bozorgi.
 * a.bozorgi67@gmail.com
 */

package com.beaplab.BeaplabEngine.constants;

import java.util.ArrayList;
import java.util.List;

public final class AuthoritiesConstants {

    protected AuthoritiesConstants(){}

    public static final String       ADMIN       = "ADMIN";
    public static final List<String> WEKA_ROLES  = new ArrayList<String>();

    static {
        WEKA_ROLES.add(ADMIN);
    }


}
