<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" >
  	<el-form label-width="100px" ref="form" :model="form" :rules="rules">
  		
  		<el-form-item label="名称" prop="name">
  			<el-input v-model="form.name" placeholder="请填写代理人名称"></el-input>
  		</el-form-item>

			<el-form-item label="手机号" prop="telephone">
				<el-input v-model="form.telephone" placeholder="请填写手机号"></el-input>
			</el-form-item>

			<el-form-item label="邮箱" prop="email">
				<el-input v-model="form.email" placeholder="请填写邮箱"></el-input>
			</el-form-item>
  
      <el-form-item label="年度/月度案件配额" prop="distributed_amount">
        <el-input v-model="form.distributed_amount" placeholder="请填写年度/月度案件配额"></el-input>
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
        name: '',
        telephone: '',
        email: '',
        distributed_amount: '',
        status: 1,
      },
      rules: {
      
      }
		}
  },
  components: { AppSwitch, StaticSelect },
  URL: '/api/agents',
  REMINDER_TEXT: '代理人',
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>