class Player{
	constructor(value){
		if(typeof value ==='object'){
			this.lastname		 = value?.lastname;
			this.firstinitial	 = value?.firstinitial;
			this.score			 = Number(value?.score);
			this.hole			 = value?.hole;
		}else if(typeof value === 'string'){
			let parsedVal = JSON.parse(value);
			this.lastname		 = parsedVal?.lastname;
			this.firstinitial	 = parsedVal?.firstinitial;
			this.score			 = Number(parsedVal?.score);
			this.hole			 = parsedVal?.hole;
		}
	}

	getHole(){
		if(!this.hole)
			throw ('Hole is null');
		return (this.hole !== 'finished') ? this.hole : 18;
	}

	incrementHole(){
		if(this.getHole() == 18){
			throw ('Player already has played 18 holes');
		}else if (this.getHole() == 17){
			this.hole = 'finished';
		}else{
			this.hole++;
		}
	}

	postScore(nextScore){
		if(typeof nextScore !== 'number'){
			throw ('Please provide next score in numeric format only');
		}else if (this.getHole() == 18){
			throw ('Player already has played 18 holes');
		}else{
			this.score += nextScore;
			this.incrementHole();
		}
		
	}
}

class Tournament{
	constructor(value){
		let parsedVal ;
		if(typeof value === 'string'){
			parsedVal = JSON.parse(value);
		} else if(typeof value ==='object'){
			parsedVal = value;
		}
		if(parsedVal.tournament){
			this.name		 = parsedVal?.tournament?.name;
			this.year		 = parsedVal?.tournament?.year;
			this.award		 = parsedVal?.tournament?.award;
			this.yardage 	 = parsedVal?.tournament?.yardage;
			this.par 		 = parsedVal?.tournament?.par;
			this.players 	 = [];
			if(parsedVal.tournament.players)
				parsedVal?.tournament?.players.forEach(player => this.players.push(new Player(player)))
		}
	}
	
	getMetaData(){
		return {
			name		 : this.name,
			year		 : this.year,
			award		 : this.award,
			yardage 	 : this.yardage,
			par          : this.par
		}
	}

	copyPlayers() {
		let newPlayers = [];
		this.players.forEach(player => newPlayers.push(new Player(player)));
		return newPlayers;
	}

	leaderboard(){
		if(!this.players)
			throw ('Players is null');
		else if( this.players.length > 1){
			//Calling copyPlayers() method for creating a copy of array to pass it by value
			let players = this.copyPlayers();
			return JSON.stringify(players.sort((player1, player2) =>{
				// higher score goes goes on top. same score higher hole goes on top
					return ((player1.score - player2.score) !== 0)
								?player1.score - player2.score
								:(player1.getHole > player2.getHole)?-1:1;
				}), null, 2);
		}else{
			return JSON.stringify(this.players, null, 2);
		}
	}
	
	searchPlayer(lastname, firstinitial){
		if (!lastname || !firstinitial){
			throw ('Please provide the last name and first initial of player')
		}else{
			let index = this.players.findIndex(player => player.firstinitial === firstinitial && player.lastname === lastname);
			if(index === -1){
				throw ('Player not Found');
			}else{
				return index;
			}
		}
	}

	getAverageScore(selectedPlayer){
		let totalHole = 0;
		let totalScore = 0;

		this.players
			.filter(player => player.firstinitial !== selectedPlayer.firstinitial && player.lastname !== selectedPlayer.lastname)
			.forEach(player =>{
				totalHole += player.getHole();
				totalScore += player.score;
			});

		return (totalHole == 0) ? 0 : (totalScore / totalHole);
	}

	projectedLeaderboard(projectScoreByXXX){
		let projectedPlayers = this.copyPlayers();
		let ogPlayers = this.copyPlayers();

		//iterating over players but changing projectedplayers as original scores of players will be retained
		//for consistent score projection of other players
		this.players.forEach(player =>{
			let index = projectedPlayers.findIndex(projPlayer=> projPlayer.lastname === player.lastname && projPlayer.firstinitial);
			projectedPlayers[index].score = projectScoreByXXX(this, player.lastname, player.firstinitial);
			projectedPlayers[index].hole = 'finished';
		});
		//Changing value of this.players as leaderboard works on this.players
		this.players = projectedPlayers;
		let jsonLeaderBoard = this.leaderboard();
		//Swapping original value of players for further calculation
		this.players = ogPlayers;
		
		return jsonLeaderBoard;
	}

	getWinner(){
		let winner = {};
		if(!this.players || this.players.length == 0){
			throw ('Players is null')
		}else{
			//JSON.parse as leaderboard returns json.stringify of the value
			winner = JSON.parse(this.leaderboard())[0];
		}
		delete winner.hole;
		delete winner.firstinitial;
		return winner;
	}

	isTournamentCompleted(){
		if(this.players.length > 0 && this.players.filter(player=>player.getHole() !== 18).length == 0){
			this.winner = this.getWinner();
			return true;
		}else{
			return false;
		}
	}
}

Tournament.prototype.printLeaderboard = function( /* Optional */ scoreFunction){
	let players = this.copyPlayers();
    players.sort((player1, player2) => {
	// higher score goes goes on top. same score higher hole goes on top
		return ((player1.score - player2.score) !== 0)
					?player1.score - player2.score
					:(player1.getHole > player2.getHole)?-1:1;
	});

    console.log('---  LEADERBOARD  ---');
    console.log('Player | Score | Hole');
    console.log('_____________________');

    players.forEach(function(player){
        console.log(player.firstinitial + "." + player.lastname + ", Score: " + player.score +
            ", hole: "+ player.hole);
    });

    console.log('_____________________');
};

function projectScoreByIndividual(tournament, lastname, firstinitial){
	if(!(tournament instanceof Tournament)){
		throw ('First parameter is not a tournament')
	}else{
		let player = tournament.players[tournament.searchPlayer(lastname, firstinitial)]
		if(player.getHole() == 18 || player.getHole() == 0){
			return player.score;
		}
		let currentScorePerHole = player.score / player.hole;
		let projectedScore = (18 - player.getHole()) * currentScorePerHole + player.score;
		return Math.round(projectedScore);
	}
}

function projectScoreByHole(tournament, lastname, firstinitial){
	if(!(tournament instanceof Tournament)){
		throw ('First parameter is not a tournament')
	}else{
		let player = tournament.players[tournament.searchPlayer(lastname, firstinitial)];
		let avgScore = tournament.getAverageScore(player);
		console.log('here',player.score + ((18 - player.getHole()) * avgScore))
		return Math.round(player.score + ((18 - player.getHole()) * avgScore));
	}	
}

module.exports = {Tournament, Player};