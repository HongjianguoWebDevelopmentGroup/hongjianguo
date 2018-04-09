<template>
	<div>
		<table-component :tableOption="tableOption" :data="detailReminders"></table-component>
		<el-dialog :visible.sync="dialogVisible" title="提醒设置" @close="$refs.form.resetFields()" :modal="false" class="dialog-small">
			<el-form :model="form" ref="form" label-width="80px">
				<el-form-item label="监控类型" prop="keyword" v-if="popType == 'add'" :rules="{  required: true, message: '监控类型不能为空', trigger: 'change' }">
					<static-select type="reminder" v-model="form.keyword"></static-select>
				</el-form-item>
				<el-form-item label="期限" prop="deadline" :rules="{ type: 'date', required: true, message: '期限不能为空', trigger: 'change' }">
					<el-date-picker type="date" placeholder="请选择期限" v-model="form.deadline" style="width: 100%;"></el-date-picker>
				</el-form-item>
				<el-form-item label="备注" prop="remark">
					<el-input type="textarea" placeholder="请填写备注" v-model="form.remark"></el-input>
				</el-form-item>
				<el-form-item style="margin-bottom: 0px;">
					<el-button :loading="loading" @click="save" type="primary">{{ loading ? '保存中...' : '保存' }}</el-button>
					<el-button :disabled="loading" @click="dialogVisible = false">取消</el-button>
				</el-form-item>
			</el-form>
		</el-dialog>
	</div>
</template>
<script>
import {mapGetters} from 'vuex'
import {mapActions} from 'vuex'
import TableComponent from '@/components/common/TableComponent'
import StaticSelect from '@/components/form/StaticSelect'

const url = '/api/reminders';

export default {
	name: 'commonDetailRemind',
	data () {
		return {
			reminderId: '',
			form: {
				keyword: '',
				deadline: '',
				remark: '',
			},
			popType: '',
			loading: false,
			dialogVisible: false,
			tableOption: {
				name: 'reminderList',
				url,
				is_border: false,
				is_search: false,
				is_pagination: false,
				highlightCurrentRow: true,
        		rowClick: this.handleRowClick,
				header_btn	: [
					{ type: 'add', click: _=>{ this.popType = 'add'; this.dialogVisible = true; } },
					{ type: 'delete', callback: this.refreshDetailData },
				],
				columns: [
					{ type: 'selection' },
					{ type: 'text', prop: 'keyword', label: '监控类型' },
					{ type: 'text', prop: 'deadline', label: '期限' },
					{ type: 'text', prop: 'remark', label: '备注' },
					{ type: 'text', prop: 'create_time', label: '创建时间' },
				]	
			}
		}
	},
	computed: {
		...mapGetters([
			'detailReminders',
			'detailId',
		])
	},
	methods: {
		...mapActions([
			'refreshDetailData',
		]),
		handleRowClick ({id, deadline, remark}) {
			this.popType = 'edit';
			this.dialogVisible = true;
			this.reminderId = id;
			this.$nextTick(_=>{
				this.form.deadline = new Date(deadline);
				this.form.remark = remark;
			})
		},
		save () {
			this.$refs.form.validate(_=>{
				if(_) {
					this.loading = true;
					const complete = _=>{
						this.loading = false;
					}
					if(this.popType == 'add') {
						this.add(complete);
					}else if(this.popType == 'edit') {
						this.edit(complete);
					}
				}else {
					this.$message({type: 'warning', message: '填写错误'});
				}
			})
		},
		add (complete) {
			this.$axiosPost({
				url,
				data: Object.assign({}, this.$tool.shallowCopy(this.form, {date: true}), {project_id: this.detailId}),
				success: _=>{
					this.$message({type: 'success', message: '添加提醒成功'});
					this.dialogVisible = false;
					this.refreshDetailData();
				},
				complete,
			})
		},
		edit (complete) {
			this.$axiosPut({
				url: `${url}/${this.reminderId}`,
				data: this.$tool.shallowCopy(this.form, {date: true, skip: ['keyword']}),
				success: _=>{
					this.$message({type: 'success', message: '编辑提醒成功'});
					this.dialogVisible = false;
					this.refreshDetailData();
				},
				complete,
			})
		}
	},
	components: {
		TableComponent,
		StaticSelect,
	}
}
</script>