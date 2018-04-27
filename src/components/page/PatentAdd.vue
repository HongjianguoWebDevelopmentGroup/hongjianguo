<template>
  <div class="main" :style="`height: ${innerHeight - 70}px`">
    <custom-form 
      label-width="120px"     
      :model="form" 
      :rules="rules" 
      ref="form"
      :post-data="postData"
      @cancel="cancel">
      
      <app-collapse col-title="基本信息">
        <el-form-item label="案号" prop="serial">
          <el-input v-model="form.serial" placeholder="请填写案号"></el-input>
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="请填写案件标题" ></el-input>
        </el-form-item>
        <el-form-item label="申请地区" prop="area" :rules="areaRules">
          <static-select type="area" v-model="form.area" :multiple="areaMultiple"></static-select>
        </el-form-item>
        <el-form-item label="专利类型" prop="type">
          <static-select type="patent_type" v-model="form.type"></static-select>
        </el-form-item>
        <el-form-item label="申请人">
          <remote-select type="applicant" v-model="form.applicants" multiple></remote-select>
        </el-form-item >
        <el-form-item label="发明人" prop="inventors">
          <inventors v-model="form.inventors" ref="inventors" @addInventor="validateInventors" @deleteInventor="validateInventors"></inventors>
        </el-form-item>
        <el-form-item label="优先权" prop="priorities">
          <priorities v-model="form.priorities"></priorities>
        </el-form-item>
        <el-form-item label="额外要求" prop="extension">
          <el-checkbox-group v-model="form.extension" v-if="extensionOptions.length != 0" id="extension">
            <el-checkbox 
              v-for="item in extensionOptions" 
              :key="item.label"
              :label="item.label"
            >{{ item.text }}</el-checkbox>
          </el-checkbox-group>
          <span v-else>暂无可选项</span>
        </el-form-item>  
        <el-form-item label="附件" prop="attachments">
            <upload action="/api/files?action=parseDisclosure" @uploadSuccess="handleUploadSuccess" v-model="form.attachments" :file-list="attachments"></upload>
        </el-form-item>       
      </app-collapse>

      <app-collapse col-title="扩展信息">
        <el-form-item label="部门" prop="branch">
          <branch v-model="form.branch" count-type="patent" ></branch>
        </el-form-item>
        <el-form-item label="IPR" prop="ipr">
          <static-select type="ipr" v-model="form.ipr"></static-select>
        </el-form-item>
        <el-form-item label="提案人" prop="proposer">
          <remote-select type="member" v-model="form.proposer"></remote-select>
        </el-form-item>
        <el-form-item label="摘要" prop="abstract">
          <el-input type="textarea" v-model="form.abstract" placeholder="请填写专利摘要" :rows="6" class="custom-textarea"></el-input>
        </el-form-item>
        <el-form-item label="公告日" prop="issue_date">
          <el-date-picker v-model="form.issue_date" type="date" placeholder="请选择公告日"></el-date-picker>
        </el-form-item>
        <el-form-item label="公告号" prop="issue_number">
          <el-input v-model="form.issue_number" placeholder="请填写公告号"></el-input>
        </el-form-item>
        <el-form-item label="申请日" prop="apd">
          <el-date-picker v-model="form.apd" type="date" placeholder="请选择申请日"></el-date-picker>
        </el-form-item>
        <el-form-item label="申请号" prop="apn">
          <el-input v-model="form.apn" placeholder="请填写申请号"></el-input>
        </el-form-item>
        <el-form-item label="公开日" prop="public_date">
          <el-date-picker v-model="form.public_date" type="date" placeholder="请选择公开日"></el-date-picker>
        </el-form-item>
        <el-form-item label="公开号" prop="public_number">
          <el-input v-model="form.public_number" placeholder="请填写公开号"></el-input>
        </el-form-item>      
        <el-form-item label="初审合格日" prop="pre_exam_ok_date">
          <el-date-picker v-model="form.pre_exam_ok_date" type="date" placeholder="请选择初审合格日"></el-date-picker>
        </el-form-item>
        <el-form-item label="进入实审日" prop="sub_exam_start_date">
          <el-date-picker v-model="form.sub_exam_start_date" type="date" placeholder="请选择实审日"></el-date-picker>
        </el-form-item>
        <el-form-item label="申请方式" prop="manner">
          <static-select type="patent_manner" v-model="form.manner"></static-select>
        </el-form-item>
        <template v-if="form.manner == 3">
          <el-form-item label="国际申请日">
            <el-date-picker v-model="form.pct_apd" type="date" placeholder="请选择国际申请日"></el-date-picker>
          </el-form-item>
          <el-form-item label="国际申请号">
            <el-input v-model="form.pct_no" placeholder="请填写国际申请号"></el-input>
          </el-form-item>
          <el-form-item label="国际优先权日">
            <el-date-picker v-model="form.pct_priority_date" type="date" placeholder="请选择国际优先权日"></el-date-picker>
          </el-form-item>
          <el-form-item label="国际公开日">
            <el-date-picker v-model="form.pct_public_date" type="date" placeholder="请选择国际国际公开日"></el-date-picker>
          </el-form-item>
          <el-form-item label="国际公开语言" prop="pct_public_language">
            <static-select type="language" v-model="form.pct_public_language"></static-select>
          </el-form-item>
          <el-form-item label="国际公开号">
            <el-input v-model="form.pct_public_no" placeholder="请填写国际公开号"></el-input>
          </el-form-item>
          <el-form-item label="复审委内编号">
            <el-input v-model="form.board_number" placeholder="请填写复审委内编号"></el-input>
          </el-form-item>
        </template>
        <el-form-item label="群组号">
          <el-input v-model="form.group_number" placeholder="请填写群组号"></el-input>
        </el-form-item>
        <el-form-item label="专利族号">
          <el-input v-model="form.family_number" placeholder="请填写专利族号"></el-input>
        </el-form-item>
        <el-form-item label="已申请资助">
          <app-switch type="is" v-model="form.is_support"></app-switch>
        </el-form-item>
      </app-collapse>

      <app-collapse col-title="提案信息">
        <el-form-item label="产品分类" prop="products">
          <product v-model="form.products" count-type="patent" multiple></product>
        </el-form-item>
        <el-form-item label="技术分类" prop="classification">
          <classification v-model="form.classification" count-type="patent"></classification>
        </el-form-item>
        <el-form-item label="标签" prop="tag">
          <static-select type="tag" v-model="form.tags" multiple></static-select>
        </el-form-item>
        <el-form-item label="项目名称" prop="project_name">
          <el-input v-model="form.project_name" placeholder="请填写项目名称"></el-input>
        </el-form-item>
        <el-form-item label="项目代号" prop="project_serial">
          <el-input v-model="form.project_serial" placeholder="请填写项目编号"></el-input>
        </el-form-item>
        <el-form-item label="主国际分类号" prop="main_ipc">
          <el-input v-model="form.main_ipc" placeholder="请填写主国际分类号"></el-input>
        </el-form-item>
      </app-collapse>

      <app-collapse col-title="委案信息">
        <el-form-item label="代理机构名称" prop="agency">
          <remote-select type="agency" v-model="form.agency"></remote-select>
        </el-form-item>
        <el-form-item label="代理机构案号" prop="agency_serial">
          <el-input v-model="form.agency_serial" placeholder="请填写代理机构案号"></el-input>
        </el-form-item>
        <el-form-item label="代理类型" prop="agency_type">
          <static-select v-model="form.agency_type" type="agency_type"></static-select>
        </el-form-item>
        <el-form-item label="代理人信息" prop="agent">
          <remote-select type="agent" v-model="form.agent" ></remote-select>
        </el-form-item>
      </app-collapse>

      <app-collapse col-title="相关案件">
        <el-form-item label="相关提案" prop="proposal">
          <remote-select type="proposal" v-model="form.proposals" multiple></remote-select>
        </el-form-item>
        <el-form-item label="相关案件" prop="relative_projects">
          <relative-projects v-model="form.relative_projects"></relative-projects>
        </el-form-item>
      </app-collapse>

      <app-collapse col-title="其他信息">
        <el-form-item label="状态" v-if="type == 'edit'">
           <static-select type="patents_status" v-model="form.progress"></static-select>
        </el-form-item>
        <el-form-item label="说明书字数" prop="words">
          <el-input v-model="form.words" placeholder="请填写说明书字数"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请填写备注信息"></el-input>
        </el-form-item>
      </app-collapse>

    </custom-form>
  </div>
