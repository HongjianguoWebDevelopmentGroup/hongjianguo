<template>
   <el-dialog title="检验结果" :visible="visible" @update:visible="handleVisible" :modal="false" class="dialog-medium">
      <app-table :columns="columns" :data="tableData"></app-table>
      <div style="margin-top: 20px;"><span>如果检验结果不通过请</span><el-button type="text" size="mini" @click="$emit('more', 'patent')" style="margin-left:6px;" v-if="!allEqual">前往修改</el-button></div>
      <el-button type="primary" @click="checkOut" style="margin-top:20px;" v-if="allEqual">确认</el-button>
   </el-dialog>
</template>
<script>
import AppTable from '@/components/common/AppTable'
export default {
  name: 'taskconfirmform_pop',
  data() {
    return {
      allEqual: false,  
      'columns':[
         {type:'text', label: '字段名', prop: 'item',},
         {type:'text', label: '系统', prop: 'original',},
         {type:'text', label: '确认表', prop: 'current',},
         {type:'text', label: '校验结果', prop: 'is_equal',render:(h,item)=>{
          item? item = '是': item = '否';
          return h('span',item)
         }},
         {type:'text', label: '备注', prop: 'message',},
      ],
    }   
  },
  props: {
    'tableData': {
      type:Array,
      default() {
        return [];
      },
    },
  'visible': Boolean, 
  },
  computed: {

  },
  methods: {
    handleVisible(val) {
      this.$emit('update:visible',val);
    },
    handleData(d) {
      console.log(d);
      this.allEqual = d.every((v,i,arr)=>{
      return v['is_equal'] === true;
      });
    },
    checkOut() {
      this.$emit('check-out',true);
    },
  },
  mounted() {

  },
  watch: {
    'tableData':{
      handler:function(val){
        if(val){
          console.log(val);
          this.handleData(val);
          this.$emit('inform',this.allEqual);
        }
      }
    }
  },
  components:{AppTable,}, 
}
</script>
<style lang="scss" scoped>
</style>