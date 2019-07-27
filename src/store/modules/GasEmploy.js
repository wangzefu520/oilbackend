import api from '../../api';
import base from './Base';

const state = base.extendFn(base.baseState, {
	gasEmployWinLoading:false,
	gasEmployWinVisible:false
});

const mutations = base.extendFn(base.baseMutations, {
	CHANGEGASEMPLOYSTATE(state,id){
		let datas = state.datas;
		datas.forEach((it) => {
			if (it.id == id) {
				it.enable = !it.enable;
			}
		})
	},
	REMOVEGASEMPLOY(state, id) {
		let datas = state.datas;
		state.datas = datas.filter(it => it.id != id);
	},
	CHANGEGASEMPLOYBIND(state,obj){
		let datas = state.datas;
		datas.forEach((it) => {
			if (it.id == obj.id) {
				it.canBind=obj.canBind;
				it.secretCode=obj.secretCode;
			}
		})
	},
	GASEMPLOYWINSHOW(state){
		state.gasEmployWinVisible=true;
	},
	GASEMPLOYWINHIDE(state){
		state.gasEmployWinVisible = false;
	}
});

const actions = base.extendFn(base.baseActions, {
	gasEmployWinShow(context) {
		context.commit('GASEMPLOYWINSHOW');
	},
	gasEmployWinHide(context) {
		context.commit('GASEMPLOYWINHIDE');
	},
	loadGasEmploy(context, gasId) {
		return new Promise((resolve, reject) => {
			context.commit('LOADING');
			api.loadGasEmploy(gasId).then(res => {
				let data = res.data;
				if (data.code == 200) {
					resolve();
					context.commit('LOADED', data.data);
				} else {
					reject('请求异常');
				}
				context.commit('UNLOAD');
			}).catch(err => {
				reject('请求异常');
				context.commit('UNLOAD');
			});
		});
	},
	saveGasEmploy(context,obj){
		let gasId = obj.gasId;
		return new Promise((resolve, reject) => {
			api.saveGasEmploy(gasId,{name:obj.name,phone:obj.phone}).then(res => {
				let data = res.data;
				if (data.code == 200) {
					resolve();
					context.dispatch('loadGasEmploy', gasId);
				} else {
					reject('请求异常');
				}
			}).catch(err => {
				reject('请求异常');
			});
		});
	},
	updateGasEmploy(context,obj){
		let gasId = obj.gasId;
		let gasEmployId = obj.gasEmployId;
		return new Promise((resolve, reject) => {
			api.updateGasEmploy(gasId,gasEmployId,{name:obj.name,phone:obj.phone}).then(res => {
				let data = res.data;
				if (data.code == 200) {
					resolve();
					context.dispatch('loadGasEmploy', gasId);
				} else {
					reject('请求异常');
				}
			}).catch(err => {
				reject('请求异常');
			});
		});
	},
	resetGasEmployBind(context,obj){
		return new Promise((resolve, reject) => {
			api.resetGasEmployBind(obj.gasId,obj.employId).then(res => {
				let data = res.data;
				if (data.code == 200) {
					resolve();
					context.commit('CHANGEGASEMPLOYBIND', data.data);
				} else {
					reject('请求异常');
				}
			}).catch(err => {
				reject('请求异常');
			});
		});
	},
	enableGasEmploy(context,obj){
		return new Promise((resolve, reject) => {
			api.enableGasEmploy(obj.gasId,obj.employId).then(res => {
				let data = res.data;
				if (data.code == 200) {
					resolve();
					context.commit('CHANGEGASEMPLOYSTATE', obj.employId);
				} else {
					reject('请求异常');
				}
			}).catch(err => {
				reject('请求异常');
			});
		});
	},
	disableGasEmploy(context,obj){
		return new Promise((resolve, reject) => {
			api.disableGasEmploy(obj.gasId,obj.employId).then(res => {
				let data = res.data;
				if (data.code == 200) {
					resolve();
					context.commit('CHANGEGASEMPLOYSTATE', obj.employId);
				} else {
					reject('请求异常');
				}
			}).catch(err => {
				reject('请求异常');
			});
		});
	},
	deleteGasEmploy(context,obj){
		return new Promise((resolve, reject) => {
			api.deleteGasEmploy(obj.gasId,obj.employId).then(res => {
				let data = res.data;
				if (data.code == 200) {
					resolve();
					context.commit('REMOVEGASEMPLOY', obj.employId);
				} else {
					reject('请求异常');
				}
			}).catch(err => {
				reject('请求异常');
			});
		});
	}
});

export default {
	state,
	mutations,
	actions
}