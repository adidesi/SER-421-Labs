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
    let newTournamentObj = new Tournament(newTournament)
    let tournamentIndex = tournaments.findIndex(tournament => tournament.name === newTournamentObj.name);
    if(tournamentIndex != -1){
        if(tournaments[tournamentIndex].isTournamentCompleted())
            return 'Completed';
        tournaments[tournamentIndex] = newTournamentObj;
        return 'Updated'
    } else {
        tournaments.push(newTournamentObj);
        return 'Added'
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
    && jsonStr.tournament.hasOwnProperty('players') && Array.isArray(jsonStr.tournament['players'])
    && jsonStr.tournament['players'].every(player => {
        return Object.keys(player).length === 4
     && player.hasOwnProperty('lastname') && typeof(player['lastname']) === 'string'
     && player.hasOwnProperty('firstinitial') && typeof(player['firstinitial']) === 'string'
     && player.hasOwnProperty('score') && typeof(player['score']) === 'number'
     && player.hasOwnProperty('hole') && typeof(player['hole']) === 'number' || player['hole'] === 'finished'
    });
}

app.get('/', (req, res)=>{
    res.send('Application Working');
})

app.post('/tournament', (req, res)=>{
    try{
        if(isObjTournament(req.body)){
            let flag = addTournament(req.body);
            if(flag === 'Completed'){
                throw new APIException(422, res, 'Completed Tournament with same name already exists')
            }
            res.statusCode = 200;
            res.send({'message': 'Tournament '+flag+' Successfully'});
        } else {
            throw new APIException(400, res, '');
        }
    }catch(error){
        if(error instanceof APIException) {
            processError(error);
        } else {
            console.log(error);
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
      case 422:
        msg = '422 - Unprocessable Entity';
        break;
      case 500:
      default :
        err.statusCode = 500;
        msg = '500 - Internal Server Error';
    }
    msg += ((err.statusMessage !== '')?' ':'') + err.statusMessage;
    err.responseObject.statusCode = err.statusCode;
    err.responseObject.send({'message':msg});
}