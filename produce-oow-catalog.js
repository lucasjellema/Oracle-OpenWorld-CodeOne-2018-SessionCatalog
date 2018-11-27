var request = require("request");
var fs = require("fs");

var sessionTypeMap = {
    'BOF': '1518466139979001dQkv'
    , 'BQS': 'bqs'
    , 'BUS': '1519240082595001EpMm'
    , 'CAS': 'casestudy'
    , 'DEV': '1522435540042001BxTD'
    , 'ESS': 'ess'
    , 'FLP': 'flp'
    , 'GEN': 'general'
    , 'HOL': 'hol'
    , 'HOM': 'hom'
    , 'IGN': 'ignite'
    , 'KEY': 'option_1508950285425'
    , 'MTE':'1523906206279002QAu9'
    , 'PKN': '1527614217434001RBfj'
    , 'PRO': '1518464344082003KVWZ'
    , 'PRM': '1518464344082002KM3k'
    , 'TRN': '1518464344082001KHky'
    , 'SIG': 'sig'
    , 'THT': 'ts'
    , 'TLD': '1537894888625001RriS'
    , 'TIP': '1517517756579001F3CR'
    , 'TUT': 'tutorial'
    , 'TRN': '1518464344082001KHky'
}

var options = {
    method: 'POST',
    url: 'https://events.rainfocus.com/api/search',
    qs: { 'search.sessiontype': '1518466139979001dQkv' },
    headers:
    {
        'Postman-Token': '02233225-a381-42b4-9585-ca7e047d141b',
        'cache-control': 'no-cache',
        rfwidgetid: 'KKA8rC3VuZo5clh8gX5Aq07XFonUTLyU',
        rfapiprofileid: 'uGiII5rYGOjoHXOZx0ch4r7f1KzFC0zd',
        'content-type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW'
    },
    formData:
    {
        size: '50',
        type: 'session',
        'search.sessiontype': '1518466139979001dQkv'
        //,        from: '0'
    }
};


var myArgs = process.argv.slice(2);
console.log('myArgs: ', myArgs);

console.log("Processing " + myArgs[0]);


// global array to hold all session data returned to us
var sessions = [];
var totalNumSessions = -1;
// delay between requests
var requestdelay = 3000;
var oow2018Filename = 'oow2018-sessions-catalog' + myArgs[0] + '.json';

function getSessionData(startItem) {
    var localOptions = JSON.parse(JSON.stringify(options)); // clone options
    //localOptions.formData.size = 50
    localOptions.formData.from = startItem
    localOptions.formData['search.sessiontype'] = sessionTypeMap[myArgs[0]]

    console.log("Options.formdata: " + JSON.stringify(localOptions.formData))
    request(localOptions, function (error, response, body) {
        if (error) throw new Error(error);
        var results = JSON.parse(body);
        //{"responseCode":"0","responseMessage":"Success","total":43,"numItems":2,"from":41,"size":50,"items":[{"sessionID":"15260150620330016wki","externalID":"15260150620330016wki","code":"BOF5678","abbreviation":"BOF5678","title":"Women Bridging the Tech Chasm","abstract":"This BOF is a foru
        console.log("Starting at " + localOptions.formData.from);
        if (results.sectionList) {
            console.log(" ** Received " + results.sectionList[0].from + "  " + results.sectionList[0].numItems);
            sessions = sessions.concat(results.sectionList[0].items);
            if (totalNumSessions == -1) { totalNumSessions = results.sectionList[0].total }
            console.log("Total number of items of this type = " + totalNumSessions);

        } else {
            console.log(" ** Received " + results.from + "  " + results.numItems);
            if (results.items) {
                console.log(" ** Received " + results.items.length + " session records ")
                sessions = sessions.concat(results.items);
            }
            if (totalNumSessions == -1) { totalNumSessions = results.total }
            console.log("Total number of items of this type = " + totalNumSessions);
        }
    });

}

// convenience function to delay execution in a Promise style way (see https://medium.com/oracledevs/sequential-asynchronous-calls-in-node-js-using-callbacks-async-and-es6-promises-e92cc849de46)
function delay(t) {
    return new Promise(function (resolve) {
        setTimeout(resolve, t)
    });
}

// the function to call to have the data fetched after some suitable delay for the appropriate call context
var delayedGetSessionData = function (startAt) {
    var startingAt = startAt;
    getSessionData(startingAt)
}

var start = 0;
var ctr = 0;

for (var i = 0; i < 3; i++)
    // delay each request with requestdelay milisecs compared to its predecessor, in order to not overflow the backend server
    delay(requestdelay * ctr++).then(delayedGetSessionData(i * 50));


//when all requests have been made and all responses have been received
//the sessions variable is loaded with all details for all sessions
//and we can serialize it to file
//allow an arbitrary 2.5 seconds for the final request to complete
delay(7500 + requestdelay * ctr++).then(function () {
    fs.writeFileSync(oow2018Filename, JSON.stringify(sessions, null, '\t'));
    console.log("Written file " + oow2018Filename);
})



//getSessionData(30)