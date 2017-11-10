<template>
  <div class="main">
  	<strainer v-model="filter" @refresh="refresh"></strainer>
		<table-component :tableOption="tableOption" :data="tableData" ref="table" ></table-component>
		<common-detail
      :title="currentRow.title"
      :visible.sync="shrinkVisible" 
      type="trademark" 
      :id="currentRow.id"
      @editSuccess="refresh">
    </common-detail>
  </div>
</template>

<script>
import TableComponent from '@/components/common/TableComponent'
import AppDatePicker from '@/components/common/AppDatePicker'
import CommonDetail from '@/components/page_extension/Common_detail'
import Strainer from '@/components/page_extension/TrademarkList_strainer'


export default {
  name: 'trademarkList', 
  data () {
		return {
			dialogScreenVisible: false,
			tableOption: {
				'name': 'trademark',
				'url': '/api/trademarks',
				'is_filter' : true,
				'header_btn': [{
					'type': 'add',
					click: _=>{
						this.$router.push('/trademark/add');
					}
				},
				{
					'type': 'delete',
				},
				{
					'type': 'import',
				},
				{
					'type': 'export',
				},
				{
					'type': 'batch_upload',
				},
				{
					'type': 'control',
					'label': '字段'
				}],
				'import_type': 'trademark',
				'upload_type': 'trademark',
				'highlightCurrentRow': true, 
	      		'rowClick': this.handleRowClick,
				'height': 'default',
				'columns': [{
					'show': true,
					'type': 'selection'
				},
				{
					'show': true,//默认为true
					'type': 'text',
					'label': '案号',
					'prop': 'serial',
					'width': '198',
				},
				{
					'show': true,
					'type': 'text',
					'label': '商标名称',
					'prop': 'title',
					'width': '168',
				},
				{
					'show': true,
					'type': 'text',
					'label': '商标类型',
					'prop': 'type',
					'render_simple':'name',
					'width': '145',
				},
			  	{
					'show': true,
					'type': 'text',
					'label': '地区',
					'prop': 'area',
					'is_import': true,
					'render_simple': 'name',
					'width': '145',
			  },
			  {
					'show': true,
					'type': 'text',
					'label': '详细类别',
					'prop': 'detail',
					'is_import': true,
					'width': '260',
			  },
			  {
					'show': true,
					'type': 'array',
					'label': '申请人',
					'prop': 'applicants',
					'is_import': true,
					'width': '260',
					render:_=>_.map(_=>_.name),
			  },
			  {
					'show': true,
					'type': 'text',
					'label': '申请号',
					'prop': 'apn',
					'width': '240',
			  },
			  {
					'show': true,
					'type': 'text',
					'label': '申请日',
					'prop': 'apd',
					'width': '168',
			  },
			  {
					'show': true,
					'type': 'text',
					'label': '初审公告日',
					'prop': 'public_date',
					'width': '168',
			  },
			  {
					'show': true,
					'type': 'text',
					'label': '初审公告期数',
					'prop': 'public_number',
					'width': '168'
			  },
			  {
					'show': true,
					'type': 'text',
					'label': '核准注册日',
					'prop': 'issue_date',
					'width': '168',
			  },
			  {
					'show': true,
					'type': 'text',
					'label': '核准公告期数',
					'prop' : 'issue_number',
					'width': '168',
			  },  
			  {
					'show': true,
					'type': 'text',
					'label': '专用权期限',
					'prop': 'expiring_date',
					 'width' : '145',
			  },
			  {
					'show': true,
					'type': 'text',
					'label': '备注',
					'prop': 'remark',
					'width': '280',
			  },] 
			},
			tableData: [
				{
				"id":83,
				"serial":"CVTE20171110002",
				"area":{"id":"CN","name":"CN"},
				"create_time":"2017-11-10",
				"title":"新建商标测试",
				"type":{"id":1,"name":"文字"},
				"apn":"申请号","apd":"2017-11-09",
				"public_number":"1470",
				"public_date":"2017-08-27",
				"issue_number":"1470",
				"issue_date":"2017-08-27",
				"agency_serial":"",
				"remark":"商标备注",
				"progress":{"id":0,"name":null},
				"categories":{"id":1,"name":"[1]化学品"},
				"detail":"123456",
				"figure": {
					id: 40, 
					name: "b.txt", 
					ext: "txt", 
					size: "0KB", 
					create_time: "2017-11-10 09:51:56", 
					is_view: 1,
					viewUrl: "/files/40/preview/b.txt",
					downloadUrl: "/files/40",
				},
				"expiring_date":"2025-12-07",
				"attachments":[{"id":40,"name":"b.txt","ext":"txt","size":"0KB","viewUrl":"\/files\/40\/preview\/b.txt","downloadUrl":"\/files\/40"}],
				"applicants":[{id: 7, name: '广州视源电子科技股份有限公司'}],
			}
			],
			currentRow: '',
			shrinkVisible: false,
			filter: '',
		};
  },
  methods: {
  	refresh () {
  		console.log(this.filter);
  		this.$refs.table.refresh();
  	},
  	handleRowClick (row) {
  		this.currentRow = row;
  		if(!this.shrinkVisible) {
  			this.shrinkVisible = true;	
  		}
  	}
  },
  components: { 
  	TableComponent, 
  	AppDatePicker,
  	CommonDetail,
  	Strainer,
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

</style>