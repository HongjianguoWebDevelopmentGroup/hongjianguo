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
	  		// { type: 'text', label: '发件人邮箱', prop: 'from', render_simple: 'label' },
	  		{ 
	  			type: 'array', 
	  			label: '收件人邮箱', 
	  			prop: 'to', 
	  			render: _=>_.map(_=>_.label), 
	  			sortable: true,
          width: '260', 
	  		},
	  		{ type: 'text', label: '邮件标题', prop: 'subject', render: this.attachmentRender},
	  		{ type: 'text', label: '发送时间', prop: 'mail_date', width: '200'},
	  	],
	  };
  },
  methods: {
  	handleRowClick ({id}) {
  		console.log('aaaaaaa')
  		this.$refs.email_detail.show(id);
  	},
    attachmentRender (h,item,row) {
      return (
       <span>
          { row.attach?<el-tooltip effect="dark" content="有附件" placement="top">
            <i class="table-flag" style="background-color: #008B8B;margin-right:10px;"></i>  
          </el-tooltip> : '' } 
            <span>{ item }</span>
        </span>
      )
    },
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