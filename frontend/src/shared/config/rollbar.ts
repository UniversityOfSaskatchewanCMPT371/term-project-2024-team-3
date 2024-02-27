const rollbarConfig = {
  accessToken: process.env.ROLLBAR_ACCESS_TOKEN,
  environment: process.env.NODE_ENV === "production" ? "production" : "dev",
  captureUncaught: true,
  captureUnhandledRejections: true,
};

export default rollbarConfig;
