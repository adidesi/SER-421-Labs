
const {APIException} = require('./model/APIException');
const {SurveyService} = require('./service/survey');
const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const path = require('path');

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'secret-key-ser421-lab3',
    resave: false,
    saveUninitialized: false
}));
app.use(cookieParser());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname + '/views'));

questions = [];
allAnswers = [
    {'username':'a', 'answer':[0,0,0,1,0]},
    {'username':'b', 'answer':[1,1,0,1,0]},
    {'username':'c', 'answer':[1,0,0,1,0]},
    {'username':'d', 'answer':[0,1,0,0,1]},
    {'username':'e', 'answer':[1,0,1,0,1]}
];

// ----------------------ROUTES---------------------------
app.get(['/', '/index.jsp'], (req, res) => {
    errHandler(()=>{
        if(questions.length == 0){
            questions = SurveyService.populateSurvey(res);
        }
        res.sendFile(path.join(__dirname, '/html', 'index.html'));
    }, res);
});

app.all(['/', '/index.jsp'], (req, res) => {
    errHandler(()=>{
        throw new APIException(405, res, '');
    }, res);
});

app.get('/controller', (req, res) => {
    errHandler(()=>{
        if(req.query.action = 'survey'){
            res.render('survey/survey', SurveyService.renderSurvey(req.session, req.cookies, questions));
        } else{
            throw new APIException(400, res, '');
        }
    }, res);
});

app.post('/controller', (req, res) => {
    errHandler(()=>{
        if(req.body.action == 'survey'){
            handleSurveyAction(req, res);
        } else if(req.body.action == 'setpreferences'){
            setCookieAndRedirect(req, res);
        } else if(req.body.action == 'match'){
            getMatchesForUser(req, res);
        } else {
            throw new APIException(400, res, '');
        }
    }, res);
});

app.get('/preferences.jsp', (req, res) => {
    errHandler(()=>{
        res.render('prefs/prefs', { preferences: (req.cookies['preference'])? req.cookies['preference']: 'horizontal' });
    }, res)
});

app.all('/preferences.jsp', (req, res) => {
    errHandler(()=>{
        throw new APIException(405, res, '');
    }, res);
});

app.all('*', function(req, res){
    errHandler(()=>{
        throw new APIException(404, res, '');
    }, res);
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
})
// ----------------------ROUTES---------------------------

handleSurveyAction = (req, res)=> {
    if(req.body.username){//username entered
        initializeForUser(req, res);
    } else if(req.body.submit == 'next'){// next button pressed
        if(req.session['pageNumber'] > questions.length){
            throw APIException(400, res, '');
        }
        addAnswer(req, res);
        if(req.session['pageNumber'] == questions.length){
            req.session['pageNumber'] = 1;
            res.clearCookie('preference');
            res.clearCookie('username');
            res.sendFile(path.join(__dirname, '/html', 'endSurvey.html'));
        } else {
            req.session['pageNumber']++;
            res.render('survey/survey', SurveyService.renderSurvey(req.session, req.cookies, questions));
        }
    } else if(req.body.submit == 'previous') {//previous button pressed
        if(req.session['pageNumber'] == 0){
            throw APIException(400, res, '');
        }
        addAnswer(req, res);
        req.session['pageNumber']--;
        res.render('survey/survey', SurveyService.renderSurvey(req.session, req.cookies, questions));
    } else{
        throw APIException(400, res, '');
    }
}

addAnswer = (req, res) => {
    let reqAnswer = req.body.answer
    if(!req.session['answer']) {
        throw new APIException(400, res);
    }
    if(reqAnswer){
        req.session['answer'][req.session['pageNumber'] - 1] = reqAnswer;
        username = req.session['username'];
        allAnswers.splice(allAnswers.findIndex(ans => ans.username == username), 1,
             {'username': username, 'answer': req.session.answer});
    }
}

initializeForUser = (req, res) => {
    if(req.body.submit == 'next' || req.body.submit == 'previous' )
        throw new APIException(400, res, '');
    if(new RegExp('[a-zA-Z]+').test(req.body.username)) {
        req.session['username'] = req.body.username;
        if(req.cookies){
            if(req.cookies['username'] && req.cookies['username'] != req.body.username){
                res.clearCookie('username');
                res.cookie('username',req.body.username,{
                    expires: new Date(Date.now() + 900000),// 15 mins
                    httpOnly: true
                });
                res.clearCookie('preference');
                res.cookie('preference','horizontal',{
                    expires: new Date(Date.now() + 900000),// 15 mins
                    httpOnly: true
                });
                delete req.session['pageNumber'];
                delete req.session['answer'];
            }
        } else {
            res.cookie('username', req.body.username,{
                expires: new Date(Date.now() + 900000),// 15 mins
                httpOnly: true
            });
            res.cookie('preference', 'horizontal',{
                expires: new Date(Date.now() + 900000),// 15 mins
                httpOnly: true
            });
        }
        if(!req.session['pageNumber']) {
            req.session['pageNumber'] = 1;
        }
        let obj = allAnswers.filter(ans => ans.username == req.body.username);
        if(obj.length > 0){
            req.session['answer'] = obj[0].answer;
        } else {
            req.session['answer'] = [];
            for(i = 0; i< questions.length; i++){
                req.session['answer'][i] = -1;
            }
            allAnswers.push({'username': req.session.username, 'answer': req.session.answer});
        }
        res.render('survey/survey', SurveyService.renderSurvey(req.session, req.cookies, questions));
    } else {
        throw new APIException(400, res, '');
    }
}

getMatchesForUser = (req, res) => {
    if(req.body.username && new RegExp('[a-zA-Z]+').test(req.body.username)) {
        matches = SurveyService.getMatches(req.body.username, allAnswers, questions);
        if(matches.length > 1)
            matches = matches.sort((m1, m2)=>m2.count - m1.count);
        res.render('survey/matches', {'matches':matches, 'username':req.body.username});
    } else {
        throw new APIException(400, res, '');
    }
}

setCookieAndRedirect = (req, res) => {
    res.clearCookie('preference');
    res.cookie('preference',req.body['preference'],{
        expires: new Date(Date.now() + 900000),// 15 mins
        httpOnly: true
    });
    res.clearCookie('username');
    res.cookie('username', req.session['username'], {
        expires: new Date(Date.now() + 900000),// 15 mins
        httpOnly: true                
    })
    res.redirect('/controller?action=survey');
}


errHandler = (fn, res) => {
    try {
        fn();
    } catch(error) {
        if(error instanceof APIException) {
            processError(error)
        } else {
            console.log(error)
            processError(new APIException(500, res, error));
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
    err.responseObject.render('error/err', {errorText:msg});
}