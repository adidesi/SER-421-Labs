class APIException{

    statusCode;
    responseObject;
    statusMessage;
    constructor(code, res, msg){
        this.responseObject = res;
        this.statusCode = code;
        this.statusMessage = msg;
    }
}
APIException.prototype = Object.create(Error.prototype);

exports.APIException = APIException