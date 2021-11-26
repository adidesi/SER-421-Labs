const express = require('express');

const {APIException} = require('./model/APIException');
const {validateTournament, validatePlayer, validateTournamentPlayerMapObj} = require('./utility/validators');
const {addTournament, createPlayer, addPlayerToTournament, removePlayerFromTournament, getTournamentsAccParams, getPlayersAccParams} = require('./service/tournament');
const {errHandler} = require('./service/errorHandler');

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.listen(port, ()=>{
    console.log('Server started. Listening on port: ' + port);    
});

let tournaments = [];
let players = [];

app.get('/', (req, res)=>{
    res.send('Application Working');
});

app.post('/tournament', (req, res)=>{
    errHandler(()=>{
        if(validateTournament(req.body)){
            let flag  = addTournament(req, res, tournaments, players);
            res.statusCode = (flag === 'Created')?201:200;
            res.send({'message': 'Tournament '+flag+' Successfully'});
        } else {
            throw new APIException(400, res, '');
        }
    }, res);
});

app.get('/tournament', (req, res)=>{
    errHandler(()=>{
        let tournamentsRespObj = getTournamentsAccParams(req, res, tournaments);
        res.statusCode = 200;
        res.send(tournamentsRespObj);
    }, res);
});

app.post('/player', (req, res)=>{
    errHandler(()=>{
        if(req.body['player'] && validatePlayer(req.body.player)){
            createPlayer(req.body['player'], res, players);
            res.statusCode = 201;
            res.send({'message': 'Player Created Successfully'});
        } else {
            throw new APIException(400, res, '');
        }
    }, res);
});

app.get('/player', (req, res)=>{
    errHandler(()=>{
        let playersRespObj = getPlayersAccParams(req, res, players);
        res.statusCode = 200;
        res.send(playersRespObj);
    }, res)
});

app.post('/addPlayer', (req, res)=>{
    errHandler(()=>{
        if(validateTournamentPlayerMapObj(req.body)){
            addPlayerToTournament(req, res, tournaments, players);
            res.statusCode = 200;
            res.send({'message': 'Player Added Successfully to Tournament'});
        } else {
            throw new APIException(400, res)
        }
    }, res);
});

app.post('/removePlayer', (req, res)=>{
    errHandler(()=>{
        if(validateTournamentPlayerMapObj(req.body)){
            removePlayerFromTournament(req, res, tournaments, players);
            res.statusCode = 200;
            res.send({'message': 'Player Removed Successfully from Tournament'});
        } else {
            throw new APIException(400, res)
        }
    }, res)
});

function clearTournaments() {
    tournaments = [];
    return tournaments;
}

function clearPlayers() {
    players = [];
    return players;
}

module.exports = {app, clearTournaments, clearPlayers};