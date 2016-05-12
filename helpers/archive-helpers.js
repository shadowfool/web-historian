var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var handler = require('../web/request-handler.js');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(req, res, url) {
  fs.readFile(this.paths.list, 'utf8', function(err, content) {
    if (err) {
      console.error(err);
      res.end();
    } else {
      this.isUrlInList(content, url, res);
    }
  }.bind(this));
};

exports.isUrlInList = function(content, url, res) {
  content = content.split(' ');
  if (_.indexOf(content, url) === -1) {
    this.addUrlToList(url, res);
  } else {
    //do something
  }
};

exports.addUrlToList = function(url, res) {
  console.log('$$$$url', url);
  fs.appendFile(this.paths.list, url + '\n', function(err) {
    if (err) {
      console.error(err);
    }
    res.writeHead(302);
    res.end();
  });
};

exports.isUrlArchived = function(url, callback) {
  return callback(url);
};

exports.downloadUrls = function(req, res, url) {
  //delegate to worker
    //add url to list
};

exports.serveFile = function(url) {
  return this.paths.archivedSites + url;
};

