import React from 'react';
import './styles/App.css';
import Login from './pages/Login';
import { useState, useContext } from 'react';
import {UserContext, UserContextProvider} from '../userContext.js';
import ReactDOM from 'react-dom';
import '../index.css';
import Auth from './Auth';
import Main from './pages/Main'




class App extends React.Component {



  componentDidMount() {

  }


  render() {

    const value = {
      user: this.state.user,
      logoutUser: this.logout
    }

    return (
   
        <div className="App">
          <Main />
        </div>
        
  
     
    );
  }
}


export default App;




