/*
 * Developed by Arastoo Bozorgi.
 * a.bozorgi67@gmail.com
 */

package com.beaplab.BeaplabEngine.util;

import com.beaplab.BeaplabEngine.constants.BeapEngineConstants;
import com.beaplab.BeaplabEngine.controller.AppleWatchController;
import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;
import org.springframework.stereotype.Component;

import java.io.File;
import java.io.IOException;
import java.nio.file.CopyOption;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import java.util.Date;
import java.util.UUID;

@Component("archiveUtil")
public class ArchiveUtil {
    final static Logger logger = LogManager.getLogger(ArchiveUtil.class.getName());

    public String archive(String filepath, String sessionID) {

        logger.info("in ArchiveUtil/archive");
        String out = BeapEngineConstants.SUCCESS_STR;

        // generate a unique name as the archived file name containing the combination of user's sessionID and
        // current time. The name is like: {sessionID}@{currentUnixTime}
        String currentTime = String.valueOf((System.currentTimeMillis() / 1000L));
//        String uniqueID = UUID.randomUUID().toString();
        String uniqueName = sessionID + "@" + currentTime;

        String newFileName = BeapEngineConstants.R_REPOSITORY_URL + File.separator +  BeapEngineConstants.ARCHIVE_DIR + File.separator + uniqueName + ".zip";

        File srcFile = new File(filepath + BeapEngineConstants.OUTPUT_ZIP);
        File destFile = new File(newFileName);

        if (srcFile.exists()) {
            try {
                // copy the output zip file into archive path with the unique name
                Files.copy(srcFile.toPath(), destFile.toPath(), StandardCopyOption.REPLACE_EXISTING);
            } catch (IOException e) {
                out = BeapEngineConstants.ERROR_STR;
                e.printStackTrace();
            }
        }

        return out;

    }

}
