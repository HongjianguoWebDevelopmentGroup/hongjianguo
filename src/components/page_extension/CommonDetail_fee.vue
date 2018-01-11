<template>
  <div class="main">
		<app-table :columns="columns" :data="tableData"></app-table>
  </div>
</template>

<script>
import AppTable from '@/components/common/AppTable' 

export default {
  name: 'commonDetailFee',
  data () {
		return {			
			columns: [
				{ type: 'text', label: '费用金额', prop: 'amount',width: '120',},
				{ type: 'text', label: '费用名称', prop: 'fee_name',width: '240',},
				{ type: 'text', label: '人民币', prop: 'rmb',width: '120',},
				{ type: 'text', label: '汇率', prop: 'roe',width: '120',},
				{ type: 'text', label: '货币', prop: 'currency',width: '120',},
				{ type: 'text', label: '创建时间', prop: 'create_time' ,width: '240',},
				{ type: 'text', label: '付款时间', prop: 'pay_time',width: '240',},
				{ type: 'text', label: '费用期限', prop: 'due_time',width: '240',},
				{ type: 'text', label: '法定期限', prop: 'deadline',width: '240',},
				{ type: 'text', label: '发文日', prop: 'mail_date',width: '240',},
				{ type: 'text', label: '收入类型', prop: 'debit_name',width: '120',},
				{ type: 'text', label: '费用备注', prop: 'remark',width: '120',},
				{ type: 'text', label: '费用状态', prop: 'status_name',width: '120',},
			],	  
		};
  },
  computed: {
  	tableData () {
  		return this.$store.getters.detailFees;
  	}
  },
  components: { 
  	AppTable,
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>