
function createObjectFromParsedJSON(context, value){
	if(!value || Object.keys(value).length <= 0){
		return;
	}
	let keys = Object.keys(value);
	keys.forEach(key=>{
		if(Object.keys(value[key]).length > 0 && typeof value[key] === 'object'){
			if(value[key] instanceof Array){
				context[key] = [];
				value[key].forEach((item,index) => {
					context[key].push({});
					createObjectFromParsedJSON(context[key][index],item);
				});
			}else if(value[key] instanceof Object){
				context[key]={};
				createObjectFromParsedJSON(context[key],value[key]);
			}
		}else{
			context[key]=value[key];
		}
	})
	return context;
}

