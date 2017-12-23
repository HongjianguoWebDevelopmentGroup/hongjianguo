<template>
  <app-collapse col-title="自定义字段">
    <el-form :model="form" ref="form" label-width="120px">
      
      <el-form-item :label="configsExtends1" prop="extends1">
       <el-input placeholder="请填写相关内容" type="textarea" v-model="form.extends1"></el-input>
      </el-form-item>
      
      <el-form-item :label="configsExtends2" prop="extends2">
       <el-input placeholder="请填写相关内容" type="textarea" v-model="form.extends2"></el-input>
      </el-form-item>

      <el-form-item :label="configsExtends3" prop="extends3">
    	 <el-input placeholder="请填写相关内容" type="textarea" v-model="form.extends3"></el-input>
      </el-form-item>

    </el-form>
  </app-collapse>
</template>
<script>
import AppCollapse from '@/components/common/AppCollapse'
import {mapGetters} from 'vuex'

export default {
  name: 'patentAddCustom',
  props:['type'],
  data() {
    return {
      form: {
        extends1: '',
        extends2: '',
        extends3: '',
      }
    }
  },
  computed: {
    ...mapGetters([
      'configsExtends1',
      'configsExtends2',
      'configsExtends3',
    ]),
  },
  methods: {
    setForm (data) {
      this.$tool.coverObj(this.form, data);
    },
    submitForm () {
      return this.form;
    },
    checkForm (callback) {
      callback(true);
    },
  },
  components:{
    AppCollapse
  },
}
</script>
<style scoped lang="scss">
.el-row {
    margin-bottom: 20px; 
    &:last-child {
      margin-bottom: 0;
    }
  }
</style>