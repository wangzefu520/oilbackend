import api from '../../api';
const state = {
	username:null,
	nickName:null,
	avater:null,
	accessToken: null,
	loginLoading: false
};

const mutations = {
	LOGINING(state) {
		state.loginLoading = true;
	},
	LOGINED(state) {
		state.loginLoading = false;
	},
	LOADLOGININFO(state){
		state.nickName = sessionStorage.getItem("nickName");
		state.avater = sessionStorage.getItem("avater");
		state.username = sessionStorage.getItem("username");
	},
	CHANGE_LOGIN_STATU(state, data) {
		state.username = data.username;
		state.accessToken = data.token;
		state.nickName = data.nickName;
		state.avater = data.avater;
		sessionStorage.setItem("username",data.username);
		sessionStorage.setItem("avater",data.avater);
		sessionStorage.setItem("nickName",data.nickName);
		sessionStorage.setItem('accessToken',data.token);
	},
	CLEARLOGININFO(state){
		state.hasLogin = false;
		state.accessToken = null;
		state.nickName = null;
		state.avater = null;
		sessionStorage.clear();
	}
};

const actions = {
	loginHandle(context, info) {
		context.commit('LOGINING');
		return new Promise((resolve, reject) => {
			api.login(info).then(res => {
				console.log(res);
				let data = res.data;
				if (data.code == 200) {
					data = data.data;
					resolve(data);
					context.commit('CHANGE_LOGIN_STATU', data);
				} else {
					reject(data.msg);
				}
				context.commit('LOGINED');
			}).catch(err => {
				reject('请求异常');
				context.commit('LOGINED');
			});
		});
	},
	logoutHandle(context){
		context.commit('CLEARLOGININFO');
		return new Promise((resolve)=>{
			resolve();
		});
	}
};

export default {
	state,
	mutations,
	actions
}