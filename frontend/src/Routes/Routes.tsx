import React from "react";
import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import TestPage from "../pages/TestPage";
import FileUploadPage from "../FileUploadPage/FileUploadPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "testPage",
        element: <TestPage />,
      },
      {
        path: "file-upload",
        element: <FileUploadPage />,
      },
    ],
  },
]);
export default router;
