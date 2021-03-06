import qs from 'qs';
import axios from 'axios';
import router from './router'
let pageSize = 20;
let instance = axios.create({
	baseURL: '',
	timeout: 2000
});

instance.interceptors.request.use(req => {
	let token = sessionStorage.getItem('accessToken');
	if (token) {
		req.headers["token"] = token;
	}
	return req;
}, err => {
	console.log('异常', err);
	return Promise.reject(err);
});
instance.interceptors.response.use(res => {
	let data = res.data;
	let code = data.code;
	if (code == 403) {
		sessionStorage.removeItem('accessToken');
		router.replace('/');
		return;
	}
	return res;
});
let api = {
	login(userInfo) {
		let url = `/api/login`;
		return instance.request({
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			method: 'POST',
			url: url,
			data: qs.stringify(userInfo)
		});
	},
	loadMenus() {
		let url = `/api/backend/menu`;
		return instance.get(url);
	},
	upload(file){
		let url = '/api/backend/aliyun/oss/upload';
		let param = new FormData();
		param.append("file", file);
		return instance.request({
			url: url,
			method: 'post',
			headers: {'Content-Type': 'multipart/form-data'},
			data:param
		});
	},
	loadManager(info) {
		let url = `/api/backend/manager`;
		let pageNo = info && info.pageNo ? info.pageNo : 1;
		let pageSize = info && info.pageSize ? info.pageSize : 20;
		url = `${url}?pageNo=${pageNo}&pageSize=${pageSize}`;
		if (info && info.username && info.username.replace(/\s/g, '').length > 0) {
			url = `${url}&username=${info.username}`;
		}
		if (info && info.nickname && info.nickname.replace(/\s/g, '').length > 0) {
			url = `${url}&nickname=${info.nickname}`;
		}
		return instance.request({
			method: 'get',
			url: url
		});
	},
	saveManager(info) {
		let { username, password, nickname, role } = info;
		let url = `/api/backend/manager`;
		return instance.request({
			method: 'POST',
			url: url,
			data: { username: username, password: password, nickName: nickname, roleType: role }
		})
	},
	updateManager(id, nickname, roleType) {
		let url = `/api/backend/manager/${id}`;
		return instance.request({
			method: 'PUT',
			url: url,
			data: { nickName: nickname, roleType: roleType }
		})
	},
	resetManagerPassword(id) {
		let url = `/api/backend/manager/${id}/resetpsw`;
		return instance.post(url);
	},
	changeManagerPassword(obj){
		let url = `/api/backend/manager/changePsw`;
		return instance.post(url,obj);
	},
	disableManager(id) {
		let url = `/api/backend/manager/${id}/disable`;
		return instance.post(url);
	},
	enableManager(id) {
		let url = `/api/backend/manager/${id}/enable`;
		return instance.post(url);
	},
	deleteManager(id) {
		let url = `/api/backend/manager/${id}`;
		return instance.delete(url);
	},
	loadUser(info) {
		if (!info) {
			info = {};
		}
		let url = `/api/backend/user`;
		let pageNo = info && info.pageNo ? info.pageNo : 1;
		let pageSize = info && info.pageSize ? info.pageSize : 20;
		url = `${url}?pageNo=${pageNo}&pageSize=${pageSize}`;
		if (info && info.nickname && info.nickname.replace(/\s/g, '').length > 0) {
			url = `${url}&nickname=${info.nickname}`;
		}
		if (info && info.authType > 0) {
			url = `${url}&authType=${info.authType}`;
		}
		return instance.get(url);
	},
	loadOrder(info) {
		if (!info) {
			info = {};
		}
		let url = `/api/backend/trade`;
		let pageNo = info && info.pageNo ? info.pageNo : 1;
		let pageSize = info && info.pageSize ? info.pageSize : 20;
		url = `${url}?pageNo=${pageNo}&pageSize=${pageSize}`;
		let timeRange = info.rangeTime;
		if (timeRange && timeRange.length == 2) {
			url = `${url}&startTime=${timeRange[0].format("YYYY-MM-DD HH:mm:ss")}`;
			url = `${url}&endTime=${timeRange[1].format("YYYY-MM-DD HH:mm:ss")}`;
		}
		let no = info.no;
		if (no) {
			url = `${url}&orderNo=${no}`;
		}
		let payType = info.payType;
		if (payType && payType > 0) {
			url = `${url}&payType=${payType}`;
		}
		let gasId = info.gasId;
		if (gasId && gasId > 0) {
			url = `${url}&gasId=${gasId}`;
		}
		return instance.get(url);
	},
	exportOrder(info) {
		if (!info) {
			info = {};
		}
		let url = `/api/backend/trade/export`;
		let token = sessionStorage.getItem('accessToken');
		url = `${url}?token=${token}`;
		let timeRange = info.rangeTime;
		if (timeRange && timeRange.length == 2) {
			url = `${url}&startTime=${timeRange[0].format("YYYY-MM-DD HH:mm:ss")}`;
			url = `${url}&endTime=${timeRange[1].format("YYYY-MM-DD HH:mm:ss")}`;
		}
		let no = info.no;
		if (no) {
			url = `${url}&orderNo=${no}`;
		}
		let payType = info.payType;
		if (payType && payType > 0) {
			url = `${url}&payType=${payType}`;
		}
		let gasId = info.gasId;
		if (gasId && gasId > 0) {
			url = `${url}&gasId=${gasId}`;
		}

		return window.open(url);
	},
	saveBanner(data){
		let url = `/api/backend/banner`;
		return instance.post(url,data)
	},
	updateBanner(id,data){
		let url = `/api/backend/banner/${id}`;
		return instance.put(url,data)
	},
	loadBanner() {
		let url = `/api/backend/banner`;
		return instance.get(url);
	},
	enableBanner(id) {
		let url = `/api/backend/banner/${id}/enable`;
		return instance.post(url);
	},
	disableBanner(id) {
		let url = `/api/backend/banner/${id}/disable`;
		return instance.post(url);
	},
	deleteBanner(id) {
		let url = `/api/backend/banner/${id}`;
		return instance.delete(url);
	},
	loadAllGas(name) {
		let url = `/api/backend/gas/loadAll?name=${name}`;
		return instance.get(url);
	},
	loadGas(info) {
		if (!info) {
			info = {};
		}
		let url = `/api/backend/gas`;
		let pageNo = info && info.pageNo ? info.pageNo : 1;
		let pageSize = info && info.pageSize ? info.pageSize : 20;
		url = `${url}?pageNo=${pageNo}&pageSize=${pageSize}`;
		let gasName = info && info.name;
		if (gasName) {
			url = `${url}&name=${gasName}`;
		}
		return instance.get(url);
	},
	loadSingleGas(id){
		let url = `/api/backend/gas/${id}`;
		return instance.get(url);
	},
	saveGas(obj){
		let url = `/api/backend/gas`;
		return instance.post(url,obj);
	},
	updateGas(id,obj){
		let url = `/api/backend/gas/${id}`;
		return instance.put(url,obj);
	},
	enableGas(id) {
		let url = `/api/backend/gas/${id}/enable`;
		return instance.put(url);
	},
	disableGas(id) {
		let url = `/api/backend/gas/${id}/disable`;
		return instance.put(url);
	},
	deleteGas(id){
		let url = `/api/backend/gas/${id}`;
		return instance.delete(url);
	},
	loadOil(gasId){
		let url = `/api/backend/${gasId}/oil`;
		return instance.get(url);
	},
	saveOil(gasId,obj){
		let url = `/api/backend/${gasId}/oil`;
		return instance.post(url,obj);
	},
	updateOil(gasId,oilId,obj){
		let url = `/api/backend/${gasId}/oil/${oilId}`;
		return instance.put(url,obj);
	},
	deleteOil(gasId,oilId){
		let url = `/api/backend/${gasId}/oil/${oilId}`;
		return instance.delete(url);
	},
	enableOil(gasId,oilId){
		let url = `/api/backend/${gasId}/oil/${oilId}/enable`;
		return instance.put(url);
	},
	disableOil(gasId,oilId){
		let url = `/api/backend/${gasId}/oil/${oilId}/disable`;
		return instance.put(url);
	},
	loadGun(gasId){
		let url = `/api/backend/${gasId}/gun`;
		return instance.get(url);
	},
	saveGun(gasId,obj){
		let url = `/api/backend/${gasId}/gun`;
		return instance.post(url,obj);
	},
	updateGun(gasId,gunId,obj){
		let url = `/api/backend/${gasId}/gun/${gunId}`;
		return instance.put(url,obj);
	},
	deleteGun(gasId,gunId,obj){
		
	},
	enableGun(gasId,gunId){
		let url = `/api/backend/${gasId}/gun/${gunId}/enable`;
		return instance.put(url);
	},
	disableGun(gasId,gunId){
		let url = `/api/backend/${gasId}/gun/${gunId}/disable`;
		return instance.put(url);
	},
	loadGasEmploy(gasId){
		let url = `/api/backend/${gasId}/employ`;
		return instance.get(url);
	},
	saveGasEmploy(gasId,obj){
		let url = `/api/backend/${gasId}/employ`;
		return instance.post(url,obj);
	},
	updateGasEmploy(gasId,employId,obj){
		let url = `/api/backend/${gasId}/employ/${employId}`;
		return instance.put(url,obj);
	},
	resetGasEmployBind(gasId,employId){
		let url = `/api/backend/${gasId}/employ/${employId}/reset`;
		return instance.post(url);
	},
	enableGasEmploy(gasId,employId){
		let url = `/api/backend/${gasId}/employ/${employId}/enable`;
		return instance.post(url);
	},
	disableGasEmploy(gasId,employId){
		let url = `/api/backend/${gasId}/employ/${employId}/disable`;
		return instance.post(url);
	},
	deleteGasEmploy(gasId,employId){
		let url = `/api/backend/${gasId}/employ/${employId}`;
		return instance.delete(url);
	},
	loadConfig(){
		let url = `/api/backend/config`;
		return instance.get(url);
	},
	updateConfig(arr){
		let url = `/api/backend/config`;
		return instance.post(url,arr);
	}
};
export default api;