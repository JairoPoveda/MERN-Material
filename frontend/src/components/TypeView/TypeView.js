import React from "react";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Select from '@material-ui/core/Select';
// css
//import styles from "assets/jss/material-dashboard-react/components/tableStyle.js";
import styles from "assets/jss/material-dashboard-react/components/headerLinksStyle.js";

const useStyles = makeStyles(styles);

export default function CustomTable(props) {
  const classes = useStyles();
  const { typeData } = props;  
  return (
    <Select native defaultValue="" className={classes.typeTxt}>
      {typeData.map((prop, key) => {
        return (
          <option className={classes.sellerItems} value={key}>{prop}</option>          
        );
      })} 
    </Select>      
  );
}
