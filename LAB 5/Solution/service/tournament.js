const {Tournament, Player} = require('../model/lab1_task2');
const {APIException} = require('../model/APIException');

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
        flag = 'Added'
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

function addPlayerToTournament(request, response, tournaments) {
    console.log('addPlayerToTournament')
}

exports.addTournament = addTournament;
exports.addPlayerToTournament = addPlayerToTournament;
exports.createPlayer = createPlayer;