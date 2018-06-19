<template>
	<div>
		<table-component :tableOption="tableOption" :data="detailReview" ></table-component>
		<!-- <app-pop 
			ref="form"
			:modal="false"
			:model="form" 
			:type="formType" 
			:rules="rules"
			label-width="90px" 
			title="评审" 
			:save="save">
			<el-form-item prop="review_type" label="评审类型">
				<static-select type="judge_type" v-model="form.review_type"></static-select>
			</el-form-item>
			<el-form-item prop="member_id" label="评审人">
				<remote-select type="member" v-model="form.member_id"></remote-select>
			</el-form-item>
			<el-form-item prop="content" label="评审内容">
				<el-input type="textarea" v-model="form.content"></el-input>
			</el-form-item>
		</app-pop> -->
	</div>
</template>

<script>
import TableComponent from '@/components/common/TableComponent'
import RemoteSelect from '@/components/form/RemoteSelect'
import StaticSelect from '@/components/form/StaticSelect'
import {mapGetters} from 'vuex'
import {mapActions} from 'vuex'

const url = '/api/reviews';

export default {
	name: 'commonDetailReviews',
	props: ['id'],
	data () {
		return {
			reviewId: '',
			form: {				
				review_type: '',
				member_id: '',
				content: '',
			},
			popType: '',
			loading: false,
			dialogVisible: false,
			tableOption: {
				name: 'reviewList',
				url,
				is_border: false,
				is_search: false,
				is_pagination: false,
				highlightCurrentRow: true,
        		rowClick: this.handleRowClick,
				header_btn	: [
					// { type: 'add', click: _=>{ this.popType = 'add'; this.dialogVisible = true; } },
					// { type: 'delete', callback: this.refreshDetailData },
				],
				columns: [
					{type: 'text', prop: 'review_type', label: '评审类型', render_simple: 'name'},
					{type: 'text', prop: 'reviewer', label: '评审人', render_simple: 'name'},
					{type: 'text', prop: 'create_time', label: '评审时间'},
					{type: 'text', prop: 'content', label: '评审内容'},
					// {
					// 	type: 'action',
					// 	btns: [
					// 		{type: 'edit', click: this.editPop},
					// 		{type: 'delete', click: this.handleDelete},
					// 	]
					// }
				],	
			},
			rules: {
				review_type: {type: 'number', required: true, message: '评审类型不能为空', trigger: 'change'},
				member_id: {type: 'number', required: true, message: '评审人不能为空', trigger: 'change'},
				content: {required: true, message: '评审内容不能为空', trigger: 'blur'},
			},
			formType: '',
			currentId: '',
		}
	},
	computed: {
		...mapGetters([
			'detailReview',
			'detailId',
		]),
	},
	methods: {
		...mapActions([
			'refreshDetailData',
		]),
		handleRowClick ({id, content}) {
			this.popType = 'edit';
			this.dialogVisible = true;
			this.reviewId = id;
			this.$nextTick(_=>{
				this.form.content = content;
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
				url: `${url}/${this.reviewId}`,
				data: this.$tool.shallowCopy(this.form, {date: true, skip: ['keyword']}),
				success: _=>{
					this.$message({type: 'success', message: '编辑提醒成功'});
					this.dialogVisible = false;
					this.refreshDetailData();
				},
				complete,
			})
		},
		handleDelete ({id}) {
			this.$confirm('此操作将删除当前数据, 是否继续?', '提示', {
          type: 'warning'
        }).then(() => {
      		this.$axiosDelete({
      			url: `${URL}/${id}`,
      			success: () => {
      				this.$message({type: 'success', message: '删除成功'});
      				this.refreshDetailData();
      			}
      		})
        }).catch(() => {});
		}
	},
	components: {
		TableComponent,
		StaticSelect,
	}
}
</script>