const {APIException} = require('../model/APIException');

function validateTournament(jsonStr){
    return Object.keys(jsonStr).length === 1
    && jsonStr.hasOwnProperty('tournament') && typeof(jsonStr['tournament']) === 'object'
    && Object.keys(jsonStr.tournament).length === 6
    && jsonStr.tournament.hasOwnProperty('name') && typeof(jsonStr.tournament['name']) === 'string'
    && jsonStr.tournament.hasOwnProperty('year') && typeof(jsonStr.tournament['year']) === 'number' 
    && jsonStr.tournament.hasOwnProperty('award') && typeof(jsonStr.tournament['award']) == 'number' 
    && jsonStr.tournament.hasOwnProperty('yardage') && typeof(jsonStr.tournament['yardage']) == 'number' 
    && jsonStr.tournament.hasOwnProperty('par') && typeof(jsonStr.tournament['par']) == 'number' 
    && jsonStr.tournament.hasOwnProperty('players') && Array.isArray(jsonStr.tournament['players'])
    && jsonStr.tournament['players'].every(player => validatePlayer(player));
}

function validatePlayer(jsonStr){
    return Object.keys(jsonStr).length == 4
    && (jsonStr.hasOwnProperty('lastname') 
        && typeof(jsonStr['lastname']) === 'string' && jsonStr['lastname'].trim().length > 0)
    && (jsonStr.hasOwnProperty('firstinitial') 
        && typeof(jsonStr['firstinitial']) === 'string' && jsonStr['firstinitial'].trim().length === 1)
    && (jsonStr.hasOwnProperty('score') 
        && (typeof(jsonStr['score']) === 'number' 
            || (typeof(jsonStr['score']) === 'string' && jsonStr['score'].trim().length === 0)))
    && (jsonStr.hasOwnProperty('hole') 
        && ((typeof(jsonStr['hole']) === 'number' || jsonStr['hole'] === 'finished') 
            || (typeof(jsonStr['hole']) === 'string' && jsonStr['hole'].trim().length === 0)));
}

function validateQParamsForGetTournament(req, res){
    if(Object.keys(req.query).length == 2){
        if(req.query.hasOwnProperty('fromYear') && !isNaN(req.query['fromYear'])){
            if(req.query.hasOwnProperty('toYear') && !isNaN(req.query['toYear'])){
                return true;
            } else {
                throw new APIException(400, res, '');
            }
        }
        else {
            throw new APIException(400, res, '');
        }
    } else if (Object.keys(req.query).length != 0){
        throw new APIException(400, res, '');
    }
    return false;
}

function validateQParamsForGetPlayer(req, res){
    let keyLength = Object.keys(req.query).length
    if(keyLength > 3 || keyLength < 1)
        throw new APIException(400, res, '');
    switch(keyLength){
        case 3: if(!req.query.hasOwnProperty('maxScore') || isNaN(req.query['maxScore'])){
            throw new APIException(400, res, '');
        }
        case 2:if(!req.query.hasOwnProperty('tName') || typeof(req.query['tName']) !== 'string' || req.query['tName'].trim().length === 0){
            throw new APIException(400, res, '');
        }
        case 1: if(!req.query.hasOwnProperty('tournament') || typeof(req.query['tournament']) !== 'string'){
            throw new APIException(400, res, '');
        }
        return keyLength;
        default:
            throw new APIException(400, res, '');
    }
}

function validateAddPlayerObj(jsonStr){
    return Object.keys(jsonStr).length == 2
    && (jsonStr.hasOwnProperty('tournament') 
        && typeof(jsonStr['tournament']) === 'string' && jsonStr['tournament'].trim().length > 0)
    && (jsonStr.hasOwnProperty('player') && Object.keys(jsonStr.player).length == 2
        && ( jsonStr.player.hasOwnProperty('lastname') 
            && typeof(jsonStr.player['lastname']) === 'string' && jsonStr.player['lastname'].trim().length > 0)
        && ( jsonStr.player.hasOwnProperty('firstinitial') 
            && typeof(jsonStr.player['firstinitial']) === 'string' && jsonStr.player['firstinitial'].trim().length === 1)
    )
}


exports.validateQParamsForGetTournament = validateQParamsForGetTournament;
exports.validateQParamsForGetPlayer = validateQParamsForGetPlayer;
exports.validateTournament = validateTournament;
exports.validatePlayer = validatePlayer;
exports.validateAddPlayerObj = validateAddPlayerObj;