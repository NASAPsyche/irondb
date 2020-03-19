import React, { useState } from 'react';

const Register = props => {

  validatePassword();
  
  function validatePassword() {
    $(':password').on('keyup', function() {
      const pwd = $('#pwd').val();
      const cnfm = $('#confirm').val();
  
      // eslint-disable-next-line max-len
      // validate passwords match and have at least 1 lowercase, 1 uppercase and 1 number
      if (pwd == cnfm) {
        if (pwd.length >= 8) {
          const hasUpperCase = /[A-Z]/.test(pwd);
          const hasLowerCase = /[a-z]/.test(pwd);
          const hasNumbers = /\d/.test(pwd);
  
          if (hasUpperCase && hasLowerCase && hasNumbers) {
            console.log('GOOD PASSWORDS');
            return true;
          }
        }
      }
    });
    return false;
  }

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



export default Register;