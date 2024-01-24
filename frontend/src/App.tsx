import React from "react";
// import logo from "./logo.svg";
import "./App.css";
import { Outlet } from "react-router";

function App() {
  return (
    // navbar component goes above outlet
    <div>
      <Outlet />
    </div>
  );
}

export default App;
