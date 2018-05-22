<template>
	<div class="main">
		<table-component v-loading="tableLoading" element-loading-text="加载中..." :data="data" :table-option="tableOption"></table-component>
		
		<app-pop
			:model="form"
			:type="formType"
			label-position="top"
			title="报价"
			ref="pop"
			:save="save">
			<template v-if="formType == 'add'">
				<el-form-item label="报价名称" prop="name" :rules="rules.name">
					<el-input placeholder="请输入报价名称" v-model="form.name"></el-input>
				</el-form-item>
				<el-form-item label="地区" prop="area" :rules="rules.area">
					<static-select type="area" v-model="form.area"></static-select>
				</el-form-item>
				<el-form-item label="案件类型" prop="category" :rules="rules.category">
					<static-select type="case_type" v-model="form.category"></static-select>
				</el-form-item>
			</template>
			<el-form-item label="默认报价" prop="amount" :rules="rules.amount">
				<el-input placeholder="请输入默认报价" v-model="form.amount" style="width: 200px;"></el-input><span>&nbsp;&nbsp;元</span>
			</el-form-item>

		</app-pop>

	</div>
</template>
<script>
import TableComponent from '@/components/common/TableComponent'
import AppPop from '@/components/common/AppPop'
import StaticSelect from '@/components/form/StaticSelect'

const URL = '/feereference';

export default {
	name: 'offerList',
	data () {
		return {
			id: '', //当前正在编辑报价的ID
			tableLoading: false,
			tableOption: { //报价列表配置
				name: 'offerList',
				url: URL,
				height: 'default',
				// rowClick: this.handleRowClick,
				is_pagination: false,
				is_search: false,
				header_btn: [
					{ type: 'add', click: this.handleAdd },
					{ type: 'delete', callback: this.refresh },
				],
				columns: [
					{ type: 'selection', fixed: false },
					{ type: 'text', label: '报价名称', prop: 'name' },
					{ type: 'text', label: '地区', prop: 'area' },
					{ type: 'text', label: '案件类型', prop: 'category' },
					{ type: 'text', label: '默认报价', prop: 'amount', render_text: item => `${item}元` },
					{ 
						type: 'action',
						width: '100px',
						fixed: false,
						align: 'center',
						btns: [
							{ type: 'edit', click: this.handleRowClick },
						],
					}
				],
			},
			data: [], //数据缓存
			form: { //表单缓存
				name: '',
				area: '',
				category: '',
				amount: '',
			},
			rules: { //验证规则
				name: { required: true, message: '报价名称不能为空', trigger: 'blur' },
				area: { required: true, message: '地区不能为空', trigger: 'change' },
				category: { type: 'integer', required: true, message: '案件类型不能为空', trigger: 'change' },
				amount: [
					{ required: true, message: '默认报价不能为空', trigger: 'blurs' },
					{ pattern: /^(0|(([1-9][0-9]*)+(.[0-9]{1,2})?))$/, message: '价格只能为数字,保留至小数后两位', trigger: 'blur' }
				],

			},
			formType: '', //当前表单类型
		};
	},
	methods: {
		async refresh () {
			const url = URL;
			const success = (response) => {
				this.data = response.data;
			}
			this.tableLoading = true;
			await this.$axiosGet({url, success});
			this.tableLoading = false;
		},
		save (type) {
			if(type == 'add') {
				return this.add();
			}else if(type == 'edit') {
				return this.edit();
			}
		},
		handleAdd () {
			this.formType = 'add';
			this.$refs.pop.show();
		},
		handleRowClick (row) {
			if(!row.id) return;
			this.id = row.id;
			this.formType = 'edit';
			this.$refs.pop.show();
			this.$nextTick(() => {
				this.form.amount = row.amount + '';
			});
		},
		add () {
			const url = URL;
			const data = this.form;
			const success = () => {
				this.$message({type: 'success', message: '新建报价成功'});
				this.refresh();
			};
			return this.$axiosPost({url, data, success})
		},
		edit () {
			const url = `${URL}/${this.id}`;
			const data = { amount: this.form.amount };
			const success = () => {
				this.$message({type: 'success', message: '编辑报价成功'});
				this.refresh();
			};
			return this.$axiosPut({url, data, success})
		}
	},
	created () {
		this.refresh();
	},
	components: {
		TableComponent,
		StaticSelect,
		AppPop,
	}
}
</script>
