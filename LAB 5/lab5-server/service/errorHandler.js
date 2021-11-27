const {APIException} = require('../model/APIException');

function processError (err){
    let msg = '';
    switch(err.statusCode){
      case 400 :
        msg = '400 - Bad Request - Improper request';
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
      case 422:
        msg = '422 - Unprocessable Entity';
        break;
      case 500:
      default :
        err.statusCode = 500;
        msg = '500 - Internal Server Error';
    }
    msg += ((err.statusMessage !== '')?' ':'') + err.statusMessage;
    err.responseObject.statusCode = err.statusCode;
    err.responseObject.send({'message':msg});
}

function errHandler(fn, res){
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

exports.processError = processError;
exports.errHandler = errHandler;