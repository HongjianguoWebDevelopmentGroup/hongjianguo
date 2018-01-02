<template>
  <el-dialog :key="popType" :title="popType == 'add' ? '新增合同' : '编辑合同'" :visible.sync="dialogVisible" @close="close">
		<el-form :model="form" label-width="100px" ref="form" :rules="rules">
			<el-form-item label="合同编号" prop="">
        <el-input placeholder="请输入合同编号"></el-input>
      </el-form-item>

      <el-form-item label="签订日期" prop="">
        <el-row>
            <el-col :span="12">
              <el-date-picker type="date" placeholder="请选择签订日期"></el-date-picker>
            </el-col>
        </el-row>
      </el-form-item>

      <el-form-item label="代理机构" prop="">
        <remote-select type="agency"></remote-select>
      </el-form-item>

      <el-form-item label="备注" prop="">
        <el-input type="textarea" placeholder="请填写备注"></el-input>
      </el-form-item>

      <el-form-item label="扫描件" prop="">
        <upload :file-list="attachments"></upload>
      </el-form-item>
	    <el-form-item style="margin-bottom: 0;">
	    	<el-button type="primary" @click="add" v-if="popType == 'add'">确定</el-button>
	    	<el-button type="primary" @click="edit" v-if="popType == 'edit'">编辑</el-button>
	    	<el-button @click="dialogVisible = false">取消</el-button>
	    </el-form-item>
		</el-form>
	</el-dialog>
</template>

<script>
import AxiosMixins from '@/mixins/axios-mixins'
import RemoteSelect from '@/components/form/RemoteSelect'
import Upload from '@/components/form/Upload'

const URL = 'api/members'

export default {
  name: 'contractPop',
  mixins: [ AxiosMixins ],
  props: {
  	'popType': {
  		type: String, 
  		default: 'add',
  	},
  },
  data () {
		return {
		  'form': {
		  },
		  'rules': {
		  },
		  dialogVisible: false,
      attachments: [],
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
  	},
  	add () {
  		let flag = false;
  		this.$refs.form.validate(_=>{ flag = !_ });
  		if( flag || this.psdCheck() ) return;

  		const url = URL;
  		const data = this.form;
  		const success = _=>{
  			this.$message({message: '添加用户成功', type: 'success'});
  			this.dialogVisible = false;
  			this.$emit('refresh');
  		}

  		this.axiosPost({url, data, success});
  	},
  	edit () {
  		let flag = false;
  		this.$refs.form.validate(_=>{ flag = !_ })
  		if( flag || this.$refs.psd.check() ) return;

  		const url = `${URL}/${this.id}`;
  		const data = this.$tool.shallowCopy(this.form, {skip: ['group_id']});
  		const success = _=>{
  			this.$message({message: '编辑用户成功', type: 'success'});
  			this.dialogVisible = false;
  			this.$emit('refresh');
  		}

  		this.axiosPut({url, data, success});
  	},
  	close () {
  		if(this.$refs.psd) {
  			this.$refs.psd.clearEditPsd();
  		}
  	}
  },
  components: { 
    RemoteSelect,
    Upload,
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
<!-- ###AppTag### -->