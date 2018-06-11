<template>
  <div class="main">
  	<div class="total" style="margin: 0px 5px 15px 5px;font-size: 16px;">
  		<el-tag>总支出：{{ expend }}CNY</el-tag>
  		<el-tag>总收入：{{ income }}CNY</el-tag>
  	</div>

  	<app-collapse :col-title="`官费(总计：${detailOfficial.sum?detailOfficial.sum:'0'}CNY)`">
      <app-table :columns="columns" :data="detailOfficial.list?detailOfficial.list : []"></app-table>
   	</app-collapse>

    <app-collapse :col-title="`代理费及撰写奖励(总计：${detailAgency.sum?detailAgency.sum:'0'}CNY)`">
      <app-table :columns="columns" :data="detailAgency.list ? detailAgency.list : []"></app-table>
    </app-collapse>

    <app-collapse :col-title="`发明人奖励(总计：${detailInventorBonus.sum?detailInventorBonus.sum:'0'}CNY)`">
      <app-table :columns="columns" :data="detailInventorBonus.list ? detailInventorBonus.list : []"></app-table>
    </app-collapse>
   
    <app-collapse :col-title="`政府资助及专利奖(总计：${detailFundings.sum?detailFundings.sum:'0'}CNY)`">
      <app-table :columns="columns" :data="detailFundings.list ? detailFundings.list : []"></app-table>
    </app-collapse>   
    
    <app-collapse :col-title="`监控中的年费(总计：${detailAnnual.sum?detailAnnual.sum:'0'}CNY)`">
      <app-table :columns="columns2" :data="detailAnnual.list ? detailAnnual.list : []"></app-table>
    </app-collapse>
    
  </div>
</template>

<script>
import AppTable from '@/components/common/AppTable'
import AppCollapse from '@/components/common/AppCollapse'
import { mapGetters } from 'vuex'

export default {
  name: 'commonDetailFee',
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
		  columns2:[
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
			{ type: 'text', label: '截止日期', prop: 'deadline', width: '120'},
			{ type: 'text', label: '状态', prop: 'status', width: '90'},
			{ type: 'text', label: '备注', prop: 'remark', min_width: '90'},
			],
		};
  },
  computed: {
  	...mapGetters([
  		'detailFundings',
  		'detailOfficial',
  		'detailAgency',
  		'detailAnnual',
  		'detailInventorBonus',
  	]),
  	expend () {
  		return this.detailOfficial && this.detailAgency ? (this.detailOfficial.sum + this.detailAgency.sum + this.detailInventorBonus.sum) : '0';
  	},
  	income () {
  		return this.detailFundings ? this.detailFundings.sum : '0';
  	},
/*  	tableData () {
  		return this.$store.getters.detailFees;
  	}*/
  },
  components: { 
  	AppCollapse,
  	AppTable,
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>