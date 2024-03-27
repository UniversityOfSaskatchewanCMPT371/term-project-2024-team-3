/*
 * Developed by Arastoo Bozorgi.
 * a.bozorgi67@gmail.com
 */

package com.beaplab.BeaplabEngine.util;

import java.io.*;
import java.sql.ResultSet;
import java.sql.SQLException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.beaplab.BeaplabEngine.constants.BeapEngineConstants;
// import com.beaplab.BeaplabEngine.controller.AppleWatchController;
import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;
import org.springframework.stereotype.Component;

@Component("downloadUtil")
public class DownloadUtil {

	final static Logger logger = LogManager.getLogger(DownloadUtil.class.getName());

	/**** Method #1 - This Method Is Used To Retrieve The File Path From The Server ****/
	public String getFilePath(HttpServletRequest req) throws FileNotFoundException {

		logger.info("in DownloadUtil/getFilePath method");

		String appPath = "", fullPath = "", downloadPath = "downloads";

		/**** Retrieve The Absolute Path Of The Application ****/
		appPath = req.getSession(false).getServletContext().getRealPath("");
		fullPath = appPath + File.separator + downloadPath;
		logger.info("Destination Location For The File Is?= " + fullPath);
		return fullPath;
	}

	/**** Method #2 - This Method Is Used To Get The No. Of Columns In The ResultSet ****/
	public static int getColumnCount(ResultSet res) throws SQLException {
		logger.info("in DownloadUtil/getColumnCount method");

		int totalColumns = res.getMetaData().getColumnCount();		
		return totalColumns;
	}

	/**** Method #3 - This Method Is Used To Set The Download File Properties ****/
	public void downloadFileProperties(HttpServletRequest req,HttpServletResponse resp, String toBeDownloadedFile, File downloadFile) {

		logger.info("in DownloadUtil/downloadFileProperties method");

		try {

			/**** Get The Mime Type Of The File & Setting The Binary Type If The Mime Mapping Is Not Found ****/
			String mimeType = req.getSession(false).getServletContext().getMimeType(toBeDownloadedFile);
			if (mimeType == null) {
				mimeType = "application/octet-stream";
			}

			/**** Setting The Content Attributes For The Response Object ****/
			resp.setContentType(mimeType);
			resp.setContentLength((int) downloadFile.length());

			/**** Setting The Headers For The Response Object ****/
			String headerKey = "Content-Disposition";
			String headerValue = String.format("attachment; filename=\"%s\"", downloadFile.getName());
			resp.setHeader(headerKey, headerValue);

			/**** Get The Output Stream Of The Response ****/
			OutputStream outStream = resp.getOutputStream();
			FileInputStream inputStream = new FileInputStream(downloadFile);
			byte[] buffer = new byte[(int) downloadFile.length()];
			int bytesRead = -1;

			/**** Write Each Byte Of Data Read From The Input Stream Write Each Byte Of Data  Read From The Input Stream Into The Output Stream ****/
			while ((bytesRead = inputStream.read(buffer)) != -1) {
				outStream.write(buffer, 0, bytesRead);
			}

			inputStream.close();
			outStream.close();
		} catch(IOException ioExObj) {
			logger.error("Exception While Performing The I/O Operation?= " + ioExObj);
		}
	}


	public File downloadZip(String filePath) {
		logger.info("in DownloadUtil/downloadZip");

		File downloadFile = new File(filePath);
		if (!downloadFile.exists()) {
			downloadFile = null;
		}
		return downloadFile;
	}


	public String cleanup(String data_path) {

		logger.info("in DownloadUtil/cleanup");
		String out = BeapEngineConstants.SUCCESS_STR;

		// delete all the files inside output directory
		File output_folder = new File(data_path + File.separator + "output");
		File[] listOfFiles_output = output_folder.listFiles();
		for (File file: listOfFiles_output) {
			file.delete();
		}

		// delete all the files inside data directory
		File data_folder = new File(data_path + File.separator);
		File[] listOfFiles_data = data_folder.listFiles();
		for (File file: listOfFiles_data) {
			if (file.isFile()) {
				file.delete();
			}
		}

		// delete all the files inside raw directory, then delete raw directory
		File raw_folder = new File(data_path + File.separator + BeapEngineConstants.RAW_DIR);
		if (raw_folder.exists()) {
			File[] listOfFiles_raw = raw_folder.listFiles();
			for (File file : listOfFiles_raw) {
				file.delete();
			}
			// delete the raw directory itself
			raw_folder.delete();
		}


		return out;
	}
}