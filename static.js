var express = require('express');
var serveIndex = require('serve-index');
var app = express();

// var index = serveIndex('public/ftp', {'icons': true})

app.use(express.static(__dirname));
app.use('/', serveIndex(__dirname, { 'icons': true }));

var port = 11111;
console.log(' ** Serving static content on port ' + port);
app.listen(process.env.PORT || 11111);
