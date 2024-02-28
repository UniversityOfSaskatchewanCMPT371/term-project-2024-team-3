const rollbarConfig = {
  accessToken:
    process.env.NODE_ENV === "test"
      ? "test-token"
      : process.env.REACT_APP_ROLLBAR_ACCESS_TOKEN,
  environment: process.env.NODE_ENV === "production" ? "production" : "dev",
  captureUncaught: true,
  captureUnhandledRejections: true,
};

export default rollbarConfig;
