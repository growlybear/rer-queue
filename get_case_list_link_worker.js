var url = require('url');
var needle = require('needle');
var cheerio = require('cheerio');

// Pre-installed Iron.io helper module for accessing config and payload variables
var worker = require('node_helper');

// Just checking
console.log("params:", worker.params);
console.log("config:", worker.config);
console.log("task_id:", worker.task_id);


// Fetch the Vic Supreme Court page with the daily Civil Court list link
var page = url.format({
    protocol: 'http',
    hostname: 'www.supremecourt.vic.gov.au',
    pathname: 'home/forms+fees+and+services/registry+services/list+of+civil+cases/'
});

var selector = '#publication a';


// NOTE don't forget to explicity exit on completion
needle.get(page, function (error, response) {

    var link, $;

    // Something bad happened :-(
    if (error) {
        console.error(error);
        process.exit(1);
    }

    // Imperfect response
    else if (response.statusCode !== 200) {
        console.error(
            'GET request failed with response.statusCode:',
            response.statusCode
        );
        process.exit(1);
    }

    // We're good, let's go
    else {
        $ = cheerio.load(response.body);
        link = $(selector).attr('href');

        if (!link) {
            console.error('No Court List link found in document');
        } else {
            console.log(link);
        }

        process.exit(0);
    }
});
