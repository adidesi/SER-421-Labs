const express = require('express');

const {APIException} = require('./model/APIException');
const {validateTournament,validatePlayer} = require('./utility/validators');
const {addTournament} = require('./services/tournament');
const {errHandler} = require('./services/errorHandler')

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.listen(port, ()=>{
    console.log('Server started. Listening on port: ' + port);    
});

module.exports = app;

let tournaments = [];

app.get('/', (req, res)=>{
    res.send('Application Working');
});

app.post('/tournament', (req, res)=>{
    errHandler(()=>{
        if(validateTournament(req.body)){
            let flag = addTournament(req.body, tournaments);
            if(flag === 'Completed'){
                throw new APIException(422, res, 'Completed Tournament with same name already exists')
            }
            res.statusCode = 200;
            res.send({'message': 'Tournament '+flag+' Successfully'});
        } else {
            throw new APIException(400, res, '');
        }
    }, res);
});

app.post('/addPlayer', (req, res)=>{
    errHandler(()=>{
        if(req.body['tournament'] && typeof req.body['tournament'] === 'string' && req.body['tournament'].length > 0
        && req.body['player'] && validatePlayer(req.body.player)){
            console.log('here');
        }
    }, res);
});
