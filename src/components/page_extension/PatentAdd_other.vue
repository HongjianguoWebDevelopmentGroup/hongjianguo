<template>
  <app-collapse col-title="其他信息">
      <el-form label-width="120px">
        <el-form-item label="状态">
          <remote-select type="progress" v-model="form.progress_name"></remote-select>
        </el-form-item>
        <el-form-item label="说明书字数">
          <el-input v-model="form.words" placeholder="请填写说明书字数"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.remark" type="textarea" placeholder="请填写备注信息"></el-input>
        </el-form-item>
      </el-form>
    </app-collapse>
</template>

<script>
import AppCollapse from '@/components/common/AppCollapse'
import RemoteSelect from '@/components/form/RemoteSelect'

export default {
  name: 'patentAddOther',
  props: ['type'],
  data () {
		return {
      form: {
        progress_name: '',
        words: '',
        remark: '',
			},
		}
  },
  methods: {
  	setForm (data) {
      for(let k in this.form) {
        const d = data[k];
        if(d == undefined) continue;
          this.form[k] = d;
      }
      this.progress_name = data['progress'] ? data['progress']['name'] : ''; 
  	},
    submitForm () {
      return this.form;
    },
    checkForm (callback) {
      callback(true);
    },
  },
  components: { 
    AppCollapse, 
    RemoteSelect,
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>