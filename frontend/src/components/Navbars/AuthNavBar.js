import React from 'react';

import { Link } from "react-router-dom";

import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
    endButtons: {
        display: 'flex',
        justifyContent: 'flex-end'
    },
    authButtons: {
        textDecoration: 'none',
        color: 'white'
    }
}));

export default function AuthNavBar() {
    const classes = useStyles();

    return (
        <div>
            <AppBar position="static" style={{ backgroundColor: '#535353' }}>
                <Toolbar className={classes.endButtons}>
                    <Link to="/Login" className={classes.authButtons}>
                        <Button color="inherit">Login</Button>
                    </Link>
                    <Link to="/register" className={classes.authButtons}>
                        <Button color="inherit">Register</Button>
                    </Link>
                </Toolbar>
            </AppBar>
        </div>
    )
}