var archive = require('../helpers/archive-helpers');
var http = require('http');
// must export 
exports.getIndex = function(url, callback) {
  http.get({host: url, path: '/index.html'}, function(res) {
    var index = '';
    res.on('data', function(d) {
      index += d;
    });
    res.on('end', function(d) {
      callback(index);
    });
  });
  // downloads file
    //in callback when download is done
      // if err do nothing
      // if succ callback(indexData)
};
// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.
