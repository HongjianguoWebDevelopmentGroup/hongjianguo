<template>
  <div class="main">
		<table-component :tableOption="tableOption" :data="tableData" @refreshTableData="refreshTableData" ref="table"></table-component>
  </div>
</template>

<script>
import TableComponent from '@/components/common/TableComponent'
import Strainer from '@/components/page_extension/NoticeCommon_strainer'
import AxiosMixins from '@/mixins/axios-mixins'

const config = [
	['patent', {
		URL: '/api/patents/notices',
		import_type: 'patent_notice',
		upload_type: 'patent_notice',
	}],
	['copyright', {
		URL: '/api/copyrights/notices',
		import_type: 'copyright_notice',
	}]
]
const map = new Map(config);

export default {
  name: 'noticeCommon',
  mixins: [AxiosMixins],
  data () {
	return {
			tableOption: {
				'header_btn': [
					// { type: 'custom', label: '筛选', icon: '', click: ()=>{alert("筛选")} },
					// { type: 'custom', label: '统计', icon: '', click: ()=>{alert("统计")} },
					{ type: 'delete', map_if: '/patent/notice/delete' },
					{ type: 'export' },
					{ type: 'import', label: 'CPC通知书导入' },
					{ type: 'batch_upload', label: '一般通知书上传' },
					{ type: 'control', label: '字段' },
					// { type: 'custom', label: '上传', icon: '', click: ()=>{alert("上传")} },
					// { type: 'custom', label: '批量上传', icon: '', click: ()=>{alert("批量上传")}},
				],
				'height': 'default2',
				'url': '',
				'import_type': '',
				'upload_type': '',
				'is_list_filter': true,
				'list_type': 'patent_notice',			
				'columns': [
					{ type: 'selection' },
					// { type: 'text', label: '通知书案件名称', prop: 'title', width: '200', is_import: true },
					{ type: 'text', label: '案号', prop: 'serial', width: '160' },
					{ type: 'text', label: '事务所案号', prop: 'agency_serial', width: '135', is_import: true},
					{ type: 'text', label: '通知书名称', prop: 'file_type', render_simple: 'name', width: '150', is_import: true },
					{ type: 'text', label: '案件名称', prop: 'title', width: '200', is_import: true },
					{ type: 'text', label: '申请号', prop: 'apn', width: '130', is_import: true },
					{ type: 'text', label: '发文日', prop: 'mail_date', width: '110', is_import: true },
					// { type: 'text', label: '发文序列号', prop: 'notice_serial', width: '110', is_import: true },
					{ type: 'text', label: '官方绝限', prop: 'deadline', width: '110' },
					{ type: 'text', label: '申请日', prop: 'apd', width: '110', is_import: true },
					{ type: 'text', label: '上传日', prop: 'create_time', width: '110' },
					{ type: 'text', label: '上传用户', prop: 'uploader', render_simple: 'name', width: '110' },
					// { type: 'text', label: '审查员', prop: 'examiner', width: '200' },
					// { type: 'text', label: '审查部门', prop: 'examiner_dept', width: '200' },
					// { type: 'text', label: '处理状态', prop: 'status', width: '200' },
					// { type: 'text', label: '备注', prop: 'remark', width: '200' },
					{ 
						type: 'action', 
						label: '操作',
						width: '150',
						btns: [
							{ type: 'view', btn_type: 'text', click: ({viewUrl})=>{window.open(viewUrl)} },
							{ type: 'download', btn_type: 'text', click: ({downloadUrl})=>{window.open(downloadUrl)} },
						],
					}
				],
				'import_columns': [
					// { 
					// 	type: 'array', 
					// 	label: '费用', 
					// 	prop: 'fees', 
					// 	width: '400',
					// 	render: _=>{
							
					// 		return _.map(_=>`${_.name}(${_.fee})`)
					// 	},
					// }
				]
			},
			tableData: [],
			filter: {},
	  }
	},
	computed: {
		defaultParams () {
			const params = this.$route.meta.params;
			return params ? params : {};
		},
		type () {
			let type = this.$route.meta.type;

			return type ? type : '';
		},
		config () {
			if(map.get(this.type)) {
				return map.get(this.type);
			}else {
				return this.type;
			}
		}
	},
	methods: {
		refresh () {
			this.$refs.table.refresh();
		},
		refreshTableData (option) {
			const url = this.config.URL;
			const data = Object.assign({}, option, this.defaultParams);
			const success = _=>{
				if(option.format == 'excel') {

					window.location.href = _.list.downloadUrl;
				}
				else {
					this.tableData = _.list;	
				}
				
			};

			this.axiosGet({url, data, success});
		}
	},
	created () {
		this.tableOption.import_type = this.config.import_type;
		this.tableOption.upload_type = this.config.upload_type;		
		this.tableOption.url = this.config.URL;
	},
	mounted () {
		this.refresh();
	},
	components: { 
		TableComponent, 
		Strainer, 
	},
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>