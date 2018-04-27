<template>
	<div class="main" id="trademarkAdd" :style="`height: ${innerHeight - 70}px`">
		<custom-form 
			:model="form" 
			ref="form" 
			label-width="120px" 
			:rules="rules"
			:post-data="postData">
			<template>
				<el-form-item label="商标名称" prop="title">
					<el-input v-model="form.title" placeholder="请输入商标名称"></el-input>
				</el-form-item>
				<el-form-item label="商标类型" prop="type">
					<static-select type="trademark_type" v-model="form.type"></static-select>
				</el-form-item>
				<el-form-item label="商标大类" prop="categories">
					<static-select type="categories" v-model="form.categories" multiple></static-select>
				</el-form-item>
				<el-form-item label="商标小类" prop="detail">
					<el-input v-model="form.detail" type="textarea"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type=primary @click="trademarkJson" size='small'>商标分类表（参照）</el-button>
					<el-dialog title="商标分类（请选择并复制粘贴至“商标小类”文本框中）" :visible.sync='dialogVisible' :modal-append-to-body=false top='8%' >
						<div class="search" style="width: 200px;position: absolute;right: 50px;top: 15px">
								<el-input
								  placeholder="请输入关键字"
								  icon="search"
								  v-model="inputValue"
								  :on-icon-click="searchDetail"
								  @keyup.enter.native="searchDetail"
								  >
								</el-input>
						</div>
						<div class="link_drop" id="linkDrop" style="height: 90px;overflow-y: auto; border: 1px solid #ccc;padding: 10px;">
							<div class="anchor" v-for="(item,index) in classifyContent">
								<a :href="`#fl${index}`" @click="highLightColors('linkDrop','a',$event)">{{ `第${index+1}类` }}</a>
							</div>
						</div>

						<div style="height: 300px; overflow-y: auto; border: solid 1px #ccc;margin-top: 10px; padding: 10px;" id="classifyContent">
							<div class="classify_content"  v-for="(item,index) in classifyContent" :id="`fl${index}`">
								<div class="left_side">
									<div class="classify_num">
										<p>{{ item.name }}</p>
									</div>
									<div class="comment">
										<p>{{ item.description }}</p>
									</div>
								</div>
								<div class="right_side">
									<ul >
										<li v-for = "(group,index2) in item['groups']" @click="show(index,index2)">{{group.name}}</li>
									</ul>
								</div>
							</div>
						</div>

						<div class="classify_detail" style="height: 200px; overflow-y: auto; border: solid 1px #ccc; margin-top: 10px; padding: 10px;" >
							<div class="detail_click" v-if="flag">
								<div class="con_detail" v-html="detailContent"></div>
								<div class="con_description" v-html="descriptionContent" style="color: red;"></div>	
							</div>
							<div class="detail_search" v-else>
								<span v-for="item in newArr2" class="searchContent" v-html="item"></span>
							</div>
						</div>
					</el-dialog>
				</el-form-item>
				<el-form-item label="申请人" prop="applicants">
					<remote-select type="applicant" v-model="form.applicants" multiple></remote-select>
				</el-form-item>
				<el-form-item label="地区" prop="area" :rules="{ type: pageType=='add' ? 'array' : 'string',required: true, message: '地区不能为空', trigger: 'change'}">
					<static-select type="area" v-model="form.area" :multiple="pageType == 'add'"></static-select>
				</el-form-item>
				<el-form-item label="状态" prop="progress" v-if="pageType == 'edit'">
					<static-select type="trademarks_status" v-model="form.progress"></static-select>
				</el-form-item>
				<el-form-item label="代理机构" prop="agency" v-if="pageType == 'edit'">
					<remote-select v-model="form.agency" type="agency"></remote-select>
				</el-form-item>
				<el-form-item label="代理人" prop="agent" v-if="pageType == 'edit'">
					<remote-select v-model="form.agent" type="agent"></remote-select>
				</el-form-item>
			 	<el-form-item label="代理机构案号" v-if="pageType == 'edit'">
		          <el-input v-model="form.agency_serial" placeholder="请填写代理机构案号"></el-input>
				</el-form-item>			
				</el-form-item>
				<el-form-item label="商标图形" prop="figure">
					<el-upload
					  class="avatar-uploader"
					  action="/api/files"
					  :show-file-list="false"
					  :on-success="successUpload"
					  :before-upload="beforeUpload">
					  <img v-if="form.figure" :src="figure_src" alt="" class="avatar">
					  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
					</el-upload>
				</el-form-item>
				<el-form-item label="优先权" prop="priorities">
					<priorities v-model="form.priorities"></priorities>
				</el-form-item>
				<el-form-item label="申请日" prop="apd">
					<el-date-picker type="date" v-model="form.apd" placeholder="请选择申请日"></el-date-picker>
				</el-form-item>
				<el-form-item label="申请号" prop="apn">
					<el-input v-model="form.apn" placeholder="请填写申请号"></el-input>
				</el-form-item>
				<el-form-item label="初审公告日" prop="public_date">
					<el-date-picker type="date" v-model="form.public_date" placeholder="请选择初审公告日"></el-date-picker>
				</el-form-item>
				<el-form-item label="初审公告期数" prop="public_number">
					<el-input v-model="form.public_number" placeholder="请填写初审公告期数"></el-input>
				</el-form-item>
				<el-form-item label="核准注册日" prop="issue_date">
					<el-date-picker type="date" v-model="form.issue_date" placeholder="请选择核准注册日"></el-date-picker>
				</el-form-item>
				<el-form-item label="核准公告期数" prop="issue_number">
					<el-input v-model="form.issue_number" placeholder="请填写核准公告期数"></el-input>
				</el-form-item>
				<el-form-item label="专用权期限" prop="expiring_date">
					<el-date-picker type="date" v-model="form.expiring_date" placeholder="请选择专用权期限"></el-date-picker>
				</el-form-item>
				<el-form-item label="附件" prop="attachments">
					<upload v-model="form.attachments" :file-list="attachments"></upload>
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
import Priorities  from '@/components/form/Priorities'
import CustomForm from '@/components/common/CustomForm'

