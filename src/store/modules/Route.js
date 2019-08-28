import Layout from '@/components/Layout'
import api from '../../api';
const state = {
	initRoute: false,
	routes: []
};

const mutations = {
	CHANGEROUTEINIT(state) {
		state.initRoute = true;
	},
	LOADEDMENUS(state, routes) {
		state.routes = routes;
	},
	ROUTESCLEAR(state){
		state.initRoute = false;
		state.routes=[];
	}
};
const actions = {
	loadMenus(context, router) {
		return new Promise((resolve, reject) => {
			if (context.state.initRoute) {
				let route = context.state.routes[0];
				let path = route.key
				let id = route.id;
				context.commit('TOGGLE_MENU_SELECT', id);
				resolve(path);
			} else {
				api.loadMenus().then(res => {
					let { code, data } = res.data;
					if (code == 200) {
						context.dispatch('addRoutes', { router, data });
						let path = data[0].key
						let id = data[0].id;
						context.commit('LOADEDMENUS', data);
						context.commit('TOGGLE_MENU_SELECT', id);
						resolve(path);
					} else {
						reject('请求异常');
					}
				}).catch(err => {
					console.log(err);
					reject('请求异常');
				});

			}
		});
	},
	addRoutes(context, obj) {
		let { router, data } = obj;
		let routeArr = [];
		let defaultPath = data[0].route;
		let format = (data) => {
			data.forEach(e => {
				if (e.children) {
					format(e.children);
				} else {
					let route = {
						path: defaultPath == e.key ? '/backend' : '/backend/' + e.key,
						name: e.route,
						component(resolve) {
							require(['../../components/' + e.route + '.vue'], resolve)
						}
					}
					routeArr.push(route);
					if(e.key == 'gas'){
						let route = {
							path: '/backend/gas/:id',
							name: 'GasEdit',
							component(resolve) {
								require(['../../components/GasEdit.vue'], resolve)
							}
						}
						routeArr.push(route);
					}
				}
			});
		};
		format(data);
		let layout = {
			path: '/backend',
			component: Layout,
			children: routeArr
		}
		router.addRoutes([layout]);
		context.commit('CHANGEROUTEINIT');
	}
};

export default {
	state,
	mutations,
	actions
}