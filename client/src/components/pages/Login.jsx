import React, { useState, useContext } from 'react';
import Auth from '../Auth';
import {UserContext} from '../../userContext.js';

const Login = props => {

    var password;
    const [username, setUsername] = useState()
    const [loginFailed,setLoginFailed] = useState()

    //Bring in our user contexts so we can access the state
    const {user, setUser} = useContext(UserContext)



    const handleChangeUsername = e => {
      setUsername(e.target.value)
    }
    const handlePassword = e => {
        password = e.target.value;
      }
    const handleLogin = event => {
        event.preventDefault()


        //Authentication Logic
        Auth.login(() => {
            var loginStatus;
                            
                    const data = { username: username, password: password }
                    fetch("/api/login", {
                      method: 'POST',
                      body: JSON.stringify(data),
                      headers:{ 'Content-Type': 'application/json' }
                      })
                      .then(res => {
                          //Unwrap our promise object
                          res.text().then(data => {
                              loginStatus=JSON.parse(data);
                              console.log(loginStatus);
                              if (loginStatus.isSignedIn===true)
                              {
                                  console.log("Logged in for "+username);
                                  setUser(username);
  
                                  //Clear any existing login erros
                                  setLoginFailed(null);
                              }
                              else
                              {
                                  //Do some frontend stuff like a red message
                                  setLoginFailed(loginStatus.Alert);
                              }
                          });
                      
                      }).catch(function(error) {
                          console.log(error);
                      });
                
        })
      }



    //Let's see if they're currently logged in!
    if (user!= undefined) {
        return(
            <div className="container mt-5">
                <div className="row mt-5">
                    <div className="col-sm-8 offset-sm-2 text-center mt-5">

                        <h3>{user}, You are signed in.</h3>
                    </div>
                </div>
          </div>
        );

    } else {
        return (

            <div className="container mt-5">

                <div className="row mt-5">
                <div className="mt-5 col-sm-8 offset-sm-2 text-center">
                    <form onSubmit={handleLogin}>
                    <h1 className="h3">Log in</h1>
                    { (props.location.state!=null) && (props.location.state.signedUp!=null)
                    ? <div className="alert alert-success" role="alert" id="signupSuccess">
                            Sign-up Complete! Please log-in!
                        </div>
                    : null
                    }

                    { (loginFailed!=null)
                    ? <div className="alert alert-danger" role="alert" id="passwordInvalid">
                            {loginFailed}
                        </div>
                    : null
                    }

                    <label className="sr-only" htmlFor="username">username</label>
                    <input type="text" name="username" id="username" className="form-control mb-2" placeholder="username" required
                        autoFocus minLength="4" value={username} onChange={handleChangeUsername} maxLength="25" />

                      <label className="sr-only" htmlFor="password">password</label>
                    <input type="password" name="password" id="password" onChange={handlePassword} className="form-control" placeholder="password" required
                        minLength="6" maxLength="25" />
                      <button className="btn btn-lg btn-danger btn-block mt-2" type="submit">Submit</button>
                    <a href="/register">Register Here</a>
                    </form>
                </div>
                </div>
            </div>


    );
    }



    function ReturnAlert(hasAlert) {
        if (hasAlert.error) {
            return <div className="alert alert-danger alert-dismissible fade show" role="alert">
            {hasAlert.alert}
            <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
            </div>;
        } else if (hasAlert.success) {
            return <div className="alert alert-success alert-dismissible fade show" role="alert">
                {hasAlert.alert}
            <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
            </div>;
        }
    }
}
export default Login;
