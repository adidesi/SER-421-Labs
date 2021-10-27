const { json } = require('express');
const fs = require('fs');
const path = require('path');
const { APIException } = require('../model/APIException');

class SurveyService{
    static populateSurvey = (res) => {
		try{
			let fileBuffer = fs.readFileSync(path.join(__dirname, '../json','survey.json'));
			return JSON.parse(fileBuffer).questions;
		} catch (err){
			console.log(err);
			throw new APIException(500, res, '');
		}
    }

    static renderSurvey = (session, surveyQuestions)=> {
		console.log('answers', session.answer);
		return {
			'pageNumber':session.pageNumber,
			'username'	:session.username,
			'question'	:surveyQuestions[session.pageNumber - 1].question,
			'options' 	:surveyQuestions[session.pageNumber - 1].choices,
			'preference':(session.preference)?session.preference:'horizontal',
			'answer'	:session.answer
		}
    }
}

exports.SurveyService = SurveyService