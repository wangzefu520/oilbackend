import api from '../../api';
import base from './Base';

const state = base.extendFn(base.baseState, {
});

const mutations = base.extendFn(base.baseMutations, {
});

const actions = base.extendFn(base.baseActions, {
	loadUser(context, info) {
		return new Promise((resolve, reject) => {
			context.commit('LOADING');
			api.loadUser(info).then(res => {
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