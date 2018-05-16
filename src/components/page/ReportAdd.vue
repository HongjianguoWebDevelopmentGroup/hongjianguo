<template>
<div class="main">
	<el-steps slot="header" style="width: 100%;box-sizing: border-box;padding-left: 30px;" align-center center :active="active">
		  <el-step title="选择报表类型" icon="edit"></el-step>
		  <el-step title="定制数据" icon="upload"></el-step>
		  <el-step title="生成报表" icon="picture"></el-step>
		</el-steps>
	<el-card class="report-card">
		
		<div :style="`height: ${innerHeight - 220}px;overflow-y: auto;overflow-x: hidden;`">
			<template v-if="active == 1">
				<static-select type="report_type" v-model="reportType"></static-select>
			</template>
			<template v-if="active == 2 || active == 3">
				<report-form v-show="active == 2" :report-type="reportType" :table-type="type" ref="reportForm"></report-form>
			</template>
			<template v-if="active == 3">
				<report-view :para="viewPara" @complete="thirdDisabled=false"></report-view>
			</template>
		</div>
		<div style="height: 60px;line-height: 60px;border-top: solid 1px #dedede;text-align: right;">
			<template v-if="active == 1">
				<el-button style="width: 100px" @click="$router.push(config.list_url)">取消</el-button>
				<el-button style="width: 100px" type="primary" @click="toNext">下一步</el-button>
			</template>
			<template v-else-if="active == 2">
				<el-button style="width: 100px" @click="active = active - 1">上一步</el-button>
				<el-button style="width: 100px" type="primary" @click="toReport">生成报表</el-button>
			</template>
			<template v-else-if="active == 3">
				<el-button style="width: 100px" @click="active = active - 1" :disabled="thirdDisabled">上一步</el-button>
				<el-button style="width: 100px" type="primary" @click="dialogVisible = true" :disabled="thirdDisabled">保存报表</el-button>
			</template>
		</div>
	</el-card>
	<el-dialog title="保存为常用报表" class="dialog-small" :visible.sync="dialogVisible" @close="$refs.form.resetFields()">
		<el-form ref="form" :model="form" label-width="80px">
			<el-form-item label="报表名称" prop="title">
				<el-input v-model="form.title"></el-input>
			</el-form-item>
			<el-form-item label="自动发送" prop="is_auto_mail">
				<el-checkbox v-model="form.is_auto_mail" :true-label="1" :false-label="0">自动发送报表邮件</el-checkbox>
			</el-form-item>
			<el-form-item label="发送时间" v-show="mailShow" prop="timing">
				<mail-date v-model="form.timing"></mail-date>
			</el-form-item>
			<el-form-item style="margin-bottom: 0px;">
				<el-button type="primary" :loading="loading" @click="saveReport">{{ loading ? '保存中...' : '确定' }}</el-button>
				<el-button :disabled="loading" @click="dialogVisible = false">取消</el-button>
			</el-form-item>
		</el-form>
	</el-dialog>
</div>
</template>
<script>
import StaticSelect from '@/components/form/StaticSelect'
import ReportForm from '@/components/page_extension/Report_form'
import ReportView from '@/components/page_extension/Report_view'
import MailDate from '@/components/form/MailDate'
import {configs} from '@/const/reportConfig'

import {mapGetters} from 'vuex' 

const url = '/reports';
export default {
	name: 'reportAdd',
	data () {
		return {
			active: 1,
			reportType: 'pie',
			viewPara: '',
			mailShow: false,
			dialogVisible: false,
			thirdDisabled: false,
			loading: false,
			form: {
				title: '',
				is_auto_mail: 0,
				timing: [],
			},
			saveForm: '',
		}
	},
	computed: {
		...mapGetters([
			'innerHeight',
		]),
		type () {
			return this.$route.params.type;
		},
		config () {
			return configs[this.type];
		},
	},
	methods: {
		toNext () {
			if(!this.reportType) return this.$message({type: 'warning', message: '报表类型不能为空'});
			this.active += 1;
		},
		toReport () {
			const error_msg = this.$refs.reportForm.check();
			if(error_msg) {
				return this.$message({type: 'warning', message: error_msg});
			}

			this.viewPara = { ...this.$refs.reportForm.getFormData(), table_type: this.type, report_type: this.reportType };
			this.saveForm = { ...this.$refs.reportForm.getFormData('save'), table_type: this.type, report_type: this.reportType };
			
			this.$nextTick(_=>{
				this.active += 1;
				this.thirdDisabled = true;
			})
		},
		saveReport () {
			if(!this.form.title) return this.$message({type: 'warning', message: '报表名称不能为空'});
			if(this.form.is_auto_mail && this.form.timing.length == 0) return this.$message({type: 'warning', message: '请选择发送时间'});

			this.loading = true;
			this.$axiosPost({
				url,
				data: this.$tool.shallowCopy(Object.assign({}, this.saveForm, this.form), {array: true}),
				success: _=>{ 
					this.$message({type: 'success', message: '新建报表成功'});
					this.$router.push(this.config.list_url);
				},
				complete: _=>{ this.loading = false  }
			});
		},
	},
	mounted () {
	},
	watch: {
		'form.is_auto_mail': {
			handler (val) {
				if(val == 1) {
					this.mailShow = true;
				}else if(val == 0) {
					this.mailShow = false;
					this.form.timing = [];
				}
			} 
		}
	},
	components: {
		StaticSelect,
		ReportForm,
		ReportView,
		MailDate,
	}
}
</script>
<style lang="scss">
.el-card.report-card>.el-card__body {
	padding-bottom: 0px;
}
</style>