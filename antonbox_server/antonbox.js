var express = require('express')
var cors = require('cors');
var fs = require('fs');
var bodyParser = require('body-parser')
var app = express();
var port = 3001;
app.use(cors());

var options ={
  key: fs.readFileSync('./server.key'),
  cert: fs.readFileSync('./server.cert')};

var https = require('http').createServer(app);
var io = require('socket.io')(https);

io.origins('http://localhost:* http://antonbox.local:*');

app.io = io;
app.use(bodyParser.json())

var players = {};
var voters = 0;

//States:
//Register
//Vote
var state = 'REGISTER';

app.post('/register',  function(req, res) {
  var request = req.body;
  var unique = !(request.name in players);

  if (state !== 'REGISTER')
  {
    res.status(400).send('Not register period')
  }

  if (unique)
  {
    players[request.name] = ({name: request.name, points: 3, voted: false, ally:true});
    res.status(200).send('Success');
    app.io.emit('players', players);
  }
  else
  {
    res.status(400).send('Player already exists')
  }
});

app.post('/vote',  function(req, res) {
  var request = req.body;
  var exists = request.name in players;

  if (state !== 'VOTE')
  {
    res.status(400).send('Not voting period')
  }

  if (exists)
  {
    if (players[request.name].voted)
    {
      res.status(400).send('Player already voted')
    }

    players[request.name].voted = true;
    players[request.name].ally = request['isAlly'];
    res.status(200).send('Success');
  }
  else
  {
    res.status(400).send('Player does not exists')
  }
});

io.on('connection', function(socket){

  socket.on('number', function(msg){
    io.emit('number', number++);
  });

  socket.on('reset', function(){
    players = [];
    io.emit('players', players);
  });
});


https.listen(port, function(){
  console.log('listening on *:' + port);
});
