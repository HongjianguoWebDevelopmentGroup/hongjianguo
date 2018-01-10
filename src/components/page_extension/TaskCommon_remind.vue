<template>
	<div v-loading="loading">
		<table-component :tableOption="option" :data="tableData"></table-component>
		<email-detail ref="email_detail"></email-detail>
	</div>
</template>

<script>
import TableComponent from '@/components/common/TableComponent'
import EmailDetail from '@/components/page_extension/Email_detail'
export default {
	name: 'TaskCommonRemind',
	props: {
		'id': [Number, String],
		'action': {
			type: String,
			default: 'remind',
		}
	},
	data () {
		return {
			option: {
				name: 'remindList',
				is_header: false,
				is_border: false,
				is_pagination: false,
				columns: [
					{ type: 'text', label: '提醒备注', prop: 'remark' },
					{ type: 'text', label: '提醒时间', prop: 'create_time' },
					{ type: 'text', label: '提醒人', prop: 'member', render_simple: 'name' },
				],
				'rowClick': this.handleRowClick,
			},
			tableData: [],
			loading: false,
			requested: false,
		};
	},
	methods: {
		refreshTable: async function () {
			if(this.action != 'remind') return;
			this.loading = true;
			await this.$axiosGet({url: `/api/tasks/${this.id}/remind`, success: _=>{this.tableData = _.data;}})
			this.loading = false;
			this.requested = true;
		},
		handleRowClick ({mail_id}) {
  		this.$refs.email_detail.show(mail_id);
  	}
	},
	created () {
		this.refreshTable();
	},
	watch: {
		id () {
			this.requested = false;
			this.refreshTable();
		},
		action () {
			if(this.requested) return;
			this.refreshTable();
		}
	},
	components: {
		TableComponent,
		EmailDetail,
	},

}
</script>