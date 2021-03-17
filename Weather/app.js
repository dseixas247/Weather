const express = require('express');
const app = express();
const path = require('path');
var url = require('url');
const unirest = require('unirest');

app.get('/', function(req, res){

    res.sendFile(path.join(__dirname+'/form.html'));
    
})

app.get('/search', function(req, res){

    var q = url.parse(req.url, true).query;
    var cityname = q.cityname;
    var unit = q.unit;

    if(cityname!=''){
        var Request = unirest.post(`https://api.openweathermap.org/data/2.5/weather?appid=2bc0eb60cbe0d0307856124129e7a460&units=${unit}&q=${cityname}`);
 
        Request
            .headers({'Accept': 'application/json', 'Content-Type': 'application/json'})
            .end(function (response) {
                if(unit == 'metric'){
                    unit = 'C';
                }

                else if(unit == 'imperial'){
                    unit = 'F';
                }

                else{
                    unit = 'K';
                }

                if(response.body.cod == 404){
                    console.log("City not valid");
                    res.end("City not valid");
                }
                else{
                    console.log(cityname + ": " + response.body.main.temp + unit);
                    res.end(cityname + ": " + response.body.main.temp + unit);
                }
            })
    }
    else{
        res.end('City not valid');
    }
});

app.get('/api/:cityname', function(req, res){
    cityname = req.params.cityname;

    var Request = unirest.post(`https://api.openweathermap.org/data/2.5/weather?appid=2bc0eb60cbe0d0307856124129e7a460&q=${cityname}`);
 
    Request
        .headers({'Accept': 'application/json', 'Content-Type': 'application/json'})
        .end(function (response) {
            res.end(JSON.stringify(response.body))
        })

});

app.get('/api/:cityname/:unit', function(req, res){
    cityname = req.params.cityname;
    unit = req.params.unit;

    var Request = unirest.post(`https://api.openweathermap.org/data/2.5/weather?appid=2bc0eb60cbe0d0307856124129e7a460&units=${unit}&q=${cityname}`);
 
    Request
        .headers({'Accept': 'application/json', 'Content-Type': 'application/json'})
        .end(function (response) {
            res.end(JSON.stringify(response.body))
        })

});

app.post('/api', function(req, res){

});

const port = process.env.PORT || 3000;
app.listen(port, function(){
    console.log(`Listening on port ${port}`);
});