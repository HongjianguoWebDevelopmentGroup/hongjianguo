<template>
  <app-collapse col-title="提案信息">
      <el-form label-width="120px">
				<el-form-item label="产品分类">
					<product v-model="form.products" count-type="patent" multiple></product>
				</el-form-item>
				<el-form-item label="技术分类">
					<classification v-model="form.classification" count-type="patent"></classification>
				</el-form-item>
				<el-form-item label="标签">
          <static-select type="tag" v-model="form.tags" multiple></static-select>
				</el-form-item>
        <el-form-item label="项目名称" prop="project_name">
          <el-input v-model="form.project_name" placeholder="请填写项目名称"></el-input>
        </el-form-item>
        <el-form-item label="项目代号" prop="project_serial">
          <el-input v-model="form.project_serial" placeholder="请填写项目编号"></el-input>
        </el-form-item>
				<el-form-item label="主国际分类号">
					<el-input v-model="form.main_ipc" placeholder="请填写主国际分类号"></el-input>
				</el-form-item>
      </el-form>
    </app-collapse>
</template>

<script>
import AppCollapse from '@/components/common/AppCollapse'
import Product from '@/components/form/Product'
import Classification from '@/components/form/Classification'
import StaticSelect from '@/components/form/StaticSelect'

export default {
  name: 'patentAddClassification',
  data () {
		return {
			form: {
				products: [],
				classification: '',
				tags: [],
				main_ipc: '',
        project_name: '',
        project_serial: '',
			}
    }
  },
  methods: {
  	setForm (data) {
      for(let k in this.form) {
        if(data[k] == undefined) continue;
        if(k == 'products') {
          this.form[k] = data[k].map(_=>_.id);
        }else if(k == 'classification') {
          this.form[k] = data[k].id;
        }else {
          this.form[k] = data[k];
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
  components: { AppCollapse, Product, Classification, StaticSelect }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>