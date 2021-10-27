
const {APIException} = require('./model/APIException');
const {SurveyService} = require('./service/survey')
const express = require('express');
const session = require('express-session');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'secret-key-ser421-lab3',
    resave: false,
    saveUninitialized: false
}))
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname + '/views'));

questions = [];
allAnswers = [];

app.get('/', (req, res) => {
    errHandler(()=>{
        if(questions.length == 0){
            questions = SurveyService.populateSurvey(res);
        }
        res.sendFile(path.join(__dirname, '/html', 'index.html'));
    }, res);
});

app.get('/index.jsp', (req, res) => {
    errHandler(()=>{
        if(questions.length == 0){
            questions = SurveyService.populateSurvey(res);
        }
        res.sendFile(path.join(__dirname, '/html', 'index.html'));
    }, res);
});

app.get('/controller', (req, res) => {
    errHandler(()=>{
        console.log('get controller');
        if(req.query.action = 'survey'){
            console.log('get controller');
            res.render('survey/survey', SurveyService.renderSurvey(req.session, questions));
        } else 
            throw new APIException(400, res, '');
    }, res);
});

app.post('/controller', (req, res) => {
    errHandler(()=>{
        console.log('post controller',req.body.action);
        if(req.body.action == 'survey'){
            console.log('post action 1',req.body.action);
            if(questions.length != 0)
                questions = SurveyService.populateSurvey(res);
            if(req.body.username){
                if(req.body.submit == 'next' || req.body.submit == 'previous' )
                    throw new APIException(400, res, '');    
                if(new RegExp('[a-zA-Z]+').test(req.body.username)) {
                    req.session.username = req.body.username ;
                    if(!req.session.pageNumber) {
                        req.session.pageNumber = 1;
                    }
                    if(!req.session.answer) {
                        req.session.answer = [];
                        for(i = 0; i< questions.length; i++)
                            req.session.answer[i] = -1
                    }
                    // console.log('session', req.session)
                res.render('survey/survey', SurveyService.renderSurvey(req.session, questions));
                } else {
                    throw new APIException(400, res, '');
                }
            } else if(req.body.submit == 'next'){
                console.log('post action 3',req.body.action);
                if(!req.session.answer) {
                    req.session.answer = [];
                    for(i = 0; i< questions.length; i++)
                        req.session.answer[i] = -1
                }
                if(req.body.answer){
                    req.session.answer[req.session.pageNumber - 1 ] = req.body.answer
                }
                if(req.session.pageNumber == questions.length){
                    req.session.pageNumber = 1;
                    res.sendFile(path.join(__dirname, '/html', 'endSurvey.html'));
                } else {
                    req.session.pageNumber++;
                    res.render('survey/survey', SurveyService.renderSurvey(req.session, questions));
                }
            } else if(req.body.submit == 'previous') {
                console.log('post action 3',req.body.action);
                if(!req.session.answer) {
                    req.session.answer = [];
                    for(i = 0; i< questions.length; i++)
                        req.session.answer[i] = NaN
                }
                if(req.body.answer)
                    req.session.answer[req.session.pageNumber - 1 ] = req.body.answer
                if(req.session.pageNumber == 0)
                    throw APIException(400, res, '');
                req.session.pageNumber--;
                res.render('survey/survey', SurveyService.renderSurvey(req.session, questions));
            } else 
                throw APIException(400, res, '');
        } else if(req.body.action == 'setpreferences'){
            console.log('post action 2',req.body.action);
            req.session.preference = req.body.preference; 
            console.log('redirect');
            res.redirect('/controller?action=survey');
        } else
            throw new APIException(400, res, '');
    }, res);
});

app.get('/preferences.jsp', (req, res) => {
    errHandler(()=>{
        res.render('prefs/prefs', { preferences: (req.session.preference)? req.session.preference: 'horizontal' });
    }, res)
});


app.get('*', function(req, res){
    errHandler(()=>{
        throw new APIException(404, res, '');
    }, res);
});

app.post('*', function(req, res){
    errHandler(()=>{
        throw new APIException(404, res, '');
    }, res);
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})


errHandler = (fn, res) => {
    try {
        fn();
    } catch(error) {
        if(error instanceof APIException) {
            processError(error)
        } else {
            console.error(error);
        }
    }
}

processError = (err) => {
    let msg = '';
    switch(err.statusCode){
      case 400 : 
        msg = '400 - Bad Request - Improper request, no action or username present';
        break;
      case 401 : 
        msg = '401 - Unauthorized';
        break;
      case 403 : 
        msg = '403 - Forbidden';
        break;
      case 404 : 
        msg = '404 - Page Not Found';
        break;
      case 405 : 
        msg = '405 - Method not Allowed';
        break;
      case 500:
      default : 
        err.code = 500;
        msg = '500 - Internal Server Error';
    };
    msg += ' ' + err.statusMessage;
    msg +=
    err.responseObject.render('error/err', {errorText:msg});
  }