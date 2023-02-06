const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const request = require('request');

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  socket.on('chat message', (msg) => {
    for (let i =0; i < 10; i++) {
      let url = "https://zipcloud.ibsnet.co.jp/api/search";
      let target = msg;
      let option = {
        url: url,
        Headers: {
          "Content-type": "application/json"
        },
        qs: {
          zipcode: target
        },
        json: true
      };
      request.get(option, (error, response, body) => {
        console.log(body);
        let msg = body.results[0].address1 + body.results[0].address2 + body.results[0].address3;
        io.emit('chat message', msg);
      });
    }
  });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});