<template>
  <!-- <app-collapse col-title="基本信息"> -->
    <el-form label-width="120px" :model="form" :rules="rules" ref="form">
			<el-form-item label="标题" prop="title">
				<el-input v-model="form.title" placeholder="请填写案件标题" ></el-input>
			</el-form-item>
      <el-row>
        <el-col :span="8">
          <el-form-item label="案号" prop="serial">
            <el-input v-model="form.serial" placeholder="请填写案号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="申请地区" prop="area" :rules="{ type: type=='add' ? 'array' : 'string',required: true, message: '地区不能为空', trigger: 'change' }">
            <region 
              v-model="form.area" 
              :multiple="type == 'add'"
            ></region>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="专利类型" prop="type">
            <static-select type="patent_type" v-model="form.type"></static-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="IPR" prop="ipr" :rules="{type: 'number', required: true, message: 'IPR不能为空', trigger: 'change'}">
            <!-- <span class="form-item-text" v-if="type == 'add'">{{ user ? user.name : '暂未取得当前用户信息' }}</span> -->
            <static-select type="ipr" v-model="form.ipr"></static-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="提案人">
              <remote-select type="member" v-model="form.proposer"></remote-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="案件等级">
            <static-select type="case_level" v-model="form.level"></static-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="群组号">
              <remote-select  type="group_number" v-model="form.group_number" placeholder="请填写群组号"></remote-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="专利族号">
          <remote-select type="family_number" v-model="form.family_number" placeholder="请填写专利族号"></remote-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <!-- <el-form-item label="状态" v-if="type == 'edit'">
              <static-select type="patents_status" v-model="form.flownode"></static-select>
          </el-form-item> -->
          <el-form-item label="法律状态" v-if="type == 'edit'">
              <static-select type="legal_status" v-model="form.legal_status"></static-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="申请人">
        <remote-select type="applicant" v-model="form.applicants" multiple></remote-select>
      </el-form-item >

      <el-form-item label="发明人" prop="inventors">
        <inventors v-model="form.inventors" ref="inventors" @addInventor="$refs.form.validateField('inventors')" @deleteInventor="$refs.form.validateField('inventors')"></inventors>
      </el-form-item>
      <el-form-item label="优先权">
        <priorities v-model="form.priorities"></priorities>
      </el-form-item>
      <el-form-item label="案件标记">
        <el-checkbox-group v-model="form.extension" v-if="extensionSet.length != 0" id="extension">
          <el-checkbox 
            v-for="item in extensionSet" 
            :key="item.label"
            :label="item.label"
          >{{ item.text }}</el-checkbox>
        </el-checkbox-group>
        <span v-else>暂无可选项</span>
      </el-form-item>
      
      
      <!-- <el-form-item label="摘要">
        <el-input type="textarea" v-model="form.abstract" placeholder="请填写专利摘要" :rows="6" class="custom-textarea"></el-input>
      </el-form-item> -->
      <el-form-item label="附件" prop="attachments">
          <upload action="/api/files" :data="uploadPara" @uploadSuccess="handleUploadSuccess" v-model="form.attachments" :file-list="attachments"></upload>
      </el-form-item>   
    </el-form>
  <!-- </app-collapse> -->
</template>

<script>
import AppCollapse from '@/components/common/AppCollapse'
import Region from '@/components/form/Region'
import Proposal from '@/components/form/Proposal'
import PatentType from '@/components/form/PatentType'
import StaticSelect from '@/components/form/StaticSelect'
import RemoteSelect from '@/components/form/RemoteSelect'
import Priorities from '@/components/form/Priorities'
import Inventors from '@/components/form/Inventors'
import Upload from '@/components/form/Upload'
import {mapGetters} from 'vuex'
import { checkInventors } from '@/const/validator.js'

const extensionHash = [
  { text: '是否同时提出实审请求', label: 'is_exam_request', area: 'CN', type: 1 },
  { text: '是否请求提前公开', label: 'is_pre_public', area: '', type: 1 },
  { text: '是否保密审查', label: 'is_secure_check', area: '', type: [1,2] },
  { text: '是否同日申请了同样的实用新型/发明', label: 'is_utility', area: '', type: [1,2] },  
  { text: '是否是分案申请', label: 'is_division', area: '', type: [] },
  { text: '是否与生物相关', label: 'is_biological', area: '', type: 1 },
  { text: '是否有序列表', label: 'is_sequence', area: '', type: 1 },
  { text: '是否依赖于遗传资源', label: 'is_genetic', area: 'CN', type: [] },
  { text: '是否不丧失新颖性公开', label: 'is_leakage', area: 'CN', type: [] },
  { text: '是否要求优先权', label: 'is_priority', area: '', type: [] },
] 

export default {
  name: 'patentAddBase',
  props: ['type'],
  data () {
    return {
      form: {
        serial: '',
        title: '',
        area: this.type == 'add' ? [] : '',
        type: '',
        ipr: '',
        level: '',
        applicants: [],
        inventors: [],
        priorities: [],
        extension: [], 
        attachments: [],
        proposer:[],
        group_number:'',
        family_number:'',
        // abstract:'',
        // flownode:'',
        legal_status: '',
      },
      titleLock: false, //标题锁 当评审表被上传且标题自动填充后 不再自动填充 
      attachments: [],
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
    };
  },
  computed: {
    ...mapGetters([
      'userid',
      'userrole',
    ]),
    extensionSet () {
      const area = this.type == 'add' ? this.form.area.join(',') : this.form.area;
      const type = this.form.type;
      const arr = [];
      extensionHash.forEach(d=>{
        const areaReg = new RegExp(d.area);
        const typeArr = d.type instanceof Array ? d.type : [d.type];
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
    },
    serial () {
      return this.form.serial ? this.form.serial : '暂无案号信息';
    },
    uploadPara () {
      const obj = {};
      if(this.type == 'add') {
        obj.action = 'parseDisclosure';
      }
      return obj;
    }
  },
  methods: {
    checkForm (callback) {
      let flag = true;
      this.$refs.form.validate(_=>{
        flag = _;
        callback(flag);
      });
    },
    //setForm 的Type用于区分正常填充 或者 是文件解析后的填充
    setForm (form, upload=false, disclosureType='') {
      this.$tool.coverObj(this.form, form, {
        obj: [ 'attachments', 'area', 'type', 'ipr', 'case_level', 'legal_status','group_number', 'family_number'], 
        skip:[ 'extension', 'title' ],
      });

      if(form['title'] != undefined && !this.titleLock) {
        this.form.title = form['title'];
      }
      
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
        if(disclosureType == 2) {
          this.titleLock = true;
        }
      }else {
        this.attachments = form.attachments ? form.attachments : [];
      }      
    },    
    submitForm () {
      return this.$tool.shallowCopy(this.form, { 'date': true });
    },
    handleUploadSuccess (a, b, c) {
      this.$emit('uploadSuccess', a, b, c);
    },
    handleUploadRemove () {

    },
  },
  created () {
    this.userrole == 3 && this.userid ? this.form.ipr = this.userid : this.form.ipr = ''; 
  },
  components: { 
    AppCollapse, 
    Region, 
    Proposal, 
    PatentType, 
    StaticSelect,
    RemoteSelect,
    Priorities,
    Inventors,
    Upload, 
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
#extension .el-checkbox {
  margin-left: 0px;
  margin-right: 10px;
}
</style>