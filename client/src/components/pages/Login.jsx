import React, { useState, useContext } from 'react';
import Auth from '../Auth'; 
import {UserContext} from '../../userContext.js';

const Login = props => {

    let loginSuccess = false
    const [username, setUsername] = useState()

    //Bring in our user contexts so we can access the state
    const {user, setUser} = useContext(UserContext)

    

    console.log(JSON.stringify(user))

    const handleChangeUsername = e => {
      setUsername(e.target.value)
    }
    const handleLogin = event => {

        //Actual login logic should be stored in Auth
        Auth.login(() => {
            loginSuccess=true
            //Some test code for login
            console.log("Logged in for "+username)
            setUser(username)
        })

        loginSuccess = true;
        event.preventDefault()
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
                    <form action="/login" onSubmit={handleLogin} >
                    <h1 className="h3">Log in</h1>

                    <label className="sr-only" for="username">username</label>
                    <input type="text" name="username" id="username" className="form-control mb-2" placeholder="username" required
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