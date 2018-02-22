const express = require('express');
const path = require('path');
const http = require('http');
const Handlebars = require('hbs');
const assetManifest = require('./www/asset.manifest.json');

require('dotenv').config();

const port = normalizePort(process.env.PORT || '3001');
const app = express();

app.use(express.static('./www'));
app.set('views', path.join(__dirname, './www'));
app.set('view engine', 'hbs');

Handlebars.registerHelper('provideAsset', function(context) {
  // return `/assets_rev/${assetManifest[context]}`;
  return process.env.PROD_ASSET_PATH + assetManifest[context];
});
Handlebars.registerHelper('toJSON', function(object){
	return new Handlebars.SafeString(JSON.stringify(object));
});

app.get('*', function(req, res) {
  res.render('index', {
    assetManifest: assetManifest
  });
});



const server = http.createServer(app);
server.listen(9000);
server.on('error', onError);
server.on('listening', onListening);

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }

  return false;
}

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port

  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  console.log('Listening on ' + bind);
}
