const express = require('express');

const {APIException} = require('./model/APIException');
const {validateTournament, validatePlayer, validateQParamsForGetTournament, validateAddPlayerObj} = require('./utility/validators');
const {addTournament, createPlayer} = require('./service/tournament');
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
            res.statusCode = 200;
            res.send({'message': 'Tournament '+flag+' Successfully'});
        } else {
            throw new APIException(400, res, '');
        }
    }, res);
});

app.get('/tournament', (req, res)=>{
    errHandler(()=>{
        let tournamentsObj = [];
        let queryPresent = validateQParamsForGetTournament(req, res);
        tournaments.forEach(tournament => {
            if(!queryPresent || (tournament.year > req.query.fromYear && tournament.year < req.query.toYear)){
                tournamentsObj.push(tournament.getMetaData()) 
            }
        });
        res.statusCode = 200;
        res.send(tournamentsObj)
    }, res);
});

app.post('/createPlayer', (req, res)=>{
    errHandler(()=>{
        if(req.body['player'] && validatePlayer(req.body.player)){
            createPlayer(req.body['player'], res, players);
            res.statusCode = 200;
            res.send({'message': 'Player Created Successfully'});
        } else {
            throw new APIException(400, res, '');
        }
    }, res);
});


app.post('/addPlayer', (req, res)=>{
    errHandler(()=>{
        if(validateAddPlayerObj(req.body)){
            let tournamentIndex = tournaments.findIndex(tournament => tournament.name === req.body.tournament);
            let playerIndex = players.findIndex(player => {
                return player.lastname === req.body.player.lastname &&
                            player.firstinitial	=== req.body.player.firstinitial;
            });
            if(tournamentIndex === -1){
                if(playerIndex === -1) {
                    throw new APIException(422, res, 'Tournament and Player with given name doesn\'t exist');
                }
                throw new APIException(422, res, 'Tournament with given name doesn\'t exist');
            } else if(playerIndex === -1) {
                throw new APIException(422, res, 'Player with given name doesn\'t exist');
            }
            
            res.statusCode = 200;
            res.send({'message': 'Player Added Successfully to Tournament'});
        } else {
            throw new APIException(400, res)
        }
    }, res);
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