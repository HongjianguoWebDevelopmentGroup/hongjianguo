<template>
   <app-collapse :col-title="`官费(总计：${detailOfficial.sum?detailOfficial.sum:''}CNY)`">
    <app-table :columns="columns" :data="detailOfficial.list"></app-table>
   </app-collapse> 
</template>
<script>
import AppTable from '@/components/common/AppTable'
import AppCollapse from '@/components/common/AppCollapse'
import { mapGetters } from 'vuex'
  export default {
    name: 'commonDetailOfficialFee',
    data () {
      return {

      	  columns:[
      	    { type: 'text', label: '费用名称', prop: 'name', min_width: '160'},
      	    { type: 'text', label: '外币金额',  prop: 'amount', width: '100', align: 'right',
              render:(h,item,row)=>{
                if( row.roe == 1 ){
                   return h('span','N/A');
                }else{
                   return h('span',`${item}${row.currency}`);
                }
              } 
            },
            { type: 'text', label: '汇率', prop: 'roe', width: '80', align: 'right',
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
            { type: 'text', label: '付款日期', prop: 'pay_date', width: '160'},
            { type: 'text', label: '状态', prop: 'status', width: '110'},
            { type: 'text', label: '备注', prop: 'remark', width: '160'},
      	  ],
      }
    },
    computed: {
    	...mapGetters([
    		'detailOfficial',
    	]),
    },
    components: {
      AppTable,
      AppCollapse,
    }
  }
</script>
<style lang="scss" scoped></style>