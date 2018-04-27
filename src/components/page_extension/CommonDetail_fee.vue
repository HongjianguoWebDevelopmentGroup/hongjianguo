<template>
  <div class="main">
  	<div class="total" style="margin: 15px 5px;font-size: 16px;">
  		<span>总支出：{{ expend }}CNY</span>
  		<span>总收入：{{ income }}CNY</span>
  	</div>
	<detail-official></detail-official>
	<detail-agency></detail-agency>
	<detail-fundings></detail-fundings>
	<detail-annual></detail-annual>
  </div>
</template>

<script>
import TableComponent from '@/components/common/TableComponent' 
import DetailFundings from '@/components/page_extension/CommonDetail_fundings'
import DetailOfficial from '@/components/page_extension/CommonDetail_OfficialFee'
import DetailAgency from '@/components/page_extension/CommonDetail_AgencyFee'
import DetailAnnual from '@/components/page_extension/CommonDetail_AnnualFee'
import { mapGetters } from 'vuex'

export default {
  name: 'commonDetailFee',
  data () {
		return {			
		  option: {
		  	'is_search': false,
				'columns': [
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
					// { 
					// 	type: 'action',
					// 	btns: [
					// 		{ type: 'edit', click: ()=>{alert('编辑')} },
					// 		{ type: 'delete', click: ()=>{alert('删除')} },
					// 	],
					// }
				],	  
		  }
		}
  },
  computed: {
  	...mapGetters([
  		'detailFundings',
  		'detailOfficial',
  		'detailAgency'
  	]),
  	expend () {
  		return this.detailOfficial && this.detailAgency ? (this.detailOfficial.sum + this.detailAgency.sum) : '';
  	},
  	income () {
  		return this.detailFundings ? this.detailFundings.sum : '';
  	},
  	// tableData () {
  	// 	return this.$store.getters.detailFees;
  	// }
  },
  components: { 
  	TableComponent,
  	DetailFundings,
  	DetailOfficial,
  	DetailAgency,
  	DetailAnnual,
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>