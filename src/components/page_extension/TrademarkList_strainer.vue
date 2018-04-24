<template>
  <app-collapse col-title="商标筛选" default-close>
    <el-form :model="form" ref="form" label-width="120px">
      <el-row>
        <el-col :span="12">
        	<el-form-item label="商标类型" prop="type">
          	<static-select type="type" v-model="form.type" multiple></static-select>
        	</el-form-item>
          <el-form-item label="地区" prop="area">
            <static-select type="area" v-model="form.area" multiple></static-select>
          </el-form-item>
         <el-form-item label="商标类别" prop="categories">
            <static-select type="categories" v-model="form.categories" multiple></static-select>
          </el-form-item>
           <el-form-item label="申请人" prop="applicants">
           <remote-select type="applicant" v-model="form.applicants" multiple></remote-select>
          </el-form-item>
          <el-form-item label="代理机构" prop="agency">
            <remote-select type="agency" v-model="form.agency" multiple></remote-select>
          </el-form-item>
          <el-form-item label="商标名称" prop="title">
            <el-input v-model="form.title" placeholder="请填写要搜索的商标名称"></el-input>
          </el-form-item>
        </el-col>                  
        <el-col :span="12">
          <el-form-item label="申请日" prop="apd">
            <date-strainer v-model="form.apd" ref="datePicker"></date-strainer>
           <!-- <el-date-picker type="daterange" v-model="form.apd" placeholder="请选择申请日"></el-date-picker> -->
          </el-form-item>
          <el-form-item label="初审公告日" prop="public_date">
            <date-strainer v-model="form.public_date" ref="datePicker"></date-strainer>
           <!-- <el-date-picker type="daterange" v-model="form.public_date" placeholder="请选择初审公告日"></el-date-picker> -->
          </el-form-item>
          <el-form-item label="核准注册日" prop="issue_date">
            <date-strainer v-model="form.issue_date" ref="datePicker"></date-strainer>
           <!-- <el-date-picker type="daterange" v-model="form.issue_date" placeholder="请选择核准注册日"></el-date-picker> -->
          </el-form-item>
          <el-form-item label="专用权期限" prop="expiring_date">
            <date-strainer v-model="form.expiring_date" ref="datePicker"></date-strainer>      
            <!-- <el-date-picker type="daterange" v-model="form.expiring_date" placeholder="请选择专用权期数"></el-date-picker> -->
          </el-form-item>
          <el-form-item label="驳回日期" prop="reject_date">
            <date-strainer v-model="form.reject_date" ref="datePicker"></date-strainer>            
            <!-- <el-date-picker type="daterange" v-model="form.reject_date" placeholder="请选择驳回日期"></el-date-picker> -->
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
import StaticSelect from '@/components/form/StaticSelect'
import RemoteSelect from '@/components/form/RemoteSelect'
import DateStrainer from '@/components/form/DateStrainer'

export default {
  name: 'TrademarkStrainer',
  mixins: [ Strainer ],
  data () {
		return {      
		  form: {
      	type: [],
      	area: [],
        categories: [],
        applicants: [],
        apd: '',
        title: '',
        public_date: '',
        issue_date: '',
        expiring_date: '',
        reject_date: '',
        agency: []
      }
		}
  },
  methods: {
    clear () {
      this.$refs.form.resetFields();
      this.$refs.datePicker.clearDate();
      this.$emit('input', {});
      this.$emit('refresh');      
    },
  },
  watch: {},
  components: { AppCollapse, Product, RemoteSelect ,StaticSelect, DateStrainer},
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>