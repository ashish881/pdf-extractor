const express = require('express');
const multer = require('multer');
const path = require('path');
const fileRouter = express.Router();
const PDFExtract = require('pdf.js-extract').PDFExtract;
const fs = require('fs');
const json_file = require('./icd_codes');
const icd_data = {
  list: [...json_file],
};
const axios = require('axios');
const json_file_risk = require('./risk_hcc');
const icd_risk_data = {
  list: [...json_file_risk],
};

// SET STORAGE
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now());
  },
});

const pdf = new PDFExtract();

const options = {
  firstPage: 1,
};

const upload = multer({ storage: storage }); //

fileRouter.post('/', upload.array('myFile'), (req, res, next) => {
  const response = [];
  let counter = 0;
  // console.log(req.files);
  const count = () => {
    if (counter === req.files.length) {
      res.send(response);
      return;
    } else {
      setTimeout(() => {
        count();
      }, 2000);
    }
  };
  for (let f of req.files) {
    const file = f;
    const filepath = file.path;
    console.log(req.file);
    if (!file) {
      const error = new Error('Please upload a file');
      error.httpStatusCode = 400;
      return next(error);
    }
    const list = [];
    const final = {
      info: {},
      icd: [],
    };
    final.info['key'] = file.originalname;
    const getInfo = async () => {
      let foundName = false;
      for (let data of list) {
        // console.log(data);
        await axios
          .get(`http://localhost:8080/medical_entities?input_string=${data}`)
          .then((res) => {
            // console.log(res.data);
            if (res.data['entities'] !== [] && res.data !== 'NOT FOUND') {
              for (let d of res.data['entities']) {
                if (d['label'] === 'PERSON') {
                  // console.log(res.data);
                  final.info['name'] = d['entity'];
                  foundName = true;
                  break;
                }
              }
            }
          })
          .catch((err) => console.log(err));
        if (foundName === true) {
          break;
        }
      }
      return final;
    };
    pdf.extract(filepath, options, (err, data) => {
      if (err) {
        return res.send(err);
      }
      data['pages'].forEach((d) => {
        d.content.forEach((d) => {
          // console.log(d['str']);
          list.push(d['str']);
          let temp = {
            key: file.originalname,
            isChecked: true,
            icd: '',
            string: '',
            description: '',
            hcc_code_v24: '',
            rx_hcc_code_v05: '',
            risk_score: 0,
          };
          let match = d['str'].match(/[A-TV-Z][0-9][0-9AB]\.?[0-9A-TV-Z]{0,4}/);
          if (match) {
            // console.log(match);
            let found = false;
            let search = icd_data.list.find((d) => d['icd_code'] === match[0]);
            if (search) {
              temp['icd'] = match[0];
              temp['string'] = match['input'];
              temp.description = search.description;
              temp['hcc_code_v24'] = search['cms_hcc_v24'];
              temp['rx_hcc_code_v05'] = search['rx_hcc_v05'];
              let risk_search = icd_risk_data.list.find(
                (d) => d['HCC_Category_V24'] === search['cms_hcc_v24']
              );
              if (risk_search) {
                temp['risk_score'] = risk_search['Risk_Score'];
              }
              for (let data of final.icd) {
                if (temp.icd === data.icd) {
                  found = true;
                  break;
                }
              }
              if (found === false) {
                final.icd.push(temp);
              }
            }
          }
        });
      });
      for (let data of list) {
        // console.log(data);
        let match = data.match(/([0-9]{2})[/]([0-9]{2})[/]([0-9]{4})/);
        if (match) {
          final.info['dob'] = match[0];
          break;
        }
      }
      for (let data of list) {
        // console.log(data);
        let match = data.match(/^male/gi) || data.match(/^female/gi);
        if (match) {
          final.info['sex'] = match[0];
          break;
        }
      }
      storage._removeFile(req, file, () => {
        console.log('File Removed');
      });
      let str = '';
      list.map((a) => {
        if (a !== '') {
          str += a.trim() + ' ';
        }
      });
      // console.log(str);
      for (let data of icd_data.list) {
        // const pattern = new RegExp(data['description'], 'i');
        if (str.includes(data['description']) === true) {
          // console.log(data['description']);
          let found = false;
          for (let d of final.icd) {
            if (data['icd_code'] === d['icd']) {
              found = true;
              break;
            }
          }
          if (found === false) {
            let temp = {
              key: file.originalname,
              isChecked: true,
              icd: '',
              string: '',
              description: '',
              hcc_code_v24: '',
              rx_hcc_code_v05: '',
              risk_score: 0,
            };
            temp.icd = data['icd_code'];
            // temp.string = data['description'].substr(
            //   0,
            //   Math.round(data['description'].length / 2)
            // );
            temp.string = data['description'];
            temp.description = data['description'];
            temp.hcc_code_v24 = data['cms_hcc_v24'];
            temp.rx_hcc_code_v05 = data['rx_hcc_v05'];
            let risk_search = icd_risk_data.list.find(
              (d) => d['HCC_Category_V24'] === data['cms_hcc_v24']
            );
            if (risk_search) {
              temp.risk_score = risk_search['Risk_Score'];
            }
            final.icd.push(temp);
          }
        }
      }
      // console.log(final);
      getInfo()
        .then((result) => {
          response.push(result);
          counter++;
          console.log(response);
        })
        .catch((err) => console.log(err));
      // res.send(final);
    });
    // count();
  }
  count();
});

module.exports = fileRouter;
