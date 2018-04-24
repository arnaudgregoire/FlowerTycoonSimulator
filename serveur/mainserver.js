const express = require('express')
var cors = require('cors')
const app = express()

app.use(cors())

app.get('/', function (req, res) {
  res.json({"reponse": 1})
})

app.listen(8080, function () {
  console.log('listening on port 8080!')
})
