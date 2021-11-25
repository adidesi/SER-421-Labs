const express = require('express');
const path = require('path');
const {Tournament, Player} = require('./lab1_task2');

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({extended:false}));

let tournaments = [];

function addTournament (newTournament) {
    if( typeof(newTournament)!=Tournament){
        throw Error;
    }
    let tournamentIndex = tournaments.findIndex(tournament => tournament.name == newTournament.name);
    if(tournamentIndex != -1){
        tournaments[tournamentIndex] = newTournament
    } else {
        tournaments.push(newTournament);
    }
}

app.post('/tournament', (req, res)=>{
    res.statusCode = 200;
    res.send({'message': 'Api Working'})
});


app.listen(()=>{
    console.log('Server started. Listening on port: ' + port);    
});


module.exports = app;