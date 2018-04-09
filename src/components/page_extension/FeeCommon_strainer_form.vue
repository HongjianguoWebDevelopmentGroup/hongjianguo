<template>
<el-form :model="form" label-width="100px" ref="form">
    	
  <el-form-item label="费用对象" prop="target">
    <remote-select type="member" v-model="form.target" ref="target" multiple></remote-select>
  </el-form-item>
  
  <el-row>
    <el-col :span="12">
      
      <el-form-item prop="area" label="地区">
        <static-select type="area" v-model="form.area" multiple></static-select>
      </el-form-item>
    </el-col>
    <el-col :span="12">
      <el-form-item label="费用代码" prop="code">
        <static-select type="fee_code" v-model="form.code" multiple></static-select>
      </el-form-item>
      
    </el-col>
  </el-row>

  <el-row>
    <el-col :span="12">
      <el-form-item prop="category" label="案件类型">
        <static-select type="case_type" v-model="form.category" multiple></static-select>
      </el-form-item>
    </el-col>
    <el-col :span="12">
      <el-form-item prop="patent_type" label="专利类型">
        <static-select type="patent_type_strainer" v-model="form.patent_type" multiple></static-select>
      </el-form-item>
    </el-col>
  </el-row>

  <el-row>
    <el-col :span="12">
      <el-form-item label="通知书发文日" prop="mail_date">
        <el-date-picker type="daterange" placeholder="请选择通知书发文日" v-model="form.mail_date"></el-date-picker>
      </el-form-item>
    </el-col>
    <el-col :span="12">
      <el-form-item label="付款时间" prop="pay_time">
        <el-date-picker type="daterange" placeholder="请选择付款时间" v-model="form.pay_time"></el-date-picker>
      </el-form-item>
    </el-col>
  </el-row>

  <el-row>
    <el-col :span="12">
      <el-form-item label="费用生成日期" prop="create_time">
        <el-date-picker type="daterange" placeholder="请选择费用生成日期" v-model="form.create_time"></el-date-picker>
      </el-form-item>
    </el-col>
    <el-col :span="12">
      <el-form-item label="账单期限" prop="due_time">
        <el-date-picker type="daterange" placeholder="请选择账单期限" v-model="form.due_time"></el-date-picker>
      </el-form-item>
    </el-col>
  </el-row>

  <el-row>
    <el-col :span="12">
      <el-form-item label="官方绝限" prop="deadline">
        <el-date-picker type="daterange" placeholder="请选择官方绝限" v-model="form.deadline"></el-date-picker>
      </el-form-item>
    </el-col>
    <el-col :span="12">
      <el-form-item label="申请日" prop="apd">
        <el-date-picker type="daterange" placeholder="请选择申请日" v-model="form.apd"></el-date-picker>
      </el-form-item>
    </el-col>
  </el-row>

</el-form>
</template>

<script>
import StaticSelect from '@/components/form/StaticSelect'
import RemoteSelect from '@/components/form/RemoteSelect'
export default {
	name: 'TrademarkStrainerForm',
	data () {
    return {
      form: {
      	target: [],
        code: [],
        mail_date: [],
        create_time: [],
        due_time: [],
        deadline: [],
        pay_time: [],
        category: [],
        patent_type: [],
        apd: [],
        area: [],
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
		RemoteSelect,
		StaticSelect,
	}
}
</script>