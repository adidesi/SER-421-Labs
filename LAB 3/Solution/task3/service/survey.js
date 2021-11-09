const { json } = require('express');
const fs = require('fs');
const path = require('path');
const { APIException } = require('../model/APIException');

class SurveyService{
    static populateSurvey = (res) => {
		try{
			let fileBuffer = fs.readFileSync(path.join(__dirname, '../','survey.json'));
			return JSON.parse(fileBuffer).questions;
		} catch (err){
			console.log(err);
			throw new APIException(500, res, '');
		}
    }

    static renderSurvey = (session, cookie, surveyQuestions)=> {
		return {
			'pageNumber':session['pageNumber'],
			'username'	:session['username'],
			'question'	:surveyQuestions[session['pageNumber'] - 1].question,
			'options' 	:surveyQuestions[session['pageNumber'] - 1].choices,
			'preference':(cookie && cookie['preference'])?cookie['preference']:'horizontal',
			'answer'	:session['answer']
		}
    }

	static getMatches =(username, allAnswers, questions) => {
        let userAnswer = allAnswers.filter(ans=> ans.username == username);
		let matches = []
        if(userAnswer.length > 0){
            allAnswers.filter(ans=> ans.username != username).forEach(surveyRecord=>{
                let matchFound = {'username': surveyRecord.username};
                let count = 0
                for(let i = 0; i< questions.length; i++){
                    if(surveyRecord.answer[i] == userAnswer[0].answer[i]){
                        count++;
                    }
                }
                matchFound.count = count;
                matches.push(matchFound);
            });
        }
		return matches;
	}
}

exports.SurveyService = SurveyService