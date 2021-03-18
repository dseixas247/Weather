const express = require('express');
const app = express();
const axios = require('axios');
const bodyParser = require("body-parser");
const Joi = require("joi");

app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', function(req, res){

    res.render('form', {
        city: '',
        temperature: '',
        degree: ''
    });
    
})

app.post('/', function(req, res){

    var cityname = req.body.cityname;
    var unit = req.body.unit;

    makeRequest(res, cityname, unit);

});

app.get('/api/:city', function(req, res){

    cityname = req.params.city;

    axios.get('https://api.openweathermap.org/data/2.5/weather', {
            params: {
                appid: '2bc0eb60cbe0d0307856124129e7a460',
                q: cityname,
            }
        })
        .then(
            function(response){
                res.end(JSON.stringify(response.data));
            }
        )
        .catch(
            function (error) {
                res.status(400).end();
                return Promise.reject(error);
            }
        );

});

app.get('/api/:city/:unit', function(req, res){

    cityname = req.params.city;
    unit = req.params.unit;

    axios.get('https://api.openweathermap.org/data/2.5/weather', {
            params: {
                appid: '2bc0eb60cbe0d0307856124129e7a460',
                q: cityname,
                units: unit
            }
        })
        .then(
            function(response){
                res.end(JSON.stringify(response.data));
            }
        )
        .catch(
            function (error) {
                res.status(400).end();
                return Promise.reject(error);
            }
        );

});

app.post('/api', function(req, res){

    const schema = Joi.object({
        cityname: Joi.string().required(),
        unit: Joi.string()
    });

    const result = schema.validate(req.body);

    if (result.error){
        res.status(400).end();
        return;
    }

    axios.get('https://api.openweathermap.org/data/2.5/weather', {
            params: {
                appid: '2bc0eb60cbe0d0307856124129e7a460',
                q: req.body.cityname,
                units: req.body.unit
            }
        })
        .then(
            function(response){
                res.end(JSON.stringify(response.data));
            }
        )
        .catch(
            function (error) {
                res.status(400).end();
            }
        );
    
});


const port = process.env.PORT || 3000;
app.listen(port, function(){
    console.log(`Listening on port ${port}`);
});

async function makeRequest(res, cityname, unit) {

    let response = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
            params: {
                appid: '2bc0eb60cbe0d0307856124129e7a460',
                q: cityname,
                units: unit
            }
        })
        .catch(
            function (error) {
                res.status(400).render('error');
                return Promise.reject(error);
            }
        );

    switch(unit) {
        case 'metric':
          var degree = '°C'
          break;
        case 'imperial':
          var degree = '°F'
          break;
        default:
          var degree = 'K'
    }

    let data = response.data;
    
    console.log(data);

    
    res.render('form', {
        city: data.name + ":",
        temperature: data.main.temp,
        degree: degree
    });
    
}