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
    } else {
      res.writeHead(200, http.headers);
      res.write(content);
      res.end();
    }
  };
  var url = req.url;
  var method = req.method;
  console.log('requesting:' + method + ' at:' + url);
  if (method === 'GET') {
    if (url === '/') {
      http.serveAssets(archive.paths.siteAssets + '/index.html', readStaticFileCallback);
    } else if (url === '/styles.css') {
      http.serveAssets(archive.paths.siteAssets + '/styles.css', readStaticFileCallback);
    } else if (url === '/favicon.ico') {
      res.end();
    } else {
      http.serveAssets(archive.paths.archivedSites + url, readStaticFileCallback);
    }
  } else if (method === 'POST') {
    var jsonString = '';
    req.on('data', function (data) {
      jsonString += data;
    });

    req.on('end', function () {
      jsonString = jsonString.toString('ascii').slice(4);
      // console.log('data: ', jsonString);
      archive.isUrlArchived(jsonString, function(truthyValue) {
        console.log(truthyValue, jsonString);
        if (!truthyValue) {
          archive.addUrlToList(jsonString, function(message) {
            console.log(message);
          });
        } else {
          http.serveAssets(archive.paths.archivedSites + '/' + jsonString, readStaticFileCallback);
        }
      });
      // else{
      //   archive.addUrlToList(jsonString, function() {
      //     res.writeHead(302, http.headers);
      //     res.end();
      //   });
      // }
    });
  }
};