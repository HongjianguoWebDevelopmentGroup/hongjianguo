<template>
<div class="main">
	<table-component :tableOption="option" :data="tableData" @refreshTableData="refreshTableData" ref="table"></table-component>
	<app-shrink :visible.sync="shrinkVisible" title="报表详情">
    <el-button type="danger" slot="header" size="small" style="float: right; margin-top: 6px;" :disabled="disabled">删除</el-button>
    <el-button type="primary" slot="header" size="small" style="float: right; margin-top: 6px;" :disabled="disabled" :loading="loading" @click="reportExport">{{loading ? '导出中...' : '导出'}}</el-button>
		<report-detail :current-row="currentRow" ref="detail"></report-detail>
	</app-shrink>
</div>
</template>

<script>
import TableComponent from '@/components/common/TableComponent'
import AppShrink from '@/components/common/AppShrink'
import ReportDetail from '@/components/page_extension/Report_detail'
import {mapGetters} from 'vuex'

const url = '/api/reports';
export default {
	name: 'report',
	data () {
		return {
			option: {
				header_btn: [
					{type: 'add', label: '新建报表', click: _=>{this.$router.push(this.config.add_url)}},
				],
				columns: [
					{type: 'text', prop: 'title', label: '报表名称'},
					{type: 'text', prop: 'creator', render_simple: 'name', label: '创建者'},
					{type: 'text', prop: 'create_time', label: '创建时间'},
				],
				is_border: false,
				is_pagination: false,
				rowClick: this.handleRowClick,
				highlightCurrentRow: true,
			},
			tableData: [],
			currentRow: '',
			shrinkVisible: false,
			disabled: false,
			loading: false,
		};
	},
	computed: {
		...mapGetters([
			'tableConfigsCache',
		]),
		type () {
			return this.$route.meta.type;
		},
		config () {
			return this.tableConfigsCache[this.type];
		}
	},
	methods: {
		refreshTableData (para) {
			this.$axiosGet({
				url,
				data: Object.assign({}, para, { table_type: this.type }),
				success: _=>{
					this.tableData = _.result;
				}
			})
		},
		refresh () {
			this.$refs.table.refresh();
		},
		handleRowClick (row) {
			// console.log(row);
			this.currentRow = row;
			this.shrinkVisible = true;
		},
		reportExport () {
			this.$axiosGet({
				url: this.config.url,
				data: Object.assign({}, JSON.parse(this.currentRow.filter), this.$tool.shallowCopy(this.currentRow, {skip: ['filter', 'title', 'creator_id', 'creator', 'create_time', 'id']}), {format: 'report'}),
				success: _=>{
					window.location.href = _[this.config.data_key].downloadUrl;
				}
			})
			
		},
	},
	mounted () {
		this.refresh();
	},
	components: {
		TableComponent,
		AppShrink,
		ReportDetail,
	}
}	
</script>