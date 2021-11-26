const express = require('express');

const {APIException} = require('./model/APIException');
const {validateTournament,validatePlayer} = require('./utility/validators');
const {addTournament, createPlayer} = require('./service/tournament');
const {errHandler} = require('./service/errorHandler')

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.listen(port, ()=>{
    console.log('Server started. Listening on port: ' + port);    
});

module.exports = app;

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
