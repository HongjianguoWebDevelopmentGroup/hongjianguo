<template>
  <div class="main">
		<table-component :tableOption="option" :data="tableData" @refreshTableData="refreshTableData" ref="table">
		</table-component>
  	<pop ref="pop" @refresh="update"></pop>
  </div>
</template>

<script>
import TableComponent from '@/components/common/TableComponent' 
import Pop from '@/components/page_extension/settingAgent_pop'
import AxiosMixins from '@/mixins/axios-mixins'

const URL = '/api/agents';
export default {
  name: 'settingAgency',
  mixins: [ AxiosMixins ],
  data () {
		return {
		  option: {
			'name': 'agent',
			'height': 'default2',
			'import_type': 'agentImport',
		  	'header_btn': [
		  		{'type': 'add', click: this.add},
		  		{'type': 'control'},
		  		{'type': 'import'},
				],
				'import_columns':[
					{ type: 'text', label: '手机号', prop: 'mobile'},
					{ type: 'text', label: '邮箱', prop: 'email'},
				],
				'columns': [
					{ type: 'selection' },
					{ type: 'text', label: '姓名', prop: 'name', width: '150',is_import: true},
					{ type: 'text', label: '擅长技术领域', prop: 'major', width: '168',is_import: true,},
					{ type: 'text', label: '工作年限', prop: 'working_experience',width: '145'},
					{ type: 'text', label: '状态', prop: 'status_name', width: '80' },
					{ type: 'text', label: '简介', prop: 'introduction',width: '145',is_import: true,},
					{ type: 'text', label: '新申请平均评分', prop:'new_application_rank',width: '198'},
					{ type: 'text', label: 'OA平均评分', prop:'oa_rank', width: '198'},
					{ type: 'text', label: '正面评价数量', prop:'positive_amount', width: '150' },
					{ type: 'text', label: '负面评价数量', prop:'negative_amount' ,width:'150'},
					{ type: 'text', label: '新申请平均返稿天数', prop:'new_application_daytime', width: '198' },
					{ type: 'text', label: 'OA平均返稿天数', prop:'oa_daytime' ,width: '198'},
					{
						type: 'action',
						width: '200',
						btns: [
							{ type: 'edit', click: this.edit },
							{ type: 'detail', click: this.detail },
							{ type: 'delete', click: this.deleteSingle },
						]
					}
				]
		  },
		  tableData: [],
		}
  },
  methods: {
  	add () {
  		this.$router.push({ name: 'UserList', params: { groupId: 6 }});
  	},
  	edit (row) {
  		this.$refs.pop.show('edit', row);
  	},
  	detail ({id}) {
	  	this.$router.push({path: '/setting/agent/detail', query: {id} })
  	},
  	deleteSingle ({id, name}) {
  		this.$confirm(`删除后不可恢复，确认删除‘${name}’？`, '提示' ,{type: 'warning'})
  			.then(_=>{  
  				const url = `${URL}/${id}`;
  				const success = _=>{ this.update() };

  				this.axiosDelete({url, success}); 
  			})
  			.catch(_=>{console.log(_)})
  		const url = `${URL}/${id}`;
  	},
  	refreshTableData (option) {
  		const url = URL;
  		const data = Object.assign({}, option);
  		const success = _=>{ this.tableData = _.members };

  		this.axiosGet({url, data, success});
  	},
  	refresh () {
  		this.$refs.table.refresh();	
  	},
  	update () {
  		this.$refs.table.update();
  	}
  },
  watch: {
  	is_core_partner () {
  		this.refresh();
  	}
  },
  mounted () {
  	this.refresh();
  },
  components: { TableComponent, Pop },

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>