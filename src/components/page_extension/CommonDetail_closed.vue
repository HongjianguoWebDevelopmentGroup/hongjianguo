<template>
  <el-form :model="form" ref="form" label-width="80px">
    <el-form-item label="审核人" class="is-required" prop="person_in_charge">
      <remote-select type="member" v-model="form.person_in_charge"></remote-select>
    </el-form-item>
    <el-form-item label="附件" prop="attachments">
      <upload v-model="form.attachments" ref="upload"></upload>
    </el-form-item>
    <el-form-item label="结案理由" prop="remark">
      <el-input type="textarea" v-model="form.remark" placeholder="请填写结案理由"></el-input>
    </el-form-item>
    <el-form-item style="margin-bottom: 0px;">
      <el-button type="primary" @click="closeSubmit" :loading="loading">{{ loading ? '提交中...' : '提交' }}</el-button>
    </el-form-item>
  </el-form>

</template>

<script>
import RemoteSelect from '@/components/form/RemoteSelect'
import Upload from '@/components/form/Upload'
 
export default {
  name: 'CommonDetailCloseProject',
  props: {
    id: {
      type: [String, Number],
      default: '',
    }
  },
  data () {
    return {
      form: {
        person_in_charge: '',
        attachments: [],
        remark: '',
      },
      loading: false,
    }
  },
  methods: {
    closeSubmit () {
      if(!this.id) {
        this.$message({type: 'warning', message: '案件ID不能为空'});
        return;
      }
      if(!this.form.person_in_charge) {
        this.$message({type: 'warning', message: '审核人不能为空'});
        return;
      }
      this.loading = true;
      this.$axiosPost({
        url: `/api/closeproject/${this.id}`,
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
      this.$refs.upload.clearFiles();
    }
  },
  components: {
    RemoteSelect,
    Upload,
  }
}
</script>