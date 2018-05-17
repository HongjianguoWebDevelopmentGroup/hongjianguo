<template>
   <app-collapse :col-title="`代理费及撰写奖励(总计：${detailAgency.sum?detailAgency.sum:'0'}CNY)`">
     <app-table :columns="columns" :data="agencyData"></app-table>
   </app-collapse> 
</template>
<script>
import AppTable from '@/components/common/AppTable'
import AppCollapse from '@/components/common/AppCollapse'
import { mapGetters } from 'vuex'
  export default {
    name: 'commonDetailAgencyFee',
    data () {
      return {
          columns:[
            { type: 'text', label: '费用名称', prop: 'name', min_width: '145'},
            { type: 'text', label: '费用对象', prop: 'target', render_simple: 'name',},
            { type: 'text', label: '外币金额',  prop: 'amount', width: '100', 
              render:(h,item,row)=>{
                if( row.roe == 1 ){
                   return h('span','N/A');
                }else{
                   return h('span',`${item}${row.currency}`);
                }
              } 
            },
            { type: 'text', label: '汇率', prop: 'roe', width: '70', 
              render:(h,item)=>{
                if( item == 1 ){
                  return h('span','N/A');
                }else{
                  return h('span',item);
                } 
              }
            },
            { type: 'text', label: '人民币金额', prop: 'rmb', width: '120', 
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
        'detailAgency',
      ]),
      agencyData () {
        return this.detailAgency.list ? this.detailAgency.list : [];
      },
    },
    components: {
      AppTable,
      AppCollapse,
    }
  }
</script>
<style lang="scss" scoped></style>