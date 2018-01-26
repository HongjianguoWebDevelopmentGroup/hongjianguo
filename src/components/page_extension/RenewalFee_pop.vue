<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" class="dialog-small">
  	<el-form label-width="80px" ref="form" :model="form" :rules="rules">
  		
  		<el-form-item label="相关案件" prop="project">
				<remote-select type="project" v-model="form.project"></remote-select>
			</el-form-item>
			<el-form-item label="年费类型" prop="code">
				<static-select  type="fee_code_renewal" v-model="form.code" ref="fee_code"></static-select>
			</el-form-item>
			<el-form-item label="年费对象" prop="target">
				<remote-select type="member" v-model="form.target"></remote-select>
			</el-form-item>
			<el-form-item label="费用金额" prop="money">
				<el-row>	
					<el-col :span="16" style="padding-right: 5px;">
						<el-input v-model="form.money.amount" placeholder="请输入费用金额">
							<static-select slot="prepend" style="width: 150px;" type="currency" v-model="form.money.currency"></static-select>
						</el-input>
					</el-col>

					<el-col :span="8" style="padding-left: 5px;">
						<el-input v-model="form.money.roe" placeholder="请输入执行汇率">
							<template slot="prepend">执行汇率</template>
						</el-input>
					</el-col>

				</el-row>
			</el-form-item>

			<el-row>
				<el-col :span="12">
					<el-form-item label="费用期限" prop="due_time">
						<el-date-picker v-model="form.due_time" type="date" placeholder="请选择费用期限"></el-date-picker>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="官方绝限" prop="deadline">
						<el-date-picker v-model="form.deadline" type="date" placeholder="请选择绝限"></el-date-picker>
					</el-form-item>
				</el-col>
			</el-row>
  	
  		<el-form-item prop="remark" label="备注">
  			<el-input type="textarea" v-model="form.remark" placeholder="请填写年费备注"></el-input>
  		</el-form-item>

  		<el-form-item style="margin-bottom: 0px;">
  			<el-button type="primary" @click="add" :loading="btn_disabled">{{ btn_disabled ? '添加中...' : '添加年费' }}</el-button>
  		</el-form-item>

  	</el-form>
  </el-dialog>
</template>

<script>
import PopMixins from '@/mixins/pop-mixins'
import RemoteSelect from '@/components/form/RemoteSelect'
import StaticSelect from '@/components/form/StaticSelect'
import { checkMoney } from '@/const/validator.js'

export default {
  name: 'renewalFeePop',
  mixins: [ PopMixins ],
  data () {
		return {
      form: {
      	project: '',
      	code: '',
      	money: {
      		amount: '',
      		currency: '',
      		roe: '',
      	},
      	due_time: '',
      	deadline: '',
      	remark: '',
      	target: '',
      },
      rules: {
      	'project': { type: 'number', required: true, message: '请选择相关案件' },
      	'code': { type: 'number', required: true, message: '请选择年费类型' },
      	'target': { type: 'number', required: true, message: '请选择年费对象' },
      	'money': { 
          type: 'object',
          required: true,
          trigger: 'change', 
          validator: (a,b,c)=>{
            checkMoney(a, b, c);
       		},
       	},
      	'deadline': { type: 'date', required: true, message: '请选择官方绝限' },
      }
		}
  },
  methods: {
  	submitForm () {
  		const s = this.$tool.shallowCopy(this.form, {date: true, skip: ['money']});
  		return Object.assign(s, this.form.money);  		
  	}
  },
  watch: {
		'form.code': {
			handler (v) {
				const val = this.$refs.fee_code.getSelected(v)[0];
				if(val) {
					this.form.money.roe = 1;
					this.form.money.currency = 'CNY';
					this.$tool.coverObj(this.form.money, val);
				}				
			}
		}
	},
	URL: '/api/renewalfee',
  REMINDER_TEXT: '年费',
  components: {
  	StaticSelect,
  	RemoteSelect,
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>