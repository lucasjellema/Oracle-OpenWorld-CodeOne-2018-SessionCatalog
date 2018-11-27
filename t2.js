var request = require("request");
var fs = require("fs");

var options = { method: 'POST',
  url: 'https://events.rainfocus.com/api/search',
  qs: { 'search.sessiontype': '1518466139979001dQkv' },
  headers: 
   { 'Postman-Token': '68bb4b94-78b3-4bb6-81d5-bde5a6e4561d',
     'cache-control': 'no-cache',
     rfwidgetid: 'VEsNDADSTFH5azU4dH1QslO3lhpQTy4U',
     rfapiprofileid: 'K9HkkU5es180AVTifYUgYembIKJ15CMM'
     ,     'content-type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW' },
  formData: 
   { size: '50',
     type: 'session',
     'search.sessiontype': '1527614217434001RBfj',
     from: '0' } };

     var oow2018Filename = 'oow2018-sessions-catalog-PKN.json';

request(options, function (error, response, body) {
  if (error) throw new Error(error);
  var results = JSON.parse(body);
  console.log(" ** Received " + results.sectionList[0].from + "  " + results.sectionList[0].numItems);
  var sessions = results.sectionList[0].items;
  fs.writeFileSync(oow2018Filename, JSON.stringify(sessions, null, '\t'));

  console.log(body);
});
