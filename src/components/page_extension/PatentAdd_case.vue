<template>
  <!-- <app-collapse col-title="相关案件"> -->
      <el-form label-width="120px">
        <el-form-item label="相关提案">
          <remote-select type="proposal" v-model="form.proposals" multiple></remote-select>
        </el-form-item>
        <el-form-item label="相关案件">
          <relative-projects v-model="form.relates"></relative-projects>
        </el-form-item>
      </el-form>
    <!-- </app-collapse> -->
</template>

<script>
import AppCollapse from '@/components/common/AppCollapse'
import Proposal from '@/components/form/Proposal'

import RelativeProjects from '@/components/form/RelativeProjects'
import RemoteSelect from '@/components/form/RemoteSelect'

export default {
  name: 'patentAddCase',
  data () {
    return {
      form: {
        proposals: [],
        relates: [],
      }
    }
  },
  methods: {  
    setForm (data) {
      this.$tool.coverObj(this.form, data);
    },
    submitForm () {
      return this.form;
    },
    checkForm (callback) {
      const caseLength = this.form.relates.length;
      if (caseLength == 0) return callback(true);
      const checkNull = this.form.relates.every((v,i)=>{
          return v['id'] !== '' && v['type'] !== '';
       });   
      callback(checkNull);
    },
  },
  components: { 
    AppCollapse, 
    RelativeProjects, 
    Proposal, 
    RemoteSelect 
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>