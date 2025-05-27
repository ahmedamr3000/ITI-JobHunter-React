import React from "react";
import { Outlet } from "react-router-dom";
import NavBar from "../AppBar/NavBar";

function Layout({ children }) {
  return (
    <>
      <NavBar />
      <Outlet />
      {children}
    </>
  );
}

export default Layout;
