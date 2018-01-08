<template>
	<div class="main" v-loading="analysisLoading" element-loading-text="邮件识别中...">
	<div class="left"  v-loading="treeLoading">
		<el-tree
			:data="treeData"
			:render-content="renderContent"
			node-key="label"
			highlight-current
		  @current-change="handleCurrentChange"
		  :default-expanded-keys="['全部邮件']"
		  :expand-on-click-node="false"
			:style="`font-size: 12px; height:${innerHeight - 65}px; overflow-y: auto; overflow-x: hidden;`"
			:current-node-key="currentNodeKey"
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
        <el-button type="text" icon="upload2" size="mini" @click="importEmail(scope.row)" :disabled="scope.row.import ? true : false">导入</el-button>
      </template>
		</table-component>
	</div>
	
	<Detail ref="mail_detail"></Detail>
	
	<app-import type="invoicePayable" :visible.sync="dialogFee" ref="fee" @import-success="importSuccess"></app-import>
	
	<app-import type="patent_notice" :visible.sync="dialogNotice" ref="notice" @import-success="importSuccess"></app-import>
	
	<el-dialog title="邮件导入" :visible.sync="dialogCustom" class="dialog-small">
		<import @success="importSuccess" ref="custom"></import>
	</el-dialog>

	<el-dialog title="邮件导入" :visible.sync="dialogSimple" class="dialog-small" @close="projectId = []">
		<div style="margin-bottom: 10px; color: rgb(132, 146, 166); font-size: 14px;">
			<span>当前邮件下没有附件,可将其挂载到某一案件下</span>
		</div>
		<remote-select type="project" v-model="projectId" style="margin-bottom: 10px;"></remote-select>
		<el-button type="primary" @click="associateMail" :loading="loading" multiple>{{ loading ? '关联中...' : '确认关联' }}</el-button>
	</el-dialog>
</div>
</template>

<script>
import TableComponent from '@/components/common/TableComponent'
import Detail from '@/components/page_extension/Email_detail'
import Import from '@/components/page_extension/Email_import'
import AppImport from '@/components/common/AppImport'
import RemoteSelect from '@/components/form/RemoteSelect'

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
					{
						type: 'text', 
						label: '发件人', 
						prop: 'from', 
						width: '200',
						render_simple: 'value',
					},
					{type: 'text', label: '标题', prop: 'subject', min_width: '200'},
					{
						type: 'text', 
						label: '是否处理', 
						prop: 'imported', 
						width: '100',
						render_text: _=>_ ? '是' : '否',
					},
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
			time: null,
			importId: '',
			treeLoading: false,
			loading: false,
			currentNodeKey: '',
			dialogNotice: false,
			dialogFee: false,
			dialogCustom: false,
			dialogSimple: false,
			currentId: '',
			projectId: [],
			analysisLoading: false,
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
  	importEmail({id}) {
  		const url = `/api/mailanalysis/${id}`;
  		const success = _=>{
  			this.currentId = id;//记录当前ID；
  			
  			if(_.data.length == 0) {
  				this.dialogSimple = true;
  				if(_.project) {
	  				this.$nextTick(v=>{
	  					this.projectId = _.project;
	  				})
  				}
  				
  				return;
  			}

  			if(_.type == 'custom') {
  				this.dialogCustom = true;
  				this.$nextTick(v=>{
  					const d = {attachments: _.data};
  					if(_.project) {
  						d.project_type = _.project.category;
  						d.project = _.project;
  					}
  					this.$refs.custom.setForm(d);
  				})
  			}else if(_.type == 'invoicePayable') {
  				this.dialogFee = true;
  				this.$nextTick(v=>{
  					this.$refs.fee.tableData = _.data;	
  				});
  			}else if(_.type == 'patent_notice') {
  				this.dialogNotice = true;
  				this.$nextTick(v=>{
  					this.$refs.notice.tableData = _.data;	
  				});
  			}
  		};

  		const complete = _=>{ this.analysisLoading = false };
  		
  		this.analysisLoading = true;
  		this.$axiosGet({ url, success, complete });
  	},
  	importSuccess () {
  		//隐藏弹出框
  		this.dialogSimple = this.dialogCustom = this.dialogNotice = this.dialogFee = false;
  		//将导入成功邮件标记为已导入
  		this.$axiosGet({
  			url: `/api/mailimported/${this.currentId}`,
  			success: _=>{
  				this.update();//刷新当前页面
  			}
  		})
  	},
  	associateMail () {
  		this.loading = true;
  		if(this.projectId.length == 0) {
  			this.$message({type: 'warning', message: '请选择关联案件'});
  			return;
  		}
  		this.$axiosPut({
  			url: `api/mails/${this.currentId}/projects`,
  			data: {
  				ids: this.projectId, 
  			},
  			success: _=>{
  				this.$message({type: 'success', message: _.info});
  				this.importSuccess;
  			},
  			complete: _=>{
  				this.loading = false;
  			},
  		});
  	},
  	refreshTableData (options) {
  		if(this.time == null) return;
  		const url = '/api/mails';
  		const imported = this.imported ? {imported: this.imported} : '';
  		const data = 	Object.assign({}, options, this.time, {'mailbox': 1}, imported);
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
  	handleRowClick ({id}) {
      this.$refs.mail_detail.show(id);
    },
  	refresh () {
  		this.$refs.table.refresh();
  	},
  	update () {
  		this.$refs.table.update();
  	},
  	refreshTreeData () {
  		const url = '/api/mailtree';

			const success = _=>{
				this.treeData = _.tree;
				this.currentNodeKey = '全部邮件';
				this.time = '';
				this.refresh();
			};
			const complete = _=>{
				this.treeLoading = false;
			};
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
	watch: {
		imported () {
			this.refresh();
		}
	},
	components: {
		TableComponent,
		Detail,
		Import,
		AppImport,
		RemoteSelect,
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