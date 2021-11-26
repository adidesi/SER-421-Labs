
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
    return Object.keys(jsonStr).length === 4
    && jsonStr.hasOwnProperty('lastname') && typeof(jsonStr['lastname']) === 'string'
    && jsonStr.hasOwnProperty('firstinitial') && typeof(jsonStr['firstinitial']) === 'string'
    && jsonStr.hasOwnProperty('score') && typeof(jsonStr['score']) === 'number'
    && jsonStr.hasOwnProperty('hole') && typeof(jsonStr['hole']) === 'number' || jsonStr['hole'] === 'finished';
}

exports.validateTournament = validateTournament;
exports.validatePlayer = validatePlayer;