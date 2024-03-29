var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var handler = require('../web/request-handler.js');
var fetcher = require('../workers/htmlfetcher.js');
var cron = require('../cron.js');


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

exports.readListOfUrls = function(callback) {
  fs.readFile(this.paths.list, 'utf8', function(err, content) {
    if (err) {
      console.error(err);
    } else {
      content = content.split('\n');
      callback(content);
    }
  });
};

exports.isUrlInList = function(url, callback) {
  this.readListOfUrls(function(content) {
    if (_.indexOf(content, url) >= 0) {
      callback(true);
    } else {
      callback(false);
    }
  }); 
};

exports.addUrlToList = function(url, callback) {
  this.isUrlInList(url, function(value) {
    if (value === true) {
      callback('Already in List');
    } else {
      fs.appendFile(this.paths.list, url + '\n', function(err) {
        if (err) {
          console.log(err);
        } else {
          callback('Added to List');
        }
      });
    }
  }.bind(this));
};

exports.isUrlArchived = function(url, callback) {
  console.log(this.paths.archivedSites + '/' + url);
  fs.stat(this.paths.archivedSites + '/' + url, function(err, stats) {
    if (!err) {
      callback(true);
    } else {
      callback(false);
    }
  });
};

exports.downloadUrls = function(urls) {
  console.log(urls);
  _.each(urls, function(url) {
    fetcher.getIndex(url, function(data) {
      fs.writeFile(this.paths.archivedSites + '/' + url, data, {encoding:'utf8'}, function(err) {
        if (err) {
          console.error(err);
        } else {
          console.log('file saved');
          this.readListOfUrls(function(urls) {
            console.log('err 2');
            var urlIndex = _.indexOf(urls, url); 
            urls.splice(urlIndex, 1);
            urls = urls.join('\n');
            fs.writeFile(this.paths.list, urls, function(err) {
              if (err) {
                console.log('err 1');
                console.error(err);
              } else {
                console.log('item removed');
              }
            });
          }.bind(this));
        }
      }.bind(this));
    }.bind(this));
  }.bind(this));
};

