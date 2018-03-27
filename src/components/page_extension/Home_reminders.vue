<template>
	<app-table v-loading="loading" element-loading-text="加载中..." :columns="columns" :data="data"></app-table>
</template>

<script>
import AppTable from '@/components/common/AppTable'
const url = '/api/reminders';
export default {
	name: 'homeRemindrs',
	data () {
		return {
			loading: false,
			data: [],
			columns: [
				{ type: 'text', prop: 'keyword', label: '监控类型' },
				{ type: 'text', prop: 'serial', label: '案号' },
				{ type: 'text', prop: 'title', label: '案件名称' },
				{ type: 'text', prop: 'deadline', label: '期限' },
				{ 
					type: 'text', 
					prop: 'day', 
					label: '到期情况',
					render_text: (item) => {
						if(item > 0) {
							return `还有${item}天到期`;
						}else if(item < 0) {
							return `已过期${-item}天`;
						}else if(item == 0) {
							return '今日到期';
						}
					}
				},
				{ type: 'text', prop: 'remark', label: '备注' },
			]
		}
	},
	methods: {
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