const request = require('supertest');
const app = require('./index')
it('should run', ()=>{
    console.log('Running Blank Positive Test')
});

describe('Test Add tounament API', ()=>{
    it('POST tournament empty', ()=>{
        return request(app)
        .post('/tournament')
        .expect(400)
        .then(response=>{
            expect(response.body).toEqual(
                expect.objectContaining({
                    message: expect.stringMatching('400 - Bad Request - Improper request')
                })
            )
        });
    });
    it('POST tournament well formed tournament without players', ()=>{
        newTournament = {
            "tournament": {
              "name": "British Open",
              "year": 2001,
              "award": 840000,
              "yardage": 6905,
              "players": []
            }
        }
        return request(app)
        .post('/tournament').send(newTournament)
        .set('Content-Type','application/json')
        .expect(400)
        .then(response=>{
            expect(response.body).toEqual(
                expect.objectContaining({
                    message: expect.stringMatching('400 - Bad Request - Improper request')
                })
            )
        });
    });
    it('POST tournament well formed tournament with players', ()=>{

    });
    it('POST tournament well formed tournament without players', ()=>{
        newTournament = {
            "tournament": {
              "name": "British Open",
              "year": 2001,
              "award": 840000,
              "yardage": 6905,
              "par": 71,
              "players": []
            }
        }
        return request(app)
        .post('/tournament').send(newTournament)
        .set('Content-Type','application/json')
        .expect(200)
        .then(response=>{
            expect(response.body).toEqual(
                expect.objectContaining({
                    message: expect.any(String)
                })
            )
        })
    });
    it('POST tournament well formed tournament with tournament existing with same name', ()=>{

    });
})