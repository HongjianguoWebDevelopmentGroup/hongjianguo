<!-- 委案变更表单 -->
<template>
  <el-form :model="form" ref="form" label-width="80px">
    <el-form-item prop="agency" label="代理机构" class="is-required">
      <remote-select type="agency" v-model="form.agency"></remote-select>
      <!-- <el-button size="mini" type="text" @click="showAgencyLoad">负载</el-button>       -->
    </el-form-item>
    
    <el-form-item prop="agent" label="代理人" v-show="form.agency">
      <remote-select type="agent" v-model="form.agent" ref="agent" :para="agencyPara"></remote-select>
    </el-form-item>

    <el-form-item prop="remark" label="备注">
    	<el-input v-model="form.remark" type="textarea" placeholder="填写委案变更的备注"></el-input>
    </el-form-item>

    <el-form-item style="margin-bottom: 0px;">
    	<el-button type="primary" @click="submitFunc" :loading="loading">{{ loading ? '确认中...' : '确认' }}</el-button>
    </el-form-item>
  </el-form>

</template>

<script>
import RemoteSelect from '@/components/form/RemoteSelect'
import {mapMutations} from 'vuex'
import {mapActions} from 'vuex'

 
export default {
  name: 'CommonDetailCommissionChange',
  props: {
    id: {
      type: [String, Number],
      required: true,
      default: '',
    }
  },
  data () {
    return {
      form: {
        agency: '',
        agent: '',
        remark: '',
      },
      loading: false,
    }
  },
  computed: {
  	agencyPara () {
  		const d = this.form.agency;
  		if(d == '') {
  			return {agency: 0};
  		}

  		if(typeof d == 'object') {
  			return {agency: d.id};
  		}

  		return {agency: d};
  	}
  },
  methods: {
  	...mapMutations([
  		'showAgencyLoad',
  	]),
  	fill ({agency='', agent=''}) {
  		this.form.agency = agency;
  		this.$nextTick(_=>{
  			this.form.agent = agent
  		})
  	},
    submitFunc () {
      if(!this.id) {
        this.$message({type: 'warning', message: '案件ID不能为空'});
        return;
      }
      if(!this.form.agency) {
        this.$message({type: 'warning', message: '代理机构不能为空'});
        return;
      }
      this.loading = true;
      this.$axiosPut({
        url: `projects/${this.id}/transfer`,
        data: this.form,
        success: _=>{
          this.$message({type: 'success', message: _.info});
          this.$emit('success', _);
        },
        complete: _=>{
          this.loading = false;
        }
      })
    },
    clear () {
      this.$refs.form.resetFields();
    },
  },
  watch: {
  	'form.agency': {
      handler (val) {        
      	this.form.agent = '';

      	this.$refs.agent.static_map = [];
      }
  	}
	},
  components: {
    RemoteSelect,
  }
}
</script>