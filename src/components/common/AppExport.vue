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
			'screenValue',
		]),
		defaultParams () {
			const params = this.$route.meta.params;
			return params ? params : {};
		},
	},
	methods: {
		exportClick () {
			this.$refs.form.validate(_=>{
				if(_){
					this.loading = true;
					this.$axiosGet({
						url: this.url,
						data: {
							...this.filter,
							...this.screenValue,
							...this.defaultParams,
							format: 'excel',
							documents: this.form.documents,
							fields: this.form.fields.join(','),
							ids: this.selected.map(_=>_.id),
						},
						success: d=>{	
							window.location.href = d[this.responseKey]['downloadUrl'];
							this.$emit('success', d);
						},
						complete: d=>{
							this.loading = false;
						}
					})		
				}
			})
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