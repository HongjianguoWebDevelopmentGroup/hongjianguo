<template>
  <div class="main">
  	<el-form :model="form" ref="form" label-width="110px" :rules="rules">
  		<!-- <app-collapse col-title="基本信息"> -->
     <el-tabs type="border-card">
      <el-tab-pane>
        <span slot="label"><i class="el-icon-information"></i> 基本信息</span>  
			<el-form-item label="案号" prop="serial">
				<el-input v-model="form.serial" placeholder="请填写案号"></el-input>
			</el-form-item>        			

			<el-form-item label="著作权名称" prop="title">
				<el-input v-model="form.title" placeholder="请填写著作权名称"></el-input>
			</el-form-item>		

			<el-form-item label="著作权类型" prop="type">
				<el-select v-model="form.type" placeholder="请选择案件类型">
					<el-option v-for="item in options.type" :key="item.value" :label="item.label" :value="item.value"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="著作权人" prop="applicants">
				<remote-select type="applicant" v-model="form.applicants"  multiple></remote-select>
			</el-form-item>	
			<el-form-item label="提案人" prop="proposer">
				<remote-select type="member" v-model="form.proposer"></remote-select>
			</el-form-item>
			<el-form-item label="IPR" prop="ipr">
				<!-- <span class="form-item-text" v-if="type == 'add'">{{ user ? user.name : '暂未读取到当前用户数据' }}</span> -->
				<static-select type="ipr" v-model="form.ipr"></static-select>
			</el-form-item>	
			<el-form-item label="状态" prop="progress">
				<static-select type="copyrights_status" v-model="form.progress"></static-select>
			</el-form-item>	
			<el-form-item label="附件" prop="attachments">
				<upload v-model="form.attachments" :file-list="attachments"></upload>
			</el-form-item>
			<el-form-item label="备注" prop="remark">
				<el-input type="textarea" v-model="form.remark" placeholder="请填写备注"></el-input>
			</el-form-item>
		</el-tab-pane>
		<el-tab-pane>
			<span slot="label"><i class="el-icon-date"></i> 日期&号码</span>
			<el-row>
        		<el-col :span="8">
        			<el-form-item label="申请日" prop="apd">
						<el-date-picker type="date" v-model="form.apd" placeholder="请选择申请日"  class="input-min-width"></el-date-picker>
					</el-form-item>
        		</el-col>
				<el-col :span="8">
					<el-form-item label="申请号" prop="apn">
						<el-input v-model="form.apn" placeholder="请填写申请号"  class="input-min-width"></el-input>
					</el-form-item>        			
        		</el-col>
        		<el-col :span="8">
					<el-form-item label="立案时间" prop="create_time">
						<el-date-picker type="date" v-model="form.create_time" placeholder="请选择申请日"  class="input-min-width"></el-date-picker>
					</el-form-item>
        		</el-col>
        	</el-row>
			<el-row>
        		<el-col :span="8">
					<el-form-item label="发证日" prop="issue_date">
						<el-date-picker type="date" v-model="form.issue_date" placeholder="请选择发证日"  class="input-min-width"></el-date-picker>
					</el-form-item>
        		</el-col>
        		<el-col :span="8">
					<el-form-item label="证书号" prop="issue_number">
						<el-input v-model="form.issue_number" placeholder="请填写证书号"  class="input-min-width"></el-input>
					</el-form-item>
        		</el-col>
        		
        	</el-row>	
		</el-tab-pane>
		<!-- </app-collapse> -->
		<!-- <app-collapse col-title=""> -->
		 <el-tab-pane>
        	<span slot="label"><i class="el-icon-menu"></i> 著作权信息</span>  
			<el-col :span="8">
				<el-form-item label="版本号" prop="version">
					<el-input v-model="form.version" placeholder="请填写版本号"  class="input-min-width"></el-input>
				</el-form-item>			
			</el-col>
			<el-col :span="8">
				<el-form-item label="分类号" prop="main_ipc">
					<el-input v-model="form.main_ipc" placeholder="请填写分类号"  class="input-min-width"></el-input>
				</el-form-item>       			
			</el-col>
			<el-form-item label="原创类型" prop="original_flag">
				<el-select v-model="form.original_flag" placeholder="请选择原创类型">
					<el-option v-for="(item, index) in options.original_flag" :key="index" :label="item.name" :value="item.id"></el-option>
				</el-select>
			</el-form-item>	
			<template v-if="form.original_flag==2">
				<el-form-item label="经原权利人授权" prop="is_authorized">
					<el-switch v-model="form.is_authorized" on-color="#13ce66" off-color="#ff4949" on-text="是" off-text="否"></el-switch>
				</el-form-item>
				<el-form-item label="原有软件已经登记" prop="is_original_registered">
					<el-switch v-model="form.is_original_registered" on-color="#13ce66" off-color="#ff4949" on-text="是" off-text="否"></el-switch>
				</el-form-item>
			</template>
			<template v-if="form.is_original_registered==1">
				<el-form-item label="原登记号" prop="original_register_number">
					<el-input v-model="form.original_register_number" placeholder="请填写原登记号"></el-input>
				</el-form-item>
			</template>
			<template v-if="form.original_flag==2">
				<el-form-item label="修改软件作品说明" prop="modification_introduction">
					<el-input v-model="form.modification_introduction" type="textarea" placeholder="请填写修改软件作品说明"></el-input>
				</el-form-item>
			</template>
			<el-form-item label="开发完成日期" prop="develop_date">
				<el-date-picker type="date" v-model="form.develop_date" placeholder="请选择开发完成日期"></el-date-picker>
			</el-form-item>
			<el-form-item label="是否发表" prop="is_published">
				<el-switch v-model="form.is_published" on-color="#13ce66" off-color="#ff4949" on-text="是" off-text="否"></el-switch>
			</el-form-item>		
			<el-form-item label="首次发表日期" prop="publish_date">
				<el-date-picker type="date" v-model="form.publish_date" placeholder="请选择首次发表日期"></el-date-picker>
			</el-form-item>	
			<el-form-item label="开发方式" prop="develop_mode">
				<el-select v-model="form.develop_mode" placeholder="请选择开发方式">
					<el-option v-for="(item,index) in options.develop_mode" :key="index" :label="item.name" :value="item.id"></el-option>
				</el-select>
			</el-form-item>	
			<el-form-item label="权利取得方式" prop="right_acquisition_method">
			<el-select v-model="form.right_acquisition_method" placeholder="请选择权利范围">
				<el-option v-for="(item,index) in options.right_acquisition_method" :key="index" :label="item.name" :value="item.id"></el-option>
			</el-select>
			</el-form-item>
					<template v-if="form.is_original_registered==1">
			<el-form-item label="原登记做过变更或补充" prop="is_original_registration_changed">
				<el-switch v-model="form.is_original_registration_changed" on-color="#13ce66" off-color="#ff4949" on-text="是" off-text="否"></el-switch>
			</el-form-item>
			</template>
			<template v-if="form.is_original_registration_changed==1">	
				<el-form-item label="变更或补充证明编号" prop="registration_change_evidence">
					<el-input v-model="form.registration_change_evidence" placeholder="请填写变更或补充证明编号"></el-input>
				</el-form-item>
			</template>
			<el-form-item label="权利范围" prop="right_scope">
				<el-select v-model="form.right_scope" placeholder="请选择权利范围">
					<el-option v-for="(item,index) in options.right_scope" :key="index" :label="item.name" :value="item.id"></el-option>
				</el-select>
			</el-form-item>
			<template v-if="form.right_scope==2">
				<el-form-item label="">
			        <el-checkbox-group v-model="form.right_checkbox">
			          <el-checkbox 
			            v-for="(item,index) in rightSet" 
			            :key="index"
			            :label="item.label"
			          >{{ item.text }}</el-checkbox>
			        </el-checkbox-group>
		      	</el-form-item>
	      	</template>
			<el-form-item label="软件鉴别材料" prop="deposition_material">
				<el-select v-model="form.deposition_material" placeholder="请选择软件鉴别材料">
					<el-option v-for="(item,index) in options.deposition_material" :key="index" :label="item.name" :value="item.id"></el-option>
				</el-select>
			</el-form-item>
			<template v-if="form.deposition_material==1">
				<el-form-item label="文档种类" prop="numbers_of_document">
					<el-select v-model="form.numbers_of_document" placeholder="请选择文档种类">
						<el-option v-for="(item,index) in options.numbers_of_document" :key="index" :label="item.name" :value="item.id"></el-option>
					</el-select>
				</el-form-item>
			</template>
			<template v-if="form.deposition_material==2">
			<el-form-item label="交存方式" prop="deposition_manner">
				<el-select v-model="form.deposition_manner" placeholder="请选择交存方式">
					<el-option v-for="(item,index) in options.deposition_manner" :key="index" :label="item.name" :value="item.id"></el-option>
				</el-select>
			</el-form-item>
			</template>
		</el-tab-pane>
		<!-- </app-collapse>	 -->
		<!-- <app-collapse col-title="软件功能和技术特点"> -->
		<el-tab-pane>
        	<span slot="label"><i class="el-icon-setting"></i> 软件功能和技术特点</span>  
			<el-form-item label="硬件环境" prop="hardware_environment">
				<el-input type="textarea" v-model="form.hardware_environment" placeholder="请填写硬件环境"></el-input>
			</el-form-item>
			<el-form-item  label="软件环境" prop="software_environment">
				<el-input type="textarea" v-model="form.software_environment" placeholder="请填写软件环境"></el-input>
			</el-form-item>
			<el-form-item  label="编程语言" prop="program_language ">
				<el-input  v-model="form.program_language" placeholder="请填写编程语言"></el-input>
			</el-form-item>
			<el-form-item  label="源程序量" prop="source_lines">
				<el-input  v-model="form.source_lines" placeholder="请填写源程序量"></el-input>
			</el-form-item>
			<el-form-item label="案件摘要" prop="abstract">
				<el-input type="textarea" v-model="form.abstract" placeholder="请填写案件摘要" ></el-input>
			</el-form-item>
		<!-- </app-collapse> -->
		</el-tab-pane>
		<!-- <app-collapse col-title="详细信息"> -->
		<el-tab-pane>
        	<span slot="label"><i class="el-icon-menu"></i> 分类信息</span>  		
			<el-form-item label="部门" prop="branch">
				<branch v-model="form.branch"></branch>
			</el-form-item>	
			<el-form-item label="技术分类" prop="classification">
				<classification v-model="form.classification"></classification>
			</el-form-item>
			<el-form-item label="产品分类" prop="products">
				<product v-model="form.products" multiple></product>
			</el-form-item>
			<el-form-item label="标签" prop="tags">
				<static-select type="tag" v-model="form.tags" multiple></static-select>
			</el-form-item>
		<!-- </app-collapse> -->
		</el-tab-pane>
		<el-tab-pane>
			<span slot="label"><i class="el-icon-share"></i> 委案信息</span>  
			<el-form-item label="代理机构名称">
			<remote-select type="agency" v-model="form.agency"></remote-select>
			</el-form-item>
			<el-form-item label="事务所案号">
				<el-input v-model="form.agency_serial" placeholder="请填写事务所案号"></el-input>
			</el-form-item>
		</el-tab-pane>
		<el-tab-pane v-if="pageType == 'add'">
			<span slot="label"><i class="el-icon-document"></i> 任务</span>  
			<task :type="type" ref="task" category="3"></task>
		</el-tab-pane>
	</el-tabs>
  	</el-form>
  	<div style="margin-top: 20px;">
  		<el-button @click="add" v-if="type == 'add'" :disabled="btn_disabled" type="primary" >添加</el-button>
			<!-- <el-button @click="edit" v-if="type == 'edit'" :disable="btn_disabled" type="primary">编辑</el-button> -->
  	</div>
  </div>
