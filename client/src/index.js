import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import Database from './components/Database';
import DataEntry from './components/pages/DataEntry';
import Help from './components/pages/Help';
import Panel from './components/Panel';
import Profile from './components/Profile';

import Navbar from './components/Navbar';
import Error from './components/Error';
import { Route, Redirect, BrowserRouter as Router } from 'react-router-dom';
import * as serviceWorker from './serviceWorker';
import {userContext} from './userContext';


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
