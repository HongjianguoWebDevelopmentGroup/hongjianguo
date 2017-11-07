<template>
  <app-collapse col-title="商标筛选" default-close>
    <el-form :model="form" ref="form" label-width="120px">
      <el-row>
        <el-col :span="12">
        	<el-form-item label="商标名称" prop="title">
          	<el-input v-model="form.title"></el-input>
        	</el-form-item>
        </el-col>
        <el-col :span="12">
        	<el-form-item label="商标描述" prop="text1">
          	<el-input v-model="form.text1"></el-input>
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

export default {
  name: 'TrademarkStrainer',
  mixins: [ Strainer ],
  data () {
		return {      
		  form: {
      	title: '',
      	text1: '',
      }
		}
  },
  watch: {},
  components: { AppCollapse, Product, RemoteSelect },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>