</template>

<script>
import CustomForm from '@/components/common/CustomForm'
import AppCollapse from '@/components/common/AppCollapse'
import StaticSelect from '@/components/form/StaticSelect'
import RemoteSelect from '@/components/form/RemoteSelect'
import Inventors from '@/components/form/Inventors'
import Priorities from '@/components/form/Priorities'
import Upload from '@/components/form/Upload'
import Branch from '@/components/form/Branch'
import AppSwitch from '@/components/form/AppSwitch'
import Product from '@/components/form/Product'
import Classification from '@/components/form/Classification'
import RelativeProjects from '@/components/form/RelativeProjects'
import { checkInventors } from '@/const/validator.js'

import {mapGetters} from 'vuex'
import {mapActions} from 'vuex'

const extensionHash = [
  { text: '是否同时提出实审请求', label: 'is_exam_request', area: 'CN', type: [1] },
  { text: '是否请求提前公开', label: 'is_pre_public', area: '', type: [1] },
  { text: '是否保密审查', label: 'is_secure_check', area: '', type: [1,2] },
  { text: '是否同日申请了同样的实用新型/发明', label: 'is_utility', area: '', type: [1,2] },  
  { text: '是否是分案申请', label: 'is_division', area: '', type: [] },
  { text: '是否与生物相关', label: 'is_biological', area: '', type: [1] },
  { text: '是否有序列表', label: 'is_sequence', area: '', type: [1] },
  { text: '是否依赖于遗传资源', label: 'is_genetic', area: 'CN', type: [] },
  { text: '是否不丧失新颖性公开', label: 'is_leakage', area: 'CN', type: [] },
  { text: '是否要求优先权', label: 'is_priority', area: '', type: [] },
]

