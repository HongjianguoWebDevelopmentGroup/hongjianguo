<template>
	<div v-loading="loading" element-loading-text="加载中..."> 
		<app-table :columns="columns" :data="data" style="margin-right: 10px;">
			<template slot="row_action" slot-scope="scope">
				<el-switch
					v-model="scope.row.check_type"
					on-color="#13ce66"
					off-color="#ff4949"
					on-text="通过"
					off-text="拒绝"
					:on-value="true"
					:off-value="false">
				</el-switch>
			</template>

		</app-table>
		<div style="margin-top: 10px;">
			<el-button @click="pass" type="primary" :disabled="disabled">通过</el-button>
			<el-button @click="refuse" type="danger" :disabled="disabled">拒绝</el-button>
			<el-button @click="cancel" :disabled="disabled">取消</el-button>
		</div>
<!-- 		<el-dialog :visible.sync="dialogVisible" :modal="false" title="审核意见" class="dialog-small" @close="dialogClose">
			<el-form :model="form" ref="form" label-position="top">
				<el-form-item label="审核结果" prop="check_type">
					<el-select v-model="form.check_type">
						<el-option label="通过" :value="true">通过</el-option>
						<el-option label="拒绝" :value="false">拒绝</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="企业意见" prop="suggestion">
					<el-input type="textarea" v-model="form.suggestion"></el-input>		
				</el-form-item>
				<el-form-item style="margin-bottom: 0px;">
					<el-button type="primary" @click="confirm">确认</el-button>
					<el-button>取消</el-button>	
				</el-form-item>
			</el-form>
		</el-dialog> -->
	</div>
</template>
<script>
import AppTable from '@/components/common/AppTable'
import axios from 'axios'

export default {
	name: 'checkInvoice',
	data () {

		return {
			id: '',
			disabled: false,
			// form: {
			// 	check_type: '',
			// 	suggestion: '',
			// },
			// row: '',
			columns: [
				// { 
				// 	type: 'text',  
				// 	fixed: true, 
				// 	label: '', 
				// 	prop: 'check_type', 
				// 	width: '60',
				// 	render: this.checkTypeRender
				// },
				{ type: 'text', label: '案号', prop: 'serial' },
				{ type: 'text', label: '案件名称', prop: 'title' },
				{ type: 'text', label: '费用类型', prop: 'code', render_simple: 'name' },
				{ type: 'text', label: '费用', prop: 'amount' },
				{ type: 'text', label: '参考费用', prop: 'amount_reference' },
				{ 
					type: 'text', 
					label: '企业意见', 
					prop: 'suggestion',
					width: '200',
					render: this.suggestionRender,
				},
				{
          type: 'action',          
          btns_render: true,
          slign: 'center',
          width: '100',
        },
				// { 
				// 	type: 'text',
				// 	align: 'center',
				// 	width: '80',
				// 	btns_render: true,
					// btns: [
					// 	{
					// 		btn_type: 'text',
					// 		label: '通过',
					// 		click: this.confirmPop,
					// 	},
					// 	{
					// 		btn_type: 'text',
					// 		label: '拒绝',
					// 		click: 
					// 	}
					// ]
				// }
			],
			data: [],
			dialogVisible: false,
			loading: false,
		}
	},
	methods: {
		getFees (id) {
			const url = `/fees`;
			const data = {
				listRows: 100,
				page: 1,
				fee_invoice: id,	
			};
			return this.$axiosGet({url, data});
		},
		getTemp (id) {
			const url = `/tempgetall/${id}/stringget`;
			return this.$axiosGet({url, error: () => {}});
		},
		async render (id) {
			this.id = id;
			this.loading = true;
			try {
				const responses = await axios.all([this.getFees(id), this.getTemp(id)]);
				const fees = responses[0]['data'];
				const temp = responses[1]['data'];
				if(fees.status) {
					const feeData = fees.fees.data;
					if(temp.status) {
						const tempData = JSON.parse(temp.data); 
						feeData.forEach((v, index) => {
							v.check_type = tempData[index]['check_type'];
							v.suggestion = tempData[index]['suggestion']; 
						})
					}else {
						feeData.forEach((v) => {
							v.check_type = v.amount == v.amount_reference;
							v.suggestion = '';
						});	
					}
					
					this.data = feeData;
				}
			}catch(e) {}
			this.loading = false;
			
			// const url = '/api/fees';
			// const data = 
			// const success = (data) => {
			// 	const fees = data.fees.data;
			// 	fees.forEach((v) => {
			// 		v.check_type = true;
			// 		v.suggestion = '';
			// 	});
			// 	this.data = fees;
			// }
			// const complete = () => {
			// 	this.loading = false;
			// }
			// this.$axiosGet({url, data, success, complete});
		},
		finish (type) {
			const url = '/feecomment';
			const content = this.data.map(v => ({id: v.id, suggestion: v.suggestion}));
			const data = {
				invoice_id: this.id,
				content,
				handle: type,
			};
			const success = () => {
				const message = type == 'pass' ? '通过账单成功' : '拒绝账单成功';
				this.$message({ type: 'success', message });
				this.$emit('callback', type);
			};
			const complete = () => {
				this.disabled = false;
			};
			this.disabled = true;
			return this.$axiosPost({url, data, success, complete});
		},
		pass () {
			const falseData = this.data.filter(v => !v.check_type);
			if(falseData.length != 0) return this.$message({type: 'warning', message: '请通过所有费用'});
			this.finish('pass');
		},
		refuse () {
			this.finish('refuse');
		},
		cancel () {
			this.$emit('callback', 'cancel');
		},
		save () {
			const url = '/temphandle';
			const content = JSON.stringify(this.data.map(v => ({check_type: v.check_type, suggestion: v.suggestion})));
			const data = {
				invoice_id: this.id,
				content,
			};
			const success = () => {
				this.$message({type: 'success', message: '暂存成功'});
			}
			return this.$axiosPost({url, data, success});
		},		
		// confirmPop (row) {
		// 	this.dialogVisible = true;
		// 	this.$nextTick(() => {
		// 		this.row = row;
		// 		this.form.check_type = this.row.check_type;	
		// 		this.form.suggestion = this.row.suggestion;	
		// 	})
		// },
		// confirm () {
		// 	this.row.check_type = this.form.check_type;
		// 	this.row.suggestion = this.form.suggestion;
		// 	this.dialogVisible = false;
		// },
		clear () {

		},
		dialogClose () {
			this.$refs.form.resetFields();
		},
		checkTypeRender (h, item) {
			let yFlag = false;
			let nFlag = false;
			let color = '';
			if(item === true) {
				yFlag = true;
				color = 'green';
			}else if(item === false) {
				nFlag = true;
				color = 'red';
			}
			return h('i', {
				class: {
					'el-icon-check': yFlag,
					'el-icon-close': nFlag,
				},
				style: {
					color: color,
				}
			});
		},
		suggestionRender (h, item, row) {
			return h('el-input', {
				on: {
					input: (value) => { row.suggestion = value },
				},
				props: {
					value: row.suggestion,
				}
			})
		} 
	},
	components: {
		AppTable,
	}
}
</script>