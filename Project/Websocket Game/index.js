const websocket = require('ws');
const http = require('http');
const express = require('express');

const port = 52525
const httpServer = http.createServer(express);
const websocketServer = new websocket.Server({ server: httpServer});
let rooms = [];
websocketServer.on('connection', (websocketConn) => {
    let decoder = new TextDecoder("utf-8")
    console.log('connection');
    websocketConn.on('message', (message)=>{
        let decodedMsg = decoder.decode(new Uint8Array(message, 'utf-8'));
        if(decodedMsg.startsWith('R')){
            let clientRoom = rooms.find(room=>room.roomId === decodedMsg.split(':')[1]);
            if(!clientRoom || clientRoom.length == 0){
                console.log('newplayer')
                clientRoom = {
                    roomId: decodedMsg.split('R:')[1],
                    players: [websocketConn]
                }
                rooms.push(clientRoom);
                websocketConn.send('P=1');
            } else {
                console.log('join player')
                clientRoom.players.push(websocketConn);
                rooms.map(room => rooms.find(r => r.roomId === room.roomId) || room);
                websocketConn.send('P=2');
            }
        } else if(decodedMsg.startsWith('M')){
            let clientRoom = rooms.find(room=>room.players.includes(websocketConn)).players.forEach(player=>{
                player.send(decodedMsg);
            });
        } else {
            console.log('else roomid')
        }
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

