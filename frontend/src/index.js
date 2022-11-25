/*!

=========================================================
* Material Dashboard React - v1.8.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/material-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { Router, Route, Switch, Redirect } from "react-router-dom";

import { getFromStorage } from "./utils/storage";

// core components
import Admin from "layouts/Admin.js";
import RTL from "layouts/RTL.js";
import Login from "views/Auth/Login.js"
import Register from "views/Auth/Register.js"

import ProtectedRoute from "routes/ProtectedRoute.js";

import "assets/css/material-dashboard-react.css?v=1.8.0";

const hist = createBrowserHistory();

const token = getFromStorage('auth-token');


ReactDOM.render(
  <Router history={hist}>
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <ProtectedRoute path="/admin" component={Admin} />
      <ProtectedRoute path="/rtl" component={RTL} />
      {token !== null ?
        <Redirect to="/admin/table" />
        :
        <Redirect to="/login" />
      }
    </Switch>
  </Router>,
  document.getElementById("root")
);
