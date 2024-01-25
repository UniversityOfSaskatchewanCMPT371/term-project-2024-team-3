import React from "react";
import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import ProcessedData from "../pages/ProcessDataPage/processedDataPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [{ path: "processed_data", element: <ProcessedData /> }],
  },
]);
export default router;
