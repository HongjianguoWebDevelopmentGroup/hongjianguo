<template v-loading="loading">
	<app-table :columns="columns" :data="taskDelayData"></app-table>
</template>

<script>
import AppTable from '@/components/common/AppTable'
import {mapActions,mapGetters} from 'vuex'
export default {
	name: 'TaskCommonDelay',
	props:['row'],
	data () {
		return {
			delayData: [],
			loading:false,
			columns: [
				{type: 'text', label: '操作时间', prop: 'create_time', },
				{type: 'text', label: '操作人', prop: 'operator',render_simple: 'name',},
				{type: 'text', label: '延期天数', prop: 'days', },
				{type: 'text', label: '延期后期限', prop: 'delay_time', },
				{type: 'text', label: '备注', prop: 'remark', min_width: '200'},
			],
		}
	},
	computed: {
		...mapGetters([
			'taskDelayData'
		]),
		taskId () {
			return this.row.id;
		},
	},
	methods:{
		...mapActions([
			'refreshTaskDelay',
		]),
	},
	created () {
		this.refreshTaskDelay(this.taskId);
	},
	watch:{
		taskId () {
			this.refreshTaskDelay(this.taskId);
		},
	},
	components: {
		AppTable,
	}
}
</script>