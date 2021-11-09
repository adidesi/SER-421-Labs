let username;
let dictionaryData;
let timer = 0;
let greetingsData = ['howdy partner !', 'hey !', 'hi !', 'hello !', 'hows your day going ?', 'how are you ?',
    '\'sup !', 'you seem happy, why is that ?', 'how are you ?', 'how is life ?', 'how are things ?',
    'how are you doing ?', 'are you doing good ?', 'are you fine ?', 'how is your day going ?',
    'how is your day ?', 'what\'s up !', 'whats up !', 'you good ?', 'how you doing ?'];

let wakeupData = ['wake up!', 'cat got your tongue?', 'hellllo?', 'am I in this alone?', 'please respnond ._.', 
    'it\'s cold out here', 'are you there?', 'whats the matter?', 'speechless?'];

function initLoad() {
    fetch('./default.json')
        .then((response) => response.json())
        .then((data) => {
            dictionaryData = data;
            console.log(dictionaryData);
        })
        .catch((error) => console.log(error));
}


function getUserName() {
    let userName = document.getElementById('username_input').value;
    if (!userName || userName.length == 0) {
        alert('Please enter your name');
        return;
    }
    username = userName;
    paintChatBox();
}

function paintChatBox() {
    let elizaOutputDiv = document.createElement('div');
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
}

function processUserInput() {
    let userInput = document.getElementById('chat-input').value;
    if (!userInput || userInput.length == 0) {
        alert('Please enter a question');
        return;
    }
    if(IsStringLearningJson(userInput)){
        paintLearningAnnouncement("I just got smarter!");
    } else if(IsJson(userInput)){
        paintLearningAnnouncement('I don\'t understand that!');
    } else {
        let response = sendElizaNewMessage(userInput.split(' '));
        paintNewChat(userInput, response);
    }
}

function sendElizaNewMessage(userInputTokens) {
    clearTimeout(timer);
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
    let elizaChatDiv = document.getElementById('eliza-chat')
    
    let userText = document.createElement('p');
    userText.textContent = username + ':\t' + userInput;
    elizaChatDiv.appendChild(userText);

    let elizaText = document.createElement('p');
    elizaText.textContent = 'Eliza' + ':\t' + getRandomObjectFromArray(response.answer);
    elizaChatDiv.appendChild(elizaText);

    let elizaQuestionText = document.createElement('p');
    elizaQuestionText.textContent = 'Eliza' + ':\t' + getRandomObjectFromArray(response.question);
    elizaChatDiv.appendChild(elizaQuestionText);

    document.getElementById('chat-input').value ='';

    timer = 5*1000;
    resetTimer();    
    
}

function paintLearningAnnouncement(str){
    let elizaChatDiv = document.getElementById('eliza-chat')

    let elizaText = document.createElement('p');
    elizaText.textContent = str;
    elizaChatDiv.appendChild(elizaText);

    document.getElementById('chat-input').value ='';

    resetTimer();    
    
}

function getRandomObjectFromArray(arrayName){
    return arrayName[getRandomInt(arrayName.length)];
}

function getRandomInt(max) {
    return Math.floor(Math.random(greetingsData.length) * max)
}

function resetTimer() {
    clearTimeout(timer);
    timer = setTimeout(alert(username + ', ' + getRandomObjectFromArray(wakeupData)), 5000)
}

function IsStringLearningJson(str) {
    try {
        let jsonStr = JSON.parse(str);
        if(jsonStr.hasOwnProperty('key') && Array.isArray(jsonStr['key']) && jsonStr['key'].length > 0
        && jsonStr.hasOwnProperty('answer') && Array.isArray(jsonStr['answer']) && jsonStr['answer'].length > 0
        && jsonStr.hasOwnProperty('question') && Array.isArray(jsonStr['question']) && jsonStr['question'].length > 0)
        {
            console.log(jsonStr);
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