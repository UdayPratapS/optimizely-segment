var express = require('express');  
var app = express();

var request = require('request');

var port = process.env.PORT;
var username = process.env.TOKEN;
//var username = "DiZcjKwEqXRF-DB6p77EQufVdzNLi78VnrEQKNdxKC9wBQTpaLiRQyvNKd-jZR_jHeNF291eneAiIm2S2jUPe2WLRULN69Kfv3bnShHEhOfk3nvMIIktEGgOBik8K_KjyzHSoim0Ph2WE33OWj-Ea__jQVuSQRtChrBn8rXmnXcqXZh9SiSaO7J1VY2EHa7puny5njhKAWep"

var password = '';
var url = 'https://profiles.segment.com/v1/spaces/6lFVaWJT9K/collections/users/profiles/user_id:';
var traits = '/traits';

function callPersonas(completeURL) {
    return new Promise(function(resolve, reject) {
        
        var options = {url: completeURL,  auth: {user: username, password: password }}
        request.get(options, function(err, resp, body) {
            if (err) {
                reject(err);
            } else {
                resolve(JSON.parse(body));
            }
        })
    })
}

function main() {
    app.get('/', (req, res) => {
        var personaId = req.query['personaId'];
        var verbose = req.query['verbose'];

        //if(!personaId) personaId = "cDKAFE9zhjd2FyYn";

        if(personaId != null) {
            var completeURL = url + personaId + traits+"?limit=100";
            var personasPromise = callPersonas(completeURL);
            var cookieString = '';

            //extract industry trait from the completed rest api call.
            personasPromise.then(function (result) {
                userDetails = result;
                if(result['traits'])
                cookieString = result['traits']['purchasers'];
                //console.log(userDetails);
                res.send(userDetails);
                //purchaseraudience
            })

            //set the retrieved industry trait as a cookie.
            personasPromise.then(function () {
                res.cookie('purchasers', cookieString);
                res.sendfile('index.html');
                //res.send('index.html');
            })
        } else{
            //For demo purposes we're just using a screen scraped copy of the Segment home page
            res.sendfile('index.html');
        }

    }, function (err) {
        console.log(err);
    })
}

app.listen(port, () => console.log(`Personas Personalized Segment app listening on port ${port}));
app.use(express.static('public'));
main();
