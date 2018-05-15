<template>
	<div class="main">
		<table-component :data="tableData" :tableOption="tableOptions" :refreshTableData="refreshTableData" ref="table"></table-component>
		<app-pop 
			ref="form" 
			:model="form" 
			:type="formType" 
			:rules="rules"
			label-width="90px" 
			title="竞争对手" 
			:save="handleSave">
			<el-form-item prop="title" label="项目名称">
				<el-input v-model="form.title"></el-input>
			</el-form-item>
			<el-form-item prop="deadline" label="项目期限">
				<el-date-picker type="date" v-model="form.deadline" style="width: 100%;"></el-date-picker>
			</el-form-item>
			<el-form-item prop="ipr" label="承办人">
				<remote-select type="member" v-model="form.ipr"></remote-select>
			</el-form-item>
			<el-form-item prop="remark" label="备注">
				<el-input type="textarea" v-model="form.remark"></el-input>
			</el-form-item>
		</app-pop>
	</div>
</template>

<script>
import TableComponent from '@/components/common/TableComponent'
import AppPop from '@/components/common/AppPop'
import RemoteSelect from '@/components/form/RemoteSelect'

const URL = '/competition';
export default {
	name: 'competitionList',
	data () {
		return {
			tableData: [],
			tableOptions: {
				header_btn: [
					{type: 'add', click: this.addPop},
				],
				height: 'default',
				columns: [
					{type: 'text', prop: 'title', label: '项目名称', width: '150'},
					{type: 'text', prop: 'deadline', label: '项目期限', width: '150'},
					{type: 'text', prop: 'ipr', label: '承办人', width: '150'},
					{type: 'text', prop: 'remark', label: '备注', width: '150'},
					{type: 'text', prop: 'uid', label: '创建人', width: '150'},
					{type: 'text', prop: 'create_time', label: '创建时间', width: '150'},
					{
						type: 'action',
						btns: [
							{type: 'edit', click: this.editPop},
							{type: 'delete', click: this.handleDelete},
						]
					}
				]
			},
			form: {				
				title: '',
				deadline: '',
				ipr: '',
				remark: '',
			},
			rules: {
				title: {required: true, message: '项目名称必填', trigger: 'blur'},
				ipr: {type: 'number', required: true, message: '承办人必选', trigger: 'change'},
			},
			formType: '',
			currentId: '',
		};
	},
	methods: {
		refresh () {
			this.$refs.table.refresh();
		},
		addPop () {
			this.formType = 'add';
			this.$refs.form.show();
		},
		editPop (row) {
			this.formType = 'edit',
			this.currentId = row.id;
			this.$refs.form.show();
			this.$nextTick(() => {
				this.fillForm(row);
			})
		},
		fillForm (form) {
			this.$tool.coverObj(this.form, form, {date: ['deadline']});
		},
		refreshTableData (option) {
			return this.$axiosGet({
				url: URL,
				data: option,
				success: (response) => {
					this.tableData = response.data;
				}  
			})
		},
		async handleSave (type) {
			if(type == 'add') {
				return await this.add();
			}else if(type == 'edit') {
				return await this.edit();
			}
		},
		add () {
			return this.$axiosPost({
				url: URL,
				data: this.$tool.shallowCopy(this.form, {date: true}),
				success: () => {
					this.$message({type: 'success', message: '添加成功'});
				}
			})
		},
		edit () {
			return this.$axiosPut({
				url: `${url}/${this.currentId}`,
				data: this.$tool.shallowCopy(this.form, {date: true}),
				success: () => {
					this.$message({type: 'success', message: '编辑成功'});
				}
			})
		},
		handleDelete () {

		}
	},
	mounted () {
		this.refresh();
	},
	components: {
		TableComponent,
		AppPop,
		RemoteSelect,
	}
}
</script>