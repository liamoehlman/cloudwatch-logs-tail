var AWS = require('aws-sdk');

AWS.config.loadFromPath('./config.json');

var cloudwatchlogs = new AWS.CloudWatchLogs();

var initialParams = {
  logGroupName: process.argv[2], /* required */
  logStreamName: process.argv[3], /* required */
  startFromHead: false
};

initialParams.startTime = new Date().getTime()-30000;

function getLogs(params) {
    params.endTime = new Date().getTime()-30000;

    cloudwatchlogs.getLogEvents(params, function(error, data) {
        if (error) {
            console.log(error)
        }

        if (data.events.length !== 0) {
            data.events.forEach(function(event) {
                console.log(new Date(event.timestamp) + ' : ' + event.message);
            });
        }

        params.startTime = undefined;

        params.nextToken = data.nextForwardToken;

        setTimeout(getLogs, 2000, params)
    })
}

setTimeout(getLogs, 2000, initialParams);
