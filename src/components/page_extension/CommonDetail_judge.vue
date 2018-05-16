<template>
	<div>
		<table-component :data="tableData" :tableOption="tableOptions" :refreshTableData="refreshTableData" ref="table"></table-component>
		<app-pop 
			ref="form"
			:modal="false"
			:model="form" 
			:type="formType" 
			:rules="rules"
			label-width="90px" 
			title="评审" 
			:save="handleSave">
			<el-form-item prop="review_type" label="评审类型">
				<static-select type="judge_type" v-model="form.review_type"></static-select>
			</el-form-item>
			<el-form-item prop="member_id" label="评审人">
				<remote-select type="member" v-model="form.member_id"></remote-select>
			</el-form-item>
			<el-form-item prop="content" label="评审内容">
				<el-input type="textarea" v-model="form.content"></el-input>
			</el-form-item>
		</app-pop>
	</div>
</template>

<script>
import TableComponent from '@/components/common/TableComponent'
import AppPop from '@/components/common/AppPop'
import RemoteSelect from '@/components/form/RemoteSelect'
import StaticSelect from '@/components/form/StaticSelect'

const URL = '/judge';

export default {
	name: 'competitionList',
	props: ['id'],
	data () {
		return {
			tableData: [],
			tableOptions: {
				header_btn: [
					{type: 'add', click: this.addPop},
				],
				is_search: false,
				is_pagination: false,
				columns: [
					{type: 'text', prop: 'review_type', label: '评审类型'},
					{type: 'text', prop: 'member_id', label: '评审人', render_simple: 'name'},
					{type: 'text', prop: 'content', label: '评审内容'},
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
				review_type: '',
				member_id: '',
				content: '',
			},
			rules: {
				review_type: {type: 'number', required: true, message: '评审类型不能为空', trigger: 'change'},
				member_id: {type: 'number', required: true, message: '评审人不能为空', trigger: 'change'},
				content: {required: true, message: '评审内容不能为空', trigger: 'blur'},
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
			this.$tool.coverObj(this.form, form, {obj: ['review_type']});
		},
		refreshTableData () {
			return this.$axiosGet({
				url: `${URL}/${this.id}`,
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
				data: Object.assign({}, this.form, {project_id: this.id}),
				success: () => {
					this.$message({type: 'success', message: '添加评审成功'});
					this.refresh();
				}
			})
		},
		edit () {
			return this.$axiosPut({
				url: `${url}/${this.currentId}`,
				data: this.$tool.shallowCopy(this.form, {date: true}),
				success: () => {
					this.$message({type: 'success', message: '编辑评审成功'});
					this.refresh();
				}
			})
		},
		handleDelete () {

		}
	},
	mounted () {
		this.refresh();
	},
	watch: {
		id () {
			this.refresh();
		}
	},
	components: {
		TableComponent,
		AppPop,
		RemoteSelect,
		StaticSelect,
	}
}
</script>