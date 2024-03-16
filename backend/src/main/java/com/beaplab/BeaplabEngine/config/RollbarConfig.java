package com.beaplab.BeaplabEngine.config;

import static com.rollbar.notifier.config.ConfigBuilder.withAccessToken;
import com.rollbar.notifier.Rollbar;
import com.rollbar.notifier.config.Config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.env.Environment;

@Configuration
@ComponentScan("com.beaplab.BeaplabEngine")
@PropertySource("classpath:rollbar.properties")
public class RollbarConfig {

  @Autowired
  Environment environment;

  @Bean
  public Rollbar rollbar() {
    Config config = withAccessToken(environment.getProperty("access.token"))
    .environment("backend")
    .codeVersion("1.0.0")
    .build();

    Rollbar rollbarInstance = new Rollbar(config);
    return rollbarInstance;
  }
}
