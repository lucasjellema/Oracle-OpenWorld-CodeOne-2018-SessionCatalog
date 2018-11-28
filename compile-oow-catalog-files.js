var jsonata = require("jsonata");
var fs = require("fs");


var oow2018Filename = 'oow2018-sessions-catalog';
var sessionTypes = [
    'BOF'
    , 'BQS'
    , 'BUS'
    , 'CAS'
    , 'DEV'
    , 'ESS'
    , 'FLP'
    , 'GEN'
    , 'HOL'
    , 'HOM'
    , 'IGN'
    , 'KEY'
    , 'MTE'
    , 'PKN'
    , 'PRO'
    , 'PRM'
    , 'TRN'
    , 'SIG'
    , 'THT'
    , 'TLD'
    , 'TIP'
    , 'TUT'
    , 'TRN'
]

var catalog = []
var sessionType = sessionTypes[0]
var expression = jsonata(
    ` $.{
        'code': code
        ,'title': title
        ,'abstract': abstract
        ,'duration': length
        ,'event': eventName
        ,'type': type
        ,'waitlistPeak' : waitlistLimit
        ,'speakers': participants.{'name':(firstName & ' ' & lastName)
                                  , 'company': companyName
                                  , 'jobTitle': jobTitle
                                  , 'biography' : bio
                                  , 'photoURL' : photoURL
                                  , "twitter": attributevalues[attribute_id='twitter'].value
                                  , "designations": attributevalues[attribute_id='specialdesignations'].value
                                  }
        , 'slots' : times.{ 'room': room
                          , 'date': date
                          , 'time': time   
                          , 'roomCapacity' :capacity                  
                          }                             
        , 'levels' :  attributevalues[attribute_id='SessionsbyExperienceLevel'].value
        , 'roles' :  attributevalues[attribute_id='SessionsbyYourRole'].value
        , 'track' :  attributevalues[attribute_id='Track'].value                  
        , 'slidesToDownload' : files. 
                               { "name": filename
                               ,'url':url
                               }
    }
    `);

for (sessionType of sessionTypes) {
    var file = oow2018Filename + sessionType + ".json"
    if (fs.existsSync(file)) {
        console.log("Processing " + sessionType)
        var buf = fs.readFileSync(oow2018Filename + sessionType + ".json");
        var sessions = JSON.parse(buf)

        var result = expression.evaluate(sessions);
        //    console.log(JSON.stringify(result))
        catalog = catalog.concat(result)
    }//if
}//for
fs.writeFileSync(oow2018Filename + '.json', JSON.stringify(catalog, null, '\t'));
