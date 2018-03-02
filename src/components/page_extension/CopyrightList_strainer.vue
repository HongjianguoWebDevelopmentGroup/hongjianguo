<template>
  <app-collapse col-title="版权筛选" default-close>
    <el-form :model="form" ref="form" label-width="120px">
      

        <el-form-item label="版权类型" prop="type">
          <static-select type="copyright_type" v-model="form.type" multiple></static-select>
        </el-form-item>

      <el-row>  
        <el-col :span="12">
          <el-form-item label="提案人" prop="proposer">
            <remote-select type="member" v-model="form.proposer" multiple></remote-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="申请人" prop="applicant">
            <remote-select type="applicant" v-model="form.applicant" multiple></remote-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="代理人" prop="agent">
            <remote-select type="agent" v-model="form.agent" multiple></remote-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="代理机构" prop="agency">
            <remote-select type="agency" v-model="form.agency" multiple></remote-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="产品分类" prop="product">
            <product v-model="form.product" multiple></product>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="标签" prop="tag">
            <static-select type="tag" v-model="form.tag" multiple></static-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="申请日" prop="apd">
            <el-date-picker type="daterange" v-model="form.apd" placeholder="请选择申请日"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="公告日" prop="issue_date">
            <el-date-picker type="daterange" v-model="form.issue_date" placeholder="请选择公告日"></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row style="text-align: center;">
        <el-button type="primary" size="small" @click="search(form)">查询</el-button>
        <el-button type="danger" size="small" @click="clear($refs.form)">清空</el-button>
      </el-row>
    </el-form>
  </app-collapse>
</template>

<script>
import AppCollapse from '@/components/common/AppCollapse'
import Strainer from '@/mixins/strainer'
import Product from '@/components/form/Product'
import RemoteSelect from '@/components/form/RemoteSelect'
import StaticSelect from '@/components/form/StaticSelect'

export default {
  name: 'NoticeCommonStrainer',
  mixins: [ Strainer ],
  data () {
		return {      
		  form: {
      	type: [],
        proposer: [],
        applicant: [],
        apd: [],
        issue_date: [],
        product: [],
        agent: [],
        agency: [],
        tag: [],
      }
		}
  },
  watch: {},
  components: { 
    AppCollapse, 
    Product, 
    RemoteSelect,
    StaticSelect, 
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>