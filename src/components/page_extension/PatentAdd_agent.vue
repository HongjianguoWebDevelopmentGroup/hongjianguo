<template>
  <app-collapse col-title="委案信息" >
      <el-form label-width="120px" :model="form" ref="form">
				<el-form-item label="代理机构名称">
					{{ agency }}
				</el-form-item>
				<el-form-item label="代理机构案号" prop="agency_serial" :rules="{pattern: /^[^~!@#$%^&*\s]*$/, message: '代理机构案号不能包含特殊字符或空格', trigger: 'blur'}">
					<el-input v-model="form.agency_serial" placeholder="请填写代理机构案号"></el-input>
				</el-form-item>
				<el-form-item label="代理类型">
					{{ agency_type }}
				</el-form-item>
				<el-form-item label="代理人信息">
					{{ agent }}
				</el-form-item>
      </el-form>
    </app-collapse>
</template>

<script>
import AppCollapse from '@/components/common/AppCollapse'

export default {
  name: 'patentAddAgent',
  data () {
		return {
			form: {
				agency_serial: '',
        agency: '',
        agency_type: '',
        agent: '',
			}
    }
  },
  methods: {
  	setForm (data) {
      this.$tool.coverObj(this.form, data); 
  	},
    checkForm (callback) {
      let flag = true;
      this.$refs.form.validate(_=>{
        flag = _;
        callback(flag);
      });
    },
    submitForm () {
      return {'agency_serial': this.form.agency_serial};
    },
  },
  computed: {
  	agency () {
  		return this.form.agency ? this.form.agency.name : '暂无代理机构信息';
  	},
  	agency_type () {
  		return this.form.agency_type ? this.form.agency_type : '未知代理类型';
  	},
  	agent () {
  		return this.form.agent ? this.form.agent.name : '暂无代理人信息';
  	}
  },
  components: {  AppCollapse }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>