<template>
  <div class="main">
		<table-component :tableOption="tableOption" :data="tableData" @refreshTableData="refreshTableData" ref="table"></table-component>
  </div>
</template>

<script>
import TableComponent from '@/components/common/TableComponent'
import Strainer from '@/components/page_extension/NoticeCommon_strainer'

const config = [
	['patent', {
		URL: '/api/patents/notices',
		import_type: 'patent_notice',
		upload_type: 'patent_notice',
	}],
	['trademark', {
		URL: '/api/trademarks/notices',
		import_type: false,
		upload_type: 'trademark_notice',
	}]
]
const map = new Map(config);

export default {
  name: 'noticeCommon',
  data () {
	return {
			tableOption: {
				'header_btn': [
					{ type: 'delete', map_if: '/patent/notice/delete' },
					{ type: 'export' },
					{ type: 'import', label: 'CPC通知书导入' },
					{ type: 'batch_upload', label: '通知书上传' },
					{ type: 'control', label: '字段' },
				],
				'height': 'default2',
				'url': '',
				'import_type': '',
				'upload_type': '',			
				'columns': [
					{ type: 'selection' },
					// { type: 'text', label: '通知书案件名称', prop: 'title', width: '200', is_import: true },
					{ type: 'text', label: '内部案号', prop: 'serial', width: '200' },
					{ type: 'text', label: '事务所案号', prop: 'agency_serial', width: '200'},
					{ type: 'text', label: '案件名称', prop: 'project', render_simple: 'name', width: '200'},
					{ type: 'text', label: '申请号', prop: 'apn', width: '200'},
					{ type: 'text', label: '通知书名称', prop: 'code', render_simple: 'name', width: '200'},
					{ type: 'text', label: '发文日', prop: 'mail_date', width: '200'},
					{ type: 'text', label: '法定期限', prop: 'deadline', width: '200'},
					{ type: 'text', label: '发文序列号', prop: 'notice_serial', width: '200'},
					{ type: 'text', label: '申请日', prop: 'apd', width: '200'},
					{ type: 'text', label: '上传日', prop: 'create_time', width: '200' },
					{ type: 'text', label: '上传用户', prop: 'uploader', render_simple: 'name', width: '200' },
					{ type: 'text', label: '审查员', prop: 'examiner', width: '200' },
					{ type: 'text', label: '审查部门', prop: 'examiner_dept', width: '200' },
					{ 
						type: 'action', 
						label: '操作',
						width: '150',
						btns: [
							{ 
								type: 'view', 
								btn_type: 'text', 
								btn_if({viewUrl}) {
									return viewUrl ? true : false; 
								},
								click: ({viewUrl})=>{window.open(viewUrl)},
							},
							{ type: 'download', btn_type: 'text', click: ({downloadUrl})=>{window.open(downloadUrl)} },
						],
					}
				],
			},
			tableData: '',
			filter: {},
	  }
	},
	computed: {
		type () {
			let type = this.$route.meta.type;

			return type ? type : '';
		},
		config () {
			return map.get(this.type);
		}
	},
	methods: {
		refresh () {
			this.$refs.table.refresh();
		},
		refreshTableData (option) {
			const url = this.config.URL;
			const data = option;
			const success = _=>{
				if(option.format == 'excel') {

					window.location.href = _.list.downloadUrl;
				}
				else {
					this.tableData = _.list;	
				}
				
			};

			this.$axiosGet({url, data, success});
		}
	},
	created () {
		if(this.config.import_type) {
			this.tableOption.import_type = this.config.import_type;
		}else {
			this.tableOption.header_btn.splice(2,1);
		}
		this.tableOption.upload_type = this.config.upload_type;		
		this.tableOption.url = this.config.URL;
	},
	mounted () {
		this.refresh();
	},
	components: { 
		TableComponent, 
		Strainer 
	},
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>