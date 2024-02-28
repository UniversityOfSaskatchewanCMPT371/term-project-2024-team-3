import React from "react";
import { Provider } from "@rollbar/react";
import rollbarConfig from "shared/config/rollbar";
import { renderWithProvider } from "shared/util/tests/render";
import PredictedDataPage from "./PredictedDataPage";

test("Renders PredictedDataPage components", () => {
  const { getByText } = renderWithProvider(
    <Provider config={rollbarConfig}>
      <PredictedDataPage />
    </Provider>,
  );
  getByText("Step 3 - Predicted data files:");
  getByText(
    "On this page, you can download your new data files with both the raw Apple Watch or Fitbit data, the features we use for our machine learning models, and the predicted activity for each minute of your data.",
  );
  getByText(
    "If you want to upload different files, go back to the file upload page. You can also click on individual steps to rerun a different machine learning model if you want.",
  );
});
