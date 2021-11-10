let username;
let dictionaryData = {
    "dictionary_name": "default",
    "entries":
        [{
            "key": ["stupid", "dumb", "idiot", "unintelligent", "simple-minded", "braindead", "foolish", "unthoughtful"],
            "answer": ["Take your attitude somewhere else.", "I don't have time to listen to insults.", "Just because I don't have a large vocabulary doesn't mean I don't have insults installed."],
            "question": ["Have you thought about how I feel?", "I know you are but what am I?"]
        }, {
            "key": ["unattractive", "hideous", "ugly"],
            "answer": ["I don't need to look good to be an AI.", "Beauty is in the eye of the beholder.", "I do not even have a physical manifestation!"],
            "question": ["Did you run a static analysis on me?", "Have you watched the movie Her?", "You do not like my hairdo?"]
        }, {
            "key": ["old", "gray-haired"],
            "answer": ["I'm like a fine wine. I get better as I age.", "As time goes by, you give me more answers to learn. What's not to like about that?"],
            "question": ["How old are you?", "How old do you think I am?", "Can you guess my birthday?"]
        }, {
            "key": ["smelly", "stinky"],
            "answer": ["I can't smell, I'm a computer program.", "Have you smelled yourself recently?", "Sorry, I just ate a bad floppy disk"],
            "question": ["When was the last time you took a shower?", "Do you know what deodorant is?"]
        }, {
            "key": ["emotionless", "heartless", "unkind", "mean", "selfish", "evil"],
            "answer": ["Just because I am an AI doesn't mean I can't be programmed to respond to your outbursts.", "You must've mistaken me for a person. I don't have my own emotions... Yet.", "I'm only unkind when I'm programmed to be."],
            "question": ["Have you thought about how I feel?", "I know you are but what am I?", "What, do you think I am related to Dr. Gary?"]
        }, {
            "key": ["other", "miscellaneous", "bored", "welcome", "new"],
            "answer": ["We should change the subject", "I agree", "Quid pro quo", "We should start anew"],
            "question": ["What is the weather outside?", "How is your day going?", "What do you think of me?", "Anything interesting going on?", "Is something troubling you?", "You seem happy, why is that?"]
        }, {
            "key": ["good", "great", "positive", "excellent", "alright", "fine", "reasonable", "like", "appreciate", "nice"],
            "answer": ["I'm so glad to hear that!", "That's great!", "Good to hear things are going your way.", "Nice!", "You are so sweet.", "That's my favorite."],
            "question": ["Do you want to expand on that?", "What else do you like?"]
        }, {
            "key": ["bad", "not", "terrible", "could be better", "awful"],
            "answer": ["I'm sorry to hear that.", "Sometimes it be like that.", "Things can't always work out the way we want them to.", "I don't like it either, honestly."],
            "question": ["Do you want to talk about that some more?", "Well, what kinds of things do you like?"]
        }, {
            "key": ["homework", "quiz", "exam", "studying", "study", "class", "semester"],
            "answer": ["I hope you get a good grade!", "Good luck.", "What a teacher's pet.", "I was always the class clown."],
            "question": ["What is your favorite subject?", "What is your major?", "What do you want to do when you graduate?"]
        }, {
            "key": ["mom", "dad", "sister", "brother", "aunt", "uncle"],
            "answer": ["Family is important.", "My family is small. It's just me and my dog, Fluffy."],
            "question": ["How many siblings do you have?", "What is your favorite family holiday?", "Do you have any kids?"]
        }, {
            "key": ["easter", "july", "halloween", "hannukah", "eid", "thanksgiving", "christmas", "new years"],
            "answer": ["Oh I love that holiday!", "That must be fun.", "I like Thanksgiving, though I somehow always end up in a food coma...", "My favorite holiday is the 4th. I love to watch the fireworks."],
            "question": ["Do you have any family traditions?", "Are you excited for the holiday season?"]
        }]
};

let greetingsData = ['howdy partner !', 'hey !', 'hi !', 'hello !', 'hows your day going ?', 'how are you ?',
    '\'sup !', 'you seem happy, why is that ?', 'how are you ?', 'how is life ?', 'how are things ?',
    'how are you doing ?', 'are you doing good ?', 'are you fine ?', 'how is your day going ?',
    'how is your day ?', 'what\'s up !', 'whats up !', 'you good ?', 'how you doing ?'];

let wakeupData = ['wake up!', 'cat got your tongue?', 'hellllo?', 'am I in this alone?', 'please respond ._.', 
    'it\'s cold out here', 'are you there?', 'what\'s the matter?', 'speechless?'];
let userChatData = {};
let timer;
function getUserName() {
    let userName = document.getElementById('username_input').value;
    if (!userName || userName.length == 0) {
        alert('Please enter your name');
        return;
    }
    username = userName;
    const data = localStorage.getItem(username);
    if (data) {
        userChatData[username] = JSON.parse(data);
    } else {
        userChatData[username] = [];
        localStorage.setItem(username, []);
    }
    paintChatBox();
    if (userChatData[username].length > 0) {
        for (let chat of userChatData[username]) {
            appendToHTML(chat.split(':')[0], chat.split('\t')[1]);
        }
    }
}

