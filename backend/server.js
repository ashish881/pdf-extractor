const express = require('express');
const cors = require('cors');
const app = express();
const fileUpload = require('./routes/fileUpload.js');
const fileUpload2 = require('./routes/fileUpload2');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/fileupload', fileUpload);
app.use('/api/fileupload2', fileUpload2);

app.get('/', (req, res) => {
  res.send('working').json(200);
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Serve at http://localhost:${port}`);
});
