import React from 'react';
import './styles/App.css';
import { Route, Redirect, Link, BrowserRouter as Router } from 'react-router-dom';
import {userContext} from './userContext';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        user: {}
    };
  }

  componentDidMount() {
    // get and set currently logged in user to state
  }

  render() {
    return (
      // Pass user state as value to context.Provider so it can be consumed by context.Consumer
      <userContext.Provider value={this.state.user}>
        <Main/>
      </userContext.Provider>
    );
  }
}

export default App;
