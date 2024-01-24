import React from "react";
import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import TestPage from "../pages/TestPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [{ path: "testPage", element: <TestPage /> }],
  },
]);
export default router;
