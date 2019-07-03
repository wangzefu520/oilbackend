import api from '../../api';

const state = {
	collapsed: false,
	selectMenu:[]
}

const mutations = {
	TOGGLE_COLLAPSED(state){
		state.collapsed = !state.collapsed
	},
	TOGGLE_MENU_SELECT(state,menuId){
		state.selectMenu=[menuId]
	}
}

const actions = {
	toggleCollapsed(context){
		context.commit('TOGGLE_COLLAPSED');
	}
}

export default {
	state,
	mutations,
	actions
}