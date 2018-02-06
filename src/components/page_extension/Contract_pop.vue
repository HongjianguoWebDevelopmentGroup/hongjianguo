<template>
  <div id="contractPop">
    <el-dialog :title="popType == 'add' ? '新增合同' : '编辑合同'" :visible.sync="dialogVisible" class="dialog-small" @close="clear">
  		<el-form :model="form" label-width="80px" ref="form" :rules="rules">
  			<el-form-item label="合同编号" prop="serial">
          <el-input v-model="form.serial"  placeholder="请输入合同编号"></el-input>
        </el-form-item>
          <el-row>
              <el-col :span="12">
                <el-form-item label="签订日期" prop="signing_date">
                  <el-date-picker type="date" v-model="form.signing_date" placeholder="请选择签订日期"></el-date-picker>
                </el-form-item>
              </el-col>
             <el-col :span="12">
                <el-form-item label="失效时间" prop="expire_date">
                  <el-date-picker type="date" v-model="form.expire_date" placeholder="请选择失效时间"></el-date-picker>
                </el-form-item>
             </el-col>
          </el-row>
        <el-form-item label="代理机构" prop="party">
          <remote-select v-model="form.party" type="agency"></remote-select>
        </el-form-item>

        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" v-model="form.remark" placeholder="请填写备注"></el-input>
        </el-form-item>

        <el-form-item label="扫描件" prop="files">
          <upload v-model="form.files" :file-list="fileList"></upload>
        </el-form-item>
  	    <el-form-item style="margin-bottom: 0;">
  	    	<el-button type="primary" @click="add" v-if="popType == 'add'">确定</el-button>
  	    	<el-button type="primary" @click="edit" v-if="popType == 'edit'">编辑</el-button>
  	    	<el-button @click="dialogVisible = false">取消</el-button>
  	    </el-form-item>
  		</el-form>
  	</el-dialog>
  </div>
</template>

<script>
import AxiosMixins from '@/mixins/axios-mixins'
import RemoteSelect from '@/components/form/RemoteSelect'
import Upload from '@/components/form/Upload'

const URL = '/api/contracts'

export default {
  name: 'contractPop',
  mixins: [ AxiosMixins ],
  props: {
  	'popType': {
  		type: String, 
  	},
  },
  data () {
		return {
      id: '',
		  'form': {
        serial: '',
        signing_date: '',
        expire_date: '',
        party: '',
        remark: '',
        files: [],
		  },
		  'rules': {
		  },
		  dialogVisible: false,
      attachments: [],
      fileList: [],
		}
  },
  computed: {
  	dialogTitle () {
  		return this.popType == 'add' ? '添加用户' : '编辑用户';
  	},
  },
  methods: {
  	show (row) {
  		this.dialogVisible = true;      
      this.$nextTick(_=>{
        console.log(this.popType);
        if(this.$refs.form){
        this.$refs.form.resetFields();   
        }
        if(this.popType == 'edit') {
          this.$tool.coverObj(this.form,row);
          const copy = this.$tool.deepCopy(row);
          this.id = copy.id; 
          this.form.files = row['files'].map(_=>_.id);
          this.fileList = row['files'];
        }
      
      
      })
  	},
  	add () {
  		const url = URL;
  		const data = this.form;
      console.log(data);
  		const success = _=>{
  			this.$message({message: '新增合同成功', type: 'success'});
  			this.dialogVisible = false;
  			this.$emit('refresh');
  		}

  		this.$axiosPost({url, data, success});
  	},
  	edit () {
  		const url = `${URL}/${this.id}`;
  		const data = this.form;
  		const success = _=>{
  			this.$message({message: '编辑合同成功', type: 'success'});
  			this.dialogVisible = false;
  			this.$emit('refresh');
  		}

  		this.$axiosPut({url, data, success});
  	},
    clear () {
      this.$refs.form.resetFields();
      this.fileList = [];
    }
  },
  components: { 
    RemoteSelect,
    Upload,
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
  #contractPop .el-dialog--small  .el-upload--text {
      display: inline-block;
      text-align: center;
      cursor: pointer;
      position: absolute;
      left: 0px;
      bottom: 4px;
  }
</style>
<style scoped lang="scss">
</style>
<!-- ###AppTag### -->