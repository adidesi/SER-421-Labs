const {Tournament, Player} = require('../model/lab1_task2');
const {APIException} = require('../model/APIException');
const {validateQParamsForGetTournament, validateQParamsForGetPlayer} = require('../utility/validators');

function addTournament (request, response, tournaments, players) {
    let newTournamentObj = new Tournament(request.body);
    let tournamentIndex = tournaments.findIndex(tournament => tournament.name === newTournamentObj.name);
    let flag ;
    if(tournamentIndex != -1){
        if(tournaments[tournamentIndex].isTournamentCompleted()){
            throw new APIException(422, response, 'Completed Tournament with same name already exists');
        }
        tournaments[tournamentIndex] = newTournamentObj;
        flag = 'Updated'
    } else {
        tournaments.push(newTournamentObj);
        flag = 'Created'
    }
    if(newTournamentObj.players.length > 0){
        let copyPlayers = newTournamentObj.copyPlayers();
        copyPlayers.forEach(player => {
            createPlayer(player, response, players, newTournamentObj.name);
        });
    }
    return flag;
}

function createPlayer(newPlayer, response, players, tournamentName = undefined){
    if(tournamentName === undefined){
        newPlayer.score = undefined;
        newPlayer.hole = undefined;
    }
    newPlayer.tournamentName = tournamentName;
    let playerIndex = players.findIndex(player => {
        return player.lastname === newPlayer.lastname &&
                    player.firstinitial	=== newPlayer.firstinitial;
    });
    if(playerIndex === -1){ 
        players.push(newPlayer);
        return 'Added'
    } else {
        throw new APIException(422, response, 'Player already exists');
    }
}

function addPlayerToTournament(req, res, tournaments, players) {
    let tournamentIndex = tournaments.findIndex(tournament => tournament.name === req.body.tournament);
    let playerIndex = players.findIndex(player => {
        return player.lastname === req.body.player.lastname
                && player.firstinitial	=== req.body.player.firstinitial;
    });
    if(tournamentIndex === -1){
        if(playerIndex === -1) {
            throw new APIException(422, res, 'Tournament and Player with given name doesn\'t exist');
        }
        throw new APIException(422, res, 'Tournament with given name doesn\'t exist');
    } else if(playerIndex === -1) {
        throw new APIException(422, res, 'Player with given name doesn\'t exist');
    }
    if(players[playerIndex].tournamentName !== undefined){
        throw new APIException(422, res, 'Player is already associated with a tournament'); 
    }
    players[playerIndex].tournamentName = req.body.tournament;
    players[playerIndex].score = 0;
    players[playerIndex].hole = 0;
    tournaments[tournamentIndex].players.push(players[playerIndex]);
}

function getTournamentsAccParams(req, res, tournaments){
    let tournamentsRespObj = [];
    let queryPresent = validateQParamsForGetTournament(req, res);
    tournaments.forEach(tournament => {
        if(!queryPresent || (tournament.year > req.query.fromYear && tournament.year < req.query.toYear)){
            tournamentsRespObj.push(tournament.getMetaData());
        }
    });
    return tournamentsRespObj;
}

function getPlayersAccParams(req, res, players){
    let playersRespObj = [];
    let querySize = validateQParamsForGetPlayer(req, res);
    players.forEach(player => {
        if(querySize == 1){ 
            if(!player.tournamentName)
                playersRespObj.push(player);
        } else if((querySize == 2)){
            if(player.tournamentName === req.query.tName)
                playersRespObj.push(player);
        } else if(querySize === 3){
            if(player.tournamentName === req.query.tName && player.score < req.query.maxScore)
                playersRespObj.push(player);
        }
    });
    return playersRespObj;
}
exports.addTournament = addTournament;
exports.addPlayerToTournament = addPlayerToTournament;
exports.createPlayer = createPlayer;
exports.getTournamentsAccParams = getTournamentsAccParams;
exports.getPlayersAccParams = getPlayersAccParams