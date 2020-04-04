/**
 * Auth provides our React App a single source of truth on the client side
 * as to whether or not the user is currently logged in or out. It also 
 * simulates asynchronous logins and logouts. 
 * 
 * On app startup, in order to determine if the user is currently logged in
 * from a previous browser session, we check for the presence of a username
 * cookie that is set upon successful authentication. If that cookie is present
 * we assume the user is logged in and we allow access to protected routes.
 */

import * as Cookies from "js-cookie";

function hasSessionCookie() {
    return Cookies.get('username') != undefined
}

const Auth = {
    isAuthenticated: hasSessionCookie(),

    login(callback) {
        this.isAuthenticated = true;
        setTimeout(callback, 100); //simulate asynchronous code
    },

    logout(callback) {
        this.isAuthenticated = false;
        setTimeout(callback, 100); //simulate asynchronous code
    }
}

export default Auth;
