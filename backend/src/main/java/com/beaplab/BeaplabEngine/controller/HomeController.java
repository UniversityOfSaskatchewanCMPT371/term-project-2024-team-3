/*
 * Developed by Arastoo Bozorgi.
 * a.bozorgi67@gmail.com
 */

package com.beaplab.BeaplabEngine.controller;

import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

@Controller
public class HomeController {

    final static Logger logger = LogManager.getLogger(HomeController.class.getName());

//    @RequestMapping("/")
//    public String index() {
//        logger.info("in HomeController");
//
//        return "Greetings from BEAPLab Engine!";
//    }

    @RequestMapping(value = "/", method = RequestMethod.GET)
    public ModelAndView handleRequest() throws Exception {
        logger.info("in HomeController");

        String message = "This message is returned from HomeController.";
        ModelAndView model = new ModelAndView("Index");
        model.addObject("message", message);
        return model;
    }


}