const URL = '/api/patents';

export default {
  name: 'patentAdd',
  props: ['pageType'],
  data () {
    return {
      id: '',
      attachments: [],
      list: [],
      form: {
        serial: '',
        title: '',
        // area: '',通过setForm方法设置(area的类型取决于type类型,而data在申明的时候无法拿到prop中的变量)
        type: '',
        applicants: [],
        inventors: [],
        priorities: [],
        extension: [], 
        attachments: [],

        branch: '',
        ipr: '',
        proposer: '',
        issue_date: '',
        issue_number: '',
        abstract: '',
        date: '',
        apn: '',
        public_date: '',
        public_number: '',
        pre_exam_ok_date: '',
        sub_exam_start_date: '',
        manner: 1,
        pct_apd: '',
        pct_no: '',
        pct_priority_date: '',
        pct_public_date: '',
        pct_public_language: '',
        pct_public_no: '',
        board_number: '',
        group_number: '',
        family_number: '',
        is_support: 0,

        products: [],
        classification: '',
        tags: [],
        main_ipc: '',
        project_name: '',
        project_serial: '',

        agency: '',
        agency_serial: '',
        agency_type: '',
        agent: [],

        proposals: [],
        relative_projects: [],

        progress: '',
        words: '',
        remark: '',
      },
      rules: {
        'title':{ required: true, message: '标题不能为空', trigger: 'blur' },
        'type': { type: 'number', required: true, message: '专利类型不能为空', trigger: 'change' },
        'inventors': {
          type: 'array',
          trigger: 'change',
          validator: (a,b,c)=>{
            this.$nextTick(_=>{
              checkInventors(a, this.form.inventors, c, false);
            })       
          },
        },
      },
    }
  },
  computed: {
    ...mapGetters([
      'innerHeight',
      'detailBasePatent',
      'patentFormCustom',
    ]),
    type () {
      return this.pageType ? this.pageType : this.$route.meta.type;
    },
    areaMultiple () {
      return this.type == 'add' ? true : false;
    },
    areaRules () {
      const type = this.type == 'add' ? 'array' : 'string';
      return { type, required: true, message: '地区不能为空', trigger: 'change' };
    },
    extensionOptions () {
      const area = this.type == 'add' ? this.form.area.join(',') : this.form.area;
      const type = this.form.type;
      const arr = [];
      extensionHash.forEach(d=>{
        const areaReg = new RegExp(d.area);
        const typeArr = d.type;
        if ( areaReg.test(area) ) {
          if(typeArr.length == 0) {
            arr.push({ text: d.text, label: d.label });
          }else {
            for (let t of typeArr) {
              if(t == type) {
                arr.push({ text: d.text, label: d.label });
                break;
              }
            }  
          }
        }
      })
      return arr;
    }
  },
  methods: {
    ...mapActions([
      'refreshUser',
    ]),
    validateInventors () {
      this.$refs.form.validateField('inventors');
    },
    postData (form) {
      if(this.type == 'add') {
        return this.add(form);
      }else if(this.type == 'edit') {
        return this.edit(form);
      }
    },
    cancel () {
      if(this.type == 'add') {
        this.$router.push('/patent/list');
      }else if(this.type == 'cancell') {
        this.$emit('editeCancell');
      }
    },
    add (form) {      
      
      const url = URL;
      const data = Object.assign( form, {list: this.list} );
      const success = _=>{ 
        this.$message({message: '添加专利成功', type: 'success'});
        this.refreshUser();
        this.$router.push('/patent/list'); 
      };

      return this.$axiosPost({url, data, success});  
            
    },
    edit (form) {

      const url = `${URL}/${this.id}`;
      const data = form;
      const success = _=>{ 
        this.$message({message: '编辑专利成功', type: 'success'});
        this.$emit('editSuccess');
      };
      
      return this.$axiosPut({url, data, success});  
      
    },
    clear () {
      this.$refs.form.resetFields();
      this.attachments = [];
      this.list = [];
    },
    //upload参数区别当前填充行为是否附件上传引起的填充
    fillForm (form, upload=false) {
      this.id = form.id ? form.id : '';
      this.$tool.coverObj(this.form, form, {
        obj: [ 'attachments', 'type', 'products', 'classification', 'branch', 'progress', 'ipr' ], 
        skip:[ 'extension', 'area' ],
      });
      if(form['extension']) {
        const arr = [];
        for(let d of form['extension']) {
          if(d['value']) arr.push(d['label']);
        }
        this.form.extension = arr;
      }
      if(upload) {
        if(this.form.inventors && this.form.inventors.length != 0) {
          //复用组件内置的方法...
          this.$refs.inventors.handleShare(this.form.inventors);
        }
        this.form.area = this.type == 'add' ? form.area.map(_=>_.id) : area[0]['id'];
      }else {
        this.attachments = form.attachments ? form.attachments : [];
        this.form.area = Array.isArray(form.area) ? form.area.map(_=>_.id) : form.area.id; 
      }
      if(this.patentFormCustom) {
        this.$refs.form.fillCustomForm(form);
      }
    },
    refreshForm () {
      if( this.type == 'edit' && this.detailBasePatent ) {
        this.fillForm(this.detailBasePatent);
      }
    },
    handleUploadSuccess (d) {
      
      if( !d.data || !d.data.list ) {
        return;
      }

      if (d.data.list.is_disclosure == 1) {

        this.list.push(d.data.list);

        getKeys.forEach(_=>{
          this.$refs[_].setForm(d.data.list, 'upload');
        });

      }else if(d.data.list.is_disclosure == 2) {
        this.$message({type: 'warning', message: '文件识别失败'});
      }
    },
    setForm () {
      const area = this.type === 'add' ? [] : '';
      this.$set(this.form, 'area', area);
    }
  },
  watch: {
    detailBasePatent () {
      this.refreshForm();
    }
  },
  created () {
    this.setForm();
    this.refreshForm();
  },
  mounted () {
  },
  components: { 
    CustomForm,
    AppCollapse,
    StaticSelect,
    RemoteSelect,
    Inventors,
    Priorities,
    Upload,
    Branch,
    AppSwitch,
    Product,
    Classification,
    RelativeProjects,
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.el-form {
  padding-top: 22px;
}
.el-form-item {
  padding: 0 15px;
}
</style>