<template>
	<div class="main">
		<table-component :tableOption="option" :data="tableData" @refreshTableData="refreshTableData" ref="table">
			<el-select v-model="status" slot="status" style="width: 100px;margin-left: 5px;">
				<el-option label="未处理" :value="0"></el-option>
				<el-option label="已处理" :value="1"></el-option>
			</el-select>
		</table-component>
		<app-shrink :visible.sync="shrinkVisible" :title="currentRow.number">
			<detail :id="currentRow.id"></detail>
		</app-shrink>
	</div>
</template>
<script>
import TableComponent from '@/components/common/TableComponent'
import AppShrink from '@/components/common/AppShrink'
import Detail from '@/components/page_extension/RenewalEstimate_detail'
const URL = '/api/renewalestimate';
const statusMap = new Map([[0, '未处理'], [1, '已处理']]);
export default {
	name: 'renewalEstimate',
	data () {
		return {
			status: 0,
			option: {
				name: 'renewalEstimateList',
				url: URL,
				height: 'default2',
				highlightCurrentRow: true, 
        rowClick: this.handleRowClick,
        search_placeholder: '编号、创建人',
				header_btn: [
					{ type: 'add', click: this.add },
					{ type: 'delete' },
					{ type: 'control' },
				],
				header_slot: ['status'],
				columns: [
					{ type: 'selection' },
					{ type: 'text', label: '编号', prop: 'number', width: '200' },
					{ type: 'text', label: '创建时间', prop: 'create_time', width: '200'},
					{ type: 'text', label: '创建人', prop: 'member', render_simple: 'name', width: '200'},
					// { 
					// 	type: 'text', 
					// 	label: '评估单状态', 
					// 	prop: 'status',
					// 	render_text: _=>statusMap.get(_), 
					// 	width: '200',
					// },
					{ type: 'text', label: '备注', prop: 'remark', min_width: '200'},
				]
			},
			tableData: '',
			currentRow: '',
			shrinkVisible: false,
		};
	},
	methods: {
		add () {
			this.$router.push('/renewal/fee');
		},
		refresh () {
			this.$refs.table.refresh();
		},
		refreshTableData (option) {
			this.$axiosGet({
				url: URL,
				data: Object.assign({}, option, {status: this.status}),
				success: _=>{this.tableData = _.data},
			})
		},
		handleRowClick (row) {
			this.currentRow = row;
			this.shrinkVisible = true;
		}
	},
	mounted () {
		this.refresh();
	},
	watch: {
		status () {
			this.refresh();	
		}
	},
	components: {
		TableComponent,
		AppShrink,
		Detail,
	}
} 
</script>