<template>
   <app-collapse :col-title="`发明人奖励(总计：${detailFundings.sum?detailFundings.sum:'0'}CNY)`">
     <!-- <table-component :tableOption="tableOption" :data="detailFundings.list"></table-component> -->
     <app-table :columns="columns" :data="fundingsData"></app-table>
   </app-collapse> 
</template>
<script>
import AppTable from '@/components/common/AppTable'
import AppCollapse from '@/components/common/AppCollapse'
import { mapGetters } from 'vuex'
  export default {
    name: 'commonDetailInventorBonus',
    data () {
      return {

          columns:[
            { type: 'text', label: '费用名称', prop: 'name', min_width: '145'},
            { type: 'text', label: '费用对象', prop: 'target', render_simple: 'name',},
            { type: 'text', label: '外币金额',  prop: 'amount', width: '100', align: 'right',
              render:(h,item,row)=>{
                if( row.roe == 1 ){
                   return h('span','N/A');
                }else{
                   return h('span',`${item}${row.currency}`);
                }
              } 
            },
            { type: 'text', label: '汇率', prop: 'roe', width: '70', align: 'right',
              render:(h,item)=>{
                if( item == 1 ){
                  return h('span','N/A');
                }else{
                  return h('span',item);
                } 
              }
            },
            { type: 'text', label: '人民币金额', prop: 'rmb', width: '120', align: 'right',
              render:(h,item)=>{
                return h('span',`${item}CNY`)
                }
            },
            { type: 'text', label: '付款日期', prop: 'pay_date', width: '120'},
            { type: 'text', label: '状态', prop: 'status', width: '90'},
            { type: 'text', label: '备注', prop: 'remark', min_width: '90'},
          ],
      }
    },
    computed: {
      ...mapGetters([
        'detailFundings',
      ]),
      fundingsData () {
        return this.detailFundings.list ? this.detailFundings.list : [];
      },
    },
    components: {
      AppTable,
      AppCollapse,
    }
  }
</script>
<style lang="scss" scoped></style>