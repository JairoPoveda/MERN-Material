import React, { useState, useEffect } from 'react';
import MaterialTable from 'material-table';
import { API_URL } from 'utils/storage.js'
import Axios from 'axios';
import custormStyle from "assets/css/styles.css";
//sweet Alert
import Swal from 'sweetalert2'

export default function MaterialTableDemo(props) {

  const [headers, setHeaders] = useState([{}]);
  const [dataColumns, setDataColumns] = useState([{}]);
  const [sales, setSales] = useState(0);

  const { tableHead, tableData, Sales, sellerType, saleType } = props;

  useEffect(() => {
    const auxColumns = [];

    const headerColums = tableHead.map(value => {
      const toLower = value.toLowerCase();
      const undersCope = toLower.replace(/ /g, "_");
      let editableField = 'onUpdate';

      return {
        title: value,
        field: undersCope,
        editable: editableField
      }
    })

    for (let i = 0; i < tableData.length ; i++) {
      const aux = tableData[i];
      const data = {};
      for (let j = 0; j < aux.length - 1; j++) {
        data = {
          rank: aux[0],
          seller_id: aux[1],
          seller_name: aux[2],
          type: aux[3],
          seller_geographyid: aux[4],
          seller_geographyname: aux[5],
          sales: aux[6]
        }
      }
      auxColumns.push(data);
    }

    setHeaders(headerColums);
    setDataColumns(auxColumns);
    setSales(Sales);
  }, [props]);

  const updateSeller = seller => {    
    Axios.post(`${API_URL}/seller/update-seller`, {
      seller,
      sellerType,
      saleType
    }, { headers: { 'Content-Type': 'application/json' } })
      .then(res => {
        const { data: { success } } = res;

        if (success) {
          Swal.fire({
            icon: 'success',
            title: 'User updated!',
            showConfirmButton: false,
            timer: 2000
          })
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'User not found',
            showConfirmButton: false,
            timer: 2000
          })
        }
        return res.data;
      })
      .catch(err => {
        console.log(err);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong!',
          showConfirmButton: false,
          timer: 2000
        })
      })
  }

  return (
    <MaterialTable
      style={{ boxShadow: 'none' }}
      title={''}
      columns={headers}
      data={dataColumns}
      editable={{ 
      
        onRowUpdate: (newData, oldData) =>
          new Promise(resolve => {
            setTimeout(() => {
              resolve();
              const data = [...dataColumns];
              data[data.indexOf(oldData)] = newData;
              updateSeller(newData);
              setDataColumns(data);
            }, 600);
          }),
      }}
      options={{
        actionsColumnIndex: -1,
        search: true,
        cellStyle: {
          width: '30px'
        },
        headerStyle: {
          color: '#A13BB6',
        
        },
        paginationType: 'stepped'
      }}
    />
  );
}