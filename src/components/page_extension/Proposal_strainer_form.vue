<template>
<el-form ref="form" :model="form" label-width="80px" label-position="right">
  <el-row>
    <el-col :span="12">
      <el-form-item label="提案标题" prop="title">
        <el-input v-model="form.title" placeholder="请输入需要搜索的提案标题"></el-input>
      </el-form-item>
      <el-form-item label="技术分类" prop="classification">
        <classification v-model="form.classification" count-type="proposal" multiple></classification>
      </el-form-item>
      <el-form-item label="产品分类" prop="product">
        <product v-model="form.product" count-type="proposal" multiple></product>
      </el-form-item>
      <el-form-item label="部门" prop="branch">
        <branch v-model="form.branch" count-type="proposal" multiple></branch>
      </el-form-item>
      <el-form-item label="IPR" prop="ipr">
        <static-select type="ipr" v-model="form.ipr" multiple></static-select>
      </el-form-item>
    </el-col>
    <el-col :span="12">
      <el-form-item label="发明人" prop="inventors">
        <remote-select type="inventor" v-model="form.inventors" multiple></remote-select>
      </el-form-item>
      <el-form-item label="提案人" prop="proposer">
        <remote-select type="member" v-model="form.proposer" multiple></remote-select>
      </el-form-item>
      <el-form-item label="标签" prop="tags">
        <static-select type="tag" v-model="form.tags" multiple></static-select>
      </el-form-item>
      <el-form-item label="提案时间" prop="create_time" >
        <el-date-picker type="daterange" style="width: 100%;" placeholder="请选择提案时间" v-model="form.create_time"></el-date-picker>
      </el-form-item>
    </el-col>
  </el-row>
</el-form>
</template>

<script>
import Classification from '@/components/form/Classification'
import Product from '@/components/form/Product'
import Branch from '@/components/form/Branch'
import RemoteSelect from '@/components/form/RemoteSelect'
import StaticSelect from '@/components/form/StaticSelect'
export default {
	name: 'ProposalStrainerForm',
	data () {
    return {
      form: {
        title: '',
        classification: [],
        product: [],
        branch: [],
        ipr: [],
        inventors: [],
        proposer: [],
        tags: [],
        create_time: [],
      }  
    }		
	},
  methods: {
    clear () {
      this.$refs.form.resetFields();
    }
  },
  watch: {
    'form': {
      handler (val) {
        this.$emit('change', this.$tool.deepCopy(val));
      },
      deep: true,
    }
  },
	components: {
		Classification,
		Product,
		Branch,
		RemoteSelect,
		StaticSelect,
	}
}
</script>