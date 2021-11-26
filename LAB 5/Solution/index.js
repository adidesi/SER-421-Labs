const express = require('express');

const {APIException} = require('./model/APIException');
const {validateTournament, validatePlayer} = require('./utility/validators');
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
        let queryPresent = false;
        if(Object.keys(req.query).length == 2){
            if(req.query.hasOwnProperty('fromYear') && !isNaN(req.query['fromYear'])){
                if(req.query.hasOwnProperty('toYear') && !isNaN(req.query['toYear'])){
                    queryPresent = true;
                } else {
                    throw new APIException(400, res, '');
                }
            }
            else {
                throw new APIException(400, res, '');
            }
        } else if (Object.keys(req.query).length != 0){
            throw new APIException(400, res, '');
        }
        tournaments.forEach(tournament => {
            if(!queryPresent || (tournament.year > req.query.fromYear && tournament.year < req.query.toYear)){
                tournamentsObj.push(tournament.getMetaData()) 
            }
        });
        res.statusCode = 200;
        res.send(tournamentsObj)
    }, res);
})

app.post('/addPlayer', (req, res)=>{
    errHandler(()=>{
        if(req.body['tournament'] && typeof req.body['tournament'] === 'string'
        && req.body['player'] && validatePlayer(req.body.player)){
            addPlayerToTournament(req, res, tournaments);
            res.statusCode = 200;
            res.send({'message': 'Player Added Successfully to Tournament'});
        }
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

function clearTournaments() {
    tournaments = [];
}

function clearPlayers() {
    players = [];
}



module.exports = {app, clearTournaments, clearPlayers};