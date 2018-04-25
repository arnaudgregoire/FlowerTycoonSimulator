const express = require('express')
var cors = require('cors')
const bodyParser = require("body-parser");

const app = express()

app.use(cors())
app.use(bodyParser.json());

app.post('/', function (req, res) {
  console.log(req.body);
  let fonction = req.body.fonction;
  console.log(fonction);
  res.json({"reponse": 1})
})

app.listen(8080, function () {
  console.log('listening on port 8080!');
})
