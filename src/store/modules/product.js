let url = '/products';
const state = {
	data: [],
}

const getMap = (data) => {
	const map = new Map();
	a(data);
	return map;

	function a(arr) {
		for(let d of arr) {
			map.set(d.id, d);
			if(d.children && d.children.length) {
				a(d.children);
			}
		}
	}
}

const getters = {
	productData: state=>state.data,
	productMap: state=>{
		return getMap(state.data);
	},
	productOptions: (state, getters)=>{
		const map = getters.productMap;
		const arr = [...map.values()];

		return arr;
	}
}

const mutations = {
	setProduct (state, d) {
		state.data = d;
	}
}

const actions = {
	refreshProduct ({commit, rootState},{success} = {}) {
		url = rootState.status ? url.replace(/\/api/, '') : url;
		rootState.axios
			.get(url)
			.then(response=>{
				const d = response.data;
				if(d.status){
					commit('setProduct', d.products);
					if (success) {success(d)};
				}else {
					// alert('请求产品分类数据失败');
				}
			})
			.catch(error=>{console.log(error)});
	}
}

export default {
	state,
	getters,
	mutations,
	actions,
}