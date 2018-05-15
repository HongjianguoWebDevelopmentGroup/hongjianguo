<template>
	<div class="main">
		<table-component :data="tableData" :tableOption="tableOptions" :refreshTableData="refreshTableData" ref="table"></table-component>
		<app-pop 
			ref="form" 
			:model="form" 
			:type="formType" 
			:rules="rules" 
			title="" 
			:save="handleSave">
			
		</app-pop>
	</div>
</template>

<script>
import TableComponent from '@/components/common/TableComponent'
import AppPop from '@/components/common/AppPop'

const URL = '';
export default {
	name: '',
	data () {
		return {
			tableData: [],
			tableOptions: {

			},
			form: {

			},
			rules: {

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

		},
		refreshTableData (option) {
			return this.this.axiosGet({
				url: URL,
				data: option,
				success: (response) => {
					this.tableData = response.data;
				}  
			})
		},
		async handleSave (type) {
			if(this.type == 'add') {
				return await this.add();
			}else if(this.type == 'edit') {
				return await this.edit();
			}
		},
		add () {
			return this.$axiosPost({
				url: URL,
				data: this.form,
				success: () => {
					this.$message({type: 'success', message: '添加成功'});
				}
			})
		},
		edit () {
			return this.$axiosPut({
				url: `${url}/${this.currentId}`,
				data: this.form,
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
	}
}
</script>