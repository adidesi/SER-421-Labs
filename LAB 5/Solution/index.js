const express = require('express');
const path = require('path');
const {Tournament, Player} = require('./lab1_task2');
const {APIException} = require('./model/APIException')

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.listen(port, ()=>{
    console.log('Server started. Listening on port: ' + port);    
});

module.exports = app;

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

function isObjTournament(jsonStr){
    return Object.keys(jsonStr).length === 1
    && jsonStr.hasOwnProperty('tournament') && typeof(jsonStr['tournament']) === 'object'
    && Object.keys(jsonStr.tournament).length === 6
    && jsonStr.tournament.hasOwnProperty('name') && typeof(jsonStr.tournament['name']) === 'string'
    && jsonStr.tournament.hasOwnProperty('year') && typeof(jsonStr.tournament['year']) === 'number' 
    && jsonStr.tournament.hasOwnProperty('award') && typeof(jsonStr.tournament['award']) == 'number' 
    && jsonStr.tournament.hasOwnProperty('yardage') && typeof(jsonStr.tournament['yardage']) == 'number' 
    && jsonStr.tournament.hasOwnProperty('par') && typeof(jsonStr.tournament['par']) == 'number' 
    && jsonStr.tournament.hasOwnProperty('players') && Array.isArray(jsonStr.tournament['players']);
}

app.get('/', (req, res)=>{
    res.send('Application Working');
})

app.post('/tournament', (req, res)=>{
    try{
        if(isObjTournament(req.body)){
            res.statusCode = 200;
            res.send({'message': 'Api Working'})    
        } else {
            throw new APIException(400, res, '')
        }
    }catch(error){
        if(error instanceof APIException) {
            processError(error)
        } else {
            console.log(error)
            processError(new APIException(500, res, error));
        }
    }
});

function processError (err){
    let msg = '';
    switch(err.statusCode){
      case 400 :
        msg = '400 - Bad Request - Improper request';
        break;
      case 401 :
        msg = '401 - Unauthorized';
        break;
      case 403 :
        msg = '403 - Forbidden';
        break;
      case 404 :
        msg = '404 - Page Not Found';
        break;
      case 405 :
        msg = '405 - Method not Allowed';
        break;
      case 500:
      default :
        err.statusCode = 500;
        msg = '500 - Internal Server Error';
    };
    msg += (err.statusMessage !== '')?' ':'' + err.statusMessage;
    console.log('res', err.res)
    err.responseObject.statusCode = err.statusCode;
    err.responseObject.send({'message':msg});
}