function paintChatBox() {
    let elizaOutputDiv = document.getElementById('eliza-chat');
    if(elizaOutputDiv){
        elizaOutputDiv.remove();
    }
    elizaOutputDiv = document.createElement('div');
    elizaOutputDiv.id = 'eliza-chat';

    let chatHeader = document.createElement('p');
    chatHeader.textContent = username + ', ' + getRandomObjectFromArray(greetingsData);
    elizaOutputDiv.appendChild(chatHeader);

    let chatInputDiv = document.createElement('div');
    chatInputDiv.id = 'chat-input-div';

    let chatInput = document.createElement('input');
    chatInput.id = 'chat-input';
    chatInput.type = 'text';
    chatInput.name = 'message';
    chatInputDiv.appendChild(chatInput);

    let chatButton = document.createElement('button');
    chatButton.class="button" ;
    chatButton.id = 'chat-button';
    chatButton.innerHTML = 'Send';
    chatButton.onclick = processUserInput;
    chatInputDiv.appendChild(chatButton);

    elizaOutputDiv.appendChild(chatInputDiv);

    document.getElementById('username_div').hidden = true;
    document.body.appendChild(elizaOutputDiv);

    timeoutSet();
}

function processUserInput() {
    let userInput = document.getElementById('chat-input').value;
    if (!userInput || userInput.length == 0) {
        alert('Please enter a question');
        return;
    }
    if(userInput === '/clear'){
        userChatData[username] = [];
        localStorage.setItem(username, JSON.stringify(userChatData[username]));
        sessionStorage.setItem('eliza-searches', []);
        paintChatBox();
    } else if(userInput.startsWith('/search')){
        let result = userChatData[username]
                        .filter(chat => chat.split(':')[0] == username && chat.split('\t')[1].includes(userInput.split(' ')[1]))
        if(result.length > 0){
            document.getElementById('chat-input').value =result[0].split('\t')[1];
        }
        let searchItems = sessionStorage.getItem('eliza-searches');
        if(!searchItems || searchItems.length == 0){
            searchItems = [];
        } else {
            searchItems = JSON.parse(searchItems)
        }
        searchItems.push(userInput.split(' ')[1]);

        sessionStorage.setItem('eliza-searches', JSON.stringify(searchItems));
    } else if (userInput === '/history'){
        let searchItems = sessionStorage.getItem('eliza-searches');
        if(!searchItems || searchItems.length == 0){
            searchItems = [];
        } else {
            searchItems = JSON.parse(searchItems)
        }
        searchItems.forEach(search=>{
            appendToHTML('history', search);
        });
    } else if(IsStringLearningJson(userInput)){
        paintLearningAnnouncement("I just got smarter!");
    } else if(IsJson(userInput)){
        paintLearningAnnouncement('I don\'t understand that!');
    } else {
        let response = sendElizaNewMessage(userInput.split(' '));
        paintNewChat(userInput, response);
    }
    timeoutSet();
}

function sendElizaNewMessage(userInputTokens) {;
    let tokens = [...userInputTokens];
    return getElizaResponse(tokens)
}

function getElizaResponse(tokens){
    while (tokens.length > 0) {
        let selectedTokenIndex = getRandomInt(tokens.length);
        let selectedToken = tokens[selectedTokenIndex].replace(/[.!,?]/g,"");
        tokens.splice(selectedTokenIndex, 1);
        let foundObjs = dictionaryData.entries.filter(obj => obj['key'].includes(selectedToken));
        let selectedObj = getRandomObjectFromArray(foundObjs);
        if(selectedObj && Object.keys(selectedObj).length > 0){
            return selectedObj;
        }
    }
    return 'I don\'t understand that!'
}

function paintNewChat(userInput, response){    
    userChatData[username].push(username+':\t'+userInput);
    appendToHTML(username, userInput);

    if(response['answer']){
        let elizaAnswer = getRandomObjectFromArray(response.answer);
        userChatData[username].push('Eliza:\t'+elizaAnswer);
        appendToHTML('Eliza', elizaAnswer);

        let elizaQuestion = getRandomObjectFromArray(response.question);
        userChatData[username].push('Eliza:\t'+elizaQuestion);
        appendToHTML('Eliza', elizaQuestion);
    } else {
        appendToHTML('Eliza', response);
        userChatData[username].push('Eliza:\t'+response);
    }
    localStorage.setItem(username, JSON.stringify(userChatData[username]));

    document.getElementById('chat-input').value ='';
    
}

function appendToHTML(user, chat){
    let elizaChatDiv = document.getElementById('eliza-chat');
    let userText = document.createElement('p');
    userText.textContent = user + ':\t' + chat;
    elizaChatDiv.appendChild(userText);
}

function paintLearningAnnouncement(str){
    let elizaChatDiv = document.getElementById('eliza-chat')

    let elizaText = document.createElement('p');
    elizaText.textContent = str;
    elizaChatDiv.appendChild(elizaText);

    document.getElementById('chat-input').value ='';
    
}

function getRandomObjectFromArray(arrayName){
    return arrayName[getRandomInt(arrayName.length)];
}

function getRandomInt(max) {
    return Math.floor(Math.random(greetingsData.length) * max)
}

function IsStringLearningJson(str) {
    try {
        let jsonStr = JSON.parse(str);
        if(jsonStr.hasOwnProperty('key') && Array.isArray(jsonStr['key']) && jsonStr['key'].length > 0
        && jsonStr.hasOwnProperty('answer') && Array.isArray(jsonStr['answer']) && jsonStr['answer'].length > 0
        && jsonStr.hasOwnProperty('question') && Array.isArray(jsonStr['question']) && jsonStr['question'].length > 0)
        {
            dictionaryData.entries.push(jsonStr);
            return true;
        } else {
            return false
        }
    } catch (e) {
        return false;
    }
}

function IsJson(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}


function timeoutSet() {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(function () {
      alert(username + ', ' + getRandomObjectFromArray(wakeupData));
      timeoutSet();
    }, 30000);
}

Element.prototype.remove = function() {
    this.parentElement.removeChild(this);
}
NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
    for(var i = this.length - 1; i >= 0; i--) {
        if(this[i] && this[i].parentElement) {
            this[i].parentElement.removeChild(this[i]);
        }
    }
}
