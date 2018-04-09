<template>
<el-form :model="form" label-width="140px" ref="form">
	<el-row :gutter="20">

    <el-col :span="12">
      <el-form-item label="付款时间" prop="pay_time">
        <el-date-picker type="daterange" placeholder="请选择付款时间" v-model="form.pay_time"></el-date-picker>
      </el-form-item>
      <el-form-item label="账单生成日期" prop="create_time">
        <el-date-picker type="daterange" placeholder="请选择账单生成日期" v-model="form.create_time"></el-date-picker>
      </el-form-item>
      <el-form-item label="费用期限" prop="due_time">
        <el-date-picker type="daterange" placeholder="请选择费用期限" v-model="form.due_time"></el-date-picker>
      </el-form-item>
    </el-col>

    <el-col :span="12">
      <el-form-item label="账单状态" prop="status">
        <el-select v-model="form.status">
          <el-option label="全部" value=""></el-option>
          <el-option label="未付款" value="0"></el-option>
          <el-option label="已付款" value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="账单对象" prop="target">
        <remote-select type="member" multiple v-model="form.target" ref="target"></remote-select>
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
        status: '',
        target: [],
        create_time: [],
        due_time: [],
        pay_time: [],
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