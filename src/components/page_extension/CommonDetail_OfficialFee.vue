<template>
   <app-collapse :col-title="`官费(总计：${detailOfficial.sum?detailOfficial.sum:'0'}CNY)`">
    <app-table :columns="columns" :data="officialData"></app-table>
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
        'detailOfficial',
      ]),
      officialData () {
        return this.detailOfficial.list ? this.detailOfficial.list : []; 
      },
    },
    components: {
      AppTable,
      AppCollapse,
    }
  }
</script>
<style lang="scss" scoped></style>