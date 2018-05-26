<template>
	<app-table v-loading="loading" element-loading-text="加载中..." :columns="columns" :data="data" :max-height="200"></app-table>
</template>

<script>
import AppTable from '@/components/common/AppTable'
const url = '/api/reminders';
export default {
	name: 'homeRemindrs',
	props: {
		'refreshUrl': {
			type: String,
			required: true,
		}
	},
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
								click: _ => { this.$router.push({ path: '/patent/list', query: { keyword: item }}); },
							}
						}, item);
					},
				},
				{ type: 'text', prop: 'title', label: '案件名称' },
				{ type: 'text', prop: 'keyword', label: '监控类型' },
				{ type: 'text', prop: 'deadline', label: '期限' },
				{ type: 'text', prop: 'day_text', label: '到期情况' },
				{ type: 'text', prop: 'remark', label: '备注' },
				{ 
					type: 'action', 
					btns: [
						{
							type: 'delete',
							click: this.handleDelete,
						}
					],
					fixed: false,
					width: '100',
				}
			]
		}
	},
	methods: {
		handleDelete ({id}) {
			this.$confirm('此操作将永久删除该提醒, 是否继续?', '提示', {type: 'warning'})
				.then(() => {
          this.$axiosDelete({
          	url,
          	data: {
          		id: [id],
          	},
          	success: _=>{
          		this.$message({type: 'success', message: '删除提醒成功'});
          		this.refresh();
          	}
          })
        })
        .catch(() => {});
		},
		refresh () {
			this.loading = true;
			this.$axiosGet({
				url: this.refreshUrl,
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