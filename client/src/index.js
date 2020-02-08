import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import Database from './components/Database';
import DataEntry from './components/DataEntry';
import Help from './components/pages/Help';
import Panel from './components/Panel';
import Profile from './components/Profile';
import Login from './components/pages/Login';
import Navbar from './components/Navbar';
import Error from './components/Error';
import { Route, Redirect, BrowserRouter as Router } from 'react-router-dom';
import * as serviceWorker from './serviceWorker';
import {userContext} from './userContext';

const simulatedAuth = {
    isAuthenticated: false,
    login(callback) {
      this.isAuthenticated = true;
      setTimeout(callback, 100); //simulate asynchronous code
    },
    logout(callback) {
      this.isAuthenticated = false;
      setTimeout(callback, 100); //simulate asynchronous code
    }
}
  
const ProtectedRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={(props) => (
        simulatedAuth.isAuthenticated === true
        ? <Component {...props} />
        : <Redirect to='/login' />
    )} />
)

function Routing() {
    return (
        <Router>
            <div>

                <Navbar authenticated={simulatedAuth.isAuthenticated} />
 

                <Route exact path="/" component={App}/>
                <ProtectedRoute path="/database" component={Database}/>
                <Route path="/help" 
                    render={(props) => <Help {...props} authenticated={simulatedAuth.isAuthenticated} />}
                />
                <ProtectedRoute path="/panel" component={Panel}/>
                <ProtectedRoute path="/data-entry" component={DataEntry}/>
                <ProtectedRoute path="/profile" component={Profile}/>

                <Route
                    path='/login'
                    render={(props) => <Login {...props} authenticated={simulatedAuth.isAuthenticated}/>}
                />

                <Route exact path="/error" component={Error}/>

            </div>
        </Router>
    )
}

ReactDOM.render(<Routing />, document.getElementById('root'));

export default simulatedAuth;
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
