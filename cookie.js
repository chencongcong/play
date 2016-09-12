/*
	document:保存cookie的document对象，必需的
	name：指定cookie名的字符串，必需的
	hours：一个可选的数字，指定从现在起到cookie过期的小时数
	path：一个可选的字符串，指定了cookie的路径性质
	domain：一个可选的字符串，指定了cookie的域性质
	secure：一个布尔值，如果为true，需要一个安全的cookie
	*/
	function Cookie(document,name,hours,path,domain,secure){
		this.$document = document;
		this.$name = name;
		
		if(hours){
			this.$expiration = new Date((new Date()).getTime()+hours*3600000);
		}else{
			this.$expiration = null;
		}
		
		if(path){
			this.$path = path;
		}else{
			this.$path = null;
		}
		
		if(domain){
			this.$domain = domain;
		}else{
			this.$domain = null;
		}

		if(secure){
			this.$secure = secure;
		}else{
			this.$secure = null;
		}
	}
	Cookie.prototype.store = function(){
		var cookieVal = "";
		for(var prop in this){
			if((prop.charAt(0) == '$')||((typeof this[prop]) == 'function')) continue;
			if(cookieVal != '') cookieVal += '&';
			cookieVal += prop+":"+escape(this[prop]);
		}
		var cookie = this.$name + "="+cookieVal;
		if(this.$expiration){
			cookie +=';expires='+this.$expiration.toGMTString();
		}
		if(this.$path){
			cookie += ';path='+this.$path;
		}
		if(this.$domain){
			cookie += ';domain='+this.$domain;
		}
		if(this.$secure){
			cookie +=';secure';
		}
		this.$document.cookie = cookie;
	}
	
	Cookie.prototype.load = function(){
		var allcookies = this.$document.cookie;
		if(allcookies == "") return false;

		var start = allcookies.indexOf(this.$name + '=');
		if(start == -1) return false;
		start += this.$name.length +1;
		var end = allcookies.indexOf(';',start);
		if(end == -1) end = allcookies.length;
		var cookieVal = allcookies.substring(start,end);
		var a = cookieVal.split("&");
		for(var i = 0; i < a.length; i++){
			a[i] = a[i].split(":");
		}
		for(var i = 0; i < a.length; i++){
			this[a[i][0]] = unescape(a[i][1]);
		}
		return true;

	}
	Cookie.prototype.remove = function(){
		var cookie;
		cookie = this.$name + "=";
		if(this.$path) cookie += ";path = " + this.$path;
		if(this.$domain) cookie += ";domain = "+this.$domain;
		cookie += "; expires = Fri, 02-July-2016 00:00:00 GMT";
		this.$document.cookie = cookie;
	}
	var visitordata = new Cookie(document, "name_color_count_state",240);
	if(!visitordata.load() || !visitordata.name || !visitordata.color){
		visitordata.name = prompt("what is your name:","");
		visitordata.color = prompt("what is your favourite color:","");
	}
	if(visitordata.visits = null){
		visitordata.visits = 0;	
	}
	visitordata.visits ++;
	visitordata.store();
	document.write("color:"+visitordata.color+"welcome:"+visitordata.name+"you have visited"+visitordata.visits+"times");
