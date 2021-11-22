const websocket = require('ws');
const http = require('http');
const express = require('express');

const port = 52526
const httpServer = http.createServer(express);
const websocketServer = new websocket.Server({ server: httpServer});

websocketServer.on('connection', (websocketConn) => {
    console.log('connection');
    websocketConn.on('message', (message)=>{
        websocketServer.clients.forEach((client)=>{
            if(client !== websocketConn && client.readyState == websocket.OPEN){
                client.send(JSON.stringify(message));
            }
        });
    });
});

httpServer.listen(port, ()=>{
    console.log('Server is on Listening on port ' + port);
})

