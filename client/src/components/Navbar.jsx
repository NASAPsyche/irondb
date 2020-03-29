import React from "react";
import { Link } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { UserContext } from "../userContext.js";
import * as Cookies from "js-cookie";

function Navbar(props) {
  const { user, setUser } = useContext(UserContext);

  const logout = event => {
    setUser();
    Cookies.remove("username");
    fetch("/api/logout", {
      method: "GET"
    });
  };

    if (user != undefined) {
        return (
            <nav className="navbar fixed-top navbar-expand navbar-dark" style={{backgroundColor: "#000000"}}>
                <div className="navbar-brand">
                    <img className="mr-2" src={require("../images/nasa-logo-web-rgb.png")} id="nasa-logo" width="30" height="30"  className="pl-0 ml-0" alt="NASA Logo" />
                    <img src={require("../images/Psyche_BadgeSolid_Color-PNG.png")} id="psyche-logo" width="30" height="30" alt="Psyche Mission Logo" />
                </div>
                <div className="collapse navbar-collapse">
                    <div className="navbar-nav">

                    <Link className="nav-item nav-link" to="/database">Database</Link>
                    <Link className="nav-item nav-link" to="/panel">Panel</Link>
                    <Link className="nav-item nav-link" to="/data-entry">Data Entry</Link>
                    <Link className="nav-item nav-link" to="/help">Help</Link>
                    {/* TODO: REMOVE THESE NAVBAR LINKS ONCE APPROVAL PAGES ARE LINKED UP. */}
                    <Link className="nav-item nav-link" to="/data-entry-error">Data Entry Error</Link>
                    </div>
                </div>
                <Link id="account" to="/account" className="btn btn-outline-light mr-2">Account</Link>
                <a onClick={logout} href="#" className="btn btn-outline-light">Sign out</a>
            </nav>
            );
    }
    else {
        return (
            <nav className="navbar fixed-top navbar-expand navbar-dark" style={{backgroundColor: "#000000"}}>
                <div className="navbar-brand">
                    <img className="mr-2" src={require("../images/nasa-logo-web-rgb.png")} id="nasa-logo" width="40" height="40"  className="pl-0 ml-0" alt="NASA Logo" />
                    <img src={require("../images/Psyche_BadgeSolid_Color-PNG.png")} id="psyche-logo" width="30" height="30" alt="Psyche Mission Logo" />
                </div>
                <div className="collapse navbar-collapse">
                    <div className="navbar-nav">
                        <Link to="/" className="nav-item nav-link">Home</Link>
                        <Link className="nav-item nav-link" to="/database">Database</Link>
                        <Link className="nav-item nav-link" to="/help">Help</Link>
                    </div>
                </div>
                <Link id="account" to="/account" className="btn btn-outline-light mr-2">Account</Link>

                <Link to="/login" className="btn btn-outline-light">Sign in</Link>
            </nav>
        );
    }
}

export default Navbar;