import {mapActions} from 'vuex'
import {mapGetters} from 'vuex'

const URL = '/trademarks'

export default {
	name: 'trademarkAdd',
	props: {
		'pageType': {
			type: String,
			default: 'add',
		},
	},
	data () {
		return {
			id: '',
			form: {
				title: '',
		  		type: '',
			  	applicants: [],
			  	area: this.pageType == 'add' ? [] : '',
			  	categories: [],
			  	detail: '',
			  	figure: '',
			  	description: '',
			  	public_date: '',
			  	public_number: '',
			  	expiring_date: '',
			  	attachments: [],
			  	remark: '',
			  	apn: '',
			  	apd: '',
			  	issue_date: '',
			  	issue_number: '',
			  	agency: '',
			  	agency_serial: '',
			  	agent: '',
			  	progress: '',
			  	priorities: [],
			},
		  rules: {
		  	title: { required: true, message: '商标名称不能为空', trigger: 'blur' },
		  	type: { type: 'number', required: true, message: '商标类型不能为空', trigger: 'change' },
		  	applicants: { type: 'array',  required: true, message: '申请人不能为空', trigger: 'blur' },
		  	detail: {required: true, message: '商标小类不能为空', trigger: 'blur'},
		  	categories: {type: 'array', required: true, message: '商标大类不能为空', trigger: 'change'}
		  },

		  attachments: [],
		  figure_src: '',

		  dialogVisible: false,
		  classifyContent: [],
		  groups:[],
		  detailContent:'',
		  descriptionContent:'',
		  inputValue:'',
		  newArr:[],
		  newArr2:[],
		  flag:false,
		}
	},
	computed: {
		...mapGetters([
			'trademarkFormCustom',
			'innerHeight',
			'detailBaseTrademark',
		]),
		type () {
  		return this.pageType ? this.pageType : this.$route.meta.pageType;
  	}
	},
	methods:{
		...mapActions([
			'refreshUser',
		]),
		highLightColors(id,tagName,event) {				//点击标签颜色高亮
			var pId = document.getElementById(id);
			var aList = pId.getElementsByTagName(tagName);
			for (var i = 0;i < aList.length; i++ ) {
				aList[i].style.color = '#000';
			}
			event.target.style.color = '#58B7FF';
		},
		show (i1,i2) {
			// console.log(this.classifyContent[i1]['groups'][i2]['description']);
			// 展示商标分类详情
			this.flag = true;
			this.highLightColors('classifyContent','li',event);
			let con_detail = this.classifyContent[i1]['groups'][i2]['detail'];
			let con_description = this.classifyContent[i1]['groups'][i2]['description'];
			if(con_detail){
			 	this.detailContent = con_detail ;
			}else{
				this.detailContent = "";
			}
			if(con_description){
			 	this.descriptionContent = con_description;
			}else{
				this.descriptionContent = "";
			}
			
		},
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
        this.$router.push('/trademark/list');
      }else if(this.type == 'cancell') {
        this.$emit('editeCancell');
      }
    },
		add (form) {
  		const url = URL;
  		const data = form;

  		const success = _=>{ 
  			this.$message({message: '新建商标成功', type: 'success'});
  			this.refreshUser();
  			this.$router.push('/trademark/list');
  		};

  		return this.$axiosPost({url, data, success});
  	},
  	edit (form) {
  		const url = `${URL}/${this.id}`;
  		const data = form;
 
  		const success = _=>{ 
  			this.$message({message: _.info, type: 'success'});
  			this.$emit('editSuccess');
  		};

  		return this.$axiosPut({url, data, success});
  	},
  	clear () {
			this.$refs.form.resetFields();
			this.attachments = [];
			this.figure_src = '';
		},
  	fillForm (form) {  			
  		this.id = form.id ? form.id : '';
      this.$tool.coverObj(this.form, form, {obj: ['area', 'type', 'categories', 'attachments', 'figure', 'progress']});
      this.attachments = form['attachments'] ? form['attachments'] : '';
      this.figure_src = form['figure'] ? form['figure']['id'] : ''; 
      if(this.trademarkFormCustom) {
        this.$refs.form.fillCustomForm(form);
      }
  	},
  	refreshForm () {
      if(this.type === 'edit' && this.detailBaseTrademark) {
        this.fillForm(this.detailBaseTrademark);
      }
  	},
  	trademarkJson () {
  		
  		this.dialogVisible = true;
  		
  		if(this.classifyContent.length == 0) {
  			const url = '/static/js/categories.json';

  			this.$axios.get(url).then(res=>{
  				this.classifyContent = res.data;
  			}).catch(_=>{});	
  		}
  
  	},
  	successUpload (p) {
  		//处理图片上传成功回调数据
  		const d = p.data;
		 	if(p.status) {	
            
		 		this.form.figure = d.file.id;	
		 		this.figure_src = d.file.viewUrl;	
	    }else {
	    	this.$message({message: p.info, type: 'warning'});
	    }
  	},
  	beforeUpload (file) {
  		const isJPG = file.type ;	//获取上传文件类型
  		if (isJPG!== 'image/jpeg' && isJPG!== 'image/png' && isJPG!== 'image/gif') {    //判断文件格式
  			this.$message.warning('上传商标图片必须是.gif,jpeg,jpg,png格式！');
  			return false;
  		}
  		return isJPG;
  	},
  	searchDetail () {
  		
  		if(!this.inputValue){
        return this.newArr = [];
  		}else{
  			this.flag = false;
  			let total = this.classifyContent;
  			this.newArr = [];
	  		for(var i=0; i < total.length; i++){    //第一次遍历全部数据
	  			let group = total[i].groups;
	  			for(var j=0; j < group.length; j++){	//第二次遍历每一类的数据
	  				if(group[j].detail.indexOf(this.inputValue) > -1){	//检索匹配字符串
	  					this.newArr.push(group[j]['detail']);		
	  				}
	  			}
	  		}
	  		this.newArr2 = [];
	  		for(var k = 0;k < this.newArr.length; k++){
	  			//用正则表达式将检索字段标红
	  			this.newArr2.push(this.newArr[k].replace(new RegExp(this.inputValue,'g'),'<span style="color:red;">'+this.inputValue+'</span>'));	
	  		}
  		}
  	},
	},
	created () {
		this.refreshForm();
	},
	watch: {
		detailBaseTrademark () {
			this.refreshForm();
		}
	},
	components:{ 
		Classification, 
		Product, 
		Branch, 
		Upload, 
		RemoteSelect, 
		StaticSelect, 
		Priorities,
		CustomForm,
	},
}
</script>
<style scoped lang="scss">
	.link_drop {
		.anchor a {
			line-height: 26px;
			color: #000;
			text-decoration: none;
			float: left;
			padding: 0 6px;
			&:hover {
				color: #58B7FF !important;
			}
		}
	}
	.classify_content {
		display: flex;
		display: -webkit-flex;
		justify-content: space-around;
		margin-top: 10px;
		padding: 5px 10px;
		border: 1px solid #e1e1e1;
		height: auto;
		.left_side {
			width: 400px;
			height: auto;
			margin-bottom: -3000px;
			padding-bottom: 3000px;
			.classify_num {
				font-size: 16px;
				font-weight: bold;
			}
			.comment {
				font-size: 14px;
			}
		}
		.right_side {
			width:600px;
			height: auto;
			margin-bottom: -3000px;
			padding-bottom: 3000px;
			ul li {
				list-style: none;
			}
		}
		.right_side li {
			cursor: pointer;
		}
		.right_side li:hover {
			color: #58B7FF !important;
		}
		.detail_search .searchContent{
			display: inline-block;
		}
	}
	
</style>
<style>

	#trademarkAdd .avatar-uploader .el-upload {
	    border: 1px dashed #d9d9d9;
	    border-radius: 6px;
	    cursor: pointer;
	    position: relative;
	    overflow: hidden;
	}
  	#trademarkAdd .avatar-uploader .el-upload:hover {
		border-color: #20a0ff;
	}
	#trademarkAdd .avatar-uploader-icon {
	    font-size: 28px;
	    color: #8c939d;
	    width: 148px;
	    height: 148px;
	    line-height: 148px;
	    text-align: center;
	}
	#trademarkAdd .avatar {
	    width: 148px;
	    height: 148px;
	    display: block;
	}
</style>