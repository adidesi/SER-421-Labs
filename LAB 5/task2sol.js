'use strict';

// functions first
// part c
var projectScoreByIndividual = function(t, lastName, firstInitial) {
    let totalHoles = 18;
    let foundPlayer = t.searchPlayer(lastName, firstInitial);
    let projectedScore = null;

    if (foundPlayer) {
	if (foundPlayer.score == 0) projectedScore = 0;
	else {
            let scoreAsPar = (foundPlayer.score / foundPlayer.getHole()) * (totalHoles - foundPlayer.getHole()) + foundPlayer.score;
            projectedScore = Math.round(scoreAsPar);
	}
    } else {
        console.log('No Player with name - '+ lastName + ', ' + firstInitial + 'was found');
    }

    return projectedScore;
};

// part d
var projectScoreByHole = function(t, lastName, firstInitial){
    let projectedScoreByHole = null;

    // get the average score per hole of all the players in the tournament
    let collectiveRateOfProgress = t.getAverageScorePerHole(lastName, firstInitial);
    //console.log("collectiveRateOfProgress: ", collectiveRateOfProgress);
    let foundPlayer = t.searchPlayer(lastName, firstInitial);
    //console.log("Found player " + foundPlayer.lastname + " with crop: " + collectiveRateOfProgress);
    if (foundPlayer) {
        let totalHoles = 18;

        let value = foundPlayer.score + ((totalHoles - foundPlayer.getHole()) * collectiveRateOfProgress);
        projectedScoreByHole = Math.round(value);
    } else {
        console.log('No Player with name - '+ lastName + ', ' + firstInitial + 'was found');
    }

    return projectedScoreByHole;
};


// part a
// Tournament Type
function Tournament(jsonString){
    let jsonObject = JSON.parse(jsonString);

    this.name = jsonObject.tournament.name;
    this.year = jsonObject.tournament.year;
    this.award = jsonObject.tournament.award;
    this.yardage = jsonObject.tournament.yardage;
    this.par = jsonObject.tournament.par;
    this.players = [];

    // populating the players array
    for (let i=0; i< jsonObject.tournament.players.length; i++) {
        this.players.push(new Player(jsonObject.tournament.players[i].lastname,
            jsonObject.tournament.players[i].firstinitial, jsonObject.tournament.players[i].score,
            jsonObject.tournament.players[i].hole));
    }
}

// Player Type
function Player (lastName, firstInitial, score, hole){
    this.lastname = lastName;
    this.firstinitial = firstInitial;
    this.score = score;
    this.hole = hole;
}

Player.prototype.getHole = function(){
    if (this.hole === "finished"){
        return 18;
    }

    return this.hole;
};

// part b
// function returns the tournament object with players sorted
Tournament.prototype.leaderboard = function( /* Optional */ scoreFunction){
    // sort the players based on the lowest score first and then  by hole (later holes first)
    return JSON.stringify(sortPlayersByScore(this, scoreFunction));
};

Tournament.prototype.projectedLeaderboard = function(scoreFunction) {
    return this.leaderboard(scoreFunction);
};

// part f
Tournament.prototype.printLeaderboard = function( /* Optional */ scoreFunction){
    let sortedList = sortPlayersByScore(this, scoreFunction);

    console.log('---  LEADERBOARD  ---');
    console.log('Player | Score | Hole');
    console.log('_____________________');

    sortedList.forEach(function(player){
        console.log(player.firstinitial + "." + player.lastname + ", Score: " + player.score +
            ", hole: "+ player.hole);
    });

    console.log('_____________________');
};

// part g
Player.prototype.postScore = function(s){
    // update the hole properties
    if (this.hole != "finished") {
	// update the score property
	this.score += s;
	if (this.hole < 17) {
            this.hole += 1;
	} else if (this.hole === 17){
            this.hole = "finished";
	}
    }
};

