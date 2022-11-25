import React, { useState, useEffect } from "react";
// react plugin for creating charts
import ChartistGraph from "react-chartist";
// @material-ui/core
import { makeStyles } from "@material-ui/core/styles";
/*import Icon from "@material-ui/core/Icon";
// @material-ui/icons
import Store from "@material-ui/icons/Store";
import Warning from "@material-ui/icons/Warning";
import DateRange from "@material-ui/icons/DateRange";
import LocalOffer from "@material-ui/icons/LocalOffer";
import Update from "@material-ui/icons/Update";
import ArrowUpward from "@material-ui/icons/ArrowUpward";
import AccessTime from "@material-ui/icons/AccessTime";
import Accessibility from "@material-ui/icons/Accessibility";
import BugReport from "@material-ui/icons/BugReport";
import Code from "@material-ui/icons/Code";
import Cloud from "@material-ui/icons/Cloud"; */
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
/*import Table from "components/Table/Table.js";
import Tasks from "components/Tasks/Tasks.js";
import CustomTabs from "components/CustomTabs/CustomTabs.js";
import Danger from "components/Typography/Danger.js";*/
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
//import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";
//import CardFooter from "components/Card/CardFooter.js";

//import { bugs, website, server } from "variables/general.js";

import axios from 'axios';
// Select 
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
//import Button from "components/CustomButtons/Button.js";
import Select from '@material-ui/core/Select';

import {
  dailySalesChart,
 // emailsSubscriptionChart,
 // completedTasksChart
} from "variables/charts.js";

import styles from "assets/jss/material-dashboard-react/views/dashboardStyle.js";
import custormStyle from "assets/css/styles.css";
import { setConstantValue } from "typescript";

import { API_URL, getFromStorage, setInStorage } from 'utils/storage.js';

const useStyles = makeStyles(styles);

