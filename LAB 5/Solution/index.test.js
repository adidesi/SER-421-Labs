const request = require('supertest');
const {app, clearTournaments, clearPlayers} = require('./index');

describe('Test Create tounament API', ()=>{
    beforeEach(() => {
        clearTournaments();
        clearPlayers();
    });
    it('POST tournament empty', ()=>{
        return request(app)
        .post('/tournament')
        .expect(400)
        .then(response=>{
            expect400Response(response);
        });
    });
    it('POST tournament not well formed tournament without players', ()=>{
        let newTournament = {
            "tournament": {
              "name": "British Open 1",
              "year": 2001,
              "award": 840000,
              "yardage": 6905,
              "players": []
            }
        };
        return request(app)
        .post('/tournament')
        .set('Content-Type','application/json')
        .send(newTournament)
        .expect(400)
        .then(response => {
            expect400Response(response);
        });
    });
    it('POST tournament well formed tournament with players', ()=>{
        let newTournament = {
            "tournament": {
              "name": "British Open 2",
              "year": 2001,
              "award": 840000,
              "yardage": 6905,
              "par": 71,
              "players": [{
                "lastname": "Montgomerie BO2",
                "firstinitial": "C",
                "score": -3,
                "hole": 17
              },
              {
                "lastname": "Fulke BO2",
                "firstinitial": "P",
                "score": -5,
                "hole": "finished"
              }]
            }
        };
        return request(app)
        .post('/tournament')
        .set('Content-Type','application/json')
        .send(newTournament)
        .expect(200)
        .then(response=>{
            expect(response.body).toEqual(
                expect.objectContaining({
                    message: expect.stringMatching('Tournament Added Successfully')
                })
            )
        });
    });
    it('POST tournament well formed tournament without players', ()=>{
        let newTournament = {
            "tournament": {
              "name": "British Open 3",
              "year": 2001,
              "award": 840000,
              "yardage": 6905,
              "par": 71,
              "players": []
            }
        }
        return request(app)
        .post('/tournament')
        .set('Content-Type','application/json')
        .send(newTournament)
        .expect(200)
        .then(response => {
            expect(response.body).toEqual(
                expect.objectContaining({
                    message: expect.stringMatching('Tournament Added Successfully')
                })
            )
        });
    });
    it('POST tournament well formed tournament with not completed tournament existing with same name', ()=>{
        let newTournament = {
            "tournament": {
              "name": "British Open 4",
              "year": 2001,
              "award": 840000,
              "yardage": 6905,
              "par": 71,
              "players": []
            }
        };
        request(app)
        .post('/tournament')
        .set('Content-Type','application/json')
        .send(newTournament)
        .then(response=>{
            expect(response.body).toEqual(
                expect.objectContaining({
                    message: expect.stringMatching('Tournament Added Successfully')
                })
            );
        });

        request(app)
        .post('/tournament')
        .set('Content-Type','application/json')
        .send(newTournament)
        .expect(200)
        .then(response=>{
            expect(response.body).toEqual(
                expect.objectContaining({
                    message: expect.stringMatching('Tournament Updated Successfully')
                })
            )
        });
    });
    it('POST tournament well formed tournament with completed tournament existing with same name', ()=>{
        let newTournament = {
            "tournament": {
              "name": "British Open 5",
              "year": 2001,
              "award": 840000,
              "yardage": 6905,
              "par": 71,
              "players": [{
                "lastname": "Montgomerie BO5",
                "firstinitial": "C",
                "score": -3,
                "hole": "finished"
              },
              {
                "lastname": "Fulke BO5",
                "firstinitial": "P",
                "score": -5,
                "hole": "finished"
              }]
            }
        };
        request(app)
        .post('/tournament')
        .set('Content-Type','application/json')
        .send(newTournament)
        .then(response => {
            expect(response.body).toEqual(
                expect.objectContaining({
                    message: expect.stringMatching('Tournament Added Successfully')
                })
            );
        });

        request(app)
        .post('/tournament')
        .set('Content-Type','application/json')
        .send(newTournament)
        .expect(422)
        .then(response=>{
            expect422Response(response, ' Completed Tournament with same name already exists');
        });
    });
});
describe('Test Create Player API', ()=>{
    beforeEach(() => {
        clearTournaments();
        clearPlayers();
    });
    it('POST Player empty', () =>{
        return request(app)
        .post('/createPlayer')
        .expect(400)
        .then(response=>{
            expect400Response(response);
        });
    });
    it('POST Player not well formed', () =>{
        let newPlayer = {
            "player" : {
                "lastname": "Fulke CP1",
                "score": -5,
                "hole": "finished"
            }
        };
        return request(app)
        .post('/createPlayer')
        .set('Content-Type','application/json')
        .send(newPlayer)
        .expect(400)
        .then(response=>{
            expect400Response(response);
        });
    });
    it('POST Player well formed and doesnt exists in tournament', () =>{
        let newPlayer = {
            "player" : {
                "lastname": "Fulke CP4",
                "score": -5,
                "firstinitial": "P",
                "hole": "finished"
            }
        };
        request(app)
        .post('/createPlayer')
        .set('Content-Type','application/json')
        .send(newPlayer)
        .expect(200)
        .then(response=>{
            expect(response.body).toEqual(
                expect.objectContaining({
                    message : expect.stringMatching('Player Created Successfully')
                })
            )
        });

        newPlayer = {
            "player" : {
                "lastname": "Fulke CP5",
                "score": -5,
                "firstinitial": "P",
                "hole": "finished"
            }
        };
        return request(app)
        .post('/createPlayer')
        .set('Content-Type','application/json')
        .send(newPlayer)
        .expect(200)
        .then(response=>{
            expect(response.body).toEqual(
                expect.objectContaining({
                    message : expect.stringMatching('Player Created Successfully')
                })
            )
        });
    });
    it('POST Player well formed but exists in some tournament', () =>{
        let newPlayer = {
            "player" : {
                "lastname": "Fulke CP3",
                "score": -5,
                "firstinitial": "P",
                "hole": "finished"
            }
        };
        request(app)
        .post('/createPlayer')
        .set('Content-Type','application/json')
        .send(newPlayer)
        .expect(200)
        .then(response=>{
            expect(response.body).toEqual(
                expect.objectContaining({
                    message : expect.stringMatching('Player Created Successfully')
                })
            );
        });

        return request(app)
        .post('/createPlayer')
        .set('Content-Type','application/json')
        .send(newPlayer)
        .expect(422)
        .then(response=>{
            expect422Response(response, ' Player already exists')
        });
    });
});
describe('Retrieve All Tournaments API', ()=>{
    beforeEach(() => {
        clearTournaments();
        clearPlayers();
        let newTournament = {
            "tournament": {
              "name": "British Open 1",
              "year": 2001,
              "award": 840000,
              "yardage": 6905,
              "par": 71,
              "players": [{
                "lastname": "Montgomerie",
                "firstinitial": "C",
                "score": -3,
                "hole": 17
              },
              {
                "lastname": "Fulke",
                "firstinitial": "P",
                "score": -5,
                "hole": "finished"
              }]
            }
        };
        request(app)
        .post('/tournament')
        .set('Content-Type','application/json')
        .send(newTournament)
        .expect(200)
        .then(response => {
            expect(response.body).toEqual(
                expect.objectContaining({
                    message: expect.stringMatching('Tournament Added Successfully')
                })
            )
        });

        newTournament = {
            "tournament": {
              "name": "British Open 2",
              "year": 2002,
              "award": 500000,
              "yardage": 7209,
              "par": 73,
              "players": [{
                "lastname": "Owen",
                "firstinitial": "G",
                "score": -1,
                "hole": "finished"
              },
              {
                "lastname": "Parnevik",
                "firstinitial": "J",
                "score": 0,
                "hole": 12
              }]
            }
        };
        request(app)
        .post('/tournament')
        .set('Content-Type','application/json')
        .send(newTournament)
        .expect(200)
        .then(response => {
            expect(response.body).toEqual(
                expect.objectContaining({
                    message: expect.stringMatching('Tournament Added Successfully')
                })
            )
        });
        newTournament = {
            "tournament": {
              "name": "British Open 3",
              "year": 2005,
              "award": 500000,
              "yardage": 7209,
              "par": 73,
              "players": [{
                "lastname": "Ogilvie",
                "firstinitial": "J",
                "score": 1,
                "hole": "finished"
              },
              {
                "lastname": "Cejka",
                "firstinitial": "A",
                "score": -2,
                "hole": "finished"
              }]
            }
        };
        request(app)
        .post('/tournament')
        .set('Content-Type','application/json')
        .send(newTournament)
        .expect(200)
        .then(response => {
            expect(response.body).toEqual(
                expect.objectContaining({
                    message: expect.stringMatching('Tournament Added Successfully')
                })
            )
        });
    });
    it('GET Tournament empty', () =>{
        return request(app)
        .get('/tournament')
        .expect(200)
        .then(response=>{
            expect(response.body).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        name : expect.any(String),
                        year : expect.any(Number),
                        award : expect.any(Number),
                        yardage : expect.any(Number),
                        par : expect.any(Number),
                    })
                ])
            );
            expect(response.body).toHaveLength(3);
        });
    });
    it('GET Tournament year Range',() => {
        return request(app)
        .get('/tournament')
        .query({ fromYear: 2001, toYear: 2003 })
        .expect(200)
        .then(response=>{
            expect(response.body).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        name : expect.any(String),
                        year : expect.any(Number),
                        award : expect.any(Number),
                        yardage : expect.any(Number),
                        par : expect.any(Number),
                    })
                ])
            );
            expect(response.body).toHaveLength(1);
        });
    });
    it('GET Tournament Incorrect year Range',() => {
        return request(app)
        .get('/tournament')
        .query({ fromYear: 2001 })
        .expect(400)
        .then(response=>{
            expect400Response(response);
        });
    });
    it('GET Tournament Incorrect Params',() => {
        return request(app)
        .get('/tournament')
        .query({ award: 40000 })
        .expect(400)
        .then(response=>{
            expect400Response(response);
        });
    });
});

function expect400Response(response){
    expect(response.body).toEqual(
        expect.objectContaining({
            message: expect.stringMatching('400 - Bad Request - Improper request')
        })
    );
}

function expect422Response(response, msg){
    expect(response.body).toEqual(
        expect.objectContaining({
            message: expect.stringMatching('422 - Unprocessable Entity'+msg)
        })
    );
}