<template>
	<app-table :columns="columns" :data="detailDefence"></app-table>
</template>
<script>
import AppTable from '@/components/common/AppTable'
import {mapGetters} from 'vuex' 
export default {
	name: 'commonDetailDefence',
	data () {
		return {
			columns: [
				{type: 'text', label: '审查节点', prop: 'flow'},
				{type: 'text', label: '审查人', prop: 'person'},
				{type: 'text', label: '审查时间', prop: 'end_time'},
				{type: 'text', label: '审查要点', prop: 'points'},
				{type: 'text', label: '修改/答辩', prop: 'defence'},
			]	
		}
	},
	computed: {
		...mapGetters([
			'detailDefence',
		]),
	},
	components: {
		AppTable,
	}
}
</script>