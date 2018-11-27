Usage
 
For reasons unknown, if I kept it all in an array and did all of the calls in one session, I got timeouts and errors, so I broke it down into one call per session type (Training, Birds of Feather).  This gives a file per session type, ie
 

There is no distinction in the search between Oracle OpenWorld 2018 and CodeOne.
In the search results you can use the property "event" (value 	"Oracle Code One") to find sessions for CodeOne


node produce-oow-catalog.js BOF
node produce-oow-catalog.js BQS 
node produce-oow-catalog.js BUS 
node produce-oow-catalog.js CAS 
node produce-oow-catalog.js DEV 
node produce-oow-catalog.js GEN 
node produce-oow-catalog.js HOL 
node produce-oow-catalog.js IGN
node produce-oow-catalog.js MTE
node produce-oow-catalog.js MYC 
node produce-oow-catalog.js PKN
node produce-oow-catalog.js PRM 
node produce-oow-catalog.js PRO 
node produce-oow-catalog.js THT 
node produce-oow-catalog.js TIP 
node produce-oow-catalog.js TLD 
node produce-oow-catalog.js TRN
 
note:

PKN, THT, TLD, BQS need different values for rfwidgetid and rfapiprofileid; these are defined in t2.js

Note sure if you want to, but I consolidated the output files using:
 
echo [ > full_oow2018_catalog.json
for each file
  egrep  -v ' (^\[|^\])'  filename >> full_oow2018_catalog.json
  echo ,  >> full_oow2018_catalog.json
done
echo ] >> full_oow2018_catalog.json
 
Not sure if you want to load the JSON into the database and parse it - but if so, the oow_parsing.sql script is a reasonable start.  It has some clob loading and some JSON_TABLE stuff to extract what you could see on my APEX app I did for OOW.
 
