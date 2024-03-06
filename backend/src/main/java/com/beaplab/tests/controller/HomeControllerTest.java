package com.beaplab.tests.controller;

import org.testng.annotations.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.web.servlet.ModelAndView;

import com.beaplab.BeaplabEngine.controller.HomeController;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

@SpringBootTest
class HomeControllerTest {

    @InjectMocks
    HomeController homeController;

    @Mock
    org.apache.log4j.Logger logger;

    @Test
    void testHandleRequest() throws Exception {
        MockitoAnnotations.initMocks(this);

        // Mocking behavior
        String expectedMessage = "This message is returned from HomeController.";
        ModelAndView expectedModelAndView = new ModelAndView("Index");
        expectedModelAndView.addObject("message", expectedMessage);

        // Method call
        ModelAndView actualModelAndView = homeController.handleRequest();

        // Verification
        assertEquals(expectedModelAndView.getViewName(), actualModelAndView.getViewName());
        assertEquals(expectedMessage, actualModelAndView.getModel().get("message"));

        // Verify that logger.info() was called
        verify(logger, times(1)).info("in HomeController");
    }
}
