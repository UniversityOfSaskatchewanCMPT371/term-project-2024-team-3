/*
 * Developed by Arastoo Bozorgi.
 * a.bozorgi67@gmail.com
 */

package com.beaplab.BeaplabEngine.util;

import com.beaplab.BeaplabEngine.constants.BeapEngineConstants;
import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;
import org.springframework.stereotype.Component;

import java.io.*;
import java.util.ArrayList;
import java.util.List;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;
import java.util.zip.ZipOutputStream;

@Component("zipUtil")
public class ZipUtil {

    final static Logger logger = LogManager.getLogger(ZipUtil.class.getName());

    public String zip(String output_path) {

        logger.info("in ZipUtil/zip");

        String out = "";

        // get the list of files generated in output_path
        File folder = new File(output_path);
        File[] listOfFiles = folder.listFiles();
        List<String> fileNames = new ArrayList<String>();
        for (File file: listOfFiles)
            fileNames.add(file.getName());

        // zip the generated files
        FileOutputStream fos = null;
        ZipOutputStream zipOut = null;
        try {
            fos = new FileOutputStream(output_path + BeapEngineConstants.OUTPUT_ZIP);
            zipOut = new ZipOutputStream(fos);
            for (File outFile : listOfFiles) {


                if (outFile.isFile() && outFile.getName() != BeapEngineConstants.OUTPUT_ZIP) {
                    System.out.println("outFile.getName(): " + outFile.getName());

                    FileInputStream fis = new FileInputStream(outFile);
                    ZipEntry zipEntry = new ZipEntry(outFile.getName());
                    zipOut.putNextEntry(zipEntry);

                    byte[] bytes = new byte[(int) outFile.length()];
                    int length;
                    while((length = fis.read(bytes)) >= 0) {
                        zipOut.write(bytes, 0, length);
                    }
                    fis.close();
                }
            }
            zipOut.close();
            fos.close();
            out = output_path + BeapEngineConstants.OUTPUT_ZIP;

        } catch (FileNotFoundException e) {
            e.printStackTrace();
            out = BeapEngineConstants.ERROR_STR + ": " + e.getMessage();
        } catch (IOException e) {
            e.printStackTrace();
            out = BeapEngineConstants.ERROR_STR + ": " + e.getMessage();
        }

        return out;

    }


    public String zip1(String output_path, String zipDirPath, String userId) {

        logger.info("in ZipUtil/zip");

        String out = "";
        String zipFileName = zipDirPath + userId + ".zip";

        // get the list of files generated in output_path
        File folder = new File(output_path);
        File[] listOfFiles = folder.listFiles();

        // zip the generated files
        FileOutputStream fos = null;
        ZipOutputStream zipOut = null;
        try {
            // the output zip file is named as userId.zip
            fos = new FileOutputStream(zipFileName);
            zipOut = new ZipOutputStream(fos);
            for (File outFile : listOfFiles) {


                if (outFile.isFile()) {

                    FileInputStream fis = new FileInputStream(outFile);
                    ZipEntry zipEntry = new ZipEntry(outFile.getName());
                    zipOut.putNextEntry(zipEntry);

                    byte[] bytes = new byte[(int) outFile.length()];
                    int length;
                    while((length = fis.read(bytes)) >= 0) {
                        zipOut.write(bytes, 0, length);
                    }
                    fis.close();
                }
            }
            zipOut.close();
            fos.close();
            out = zipFileName;

        } catch (FileNotFoundException e) {
            e.printStackTrace();
            out = BeapEngineConstants.ERROR_STR + ": " + e.getMessage();
        } catch (IOException e) {
            e.printStackTrace();
            out = BeapEngineConstants.ERROR_STR + ": " + e.getMessage();
        }

        return out;

    }


    public boolean unzip(String zipFilePath, String destDir) {
        logger.info("in ZipUtil/unzip");

        String result = "";

        File dir = new File(destDir);
        // create output directory if it doesn't exist
        if(!dir.exists()) dir.mkdirs();
        FileInputStream fis;
        //buffer for read and write data to file
        byte[] buffer = new byte[1024];
        try {
            fis = new FileInputStream(zipFilePath);
            ZipInputStream zis = new ZipInputStream(fis);
            ZipEntry ze = zis.getNextEntry();
            while(ze != null){
                String fileName = ze.getName();
                File newFile = new File(destDir + File.separator + fileName);
                logger.info("Unzipping to "+ newFile.getAbsolutePath());
                //create directories for sub directories in zip
                new File(newFile.getParent()).mkdirs();
                if (!newFile.getAbsolutePath().contains("__MACOSX")) {
                    FileOutputStream fos = new FileOutputStream(newFile);
                    int len;
                    while ((len = zis.read(buffer)) > 0) {
                        fos.write(buffer, 0, len);
                    }
                    fos.close();
                }
                //close this ZipEntry
                zis.closeEntry();
                ze = zis.getNextEntry();
            }
            //close last ZipEntry
            zis.closeEntry();
            zis.close();
            fis.close();

        } catch (IOException e) {
            e.printStackTrace();
            return false;
        }

        return true;
    }

}
