<template>
  <div class="main">
  	<strainer v-model="filter" @refresh="refresh"></strainer>
		<table-component :tableOption="tableOption" :data="tableData" ref="table" @refreshTableData="refreshTableData"></table-component>
		<common-detail
      :title="currentRow.title"
      :visible.sync="shrinkVisible" 
      type="trademark" 
      :id="currentRow.id"
      @editSuccess="update">
    </common-detail>
  </div>
</template>

<script>
import TableComponent from '@/components/common/TableComponent'
import AppDatePicker from '@/components/common/AppDatePicker'
import CommonDetail from '@/components/page_extension/Common_detail'
import Strainer from '@/components/page_extension/TrademarkList_strainer'
import { mapActions } from 'vuex'

const URL = '/trademarks'
export default {
  name: 'trademarkList', 
  data () {
		return {
			dialogScreenVisible: false,
			tableOption: {
				'name': 'trademark',
				'url': URL,
				'is_filter' : true,
				'is_numbers': true,
				'header_btn': [{
					'type': 'add',
					click: _=>{
						this.$router.push('/trademark/add');
					}
				},
				{
					'type': 'delete',
				},
				// {
				// 	'type': 'import',
				// },
				{
					'type': 'export2',
				},
				// {
				// 	'type': 'batch_upload',
				// },
				// { type: 'report', click: _=>{this.$router.push('/trademark/report')} },				
				{
					'type': 'control',
					'label': '字段'
				},
				{
					'type': 'serial_search',
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
					'width': '140',
					sortable : true,
				},
				{
					'type': 'text',
					'label': '当前状态',
					'prop': 'progress',
					'render_simple': 'name',
					'width': '200',
				},
			  {
					'show': true,
					'type': 'array',
					'label': '申请人',
					'prop': 'applicants',
					'is_import': true,
					'width': '220',
					render:_=>_.map(_=>_.name),
					'is_import': true,
					sortable : true,
			    },
				{
					'show': true,
					'type': 'text',
					'label': '商标图形',
					'prop': 'figure',
					'align': 'center',
					'header_align': 'left',
					render:(h,item)=>{
						return h('img',{
							attrs:{
								src:item.viewUrl?item.viewUrl:'',
							},
							style:{
								marginTop:'5px',
								maxWidth: '150px',	
								maxHeight: '80px',	
							}
						})
					},
					'min_width': '200',
					sortable : true,
				},
				{
					'show': true,
					'type': 'text',
					'label': '商标名称',
					'prop': 'title',
					'width': '145',
					'is_import': true,
					sortable : true,
				},
			    {
					'show': true,
					'type': 'array',
					'label': '商标类别',
					'prop': 'categories',
					render:_=>_.map(_=>_.name),
					'is_import': true,
					'width': '260',
					'is_import': true,
					sortable : true,
			    },
			    {
					'show': true,
					'type': 'text',
					'label': '申请号',
					'prop': 'apn',
					'width': '178',
					'is_import': true,
					sortable : true,
			    },
			    {
					'show': true,
					'type': 'text',
					'label': '申请日',
					'prop': 'apd',
					'width': '120',
					'is_import': true,
					sortable : true,
			    },
				{ type: 'text', label: '驳回日期', prop: 'reject_date', width: '120', show: true, is_import: true, sortable: true},
				{ type: 'text', label: '立案时间', prop: 'create_time', width: '175',sortable : true, is_import: true },
			  	{
					'show': true,
					'type': 'text',
					'label': '地区',
					'prop': 'area',
					'is_import': true,
					'render_simple': 'name',
					'width': '145',
					sortable : true,
			    },
				{
					'show': true,
					'type': 'text',
					'label': '权利人地址',
					'prop': 'address',
					'width': '240',
					sortable : true,
			    },
			    {
					'show': true,
					'type': 'text',
					'label': '代理机构',
					'prop': 'agency',
					'render_simple': 'name',
					'width': '240',
					sortable : true,
			    },
				{
					'show': true,
					'type': 'text',
					'label': '商标类型',
					'prop': 'type',
					'render_simple':'name',
					'width': '145',
					'is_import': true,
					sortable : true,
				},
			    {
					'show': true,
					'type': 'text',
					'label': '详细类别',
					'prop': 'detail',
					'is_import': true,
					'width': '260',
					'is_import': true,
					sortable : true,
			    },
				{
					type: 'text',
					label: '事务所案号',
					prop: 'agency_serial',
					width: '168',
					show: true ,
					sortable : true,
				},
			    {
					'show': true,
					'type': 'text',
					'label': '初审公告日',
					'prop': 'public_date',
					'width': '145',
					'is_import': true,
					sortable : true,
			   },
			//    {
			// 		'show': true,
			// 		'type': 'text',
			// 		'label': '初审公告期数',
			// 		'prop': 'public_number',
			// 		'width': '145',
			// 		'is_import': true,
			// 		sortable : true,
			//    },
			   {
					'show': true,
					'type': 'text',
					'label': '核准注册日',
					'prop': 'issue_date',
					'width': '145',
					'is_import': true,
					sortable : true,
			   },
			   {
					'show': true,
					'type': 'text',
					'label': '核准公告期数',
					'prop' : 'issue_number',
					'width': '145',
					'is_import': true,
					sortable : true,
			   },  
			   {
					'show': true,
					'type': 'text',
					'label': '专用权期限',
					'prop': 'expiring_date',
					 'width' : '145',
					 'is_import': true,
					 sortable : true,
			   },
			   {
					'show': true,
					'type': 'text',
					'label': '备注',
					'prop': 'remark',
					'width': '265',
					'is_import': true,
					sortable : true,
			   },] 
			},
			tableData: '',
			currentRow: '',
			shrinkVisible: false,
			filter: {},
			area: '',
		};
  },
  computed: {
  	defaultParams () {
      const params = this.$route.meta.params; 
      return params ? params : {};
    }
  },
  methods: {
  	...mapActions([
  		'refreshFlows',
  		'refreshTaskDefs',
  		'refreshFlownodes',
  		'initializeSelectorCache',
  	]),
  	refreshTableData(option) {
  		
  		const success = d=>{
  			if(option['format'] == 'excel') {
          window.location.href = d.trademarks.downloadUrl;
        }else {
          this.tableData = d.trademarks;  
        }
  		}
  		this.$axiosGet({
  			url: URL,
  			data: Object.assign({}, this.filter, option, this.$route.query, this.defaultParams),
  			success,
  		})
  	},
  	refresh () {
  		this.$refs.table.refresh();
  	},  	
  	update () {
  		this.$refs.table.update();
  	},
  	handleRowClick (row) {
  		this.currentRow = row;
  		if(!this.shrinkVisible) {
  			this.shrinkVisible = true;	
  		}
  	}
  },
  created () {
  	this.refreshFlows();
    this.refreshTaskDefs();
    this.refreshFlownodes();
  	this.initializeSelectorCache({type: 'file_type_trademark_notice'});
  },
  mounted () {
  	this.refresh();
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