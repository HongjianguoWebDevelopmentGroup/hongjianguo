<template>
  <div class="main">
		<table-component :tableOption="option" :data="tableData" @refreshTableData="refreshTableData" ref="table">
      <template slot-scoped="scoped" slot="agent_status">
        <el-select v-model="agentStatus" placeholder="请选择" style="width: 130px;margin-left: 6px;">
          <el-option
            v-for="item in selectOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </template>
      <a href="/static/templates/agent.xlsx" target="_blank" slot="agent_model" style="margin-left: 6px;font-size: 14px;">代理人导入模板</a>
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
  name: 'settingAgent',
  mixins: [ AxiosMixins ],
  data () {
		return {
      agentStatus: 1,
		  option: {
			'name': 'agent',
			'height': 'default2',
			'import_type': 'agentImport',
      		'url': URL,
		  	'header_btn': [
		  		{'type': 'add', click: this.add},
		  		{'type': 'control'},
		  		{'type': 'import'},
          {'type': 'export'},
				],
        'header_slot': ['agent_status','agent_model'],
				'import_columns':[
					// { type: 'text', label: '手机号', prop: 'mobile'},
					// { type: 'text', label: '邮箱', prop: 'email'},
				],
				'columns': [
					{ type: 'selection' },
					{ type: 'text', label: '姓名', prop: 'name', width: '80',is_import: true},
					{ type: 'text', label: '代理机构名称', prop: 'agency_name', width: '160',is_import: true,},
					{ type: 'text', label: '手机', prop: 'mobile', width: '135',is_import: true},
					{ type: 'text', label: '邮箱', prop: 'email', width: '135',is_import: true},
					{ type: 'text', label: '教育背景', prop: 'education_degree', width: '100',is_import: true,},
					{ type: 'text', label: '所学专业', prop: 'major', width: '100',is_import: true,},
					{ type: 'text', label: '简介', prop: 'introduction', width: '200',is_import: true,},
					{ type: 'text', label: '工作年限', prop: 'working_experience',width: '100',is_import: true,},
					{ type: 'text', label: '新申请平均评分', prop:'new_application_rank',width: '198'},
					{ type: 'text', label: 'OA平均评分', prop:'oa_rank', width: '198'},
					{ type: 'text', label: '好评数量', prop:'positive_amount', width: '150' },
					{ type: 'text', label: '差评数量', prop:'negative_amount' ,width:'150'},
					{ type: 'text', label: '代理人等级', prop:'level' ,width:'150'},
					{ type: 'text', label: '案件配额（年）', prop:'distributed_year_amount' ,width:'150'},
					{ type: 'text', label: '案件配额（月）', prop:'distributed_month_amount' ,width:'150'},
					{ type: 'text', label: '新申请平均返稿天数', prop:'new_application_daytime', width: '198' },
					{ type: 'text', label: 'OA平均返稿天数', prop:'oa_daytime' ,width: '198'},
					{ type: 'text', label: '备注', prop:'remark' ,width: '80',is_import:true},
					{ type: 'text', label: '状态', prop: 'status', width: '80',render:(h,item)=>{
						item == 1? item = '正常' : item = '禁用';
						return h('span',item)
					}},
					{
						type: 'action',
						width: '160',
						btns: [
							{ type: 'edit', click: this.edit },
							{ type: 'detail', click: this.detail },
							// { type: 'delete', click: this.deleteSingle },
						]
					}
				]
		  },
		  tableData: [],
      selectOptions:[
        {id: 1, name: '正常'},
        {id: 0, name: '禁用'},
      ],
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
        const status = this.agentStatus !== ''? {status: this.agentStatus} : {};
  		const data = Object.assign({}, option, status);
  		const success = _=>{ this.tableData = _.data };

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
  	agentStatus () {
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