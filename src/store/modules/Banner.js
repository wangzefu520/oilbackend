import api from '../../api';
import base from './Base';

const state = base.extendFn(base.baseState, {
});

const mutations = base.extendFn(base.baseMutations, {
});

const actions = base.extendFn(base.baseActions, {
	saveBanner(context,obj){
		return new Promise((resolve, reject)=>{
			api.saveBanner(obj).then(res=>{
				resolve();
				context.dispatch('loadBanner');
			}).catch(err=>{
				reject('请求异常');
			});
		});
	},
	updateBanner(context,obj){
		return new Promise((resolve, reject)=>{
			api.updateBanner(obj.id,{pic:obj.pic}).then(res=>{
				resolve();
				context.dispatch('loadBanner');
			}).catch(err=>{
				reject('请求异常');
			});
		});
	},
	loadBanner(context, info) {
		return new Promise((resolve, reject) => {
			context.commit('LOADING');
			api.loadBanner().then(res => {
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
	enableBanner(context,id){
		return new Promise((resolve, reject) => {
			api.enableBanner(id).then(res => {
				let data = res.data;
				if (data.code == 200) {
					resolve();
					context.dispatch('loadBanner');
				} else {
					reject('请求异常');
				}
			}).catch(err => {
				reject('请求异常');
			});
		});
	},
	disableBanner(context,id){
		return new Promise((resolve, reject) => {
			api.disableBanner(id).then(res => {
				let data = res.data;
				if (data.code == 200) {
					resolve();
					context.dispatch('loadBanner');
				} else {
					reject('请求异常');
				}
			}).catch(err => {
				reject('请求异常');
			});
		});
	},
	deleteBanner(context,id){
		return new Promise((resolve, reject) => {
			api.deleteBanner(id).then(res => {
				let data = res.data;
				if (data.code == 200) {
					resolve();
					context.dispatch('loadBanner');
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