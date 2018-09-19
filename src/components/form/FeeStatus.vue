<template>
  <el-select 
    :value="value" 
    @input="handleInput" 
    placeholder="请选择费用状态"
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
      default: null,
    },
    'feeAnnual': {
      type: Boolean,
      default: true,
    }
  },
  computed: {
    options () {
      const arr = [
        {value: 0, label: '未付款'},
      ];
      const arrType = [
        {value: 1, label: '已加入请款单'},
        {value: 1, label: '已加入付款单'},
        {value: 2, label: '已发放'},
        {value: 2, label: '已到账'},
        {value: 2, label: '已付款'},
      ];
      // const arrAnnual = [
      //  {value: 10, label: '年费监控中'},
      //  {value: 11, label: '年费评估单'},
      //  {value: 12, label: '年费不再缴纳'},
      // ];
    const path = this.$route.path;
    const flge = path.slice(5,6);
    if(flge == 'b') {
      arr[0].label = '未发放'
      arr.push(arrType[1])
      arr.push(arrType[2])
    } else if (flge == 'o') {
      arr.push(arrType[1])
      arr.push(arrType[4])
    } else if (flge == 's') {
      arr[0].label = '待申请'
      arr.push(arrType[0])
      arr.push(arrType[3])
    }
      
      // this.feeAnnual ? arr.push(...arrAnnual) : '';
      
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