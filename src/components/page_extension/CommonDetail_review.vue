<template>
	<app-table :columns="columns" :data="detailReview"></app-table>
</template>

<script>
import AppTable from '@/components/common/AppTable'
import {mapGetters} from 'vuex'
export default {
	name: 'CommonDetailReview',
	data () {
		return {
			columns: [
				{type: 'text', label: '权利要求范围', prop: 'claim_scope', width: '200'},
				{type: 'text', label: '权利要求/稳定性', prop: 'claim_stability', width: '200'},
				{type: 'text', label: '举证难易程度', prop: 'evidence_difficulty', width: '200'},
				{type: 'text', label: '备注', prop: 'remark', min_width: '200'},
			],
		}
	},
	computed: {
		...mapGetters([
			'detailReview',
		]),
	},
	components: {
		AppTable,
	}
}
</script>