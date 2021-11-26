const {Tournament, Player} = require('../model/lab1_task2');

function addTournament (newTournament, tournaments) {
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


exports.addTournament = addTournament;