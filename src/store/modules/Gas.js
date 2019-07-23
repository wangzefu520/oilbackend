import api from '../../api';
import base from './Base';

const state = base.extendFn(base.baseState, {
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
	}
});

const actions = base.extendFn(base.baseActions, {
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