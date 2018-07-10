<template>
  <!-- <app-collapse col-title="委案信息"> -->
    <div>
      <el-form label-width="120px">
        <el-form-item label="代理机构名称">
          <remote-select type="agency" v-model="form.agency"></remote-select>
        </el-form-item>
        <el-form-item label="代理人信息">
          <remote-select type="agent" v-model="form.agent" ></remote-select>
        </el-form-item>
        <el-form-item label="代理机构案号">
          <el-input v-model="form.agency_serial" placeholder="请填写代理机构案号"></el-input>
        </el-form-item>
        <el-form-item label="代理类型">
          <static-select v-model="form.agency_type" type="agency_type"></static-select>
        </el-form-item>
      </el-form>
    </div>  
    <!-- </app-collapse> -->
</template>

<script>
import AppCollapse from '@/components/common/AppCollapse'
import StaticSelect from '@/components/form/StaticSelect'
import RemoteSelect from '@/components/form/RemoteSelect'

export default {
  name: 'patentAddAgent',
  data () {
    return {
      form: {
        agency: '',
        agency_serial: '',
        agency_type: '',
        agent: [],
      }
    }
  },
  methods: {
    setForm (data) {
      this.$tool.coverObj(this.form, data, {obj: ['agency_type']}); 
    },
    submitForm () {
      console.log(this.form);
      return this.form;
    },
    checkForm (callback) {
      callback(true);
    },
  },
  computed: {
    agent () {
      return this.form.agency ? this.form.agency.name : '暂无代理机构信息';
    },
    agency_serial () {
      return this.form.agency_serial ? this.form.agency_serial : '暂无代理机构信息';
    },
    agency_type () {
      return this.form.agency_type ? this.form.agency_type : '未知代理类型';
    },
    agency () {
      return this.form.agent ? this.form.agent.name : '暂无代理人信息';
    }
  },
  components: { 
   AppCollapse,
   StaticSelect,
   RemoteSelect,
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>