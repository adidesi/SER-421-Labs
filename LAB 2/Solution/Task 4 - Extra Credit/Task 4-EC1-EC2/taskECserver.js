const http = require('http');
const fs = require('fs');
var querystring = require('querystring');

const hostname = '127.0.0.1';
const port = 3000;

let groceryList = [];
const fileName = 'taskECFile.dat';
if(!fs.existsSync(fileName)){
  fs.writeFileSync(fileName, '[]', {encoding:'utf-8'});
}
fs.readFile(fileName,{encoding:'utf-8'}, (err, data)=>{
  if(err)console.log(err) ;
  if(data.length > 0 && isJson(data)){
    let jsonData = JSON.parse(data);
    groceryList = Array.isArray(jsonData)?jsonData:[jsonData];
  } else {
    groceryList = [];
    fs.writeFileSync(fileName, '[]', {encoding:'utf-8'});
  }
  
});
const allowedParams = ['aisle', 'custom', 'favorite'];

const server = http.createServer((req, res) => {
  try{
    let cookies = parseCookie(req);
    if(req.url === '/' || req.url === '/index.html'){
      if(checkMethod(req, res, 'GET')) {        
        sendIndexHtml(res);
      }
    } else if (req.url.startsWith('/my_groceries?') || req.url === '/my_groceries'){ 
      if(checkMethod(req, res, 'GET')) {
        sendResponse(res, 200,
          getGroceriesByParams(req, res, cookies),
          req.headers['accept'].includes('text/html')?'text/html':req.headers['accept']);
      }
    } else if (req.url === '/groceries' ) {
      if(checkMethod(req, res, 'POST')) {
        data = '';
        req.on('data',(d)=>{
          data+=d;
        });
        req.on('end',()=>{
          try{
            addGroceryItem(req, res, data);
          } catch (err) {
            if(err instanceof CustExecption){
              processError(err);
            } else {
              console.log(err);
              processError(new CustExecption(500, res, err.errMsg));
            }
          }
        });
      }
    } else if(req.url === '/update_favorites') {
      if(checkRefererUrl(req, res, 'my_groceries') && checkMethod(req, res, 'POST')){
        data = '';
        req.on('data',(d)=>{
          data+=d;
        });
        req.on('end',()=>{
          try {
          cookies['favorite-item'] = addFavoriteItemCookieHeader(data.toString());
          let headers = setCookieHeader(cookies);
          Object.assign(headers,{'Location':req.headers.referer});
          sendResponse(res, 301,// Redirect to referer url
          '',
          'text/html',
          headers);
          } catch(err) {
            if(err instanceof CustExecption){
              processError(err);
            } else {
              console.log(err);
              processError(new CustExecption(500, res, err.errMsg));
            }
          }
        });
      }
    } else {
      throw new CustExecption(404, res);
    }
  }catch(err){
    if(err instanceof CustExecption){
      processError(err);
    } else {
      console.log(err);
      processError(new CustExecption(500, res, err.errMsg));
    }
  }
});

server.listen(port, hostname, () => {
  console.log(`SER 421 Lab 2 Server running at http://${hostname}:${port}/`);
});

sendIndexHtml = (res) => {
  fs.readFile(__dirname + '/index.html', (err,contents) => {
      if(err) { 
        throw new CustExecption(404, res, err.errMsg);
      } else {
        sendResponse(res, 200, contents, 'text/html');
      }       
  });
}

addGroceryItem = (req, res, data) => {
  body = '';
  if(req.headers['content-type']==='application/x-www-form-urlencoded'){
    body = querystring.decode(data.toString());
  } else if(req.headers['content-type']==='application/json'){
    body = JSON.parse(data.toString());
  }
  
  if(validateGroceryItem(body, res)) {
    let item = new GroceryItem(body);
    let index  = groceryList.findIndex(gItem => gItem.name == item.name);
    if(index > -1) { 
      groceryList.splice(index, 1);//remove element with same name
    }

    groceryList.push(item);//add element at end 
    fs.writeFileSync(fileName, JSON.stringify(groceryList), {encoding:'utf-8'});//re-write entire file

    sendResponse(res, 200,
    `<html>\n<head>\n<title>Grocery List</title>\n</head>\n<body>\n<p>\nSuccessfully added: `
            + item.name + `\n</p>\n<p>\nTotal items in grocery list: ` + groceryList.length
            + `\n</p>\n\n<a href="/">Add More</a></br>\n\n</body>\n</html>`,
    'text/html',
    );
  }
}

