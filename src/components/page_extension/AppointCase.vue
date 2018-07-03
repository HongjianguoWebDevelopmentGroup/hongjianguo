<template>
  <div class="main">
   	<el-form :form="form" ref="agen" label-width="80px" :model="form">
	  <el-form-item label="代理机构" prop="agency" :rules="{required: true, type: 'number', message: '代理机构必填', trigger: 'change' }">
	      <remote-select type="agency_poa" v-model="form.agency" poa="1"></remote-select>
				<!-- <el-button size="mini" type="text" @click="showAgencyLoad">负载</el-button> -->
	    </el-form-item>
	    <el-form-item label="代理人" prop="agent" v-show="form.agency !== '' ? true : false">
	      <remote-select type="agent" v-model="form.agent" :para="agents" ref="agent"></remote-select>
	    </el-form-item>
	    <el-form-item label="代理类型" prop="agency_type" :rules="{ required: true, type: 'number', message: '代理类型必填', trigger: 'change' }">
	      <static-select type="agency_type" v-model="form.agency_type"></static-select>
	    </el-form-item>
	    <el-form-item label="备注" prop="remark">
	      <el-input v-model="form.remark" type="textarea"></el-input>
	    </el-form-item>
	    <el-form-item style="margin-bottom: 0px"><el-button @click="agenSubmit" type="primary" :disabled="btn_disabled">申请委案</el-button></el-form-item>
     </el-form>		
  </div>
</template>
<script>
import RemoteSelect from '@/components/form/RemoteSelect'
import StaticSelect from '@/components/form/StaticSelect'
import { mapMutations } from 'vuex'

export default {
  'name': 'appointCase',
  props:{
  	'taskIds':{
  	   type: Array,
       default(){
       	return [];
       }
  	},
  	'projectId':Number,
  	'type':String,
  },
  data() {
  	return {
  	  btn_disabled: false,
  	  form: {
  	  	agency: '',
        agent: '',
        agency_type: '',
        remark: '',
  	  }, 	
  	}
  },
  computed:{
  	agents() {
  		return {'agency': this.form.agency};
  	},
  	url() {
  		if(this.type == 'task'){
  			return '/api/tasks/agency'; 
  		}
  		if(this.type == 'patent') {
  			return `/project/${this.projectId}/agency`;
  		}
  	},
  	params() {
  		if(this.type == 'task'){
  			return Object.assign({}, this.form, {ids:this.taskIds}); 
  		}
  		if(this.type == 'patent') {
  			return Object.assign({},this.form);
  		}
  	},
  },
  methods: {
  	...mapMutations([
  	  'showAgencyLoad',	
  	]),
    agenSubmit () {
      this.$refs.agen.validate(_=>{
        if(_) {
          const url = this.url;
          const data = this.params;		
          const success = _=>{
            // this.dialogAgenVisible = false; 
            this.$message({type: 'success', message: '申请委案成功'});
            this.$emit('appointSuccess');
            // this.update();
          };
          const complete = _=>{this.btn_disabled = false};

          this.btn_disabled = true;
          this.$axiosPost({url, data, success, complete});
        }else {
          this.$message({message: '请填写申请委案字段', type: 'warning'});
        }
      })
      
    },  	
  },
  created() {

  },
  components:{RemoteSelect,StaticSelect}
}	
</script>
<style lang="scss" scoped>	
</style>