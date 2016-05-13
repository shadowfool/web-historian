var CronJob = require('cron').CronJob;
var archive = require('/Users/student/2016-04-web-historian/helpers/archive-helpers.js');
exports.job = new CronJob('59 * * * * *', function() {
  console.log('cron');
  archive.readListOfUrls(function(urlArray) {
    archive.downloadUrls(urlArray);
  });
}, function() {
  console.log('S*%7\'s done');
}, true, 'America/Los_Angeles');