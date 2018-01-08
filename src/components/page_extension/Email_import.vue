<template>
	<el-form :model="form" ref="form" label-width="100px">
		<el-form-item label="案件类型" prop="project_type">
			<el-select v-model="form.project_type" placeholder="请选择案件类型">
				<el-option 
					v-for="item in options2"
					:key="item.value"
					:label="item.label"
					:value="item.value"
				></el-option>
			</el-select>
		</el-form-item>
		<template v-if="form.project_type">
			<el-form-item label="关联案件" prop="project">
				<keep-alive>
				  <remote-select :key="projectType" :type="projectType" v-model="form.project"></remote-select>
				</keep-alive>
			</el-form-item>
			<el-form-item label="文件类型" prop="file_type">
				<keep-alive>
					<static-select :key="projectType" :type="fileType" v-model="form.file_type"></static-select>
				</keep-alive>
			</el-form-item>
		</template>
		<el-form-item label="附件" prop="attachments">
			<upload v-model="form.attachments" :file-list="attachments" ref="attachments"></upload>
		</el-form-item>
		<el-form-item label="导入时间" prop="time">
			<el-date-picker type="date" placeholder="请选择导入时间" v-model="form.time"></el-date-picker>
		</el-form-item>
<!-- 		<el-form-item label="备注" prop="remark">
			<el-input type="textarea" v-model="form.remark"></el-input>
		</el-form-item> -->
		<el-form-item style="margin-bottom: 0px;">
			<el-button type="primary" :loading="btn_loading" @click="importMaile">{{ btn_loading ? '导入中...' : '确认导入' }}</el-button>
		</el-form-item>
	</el-form>
</template>

<script>
import RemoteSelect from '@/components/form/RemoteSelect'
import StaticSelect from '@/components/form/StaticSelect'
import Upload from '@/components/form/Upload'

export default {
	name: 'EmailImport',
	props: ['id'],
	data () {
		return {
			form: {
				project_type: '',
				project: '',
				file_type: '',
				time: '',
				attachments: [],
			},
			options: [
				{label: '通知书', value: 1},
				{label: '账单', value: 2},
			],
			options2: [
				{label: '专利', value: 1},
				{label: '商标', value: 2},
				{label: '版权', value: 3},
			],
			attachments: [],
			btn_loading: false,
		};
	},
	computed: {
		projectType () {
			const t = this.form.project_type; 
			if(!t) return '';
			return {1: 'patent', 2: 'trademark', 3: 'copyright'}[t];
		},
		fileType () {
			const t = this.form.project_type;
			if(!t) return '';
			return {1: 'file_type', 2: 'file_type_trademark', 3: 'file_type'}[t];
		}
	},
	methods: {
		setForm (form) {
			this.$tool.coverObj(this.form, form, {obj: ['attachments'], skip: ['project']});
			this.attachments = form.attachments;
			if(form.project) {
				this.$nextTick(_=>{
					this.form.project = form.project;
				})
			}
		},
		importMaile () {

			const project = this.form.project; 
			const type = this.form.file_type;
			const time = this.form.time;

			if(!this.form.project_type) {
				this.$message({type: 'warning', message: '案件类型不能为空'});
				return;
			}
			if(!project) {
				this.$message({type: 'warning', message: '关联案件不能为空'});
				return;
			}if(!type) {
				this.$message({type: 'warning', message: '文件类型不能为空'});
				return;
			}
			if(!time) {
				this.$message({type: 'warning', message: '导入时间不能为空'});
				return;
			}
			if(this.form.attachments.length == 0) {
				this.$message({type: 'warning', message: '附件不能为空'});
				return;
			}

			const url = {1: '/api/patents/documents', 2: '/api/trademarks/documents', 3: 'copyrights/documents'}[this.form.project_type];
			const data = {
				list: [],
			};
			data['list'] = this.form.attachments.map( _=>({file_id: _, time: this.$tool.getDate(time), project, type }) );
			const success = _=>{
				this.$message({message: _.info, type: 'success'});
				this.$emit('success', _);
			};

			this.$axiosPost({url, data, success});
		}
	},
	watch: {
		'form.project_type': {
			handler (val) {
				this.form.project = '';
				this.form.file_type = '';
			}
		}
	},
	components: {
		RemoteSelect,
		StaticSelect,
		Upload,
	}
}
</script>