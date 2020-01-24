import React from 'react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';




function Navbar(props) {


    if (props.authenticated === true) {
        return (
            <nav class="navbar fixed-top navbar-expand navbar-dark" style={{backgroundColor: "#000000"}}>
                <div class="navbar-brand">
                    <img class="mr-2" src={require("../images/nasa-logo-web-rgb.png")} id="nasa-logo" width="30" height="30"  class="pl-0 ml-0" alt="NASA Logo" />
                    <img src={require("../images/Psyche_BadgeSolid_Color-PNG.png")} id="psyche-logo" width="30" height="30" alt="Psyche Mission Logo" />
                </div>
                <div class="collapse navbar-collapse">
                    <div class="navbar-nav">
                    <Link class="nav-item nav-link" to="/">Home</Link>
                    <Link class="nav-item nav-link" to="/database">Database</Link>
                    <Link class="nav-item nav-link" to="/panel">Panel</Link>
                    <Link class="nav-item nav-link" to="/data-entry">Data Entry</Link>
                    <Link class="nav-item nav-link" to="/help">Help</Link>
                    </div>
                </div>
                <Link id="profile" to="/profile" class="btn btn-outline-light">Account</Link>
                <a href="/logout" class="btn btn-outline-light">Sign out</a>
            </nav>
            );
    }
    else {
        return (
            <nav class="navbar fixed-top navbar-expand navbar-dark" style={{backgroundColor: "#000000"}}>
                <div class="navbar-brand">
                    <img class="mr-2" src={require("../images/nasa-logo-web-rgb.png")} id="nasa-logo" width="40" height="40"  class="pl-0 ml-0" alt="NASA Logo" />
                    <img src={require("../images/Psyche_BadgeSolid_Color-PNG.png")} id="psyche-logo" width="30" height="30" alt="Psyche Mission Logo" />
                </div>
                <div class="collapse navbar-collapse">
                    <div class="navbar-nav">
                        <Link to="/" class="nav-item nav-link">Home</Link>
                        <Link class="nav-item nav-link" to="/database">Database</Link>
                        <Link class="nav-item nav-link" to="/help">Help</Link>
                    </div>
                </div>
                <Link to="/login" class="btn btn-outline-light">Sign in</Link>
            </nav>
        );
    }
}

export default Navbar;