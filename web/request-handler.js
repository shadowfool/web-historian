var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');
var http = require('./http-helpers.js');
// require more modules/folders here!




exports.handleRequest = function (req, res) {
  var readStaticFileCallback = function(err, content) {
    if (err) {
      res.writeHead(404);
      console.error(err);
      res.end();
      return;
    } else {
      res.writeHead(200);
      res.write(content);
      res.end();
    }
  };
  var url = req.url;
  var method = req.method;
  console.log('requesting:' + method + ' at:' + url);
  if (method === 'GET') {
    if (url === '/') {
      fs.readFile(archive.paths.siteAssets + '/index.html', readStaticFileCallback);
    } else if (url === '/styles.css') {
      fs.readFile(archive.paths.siteAssets + '/styles.css', readStaticFileCallback);
    } else if (url === '/favicon.ico') {
      res.end();
    } else {
      fs.readFile(archive.paths.archivedSites + url, readStaticFileCallback);
    }
  } else if (method === 'POST') {
    archive.isUrlInList(req, res, url);
  }
};
