
const express = require('express');                                                         //para criação do server e para routing
const app = express();

const axios = require('axios');                                                             //para comunicação com a Api

const bodyParser = require('body-parser');                                                  //para parsing e verificação do corpo do request
const Joi = require('joi');

const morgan = require('morgan');
const rt = require('file-stream-rotator');                                                  //para criação do log
let writer = rt.getStream({filename:"test.log", frequency:"daily", verbose: true});     

app.set('view engine', 'ejs')                                                               //para rendering da página

app.use(bodyParser.urlencoded({ extended: false }));                                        //definição do parser
app.use(bodyParser.json());                                   

app.use(morgan(':method :url :status :response-time ms', { stream: writer }))               //definição do logger

app.get('/', function(req, res){                                                            //route inicial

    res.render('form', {                                                                    //rendering do form.ejs
        city: '',
        temperature: '',
        degree: ''
    });
    
})

app.post('/', function(req, res){                                                           //route de submeter o form

    var cityname = req.body.cityname;                                                       //variaveis do request do form submetido
    var unit = req.body.unit;

    respondWeather(res, cityname, unit);                                                    //invocação da função assíncrona para comunicação com a Api e rendering da página resultante

});

app.get('/api/:city', function(req, res){                                                   //route de get request para a Api com cidade

    var cityname = req.params.city;                                                         //variaveis do request                                               

    handleapiRequest(res, cityname, '');                                                    //invocação da função assíncrona para comunicação com a Api
    
});

app.get('/api/:city/:unit', function(req, res){                                             //route de get request para a Api com cidade e unidade

    var cityname = req.params.city;                                                         //variaveis do request
    var unit = req.params.unit;

    handleapiRequest(res, cityname, unit);                                                  //invocação da função assíncrona para comunicação com a Api

});

app.post('/api', function(req, res){                                                        //route de post request para a Api com corpo de json

    const schema = Joi.object({                                                             //esquema para verificação do json do corpo
        cityname: Joi.string().required(),                                                  //nome da cidade necessária
        unit: Joi.string()                                                                  //unidade opcional
    });

    const result = schema.validate(req.body);                                               //validação do corpo do request

    if (result.error){                                                                      //se não for válido:
        return res.status(400).end();                                                       //response de código 400 (bad request)
    }

    handleapiRequest(res, req.body.cityname, req.body.unit);                                //se não saltou na validação invoca a função assíncrona para comunicação com a Api

});

const port = process.env.PORT || 3000;                                                      //definição do port na porta 3000
app.listen(port, function(){                                                                //inicia o server no port
    console.log(`Listening on port ${port}`);                                               //mensagem na console para informar do port
});

async function respondWeather(res, cityname, unit) {                                        //função assíncrona para comunicação com a Api e rendering da pagina de resposta

    try {
        let response = await axios.get('https://api.openweathermap.org/data/2.5/weather', {     //criação do pedido para a Api do openweathermap.org com axios
                params: {                                                                       //com os parametros: 
                    appid: '2bc0eb60cbe0d0307856124129e7a460',                                  //código de accesso á Api
                    q: cityname,                                                                //nome da cidade
                    units: unit                                                                 //sistema de unidade (metric, imperial ou standard)
                }
            })
            .catch(                                                                         //captura de erro no pedido
                function (error) {
                    return Promise.reject(error);
                }
            );

        switch(unit) {                                                                      //definição do simbolo da unidade da temperatura
            case 'metric':
            var degree = '°C'                                                               //Celsius se sistema é metric
            break;
            case 'imperial':
            var degree = '°F'                                                               //Fahrenheit se sistema é imperial
            break;
            default:
            var degree = 'K'                                                                //Kelvin por default
        }

        let data = response.data;                                                           //dados da resposta
        
        res.render('form', {                                                                //rendering da página form com a resposta
            city: data.name + ":",
            temperature: data.main.temp,
            degree: degree
        });
    } catch (error) {                                                                       //captura de erro
        res.status(400).render('error');                                                    //rendering da página de erro
    }

}

async function handleapiRequest(res, cityname, unit) {                                      //função assíncrona para comunicação com a Api e devolver json no corpo da resposta

    try {
        await axios.get('https://api.openweathermap.org/data/2.5/weather', {                //criação do pedido para a Api do openweathermap.org com axios
                params: {                                                                   //com os parametros:
                    appid: '2bc0eb60cbe0d0307856124129e7a460',                              //código de accesso á Api
                    q: cityname,                                                            //nome da cidade
                    units: unit                                                             //sistema de unidade (metric, imperial ou standard)
                }
            })
            .then(
                function(response){
                    res.end(JSON.stringify(response.data));                                 //response com json do resultado no corpo
                }
            )
            .catch(                                                                         //captura de erro no pedido
                function (error) {
                    return Promise.reject(error);
                }
            );
    } catch (error) {                                                                       //captura de erro
        res.status(400).end();                                                              //response com código 400 (bad request)
    }

}