export default function Dashboard(props) {
  const classes = useStyles();
  const [Seller, setSeller] = useState([]);
  const [Type, setType] = useState([]);  /// seller type
  
  const [ParentType, setParentType] = useState([]);
  const [ChildType, setChildType] = useState([]);
  const [Sales, setSales] = useState([]);

  const [viewType, setViewType] = useState(1);
  const [sellerType, setSellerType] = useState(0);
  const [saleDays, setSaleDays] = useState(1);
  
  /*
  const [TotalNS, setTotalNS] = useState([]);
  const [NS, setNS] = useState([]);
  */
  const [ChartData, setChartData] = useState({
    labels: [],
    series: [],
  });

  const [chartWidth, setChartWidth] = useState(1);

  var Chartist = require("chartist");

  const [ChartOptions, setChartOption] = useState({
    lineSmooth: Chartist.Interpolation.cardinal({
      tension: 0
    }),
    low: 0,
    //high: 2000
    chartPadding: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
    },
    width: chartWidth,
    height: "600px",
  });
  
  /// Chart Data

  useEffect(() => {   // initiate function
    axios.get(`${API_URL}/seller/`)
      .then(({data}) => {
      var temp = [];  // real table value in screen
      var parentType = [];
      var childType = [];
      var sales = [];
      var parentStartType ='';
      var temp = [];

      for(var i=0; i<data.length; i++){
        var value = JSON.stringify(data[i]);
        var obj = JSON.parse(value);
        
        // get parentType & childType       
        if(i==0){
          childType.push(obj.ChildType);
          parentType.push(obj.ParentType);
          parentStartType = obj.ParentType;
        }else{
          var child_type = obj.ChildType;
          var parent_type = obj.ParentType;
          var child_flag = 0;
          var parent_flag = 0;
          // get childType
          for(var c=0; c<childType.length; c++){
            if(childType[c] == child_type){
              child_flag = 0;
              break;
            }else{
              child_flag = 1;
            }
          }
          if(child_flag == 1){
            childType.push(child_type);
          }
          // get parentType
          for(var p=0; p<parentType.length; p++){
            if(parentType[p] == parent_type){
              parent_flag = 0;
              break;
            }else{
              parent_flag = 1;
            }
          }
          if(parent_flag == 1){
            parentType.push(parent_type);
          }
        }         
        
        // get first chart temp
        if(parentStartType == obj.ParentType){          
          temp.push(obj.ParentSellerName);
          sales.push(obj.TotalNS90);
        }
      }
      var length = temp.length*70;
      setChartWidth(length);
      setSeller(data);
      setParentType(parentType);
      setChildType(childType);
      setSales(sales);
      setType(parentType);

      setChartData({
        labels: temp,
        series: [sales]
      });
      setChartOption({
        width: length,
        //height: sales.length,
      });

    }).catch(function (error){
      console.log(error);
    });
  }, [props]);
  
  const chartViewTypeChange = event => {   
    var type = event.target.value;
    if(type == 1){  ///Never change with == 
      setType(ParentType);      
    }else{      
      setType(ChildType); 
    } 
    setViewType(type);
    
    viewChart(type, sellerType, saleDays);
  };
  const chartSellerTypeChange = event => {
    setSellerType(event.target.value);
    viewChart(viewType, event.target.value, saleDays);
  };
  const chartSaleDaysChange = event => {
    setSaleDays(event.target.value);
    viewChart(viewType, sellerType, event.target.value);
  };
  
  function viewChart(type1, type2, sale){
    //console.log(Type);  
    var data = Seller;
    var temp = [];
    var sales = [];
    for(var i=0; i<data.length; i++){
      var value = JSON.stringify(data[i]);
      var obj = JSON.parse(value);
      
      if(type1 == 1){  // parent
        var parentType = ParentType[type2];        
        if( parentType == obj.ParentType){
          temp.push(obj.ParentSellerName);
          if(sale == 1){
            sales.push(obj.TotalNS90);
          }else{
            sales.push(obj.NS90);
          }
        }
      }else{  // child
        var childType = ChildType[type2];
        if(childType == obj.ChildType){
          temp.push(obj.ChildSellerName);
          if(sale == 1){
            sales.push(obj.TotalNS90);
          }else{
            sales.push(obj.NS90);
          }          
        }
      }
    }
  
    setChartData({
      labels: temp,
      series: [sales]
    });   

    var length = temp.length * 70;
    setChartOption({
      width: length,
      //height: sales.length,
    }); 
  }

  return (
    <div>      
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card chart>
            <CardHeader color="success" id="chartgraph">
              <ChartistGraph
                className="ct-chart"
                data={ChartData}
                type="Line"
                options={ChartOptions}
                listener={dailySalesChart.animation}                
              />
            </CardHeader>
            <CardBody>
              {/*<h4 className={classes.cardTitle}>Seller Type</h4> */}
              <div id="select_boxes">
                <FormControl className={classes.formControl} id="select-1">
                  <InputLabel shrink htmlFor="grouped-native-select">View Type</InputLabel>
                  <Select native 
                    defaultValue="" 
                    className={classes.typeTxt}
                    onChange={chartViewTypeChange}
                  >
                    <option className={classes.sellerItems} value={1}>Divisions</option>
                    <option className={classes.sellerItems} value={2}>Individuals</option>       
                  </Select>
                </FormControl>
                <FormControl className={classes.formControl} id="select-2">
                  <InputLabel shrink htmlFor="grouped-native-select">Seller Type</InputLabel>
                  <Select native
                    defaultValue=""
                    onChange={chartSellerTypeChange}
                    className={classes.typeTxt}>
                    {Type.map((prop, key) => {
                      return (
                        <option className={classes.sellerItems} key={key} value={key}>{prop}</option>          
                      );
                    })} 
                  </Select>
                </FormControl>
                <FormControl className={classes.formControl} id="select-3">
                  <InputLabel shrink htmlFor="grouped-native-select">Sales of 90 Days</InputLabel>
                  <Select native 
                    defaultValue="" 
                    className={classes.typeTxt}    
                    onChange={chartSaleDaysChange}
                  >
                    <option className={classes.sellerItems} value={1}>TotalNS90</option>
                    <option className={classes.sellerItems} value={2}>NS90</option>       
                  </Select>
                </FormControl>                
              </div>
            </CardBody>
            {/*<CardFooter chart>
              <div className={classes.stats}>
                <AccessTime /> updated 4 minutes ago
              </div>
            </CardFooter>*/}
          </Card>
        </GridItem>
      </GridContainer>      
    </div>
  );
}
