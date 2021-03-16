var http = require('http');
var url = require('url');
var fs = require('fs');

http.createServer(function (req, res) {

  var q = url.parse(req.url, true).query;
  var cityname = q.cityname;

  fs.readFile('Node/Weather/form.html', function(err, data) {

    if (err) {
      res.writeHead(404, {'Content-Type': 'text/html'});
      return res.end("404 Not Found");
    } 

    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(data);

    if (cityname!=null) {
        return res.end(cityname)
    }

    else {
        return res.end();
    }

  });

}).listen(3000);

console.log('running on port 3000');