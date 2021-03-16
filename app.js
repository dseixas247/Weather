var http = require('http');
var url = require('url');
var fs = require('fs');
var unirest = require('unirest');

http.createServer(function (req, res) {

    var q = url.parse(req.url, true).query;
    var cityname = q.cityname;

    function checkweather(city){
        unirest
        .post('https://api.openweathermap.org/data/2.5/weather?appid=2bc0eb60cbe0d0307856124129e7a460&units=metric&q=' + city)
        .headers({'Accept': 'application/json', 'Content-Type': 'application/json'})
        .end((response) => {
            if(response.body.cod == 404){
                console.log("Cidade não foi encontrada");
            }
            else{
                console.log(city + ": Estão " + response.body.main.temp + " graus Celsius");
            }
        });
    }

    fs.readFile('Node/Weather/form.html', function(err, data) {

        if (err) {
            res.writeHead(404, {'Content-Type': 'text/html'});
            return res.end("404 Not Found");
        } 

        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);

        if(cityname!=null){
            checkweather(cityname);
        }

        res.end();

    });

}).listen(3000);

console.log('running on port 3000');