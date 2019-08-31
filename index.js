// NEW PROGRESSIVE ENHANCEMENT SERVER
const express = require('express');
const path = require('path');
const http = require('http');
const Handlebars = require('hbs');
const fs = require('fs');
const projectCollection = require('./data.js')
const assetManifest = require('./server/asset.manifest.json');

require('dotenv').config();

const port = normalizePort(process.env.PORT || '3001');
const app = express();
app.use(express.static('./server/assets'));
app.set('views', path.join(__dirname, './server'));
app.set('view engine', 'hbs');

const partialPath = __dirname + '/server/pages/partials';

function getTemplate(name) {
  return fs.readFileSync(`${partialPath}/${name}.hbs`, 'utf8')
}

Handlebars.registerPartial({
  "logo": getTemplate('logo'),
  "header": getTemplate('header'),
  "meta": getTemplate('meta'),
  "video": getTemplate('video'),
  "img": getTemplate('img'),
  "section-header": getTemplate('section-header'),
  "screen-viewer": getTemplate('screen-viewer'),
  "project-nav": getTemplate('project-nav')
});

Handlebars.registerHelper('assetProvider', (path) => {
  if (process.env.NODE_ENV === 'production') {
    const revPath = assetManifest[path];
    const prodPath = process.env.PROD_ASSET_PATH;
    return prodPath + revPath;
  } else {
    return `/${path}`;
  }
});

Handlebars.registerHelper('concatHash', (options) => {
  const str = Object.keys(options.hash).reduce((res, v) => {
    return res += options.hash[v];
  }, '');
  return str;
});

Handlebars.registerHelper('ifEquals', function(arg1, arg2, options) {
  return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
});

app.get('/', function(req, res) {
  res.render('pages/index', {
    url: req.url,
    projects: projectCollection
  });
});

app.get('/profile', function(req, res) {
  res.render('pages/profile', {
    url: req.url,
  });
});

app.get('/projects/:slug', function(req, res) {
  const project = projectCollection.find((project) => project.slug === req.params.slug);

  res.render('pages/project', {
    url: req.url,
    project: project,
    lastProject: getLastProject(project.id),
    nextProject: getNextProject(project.id)
  });
});

function getLastProject(id) {
  let targetId;
  if (id == 0){
    targetId = projectCollection.length - 1;
  } else {
    targetId = id - 1;
  }
  return projectCollection.find((o)=> o.id === targetId);
}

function getNextProject(id) {
  let targetId;
  if (id == projectCollection.length - 1){
    targetId = 0;
  } else {
    targetId = id + 1;
  }
  return projectCollection.find((o)=> o.id === targetId);
}


const server = http.createServer(app);
server.listen(port);
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
