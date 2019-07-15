import api from '../../api';
import base from './Base';

const state = base.extendFn(base.baseState, {
	searchGas:[]
});

const mutations = base.extendFn(base.baseMutations, {
	SEARCHLOADGAS(state,data){
		state.searchGas = data;
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
	}
});

export default {
	state,
	mutations,
	actions
}