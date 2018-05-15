<template>
	<el-dialog :modal="modal" :class="dialogClass" :visible.sync="dialogVisible" :before-close="beforeClose" :title="dialogTitle" @close="clear">
		<el-form :model="model" :label-position="labelPosition" :label-width="labelWidth" :rules="rules" ref="form">
			<slot></slot>
			<el-form-item style="margin-bottom: 0px;">
				<el-button :loading="loading" @click="handleSave" type="primary">{{ loading ? '保存中...' : '保存' }}</el-button>
				<el-button :disabled="loading" @click="cancel">取消</el-button>
			</el-form-item>
		</el-form>
	</el-dialog>
</template>

<script>
const FORM_ERROR_MESG = '请正确填写表单字段';
export default {
	name: 'appPop',
	props: {
		title: {
			type: String,
			default: '',
		},
		model: {
			type: Object,
			default: null,
		},
		labelWidth: {
			type: String,
			default: '',
		},
		labelPosition: {
			type: String,
			default: 'right',
		},
		rules: {
			type: Object,
			default: null,
		},
		save: {
			type: Function,
			default () {
				return () => {};
			}
		},
		type: {
			type: String,
			default: 'add',
		},
		size: {
			type: String,
			default: 'small',
		},
		modal: {
			type: Boolean,
			default: true,
		}
	},	
	data () {
		return {
			dialogVisible: false,
			loading: false,
		};
	},
	computed: {
		dialogTitle () {
			const key = this.type == 'add' ? '添加' : '编辑';
			return `${key}${this.title}`;
		},
		dialogClass () {
			return {
				'small': 'dialog-small',
				'medium': 'dialog-medium',
			}[this.size];
		}
	},
	methods: {
		show () {
			this.dialogVisible = true;
		},
		clear () {
			this.$refs.form.resetFields();
		},
		beforeClose (done) {
			if(!this.loading) done();
		},
		checkForm () {
			return new Promise(resolve => {
				this.$refs.form.validate(resolve);
			})
		},
		async handleSave () {
			const boolean = await this.checkForm();
			if(boolean) {
				this.loading = true;
				try {
					const response = await this.save(this.type);

					const data = response.data;
					if(data.status) {
						this.dialogVisible = false;
					}
				}catch (e) {
					console.log(e);
				}
				this.loading = false;
				
			}else {
				this.$message({type: 'warning', message: FORM_ERROR_MESG});
			}
		},
		cancel () {
			this.dialogVisible = false;
		}
	},
}
</script>