getGroceriesByParams = (req, res, cookies) => {
  let params = (req.url.indexOf('?') == -1)?{}:querystring.decode(req.url.split('?')[1]);
  if(Object.keys(params).some(item => !allowedParams.includes(item))) {
    throw new CustExecption(400, res, ' Invalid Parameters');
  }
  Object.keys(params).forEach(key => !params[key] && delete params[key]);

  return presentFilteredList(groceryList.filterData(params, cookies), params, req.headers['accept']);
}

presentFilteredList = (filteredData, params, headers)=>{
  let value1 = '', value2 = '', msg = '';
  if(headers.includes('text/html')) {    
    if(Object.keys(params).length > 0) {
      Object.keys(params).forEach(key=> value1 += '</br><span>Successfully filtered on: ' + key +' for value ' + params[key]);
    } else {
      value1 = '<span>No filters applied on grocery list.'
    }
    let value3 = '';
    if(filteredData.length > 0) {
      filteredData.forEach(item=> value2 += '<tr>\n<td><input type="checkbox" name="favorite" value="'+item.name+'"></td>\n<td>'+item.name+'</td>\n<td>'+item.brand+'</td>\n<td>'+item.aisle+'</td>\n<td>'+item.quantity+'</td>\n<td>'+item.custom+'</td>\n<td>'+item.deliveryTime+'</td>\n</tr>');
      value3 =`<input type="submit" value="Add Favorites">`
    } else {
      value2 = '<tr>No Items!</tr>';
    }
    msg = `<html>\n<head>\n<title>Grocery List</title>\n</head>\n<body>`
      + value1
      +`</span></br></br>\n<form action="update_favorites" method="post"><table>\n<tr>\n<th>Favorites</th><th>Product Name</th>\n<th>Brand Name</th>\n<th>Aisle Number</th>\n<th>Quantity</th>\n<th>Diet Type</th>\n<th>Delivery Time</th>\n</tr>\n`
      + value2
      +`\n</table>`
      + value3
      +`</form><span>Add More: <a href="/">here</a></span>\n</body>\n</html>`;
  } else if(headers === 'text/plain'){
    if(Object.keys(params).length > 0) {
      Object.keys(params).forEach(key=> value1 += '\nSuccessfully filtered on: ' + key +' for value '+ params[key]+'\n'); 
    } else {
      value1 = 'No filters applied on grocery list\n'
    }
    if(filteredData.length > 0) {
      filteredData.forEach(item=> value2 += item.name+'\t'+item.brand+'\t'+item.aisle+'\t'+item.quantity+'\t'+item.custom+'\t'+item.deliveryTime+'\n');
    } else {
      value2 = 'No Items!\n';
    }
    msg = `\n\nGrocery List\n\n\n`
      +value1
      +`Product Name\tBrand Name\tAisle Number\tQuantity\tDiet Type\tDelivery Time\n`
      +value2
      +`\nAdd More: / \n\n\n`;
  } else if (headers === 'application/json'){
    value1 = [];
    value2 = [];
    if(Object.keys(params).length > 0) {
      Object.keys(params).forEach(key=> value1.push('Successfully filtered on: ' + key +' for value '+ params[key])); 
    } else {
      value1.push('No filters applied on grocery list');
    }
    if(filteredData.length > 0) {
      filteredData.forEach(item=> value2.push([item.name,item.brand,item.aisle,item.quantity,item.custom,item.deliveryTime]));
    } else {
      value2.push('No Items!');
    }
    msg = {
      'landing' : '/', 'filterMessages' : value1
      , 'groceryList' : {
          'headers' : ['Product Name','Brand Name','Aisle Number','Quantity','Diet Type','Delivery Time'] 
        , 'data' : value2
      }
      , 'error' : false
      , 'messages' : 'No error messages'
    };
    msg = JSON.stringify(msg);
  }
  return msg;
}

addFavoriteItemCookieHeader =(data) => {
  let newData = querystring.parse(data);
  let cookieStr = '';
  let favorite_item = [];
  if(newData && newData.favorite) {
    favorite_item = (Array.isArray(newData.favorite))?newData.favorite:[newData.favorite];
    favorite_item.forEach(item=>{
      cookieStr+='&'+item;
    });
  }
  if(cookieStr.startsWith('&')) {
    cookieStr = cookieStr.slice(1,cookieStr.length);
  }
  cookieStr += ';expires='+(new Date(Date.now()+10*60*1000)).toUTCString();
  return cookieStr ;
}

parseCookie = (req) => {
  let cookies = req.headers.cookie || ''; 
  let cookieList = {};
  if(cookies.length > 0) {  
    cookies.split(';').forEach( cookie => {
      let parts = cookie.split('=');
      cookieList[parts[0].trim()] = parts[1];
    });
    cookies = cookieList;
  }
  return cookies || {};
}

