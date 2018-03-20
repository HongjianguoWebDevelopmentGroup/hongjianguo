<template> 
  <el-tabs v-model="activeName">
    <el-tab-pane label="报表视图" name="first">
  		<report-view :para="para" :style="`height: ${innerHeight - 150}px; box-sizing: border-box;padding-top: 10px;padding-left: 10px;`"></report-view>  	
    </el-tab-pane>
    <el-tab-pane label="报表条件" name="second">
    	<div style="box-sizing: border-box;padding-top: 10px;padding-left: 10px;">
	    	<report-form ref="form" :report-type="reportType" :table-type="tableType" :style="`height: ${innerHeight - 200}px; overflow-y: auto; overflow-x: hidden;`"></report-form>
	    	<div style="text-align: center; padding-top: 10px; border-top: solid #ccc 1px;">
	    		<el-button type="primary" :loading="loading" style="width: 100px;" @click="saveReport">{{ loading ? '保存中...' : '保存' }}</el-button>
	    		<el-button :disabled="loading" style="width: 100px; margin-left: 50px;" @click="rollback">还原</el-button>
	    	</div>
    	</div>
    </el-tab-pane>
  </el-tabs>
</template>
<script>

import ReportView from '@/components/page_extension/Report_view'
import ReportForm from '@/components/page_extension/Report_form'
import {mapGetters} from 'vuex'

export default {
	name: 'reportDetail',
	props: {
		currentRow: {
			type: null,
			default: '',
		}
	},
	data () {
		return {
			para: '',
			activeName: 'first',
			loading: false,
			cache: '',
		};
	},
	computed: {
		...mapGetters([
			'innerHeight',
			'tableConfigsCache',
		]),
		reportType () {
			return this.currentRow ? this.currentRow.report_type : '';
		},
		tableType () {
			return this.currentRow ? this.currentRow.table_type : '';
		},
		config () {
			return this.tableConfigsCache[this.tableType];
		}
	},
	methods: {
		rollback () {
			this.$refs.form.setForm(this.cache);
		},
		refresh () {
			this.cache = this.$tool.deepCopy(this.currentRow);
			this.$refs.form.setForm(this.currentRow);
			this.$nextTick(_=>{
				this.para = { ...this.$refs.form.getFormData(), table_type: this.tableType, report_type: this.reportType };
			})
		},
		saveReport () {
			this.loading = true;
			const url = `/api/reports/${this.currentRow.id}`;
			const data = this.$refs.form.getFormData('save');
			this.$axiosPut({
				url,
				data,
				success: _=>{
					this.activeName = 'first';
					this.$message({type: 'success', message: '保存报表成功'});
					this.activeName = 'first';
					this.para = { ...this.$refs.form.getFormData(), table_type: this.tableType, report_type: this.reportType };
					this.$emit('success');
				},
				complete: _=>{
					this.loading = false;
				}
			})
		}
	},
	mounted () {
		this.refresh();
	},
	watch: {
		currentRow () {
			this.refresh();
		}
	},
	components: {
		ReportView,
		ReportForm,
	},
}
</script>