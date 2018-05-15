<template>
  <app-collapse col-title="其他信息">
      <el-form label-width="120px">
        <el-form-item label="已申请资助">
          <app-switch type="is" v-model="form.is_support"></app-switch>
        </el-form-item>
        <el-form-item label="专利实施情况">
          <el-input type="textarea" placeholder="请填写专利实施情况" v-model="form.application"></el-input>
        </el-form-item>
        <el-form-item label="权利要求/附图数">
          <el-input v-model="form.claims_count" placeholder="请填写权利要求项数或者附图数量"></el-input>
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
import AppSwitch from '@/components/form/AppSwitch'

export default {
  name: 'patentAddOther',
  props: ['type'],
  data () {
    return {
      form: {
        // progress: '',
        words: '',
        remark: '',
        claims_count: '',
        is_supported: '',
        application:'',
      },
    }
  },
  methods: {
    setForm (data) {
      this.$tool.coverObj(this.form, data, {obj: ['progress']});
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
    StaticSelect,
    AppSwitch,
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>