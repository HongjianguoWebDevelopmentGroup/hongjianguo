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
				{type: 'text', label: '审查节点', prop: 'taskdef',render_simple: 'name'},
				{type: 'text', label: '记录人', prop: 'operator',render_simple: 'name'},
				{type: 'text', label: '记录时间', prop: 'create_time'},
				{type: 'text', label: '审查要点', prop: 'opinion'},
				{type: 'text', label: '修改/答辩', prop: 'response'},
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