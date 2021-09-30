var t2json = '{"tournament":{"name":"British Open","year":2001,"award":840000,"yardage":6905,"par":71,"players":[{"lastname":"Montgomerie","firstinitial":"C","score":1,"hole":12},{"lastname":"Fulke","firstinitial":"P","score":-2,"hole":3},{"lastname":"Owen","firstinitial":"G","score":-1,"hole":7},{"lastname":"Parnevik","firstinitial":"J","score":-3,"hole":"finished"},{"lastname":"Ogilvie","firstinitial":"J","score":1,"hole":"finished"},{"lastname":"Cejka","firstinitial":"A","score":-2,"hole":9},{"lastname":"Romero","firstinitial":"E","score":0,"hole":"finished"},{"lastname":"Fasth","firstinitial":"N","score":-4,"hole":16}]}}';

function testLeaderBoard(){
    try{
        let t2 = new Tournament(t2json);
        console.log('PLAYERS--------------------------------------');
        console.log(t2.players.map(p=>{return p.firstinitial + '.' + p.lastname+'|Score:'+p.score+'|Hole:'+p.hole;}));
        console.log('Adding player Desai A. with score -17 and hole 17')
        t2.players.push(new Player('{"lastname":"Desai","firstinitial":"A","score":-17,"hole":17}'));
        console.log('PLAYERS--------------------------------------');
        console.log(t2.players.map(p=>{return p.firstinitial + '.' + p.lastname+'|Score:'+p.score+'|Hole:'+p.hole;}));
        console.log('LEADERBOARD-------------------------------------------');
        console.log(JSON.parse(t2.leaderboard()).map(p=>{return p.firstinitial + '.' + p.lastname+'|Score:'+p.score+'|Hole:'+p.hole;}));
        console.log('Leaderboard should have Desai A. on top');   
    }catch(err){
        console.log(err);
    }
}

function testLeaderBoardNeg(){
    try{
        let t2 = new Tournament(t2json);
        t2.players = null;
        console.log('LEADERBOARD-------------------------------------------');
        console.log('Error is to be thrown - players is null');
        console.log(JSON.parse(t2.leaderboard()).map(p=>{return p.firstinitial + '.' + p.lastname+'|Score:'+p.score+'|Hole:'+p.hole;}));
    }catch(err){
        console.log(err);
    }
}


function testWinner(){
    try{
        let t2 = new Tournament(t2json);
        console.log('PLAYERS--------------------------------------');
        console.log(t2.players.map(p=>{return p.firstinitial + '.' + p.lastname+'|Score:'+p.score+'|Hole:'+p.hole;}));
        console.log('Adding player Desai A. with score -17 and hole 17')
        t2.players.push(new Player('{"lastname":"Desai","firstinitial":"A","score":-17,"hole":17}'));
        console.log('PLAYERS--------------------------------------');
        console.log(t2.players.map(p=>{return p.firstinitial + '.' + p.lastname+'|Score:'+p.score+'|Hole:'+p.hole;}));
        console.log('WINNER--------------------------------------');
        console.log('Winner should be Desai A.');
        console.log(t2.getWinner());   
    }catch(err){
        console.log(err);
    }
}

function testSearchPlayer(){
    try{
        let t2 = new Tournament(t2json);
        console.log('PLAYERS--------------------------------------');
        console.log(t2.players.map(p=>{return p.firstinitial + '.' + p.lastname+'|Score:'+p.score+'|Hole:'+p.hole;}));
        console.log('Adding player Desai A. with score -17 and hole 17')
        t2.players.push(new Player('{"lastname":"Desai","firstinitial":"A","score":-17,"hole":17}'));
        console.log('PLAYERS--------------------------------------');
        console.log(t2.players.map(p=>{return p.firstinitial + '.' + p.lastname+'|Score:'+p.score+'|Hole:'+p.hole;}));
        console.log('Search Player Desai A.--------------------------------------');
        console.log('Player Desai A. should have index 9');
        console.log((t2.searchPlayer('Desai','A')+1),':',t2.players[t2.searchPlayer('Desai','A')]);
    }catch(err){
        console.log(err)
    }
}

