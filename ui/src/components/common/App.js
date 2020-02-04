import React from 'react';
import CarCardView from "../user/cars/CarCards"
import AdminMenu from "../admin/AdminMenu"
import {Route, Router, Switch} from 'react-router-dom';
import Layout from "./Layout";
import Login from "./Login"
import Registration from './Registration'
import history from './History';
import {connect} from "react-redux";
import Profile from '../user/Profile'

const App = (authData) => (
    <Router history={history}>
        <Switch>
            <Layout>
                <Route exact path="/" component={authData.role === "ADMIN" ? AdminMenu : CarCardView}/>
                <Route path="/login" component={Login}/>
                <Route path="/registration" component={Registration}/>
                <Route path="/profile" component={Profile}/>
            </Layout>
        </Switch>
    </Router>
);

const mapStateToProps = state => ({
    ...state.authorizationReducer,
});

export default (connect(mapStateToProps)(App));
