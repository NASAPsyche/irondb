import React from 'react';
import './styles/App.css';
import Login from './pages/Login';
import { Route, Redirect, Link, BrowserRouter as Router } from 'react-router-dom';
import {userContext} from '../userContext.js';
import ReactDOM from 'react-dom';
import '../index.css';
import Auth from './Auth';
import Main from './pages/Main'




class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        user: {}
    };

    this.logout = this.logout.bind(this);

  }

  logout() {
    this.setState({user: {}});
  }

  componentDidMount() {
    // get and set currently logged in user to state
  }

  
  render() {

    const value = {
      user: this.state.user,
      logoutUser: this.logout
    }

    return (
      <userContext.Provider>
        <div className="App"></div>
      </userContext.Provider>
     
    );
  }
}


export default App;




