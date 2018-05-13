const state = {
	patent: null,
}

const getters = {
	patentListVisible: state => state.patent ? state.patent : [],
}

const mutations = {
	setFieldVisible ({state}, {type, value}) {
		state[type] = value;
	}
}

const actions = {
	refreshFieldVisible ({commit, rootState}) {

	}
}

export default {
	state,
	getters,
	mutations,
	actions,
}