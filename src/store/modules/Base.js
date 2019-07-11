
const baseState = {
	loading:false,
	datas:[],
	currentPageNo:1,
	pageSize:10,
	total:0,
	totalPage:0,
};

const baseMutations = {
	LOADING(state) {
		state.loading = true;
	},
	LOADED(state,data){
		console.log('=========================================');
		state.total = data.total;
		state.currentPageNo=data.pageNo;
		state.pageSize = data.pageSize;
		state.totalPage = data.totalPage;
		state.datas = data.data;
	},
	UNLOAD(state){
		state.loading = false;
	}
};

const baseActions = {
};

function extend(source,target){
	let obj = {};
	for(var key in source){
		obj[key] = source[key]
	}
	for(var key in target){
		obj[key] = target[key]
	}
	return obj;
}

export default {
	baseState,
	baseMutations,
	baseActions,
	extendFn:extend
}