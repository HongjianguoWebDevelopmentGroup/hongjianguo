<template>
  <div class="main">
    
    <pa-base ref="base" :type="type" @uploadSuccess="handleUploadSuccess"></pa-base>
    <person ref="person" :type="type"></person>
    <classification ref="classification"></classification>
    <agent ref="agent"></agent>
    <case ref="case"></case>
    <other ref="other" :type="type" ></other>
    <div style="margin-bottom: 20px;">
      <el-button @click="add" type="primary" v-if="type == 'add'" :disabled="btn_disabled">添加</el-button>
      <!-- <el-button @click="edit" type="primary" v-if="type == 'edit'" :disabled="btn_disabled">编辑</el-button> -->
      <el-button @click="cancel" v-if="!shrink" :disabled="btn_disabled">取消</el-button>
    </div>

  </div>
</template>

<script>
const map = new Map([
  ['base', '请正确填写基本信息！'],
  ['person', '请正确填写扩展信息！'],
  ['classification', '请正确填写分类信息'],
  ['case', '请正确填写相关案件信息'],
  ['other', '请正确填写其他信息及附件'],
]);

const getKeys = ['base', 'person', 'classification', 'case', 'other'];
const setKeys = ['base', 'person', 'classification', 'agent', 'case', 'other'];

const URL = '/api/patents';

import AxiosMixins from '@/mixins/axios-mixins'
import AppCollapse from '@/components/common/AppCollapse'
import PaBase from '@/components/page_extension/PatentAdd_base'
import Person from '@/components/page_extension/PatentAdd_person'
import Classification from '@/components/page_extension/PatentAdd_classification'
import Agent from '@/components/page_extension/PatentAdd_agent'
import Case from '@/components/page_extension/PatentAdd_case'
import Other from '@/components/page_extension/PatentAdd_other'
import {mapActions} from 'vuex'
export default {
  name: 'patentAdd',
  props: ['pageType'],
  data () {
    return {
      id: '',
      pop_type: '',
      btn_disabled: false,
      shrink: false,
      list: [],

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
      

      this.formCheck(_=>{
        const url = URL;
        const data = Object.assign( ...getKeys.map(_=>this.$refs[_].submitForm()), {list: this.list} );
        const success = _=>{ 
          this.$message({message: '添加专利成功', type: 'success'});
          this.refreshUser();
          this.$router.push('/patent/list'); 
        };
        const complete = _=>{
          this.btn_disabled = false;
        }


      return this.$axiosPost({url, data, success});  
      })   
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
    },
    refreshForm () {
      if( this.type == 'edit' && this.detailBasePatent ) {
        this.fillForm(this.detailBasePatent);
      }
    },
    fillForm (val) {
      if(val instanceof Array && val.length != 0){
        const copy = this.$tool.deepCopy(val);
        // this.id = copy[0].id;
        const relative_projects = [];
        val.map(_=>{
          relative_projects.push({id: _.id, name: _.title, type: 1});
        })
        const form = {};  
        Object.assign(form, copy[0], {relative_projects} );
        setKeys.map(_=>{
          if(this.$refs[_]) {

            this.$refs[_].setForm(form);
          }
        })
      }
    },
    proposalFill (v) {
      if(v instanceof Array && v.length != 0){
        const copy = this.$tool.deepCopy(v);
        const proposals = [];
        v.map(_=>{
          proposals.push({id:_.id,name:_.title});
        });
        const form = {};
        Object.assign(form, copy[0],{proposals});
        setKeys.map(_=>{
          if(this.$refs[_]){
            this.$refs[_].setForm(form);
          }
        })
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
      
    }
  },
  computed: {
    detail () {
      return this.$store.getters.detailBase;
    },
    type () {
      if(this.pageType) {
        this.shrink = true;
        return this.pageType;
      }else {
        this.shrink = false;
        return this.$route.meta.type;
      }
    },
    getQuery () {
      const s = this.$route.query.s; 
      return s;
    },
    getParams () {
      const d = this.$route.params.dataobj;
      return d;
    },
  },
  watch: {
    'detail': {
      handler: function(val) {
        this.refreshForm(val);
      }
    }, 
    'getQuery': {
      handler: function(val) {
        this.fillForm(val);
      }
    },
    'getParams': {
      handler: function(val) {
        this.proposalFill(val);
      }
    }, 
  },
  mounted () {
    this.refreshForm(this.detail);
    this.$nextTick(_=>{
        this.fillForm(this.getQuery);
    });
    this.$nextTick(_=>{
      this.proposalFill(this.getParams);
    })
  },
 components: { PaBase, Person, Classification, Agent, Case, Other, AppCollapse }
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