// part h
Tournament.prototype.isTournamentComplete = function(){
    let allPlayersRoundFinished = this.players.every(function(player){
        return player.hole === "finished";
    });

    if (allPlayersRoundFinished) {
        console.log('Tournament is over');
        let leadPlayers = JSON.parse(this.leaderboard());

        // convert the players[index] into player dataType -- reason being when you parse the json string,
        // properties are copied but not the member function, in this case for getHole() member function;
        this.players = [];
        for(let i=0; i<leadPlayers.length; i++){
            this.players.push(new Player(leadPlayers[i].lastname, leadPlayers[i].firstinitial, leadPlayers[i].score, leadPlayers[i].hole));
        }

        // part i -- assign winnings
	/* Not doing for Fall 21
        this.players[0].winnings = 0.5 * this.award;
        this.players[1].winnings = 0.3 * this.award;
        this.players[2].winnings = 0.2 * this.award;
        for (j=3; j < this.players.length; j++) {
            this.players[j].winnings = 0;
        }
	*/

        // add winner
        Tournament.prototype.winner = leadPlayers[0];

        // add getWinner function
        Tournament.prototype.getWinner = function(){
            return this.winner.lastname;
        };
	return true;
    }
    return false;
};


// utilities function

const v8 = require('v8');
var deepClone = obj => {
  return v8.deserialize(v8.serialize(obj));
};

var sortPlayersByScore = function(t, /* Optional */ scoringFunction) {
    // The first 2 did shallow clones and would change our Tournament's Players!
    // let sortedPlayers = Array.from(t.players);
    // let sortedPlayers = t.players.map((x) => x);
    let sortedPlayers = deepClone(t.players);
    
    // console.log("Using scoringFunction " + scoringFunction.name);
    if (!scoringFunction) {  // if a scoring function is not passed in just use the current score
	scoringFunction = (function(t, lastname, firstinitial){
            let foundPlayer = t.searchPlayer(lastname, firstinitial);
            return foundPlayer.score;
	});
    }
    // I couldn't gt map to work for some reason
    for (let i = 0; i < sortedPlayers.length; i++) {
	sortedPlayers[i].score = scoringFunction(t, sortedPlayers[i].lastname, sortedPlayers[i].firstinitial);
    }

    sortedPlayers.sort(function(a, b){
	//console.log("In sort, scoring function is " + scoringFunction.name + " comparing )
        //let ascore = scoringFunction(t, a.lastname, a.firstinitial);
        //let bscore = scoringFunction(t, b.lastname, b.firstinitial);

        if (a.score == b.score) {
            return b.hole - a.hole;
        }

        return a.score - b.score;
    });

    return sortedPlayers;
};

Tournament.prototype.searchPlayer = function(lastName, firstInitial){
    // function which searches player with given lastName and firstInitial,
    // please note that the first occurrence will be returned, in case of multiple copies
    let found = false;
    let foundPlayer = null;

    for (let i=0; i<this.players.length; i++){
        if (!found){
            if (this.players[i].lastname.toLowerCase() === lastName.toLowerCase()
                && this.players[i].firstinitial.toLowerCase() === firstInitial.toLowerCase()) {

                foundPlayer = this.players[i];
                found = true;
            }
        }
    }

    return foundPlayer;
};

Tournament.prototype.getAverageScorePerHole = function(lastName, firstInitial){
    // calculate the average score per hole all the players in the tournament,
    // we need to account the fact that we would not include the current player
    let totalSum = 0;
    let totalHolesPlayed = 0;
    
    for (let i=0; i< this.players.length; i++) {
	if (!(this.players[i].lastname.toLowerCase() === lastName.toLowerCase()
              && this.players[i].firstinitial.toLowerCase() === firstInitial.toLowerCase())) {
            // account for all the players except this one
	    if (this.players[i].hole == "finished") {
		totalHolesPlayed = totalHolesPlayed + 18;
	    } else {
		totalHolesPlayed = totalHolesPlayed + this.players[i].hole;
	    }
            totalSum = totalSum + this.players[i].score;
	}
    }
    return totalSum/totalHolesPlayed;
};
