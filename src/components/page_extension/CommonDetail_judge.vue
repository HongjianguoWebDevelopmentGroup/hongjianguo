<template>
	<div>
		<table-component :tableOption="tableOption" :data="detailJudge"></table-component>
		<el-dialog :visible.sync="dialogVisible" title="评审设置" @close="$refs.form.resetFields()" :modal="false" class="dialog-small">
			<el-form :model="form" ref="form" label-width="80px">
				<el-form-item label="评审类型" prop="review_type" v-if="popType == 'add'" :rules="{ type: 'number',  required: true, message: '评审类型不能为空', trigger: 'change' }">
					<static-select type="judge_type" v-model="form.review_type"></static-select>
				</el-form-item>
				<el-form-item label="评审内容" prop="content">
					<el-input type="textarea" placeholder="请填写评审内容" v-model="form.content"></el-input>
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

const url = '/api/review';

export default {
	name: 'commonDetailJudgeList',
	data () {
		return {
			form: {
				review_type: 4,
				content: '',
			},
			popType: '',
			loading: false,
			dialogVisible: false,
			tableOption: {
				name: 'judgeLists',
				url,
				is_border: false,
				is_search: false,
				is_pagination: false,
				highlightCurrentRow: true,
				header_btn	: [
					{ type: 'add', click: _=>{ this.popType = 'add'; this.dialogVisible = true; } },
					{ type: 'delete', callback: this.refreshDetailData },
				],
				columns: [
					{ type: 'selection' },
					{ type: 'text', prop: 'review_type', label: '评审类型' },
					{ type: 'text', prop: 'member_id', label: '评审人' },
					{ type: 'text', prop: 'review_time', label: '评审时间'},
					{ type: 'text', prop: 'content', label: '评审内容' },
				]	
			}
		}
	},
	computed: {
		...mapGetters([
			'detailJudge',
			'detailId',
		])
	},
	methods: {
		...mapActions([
			'refreshDetailData',
		]),
		save () {
			this.$refs.form.validate(_=>{
				if(_) {
					this.loading = true;
					const complete = _=>{
						this.loading = false;
					}
					if(this.popType == 'add') {
						this.add(complete);
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
					this.$message({type: 'success', message: '添加评审成功'});
					this.dialogVisible = false;
					this.refreshDetailData();
				},
				complete,
			})
		},
	},
	components: {
		TableComponent,
		StaticSelect,
	}
}
</script>