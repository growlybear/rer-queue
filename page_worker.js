var url = require('url');
var needle = require('needle');

// Fetch the Vic Supreme Court page with the daily Civil Court list link
var page = url.format({
    protocol: 'http',
    hostname: 'www.supremecourt.vic.gov.au',
    pathname: 'home/forms+fees+and+services/registry+services/list+of+civil+cases/'
});

// NOTE don't forget to explicity exit on completion
needle.get(page, function (error, response) {
    if (error) {
        console.log(response.body);
        process.exit(1);
    } else if (response.statusCode !== 200) {
        console.log(response.statusCode);
        process.exit(1);
    } else {
        console.log(response.body);
        process.exit(0);
    }
});
