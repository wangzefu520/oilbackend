import api from '../../api';
import base from './Base';

const state = base.extendFn(base.baseState, {
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
	}
});

const actions = base.extendFn(base.baseActions, {
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
	enableGasEmploy(context,id){
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
	disableGasEmploy(context,id){
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
	deleteGasEmploy(context,id){
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