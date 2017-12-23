<template>
  <div class="main">
		<app-collapse v-for="(item,index) in configs" :col-title="item.name" :key="index">
			<el-form label-width="200px">
				<el-form-item v-for="f_item in item.configs" :label="f_item.label" :key="f_item.name"><el-input :placeholder="f_item.description" v-model="f_item.config_value"></el-input></el-form-item>
			</el-form>
		</app-collapse>
		<el-button type="primary" style="margin: 10px 0px 20px 0px;" @click="save">保存设置</el-button>
  </div>
</template>

<script>
import AppCollapse from '@/components/common/AppCollapse'
import {mapActions} from 'vuex'
import {mapGetters} from 'vuex'

const URL = '/api/configs'

export default {
  name: 'settingSystem',
  data () {
    return {
      configs: [],
    };
  },
  computed: {
    ...mapGetters([
      'configsData',
    ])
  },
  methods: {
    ...mapActions([
      'refreshConfigs',
    ]),
  	save () {
  		const url = URL;
  		const data = this.configs;
  		const success = _=>{
        this.$message({message: '保存系统设置成功', type: 'success'});
        this.refreshConfigs();
      };

  		this.$axiosPost({url, data, success});
  	}
  },
  created () {
    this.configs = this.$tool.deepCopy(this.configsData);
  },
  components: { 
    AppCollapse 
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>