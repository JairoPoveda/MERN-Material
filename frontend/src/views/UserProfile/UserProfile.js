import React, { useState, useEffect } from 'react';

import { makeStyles } from "@material-ui/core/styles";

// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import InputLabel from "@material-ui/core/InputLabel";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";

//sweet Alert
import Swal from 'sweetalert2'

import { API_URL, getUserIDFromStorage, getFromStorage } from 'utils/storage.js';

import axios from 'axios';
import { readConfigFile, isConditionalExpression } from 'typescript';
import Input from '@material-ui/core/Input';
import TextField from '@material-ui/core/TextField';

const styles = {
  cardCategoryWhite: {
    color: "rgba(255,255,255,.62)",
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    marginBottom: "0"
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none"
  },
  validError: {
    color: 'red',
    marginTop: '10px'
  }
};

const useStyles = makeStyles(styles);

export default function UserProfile(props) {
  const classes = useStyles();

  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
  });
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isValidPassword, setIsValidPassword] = useState('');
  const [isValidLength, setIsValidLength] = useState('');


  const userId = getUserIDFromStorage('user-id');
  const token = getFromStorage('auth-token');
  
  if(token === null) {
    props.history.push("/login");
  };

  useEffect(() => {   // get real token of User from User Session token.

    async function getUser() {
      await axios.get(`${API_URL}/user/get`, { params: userId })
        .then((res) => {
          const { data: { user } } = res;

          setUser({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phoneNumber: user.phoneNumber,
          });

        }).catch((error) => {
          console.log("error" + error);
        });
    }
    getUser();
  }, []);


  // update User
  const onChangeFirstName = event => {
    const firstName = event.target.value;

    setUser({
      ...user,
      firstName
    });
  };
  const onChangeLastName = event => {
    const lastName = event.target.value;

    setUser({
      ...user,
      lastName
    });
  };
  const onChangeEmail = event => {
    const email = event.target.value;

    setUser({
      ...user,
      email
    });
  };
  const onChangePhoneNumber = event => {
    const phoneNumber = event.target.value;

    setUser({
      ...user,
      phoneNumber
    });
  };

  async function submitUserInfo(event) {
    event.preventDefault();
    const { firstName, lastName, email, phoneNumber } = user;

    await axios.post(`${API_URL}/user/update`,
      {
        userId,
        firstName,
        lastName,
        email,
        phoneNumber
      },
      { headers: { 'Content-Type': 'application/json' } })
      .then(res => {
        console.log(res);
        Swal.fire({
          icon: 'success',
          title: 'User updated!',
          showConfirmButton: false,
          timer: 2000
        })
      })
      .catch(err => {
        console.log(err);
      });
  }



  //update Password

  const onChangePassword = event => {
    const password = event.target.value;

    setPassword(password);
  }

  const onChangeNewPassword = event => {
    const newPassword = event.target.value;

    setNewPassword(newPassword);
  }

  async function submitChangePassword(event) {
    event.preventDefault();

    await axios.post(`${API_URL}/user/update-password`,
      {
        userId,
        password,
        newPassword
      },
      { headers: { 'Content-Type': 'application/json' } }
    )
      .then(res => {
        console.log(res);
        const { data: { success, message } } = res;

        if (message === 'Invalid Password') {
          setIsValidPassword(message)
        } else {
          setIsValidPassword('')
        }
        if (message === 'The password must be at least 8 characters') {
          setIsValidLength(message);
        } else {
          setIsValidLength('');
        }

        if (success) {
          Swal.fire({
            icon: 'success',
            title: 'password has been changed',
            showConfirmButton: false,
            timer: 2000
          })
        }

      })
      .catch(err => {
        console.log(err);
      })
  }

  return (
    <div>
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="primary">
              <h4 className={classes.cardTitleWhite}>Edit User Information</h4>
            </CardHeader>
            <CardBody>
              <form onSubmit={submitUserInfo}>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={6}>
                    <CustomInput
                      labelText="First Name"
                      id="firstName"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        required: true,
                        value: user.firstName,
                        onChange: onChangeFirstName
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={6}>
                    <CustomInput
                      labelText="Last Name"
                      id="lastName"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        required: true,
                        value: user.lastName,
                        onChange: onChangeLastName
                      }}
                    />
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={6}>
                    <CustomInput
                      labelText="Email"
                      id="email"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        type: 'email',
                        required: true,
                        value: user.email,
                        onChange: onChangeEmail
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={6}>
                    <CustomInput
                      labelText="Phone Number"
                      id="phoneNumber"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        required: true,
                        value: user.phoneNumber,
                        onChange: onChangePhoneNumber
                      }}
                    />
                  </GridItem>
                </GridContainer>
                <CardFooter id="card-footer-1">
                  <Button type="submit" color="primary">Update</Button>
                </CardFooter>
              </form>
            </CardBody>            
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="primary">
              <h4 className={classes.cardTitleWhite}>Change Password</h4>
            </CardHeader>
            <CardBody>
              <form onSubmit={submitChangePassword}>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={6}>
                    <CustomInput
                      labelText="Current Password"
                      id="current-password"
                      formControlProps={{
                        fullWidth: true,
                        required: true,
                        value: password,
                        onChange: onChangePassword
                      }}
                      inputProps={{
                        type: 'password'
                      }}
                    />
                  </GridItem>

                  <GridItem xs={12} sm={12} md={6}>
                    <CustomInput
                      labelText="New Password"
                      id="new-password"
                      formControlProps={{
                        fullWidth: true,
                        required: true,
                        value: newPassword,
                        onChange: onChangeNewPassword
                      }}
                      inputProps={{
                        type: 'password'
                      }}
                    />
                  </GridItem>
                  {
                    isValidPassword !== '' &&
                    (
                      <GridItem xs={12} sm={12} md={6}>
                        <InputLabel className={classes.validError}>{isValidPassword}</InputLabel>
                      </GridItem>
                    )
                  }
                  {
                    isValidLength !== '' &&
                    (
                      <GridItem xs={12} sm={12} md={6}>
                        <InputLabel className={classes.validError}>{isValidLength}</InputLabel>
                      </GridItem>
                    )
                  }
                </GridContainer>
                <CardFooter id="card-footer-2">
                  <Button type="submit" color="primary">Update</Button>
                </CardFooter>
              </form>
            </CardBody>
          </Card>
        </GridItem>        
      </GridContainer>
    </div>
  );
}
