import React, { useState, useEffect } from 'react';

import { makeStyles } from "@material-ui/core/styles";

import axios from "axios";

import { withRouter } from "react-router-dom";

import AuthNavBar from 'components/Navbars/AuthNavBar.js';

import { API_URL, getFromStorage, setInStorage } from 'utils/storage.js';

import GridContainer from "components/Grid/GridContainer.js"
import GridItem from "components/Grid/GridItem.js"
import Card from "components/Card/Card.js"
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import { InputLabel } from '@material-ui/core';
import CardFooter from "components/Card/CardFooter.js";
import Button from "components/CustomButtons/Button.js";

import styles from "assets/jss/material-dashboard-react/views/dashboardStyle.js";

const useStyles = makeStyles(styles);

function Login(props) {

    const token = getFromStorage('auth-token');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const [invalidMessage, setInvalidMessage] = useState('');

    if(token !== null) {
        props.history.push("/admin/table");
    }


    function onChangeEmail(event) {
        setEmail(event.target.value);
        if (isSuccess) {
            setIsSuccess(false);
        }
    }
    function onChangePassword(event) {
        setPassword(event.target.value);
        if (isSuccess) {
            setIsSuccess(false);
        }
    }

    const submit = (event) => {
        event.preventDefault();

        axios.post(`${API_URL}/account/signin`, { email, password }, { headers: { 'Content-Type': 'application/json' } })
            .then(res => {
                const { data } = res;
                const { success, message, token, userId } = data;
                if (!success) {
                    setInvalidMessage(message);
                    setIsSuccess(true);
                } else {
                    setInStorage('auth-token', token);
                    setInStorage('user-id', userId);
                    props.history.push("/admin/table")
                }

            }).catch(function (error){
                console.log(error);
            });
    }


    const classes = useStyles();
    return (
        <div style={{ overflow: 'hidden' }}>
            <AuthNavBar></AuthNavBar>
            <GridContainer alignItems="center" justify="center" style={{ minHeight: '100vh', backgroundColor: '#535353'  }}>
                <GridItem xs={12} sm={5} md={3} >
                    <Card>
                        <CardHeader>
                            <h3 className={classes.cardTitle}>
                                Log in
                            </h3>
                        </CardHeader>
                        <CardBody>
                            <form onSubmit={submit}>
                                <GridContainer>
                                    <GridItem xs={12} sm={12} md={12}>
                                        <CustomInput labelText="email"
                                            id="email"
                                            formControlProps={{
                                                fullWidth: true
                                            }}
                                            inputProps={{
                                                type: 'email',
                                                required: true,
                                                onChange: onChangeEmail
                                            }}>
                                        </CustomInput>
                                    </GridItem>
                                    <GridItem xs={12} sm={12} md={12}>
                                        <CustomInput labelText="Password"
                                            id="password"
                                            formControlProps={{
                                                fullWidth: true
                                            }}
                                            inputProps={{
                                                type: 'password',
                                                required: true,
                                                onChange: onChangePassword
                                            }}>
                                        </CustomInput>
                                    </GridItem>
                                    {
                                        isSuccess && (
                                            <GridItem xs={12} sm={12} md={12}>
                                                <InputLabel style={{ color: 'red' }}>{invalidMessage}</InputLabel>
                                            </GridItem>
                                        )
                                    }
                                </GridContainer>
                                <CardFooter style={{ marginTop: '10px' }}>
                                    <Button type="submit" color="white" style={{ width: '100%', fontSize: '16px' , backgroundColor: '#8e24aa' }} simple>Sign in</Button>
                                </CardFooter>
                            </form>
                        </CardBody>
                    </Card>
                </GridItem>
            </GridContainer>
        </div>
    )
}

Login = withRouter(Login);
export default Login;