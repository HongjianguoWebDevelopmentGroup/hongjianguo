<template>  
  	<el-form label-width="100px" :model="form" ref="form">
     <!--  <el-form-item label="关联案件" prop="project_id" v-if="type == 'add'">
        <remote-select type="project" v-model="form.project_id" ref="project"></remote-select>
      </el-form-item> -->
      <el-form-item label="是否可见">
      	<el-switch
      		v-model="form.is_task"
      		on-color="#13ce66"
    		off-color="#ff4949"
    		on-value= 1
    		off-value= 0
    		on-text="是"
    		off-text="否"
      	>
      	</el-switch>
      </el-form-item>
      <el-form-item label="任务流程" prop="flow_id" v-if="type == 'add'&&form.is_task==1">
        <el-select v-model="form.flow_id" placeholder="请选择任务流程">
          <el-option
            v-for="item in flowOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="任务类型" prop="task_def_id" v-if="type == 'add'&&form.is_task==1">
        <el-select v-model="form.task_def_id" placeholder="请选择任务类型">
          <el-option
            v-for="item in defOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>

  		<el-form-item label="承办人" prop="person_in_charge" v-if="type == 'add'&&form.is_task==1">
        <remote-select type="member" v-model="form.person_in_charge"></remote-select>
  		</el-form-item>

      <el-form-item label="承办期限" prop="due_time" v-if="form.is_task==1">
        <el-date-picker type="date" v-model="form.due_time" placeholder="请选择承办期限"></el-date-picker>
      </el-form-item>

      <el-form-item label="法限" prop="deadline" v-if="form.is_task==1">
        <el-date-picker type="date" v-model="form.deadline" placeholder="请选择法限"></el-date-picker>
      </el-form-item>
 
  	</el-form>  
</template>

<script>
import Member from '@/components/form/Member'
import AxiosMixins from '@/mixins/axios-mixins'
import RemoteSelect from '@/components/form/RemoteSelect'
import {mapActions} from 'vuex'

const URL = '/api/tasks';

export default {
  name: 'taskEdit',
  mixins: [ AxiosMixins ],
  props: [ 'type', 'row','category' ],
  methods: {
    ...mapActions([
      'refreshUser',
    ]),
 	setForm (data) {
      this.$tool.coverObj(this.form, data);
    },
    submitForm () {
    	if(this.form.is_task==='1') {
      		 return this.$tool.shallowCopy(this.form, { 'date': true });
 		}else {
 			 return this.$tool.shallowCopy(this.form, { 'date': true ,
 			 	skip:['flow_id','task_def_id','person_in_charge','due_time','deadline'],
 			});
 		}		
    
    },
    checkForm (callback) {
      callback(true);
    },
    clear () {
      this.$refs.form.resetFields();
    }, 
    refreshRow () {
      if(this.type == 'edit') {
        
        for( let k in this.form) {
          const d = this.row[k];
          
          if(k == 'attachments') {
            this.form[k] = d.map(_=>_.id);
            this.attachments = d;
          }else if(k == 'person_in_charge') {
            this.form[k] = {id: d, name: this.row['person_in_charge_name']};
            console.log(this.form[k]);
          }else {
            if(d) {
              this.form[k] = d;  
            }else {
              this.form[k] = "";
            }
          }
        }
      }
    }
    // handleProductChange (d) {
    //   this.category = d.category;
    // }
  },
  data () {
  	return {
  	  form: {
  	  	is_task: 0,
        project_id: '',
        flow_id: '',
        task_def_id: '',
        person_in_charge: '',
        due_time: '',
        deadline: '',
      },
  	}
  },
  computed: {
    flowsData () {
      return this.$store.getters.flowsData;
    },
    taskDefsData () {
      return this.$store.getters.taskDefsData;
    },
    flowOptions () {
      const c = this.category;
      this.form.flow_id = '';
      if( !this.flowsData[c] ) {
        return [];
      }else {
        return this.flowsData[c]['flows'].map(_=>{
          return {label: _.name, value: _.id};
        })  
      }     
    },
    defOptions () {
      const f = this.form.flow_id;
      this.form.task_def_id = '';
      const arr = [];

      this.taskDefsData.forEach(_=>{
        if(_.flow_id == f) arr.push({label: _.label, value: _.value});
      });

      return arr;
    }
  },
  watch: {
    'row.id': {
      handler () {
        this.refreshRow();
      }
    }
  },
  mounted () {
    this.refreshRow();
  },
  components: { Member, RemoteSelect }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
