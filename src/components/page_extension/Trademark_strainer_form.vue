<template>
<el-form :model="form" ref="form" label-width="120px">

	<el-row>
		<el-col :span="12">
			<el-form-item label="商标类型" prop="type">
		  	<static-select type="type" v-model="form.type" multiple></static-select>
			</el-form-item>
		</el-col>
		<el-col :span="12">
		  <el-form-item label="申请日" prop="apd">
		   <el-date-picker type="daterange" v-model="form.apd" placeholder="请选择申请日"></el-date-picker>
		  </el-form-item>
		</el-col>
	</el-row>

	<el-row>
		<el-col :span="12">
			<el-form-item label="地区" prop="area">
		  	<static-select type="area" v-model="form.area" multiple></static-select>
			</el-form-item>
		</el-col>
		<el-col :span="12">
		  <el-form-item label="初审公告日" prop="public_date">
		   <el-date-picker type="daterange" v-model="form.public_date" placeholder="请选择初审公告日"></el-date-picker>
		  </el-form-item>
		</el-col>
	</el-row>

	<el-row>
		<el-col :span="12">
		  <el-form-item label="商标类别" prop="categories">
		    <static-select type="categories" v-model="form.categories" multiple></static-select>
		  </el-form-item>
		</el-col>
		 <el-col :span="12">
		  <el-form-item label="核准注册日" prop="issue_date">
		   <el-date-picker type="daterange" v-model="form.issue_date" placeholder="请选择核准注册日"></el-date-picker>
		  </el-form-item>
		</el-col>
	</el-row>

	<el-row>
		<el-col :span="12">
		  <el-form-item label="申请人" prop="applicants">
		   <remote-select type="applicant" v-model="form.applicants" ref="applicants" multiple></remote-select>
		  </el-form-item>
		</el-col>
		<el-col :span="12">
		  <el-form-item label="专用权期限" prop="expiring_date">
		    <el-date-picker type="daterange" v-model="form.expiring_date" placeholder="请选择专用权期数"></el-date-picker>
		  </el-form-item>
		</el-col>
	</el-row>

</el-form>
</template>

<script>
import Product from '@/components/form/Product'
import StaticSelect from '@/components/form/StaticSelect'
import RemoteSelect from '@/components/form/RemoteSelect'
export default {
	name: 'TrademarkStrainerForm',
	data () {
    return {
      form: {
      	type: [],
      	area: [],
        categories: [],
        applicants: [],
        apd: '',
        public_date: '',
        issue_date: '',
        expiring_date: ''
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