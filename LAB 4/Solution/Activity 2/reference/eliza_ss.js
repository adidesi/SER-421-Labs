const fs = require('fs');
const qstring = require('querystring');
const Dictionary = require('./dictionary');
const http = require('http');

var userName;
var log = 'Eliza: Hi, there! What is your name?<br>';

runEliza();

//  Handles a new incoming request by asking the user for their name.
//  POSTS to /chat to continue the conversation.
//  @param  res     the response object
function handleNew(res) {
    res.writeHead(200, {'Content-Type':'text/html'});
    res.write('<!DOCTYPE html>\n' +
        '<html lang="en">\n' +
        '<head>\n' +
        '    <meta charset="UTF-8">\n' +
        '    <title>Eliza</title>\n' +
        '</head>\n' +
        '<body>\n' +
        '<h1>Hi, there!</h1>\n' +
        '<p>What\'s your name?</p>\n' +
        '<form action="/chat" method="post">\n' +
        '    <input type="text" name="userName"/>\n' +
        '    <input type="submit" value="Submit"/>\n' +
        '</form>\n' +
        '</body>\n' +
        '</html>');
    res.end();
}

//  Documents the received user response and the next answer/question.
//  @param  currAnswer      The current answer to respond with
//  @param  currQuestion    The current question to ask
//  @param  input           The user's most recent response
//  @param  res             The response object
function logAndRespond(currAnswer, currQuestion, input, res) {
    log = log + `${userName}: ${input}<br>`;
    log = log + `Eliza: ${currAnswer}<br> Eliza: ${currQuestion}<br>`;
    respond(currAnswer, currQuestion, res);
}

//  Constructs and sends the full response to the client with a new form
//  @param  currAnswer      The current answer to respond with
//  @param  currQuestion    The current question to ask
//  @param  res             The response object
function respond(currAnswer, currQuestion, res) {
    res.writeHead(200, {'Content-Type':'text/html'});
    res.write(`<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>Eliza</title>
        </head>
        <body>
        <h1>Hi, ${userName}!</h1>
        <p>${currAnswer}</p>
        <p>${currQuestion}</p>
        <form action="/chat" method="post">
            <input type="text" name="userInput"/>
            <input type="submit" value="Submit"/>
        </form><br>
        <form action="/dict" method="post">           
            <input type="submit" value="New Dictionary"/>
        </form>
        </body>
        </html>`);
    res.end();
}

//  Handles an existing conversation by reading the submitted form input
//  and following up accordingly.
//  @param  res         The response object
//  @param  req         The request object
//  @param  dictionary  Eliza's dictionary
function handleChat(req, res, dictionary) {
    let body = '';
    let input;

    req.on('data', chunk => {
        body += chunk;
    });

    //  Processes request when the form data is fully submitted
    req.on('end', () => {
        input = qstring.parse(body);

        let currAnswer;
        let currQuestion;

        //  If user submits a userName, sets the userName and responds to the user
        if(Object.prototype.hasOwnProperty.call(input, 'userName')) {
            userName = input.userName;
            if (!userName) handleNew(res);
            else {
                currAnswer = `Nice to meet you, ${userName}!`;
                currQuestion = dictionary.getQuestion(dictionary.getKeywords('welcome'));
                logAndRespond(currAnswer, currQuestion, userName, res);
            }
        }

        //  If user submits a userInput, process it
        else if(Object.prototype.hasOwnProperty.call(input, 'userInput')) {
            let userResponse = input.userInput;

            //  If the user quits, clears user data and resets to new user screen
            if (userResponse === 'quit') {
                log = 'Eliza: Hi, there! What is your name?<br>';
                userName = undefined;
                handleNew(res);
            }

            //  If user logs, displays and updates the log
            else if (userResponse === 'log') {
                currQuestion = dictionary.getQuestion(dictionary.getKeywords('other'));
                respond(log, currQuestion, res);
                log = log + `Eliza: ${currQuestion}<br>`;
            }

            //  If user responds normally, continues conversation with an answer and question
            else {
                //  Constructs the answer
                let keywords = dictionary.getKeywords(userResponse);
                currAnswer = dictionary.getAnswer(keywords);
                currQuestion = dictionary.getQuestion(keywords);
                logAndRespond(currAnswer, currQuestion, userResponse, res);
            }
        }

        //  If user submits a newDictionary, tries adding it to the current one.
        else if(Object.prototype.hasOwnProperty.call(input, 'newDictionary')) {
            let userResponse = '*attempts to add a dictionary*';
            let toAdd;

            try {
                toAdd = JSON.parse(input.newDictionary);
                dictionary.addDictionary(toAdd);
                currAnswer = `I just got smarter, I imported ${toAdd.dictionary_name}!`
            } catch (err) {
                currAnswer = 'Failed to import! :(';
            }
            currQuestion = dictionary.getQuestion(dictionary.getKeywords('other'));
            logAndRespond(currAnswer, currQuestion, userResponse, res);
        }
    })
}

//  Return a modified dictionary or an error
//  @param req  The request object
//  @param res  The response object
function handleDict(req, res) {
    res.writeHead(200, {'Content-Type':'text/html'});
    res.write('<!DOCTYPE html>\n' +
        '<html lang="en">\n' +
        '<head>\n' +
        '    <meta charset="UTF-8">\n' +
        '    <title>Eliza Dictionary</title>\n' +
        '</head>\n' +
        '<body>\n' +
        '<h1>Add a Dictionary</h1>\n' +
        '<p>Enter a new dictionary in JSON format...</p>' +
        '<form action="/chat" method="post" id="form">\n' +
        '    <textarea name="newDictionary" form="form" rows="15" cols="80"></textarea><br>\n' +
        '    <input type="submit" value="Add"/>\n' +
        '</form>\n' +
        '</body>\n' +
        '</html>');
    res.end();
}

//  Responds with the provided status code and message.
//  @param  res     The response object
//  @param  status  The status code
//  @param  msg     custom error message
function handleError(res, status, msg) {
    res.writeHead(status, {'Content-Type':'text/html'});
    res.write(`<h2>${msg}</h2>`);
    res.end();
}

function runEliza() {
    let dictionary;
    fs.readFile('default.json', 'utf8', (err, data) => {
        if (err) {
            res.writeHead(500);
            res.write('<h2>I can\'t find my dictionary!</h2>');
            res.end();
        }
        else {
            let defaultDictionary = JSON.parse(data);
            dictionary = new Dictionary(defaultDictionary);
        }
    });

    const server = http.createServer((req, res) => {
        //  Routing for server requests
        switch (req.url) {
            case '/':
            case '/new':
                handleNew(res);
                break;
            case '/dict':
                if(req.method === 'POST') {
                    handleDict(req, res, dictionary);
                    break;
                }
                else {
                    handleError(res, 405, 'That method is above your paygrade.');
                    break;
                }
            case '/chat':
                if(req.method === 'POST') {
                    handleChat(req, res, dictionary);
                    break;
                }
                else {
                    handleError(res, 405, 'That method is above your paygrade.');
                    break;
                }
            default:    //  if request has an invalid url or method
                handleError(res, 404, 'These are not the droids (pages) you are looking for...');
                break;
        }
    });

    server.listen(8001);
    console.log('Listening on 8001...');
}
