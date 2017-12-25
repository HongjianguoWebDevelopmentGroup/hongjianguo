<template>
	<el-form label-position="top" :rules="rules" :model="form" ref="form">
		
		<el-form-item label="导出字段" prop="fields">
			<el-checkbox-group 
    		v-model="form.fields"
   	 		:min="1"
   		>
    		<el-checkbox v-for="(item, index) in fields" :label="item.value" :key="item.value" :style="index == 0 ? 'margin-left: 15px' : ''">{{item.label}}</el-checkbox>
  		</el-checkbox-group>
		</el-form-item>
		<el-form-item label="文件类型" prop="documents">
			<static-select type="file_type" v-model="form.documents"></static-select>
		</el-form-item>
		<el-form-item style="margin-bottom: 0px;">
			<el-button type="primary" @click="exportClick" :loading="loading">{{loading ? '导出中' : '确认导出' }}</el-button>
		</el-form-item>
	</el-form>
</template>
<script>
import StaticSelect from '@/components/form/StaticSelect'

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

		}
	},
	data () {
		const fields = this.default;
		return {
			form: {
				documents: '',
				fields,
			},
			loading: false,
			rules: {
				fields: {type: 'array', required: true, message: '导出字段不能为空', trigger: 'change'},
			}
		};
	},
	methods: {
		exportClick () {
			this.$refs.form.validate(_=>{
				if(_){
					this.loading = true;
					this.$axiosGet({
						url: this.url,
						data: {
							format: 'excel',
							documents: this.form.documents,
							fields: JSON.stringify(this.form.fields),
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
	components: {
		StaticSelect,
	}
}
</script>