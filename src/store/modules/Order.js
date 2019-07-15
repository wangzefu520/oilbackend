import api from '../../api';
import base from './Base';

const state = base.extendFn(base.baseState, {
});

const mutations = base.extendFn(base.baseMutations, {
});

const actions = base.extendFn(base.baseActions, {
	loadOrder(context, info) {
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
	},
	exportOrder(context,info){
		api.exportOrder(info);
	}
});

export default {
	state,
	mutations,
	actions
}