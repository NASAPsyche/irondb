import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Database from './Database';
import DataEntry from './DataEntry';
import Help from './Help';
import Panel from './Panel';
import Profile from './Profile';
import * as serviceWorker from './serviceWorker';
import { Route, Link, BrowserRouter as Router } from 'react-router-dom';

const routing = (
    <Router>
        <div>
            <Route path="/" component={App}/>
            <Route path="/database" component={Database}/>
            <Route path="/help" component={Help}/>
            <Route path="/panel" component={Panel}/>
            <Route path="/data-entry" component={DataEntry}/>
            <Routh path="/profile" component={Profile}/>
        </div>
    </Router>
)

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
