<template>
  <el-select 
  	:value="value" 
  	@input="handleInput" 
  	placeholder="请选择费用状态"
    :disabled="disabled"
  >
  	<el-option
			v-for="item in options"
			:key="item.value"
			:label="item.label"
			:value="item.value"
  	>
  	</el-option>
  </el-select>
</template>

<script>
import FormSelect from '@/mixins/form-select'
export default {
  name: 'feeStatus',
  mixins: [ FormSelect ],
  props: {
  	'feeType': {
  		type: null,
  		defult: null,
  	},
  	'feeAnnual': {
  		type: Boolean,
  		defult: true,
  	},
    'disabled': {
      tye: Boolean,
      defult: false,
    }
  },
  computed: {
  	options () {
  		let arr = [
        {value: '', label: '全部'},
  			{value: 0, label: '未付款'},
  			{value: 100, label: '已付款'},
  		];
  		const arrType = [
  			{value: 1, label: '请款单'},
  			{value: 2, label: '账单'},
  		];
      const invoiceType = [
        {value: '', label: '全部'},
        {value: 1, label: '待审核'}, 
        {value: 2, label: '已审核待付款'},  
        {value: 3, label: '已拒绝'},
        {value: 4, label: '已付款待上传凭证',}, 
        {value: 5, label: '已上传凭证'},
      ]
  		const arrAnnual = [
  			{value: 10, label: '年费监控中'},
  			{value: 11, label: '年费评估单'},
  			{value: 12, label: '年费不再缴纳'},
        {value: 13, label: '年费评估通过待缴纳'},
  		];

      arr = this.feeType == 1 ? arr : invoiceType;
  		
  		this.feeAnnual ? arr.push(...arrAnnual) : '';

  		return arr;
  	}
  },
  watch: {
  	options () {
  		this.$emit('input', '');
  	}
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>