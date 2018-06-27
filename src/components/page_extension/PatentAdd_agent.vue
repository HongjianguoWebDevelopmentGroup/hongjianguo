<template>
  <!-- <app-collapse col-title="委案信息" > -->
      <el-form label-width="150px" :model="form" ref="form">
				<el-form-item label="代理机构名称" prop="agency">
					<remote-select type="agency" v-model="form.agency" disabled></remote-select>
          <span style="color:#bbb">要变更代理机构，请使用右上角的[委案]菜单中的相关功能</span>
				</el-form-item>
				<el-form-item label="代理机构案号" prop="agency_serial" :rules="{pattern: /^[^~!@#$%^&*\s]*$/, message: '代理机构案号不能包含特殊字符或空格', trigger: 'blur'}">
					<el-input v-model="form.agency_serial" placeholder="请填写代理机构案号"></el-input>
				</el-form-item>
				<el-form-item label="代理类型" prop="agency_type">
					<static-select type="agency_type" v-model="form.agency_type"></static-select>
				</el-form-item>
				<el-form-item label="代理人信息" prop="agent">
					<remote-select type="agent" v-model="form.agent"></remote-select>
				</el-form-item>
        <el-form-item prop="tech_rank" label="技术理解">
<!--           <el-rate 
            v-model="form.tech_rank" 
            style="margin-top: 10px" 
            :colors="['#99A9BF', '#F7BA2A', '#FF9900']" 
            disabled
            :texts="['20','40','60','80','100']"
          ></el-rate> -->
            <el-slider 
              v-model="form.tech_rank"
              show-input
            ></el-slider>
        </el-form-item>
        <el-form-item prop="draft_rank" label="撰写质量">
          <!-- <el-rate 
            v-model="form.draft_rank" 
            style="margin-top: 10px" 
            :colors="['#99A9BF', '#F7BA2A', '#FF9900']" 
            disabled
            :texts="['20','40','60','80','100']"
          ></el-rate> -->
            <el-slider 
              v-model="form.draft_rank"
              show-input
            ></el-slider>
        </el-form-item>
        <el-form-item prop="service_rank" label="服务状态">
        <!--   <el-rate 
            v-model="form.service_rank" 
            style="margin-top: 10px" 
            :colors="['#99A9BF', '#F7BA2A', '#FF9900']" 
            disabled
            :texts="['20','40','60','80','100']"
          ></el-rate> -->
            <el-slider 
              v-model="form.service_rank"
              show-input
            ></el-slider>
        </el-form-item>
        <el-form-item prop="negative_flag" label="特别评价">
          <el-radio-group v-model="form.negative_flag">
            <el-radio-button label="无"></el-radio-button>
            <el-radio-button label="好评"></el-radio-button>
            <el-radio-button label="差评"></el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="negative_comment" label="评价理由" v-show="form.negative_flag !== '无'" >
          <el-input type="textarea" v-model="form.negative_comment"></el-input>
        </el-form-item>
      </el-form>
    <!-- </app-collapse> -->
</template>

<script>
import AppCollapse from '@/components/common/AppCollapse'
import RemoteSelect from '@/components/form/RemoteSelect'
import StaticSelect from '@/components/form/StaticSelect'

export default {
  name: 'patentAddAgent',
  data () {
		return {
			form: {
				agency_serial: '',
        agency: '',
        agency_type: '',
        agent: '',
        tech_rank:0,
        draft_rank:0,
        service_rank:0,
        negative_flag:'',
        negative_comment:'',
			}
    }
  },
  methods: {
  	setForm (data) {
      this.$tool.coverObj(this.form, data, {obj: ['agency_serial']}); 
      if (data.tech_rank == undefined) {
        this.form.tech_rank = 0;
      }
      if (data.draft_rank == undefined) {
        this.form.draft_rank = 0;
      }
      if (data.service_rank == undefined) {
        this.form.service_rank = 0;
      }
      if (data.negative_flag == undefined) {
        this.form.negative_flag = '无';
      }
  	},
    checkForm (callback) {
      let flag = true;
      this.$refs.form.validate(_=>{
        flag = _;
        callback(flag);
      });
    },
    submitForm () {
      return this.form;
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
  components: {  
    AppCollapse,
    RemoteSelect,
    StaticSelect, 
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>