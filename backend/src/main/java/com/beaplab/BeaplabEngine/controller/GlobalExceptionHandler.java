/*
 * Developed by Arastoo Bozorgi.
 * a.bozorgi67@gmail.com
 */

package com.beaplab.BeaplabEngine.controller;

import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.multipart.MultipartException;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@ControllerAdvice
public class GlobalExceptionHandler {

    //StandardServletMultipartResolver
    @ExceptionHandler(MultipartException.class)
    public String handleError1(MultipartException e, RedirectAttributes redirectAttributes) {

        redirectAttributes.addFlashAttribute("message", e.getCause().getMessage());
        return "redirect:/uploadStatus";

    }

    //CommonsMultipartResolver
    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ModelAndView handleMaxSizeException(
            MaxUploadSizeExceededException exc,
            HttpServletRequest request,
            HttpServletResponse response) {

        ModelAndView modelAndView = new ModelAndView("upload_error");
        modelAndView.addObject("message", "File too large! Max Upload size is 50MB");
        return modelAndView;
    }
}
