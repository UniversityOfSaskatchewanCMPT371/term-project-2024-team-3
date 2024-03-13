package com.beaplab.BeaplabEngine.config;

import static com.rollbar.notifier.config.ConfigBuilder.withAccessToken;
import com.rollbar.notifier.Rollbar;
import com.rollbar.notifier.config.Config;

public class RollbarConfig {


  public Rollbar rollbar() {

    // Your ACCESS TOKEN is: e83a48370766458c8f32aa8089ba6352
    // Make sure to keep this secure
    Config config = withAccessToken("e83a48370766458c8f32aa8089ba6352")
    .environment("qa")
    .codeVersion("1.0.0")
    .build();

    Rollbar rollbarInstance = Rollbar.init(config);
    rollbarInstance.info("TestMessage");
    return rollbarInstance;
  }
}
