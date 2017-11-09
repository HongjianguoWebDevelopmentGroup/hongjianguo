<template>
	<div class="main">
		<el-form :model="form" ref="form" label-width="120px" :rules="rules">
			<el-form-item label="商标名" prop="title">
				<el-input v-model="form.title"></el-input>
			</el-form-item>
				<el-form-item label="商标描述" prop="description">
			<el-input type="textarea" v-model="form.description" placeholder="请填写案件摘要" ></el-input>
			</el-form-item>
			<el-form-item label="商标类型" prop="type">
				<static-select type="type" v-model="form.type"></static-select>
			</el-form-item>
			<el-form-item label="商标类别" prop="categories">
				<static-select type="categories" v-model="form.categories"></static-select>
			</el-form-item>
			<el-form-item label="详细类别" prop="detail">
				<el-input v-model="form.detail"></el-input>
			</el-form-item>
			<el-form-item label="申请人" prop="applicants">
				<remote-select type="applicant" v-model="form.applicants" multiple></remote-select>
			</el-form-item>
			<el-form-item label="地区" prop="area">
				<static-select type="area" v-model="form.area" multiple></static-select>
			</el-form-item>
			</el-form-item>
			<el-form-item label="商标图形" prop="figure">
				<upload v-model="form.figure" :file-list="figure"></upload>
			</el-form-item>
			<el-form-item label="附件" prop="attachments">
				<upload v-model="form.attachments" :file-list="attachments"></upload>
			</el-form-item>
			<el-form-item label="备注" prop="remark">
				<el-input type="textarea" v-model="form.remark" placeholder="请填写备注"></el-input>
			</el-form-item>
			<el-form-item label="优先权" prop="priorities">
				<priorities v-model="form.priorities"></priorities>
			</el-form-item>
			<el-form-item label="申请号" prop="apn">
				<el-input v-model="form.apn" placeholder="请填写申请号"></el-input>
			</el-form-item>
			<el-form-item label="申请日" prop="apd">
				<el-date-picker type="date" v-model="form.apd" placeholder="请选择申请日"></el-date-picker>
			</el-form-item>
			<el-form-item label="初审公告日" prop="public_date">
				<el-date-picker type="date" v-model="form.public_date" placeholder="请选择初审公告日"></el-date-picker>
			</el-form-item>
			<el-form-item label="初审公告期数" prop="public_num">
				<el-input v-model="form.public_num" placeholder="请填写初审公告期数"></el-input>
			</el-form-item>
			<el-form-item label="核准注册日" prop="issue_date">
				<el-date-picker type="date" v-model="form.issue_date" placeholder="请选择核准注册日"></el-date-picker>
			</el-form-item>
			<el-form-item label="核准公告期数" prop="issue_number">
				<el-input v-model="form.issue_number" placeholder="请填写核准公告期数"></el-input>
			</el-form-item>
			<el-form-item label="专用权期数" prop="expiring_date">
				<el-date-picker type="date" v-model="form.expiring_date" placeholder="请选择专用权期数"></el-date-picker>
			</el-form-item>
			<el-form-item>
				<el-button  @click="add" v-if="type == 'add'" :disabled="btn_disabled" type="primary">添加</el-button>
				<el-button  v-if="type == 'edit'" :disable="btn_disabled" type="primary">编辑</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>
<script>
import {mapGetters} from 'vuex'
import AxiosMixins from '@/mixins/axios-mixins'

import Classification from '@/components/form/Classification'
import Product from '@/components/form/Product'
import Branch from '@/components/form/Branch'

import Upload from '@/components/form/Upload'
import RemoteSelect from '@/components/form/RemoteSelect'
import StaticSelect from '@/components/form/StaticSelect'
import Priorities  from '@/components/form/Priorities'

import {mapActions} from 'vuex'

const URL = '/api/trademarks'

export default {
	name: 'trademarkAdd',
	props: {
		'pageType': {
			type: String,
			default: 'add',
		},
	},
	mixins: [AxiosMixins],
	data () {
		return {
			form: {
				title: '',
		  		type: '',
			  	applicants: [],
			  	area: [],
			  	categories: '',
			  	detail: '',
			  	figure: [],
			  	description: '',
			  	public_date: '',
			  	public_num: '',
			  	expiring_date: '',
			  	attachments: [],
			  	remark: '',
			  	apn: '',
			  	apd: '',
			  	issue_date: '',
			  	issue_number: '',
			  	priorities: []
			},
		  rules: {
		  	title: { required: true, message: '商标名称不能为空', trigger: 'blur' },
		  	type: { type: 'number', required: true, message: '商标类型不能为空', trigger: 'change' },
		  	applicants: { type: 'array',  required: true, message: '申请人不能为空', trigger: 'blur' },
		  	area: {type: 'array',required: true, message: '地区不能为空', trigger: 'change'},
		  	detail: {required: true, message: '详细类别不能为空', trigger: 'blur'},
		  	categories: {type: 'number', required: true, message: '商标类别不能为空', trigger: 'change'}
		  },
		  attachments: [],
		  btn_disabled: false,
		  figure: [],
		}
	},
	computed: {
		...mapGetters([
			'detailBaseTrademark',
		]),
		type () {
  		return this.pageType ? this.pageType : this.$route.meta.pageType;
  	},

	},
	created () {
		console.log(this.detailBaseTrademark);
	},
	components:{ Classification, Product, Branch, Upload, RemoteSelect, StaticSelect, Priorities},
	methods:{
		add () {
  		if(this.checkForm()) return;

  		this.btn_disabled = true;
  		const url = URL;
  		const data = this.$tool.shallowCopy(this.form, {'date': true});
  		const success = _=>{ 
  			this.$message({message: '添加版权成功', type: 'success'});
  			this.refreshUser();
  			this.$router.push('/trademark/list') 
  		};
  		const complete = _=>{ this.btn_disabled = false };

  		this.axiosPost({url, data, success, complete});
  		},
  		checkForm () {
  		let flag = false;
  		this.$refs.form.validate(_=>{flag = !_});

  		if(flag) {
  			this.$message({message: '请正确填写版权字段', type: 'warning'});
  		}

  		return flag;
  	},
	}
}
</script>