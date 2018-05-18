<template>
	<el-dialog :visible.sync="dialogVisible" class="dialog-small" title="附件详情" :modal="false">
		<app-table :columns="uploadColumns" :data="uploadData"></app-table>
	</el-dialog>
</template>
<script>
import AppTable from '@/components/common/AppTable'
export default {
	name: 'attachmentsDetaill',
	data () {
		return {
			uploadData: [],
			uploadColumns: [	
				{ type: 'text', label: '文件名称', prop: 'name', min_width: '120'},
	      { type: 'text', label: '上传日期', prop: 'create_time', min_width: '120'},
	      { type: 'text', label: '上传人', prop: 'uploader', min_width: '100'},
	      { type: 'text', label: '大小', prop: 'size', min_width: '80'},
	      { 
	        type: 'action',
	        label: '操作',
	        fixed: false,
	        min_width: '120',
	        btns: [
	          { type: 'download', click: ({downloadUrl})=>{window.open(downloadUrl)}},  
	        ]
	      }
	    ],
	    dialogVisible: false,
		};		
	},
	methods: {
		show (data) {
			this.dialogVisible = true;
			this.uploadData = data;
		}
	},
	components: {
		AppTable,
	}
}
</script>