const fs = require('fs');
const path = require('path');

class HTMLBuilderService{

    static buildPreferencesPage(preference){
        let fileBuffer = fs.readFileSync(path.join(__dirname, '../html/prefs', 'prefs.html'));
        console.log(fileBuffer);
        fileBuffer = fileBuffer.toString().replace('$PREFERENCE_STRING$', preference);
        return fileBuffer;
    }

    static buildErrorPage(errorString){
        let fileBuffer = fs.readFileSync(path.join(__dirname, '../html/error', 'err.html'));
        fileBuffer = fileBuffer.toString().replace('$ERROR_STRING$', errorString);
        return fileBuffer;
    }

    static buildMatchesPage(matchesObj){
        let fileBuffer = fs.readFileSync(path.join(__dirname, '../html/survey', 'matches.html'));
        let replaceString = '';
        if (matches.length > 0) {
            replaceString += '<ol>';
            for (var i = 0; i < matches.length; i++) {
                replaceString += '<li>User: '+matches[i].username+' matched '+matches[i].count+' answers</li>'
            }
            replaceString += '</ol>';
        } else {
            replaceString = 'There were no matches for '+matchesObj.username;
        }
        fileBuffer = fileBuffer.toString().replace('$USERNAME$', matchesObj.username).replace('$MATCHES_STRING$', replaceString);
        return fileBuffer;
    }

    static buildSurveysPage(surveyObj){
        let fileBuffer = fs.readFileSync(path.join(__dirname, '../html/survey', 'survey.html'));
        fileBuffer = fileBuffer.toString().replace('$QUESTION$', surveyObj.question);
        fileBuffer = fileBuffer.toString().replace('$PAGENUMBER$', surveyObj.pageNumber);
        fileBuffer = fileBuffer.toString().replace('$USERNAME$', surveyObj.username);
        let replaceString = '';
        for (var i = 0; i < surveyObj.options.length; i++) {
            replaceString+='<input type="radio" name="answer" value='+i;
            if(surveyObj.answer[surveyObj.pageNumber-1] != -1 && surveyObj.answer[surveyObj.pageNumber-1] == i) {
                replaceString+='checked';
            }
            replaceString+='>'
            replaceString+=surveyObj.options[i].choice
            replaceString+='</input>'
            if(surveyObj.preference != 'horizontal') {
                replaceString+='<br />'
            }
        }
        if(surveyObj.pageNumber != 1) {
            replaceString+='<input type="submit" name="submit" value="previous"></input>'
        }
        fileBuffer = fileBuffer.toString().replace('$SURVEY_STRING$', replaceString);
        return fileBuffer;
    }
}

exports.HTMLBuilderService = HTMLBuilderService