var fs = require('fs');
var path = require('path');

var hyperquest = require('hyperquest');
var s3 = require('s3');

// Pre-installed Iron.io helper module for accessing config and payload variables
var worker = require('node_helper');


var out = fs.createWriteStream('today.pdf');

hyperquest.get('https://s3.amazonaws.com/scheduled-scraper/29-10-2014.pdf')
    .pipe(out)
    .on('close', function () {

        var client = s3.createClient({
            s3Options: {
                accessKeyId: worker.config.AWS_ACCESS_KEY,
                secretAccessKey: worker.config.AWS_SECRET_KEY
            }
        });

        var params = {
            localFile: 'today.pdf',
            s3Params: {
                Bucket: 'scheduled-scraper',
                ACL: 'public-read',
                Key: 'today-1.pdf'
            }
        };

        var uploader = client.uploadFile(params);

        uploader.on('error', function (err) {
            console.error('Unable to upload file to S3:', err.stack);
        });

        uploader.on('end', function () {
            console.log('File upload complete');
        });

        console.log('All done!');

    }).on('error', function (err) {

        console.error('No good. Error message:', err.message);

    });
