<template>
  <div class="main" :style="`height: ${innerHeight - 70}px`">
  	<custom-form 
  		:extend="extend" 
  		:model="form" 
  		label-width="100px"
  		:rules="rules"
  		:postData="postData"
      ref="form"
  	>
  		<template>
	  		<el-form-item label="案件名称" prop="title">
					<el-input v-model="form.title" placeholder="请填写案件名称"></el-input>
				</el-form-item>
				<el-form-item label="案件摘要" prop="abstract">
					<el-input type="textarea" v-model="form.abstract" placeholder="请填写案件摘要" ></el-input>
				</el-form-item>
				<el-form-item label="著作权类型" prop="type">
					<static-select type="copyright_type" v-model="form.type"></static-select>
				</el-form-item>
				<el-form-item label="技术分类" prop="classification">
					<classification v-model="form.classification" count-type="copyright"></classification>
				</el-form-item>
				<el-form-item label="产品分类" prop="products">
					<product v-model="form.products" count-type="copyright" multiple></product>
				</el-form-item>
				<el-form-item label="标签" prop="tags">
					<static-select type="tag" v-model="form.tags" multiple></static-select>
				</el-form-item>
				<el-form-item label="IPR" prop="ipr">
					<static-select type="ipr" v-model="form.ipr"></static-select>
				</el-form-item>
				<el-form-item label="提案人" prop="proposer">
					<remote-select type="member" v-model="form.proposer"></remote-select>
				</el-form-item>
				<el-form-item label="部门分类" prop="branch">
					<branch v-model="form.branch" count-type="copyright"></branch>
				</el-form-item>
				<el-form-item label="代理机构" prop="agency" v-if="type == 'edit'">
					<remote-select v-model="form.agency" type="agency"></remote-select>
				</el-form-item>
				<el-form-item label="代理人" prop="agent" v-if="type == 'edit'">
					<remote-select v-model="form.agent" type="agent"></remote-select>
				</el-form-item>
			 	<el-form-item label="代理机构案号" v-if="type == 'edit'">
		      <el-input v-model="form.agency_serial" placeholder="请填写代理机构案号"></el-input>
				</el-form-item>
				<el-form-item label="申请人" prop="applicants">
					<remote-select type="applicant" v-model="form.applicants" multiple></remote-select>
				</el-form-item>
        <el-form-item label="附件" prop="attachments">
          <upload v-model="form.attachments" :file-list="attachments"></upload>
        </el-form-item>
				<el-form-item label="状态" prop="progress" v-if="type == 'edit'">
					<static-select type="copyrights_status" v-model="form.progress"></static-select>
				</el-form-item>		
        <el-form-item label="申请号" prop="apn">
          <el-input v-model="form.apn" placeholder="请填写申请号"></el-input>
        </el-form-item>
        <el-form-item label="申请日" prop="apd">
          <el-date-picker type="date" v-model="form.apd" placeholder="请选择申请日"></el-date-picker>
        </el-form-item>
        <el-form-item label="发证日" prop="issue_date">
          <el-date-picker type="date" v-model="form.issue_date" placeholder="请选择发证日"></el-date-picker>
        </el-form-item>
        <el-form-item label="证书号" prop="issue_number">
          <el-input v-model="form.issue_number" placeholder="请填写证书号"></el-input>
        </el-form-item>
				<el-form-item label="备注" prop="remark">
					<el-input type="textarea" v-model="form.remark" placeholder="请填写备注"></el-input>
				</el-form-item>
  		</template>
  	</custom-form>
  </div>
</template>

<script>
import Classification from '@/components/form/Classification'
import Product from '@/components/form/Product'
import Branch from '@/components/form/Branch'

import Upload from '@/components/form/Upload'
import RemoteSelect from '@/components/form/RemoteSelect'
import StaticSelect from '@/components/form/StaticSelect'
import CustomForm from '@/components/common/CustomForm'

import {mapActions} from 'vuex'
import {mapGetters} from 'vuex'

const URL = '/api/copyrights'