checkRefererUrl = (req, res, referringRoute) => {
  const referrer = req.headers.referer.split('/');
  if(referrer.length > 3 && (referrer[3].startsWith(referringRoute+'?') || referrer[3] === referringRoute)){
    return true;
  } else {
    throw new CustExecption(403, res)
  }
}

checkMethod = (req,res,method) => {
  if(req.method !== method) {
    throw new CustExecption(405, res);
  }
  return true;
}

Array.prototype.filterData = function(paramQuery, cookies){
  let query = JSON.parse(JSON.stringify(paramQuery)) || {};
  let data = JSON.parse(JSON.stringify(this));
  let filteredData = [];
  if(query.favorite && query.favorite == 'true'){
    if(cookies['favorite-item'] && cookies['favorite-item'].split('&').length > 0){
      filteredData = data.filter(item => {
        return cookies['favorite-item'].split('&').some(cItem => item.name === cItem);
      });
    }
  } else {
    filteredData = data;
  }
  Object.keys(query).forEach(key => key === 'favorite' && delete query[key]);
  filteredData = filteredData.filter(item => {
      for (let key in query) {
        if (!item[key]) {
          return false;
        } else if(typeof query[key] == 'string') {
          return item[key].includes(query[key]);
        } else if (Array.isArray(query[key])){
          if(Array.isArray(item[key])) {
            return item[key].some(item => query[key].includes(item));
          } else if (typeof item[key] == 'string') {
            return query[key].some(queryItem => item[key].includes(queryItem));
          }
        }
      }
      return true;
  });
  return filteredData;
};

processError = (err) => {
  err.res.statusCode = err.code;
  let msg = '';
  switch(err.code){
    case 400 : 
      msg = '400 - Bad Request';
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
    case 500:
    default : 
      err.code = 500;
      msg = '500 - Internal Server Error';
  };
  msg += err.msg;
  sendResponse(err.res, err.code, msg, 'text/plain');
}

setCookieHeader = (cookies)=>{
  let headers = {};
  if(Object.keys(cookies).length > 0) {
    let cookieStr = ''
    Object.keys(cookies).forEach(key => cookieStr+=key+`=`+cookies[key]+`;`);
    if(cookieStr.replace(';', '').length > 0) {
      headers = {'Set-Cookie':cookieStr};
    }
  }
  return headers;
}

sendResponse = (res, code, msg, contentType, headersNew={}) => {
  let headers = {
    'Content-Length': Buffer.byteLength(msg),
    'Content-Type': contentType
  };
  if(Object.keys(headersNew).length > 0) {
    Object.assign(headers, headersNew);
  }
  res.writeHead(code, '', headers);
  res.end(msg);
}

class CustExecption{
  constructor(code, res, msg = '') {
    this.code = code;
    this.res = res;
    this.msg = msg;
  }
}

validateGroceryItem =(value, res)=>{
  let keys = Object.keys(value);
  if(!(keys.includes('name') && value.name && value.name.length >= 5 && value.name.match(new RegExp('^[A-Z][a-zA-Z]+$')))) {
    throw new CustExecption(400, res, ' Name not present');
  } else {
    if(!(keys.includes('brand') && value.brand && value.brand.length <= 10)) {
      throw new CustExecption(400, res, ' Brand not present');
    } else {
      if(!(keys.includes('quantity') && value.quantity && !isNaN(value.quantity) && value.quantity >= 1 && value.quantity <= 12)) {
        throw new CustExecption(400, res, ' Quantity not present');
      } else {
        if(!(keys.includes('aisle') && value.aisle && value.aisle >= 2 && value.aisle <= 20)) {
          throw new CustExecption(400, res, ' Aisle not present');
        } else {
          if(!value.deliveryTime) {
            return true;
          } else {
              if(!isNaN(Date.parse(value.deliveryTime)) 
                && value.deliveryTime > '2021-09-16T09:00' && value.deliveryTime < '2021-10-12T19:00')  {
              return true;
            } else {
              throw new CustExecption(400, res, ' Date not present');
            }
          }
        }
      }
    }
  }
}

class GroceryItem {
  constructor(value){
    this.name = value.name;
    this.brand = value.brand;
    this.quantity = value.quantity;
    this.aisle = value.aisle;
    this.custom = (value.custom)?value.custom:[];
    this.deliveryTime = (value.deliveryTime)?value.deliveryTime:'';
  }
}
isJson = (str) => {
  try {
      JSON.parse(str);
  } catch (e) {
      return false;
  }
  return true;
}