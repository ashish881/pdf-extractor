const express = require('express');
const multer = require('multer');
const path = require('path');
const fileRouter = express.Router();
const PDFExtract = require('pdf.js-extract').PDFExtract;
const fs = require('fs');

function read_json(json_filename) {
  let rawdata = fs.readFileSync(json_filename);
  // let regex = fs.readFileSync(regex_filename);
  let tags = JSON.parse(rawdata);

  return tags;
}

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

const upload = multer({ storage: storage });//

fileRouter.post('/', upload.single('myFile'), (req, res, next) => {
  const file = req.file;
  const filepath = file.path;
  console.log(file);
  if (!file) {
    const error = new Error('Please upload a file');
    error.httpStatusCode = 400;
    return next(error);
  }
  pdf.extract(filepath, options, (err, data) => {
    function findCommonElement(array1, array2) {
      let temp = {
        name: '',
        description: '',
        string: '',
      };
      for (let i = 0; i < array1.length; i++) {
        for (let j = 0; j < array2.length; j++) {
          if (array1[i].toUpperCase() === array2[j].name.toUpperCase()) {
            temp['name'] = array1[i];
            temp['description'] = array2[j].description;
            temp['string'] = array1.toString();
            disease_set.push(temp);
          }
        }
      }
    }
    const outdata = [];
    const disease_set = [];
    const final = {
      disease: [],
      icd: [],
      other: [],
    };
    var icd_codes_raw = [];
    const count = 0;
    if (err) {
      return res.send(err);
    }
    data['pages'].forEach((d) => {
      d.content.forEach((d) => {
        // outdata.push(d['str']);
        let temp = {
          code: [],
          description: '',
          string: '',
        };
        var icd_codes_raw = d['str'].match(/ICD[-]\d\d\d/g);
        if (icd_codes_raw) {
          var icd_codes_filtered = icd_codes_raw.filter(function (e1) {
            return e1 != null;
          });
          temp.code = [...icd_codes_filtered];
          temp.string = d['str'];
          final.icd.push(temp);
        }
        var words = d['str'].split(' ');
        var disease = read_json(path.join(__dirname, 'disease.json'));
        findCommonElement(words, disease);

        // console.log('-------------------------------');
      });
    });
    final.disease = [...disease_set];
    // console.log(icd_codes_filtered);
    // console.log(final);
    res.json(final);
  });
});

module.exports = fileRouter;
