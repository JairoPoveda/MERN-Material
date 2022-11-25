import React from "react";
import classNames from "classnames";
import { Route, Link, withRouter } from 'react-router-dom';
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Hidden from "@material-ui/core/Hidden";
import Poppers from "@material-ui/core/Popper";
import Divider from "@material-ui/core/Divider";
// @material-ui/icons
import Person from "@material-ui/icons/Person";
import Notifications from "@material-ui/icons/Notifications";
import Dashboard from "@material-ui/icons/Dashboard";
import Search from "@material-ui/icons/Search";
// yosuke code
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';


import { API_URL, getFromStorage } from "utils/storage.js";

// core components
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";

import styles from "assets/jss/material-dashboard-react/components/headerLinksStyle.js";

const useStyles = makeStyles(styles);

function AdminNavbarLinks(props) {
  const token = getFromStorage('auth-token');
  const classes = useStyles();
  const [openNotification, setOpenNotification] = React.useState(null);
  const [openProfile, setOpenProfile] = React.useState(null);
  const handleClickNotification = event => {
    if (openNotification && openNotification.contains(event.target)) {
      setOpenNotification(null);
    } else {
      setOpenNotification(event.currentTarget);
    }
  };
  const handleCloseNotification = () => {
    setOpenNotification(null);
  };
  const handleClickProfile = event => {
    if (openProfile && openProfile.contains(event.target)) {
      setOpenProfile(null);
    } else {
      setOpenProfile(event.currentTarget);
    }
  };
  
  const linkSellerTable = event => {
    props.history.push("/admin/table");
    handleCloseProfile();
  };

  const linkSettings = event => {
    props.history.push("/admin/settings");
    handleCloseProfile();
  }

  const handleCloseProfile = () => {
    setOpenProfile(null);
  };

  const handleLogout = () => {
    props.history.push("/login");
    localStorage.removeItem('auth-token');
  };
  
  return (
    <div>
      <div className={classes.manager} id="manager">
        <Button
          color={window.innerWidth > 959 ? "transparent" : "white"}
          justIcon={window.innerWidth > 959}
          simple={!(window.innerWidth > 959)}
          aria-owns={openProfile ? "profile-menu-list-grow" : null}
          aria-haspopup="true"
          onClick={handleClickProfile}
          className={classes.buttonLink}
          id="navBtn"
        >
          <Person className={classes.icons} />
          <Hidden mdUp implementation="css">
              <p className={classes.linkText}>Profile</p>
          </Hidden>
        </Button>
        <Poppers
          open={Boolean(openProfile)}
          anchorEl={openProfile}
          transition
          disablePortal
          className={
            classNames({ [classes.popperClose]: !openProfile }) +
            " " +
            classes.popperNav
          }
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              id="profile-menu-list-grow"
              style={{
                transformOrigin:
                  placement === "bottom" ? "center top" : "center bottom"
              }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleCloseProfile}>
                  <MenuList role="menu">
                    <MenuItem
                      className={classes.dropdownItem}
                      onClick={linkSellerTable}
                    >
                      Seller Table
                      {/*<Link to="/admin/table" id="linkSeller">Seller Table</Link>*/}
                    </MenuItem>
                    <MenuItem
                      className={classes.dropdownItem}
                      onClick={linkSettings}
                    >
                      Settings
                      {/*<Link to="/admin/settings" id="linkSettings">Settings</Link>*/}
                    </MenuItem>
                    <Divider light />
                    <MenuItem
                      onClick={handleLogout}
                      className={classes.dropdownItem}
                    >
                      Logout
                    </MenuItem>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Poppers>
      </div>
    </div>
  );
}


AdminNavbarLinks = withRouter(AdminNavbarLinks);
export default AdminNavbarLinks;