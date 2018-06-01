<template>
	<el-form :model="form" ref="form" label-width="80px" v-loading="initLoading" element-loading-text="加载中...">
		<el-form-item label="收件人" prop="to">
			<remote-select type="mail" v-model="form.to" ref="to" multiple></remote-select>
		</el-form-item>
		<el-form-item label="抄送" prop="cc">
			<remote-select type="mail" v-model="form.cc" ref="cc" multiple></remote-select>
		</el-form-item>
		<el-form-item label="主题" prop="subject">
			<el-input v-model="form.subject" placeholder="请输入邮件主题"></el-input>
		</el-form-item>
		<el-form-item label="附件" prop="attachments">
			<upload v-model="form.attachments" :file-list="attachments"></upload>
		</el-form-item>
		<el-form-item label="正文" prop="body">
			<div id="mail-edit-form-body" v-html="form.body" style="height: 300px;overflow-y: auto; border: solid 1px #ccc; margin-top: 20px; padding: 10px;" :contenteditable="true"></div>
		</el-form-item>
		<el-form-item style="margin-bottom: 0px;">
			<el-button type="primary" @click="sendMail" :loading="sendLoading">{{ sendLoading ? '发送中...' : '确认发送' }}</el-button>
			<el-button type="danger" @click="cancelSending" :disabled="sendLoading">取消发送</el-button>
		</el-form-item>
	</el-form>
</template>

<script>
import Upload from '@/components/form/Upload'
import RemoteSelect from '@/components/form/RemoteSelect'

const URL = '/mails';

export default {
	name: 'mailEditForm',
	data () {
		return {
			id: '',
			form: {
				to: [],
				cc: [],
				subject: '',
				attachments: [],
				body: '',
			},
			attachments: [],
			initLoading: false,
			sendLoading: false,
		};
	},
	methods: {
		con () {
			console.log(this.$el.querySelector('#mail-edit-form-body').innerHTML);
		},
		async initForm (id) {
			if(!id && id != 0) return this.$message({type: 'warning', message: '数据异常'});
			this.id = id;
			this.initLoading = true;
			await this.$axiosGet({
				url: `${URL}/${id}`,
				success: (data) => {
					this.fillForm(data.mail);
				}
			});
			this.initLoading = false;
		},
		async sendMail () {
			const id = this.id;
			if(!id && id != 0) return this.$message({type: 'warning', message: '数据异常'});
			this.sendLoading = true;
			try {
				await this.$axiosPut({
					url: `${URL}/${id}/send`,
					data: {
						to: this.$refs.to.getSelected().map(v => ({label: v['name'], value: v['id']})),
						cc: this.$refs.cc.getSelected().map(v => ({label: v['name'], value: v['id']})),
						subject: this.form.subject,
						attachments: this.form.attachments,
						body: this.$el.querySelector('#mail-edit-form-body').innerHTML,
					},
					success: (data) => {
						this.$message({type: 'success', message: '发送邮件成功'});
						this.clear();
						this.$emit('sendSuccess');
					},
				});	
			}catch(e) {};
			
			this.sendLoading = false;
		},
		cancelSending () {
			this.$confirm('此操作将取消邮件发送, 是否继续?', '提示', {
          type: 'warning'
        }).then(() => {
      		this.clear();
					this.$emit('cancelSending');    
        }).catch(() => {});
		},
		clear () {
			this.id = '';
			this.$refs.form.resetFields();
		},
		fillForm (form) {
			console.log(form)
			form.to = form.to.map(v => ({id: v.value, name: v.label}));
			form.cc = form.cc.map(v => ({id: v.value, name: v.label}));
			this.attachments = form.attachments;
			this.$tool.coverObj(this.form, form, {obj: ['attachments']});
		},
	},
	components: {
		Upload,
		RemoteSelect,
	}
}
</script>