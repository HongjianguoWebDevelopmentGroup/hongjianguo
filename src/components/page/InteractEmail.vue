<template>
	<div class="main">
	<div class="left">
		<el-tree
			:data="treeData"
			:render-content="renderContent"
			node-key="label"
			highlight-current
		  @current-change="handleCurrentChange"
		  :default-expanded-keys="['全部邮件']"
		  :expand-on-click-node="false"
			:style="`font-size: 12px; height:${innerHeight - 98}px; overflow-y: auto; overflow-x: hidden;`"
		>
		</el-tree>
	</div>
	<div class="right">
		<table-component :tableOption="option" :data="tableData" @refreshTableData="refreshTableData" ref="table">
			<el-select slot="imported" v-model="imported" style="width: 100px;">
				<el-option 
					v-for="item in options"
					:label="item.label"
					:value="item.value"
					:key="item.value"
				></el-option>
			</el-select>
			<template slot="row_action" slot-scope="scope">
        <el-button type="text" icon="el-icon-upload2" size="mini" @click="importEmail(scope.row)" :disabled="scope.row.import ? true : false" >导入</el-button>
      </template>
		</table-component>
	</div>
</div>
</template>

<script>
import TableComponent from '@/components/common/TableComponent'
import {mapGetters} from 'vuex'

export default {
	name: 'interactEmail',
	data () {
		return {
			option: {
				'name': 'InteractEmaileList',
				'height': 'default2',
				'header_btn': [
					{type: 'delete'},
				],
				'header_slot': ['imported'],
				'columns': [
				  {type: 'selection'},
					{type: 'text', label: '发送时间', prop: 'mail_date' ,width: '200'},
					{type: 'text', label: '发件人', prop: 'from', width: '200'},
					{type: 'text', label: '标题', prop: 'subject', min_width: '200'},
					{type: 'text', label: '是否处理', prop: 'imported', width: '100'},
					{
						type: 'action',
						width: '100',
						btns_render: true,
					}
				],
				'highlightCurrentRow': true, 
        'rowClick': this.handleRowClick,

			},
			tableData: [],
			treeData: [],
			currentNode: '',
			imported: '',
			options: [
				{label: '全部', value: ''},
				{label: '已导入', value: 1},
				{label: '未导入', value: 0}
			],
			date: '',
			time: '',
		}
	},
	computed: {
		...mapGetters([
	    'innerHeight',
	  ]),
	},
	methods: {
		renderContent(h, { node, data, store }) {
      return (
        <span>
          <span>
            <span>{node.label} <span style="color: #20a0ff; font-style: normal;">({data.count})</span></span>
          </span>
        </span>       
      );
  	},
  	refreshTableData (options) {
  		const url = '/api/mails';
  		const data = 	Object.assign({}, options, this.time, {'mailbox': 1});
  		const success = _=>{ this.tableData = _.mails };

  		this.$axiosGet({url, data, success});
  	},
  	handleCurrentChange (d) {
  		if(d.type == 'all') {
  			this.time = '';
  			this.refresh();
  		}

  		if(d.type == 'mail_date') {
  			this.time = {[d.type]: d.label};
  			this.refresh();
  		}
  	},
  	handleRowClick (row) { 
    	this.currentRow = row;
    	if( !this.dialogShrinkVisible ) this.dialogShrinkVisible = true;
  	},
  	refresh () {
  		this.$refs.table.refresh();
  	},
  	refreshTreeData () {
  		const url = '/api/mailtree';

			const success = _=>{
				this.treeData = _.tree;
			};
			const complete = _=>{
				this.treeLoading = false;
			}
			this.treeLoading = true;
			this.$axiosGet({url, success, complete});
  	},
  	handleEmail ({id}) {
  		this.$message({message: '该功能暂未上线', type: 'warning'});
  		// const url = `tasks/${id}/remind`;
  		// const success = _=>{this.$message({message: '发送邮件提醒成功', type: 'success'})};

  		// this.axiosPost({url, success});
  	}
	},
	created () {
		this.refreshTreeData();
	},
	components: {
		TableComponent,
	}

}
</script>
<style>
/*	#expiring .el-tree-node__expand-icon {
    cursor: pointer;
    width: 0;
    height: 0;
    margin-left: 0px; 
    border: 6px solid transparent;
    border-right-width: 0;
    border-left-color: #97a8be;
    border-left-width: 7px;
    -ms-transform: rotate(0);
    transform: rotate(0);
    transition: transform .3s ease-in-out;
}*/
</style>