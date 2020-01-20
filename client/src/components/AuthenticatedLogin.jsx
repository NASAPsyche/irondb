import React from 'react';

const  AuthenticatedLogin = ({ authenticated }) => {
    if (authenticated === false) {
        return null;
    }
    else {
        return (
            <div className="container mt-4">
            <div className="d-flex flex-row align-items-center justify-content-center mt-5 mb-2">
              <h1>You are {authenticated} signed in.</h1>
            </div>
          </div>
    );
}

}
export default AuthenticatedLogin;