import qs from 'qs';
import axios from 'axios';
import router from './router'
let pageSize = 20;
let instance = axios.create({
	baseURL:'/',
	timeout:2000
});

instance.interceptors.request.use(req=>{
	let token = sessionStorage.getItem('accessToken');
	if(token){
		req.headers["token"] = token;
	}
	return req;
},err=>{
	console.log('异常',err);
	return Promise.reject(err);
});
instance.interceptors.response.use(res=>{
	let data = res.data;
	let code =data.code;
	if(code == 403){
		router.replace('/');
		return ;
	}
	return res;
});
let api = {
	login(userInfo){
		let url = `/login`;
		return instance.request({			
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			method:'POST',
			url:url,
			data:qs.stringify(userInfo)
		});
	},
	loadMenus(){
		let url = `/api/backend/menu`;
		return instance.get(url);
	},
	loadManager(info){
		let url = `/api/backend/manager`;
		let pageNo = info&&info.pageNo?info.pageNo:1;
		let pageSize = info&&info.pageSize?info.pageSize:20;
		url = `${url}?pageNo=${pageNo}&pageSize=${pageSize}`; 
		if(info&&info.username&&info.username.replace(/\s/g,'').length>0){
			url = `${url}&username=${info.username}`;
		}
		if(info&&info.nickname&&info.nickname.replace(/\s/g,'').length>0){
			url = `${url}&nickname=${info.nickname}`;
		}
		return instance.request({
			method:'get',
			url:url
		});
	},
	resetManagerPassword(id){
		let url = `/api/backend/manager/${id}/resetpsw`;
		return instance.post(url);
	},
	disableManager(id){
		let url = `/api/backend/manager/${id}/disable`;
		return instance.post(url);
	},
	enableManager(id){
		let url = `/api/backend/manager/${id}/enable`;
		return instance.post(url);
	},
	deleteManager(id){
		let url = `/api/backend/manager/${id}`;
		return instance.delete(url);
	},
	loadUser(info){
		if(!info){
			info = {};
		}
		let url=`/api/backend/user`;
		let pageNo = info&&info.pageNo?info.pageNo:1;
		let pageSize = info&&info.pageSize?info.pageSize:20;
		url = `${url}?pageNo=${pageNo}&pageSize=${pageSize}`; 
		if(info&&info.nickname&&info.nickname.replace(/\s/g,'').length>0){
			url = `${url}&nickname=${info.nickname}`;
		}
		if(info&&info.authType>0){
			url = `${url}&authType=${info.authType}`;
		}
		return instance.get(url);
	}
};
export default api;