<template>
  <app-collapse col-title="专利筛选" default-close @afterRender="refreshForm" ref="collapse">
  	<el-form :model="form" label-width="80px" ref="form">
  		<el-row>
				<el-col :span="12">
					<el-form-item label="当前进度" prop="progress">
						<static-select type="progress" v-model="form.progress" multiple></static-select>
					</el-form-item>
					<el-form-item label="专利类型" prop="type">
						<!-- <patent-type v-model="form.type"></patent-type> -->
						<static-select type="patent_type" v-model="form.type" multiple></static-select>
					</el-form-item>
					<el-form-item label="申请地区" prop="area">
						<!-- <region v-model="form.area"></region> -->
						<static-select type="area" v-model="form.area" multiple></static-select>
					</el-form-item>
					
					<el-form-item label="代理机构" prop="agency">
						<remote-select type="agency" v-model="form.agency" multiple></remote-select>
					</el-form-item>
					<el-form-item label="IPR" prop="ipr">
						<static-select type="ipr" v-model="form.ipr" multiple></static-select>
					</el-form-item>
					<el-form-item label="代理人" prop="agent">
						<remote-select type="agent" v-model="form.agent" multiple></remote-select>
					</el-form-item>
					<el-form-item label="提案人" prop="proposer">
						<remote-select type="member" v-model="form.proposer" multiple></remote-select>
					</el-form-item>
					<el-form-item label="申请人" prop="applicants">
						<remote-select type="applicant" v-model="form.applicants" multiple></remote-select>
					</el-form-item>
					<el-form-item label="发明人" prop="inventors">
						<remote-select type="inventor" v-model="form.inventors" multiple></remote-select>
					</el-form-item>
					<el-form-item label="专利族号" prop="family_number">
						<el-input placeholder="请输入需要搜索的专利族号" v-model="form.family_number"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="技术分类" prop="classification">
						<classification v-model="form.classification" count-type="patent" multiple></classification>
					</el-form-item>
					<el-form-item label="产品分类" prop="product">
						<product v-model="form.product" count-type="patent" multiple></product>
					</el-form-item>
					<el-form-item label="部门" prop="branch">
						<branch v-model="form.branch" count-type="patent" multiple></branch>
					</el-form-item>
					<el-form-item label="标签" prop="tags">
						<static-select type="tag" v-model="form.tags" multiple></static-select>
					</el-form-item>
					<el-form-item label="群组号" prop="group_number">
						<el-input placeholder="请输入需要搜索的群组号" v-model="form.group_number"></el-input	>
					</el-form-item>	
					<el-form-item label="项目编号" prop="project_number">
						<el-input placeholder="请输入需要搜索的项目编号" v-model="form.project_number"></el-input	>
					</el-form-item>								
					<el-form-item label="申请日" prop="apd">
						<el-date-picker type="daterange" placeholder="请选择申请日" v-model="form.apd"></el-date-picker>
					</el-form-item>
					<el-form-item label="立案日" prop="create_time">
						<el-date-picker type="daterange" placeholder="请选择立案时间" v-model="form.create_time"></el-date-picker>
					</el-form-item>
					<el-form-item label="授权日" prop="issue_date">
						<el-date-picker type="daterange" placeholder="请选择授权日" v-model="form.issue_date"></el-date-picker>
					</el-form-item>
					<el-form-item label="公开日" prop="public_date">
						<el-date-picker type="daterange" placeholder="请选择公开日" v-model="form.public_date"></el-date-picker>
					</el-form-item>			
				</el-col>
  		</el-row>
  		<el-row style="text-align: center;">
				<el-button @click="search(form)" type="primary" size="small">查询</el-button>
				<el-button @click="clear($refs.form)" type="danger" size="small">清空</el-button>
  		</el-row>
  	</el-form>
  </app-collapse>
</template>

<script>
import AppCollapse from '@/components/common/AppCollapse'
import Classification from '@/components/form/Classification'
import Product from '@/components/form/Product'
import Branch from '@/components/form/Branch'
import strainer from '@/mixins/strainer.js'

import RemoteSelect from '@/components/form/RemoteSelect'
import StaticSelect from '@/components/form/StaticSelect'
export default {
  name: 'patentListStrainer',
  props: ['value'],
  mixins: [strainer],
  data () {
		return {
			form: {
				type: '',
				area: '',
				apd: '',
				progress: [],
				create_time: [],
				agency: [],
				agent: [],
				proposer: [],
				ipr: [],
				tags: [],
				classification: [],
				product: [],
				branch: [],
				issue_date: [],
				public_date: [],
				applicants: [],
				inventors: [],
				group_number: '',
				project_number: '',
				family_number: '',
			},
			options: {
				type: [
					{label: '发明', value: 1},
					{label: '实用新型', value: 2},
					{label: '外观设计', value: 3},
				]
			}
		}
  },
  methods: {
  	refreshForm () {
  		this.$tool.coverObj(this.form, this.value);
  	}
  },
  components: { 
  	AppCollapse, 
  	Classification, 
  	Product, 
  	Branch, 
  	RemoteSelect, 
  	StaticSelect,
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
