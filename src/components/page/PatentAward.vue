<template>
  <div class="main">
		<table-component :tableOption="tableOption" :data="tableData" @refreshTableData="refreshTableData" ref="table"></table-component>
  </div>
</template>

<script>
import TableComponent from '@/components/common/TableComponent'
import Strainer from '@/components/page_extension/NoticeCommon_strainer'
import AxiosMixins from '@/mixins/axios-mixins'

const URL =  '/api/patents/awards';

export default {
  name: 'patentAward',
  mixins: [AxiosMixins],
  data () {
	return {
			tableOption: {
				'header_btn': [
					{ type: 'export' },
				],
				'height': 'default2',
				'url': '/api/patents/awards',
				'import_type': '',
				'upload_type': '',
				'is_list_filter': false,
				'list_type': 'patent_award',			
				'columns': [
					{ type: 'text', label: '视源案号', prop: 'serial', width: '200' },
					{ type: 'text', label: '案件名称', prop: 'title', width: '200'},
					{ type: 'text', label: '申请日', prop: 'apd', width: '200'},
					{ type: 'text', label: '专利号', prop: 'apn', width: '200'},
					{ type: 'text', label: '法律状态', prop: 'legal_status', render_simple: 'name', width: '200'},
					{ type: 'array', label: '项目/奖项名称', prop: 'awards',  render: _=>{ return _.map(_=>_.name);}, width: '200'},
				],
			},
			tableData: [],
			filter: {},
	  }
	},
	computed: {
		
	},
	methods: {
		refresh () {
			this.$refs.table.refresh();
		},
		refreshTableData (option) {
			const url = URL;
			const data = option;
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
		this.tableOption.url = this.URL;
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