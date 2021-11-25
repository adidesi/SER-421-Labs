const request = require('supertest');
const app = require('./index')
it('should run', ()=>{
    console.log('Running Blank Positive Test')
});

describe('Test Add tounament API', ()=>{
    it('POST tournament empty', ()=>{
        return request(app)
        .post('/tournament')
        .expect(200)
        .then(response=>{
            expect(response.body).toEqual(
                expect.objectContaining({
                    message: expect.any(String)
                })
            )
        })
    });
    it('POST tournament not well formed tournament', ()=>{

    });
    it('POST tournament well formed tournament with players', ()=>{

    });
    it('POST tournament well formed tournament without players', ()=>{

    });
    it('POST tournament well formed tournament with tournament existing with same name', ()=>{

    });
})