<template>
<el-form label-width="100px" :model="form" ref="form">   

    <el-row>

      <el-col :span="12">  
        <el-form-item label="案件类型" prop="category">
          <static-select type="case_type" v-model="form.category"></static-select>
        </el-form-item>
        <el-form-item label="代理机构" prop="agency">
          <remote-select type="agency" v-model="form.agency" ref="agency" multiple></remote-select>
        </el-form-item>
        <el-form-item label="流程节点" prop="flow_node_id">
          <static-select type="flow_node" v-model="form.flow_node_id" multiple></static-select>
        </el-form-item>
        <el-form-item label="IPR" prop="ipr">
          <static-select type="ipr" v-model="form.ipr" multiple></static-select>
        </el-form-item>
        <el-form-item label="代理人" prop="agent">
          <remote-select type="agent" v-model="form.agent" ref="agent" multiple></remote-select>
        </el-form-item>
        <el-form-item label="承办人" prop="person_in_charge">
          <remote-select type="member" v-model="form.person_in_charge" ref="person_in_charge" multiple></remote-select>
        </el-form-item>        
      </el-col>

      <el-col :span="12">
        <el-form-item label="申请日" prop="apd">
          <el-date-picker type="daterange" placeholder="请选择申请日" v-model="form.apd"></el-date-picker>
        </el-form-item>
        <el-form-item label="完成时间" prop="end_time">
          <el-date-picker type="daterange" placeholder="请选择完成时间" v-model="form.end_time"></el-date-picker>
        </el-form-item>
        <el-form-item label="指定期限" prop="due_time">
          <el-date-picker type="daterange" placeholder="请选择指定期限" v-model="form.due_time"></el-date-picker>
        </el-form-item>
        <el-form-item label="管控期限" prop="inner_deadline">
          <el-date-picker type="daterange" placeholder="请选择管控期限" v-model="form.inner_deadline"></el-date-picker>
        </el-form-item>
        <el-form-item label="法定期限" prop="deadline">
          <el-date-picker type="daterange" placeholder="请选择法定期限" v-model="form.deadline"></el-date-picker>
        </el-form-item>       
      </el-col>
    </el-row>

  </el-form>
</template>

<script>

import StaticSelect from '@/components/form/StaticSelect'
import RemoteSelect from '@/components/form/RemoteSelect'

export default {
	name: 'TaskCommonStrainerForm',
	data () {
    return {
      form: {
		  	'category': '',
		  	'ipr': [],
    		'agency': [],
				'agent': [],
				'flow_node_id': [],
				'person_in_charge': [],
		  	'due_time': [],
		  	'deadline': [],
		  	'end_time': [],
        'apd': [],
        'inner_deadline': [],
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