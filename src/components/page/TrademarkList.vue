<template>
  <div class="main">
		<table-component :tableOption="tableOption" :data="tableData" ref="table" :refreshTableData="refreshTableData"></table-component>
		<common-detail
      :title="currentRow.title"
      :visible.sync="shrinkVisible" 
      type="trademark" 
      :id="currentRow.id"
      @editSuccess="refresh">
    </common-detail>
    <!-- <el-button @click="customFields()">按钮</el-button> -->
  </div>
</template>

<script>
import TableComponent from '@/components/common/TableComponent'
import AppDatePicker from '@/components/common/AppDatePicker'
import CommonDetail from '@/components/page_extension/Common_detail'

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
				'is_list_filter': true,
				'list_type': 'trademark',
				'header_btn': [
					{
						'type': 'add',
						click: _=>{
							this.$router.push('/trademark/add');
						}
					},
					{ type: 'delete' },
					// { type: 'import'},
					{ type: 'export',},
					// { type: 'batch_upload' },
					{ type: 'control', label: '字段'},
				],
				'import_type': 'trademark',
				'upload_type': 'trademark',
				'highlightCurrentRow': true, 
	      		'rowClick': this.handleRowClick,
				'height': 'default',
				'columns': [{
					'show': true,
					'type': 'selection'
				},
				{ type: 'text', label: '案号', prop: 'serial', width: '198'},
				{ type: 'text', label: '事务所案号', prop: 'agency_serial', width: '198',},
				{ type: 'text', label: '商标名称', prop: 'title', width: '168', is_import: true,},
				{ type: 'text', label: '商标类型', prop: 'type', render_simple:'name', width: '145', is_import: true,},
				{ type: 'text', label: '商标图形', prop: 'figure', align: 'center', header_align: 'left', width: '200',
				  render:(h,item)=>{
					return h('img',{
					  attrs:{
					    src:item.viewUrl,
					    width: '150px',		
					  },
					  style:{
						marginTop:'5px',
					  }
					})
				  },
				},
			  	{ type: 'text', label: '地区', prop: 'area', is_import: true, render_simple: 'name', width: '145',},
			    { type: 'text', label: '详细类别', prop: 'detail', width: '260', is_import: true,},
			    { type: 'array', label: '商标类别', prop: 'categories', render:_=>_.map(_=>_.name), is_import: true, width: '260',},
			    { type: 'array', label: '申请人', prop: 'applicants', is_import: true, width: '260', render:_=>_.map(_=>_.name),},
			    { type: 'text', label: '申请号', prop: 'apn', width: '240', is_import: true,},
			    { type: 'text', label: '申请日', prop: 'apd', width: '168', is_import: true,},
			    { type: 'text', label: '初审公告日', prop: 'public_date', width: '168', is_import: true,},
			    { type: 'text', label: '初审公告期数', prop: 'public_number', width: '168', is_import: true,},
			    { type: 'text', label: '核准注册日', prop: 'issue_date', width: '168', is_import: true,},
			    { type: 'text', label: '核准公告期数', prop : 'issue_number', width: '168', is_import: true,},  
			    { type: 'text', label: '专用权期限', prop: 'expiring_date', width : '145', is_import: true,},
			    { type: 'text', label: '备注', prop: 'remark', width: '280', is_import: true,},
			]},
			tableData: '',
			currentRow: '',
			shrinkVisible: false,
		};
  },
  computed: {
  	inParams () {
      const p = this.$route.meta.params; 
      return p ? p : {};
    },
    custom () {
    	const custom = this.$route.meta.custom;
    	return custom !== undefined ? custom : false;
    }
  },
  methods: {
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
  			data: Object.assign({}, option, this.inParams),
  			success,
  		})
  	},
  	customFields(name) {
	  	let newObj = new Object ();
	  	const newArr = [];
	  	Object.assign(newArr,this.tableOption.columns);
	  	newObj.width = '200';
	  	newObj.show = true;
	  	newObj.label = '自定义';
	  	newObj.prop = 'zidingyi';
	  	newObj.type = 'text';
	  	// console.log(newObj);
	  	// console.log(this.tableOption.columns instanceof  Array);
	  	newArr.push(newObj);
	  	console.log(newArr);
	  	this.tableOption.columns = newArr;
	  	return this.tableOption.columns;
  	},
  	refresh () {
  		this.$refs.table.refresh();
  	},
  	handleRowClick (row) {
  		this.currentRow = row;
  		if(!this.shrinkVisible) {
  			this.shrinkVisible = true;	
  		}
  	}
  },
  mounted () {
  	if(!this.custom) {
  		this.refresh();
  	}
  },
  components: { 
  	TableComponent, 
  	AppDatePicker,
  	CommonDetail,
  },
  watch: {

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

</style>