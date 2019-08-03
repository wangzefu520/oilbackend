import api from '../../api';
import base from './Base';

const state = base.extendFn(base.baseState, {
	editGas:null
});

const mutations = base.extendFn(base.baseMutations, {
	CHANGEGASSTATE(state,id){
		let datas = state.datas;
		datas.forEach((it) => {
			if (it.id == id) {
				it.enable = !it.enable;
			}
		})
	},
	REMOVEGAS(state, id) {
		let datas = state.datas;
		state.datas = datas.filter(it => it.id != id);
	},
	LOADEDEDITGAS(state,gas){
		state.editGas = gas;
	}
});

const actions = base.extendFn(base.baseActions, {
	saveGas(context,obj){
		return new Promise((resolve, reject) => {
			api.saveGas(obj).then(res => {
				let data = res.data;
				console.log(data);
				if (data.code == 200) {
					resolve();
					context.dispatch('loadGas');
				} else {
					reject('请求异常');
				}
			}).catch(err => {
				reject('请求异常');
			});
		});
	},
	updateGas(context,obj){
		return new Promise((resolve, reject) => {
			let gasId = obj.gasId;
			delete obj['gasId'];
			// console.log(gasId,obj);
			api.updateGas(gasId,obj).then(res => {
				let data = res.data;
				if (data.code == 200) {
					resolve();
					context.dispatch('loadGas');
				} else {
					reject('请求异常');
				}
			}).catch(err => {
				reject('请求异常');
			});
		});
	},
	loadAllGas(context,name){
		return new Promise((resolve, reject) => {
			api.loadAllGas(name).then(res => {
				let data = res.data;
				if (data.code == 200) {
					resolve();
					context.commit('SEARCHLOADGAS', data.data);
				} else {
					reject('请求异常');
				}
			}).catch(err => {
				reject('请求异常');
			});
		});
	},
	loadGas(context, info) {
		return new Promise((resolve, reject) => {
			context.commit('LOADING');
			api.loadGas(info).then(res => {
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
	loadSingleGas(context,id){
		return new Promise((resolve,reject)=>{
			api.loadSingleGas(id).then(res=>{
				let data = res.data;
				if (data.code == 200) {
					resolve();
					context.commit('LOADEDEDITGAS', data.data);
				} else {
					reject('请求异常');
				}
			}).catch(err=>{
				reject('请求异常');
			});
		});
	},
	enableGas(context,id){
		return new Promise((resolve, reject) => {
			api.enableGas(id).then(res => {
				let data = res.data;
				if (data.code == 200) {
					resolve();
					context.commit('CHANGEGASSTATE', id);
				} else {
					reject('请求异常');
				}
			}).catch(err => {
				reject('请求异常');
			});
		});
	},
	disableGas(context,id){
		return new Promise((resolve, reject) => {
			api.disableGas(id).then(res => {
				let data = res.data;
				if (data.code == 200) {
					resolve();
					context.commit('CHANGEGASSTATE', id);
				} else {
					reject('请求异常');
				}
			}).catch(err => {
				reject('请求异常');
			});
		});
	},
	deleteGas(context,id){
		return new Promise((resolve, reject) => {
			api.deleteGas(id).then(res => {
				let data = res.data;
				if (data.code == 200) {
					resolve();
					context.commit('REMOVEGAS', id);
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