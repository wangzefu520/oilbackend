import api from '../../api';
import base from './Base';

const state = base.extendFn(base.baseState, {
	guns:[]
});

const mutations = base.extendFn(base.baseMutations, {
	LOADEDALLGUNS(state,data){
		state.guns = data;
	},
	CLEARALLGUNS(state){
		state.guns=[];
	}
});

const actions = base.extendFn(base.baseActions, {
	clearGuns(context){
		context.commit('CLEARALLGUNS');
	},
	saveGun(context,obj){
		return new Promise((resolve, reject) => {
			let gunInfo={
				name:obj.name,
				oilId:obj.oilId
			};
			api.saveGun(obj.gasId,gunInfo).then(res => {
				let data = res.data;
				if (data.code == 200) {
					resolve();
					context.dispatch('loadAllGun',obj.gasId);
				} else {
					reject('请求异常');
				}
			}).catch(err => {
				reject('请求异常');
			});
		});
	},
	updateGun(context,obj){
		return new Promise((resolve, reject) => {
			let gunInfo={
				name:obj.name,
				oilId:obj.oilId
			};
			api.updateGun(obj.gasId,obj.gunId,gunInfo).then(res => {
				let data = res.data;
				if (data.code == 200) {
					resolve();
					context.dispatch('loadAllGun',obj.gasId);
				} else {
					reject('请求异常');
				}
			}).catch(err => {
				reject('请求异常');
			});
		});
	},
	enableGun(context,obj){
		return new Promise((resolve, reject) => {
			api.enableGun(obj.gasId,obj.gunId).then(res => {
				let data = res.data;
				if (data.code == 200) {
					resolve();
					context.dispatch('loadAllGun',obj.gasId);
				} else {
					reject('请求异常');
				}
			}).catch(err => {
				reject('请求异常');
			});
		});
	},
	disableGun(context,obj){
		return new Promise((resolve, reject) => {
			api.disableGun(obj.gasId,obj.gunId).then(res => {
				let data = res.data;
				if (data.code == 200) {
					resolve();
					context.dispatch('loadAllGun',obj.gasId);
				} else {
					reject('请求异常');
				}
			}).catch(err => {
				reject('请求异常');
			});
		});
	},
	deleteGun(context,obj){
		return new Promise((resolve, reject) => {
			api.deleteGun(obj.gasId,obj.oilId).then(res => {
				let data = res.data;
				if (data.code == 200) {
					resolve();
					context.dispatch('loadAllGun',obj.gasId);
				} else {
					reject('请求异常');
				}
			}).catch(err => {
				reject('请求异常');
			});
		});
	},
	loadAllGun(context,gasId){
		return new Promise((resolve, reject) => {
			api.loadGun(gasId).then(res => {
				let data = res.data;
				if (data.code == 200) {
					resolve();
					context.commit('LOADEDALLGUNS', data.data);
				} else {
					reject('请求异常');
				}
			}).catch(err => {
				reject('请求异常');
			});
		});
	},
	loadOilGun(context, info) {
		return new Promise((resolve, reject) => {
			context.commit('LOADING');
			api.loadOrder(info).then(res => {
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
	}
});

export default {
	state,
	mutations,
	actions
}