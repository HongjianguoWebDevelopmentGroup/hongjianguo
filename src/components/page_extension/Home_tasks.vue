<template>
	<app-table v-loading="loading" element-loading-text="加载中..." :columns="columns" :data="data" :max-height="200"></app-table>
</template>

<script>
import AppTable from '@/components/common/AppTable'
const url = '/api/duetasks';
export default {
	name: 'homeRemindrs',
	data () {
		return {
			loading: false,
			data: [],
			columns: [
				{ 
					type: 'text', 
					prop: 'serial', 
					label: '案号',
					render (h, item) {
						return h('el-button', {
							attrs: {
								type: 'text',
							},
							on: {
								click: _ => { this.$router.push({ path: '/task/pending', query: { keyword: item }}); },
							}
						}, item);
					},
				},
				{ type: 'text', prop: 'title', label: '案件名称' },
				{ type: 'text', prop: 'type', label: '任务类型' },
				{ type: 'text', prop: 'deadline', label: '法定期限' },
				{ type: 'text', prop: 'day_text', label: '到期情况' },
				{ type: 'text', prop: 'remark', label: '备注' },
			]
		}
	},
	methods: {
		clickHandler (item) {
			this.router.push({ path: '/task/pending', query: { keyword: item }});
		},
		refresh () {
			this.loading = true;
			this.$axiosGet({
				url,
				success: _=>{
					this.data = _.result;
				},
				error: _=>{
					this.data = [];
				},
				catchFunc: _=>{
					this.data = [];
				},
				complete: _=>{
					this.loading = false;
				},
			})
		}
	},
	mounted () {
		this.refresh();
	},
	components: {
		AppTable,
	},
}
</script>