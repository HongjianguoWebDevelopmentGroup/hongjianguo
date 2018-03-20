<template>
<el-form :model="form" ref="form" label-width="120px">
      
  <el-form-item label="版权类型" prop="type">
    <static-select type="copyright_type" v-model="form.type" multiple></static-select>
  </el-form-item>

  <el-row>  
    <el-col :span="12">
      <el-form-item label="提案人" prop="proposer">
        <remote-select type="member" v-model="form.proposer" ref="proposer" multiple></remote-select>
      </el-form-item>
    </el-col>
    <el-col :span="12">
      <el-form-item label="申请人" prop="applicant">
        <remote-select type="applicant" v-model="form.applicant" ref="applicant" multiple></remote-select>
      </el-form-item>
    </el-col>
  </el-row>

  <el-row>
    <el-col :span="12">
      <el-form-item label="代理人" prop="agent">
        <remote-select type="agent" v-model="form.agent" ref="agent" multiple></remote-select>
      </el-form-item>
    </el-col>
    <el-col :span="12">
      <el-form-item label="代理机构" prop="agency">
        <remote-select type="agency" v-model="form.agency" ref="agency" multiple></remote-select>
      </el-form-item>
    </el-col>
  </el-row>
  
  <el-row>
    <el-col :span="12">
      <el-form-item label="产品分类" prop="product">
        <product v-model="form.product" count-type="copyright" multiple></product>
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

</el-form>
</template>

<script>
import Product from '@/components/form/Product'
import RemoteSelect from '@/components/form/RemoteSelect'
import StaticSelect from '@/components/form/StaticSelect'
export default {
	name: 'CopyrightStrainerForm',
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
  methods: {
    clear () {
      this.$refs.form.resetFields();
    },
    setForm (form) {
      this.clear();
      this.$tool.coverObj(this.form, form);
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
		Product,
		RemoteSelect,
		StaticSelect,
	}
}
</script>