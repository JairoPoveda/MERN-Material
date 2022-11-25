import React from 'react';
import { Route, Redirect } from "react-router-dom";

import { getFromStorage } from "utils/storage.js";

export default function ProtectedRoute(props) {

    const authToken = getFromStorage('auth-token');

    if (authToken) {

        return (
            <Route {...props}></Route>
        )
    } else {
        return <Redirect to="/login" />
    }
}