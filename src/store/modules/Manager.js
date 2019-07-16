import api from '../../api';
import base from './Base';

const state = base.extendFn(base.baseState, {
	modelLoading: false,
	managerWinVisible: false
});

const mutations = base.extendFn(base.baseMutations, {
	CHANGEMANAGERSTATE(state, id) {
		let datas = state.datas;
		datas.forEach((it) => {
			if (it.id == id) {
				it.enable = !it.enable;
			}
		})
	},
	REMOVEMANAGER(state, id) {
		let datas = state.datas;
		state.datas = datas.filter(it => it.id != id);
	},
	MANAGERWINSHOW(state) {
		state.managerWinVisible = true;
	},
	MANAGERWINHIDE(state) {
		state.managerWinVisible = false;
	},
	MODELLOADING(state) {
		state.modelLoading = true;
	},
	MODELUNLOADING(state) {
		state.modelLoading = false;
	}
});

const actions = base.extendFn(base.baseActions, {
	managerWinShow(context) {
		context.commit('MANAGERWINSHOW');
	},
	managerWinHide(context) {
		context.commit('MANAGERWINHIDE');
	},
	loadManager(context, info) {
		return new Promise((resolve, reject) => {
			context.commit('LOADING');
			api.loadManager(info).then(res => {
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
	saveManager(context, info) {
		return new Promise((resolve, reject) => {
			context.commit('MODELLOADING');
			api.saveManager(info).then(res=>{
				let data = res.data;
				if (data.code == 200) {
					resolve();
					context.commit('MODELUNLOADING');
					context.dispatch('loadManager');
				} else {
					reject('请求异常');
					context.commit('MODELUNLOADING');
				}
			});
		});
	},
	updateManager(context, info) {
		let {id, nickname,roleType} = info;
		return new Promise((resolve, reject) => {
			context.commit('MODELLOADING');
			api.updateManager(id, nickname,roleType).then(res => {
				let data = res.data;
				if (data.code == 200) {
					resolve();
					context.commit('MODELUNLOADING');
					context.dispatch('loadManager');
				} else {
					reject('请求异常');
					context.commit('MODELUNLOADING');
				}
			})
		});
	},
	changePwd(context, id) {
		return new Promise((resolve, reject) => {
			api.resetManagerPassword(id).then(res => {
				let data = res.data;
				if (data.code == 200) {
					resolve();
				} else {
					reject('请求异常');
				}
			}).catch(err => {
				reject('请求异常');
			});
		});
	},
	disableManager(context, id) {
		return new Promise((resolve, reject) => {
			api.disableManager(id).then(res => {
				let data = res.data;
				if (data.code == 200) {
					resolve();
					context.commit('CHANGEMANAGERSTATE', id);
				} else {
					reject('请求异常');
				}
			}).catch(err => {
				reject('请求异常');
			});
		});
	},
	enableManager(context, id) {
		return new Promise((resolve, reject) => {
			api.enableManager(id).then(res => {
				let data = res.data;
				if (data.code == 200) {
					resolve();
					context.commit('CHANGEMANAGERSTATE', id);
				} else {
					reject('请求异常');
				}
			}).catch(err => {
				reject('请求异常');
			});
		});
	},
	deleteManager(context, id) {
		return new Promise((resolve, reject) => {
			api.deleteManager(id).then(res => {
				let data = res.data;
				if (data.code == 200) {
					resolve();
					context.commit('REMOVEMANAGER', id);
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