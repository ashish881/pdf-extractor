import React from 'react';
import ReactExport from 'react-export-excel';
import { Button } from '@material-ui/core';

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

function Download({ userInfo, userTable, age }) {
  return (
    <ExcelFile
      element={
        <Button
          variant="contained"
          color="primary"
          style={{
            width: 200,
            fontFamily: 'Poppins, sans-serif',
            letterSpacing: '2px',
            height: 40,
          }}
        >
          Download
        </Button>
      }
    >
      <ExcelSheet data={userTable} name="RiskScoreTable">
        <ExcelColumn label="ICD Code" value="icd" />
        <ExcelColumn label="ICD Desc" value="description" />
        <ExcelColumn label="DOS" value="-" />
        <ExcelColumn label="HCC" value="hcc_code_v24" />
        <ExcelColumn label="HCC Desc" value="-" />
        <ExcelColumn label="Rx HCC" value="rx_hcc_code_v05" />
        <ExcelColumn label="Risk Score" value="risk_score" />
      </ExcelSheet>
      <ExcelSheet data={userInfo} name="userInfo">
        <ExcelColumn label="Name" value="name" />
        <ExcelColumn label="Age" value="age" />
        <ExcelColumn label="Dob" value="dob" />
        <ExcelColumn label="Gender" value="sex" />
      </ExcelSheet>
    </ExcelFile>
  );
}

export default Download;
