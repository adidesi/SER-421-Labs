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

function deletePlayer(newPlayer, response, players){
    let playerIndex = players.findIndex(player => {
        return player.lastname === newPlayer.lastname
                && player.firstinitial	=== newPlayer.firstinitial;
    });
    if(playerIndex === -1) {
        throw new APIException(422, response, 'Player with given name doesn\'t exist');
    } else if (players[playerIndex].tournamentName){
        throw new APIException(422, response, 'Player is already associated with some tournament');
    }
    players.splice(playerIndex, 1);
}

function updatePlayerTournamentMap(req, res, tournaments, players, operation){
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
    if((operation === 'A' && players[playerIndex].tournamentName !== undefined)
        || (operation === 'R' && players[playerIndex].tournamentName !== req.body.tournament)){
        throw new APIException(422, res, 'Player is already associated with some tournament'); 
    }
    players[playerIndex].tournamentName = (operation === 'A')?req.body.tournament:undefined;
    players[playerIndex].score = (operation === 'A')?0:'';
    players[playerIndex].hole = (operation === 'A')?0:'';
    if(operation === 'A')
        tournaments[tournamentIndex].players.push(players[playerIndex]);
    else
        tournaments[tournamentIndex].players.splice(playerIndex, 1);
}

function addPlayerToTournament(req, res, tournaments, players) {
    updatePlayerTournamentMap(req, res, tournaments, players, 'A');
}

function removePlayerFromTournament(req, res, tournaments, players){
    updatePlayerTournamentMap(req, res, tournaments, players, 'R');
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

function updatePlayerScore(req, response, tournaments, players){
    let playerIndex = players.findIndex(player => {
        return player.lastname === req.body.player.lastname
                && player.firstinitial	=== req.body.player.firstinitial;
    });
    if(playerIndex === -1) {
        throw new APIException(422, response, 'Player with given name doesn\'t exist');
    } else if (!players[playerIndex].tournamentName){
        throw new APIException(422, response, 'Player is not associated with some tournament');
    } else if(players[playerIndex].getHole() == 18){
        throw new APIException(422, response, 'Player already finished playing');
    }
    players[playerIndex].postScore(req.body.score);
    let tournamentIndex = tournaments.findIndex(tournament => tournament.name === players[playerIndex].tournamentName);
    tournaments[tournamentIndex].players[
        tournaments[tournamentIndex].searchPlayer(req.body.player.lastname, req.body.player.firstinitial)]
            .postScore(req.body.score);
}

exports.updatePlayerScore = updatePlayerScore;
exports.addTournament = addTournament;
exports.addPlayerToTournament = addPlayerToTournament;
exports.removePlayerFromTournament = removePlayerFromTournament;
exports.createPlayer = createPlayer;
exports.deletePlayer = deletePlayer;
exports.getTournamentsAccParams = getTournamentsAccParams;
exports.getPlayersAccParams = getPlayersAccParams