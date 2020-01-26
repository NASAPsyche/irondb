import React, { useState } from 'react';
import simulatedAuth from '../../index.js'; 

const Login = props => {

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
            <div className="container mt-5">
                <div className="row mt-5">
                <div className="mt-5 col-sm-8 offset-sm-2 text-center">
                    <form action="/login" onSubmit={handleLogin} >
                    <h1 className="h3">Log in</h1>

                    <label className="sr-only" for="username">username</label>
                    <input type="text" name="username" id="username" className="form-control" placeholder="username" required
                        autofocus minlength="4" value={username} onChange={handleChangeUsername} maxlength="25" />
                        
                    <label className="sr-only" for="password">password</label>
                    <input type="password" name="password" id="password" className="form-control" placeholder="password" required
                        minlength="6" maxlength="25" />
                    <button class="btn btn-lg btn-danger btn-block mt-2" type="submit">Submit</button>
                    <a href="/register">Register Here</a>
                    </form>
                </div>
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
export default Login;