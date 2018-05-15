<template>
	<div class="main">
		<table-component :data="tableData" :tableOption="tableOptions" :refreshTableData="refreshTableData" ref="table"></table-component>
		<app-pop 
			ref="form" 
			:model="form" 
			:type="formType" 
			:rules="rules"
			label-width="90px" 
			title="专利监控" 
			:save="handleSave">
			<el-form-item prop="apn" label="申请号">
				<el-input v-model="form.apn"></el-input>
			</el-form-item>
			<el-form-item prop="title" label="标题">
				<el-input v-model="form.title"></el-input>
			</el-form-item>
			<el-form-item prop="applicant" label="申请人">
				<el-input v-model="form.applicant"></el-input>
			</el-form-item>
			<el-form-item prop="apd" label="申请日">
				<el-date-picker type="date" v-model="form.apd" style="width: 100%;"></el-date-picker>
			</el-form-item>
			<el-form-item prop="public_date" label="公开日">
				<el-date-picker type="date" v-model="form.public_date" style="width: 100%;"></el-date-picker>
			</el-form-item>
			<el-form-item prop="issue_date" label="授权日">
				<el-date-picker type="date" v-model="form.issue_date" style="width: 100%;"></el-date-picker>
			</el-form-item>
			<el-form-item prop="progress" label="状态">
				<static-select type="patents_status" v-model="form.progress"></static-select>
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
import StaticSelect from '@/components/form/StaticSelect'

const URL = '/monitor';
export default {
	name: 'moniterList',
	data () {
		return {
			tableData: [],
			tableOptions: {
				url: URL,
				header_btn: [
					{type: 'add', click: this.addPop},
					{type: 'delete'},
				],
				height: 'default',
				columns: [
					{type: 'selection'},
					{type: 'text', prop: 'apn', label: '申请号', width: '150'},
					{type: 'text', prop: 'title', label: '标题', width: '150'},
					{type: 'text', prop: 'applicant', label: '申请人', width: '150'},
					{type: 'text', prop: 'apd', label: '申请日', width: '150'},
					{type: 'text', prop: 'public_date', label: '公开日', width: '150'},
					{type: 'text', prop: 'issue_date', label: '授权日', width: '150'},
					{type: 'text', prop: 'progress', label: '状态', render_simple: 'name', width: '150'},
					{type: 'text', prop: 'remark', label: '备注', width: '150'},
					{type: 'text', prop: 'uid', label: '创建人', width: '150'},
					{type: 'text', prop: 'create_time', label: '创建时间', width: '150'},
					{
						type: 'action',
						btns: [
							{type: 'edit', click: this.editPop},
						]
					}
				]
			},
			form: {				
				apn: '',
				title: '',
				applicant: '',
				apd: '',
				public_date: '',
				issue_date: '',
				progress: '', 
				remark: '',
			},
			rules: {
				apn: {required: true, message: '申请号必填', trigger: 'blur'},
				title: {required: true, message: '标题必填', trigger: 'blur'},
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
			this.$tool.coverObj(this.form, form, {date: ['apd', 'public_date', 'issue_date'], obj: ['progress']});
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
		}
	},
	mounted () {
		this.refresh();
	},
	components: {
		TableComponent,
		AppPop,
		StaticSelect,
	}
}
</script>