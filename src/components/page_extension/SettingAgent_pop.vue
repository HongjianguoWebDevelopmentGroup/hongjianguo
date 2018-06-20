<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" >
  	<el-form label-width="100px" ref="form" :model="form" :rules="rules">

			<el-form-item label="月度案件配额" prop="distributed_month_amount">
				<el-input v-model="form.distributed_month_amount" placeholder="请填写月度案件配额"></el-input>
			</el-form-item>
  
      <el-form-item label="年度案件配额" prop="distributed_amount">
        <el-input v-model="form.distributed_year_amount" placeholder="请填写年度/月度案件配额"></el-input>
      </el-form-item>

      <el-form-item label="代理人等级" prop= "level">
        <el-radio-group v-model="form.level">
          <el-radio-button label="A"></el-radio-button>
          <el-radio-button label="B"></el-radio-button>
          <el-radio-button label="C"></el-radio-button>
          <el-radio-button label="D"></el-radio-button>
        </el-radio-group>
      </el-form-item>

       <el-form-item label="状态" prop="status">
        <app-switch type="status" v-model="form.status"></app-switch>
      </el-form-item>
    
			<el-form-item style="margin-bottom: 0px;">
				<el-button type="primary" @click="add" v-if="type === 'add'" :disabled="btn_disabled">添加</el-button>
				<el-button type="primary" @click="edit" v-if="type === 'edit'" :disabled="btn_disabled">编辑</el-button>
			</el-form-item>

  	</el-form>
  </el-dialog>
</template>

<script>
import AxiosMixins from '@/mixins/axios-mixins'
import PopMixins from '@/mixins/pop-mixins'
import AppSwitch from '@/components/form/AppSwitch'
import StaticSelect from '@/components/form/StaticSelect'

export default {
  name: 'settingAgentPop',
  mixins: [ AxiosMixins, PopMixins ],
  data () {
		return {
      form: {
        distributed_month_amount: '',
        distributed_year_amount: '', 
        status: 1,
        level: 'B',
      },
      rules: {
        
      }
		}
  },
  components: { AppSwitch, StaticSelect },
  URL: '/api/agencyagent',
  REMINDER_TEXT: '代理人',
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>