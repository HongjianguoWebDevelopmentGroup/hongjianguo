<template>
  <app-collapse col-title="其他信息及附件">
      <el-form label-width="120px">
        <el-form-item label="状态" v-if="type == 'edit'">
           <static-select type="patents_status" v-model="form.progress"></static-select>
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
import StaticSelect from '@/components/form/StaticSelect'

export default {
  name: 'patentAddOther',
  props: ['type'],
  data () {
		return {
			form: {
        words: '',
        remark: '',
        progress: '',
			},
		}
  },
  methods: {
  	setForm (data) {
      for(let k in this.form) {
        const d = data[k];
        if(k == 'progress') {
          this.form[k] = d['id'];
        }else {
          this.form[k] = d;
        }
      }
  	},
    submitForm () {
      return this.form;
    },
    checkForm (callback) {
      callback(true);
    },
  },
  components: { AppCollapse,StaticSelect }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>