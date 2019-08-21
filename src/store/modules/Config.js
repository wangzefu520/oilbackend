import api from '../../api';
import base from './Base';

const state = base.extendFn(base.baseState, {
	
});

const mutations = base.extendFn(base.baseMutations, {
});

const actions = base.extendFn(base.baseActions, {
	updateConfig(context,arr){
		return new Promise((resolve, reject)=>{
			api.updateConfig(arr).then(res=>{
				resolve();
				context.dispatch('loadConfig');
			}).catch(err=>{
				reject('请求异常');
			});
		});
	},
	loadConfig(context) {
		return new Promise((resolve, reject) => {
			context.commit('LOADING');
			api.loadConfig().then(res => {
				let data = res.data;
				if (data.code == 200) {
					context.commit('LOADED', data);
					resolve(data.data);
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