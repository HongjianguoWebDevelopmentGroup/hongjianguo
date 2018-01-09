<template>
  <app-collapse col-title="评审结果">
      <el-form label-width="120px" :model="form" ref="form" :rules="rules">
        <el-form-item label="是否申请" prop="proposal" v-if="type == 'add'">
          <static-select type="patent_in" v-model="progress"></static-select>
        </el-form-item>
        <el-form-item label="申请策略" prop="application_strategy">
          <static-select type="strategy" v-model="form.application_strategy"></static-select>
        </el-form-item>
        <el-form-item label="实审时机" prop="subexam_timing">
          <static-select type="timing" v-model="form.subexam_timing"></static-select>
        </el-form-item>
        <el-form-item label="创新点描述" prop="innovation_introduction">
          <el-input type="textarea" v-model="form.innovation_introduction"></el-input>
        </el-form-item>
        <el-form-item label="新申请的申请策略" prop="core_concepts">
          <el-input type="textarea" v-model="form.core_concepts"></el-input>
        </el-form-item>
        <el-form-item label="决定要申请专利的原因" prop="decision_reason">
          <el-input type="textarea" v-model="form.decision_reason"></el-input>
        </el-form-item>
        <el-form-item label="技术重要性" prop="importance">
          <static-select type="patent_importance" v-model="form.importance"></static-select>
        </el-form-item>
        <el-form-item label="是否容易回避" prop="avoidability">
          <static-select type="patent_avoidability" v-model="form.avoidability"></static-select>
        </el-form-item>
        <el-form-item label="是否容易获取侵权证据" prop="evidence_discovery">
          <static-select type="patent_evidence" v-model="form.evidence_discovery"></static-select>
        </el-form-item>
        <el-form-item label="对产品盈利的贡献度" prop="profitability">
          <static-select type="patent_profitability" v-model="form.profitability"></static-select>
        </el-form-item>
        <el-form-item label="卖点相关性" prop="selling_point">
          <static-select type="patent_selling" v-model="form.selling_point"></static-select>
        </el-form-item>
        <el-form-item label="卖点相关的技术" prop="selling_point_technique">
          <el-input type="textarea" v-model="form.selling_point_technique"></el-input>
        </el-form-item>
        <el-form-item label="对手使用情况" prop="competitor_usage">
          <el-input type="textarea" v-model="form.competitor_usage"></el-input>
        </el-form-item>
        <el-form-item label="市场推广或宣传上的价值" prop="marketing_value">
          <static-select type="patent_marketing" v-model="form.marketing_value"></static-select>
        </el-form-item>
      </el-form>
    </app-collapse>
</template>

<script>
import AppCollapse from '@/components/common/AppCollapse'
import Upload from '@/components/form/Upload'
import StaticSelect from '@/components/form/StaticSelect'

export default {
  name: 'patentAddReview',
  props: ['type'],
  data () {
		return {
      progress: '',
			form: {        
        innovation_introduction: '',
        application_strategy: '',
        subexam_timing: '',
        core_concepts: '',
        decision_reason: '',
        importance: '',
        avoidability: '',
        evidence_discovery: '',
        profitability: '',
        selling_point: '',
        selling_point_technique: '',
        competitor_usage: '',
        marketing_value: '',
			},
      rules: {
        'selling_point_technique': { max: 50, message: '长度不能超过50个字符' },
        'competitor_usage': { max: 50, message: '长度不能超过50个字符' },
      }
		}
  },
  methods: {
  	setForm (data) {
      this.$tool.coverObj(this.form, data, { obj: ['application_strategy', 'subexam_timing'] });
  	},
    submitForm () {
      if(this.type == 'add') {
        return Object.assign({}, {progress: this.progress}, this.form);
      }
      return this.form;
    },
    checkForm (callback) {
      this.$refs.form.validate(_=>{
        callback(_);  
      })
    },
  },
  components: { 
    AppCollapse, 
    StaticSelect, 
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>