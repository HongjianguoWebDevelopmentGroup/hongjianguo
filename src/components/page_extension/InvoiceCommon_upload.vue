<template>
<el-tabs v-model="activeName">
  <el-tab-pane label="官费" name="first">
  	<app-table :columns="govermentColumns" :data="govermentData"></app-table>
  </el-tab-pane>
  <el-tab-pane label="代理费" name="second">
  	<app-table :columns="agencyColumns" :data="agencyData"></app-table>
  </el-tab-pane>
</el-tabs>
</template>
<script>
import AppTable from '@/components/common/AppTable'
export default {
	name: 'uploadInvoice',
	data () {
		return {
			id: '',
			activeName: 'first',
			govermentColumns: [],
			govermentData: [],
			agencyColumns: [],
			agencyData: [],
		};
	},
	methods: {
		render (id) {
			this.id = id;
			const url = `/fees`;
			const data = {
				listRows: 100,
				page: 1,
				fee_invoice: id,	
			};
		},
		refresh () {
			this.render(this.id);
		}
	},
	components: {
		AppTable,
	}
}
</script>