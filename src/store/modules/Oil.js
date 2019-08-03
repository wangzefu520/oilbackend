import api from '../../api';
import base from './Base';

const state = base.extendFn(base.baseState, {
	oils:[]
});

const mutations = base.extendFn(base.baseMutations, {
	LOADEDALLOILS(state,data){
		state.oils = data;
	},
	CLEARALLOILS(state){
		state.oils = [];
	}
});

const actions = base.extendFn(base.baseActions, {
	clearOil(context){
		context.commit('CLEARALLOILS');
	},
	saveOil(context,obj){
		return new Promise((resolve, reject) => {
			api.saveOil(obj.gasId,{name:obj.name,marketPrice:obj.marketPrice,type:obj.type}).then(res => {
				let data = res.data;
				if (data.code == 200) {
					resolve();
					context.dispatch('loadAllOil',obj.gasId);
				} else {
					reject('请求异常');
				}
			}).catch(err => {
				reject('请求异常');
			});
		});
	},
	updateOil(context,obj){
		return new Promise((resolve, reject) => {
			api.updateOil(obj.gasId,obj.oilId,{name:obj.name,marketPrice:obj.marketPrice,type:obj.type}).then(res => {
				let data = res.data;
				if (data.code == 200) {
					resolve();
					context.dispatch('loadAllOil',obj.gasId);
				} else {
					reject('请求异常');
				}
			}).catch(err => {
				reject('请求异常');
			});
		});
	},
	enableOil(context,obj){
		return new Promise((resolve, reject) => {
			api.enableOil(obj.gasId,obj.oilId).then(res => {
				let data = res.data;
				if (data.code == 200) {
					resolve();
					context.dispatch('loadAllOil',obj.gasId);
				} else {
					reject('请求异常');
				}
			}).catch(err => {
				reject('请求异常');
			});
		});
	},
	disableOil(context,obj){
		return new Promise((resolve, reject) => {
			api.disableOil(obj.gasId,obj.oilId).then(res => {
				let data = res.data;
				if (data.code == 200) {
					resolve();
					context.dispatch('loadAllOil',obj.gasId);
				} else {
					reject('请求异常');
				}
			}).catch(err => {
				reject('请求异常');
			});
		});
	},
	deleteOil(context,obj){
		return new Promise((resolve, reject) => {
			api.deleteOil(obj.gasId,obj.oilId).then(res => {
				let data = res.data;
				if (data.code == 200) {
					resolve();
					context.dispatch('loadAllOil',obj.gasId);
				} else {
					reject('请求异常');
				}
			}).catch(err => {
				reject('请求异常');
			});
		});
	},
	loadAllOil(context,gasId){
		return new Promise((resolve, reject) => {
			api.loadOil(gasId).then(res => {
				let data = res.data;
				if (data.code == 200) {
					resolve();
					context.commit('LOADEDALLOILS', data.data);
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