<template>
  <report-view :para="para" style="box-sizing: border-box;padding-top: 20px;padding-left: 10px;"></report-view>
</template>
<script>

import ReportView from '@/components/page_extension/Report_view'

export default {
	name: 'reportDetail',
	props: {
		currentRow: {
			type: null,
			default: '',
		}
	},
	data () {
		return {
			para: '',
		};
	},
	computed: {
		reportType () {
			return this.currentRow ? this.para.report_type : '';
		},
		tableType () {
			return this.currentRow ? this.para.table_type : '';
		}
	},
	methods: {
		refresh () {
			if(!this.currentRow) return;
			this.para = this.$tool.shallowCopy(this.currentRow, {skip: ['id','creator_id','creator','create_time','title']});
		}
	},
	mounted () {
		this.refresh();
	},
	watch: {
		currentRow () {
			this.refresh();
		}
	},
	components: {
		ReportView,
	},
}
</script>