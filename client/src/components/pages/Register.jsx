import React, { useState } from 'react';
import simulatedAuth from '../../index.js'; 

const Register = props => {

    let loginSuccess = false
    const [username, setUsername] = useState()


    const handleChangeUsername = e => {
      setUsername(e.target.value)
    }
    const handleLogin = event => {

        simulatedAuth.login(() => {
            loginSuccess=true
            alert("Logged in for "+username)
        })

        loginSuccess = true;
        event.preventDefault()
      }

    if (props.authenticated === true) {
        return(
            <div className="container mt-5">
                <div className="row mt-5">
                    <div className="col-sm-8 offset-sm-2 text-center mt-5">
                        <h1>You are already signed in.</h1>
                    </div>
                </div>
          </div>
        );

    } else {
        return (


<div class="container mt-5 col-lg-8 col-xl-7 text-center">
     <div className="row mt-5"></div>
      <div className="mt-5 mb-2"><h1 className="h3">Register <i className="fas fa-user-plus"></i></h1></div>

      <div>
        <form action="/register" method="POST" id="register-form">
          

          <div className="alert alert-danger alert-dismissible fade show" style={{display: "none"}} id="exists" role="alert">
            <strong><i className="fas fa-user"></i></strong> Username already exists.
          </div>

          <div className="alert alert-warning alert-dismissible fade show" hidden="true" id="reqs" role="alert">
            <strong>Error:</strong> Password does not contain all necessary characters.
          </div>

          <div className="alert alert-warning alert-dismissible fade show" hidden="true" id="mismatch" role="alert">
            <strong>Error:</strong> Passwords do not match.
          </div>

          <div className="alert alert-warning alert-dismissible fade show" hidden="true" id="length" role="alert">
            <strong>Error:</strong> Password does not meet length requirements.
          </div>

          <div className="alert alert-warning alert-dismissible fade show" hidden="true" id="name" role="alert">
            <strong>Error:</strong> Try a different username.
          </div>

          <div className="form-group">
            <label className="sr-only" for="username">Username</label>
            <input type="text" name="username" id="username" className="form-control" placeholder="Username" required
              minlength="5"  />
            <small id="usernameHelpBlock" className="form-text text-muted text-left">
              Must be at least 5 characters long.
            </small>
          </div>
          <div className="form-row form-group">
            <div className="col">
              <label className="sr-only" for="fname">First Name</label>
              <input type="text" name="fname" id="fname" className="form-control" placeholder="First Name" required />
            </div>
            <div className="col">
              <label className="sr-only" for="lname">Last Name</label>
              <input type="text" name="lname" id="lname" className="form-control" placeholder="Last Name" required />
            </div>
          </div>

          <div className="alert alert-danger alert-dismissible fade show" style={{display: "none"}} id="emails" role="alert">
            <strong><i className="fas fa-envelope"></i></strong> Email already exists.
          </div>

          <div className="form-group">
            <label className="sr-only" for="email">Email</label>
            <input type="email" name="email" id="email-address" className="form-control" placeholder="Email" required />
          </div>
          <div className="form-group">
            <label className="sr-only" for="password">Password</label>
            <input type="password" name="password" id="pwd" className="form-control" placeholder="Password" required />
          </div>
          <div>
            <label className="sr-only" for="confirm">Confirm Password</label>
            <input type="password" name="confirm" id="confirm" className="form-control" placeholder="Confirm Password"
              required />
            <small id="usernameHelpBlock" className="form-text text-muted text-left">
              Your password must be between 8 and 25 characters long and must contain at least 1 uppercase, 1
              lowercase
              and 1 number.
            </small>
          </div>
          <button className="btn btn-lg btn-danger btn-block mt-2" type="submit" id="submit">Sign-up <i className="fas fa-sign-in-alt"></i></button>

        </form>

      </div>
    
  </div>

            
        
    );
    }



    function ReturnAlert(hasAlert) {
        if (hasAlert.error) {
            return <div class="alert alert-danger alert-dismissible fade show" role="alert">
            {hasAlert.alert}
            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
            </div>;
        } else if (hasAlert.success) {
            return <div class="alert alert-success alert-dismissible fade show" role="alert">
                {hasAlert.alert}
            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
            </div>;
        }
    }
}
export default Register;