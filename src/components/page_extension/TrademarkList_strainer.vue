<template>
  <app-collapse col-title="商标筛选" default-close>
    <el-form :model="form" ref="form" label-width="120px">
      <el-row>
        <el-col :span="12">
        	<el-form-item label="商标类型" prop="type">
          	<static-select type="type" v-model="form.type"></static-select>
        	</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="申请日" >
           <el-date-picker type="date" v-model="form.apd" placeholder="请选择申请日"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
        	<el-form-item label="地区" >
          	<static-select type="area" v-model="form.area" multiple></static-select>
        	</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="初审公告日" >
           <el-date-picker type="date" v-model="form.public_date" placeholder="请选择初审公告日"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="商标类别" >
            <static-select type="categories" v-model="form.categories"></static-select>
          </el-form-item>
        </el-col>
         <el-col :span="12">
          <el-form-item label="核准注册日" >
           <el-date-picker type="date" v-model="form.issue_date" placeholder="请选择核准注册日"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="申请人" >
           <remote-select type="applicant" v-model="form.applicants" multiple></remote-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="专用权期限" >
            <el-date-picker type="date" v-model="form.expiring_date" placeholder="请选择专用权期数"></el-date-picker>
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
        public_date: '',
        issue_date: '',
        expiring_date: ''
      }
		}
  },
  watch: {},
  components: { AppCollapse, Product, RemoteSelect ,StaticSelect},
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>