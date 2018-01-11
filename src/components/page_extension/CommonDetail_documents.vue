<template>
  <div class="main">
		<app-table :columns="columns" :data="tableData"></app-table>
  </div>
</template>

<script>
import AppTable from '@/components/common/AppTable' 

export default {
  name: 'commonDetailDocuments',
  data () {
		return {
		  columns: [
	  		{ type: 'text', label: '文件名称', prop: 'name' },
	  		{ type: 'text', label: '文件类型', prop: 'type' },
	  		{ type: 'text', label: '文件格式', prop: 'ext' },
	  		{ type: 'text', label: '文件大小', prop: 'size' },
	  		{ type: 'text', label: '上传人', prop: 'uploader' },
	  		{ type: 'text', label: '上传时间', prop: 'create_time' },
	  		{ type: 'action',
	  			width: '150',
	  			btns: [
	  				{ type: 'download', text: '下载', click: ({downloadUrl})=>{ window.location.href = downloadUrl; } },
	  				{ type: 'view', text: '查看', click: ({viewUrl})=>{window.open(viewUrl)} },
	  			] 
	  		}
	  	],
		}
  },
  computed: {
  	tableData () {
  		return this.$store.getters.detailDocuments; 
  	}
  },
  components: { 
  	AppTable, 
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>