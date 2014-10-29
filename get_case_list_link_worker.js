var url = require('url');
var needle = require('needle');
var cheerio = require('cheerio');

// Pre-installed Iron.io helper module for accessing config and payload variables
var worker = require('node_helper');

var DEFAULTS = {
    // Vic Supreme Court page with the daily Civil Court list link
    page: url.format({
        protocol: 'http',
        hostname: 'www.supremecourt.vic.gov.au',
        pathname: 'home/forms+fees+and+services/registry+services/list+of+civil+cases/'
    }),
    selector: '#publication a'
};

var page = DEFAULTS.page;
var selector = DEFAULTS.selector;

// Override defaults if parameters are provided
if (worker.params) {
    if (worker.params.url) {
        page = worker.params.url;
    }
    if (worker.params.selector) {
        selector = worker.params.selector;
    }

    // If neither url nor selector are specified, you're doing it wrong ;-)
    if (!worker.params.url && !worker.params.selector) {
        console.error(
            'Invalid params. Object must specify url and/or selector: ' +
            '{ url: url, selector: selector }'
        );
        process.exit(1);
    }
}

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
            'GET request failed with status code:',
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
        }
        else {
            console.log(link);
        }

        process.exit(0);
    }
});
