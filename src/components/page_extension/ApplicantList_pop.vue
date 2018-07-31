<template>
	<app-pop ref="pop" title="申请人" :model="form" label-width="130px" :rules="rules" :type="formType" :save="save">			
		<el-form-item label="申请人类型" prop="type">
			<el-select v-model="form.type" placeholder="请选择申请人类型">
				<el-option
					v-for="item in option.type"
					:key="item.value"
					:label="item.label"
					:value="item.value"
				></el-option>
			</el-select>
		</el-form-item>

		<el-form-item label="申请人姓名" prop="name">
			<el-input v-model="form.name"  placeholder="请填写申请人姓名"></el-input>
		</el-form-item>

		<el-form-item label="证件号码" prop="identity">
			<el-input v-model="form.identity" placeholder="请填写证件号码"></el-input>
		</el-form-item>
		
		<el-form-item label="申请人地区" prop="area">
			<static-select v-model="form.area" type="area"></static-select>
		</el-form-item>

		<el-form-item label="申请人城市" prop="province_city">
			<city v-model="form.province_city"></city>
		</el-form-item>

		<el-form-item label="详细地址" prop="address">
			<el-input v-model="form.address" placeholder="请输入详细地址"></el-input>
		</el-form-item>

		<el-form-item label="邮编" prop="postcode">
			<el-input v-model="form.postcode" placeholder="请输入邮编"></el-input>
		</el-form-item>

		<el-form-item label="费用备案" prop="fee_discount">
			<el-select v-model="form.fee_discount" placeholder="请选择费用备案">
				<el-option 
					v-for="item in option.fee_discount"
					:key="item.value"
					:label="item.label"
					:value="item.value"
				></el-option>
			</el-select>
		</el-form-item>

		<el-form-item label="英文姓名" prop="ename">
			<el-input v-model="form.ename" placeholder="请输入英文姓名"></el-input>
		</el-form-item>

		<el-form-item label="英文地址" prop="eaddress">
			<el-input v-model="form.eaddress" placeholder="请输入英文地址"></el-input>
		</el-form-item>

	</app-pop>
</template>

<script>
import StaticSelect from '@/components/form/StaticSelect'
import City from '@/components/form/City'
import AppPop from '@/components/common/AppPop'
const URL = '/applicants'

export default {
  name: 'applicantListPop',
  data () {
  	const getRequiredRules = (message, type, trigger) => Object.assign({required: true}, {message, type, trigger})
		return {
		  form: {
		  	type: '',
		  	name: '',
		  	identity: '',
		  	area: '',
		  	address: '',
		  	postcode: '',
		  	fee_discount: '',
		  	ename: '',
		  	eaddress: '',
		  	province_city: [],
		  },
		  formType: 'add',
		  option: {
		  	type: [
		  		{ label: '大专院校', value: 1 },
		  		{ label: '科研单位', value: 2 },
		  		{ label: '工矿企业', value: 3 },
		  		{ label: '事业单位', value: 4 },
		  		{ label: '个人', value: 5 },
		  	],
		  	fee_discount: [
		  		{ label: '未完成', value: 0 },
		  		{ label: '已完成', value: 1 },
		  	],
		  },
		  rules: {
		  	type: getRequiredRules('申请人类型不能为空', 'number', 'change'),
		  	name: getRequiredRules('申请人姓名不能为空', 'string', 'blur'),
		  	identity: getRequiredRules('证件号码不能为空', 'string', 'blur'),
		  	area: getRequiredRules('申请人地区不能为空', 'string', 'change'),
		  	province_city: getRequiredRules('申请人城市不能为空', 'array', 'change'),
		  	address: getRequiredRules('详细地址不能为空', 'string', 'blur'),
		  	fee_discount: getRequiredRules('费用备案必选', 'number', 'change')
		  },
		  rowId: ''
		}
  },
  methods: {
  	show (type, row) {
  		this.formType = type
  		this.$refs.pop.show()

  		if (type === 'edit') {
  			this.$nextTick(() => {
  				this.rowId = row.id
  				for(let k in this.form) {
		  			const d = row[k]
		  			if(k == 'province_city') {
		  				let arr = []
		  				arr[0] = Number.parseInt(row['province'])
		  				arr[1] = row['city']
		  				this.form[k] = arr
		  			}else {
		  				this.form[k] = d;
		  			}
		  		}
  			})
  		}
  	},
  	async save (type) {
  		const url = URL
  		const data = this.submitForm()
  		let response
  		if (type === 'add') {
  			response = await this.$axiosPost({url, data, success: () => {
  				this.$message({type: 'success', message: '添加申请人成功'})
  				this.$emit('addSuccess')
  			}})
  		} else {
  			data.id = this.rowId
  			response = await this.$axiosPost({url, data, success: () => {
  				this.$message({type: 'success', message: '编辑申请人成功'})
  				this.$emit('editSuccess')
  			}})
  		}
  		return response
  	},
  	submitForm () {
  		const o = {};
  		for(let k in this.form) {
  			const d = this.form[k];
  			if(k == 'province_city') {
  				o.province = d[0] ? d[0] : '';
  				o.city = d[1] ? d[1] : '';
  			}else {
  				o[k] = d;
  			}
  		}

  		return o;
  	}
  },
  components: { 
  	StaticSelect, 
  	City, 
  	AppPop 
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>