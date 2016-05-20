var redis = require("redis");
var client = redis.createClient(6379, "codetest.stringify.com");

client.auth("lukdebccnclijhthtnlugjdehihnuude");
client.on("connect", function(){
  console.log("connected");
});

client.set("framework", "ReactJS");

var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.set('port', (process.env.PORT || 5678));

app.use('/', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Additional middleware which will set headers that we need on each request.
app.use(function(req, res, next) {
    // Set permissive CORS header - this allows this server to be used only as
    // an API server in conjunction with something like webpack-dev-server.
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Disable caching so we'll always get the latest comments.
    res.setHeader('Cache-Control', 'no-cache');
    next();
});

app.get('/api/lists', function(req, res) {

  client.keys('*', function (err, keys) {
    if (err) {
      return res.status(500).end();
    }
    console.log("res", keys);
    res.send(keys);

  });
});

app.post('/api/lists', function(req, res) {
  console.log("req", req.body.text);
  client.set(req.body.text, true);
  client.keys('*', function (err, keys) {
    if (err) {
      return res.status(500).end();
    }
    console.log("res", keys);

  });
  var lists = keys; 
  lists.push(req.body.text);

res.send(lists);
});


app.listen(app.get('port'), function() {
  console.log('Server started: http://localhost:' + app.get('port') + '/');
});