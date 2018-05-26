<template>
	<el-form label-position="top" :rules="rules" :model="form" ref="form">
		
		<el-form-item label="导出字段" prop="fields">
			<app-transfer-panel v-model="form.fields" :data="fields" title="导出字段控制" :is-move="false" style="width: 100%;"></app-transfer-panel>
		</el-form-item>
		<el-form-item label="文件类型" prop="documents">
			<static-select type="file_type" v-model="form.documents" multiple></static-select>
		</el-form-item>
		<el-form-item style="margin-bottom: 0px;">
			<el-button type="primary" @click="exportClick" :loading="loading">{{loading ? '导出中' : '确认导出' }}</el-button>
		</el-form-item>
	</el-form>
</template>
<script>
import StaticSelect from '@/components/form/StaticSelect'
import AppTransferPanel from '@/components/common/AppTransferPanel'
import {mapGetters} from 'vuex'

export default {
	name: 'appExport',
	props: {
		'url': String,
		'fields': {
			type: Array,
			defult () {
				return [];
			}
		},
		'responseKey': String,
		'default': {
			type: Array,
			default () {
				return [];
			},
		},
		'filter': {
			type: null,
			default () {
				return {};
			}
		},
		'selected': {
			type: Array,
			default () {
				return [];
			}
		},
		'exportFunc': {
			type: Function,
		}
	},
	data () {
		const fields = this.default;
		return {
			form: {
				documents: [],
				fields,
			},
			loading: false,
			rules: {
				fields: {type: 'array', required: true, message: '导出字段不能为空', trigger: 'change'},
			}
		};
	},
	computed: {
		...mapGetters([
			'screen_obj',
		])
	},
	methods: {
		async exportClick () {
			const flag = await new Promise((reject) => {this.$refs.form.validate(reject)});
			if(flag) {
				if(this.exportFunc) {
					this.loading = true;
					try {
						const response = await this.exportFunc({
							format: 'excel',
							documents: this.form.documents,
							fields: this.form.fields.join(','),
						});

						const data = response.data;
						if(data.status) {
							window.location.href = data[this.responseKey]['downloadUrl'];
							this.$emit('success', data)
						}
					}catch(e) {
						console.log(e);
					}
					this.loading = false;
					// this.loading = false;
				}
			}else {
				this.$message({type: 'success', message: '请正确填写导出表单'});
			}
		}
	},
	watch: {
		default (val) {
			this.form.fields = val;
		}
	},
	components: {
		StaticSelect,
		AppTransferPanel,
	}
}
</script>