export default {
  name: 'copyrightAdd',
  props: ['pageType'],
  data () {
		return {
		  id: '',
		  form: {
		  	title: '',
		  	abstract: '',
		  	type: 1,
		  	classification: '',
		  	products: [],
		  	tags: [],
		  	ipr: '',
		  	proposer: '',
		  	progress: '',		  	
		  	branch: '',
		  	applicants: [],
		  	attachments: [],
		  	remark: '',
		  	apn: '',
		  	apd: '',
		  	issue_date: '',
		  	issue_number: '',
		  	agency: '',
		  	agent: '',
		  	agency_serial: '',
		  },
		  rules: {
		  	title: { required: true, message: '版权名称不能为空', trigger: 'blur' },
		  	ipr: {type: 'number', required: true, message: 'IPR不能为空', trigger: 'change'},
		  	type: { type: 'number', required: true, message: '著作权不能为空', trigger: 'change' },
		  },
      extend: null,
		  // extend: {
		  // 	'': [
	  	// 		{'label': '自定义INPUT', 'prop': 'title_custom1', 'validate': 'require', 'type': 1, placeholder: '自定义'},
	  	// 		{'label': '自定义选项', 'prop': 'title_custom2', 'validate': 'require', 'type': 2, placeholder: '自定义', options: [{id: 'aaa', name: '选项一'}, {id: 'bbb', name: '选项二'}]},
	  	// 		{'label': '自定义日期', 'prop': 'title_custom3', 'validate': 'require', 'type': 3, placeholder: '自定义'},
	  	// 		{'label': '自定义TEXTAREA', 'prop': 'title_custom4', 'validate': 'require', 'type': 4, placeholder: '自定义'},
	  	// 		{'label': '自定义开关', 'prop': 'title_custom5', 'validate': 'require', 'type': 5, placeholder: '自定义'},
  		// 	],
  		// 	'自定义': [
  		// 		{'label': '自定义开关', 'prop': 'title_custom6', 'validate': 'require', 'type': 5, placeholder: '自定义'},
  		// 	]
  		// },
			attachments: [],
		};
  },
  computed: {
  	...mapGetters([
  		'innerHeight',
  		'detailBaseCopyright',
      'copyrightFormCustom',
  	]),
  	type () {
  		return this.pageType ? this.pageType : this.$route.meta.pageType;
  	}
  },
  methods: {
  	...mapActions([
  		'refreshUser',
  	]),
  	postData (form) {
  		if(this.type == 'add') {
  			return this.add(form);
  		}

  		if(this.type == 'edit') {
  			return this.edit(form);
  		}

  	},
    cancel () {
      if(this.type == 'add') {
        this.$router.push('/copyright/list');
      }else if(this.type == 'cancell') {
        this.$emit('editeCancell');
      }
    }, 	
  	add (form) {
  		const url = URL;
  		const data = form;

  		const success = _=>{ 
  			this.$message({message: '添加版权成功', type: 'success'});
  			this.refreshUser();
  			this.$router.push('/copyright/list');
  		};

  		return this.$axiosPost({url, data, success});
  	},
  	edit (form) {  		
  		const url = `${URL}/${this.id}`;
  		const data = form;
  		const success = _=>{ 
  			this.$message({message: '编辑成功', type: 'success'});
  			this.$emit('editSuccess'); 
  		};

  		return this.$axiosPut({url, data, success})
  	},
    clear () {
      this.$refs.form.resetFields();
      this.attachments = [];
    },
  	fillForm (form) {  			
  		this.id = form.id ? form.id : '';
      this.$tool.coverObj(this.form, form, {obj: ['classification', 'branch', 'type', 'attachments', 'products', 'ipr', 'progress']});
      this.attachments = form['attachments'] ? form['attachments'] : [];
      if(this.copyrightFormCustom) {
        this.$refs.form.fillCustomForm(form);
      }
  	},
    refreshForm () {
      if(this.type === 'edit' && this.detailBaseCopyright) {
        this.fillForm(this.detailBaseCopyright);
      }
    }
  },
  created () {
  	this.refreshForm();
  },
  watch: {
  	detailBaseCopyright () {
  		this.refreshForm();
  	}
  },
  components: { 
  	Classification, 
  	Product, 
  	Branch, 
  	Upload, 
  	RemoteSelect, 
  	StaticSelect,
  	CustomForm, 
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>