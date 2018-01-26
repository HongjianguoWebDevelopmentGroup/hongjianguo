<template>
	<div class="main">
		<table-component :tableOption="option" :data="tableData" @refreshTableData="refreshTableData" ref="table">
			<el-select v-model="status" style="width: 150px; margin-left: 5px;" slot="status">
				<el-option label="全部" value=""></el-option>
				<el-option v-for="item in statusArr" :key="item[0]" :value="item[0]" :label="item[1]"></el-option>
			</el-select>
		</table-component>
		<pop ref="pop" @refresh="refresh"></pop>
		<el-dialog title="新建年费评估单" :visible.sync="dialogVisble" @close="remark = '';due_time='';" class="dialog-small">
			<el-date-picker type="date" v-model="due_time" placeholder="请选择评估期限"></el-date-picker>
			<el-input type="textarea" v-model="remark" placeholder="请填写年费评估单备注" style="margin-top: 10px;"></el-input>
			<el-button :loading="loading" type="primary" @click="addEstimate" style="margin-top: 10px;">{{ loading ? '新建中...' : '确认新建' }}</el-button>
		</el-dialog>
		<el-dialog title="添加到已有评估单" :visible.sync="dialogVisble2" @close="estimate = '';" class="dialog-small">
			<remote-select type="estimate" :para="{status: 0}" v-model="estimate"></remote-select>
			<el-button :loading="loading" type="primary" @click="putEstimate" style="margin-top: 10px;">{{ loading ? '添加中...' : '确认添加' }}</el-button>
		</el-dialog>
		<el-dialog title="设置年费监控偏好" :visible.sync="dialogVisble3">
			<div class="form-description">默认显示几个月内即将过期的年费</div>
			<el-input-number v-model="month" :min="1"></el-input-number>
			<el-button type="primary" @click="saveMonth" :loading="loading">{{loading ? '保存中...' : '保存'}}</el-button>
		</el-dialog>
	</div>
