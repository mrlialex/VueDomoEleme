export function formatBasicDate(date,fmt){
	//fmt: 'yyyy-MM-dd hh:mm'

	if(/(y+)/.test(fmt)){
		fmt = fmt.replace(RegExp.$1, (date.getFullYear()+'')).substr(4-RegExp.$1.length);
	}
	let obj = {
		'M+' : date.getMonth() + 1,
		'd+' : date.getDate(),
		'h+' : date.getHours(),
		'm+' : date.getSeconds()
	}

	for(let key in obj){
		if(new RegExp(`(${key})`).test(fmt)){
			let str = obj[key] + '';
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1)?str:padStrLeft(str));
		}
	}

	return fmt;
}


function padStrLeft(str){
	return ('00' + str).substr(str.length);
}