</template>

<script>
import Classification from '@/components/form/Classification'
import Product from '@/components/form/Product'
import Branch from '@/components/form/Branch'

import Upload from '@/components/form/Upload'
import Task from '@/components/page_extension/PatentAdd_task'
import RemoteSelect from '@/components/form/RemoteSelect'
import StaticSelect from '@/components/form/StaticSelect'
import AppCollapse from '@/components/common/AppCollapse'

import {mapActions} from 'vuex'
const rightHash = [
  { text: '发表权', label: 'is_publication_right',},
  { text: '署名权', label: 'is_sign_right', },
  { text: '修改权', label: 'is_modification_right',},
  { text: '复制权', label: 'is_copy_right', },  
  { text: '发行权', label: 'is_distribution_right',},
  { text: '出租权', label: 'is_rent_right',},
  { text: '信息网络传播权', label: 'is_network_distribution_right',},
  { text: '翻译权', label: 'is_translate_right',},
  { text: '应当由著权权人享有的其他权利', label: 'is_other_right',},
] 
const URL = '/copyrights'

export default {
  name: 'copyrightAdd',
  props: ['pageType'],
  data () {
		return {
		  id: '',
		  form: {
		  	serial: '',
		  	title: '',
		  	abstract: '',
		  	type: 1,
		  	classification: '',
		  	products: [],
		  	tags: [],
		  	ipr: '',
		  	agency: '',
		  	agency_serial: '',
		  	proposer: '',
		  	progress: '',
		  	branch: '',
		  	applicants: [],
		  	attachments: [],
		  	remark: '',
		  	apn: '',
		  	apd: '',
		  	create_time: '',
		  	issue_date: '',
		  	issue_number: '',
		  	version: '',
		  	main_ipc: '',
		  	original_flag: '',
		  	is_authorized: false,
		  	is_original_registered: false,
		  	original_register_number: '',
		  	modification_introduction: '',
		  	develop_date: '',
		  	is_published: false,
		  	publish_date: '',
		  	published_location: '',
		  	develop_mode: '',
		  	right_acquisition_method: '',
		  	is_original_registration_changed: false,
		  	registration_change_evidence: '',
		  	right_scope: '',
		  	right_checkbox: [],
		  	deposition_material: '',
		  	deposition_manner: '',
		  	hardware_environment: '',
		  	software_environment: '',
		  	program_language: '',
		  	source_lines: '',
		  },
		  options: {
		  	type: [
		  		{label: '计算机软件著作权', value: 1},
		  		{label: '文字作品著作权', value: 2},
		  		{label: '美术作品著作权', value: 3},
		  		{label: '影视作品著作权', value: 4},
		  	],
		  	original_flag: [
		  		{name: '原创', id: 1},
		  		{name: '修改', id: 2},
		  	],
		  	develop_mode: [
		  		{name: '独立开发', id: 1},
		  		{name: '合作开发', id: 2},
		  		{name: '委托开发', id: 3},
		  		{name: '下达任务开发', id: 4},
		  	],
		  	right_acquisition_method: [
		  		{name: '原始取得',id: 1},
		  		{name: '继受取得',id: 2},
		  	],
		  	right_scope: [
		  		{name: '全部',id: 1},
		  		{name: '部分',id: 2},
		  	],
		  	deposition_material: [
		  		{name: '一般交存',id: 1},
		  		{name: '例外交存',id: 2},
		  	],
		  	numbers_of_document: [
		  		{name: '一种文档',id: 1},
		  		{name: '二种文档',id: 2},
		  		{name: '三种文档',id: 3},
		  		{name: '四种文档',id: 4},
		  		{name: '五种文档',id: 5},
		  		{name: '六种文档',id: 6},
		  		{name: '七种文档',id: 7},
		  		{name: '八种文档',id: 8},
		  		{name: '九种文档',id: 9},
		  		{name: '十种文档',id: 10},
		  	],
		  	deposition_manner: [
		  		{name: '使用黑色宽斜线覆盖',id: 1},
		  		{name: '前10页和任选连续的50页',id: 2},
		  		{name: '目前程序的连续前、后各30页和源程序任选连续的20页',id: 3},
		  	],
		  },
		  rules: {
		  	title: { required: true, message: '版权名称不能为空', trigger: 'blur' },
		  	type: { type: 'number', required: true, message: '著作权不能为空', trigger: 'change' },
		  },
		  attachments: [],
		  btn_disabled: false,
		}
  },
  computed: {
  	type () {
  		return this.pageType ? this.pageType : this.$route.meta.pageType;
  	},
  	detail () {
      return this.$store.getters.detailBaseCopyright;
    },
    user () {
    	return this.$store.getters.getUser;
    },
    rightSet () {
    	const arr = [];
    	rightHash.forEach((v,k,d)=>{
    		arr[k] = d[k];	
    	});
    	return arr;
    }
  },
  methods: {
  	...mapActions([
  		'refreshUser',
  	]),
  	add () {
  		if(this.checkForm()) return;

  		this.btn_disabled = true;
  		const url = URL;
		const td = typeof(this.$refs.task) != 'undefined' ? this.$refs.task.submitForm() : {};
		const data = Object.assign({},this.$tool.shallowCopy(this.form, {'date': true}),td);
  		data.ipr = this.user ? this.user.id : '';
  		const success = _=>{ 
  			this.$message({message: '添加版权成功', type: 'success'});
  			this.refreshUser();
  			this.$router.push('/copyright/list') 
  		};
  		const complete = _=>{ this.btn_disabled = false };

  		this.$axiosPost({url, data, success, complete});
  	},
  	edit () {
  		if(this.checkForm()) return;

  		this.btn_disabled = true;
  		const url = `${URL}/${this.id}`;
  		const data = this.$tool.shallowCopy(this.form, {'date': true});
  		const success = _=>{ 
  			this.$message({message: '编辑成功', type: 'success'});
  			this.$emit('editSuccess'); 
  		};
  		const complete = _=>{ this.btn_disabled = false };

  		this.$axiosPut({url, data, success, complete})
  	},
  	checkForm () {
  		let flag = false;
  		this.$refs.form.validate(_=>{flag = !_});

  		if(flag) {
  			this.$message({message: '请正确填写版权字段', type: 'warning'});
  		}

  		return flag;
  	},
  	refreshForm () {
  		const data = this.detail;
  		console.log(data);
  		if(this.type == 'edit' && this.$tool.getObjLength(data) != 0) {
  			
  			this.id = data.id;
  			for(let k in this.form) {
  				const d = data[k];
  				if( typeof d === 'object'){
	  				if(k == 'classification' || k == 'branch' || k == 'type' || k == 'progress' || k == 'original_flag' || k == 'develop_mode' || k=='right_acquisition_method' || k == 'right_scope' || k == 'deposition_material' || k == 'numbers_of_document' || k == 'deposition_manner' || k=="ipr" ) {
	  					this.form[k] = d.id;
	  				}else if(k == 'attachments' || k == 'products' ) {
	  					this.form[k] = d.map(_=>_.id);
	  					if(k == 'attachments') {this.attachments = d};
	  				}else if (k == 'applicants') {
	  					this.form[k] = d.map(_=>{return {id:_.id,name:_.name}});
	  				}
	  				if(k == 'right_checkbox' ||  k == 'proposer' || k == 'tags' || k == 'agency') {
	  					this.form[k] = d;
	  				}
	  			}else {
	  					this.form[k] = d;
				}
  			}
  		}
  	}
  },
  created () {
  	this.refreshForm();
  },
  watch: {
  	detail () {
  		this.refreshForm();
  	}
  },
  components: { Classification, Product, Branch, Upload, RemoteSelect, StaticSelect, AppCollapse ,Task}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>