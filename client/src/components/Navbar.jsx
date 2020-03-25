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
      <nav
        class="navbar fixed-top navbar-expand navbar-dark"
        style={{ backgroundColor: "#000000" }}
      >
        <div class="navbar-brand">
          <img
            class="mr-2"
            src={require("../images/nasa-logo-web-rgb.png")}
            id="nasa-logo"
            width="30"
            height="30"
            class="pl-0 ml-0"
            alt="NASA Logo"
          />
          <img
            src={require("../images/Psyche_BadgeSolid_Color-PNG.png")}
            id="psyche-logo"
            width="30"
            height="30"
            alt="Psyche Mission Logo"
          />
        </div>
        <div class="collapse navbar-collapse">
          <div class="navbar-nav">
            <Link class="nav-item nav-link" to="/database">
              Database
            </Link>
            <Link class="nav-item nav-link" to="/panel">
              Panel
            </Link>
            <Link class="nav-item nav-link" to="/data-entry">
              Data Entry
            </Link>
            <Link class="nav-item nav-link" to="/help">
              Help
            </Link>
            {/* TODO: REMOVE THESE NAVBAR LINKS ONCE APPROVAL PAGES ARE LINKED UP. */}
            <Link class="nav-item nav-link" to="/data-entry-error">
              Data Entry Error
            </Link>
          </div>
        </div>
        <Link id="account" to="/account" class="btn btn-outline-light mr-2">
          Account
        </Link>
        <a onClick={logout} href="#" class="btn btn-outline-light">
          Sign out
        </a>
      </nav>
    );
  } else {
    return (
      <nav
        class="navbar fixed-top navbar-expand navbar-dark"
        style={{ backgroundColor: "#000000" }}
      >
        <div class="navbar-brand">
          <img
            class="mr-2"
            src={require("../images/nasa-logo-web-rgb.png")}
            id="nasa-logo"
            width="40"
            height="40"
            class="pl-0 ml-0"
            alt="NASA Logo"
          />
          <img
            src={require("../images/Psyche_BadgeSolid_Color-PNG.png")}
            id="psyche-logo"
            width="30"
            height="30"
            alt="Psyche Mission Logo"
          />
        </div>
        <div class="collapse navbar-collapse">
          <div class="navbar-nav">
            <Link to="/" class="nav-item nav-link">
              Home
            </Link>
            <Link class="nav-item nav-link" to="/database">
              Database
            </Link>
            <Link class="nav-item nav-link" to="/help">
              Help
            </Link>
          </div>
        </div>
        <Link id="account" to="/account" class="btn btn-outline-light mr-2">
          Account
        </Link>

        <Link to="/login" class="btn btn-outline-light">
          Sign in
        </Link>
      </nav>
    );
  }
}

export default Navbar;
