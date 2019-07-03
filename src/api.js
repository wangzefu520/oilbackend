import qs from 'qs';
import axios from 'axios';
let instance = axios.create({
	baseURL:'http://localhost:8080',
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
	}
};
export default api;