import React, { useState } from 'react';
import { Redirect } from "react-router-dom";

class Register extends React.Component {

  state = {
    message:  null,
    username: null,
    password: null,
    passCheck: null,
    passCheck2: null,
    fname: null,
    lname: null,
    email: null,
    cpassword: null,
    regFail: null,
    signUpComplete: false
  };

  async validatePassword(password) {

    await this.setState({password:password})
    
    //If password is blank, wipe passcheck
    if (!password)
    {
      await this.setState({passCheck:null})
      console.log("passCheck:"+this.state.passCheck)
      console.log("passCheck2:"+this.state.passCheck2)
      return false;
    }

      const pwd = password;

      //If there is a value in confirm box already...
      if (this.state.cpassword) 
      {
        await this.confirmPassword(this.state.cpassword)
      }


      // validate passwords match and have at least 1 lowercase, 1 uppercase and 1 number
        if (pwd.length >= 8) {
          const hasUpperCase = /[A-Z]/.test(pwd);
          const hasLowerCase = /[a-z]/.test(pwd);
          const hasNumbers = /\d/.test(pwd);
  
          if (hasUpperCase && hasLowerCase && hasNumbers) {
       
            await this.setState({passCheck:true})   

            console.log("passCheck:"+this.state.passCheck)
            console.log("passCheck2:"+this.state.passCheck2)

            return true;
          } else {
            await this.setState({passCheck:false})

            console.log("passCheck:"+this.state.passCheck)
            console.log("passCheck2:"+this.state.passCheck2)

            return false;
          }
        }
    return false;
  }

  async confirmPassword(password) {

    if (!password)
    {
      await this.setState({passCheck2:null})
      return false;
    }

    await this.setState({cpassword:password})

    if (this.state.cpassword === this.state.password && this.state.passCheck === true)
      await this.setState({passCheck2:true})
    else
      await this.setState({passCheck2:false})

      console.log("passCheck:"+this.state.passCheck)
      console.log("passCheck2:"+this.state.passCheck2)
    
  }

  doRegister (event){

    var payload={
            username: this.state.username,
            password: this.state.password,
            fname: this.state.fname,
            lname: this.state.lname,
            email: this.state.username 
        }

    console.log("doRegister() => "+payload.username);

    fetch("/api/register",{
        method: 'POST',
        body: JSON.stringify(payload),
        headers:{ 'Content-Type': 'application/json' }
        })
        .then(res => res.json())
        .then(res => { 
            this.setState({ apiResponse: res });
            if (res !== undefined)
            {
                console.log("register request success");
                console.log(this.state.apiResponse);
                if (!res.isRegistered) {
                  this.setState({ regFail: res.message });
                } else {
                  this.setState({ signUpComplete: true });
                }

            } else {
                console.log("reguster request failed");
                this.setState({ regFail: res.message });
                console.log(this.state.apiResponse)
            }
        });
  }



render() {

    if (this.state.signUpComplete === true) {
      return <Redirect to={{
        pathname: '/login',
        state: { signedUp: true }
      }}
        
        />
    }

        return (


<div className="container mt-5 col-lg-8 col-xl-7 text-center">
     <div className="row mt-5"></div>
      <div className="mt-5 mb-2"><h1 className="h3">Register <i className="fas fa-user-plus"></i></h1></div>

      { (this.state.regFail!=null) 
                    ? <div className="alert alert-danger" role="alert" id="registrationFail">
                            {this.state.regFail}
                        </div>
                    : null
                    }

      <div>
        <form action="/register" method="POST" id="register-form">
          

          <div className="alert alert-danger alert-dismissible fade show" style={{display: "none"}} id="exists" role="alert">
            <strong><i className="fas fa-user"></i></strong> Username already exists.
          </div>
          {
              (this.state.passCheck == false) ? 
                  <div className="alert alert-danger alert-dismissible show"  id="reqs" role="alert">
                    <strong>Error:</strong> Password does not contain all necessary characters or length requirements!
                  </div>
              : (this.state.passCheck2 == false) ? 
                  <div className="alert alert-danger alert-dismissible show"  id="reqs" role="alert">
                      <strong>Error:</strong> Your passwords do not match!
                  </div>
             :""
            }


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
            <input type="text" name="username" id="username" onChange = {(event) => this.setState({username:event.target.value})}  className="form-control" placeholder="Username" required
              minlength="5"  />
            <small id="usernameHelpBlock" className="form-text text-muted text-left">
              Must be at least 5 characters long.
            </small>
          </div>
          <div className="form-row form-group">
            <div className="col">
              <label className="sr-only" for="fname">First Name</label>
              <input type="text" name="fname" id="fname" onChange = {(event) => this.setState({fname:event.target.value})}  className="form-control" placeholder="First Name" required />
            </div>
            <div className="col">
              <label className="sr-only" for="lname">Last Name</label>
              <input type="text" name="lname" id="lname" onChange = {(event) => this.setState({lname:event.target.value})}  className="form-control" placeholder="Last Name" required />
            </div>
          </div>

          <div className="alert alert-danger alert-dismissible fade show" style={{display: "none"}} id="emails" role="alert">
            <strong><i className="fas fa-envelope"></i></strong> Email already exists.
          </div>

          <div className="form-group">
            <label className="sr-only" for="email">Email</label>
            <input type="email" name="email" onChange = {(event) => this.setState({email:event.target.value})}  id="email-address" className="form-control" placeholder="Email" required />
          </div>
          <div className="form-group">
            <label className="sr-only" for="password">Password</label>
            <input type="password" name="password" id="pwd" onBlur = {(event) => this.validatePassword(event.target.value)}  className={
              (this.state.passCheck == null) ? "form-control" 
              :(this.state.passCheck == true) ? "form-control border border-success"
              :(this.state.passCheck == false) ? "form-control border border-danger"
              : "form-control"
            } placeholder="Password" required />
          </div>
          <div>
            <label className="sr-only" for="confirm">Confirm Password</label>
            <input type="password" name="confirm" id="confirm" onBlur = {(event) => this.confirmPassword(event.target.value)}  className={
              (this.state.passCheck2 == null) ? "form-control" 
              :(this.state.passCheck2 == true) ? "form-control border border-success"
              :(this.state.passCheck2 == false) ? "form-control border border-danger"
              : "form-control"
            } placeholder="Confirm Password"
              required />
            <small id="usernameHelpBlock" className="form-text text-muted text-left">
              Your password must be between 8 and 25 characters long and must contain at least 1 uppercase, 1
              lowercase
              and 1 number.
            </small>
          </div>
          <button className="btn btn-lg btn-danger btn-block mt-2" onClick={(event) => this.doRegister(event)} type="button"  id="submit">Sign-up <i className="fas fa-sign-in-alt"></i></button>

        </form>

      </div>
    
  </div>

            
        
    );
    }
  }


export default Register;