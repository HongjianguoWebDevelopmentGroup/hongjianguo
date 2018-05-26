<template>
  <el-form :model="form" ref="form" label-width="80px">
    <el-form-item label="案号" prop="serial" :rules="{required: true,message: '案号不能为空',trigger: 'blur'}">
      <el-input  v-model="form.serial" placeholder="请填写案号"></el-input>
    </el-form-item>
    <el-form-item style="margin-bottom: 0px;">
      <el-button type="primary" @click="divideSubmit" :loading="loading">{{ loading ? '提交中...' : '提交' }}</el-button>
    </el-form-item>
  </el-form>

</template>

<script>
 
export default {
  name: 'CommonDetailDivideProject',
  props: {
    id: {
      type: [String, Number],
      default: '',
    }
  },
  data () {
    return {
      form: {
        serial: '',
      },
      loading: false,
    }
  },
  methods: {
    divideSubmit () {
      console.log(this.id);
      if(!this.id) {
        this.$message({type: 'warning', message: '案件不能为空'});
        return;
      }
      if(!this.form.serial) {
        this.$message({type: 'warning', message: '案号不能为空'});
        return;
      }
      this.loading = true;
      this.$axiosPost({
        url: `/projects/${this.id}/divide`,
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
    }
  },
  components: {}
}
</script>