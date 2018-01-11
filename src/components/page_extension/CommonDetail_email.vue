<template>
  <div class="main">
		<app-table :columns="columns" :data="tableData" @row-click="handleRowClick"></app-table>
		<email-detail ref="email_detail"></email-detail>
  </div>
</template>

<script>
import AppTable from '@/components/common/AppTable'
import EmailDetail from '@/components/page_extension/Email_detail'

export default {
  name: 'commonDetailEmail',
  data () {
		return {
	  	columns: [
	  		{ type: 'text', label: '发件人邮箱', prop: 'from', render_simple: 'label' },
	  		{ 
	  			type: 'array', 
	  			label: '收件人邮箱', 
	  			prop: 'to', 
	  			render: _=>_.map(_=>_.label), 
	  			sortable: true 
	  		},
	  		{ type: 'text', label: '邮件标题', prop: 'subject' },
	  		{ type: 'text', label: '发送时间', prop: 'mail_date' },
	  		{ type: 'text', label: '是否有附件', prop: 'attach', render: (h,item)=>h('span', item ? '是' : '否') },
	  	],
	  };
  },
  methods: {
  	handleRowClick ({id}) {
  		console.log('aaaaaaa')
  		this.$refs.email_detail.show(id);
  	}
  },
  computed: {
  	tableData () {
  		return this.$store.getters.detailMails;
  	}
  },
  components: { 
  	AppTable, 
  	EmailDetail, 
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>