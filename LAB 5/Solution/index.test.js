const request = require('supertest');
const app = require('./index');
it('should run', ()=>{
    console.log('Running Blank Positive Test')
});

describe('Test Add tounament API', ()=>{
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
                "lastname": "Montgomerie",
                "firstinitial": "C",
                "score": -3,
                "hole": "finished"
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
            expect(response.body).toEqual(
                expect.objectContaining({
                    message: expect.stringMatching('422 - Unprocessable Entity Completed Tournament with same name already exists')
                })
            );
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