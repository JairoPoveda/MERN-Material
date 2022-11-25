import React, { useState, useEffect } from 'react';

import { makeStyles } from "@material-ui/core/styles";

import { API_URL, getFromStorage } from 'utils/storage.js';

import { withRouter } from "react-router-dom";

import axios from "axios";

import AuthNavBar from "components/Navbars/AuthNavBar.js";

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

function Register(props) {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const [invalidMessage, setInvalidMessage] = useState('');

    const classes = useStyles();

    const token = getFromStorage('auth-token');

    if(token !== null) {
        props.history.push("/admin/table");
    }

    function onChangeFirstName(event) {
        setFirstName(event.target.value);
    }

    function onChangeLasName(event) {
        setLastName(event.target.value);
    }

    function onChangeEmail(event) {
        setEmail(event.target.value);
    }

    function onChangePhoneNumber(event) {
        setPhoneNumber(event.target.value);
        console.log(phoneNumber);
    }

    function onChangePassword(event) {
        setPassword(event.target.value);
    }

    function submit(event){

        event.preventDefault();

        axios.post(`${API_URL}/account/signup`,
            {
                firstName,
                lastName,
                email,
                phoneNumber,
                password
            },
            { headers: { 'Content-Type': 'application/json' } })
            .then(res => {
                console.log(res);
                const { data } = res;
                const { success, message } = data;

                if (!success) {
                    setIsSuccess(true);
                    setInvalidMessage(message);
                } else {
                    console.log('User created');
                    props.history.push({
                        pathname: '/login'
                    });
                }
            })
            .catch(err => {
                console.log(err);
            })
    }

    return (
        <div style={{ overflow: 'hidden'}}>
            <AuthNavBar></AuthNavBar>
            <GridContainer alignItems="center" justify="center" style={{ minHeight: '100vh', backgroundColor: '#535353', padding: "15px" }}>
                <GridItem xs={12} sm={5} md={3} id="signPage">
                    <Card>
                        <CardHeader>
                            <h3 className={classes.cardTitle}>
                                Register
                            </h3>
                        </CardHeader>
                        <CardBody>
                            <form onSubmit={submit}>
                                <GridContainer>
                                    <GridItem xs={12} sm={12} md={12}>
                                        <CustomInput labelText="FirstName"
                                            id="firstName"
                                            formControlProps={{
                                                fullWidth: true
                                            }}
                                            inputProps={{
                                                // value:  firstName, 
                                                required: true,
                                                onChange: onChangeFirstName
                                            }}
                                        >
                                        </CustomInput>
                                    </GridItem>
                                    <GridItem xs={12} sm={12} md={12}>
                                        <CustomInput labelText="LastName"
                                            id="lastName"
                                            formControlProps={{
                                                fullWidth: true
                                            }}
                                            inputProps={{
                                                // value:  lastName, 
                                                required: true,
                                                onChange: onChangeLasName
                                            }}
                                        >
                                        </CustomInput>
                                    </GridItem>
                                    <GridItem xs={12} sm={12} md={12}>
                                        <CustomInput labelText="Email"
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
                                        <CustomInput labelText="PhoneNumber"
                                            id="phoneNumber"
                                            formControlProps={{
                                                fullWidth: true
                                            }}
                                            inputProps={{
                                                // value:  lastName, 
                                                required: true,
                                                onChange: onChangePhoneNumber
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
                                    <CardFooter style={{ marginTop: '10px', width: '100%' }}>
                                        <Button type="submit" color="white" style={{ width: '100%', fontSize: '16px', backgroundColor: '#8e24aa' }} simple>Register</Button>
                                    </CardFooter>
                                </GridContainer>
                            </form>
                        </CardBody>
                    </Card>
                </GridItem>
            </GridContainer>
        </div>
    )
}

Register = withRouter(Register);
export default Register;