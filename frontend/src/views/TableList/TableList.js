import React, { useState, useEffect } from "react";
import { makeStyles } from '@material-ui/core/styles';
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Table from "components/Table/Table.js";
import MaterialTable from "components/Table/MaterialTable.js"
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
// connect frontend to backend
import axios from 'axios';
// style
import styles from "assets/jss/material-dashboard-react/components/headerLinksStyle.js";
import custormStyle from "assets/css/styles.css";
// Select 
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Button from "components/CustomButtons/Button.js";
import Select from '@material-ui/core/Select';
/// search
import Search from "@material-ui/icons/Search";
import Input from '@material-ui/core/Input';

import { API_URL, getFromStorage, setInStorage } from 'utils/storage.js';


const useStyles = makeStyles(styles);

export default function TableList(props) {
  const classes = useStyles();
  const [Seller, setSeller] = useState([]);
  const [Temp, setTemp] = useState([]);
  const [Type, setType] = useState([]);
  const [SearchType, setSearchType] = useState(1);
  const [ChildType, setChildType] = useState([]);
  const [ParentType, setParentType] = useState([]);
  const [viewType, setViewType] = useState(1);
  const [sellerType, setSellerType] = useState(0);
  const [saleDays, setSaleDays] = useState(1);
  const [keyword, setKeyword] = useState('');

  useEffect(() => {   // initiate function
    axios.get(`${API_URL}/seller/`)
      .then(({data}) => {
      var temp = [];  // real table value in screen
      var childType = [];
      var parentType = [];
      var parentStartType ='';

      for(var i=0; i<data.length; i++){
        var value = JSON.stringify(data[i]);
        var obj = JSON.parse(value);
        var temp_buf = [];
        
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
        
        // get first view temp
        if(parentStartType == obj.ParentType){
          temp_buf.push(obj.ParentSellerID);
          temp_buf.push(obj.ParentSellerName);   
          temp_buf.push(obj.ParentType);   
          temp_buf.push(obj.ParentGeographyID);
          temp_buf.push(obj.ParentGeographyName);
          temp_buf.push(obj.TotalNS90);
          temp.push(temp_buf);
        }
      }
      setSeller(data);
      setTemp(rank(temp));
      setParentType(parentType);
      setChildType(childType);
      setType(parentType);

    }).catch(function (error){
      console.log(error);
    });
  }, [props]);

  const searchTypeChange = () => event => {
    setSearchType(event.target.value);
  };

  const viewTypeChange = viewType => event => {
    var selected = event.target.value;
    if(selected == 1){  ///Never change with == 
      setViewType(selected);  // adrian
      setType(ParentType);      
    }else{      
      setViewType(selected); // adrian
      setType(ChildType); 
    } 
    setViewType(selected);     
  };
  const sellerTypeChange = sellerType => event => {
    setSellerType(event.target.value);  
  };
  const saleDaysChange = saleDays => event => {
    //setSaleDays(event.target.value);   ///origin my code
    const sales = event.target.value;
    const parse = parseInt(sales, 16);
    setSaleDays(parse);
  };
  
  const viewRank = viewRank => event => {    
    var data = Seller;
    var total = [];
    for(var i=0; i<data.length; i++){
      var value = JSON.stringify(data[i]);
      var obj = JSON.parse(value);
      var temp_buf = [];
      if(viewType == 1){  // parent
        var parentType = ParentType[sellerType];
        if( parentType == obj.ParentType){
          temp_buf.push(obj.ParentSellerID);
          temp_buf.push(obj.ParentSellerName);   
          temp_buf.push(obj.ParentType);   
          temp_buf.push(obj.ParentGeographyID);
          temp_buf.push(obj.ParentGeographyName);
          if(saleDays == 1){
            temp_buf.push(obj.TotalNS90);
          }else{
            temp_buf.push(obj.NS90);
          }          
          total.push(temp_buf);
        }
      }else{  // child
        var childType = ChildType[sellerType];
        if(childType == obj.ChildType){
          temp_buf.push(obj.ChildSellerID);
          temp_buf.push(obj.ChildSellerName);   
          temp_buf.push(obj.ChildType);   
          temp_buf.push(obj.ChildGeographyID);
          temp_buf.push(obj.ChildGeographyName);
          if(saleDays == 1){
            temp_buf.push(obj.TotalNS90);
          }else{
            temp_buf.push(obj.NS90);
          }          
          total.push(temp_buf);
        }
      }
    }
    var table = rank(total);    
    setTemp(table);
  };

  const getKeyword = event => {
    //event.preventDefault();
    setKeyword(event.target.value);
  };


  const doSearch = () => {
    if(keyword == '') return;
    var kkeyword = keyword.trim();
   
    //console.log("Search Type : " + SearchType);
    var data= Seller;
    var temp = [];
    
    for(var i=0; i<data.length; i++){
      var value = JSON.stringify(data[i]);
      var obj = JSON.parse(value);
      kkeyword = kkeyword.toLowerCase();
      var temp_buf = [];
      if(SearchType == 1){              // Search Seller ID
        if(viewType == 1){         
          if(obj.ParentSellerID == kkeyword){          
            temp.push(parentSearchResult(obj));
          }
        }else{
          if(obj.ChildSellerID == kkeyword){
            temp.push(childSearchResult(obj));
          }
        }        
      }else if(SearchType == 2){        // Search Geography ID
        if(viewType == 1){         
          if(obj.ParentGeographyID.toLowerCase() == kkeyword){          
            temp.push(parentSearchResult(obj));
          }
        }else{
          if(obj.ChildGeographyID.toLowerCase() == kkeyword){
            temp.push(childSearchResult(obj));
          }
        }     
      }else{         // Search Geography Name
        if(viewType == 1){         
          if(obj.ParentGeographyName.toLowerCase() == kkeyword){          
            temp.push(parentSearchResult(obj));
          }
        }else{
          if(obj.ChildGeographyName.toLowCase() == kkeyword){
            temp.push(childSearchResult(obj));
          }
        }     
      }      
    }
   setTemp(rank(temp));
  };

  function parentSearchResult(obj){
    var temp_buf = [];
    temp_buf.push(obj.ParentSellerID);
    temp_buf.push(obj.ParentSellerName);   
    temp_buf.push(obj.ParentType);   
    temp_buf.push(obj.ParentGeographyID);
    temp_buf.push(obj.ParentGeographyName);
    if(saleDays == 1){
      temp_buf.push(obj.TotalNS90);
    }else{
      temp_buf.push(obj.NS90);
    }
    return temp_buf;
  }

  function childSearchResult(obj){
    var temp_buf = [];
    temp_buf.push(obj.ChildSellerID);
    temp_buf.push(obj.ChildSellerName);   
    temp_buf.push(obj.ChildType);   
    temp_buf.push(obj.ChildGeographyID);
    temp_buf.push(obj.ChildGeographyName);
    if(saleDays == 1){
      temp_buf.push(obj.TotalNS90);
    }else{
      temp_buf.push(obj.NS90);
    }
    return temp_buf;
  }

  function rank(data){
    data.sort((a,b) => b[5] - a[5]);
    var num = 1;
    var rankNum = [];
    for(var i=0; i<data.length; i++){
      if(i==0){
        rankNum.push(num);
      }else{
        if(data[i][5] !== data[i-1][5]){
          num++;
        }
        rankNum.push(num);
      }
    }
    for(var j=0; j<data.length; j++){
      data[j].unshift(rankNum[j].toString());
    }
    return data;
  }

  return (        
    <GridContainer>         
      <GridItem xs={12} sm={12} md={12}>        
        <Card>
          <CardHeader color="primary" id="cardHeader">
            <h4 className="cardTitleWhite">Rank of Sellers</h4>
            <div className={classes.searchWrapper} id="searchBar" >
              {/*
              <FormControl className={classes.formControl} id="searchType">
                <InputLabel shrink htmlFor="grouped-native-select">Search Fields</InputLabel>
                <Select native 
                  defaultValue="" 
                  className={classes.typeTxt}
                  onChange={searchTypeChange('viewType')}                                     
                >
                  <option className={classes.sellerItems} value={1}>SellerID</option>
                  <option className={classes.sellerItems} value={2}>GeographyID</option>
                  <option className={classes.sellerItems} value={3}>GeographyName</option>
                </Select>
              </FormControl>
              <div style={{display: "inline-flex"}}>
              <Input id="searchInput" placeholder="Search ID & Geography" onChange={getKeyword} />
              <Button color="white" onClick={doSearch} aria-label="edit" justIcon round>
                <Search />
              </Button>
              </div>*/}

            <div className={classes.sellerType}>
              <FormControl className={classes.formControl} id="select-1">
                <InputLabel shrink htmlFor="grouped-native-select">View Type</InputLabel>
                <Select native 
                  defaultValue="" 
                  className={classes.typeTxt}
                  onChange={viewTypeChange('viewType')}                   
                >
                  <option className={classes.sellerItems} value={1}>Divisions</option>
                  <option className={classes.sellerItems} value={2}>Individuals</option>       
                </Select>
              </FormControl>
              <FormControl className={classes.formControl} id="select-2">
                <InputLabel shrink htmlFor="grouped-native-select">Seller Type</InputLabel>
                <Select native
                  defaultValue=""
                  onChange={sellerTypeChange('sellerType')}
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
                  onChange={saleDaysChange('saleDays')}
                >
                  <option className={classes.sellerItems} value={1}>TotalNS90</option>
                  <option className={classes.sellerItems} value={2}>NS90</option>       
                </Select>
              </FormControl>
              <Button className={classes.goBtn} id="goBtn" onClick={viewRank('rank')}>View Rank</Button>
            </div>
            </div>  
          </CardHeader>
          <CardBody>
            {/* <Table tableHeaderColor="primary" tableHead={["Rank", "Seller ID", "Seller Name", "Type", "Seller GeographyID", "Seller GeographyName", "Sales"]} tableData={Temp} /> */}
            <MaterialTable tableHeaderColor="primary" tableHead={["Rank", "Seller ID", "Seller Name", "Type", "Seller GeographyID", "Seller GeographyName", "Sales"]} tableData={Temp} sellerType={viewType} saleType={saleDays}/>
          </CardBody>
        </Card>
      </GridItem>
    </GridContainer>
  );
}