</template>
<script>
import TableComponent from '@/components/common/TableComponent'
import Pop from '@/components/page_extension/RenewalFee_pop'
import RemoteSelect from '@/components/form/RemoteSelect'
import {mapActions} from 'vuex'
const URL = '/api/renewalfee'
const URL2 = '/api/renewalestimate'
export default {
	name: 'renewalFee',
	data () {
		const statusArr = [ [0, '年费监控中'], [1, '年费评估中'], [2, '年费评估缴纳'], [3, '年费评估放弃'] ];
		const statusMap = new Map(statusArr);
		let month = this.$tool.getLocal('renewalFeeMonth');
		this.month = month ? month : 3;
		
		return {
			month,
			status: '',
			statusArr,
			statusMap,
			dialogVisble: false,
			dialogVisble2: false,
			dialogVisble3: false,
			due_time: '',
			remark: '',
			estimate: '',
			loading: false,
			option: {
				name: 'renewalFeeList',
				url: URL,
				height: 'default2',
				search_placeholder: '案号、案件名称、创建人',
				header_btn: [
					{ type: 'add', click: this.addPop },
					{ 
            type: 'dropdown',
            label:  '年费评估单',
            items: [
              {text: '新建评估单', click: ()=>{ this.estimatePop('add') }, icon: 'plus' },
              {text: '添加至已有评估单', click: ()=>{ this.estimatePop('append') }, icon: 'd-arrow-right'  },
            ],
          },
					{ type: 'delete' },
					{ type: 'control' },
					{ 
						type: 'custom', 
						icon: 'setting', 
						label: '设定', 
						click: _=>{
							let month = this.$tool.getLocal('renewalFeeMonth');
							this.month = month ? month : 3;
							this.dialogVisble3 = true;
						} 
					},
				],
				header_slot: [ 'status' ],
				columns: [
					{ type: 'selection' },
					{ type: 'text', label: '案号', prop: 'serial', render_key: 'project', render_simple: 'serial', width: '200'},
					{ type: 'text', label: '案件名称', prop: 'title',  render_key: 'project', render_simple: 'title', width: '200'},
					{ type: 'text', label: '年费类型', prop: 'code', render_simple: 'name', width: '200'},
					{ 
						type: 'text', 
						label: '外币金额', 
						prop: 'amount', 
						width: '100',
						align: 'right',
						render:(h,item,row)=>{
	            if( row.roe == 1 ){
		            return h('span','N/A');
		          }else{
		            return h('span',`${item}${row.currency}`);
		          }
	          } 
	        },
          { 
          	type: 'text', 
          	label: '汇率', 
          	prop: 'roe', 
          	width: '80',
          	align: 'right',
          	render:(h,item)=>{
		          if( item == 1 ){
		            return h('span','N/A');
		          }else{
		            return h('span',item);
		          } 
		        }
		      },
          { 
          	type: 'text', 
          	label: '人民币金额', 
          	prop: 'rmb', 
          	width: '120',
          	align: 'right',
          	render:(h,item)=>{
	            return h('span',`${item}CNY`)
	          }
	        },
					{ type: 'text', label: '费用期限', prop: 'due_time', width: '200'},
					{ type: 'text', label: '官方绝限', prop: 'deadline', width: '200'},
					{ 
						type: 'text', 
						label: '年费状态', 
						prop: 'status', 
						render_text: _=>this.statusMap.get(_),
						width: '200'
					},
					{ type: 'text', label: '年费对象', prop: 'target', render_simple: 'name', width: '200'},
					{ type: 'text', label: '评估单编号', prop: 'renewal_estimate', render_simple: 'number', width: '200'},
					{ type: 'text', label: '创建人', prop: 'member', render_simple: 'name', width: '200' },
					{ type: 'text', label: '创建时间', prop: 'create_time', width: '200'},
					{ type: 'text', label: '备注', prop: 'remark', width: '200'},
				]
			},
			tableData: '',
		};
	},
	methods: {
	    ...mapActions([
	      'refreshUser',
	    ]),		
		addPop () {
			this.$refs.pop.show();
		},
		refresh () {
			this.$refs.table.refresh();
		},
		refreshTableData (option) {
			this.$axiosGet({
				url: URL,
				data: Object.assign({}, option, {status: this.status}, {month: this.month}),
				success: _=>{this.tableData = _.data},
			})
		},
		estimatePop (type) {
			const list = this.$refs.table.getSelected();
			if(!list) return;
			for(let i = 0; i < list.length; i++) {
				if(list[i]['status'] != 0) {
					return this.$message({type: 'warning', message: '请选择处于年费监控状态的列表项'});
				}
			}

			if(type == 'add') this.dialogVisble = true;
			if(type == 'append') this.dialogVisble2 = true;

		},
		addEstimate () {
			const ids = this.$tool.splitObj(this.$refs.table.getSelected(true), 'id');
			const remark = this.remark;
			const due_time = this.$tool.getDate(this.due_time);
			const data = { ids, remark, due_time };
			
			this.loading = true; 
			this.$axiosPost({
				url: URL2,
				data,
				success: _=>{
					this.$message({type: 'success', message: '新建年费评估单成功'});
					this.dialogVisble = false;
					this.refresh();
					this.refreshUser();
				},
				complete: _=>{
					this.loading = false;
				}
			})
		},
		putEstimate () {
			if(!this.estimate) return this.$message({type: 'warning', message: '请选择年费评估单'});
			const ids = this.$tool.splitObj(this.$refs.table.getSelected(true), 'id');
			const data = { ids }; 
			this.$axiosPut({		
				url: `${URL2}/${this.estimate}`,
				data,
				success: _=>{
					this.$message({type: 'success', message: '添加成功'});
					this.dialogVisble2 = false;
					this.refresh();
				},
				complete: _=>{
					this.loading = false;
				}
			})
		},
		saveMonth () {
			this.$tool.setLocal('renewalFeeMonth', this.month);
			this.dialogVisble3 = false;
			this.refresh();
		}
	},
	mounted () {
		this.refresh();
	},
	watch: {
		status () {
			this.refresh();
		}
	},
	components: { 
    TableComponent, 
		Pop,
		RemoteSelect,
	}
} 
</script>