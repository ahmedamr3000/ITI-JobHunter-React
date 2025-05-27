import React from "react";
import { Outlet } from "react-router-dom";
import NavBar from "../AppBar/NavBar";
import Footer from "../Footer/Footer";
import "./Layout.css";

function Layout({ children }) {
  return (
    <div className="layout-container">
      <NavBar />
      <Outlet />
      {children}
      <Footer />
    </div>
  );
}

export default Layout;
