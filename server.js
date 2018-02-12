var express = require('express');
var path = require('path');

var app = express();

app.use(express.static('./www'));
app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname + '/www/index.html'));
});

app.listen(3001);
