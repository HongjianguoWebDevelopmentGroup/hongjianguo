<template>
  <div class="main">
     <el-tabs type="border-card">
      <el-tab-pane>
        <span slot="label"><i class="el-icon-information"></i> 基本信息</span>
        <pa-base ref="base" :type="type" @getArea="getArea"></pa-base>
      </el-tab-pane>
      <el-tab-pane>
        <span slot="label"><i class="el-icon-date"></i> 日期&号码</span>
        <person ref="person" :type="type" :area="area"></person>
      </el-tab-pane>
      <el-tab-pane>
        <span slot="label"><i class="el-icon-menu"></i> 分类信息</span>
        <classification ref="classification" :type="type"></classification>
      </el-tab-pane>
      <el-tab-pane>
        <span slot="label"><i class="el-icon-arrow-right"></i> 代理机构</span>
        <agent ref="agent"></agent>
      </el-tab-pane>
      <el-tab-pane>
        <span slot="label"><i class="el-icon-share"></i> 相关案件</span>
        <case ref="case"></case>
      </el-tab-pane>
      <el-tab-pane>
        <span slot="label"><i class="el-icon-more"></i> 其它信息</span>
        <other ref="other" :type="type" ></other>
      </el-tab-pane>
      <el-tab-pane>
        <span slot="label"><i class="el-icon-document"></i> 任务</span>
        <task ref="task" :type="type" category="1"></task>
      </el-tab-pane>
    </el-tabs>   
<!--     <pa-base ref="base" :type="type" @getArea="getArea"></pa-base>
    <person ref="person" :type="type" :area="area"></person>
    <classification ref="classification"></classification>
    <agent ref="agent"></agent>
    <case ref="case"></case>
    <other ref="other" :type="type"></other> -->
    <div style="margin-bottom: 20px;margin-top: 20px;">
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
  ['task', '请正确填写任务信息'],
]);

const getKeys = ['base', 'person', 'classification', 'case','agent', 'other', 'task'];
const setKeys = ['base', 'person', 'classification', 'agent', 'case', 'other', 'task'];

const URL = '/patents';

import AppCollapse from '@/components/common/AppCollapse'
import PaBase from '@/components/page_extension/PatentAdd_base'
import Person from '@/components/page_extension/PatentAdd_person'
import Classification from '@/components/page_extension/PatentAdd_classification'
import Agent from '@/components/page_extension/PatentAdd_agent'
import Case from '@/components/page_extension/PatentAdd_case'
import Other from '@/components/page_extension/PatentAdd_other'
import Task from '@/components/page_extension/PatentAdd_task'
import {mapActions} from 'vuex'
export default {
  name: 'patentAdd',
  data () {
    return {
      area: '',
      id: '',
      pop_type: '',
      btn_disabled: false,
      shrink: false,
    }
  },
  props: ['pageType'],
  methods: {
    ...mapActions([
      'refreshUser',
    ]),
    getArea (val) {
      if(val) {
        this.area = val;
      }
    },
    add () {
      
      this.formCheck(_=>{
        const url = URL;
        const data = Object.assign( ...getKeys.map(_=>this.$refs[_].submitForm()) );
        const success = _=>{ 
          this.$message({message: '添加专利成功', type: 'success'});
          this.refreshUser();
          this.$router.push('/patent/list'); 
        };
        const complete = _=>{
          this.btn_disabled = false;
        }

        this.btn_disabled = true;
        this.$axiosPost({url, data, success, complete});  
      })
      
    },
    edit () {
      this.formCheck(_=>{
        const url = `${URL}/${this.id}`;
        const data = Object.assign( ...getKeys.map(d=>this.$refs[d].submitForm()) );
        const success = _=>{ 
          this.$message({message: '编辑专利成功', type: 'success'});
          this.$emit('editSuccess');
          // this.$router.push('/patent/list');
        };
        const complete = _=>{
          this.btn_disabled = false;
        }

        this.btn_disabled = true;
        this.$axiosPut({url, data, success, complete});  
      })
    },
    formCheck (callback) {
      let key = "";
      let flag = false;

      const check = (index)=>{
        const key = getKeys[index];
        if(key) {
          this.$refs[key].checkForm(_=>{
            if(_) {
              check(index+1);
            }else {
              this.$message({message: map.get(key), type: 'warning'})      
            }
          })  
        }else {
          callback();
        }
      }
      
      check(0);

    },
    cancel () {
      this.$router.push('/patent/list');
    },
    refreshForm (val) {
      if( this.type == 'edit' && this.$tool.getObjLength(val) != 0) {
        const copy = this.$tool.deepCopy(val);
        this.id = copy.id;
        setKeys.map(_=>this.$refs[_].setForm(copy));
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
    getParams () {
      const s = this.$route.query.s; 
      return s;
    },
  },
  watch: {
    'detail': {
      handler: function(val) {
        this.refreshForm(val);
      }
    },
    'getParams': {
      handler: function(val) {
        this.fillForm(val);
      }
    }, 
  },
  mounted () {
    this.refreshForm(this.detail);
    this.$nextTick(_=>{
      // if(this.getParams){
        this.fillForm(this.getParams);
      // }   
    })
  },
  components: { PaBase, Person, Classification, Agent, Case, Other, AppCollapse, Task }
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