function testSearchPlayerNeg(){
    try{
        let t2 = new Tournament(t2json);
        console.log('PLAYERS--------------------------------------');
        console.log(t2.players.map(p=>{return p.firstinitial + '.' + p.lastname+'|Score:'+p.score+'|Hole:'+p.hole;}));
        console.log('Search Player Desai A.--------------------------------------');
        console.log('Error is to be thrown - since player not found');
        console.log((t2.searchPlayer('Desai','A')+1),':',t2.players[t2.searchPlayer('Desai','A')]);
    }catch(err){
        console.log(err)
    }
}

function testPushCore(){
    try{
        let t2 = new Tournament(t2json);
        t2.players = [];
        t2.players.push(new Player('{"lastname":"Desai","firstinitial":"A","score":-17,"hole":"17"}'));
        t2.players.push(new Player('{"lastname":"Chen","firstinitial":"S","score":-17,"hole":"finished"}'));
        t2.players.push(new Player('{"lastname":"Singh","firstinitial":"A","score":3,"hole":"finished"}'));
        console.log('PLAYERS--------------------------------------');
        console.log(t2.players.map(p=>{return p.firstinitial + '.' + p.lastname+'|Score:'+p.score+'|Hole:'+p.hole;}));
        console.log('WINNER--------------------------------------');
        console.log(t2.getWinner());
        console.log('Winner will be Chen S.');
        console.log('Player Desai A. get score -1 in next hole');
        t2.players[t2.searchPlayer('Desai','A')].postScore(-1);
        console.log('PLAYERS--------------------------------------');
        console.log(t2.players.map(p=>{return p.firstinitial + '.' + p.lastname+'|Score:'+p.score+'|Hole:'+p.hole;}));
        console.log('WINNER--------------------------------------');
        console.log(t2.getWinner());
        console.log('Winner will be Desai A.');
    }catch(err){
        console.log(err);
    }
}
function testPushCoreNeg(){
    try{
        let t2 = new Tournament(t2json);
        t2.players.push(new Player('{"lastname":"Chen","firstinitial":"S","score":-17,"hole":"finished"}'));
        t2.players[t2.searchPlayer('Chen','S')].postScore(-1);
        console.log('Error is to be thrown - since player finished game');
    }catch(err){
        console.log(err);
    }
}

function testProjectedScoreByIndividual(){
    try{
        let t2 = new Tournament(t2json);
        t2.players.push(new Player('{"lastname":"Desai","firstinitial":"A","score":-2,"hole":12}'));
        console.log('Calling projectScoreByIndividual on A.Desai. Score should be -3');
        console.log('Player has ' + projectScoreByIndividual(t2, 'Desai', 'A'));
    }catch(err){
        console.log(err);
    }
}

function testProjectedScoreByIndividualOutlier(){
    try{
        let t2 = new Tournament(t2json);
        t2.players.push(new Player('{"lastname":"Desai","firstinitial":"A","score":0,"hole":"0"}'));
        console.log('Calling projectScoreByIndividual on A.Desai. Score should be 0.');
        console.log('Player has ' + projectScoreByIndividual(t2, 'Desai', 'A'));
    }catch(err){
        console.log(err);
    }
}

function testProjectedScoreByHole(){
    try{
        let t2 = new Tournament(t2json);
        t2.players.push(new Player('{"lastname":"Desai","firstinitial":"A","score":-10,"hole":3}'));
        console.log('Calling projectScoreByHole on A.Desai. Score should be -11');
        console.log('Player has ' + projectScoreByHole(t2, 'Desai', 'A'));
    }catch(err){
        console.log(err);
    }
}


function testTournamentCompleted(){
    try{    
        let t2 = new Tournament(t2json);
        console.log('Is Tournament Completed: ' + t2.isTournamentCompleted());

    }catch(err){
        console.log(err);
    }
}
