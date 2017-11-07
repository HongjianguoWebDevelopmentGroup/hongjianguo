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

const text1 = '测试';
const text2 = '测试';
const text3 = '测试';

export default {
  name: 'trademarkList', 
  data () {
		return {
			dialogScreenVisible: false,
			tableOption: {
				'name': 'trademark',
				'url': '/api/trademarks',
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
					'prop': 'text1',
				},
				{
					'show': true,
					'type': 'text',
					'label': '商标名称',
					'prop': 'title',
				},
			  {
					'show': true,
					'type': 'text',
					'label': '地区',
					'prop': 'text2',
					'is_import': true,
			  },
			  {
					'show': true,
					'type': 'text',
					'label': '客户',
					'prop': 'text3',
					'is_import': true,
			  },
			  {
					'show': false,
					'type': 'text',
					'label': '商标名称',
					'prop': 'text3',
					'is_import': true,
			  },
			  {
					'show': false,
					'type': 'text',
					'label': '委案日',
					'prop': 'text3'
			  },
			  {
					'show': false,
					'type': 'text',
					'label': '申请日',
					'prop': 'text3'
			  },
			  {
					'show': true,
					'type': 'text',
					'label': '申请号',
					'prop': 'text3'
			  },
			  {
					'show': false,
					'type': 'text',
					'label': '注册号',
					'prop': 'text3'
			  },
			  {
					'show': false,
					'type': 'text',
					'label': '初审公告日',
					'prop': 'text3'
			  },
			  {
					'show': false,
					'type': 'text',
					'label': '核准注册日',
					'prop': 'text3'
			  },
			  {
					'show': true,
					'type': 'text',
					'label': '商品分类'
			  },
			  { 'show': false, 'type': 'text', 'label': '商品描述' },
			  { 'show': false, 'type': 'text', 'label': '详细分类' },
			  { 'show': true, 'type': 'text', 'label': '代理人' },
			  { 'show': true, 'type': 'text', 'label': 'IPR' },
			  { 
			  	'show': true, 'type': 'text', 'label': '当前状态' 
			  }] 
			},
			tableData: [
				{title: '商标1', text1, text2, text3, id: 1},
				{title: '商标2', text1, text2, text3, id: 2},
				{title: '商标3', text1, text2, text3, id: 3},
				{title: '商标4', text1, text2, text3, id: 4},
				{title: '商标5', text1, text2, text3, id: 5},
				{title: '商标6', text1, text2, text3, id: 6},
				{title: '商标7', text1, text2, text3, id: 7}
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