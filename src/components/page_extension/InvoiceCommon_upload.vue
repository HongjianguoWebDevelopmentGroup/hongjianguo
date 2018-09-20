<template>
<div class="invoice-upload">
	<template>
		<slot name="fee_tips"></slot>
	</template>
	<app-table :columns="columns" :data="data" v-loading="tableLoading" element-loading-text="加载中..."></app-table>
	<div style="position: relative;">
		<el-dialog :visible.sync="dialogVisible" class="dialog-small" title="附件详情" :modal="false">
			<app-table :columns="uploadColumns" :data="uploadData"></app-table>
		</el-dialog>
	</div>
</div>
</el-tabs>
</template>
<script>
import AppTable from '@/components/common/AppTable'
import Upload from '@/components/form/Upload'

export default {
	name: 'uploadInvoice',
	data () {
		return {
			id: '',
			dialogVisible: false,
			uploadColumns: [
				{ type: 'text', label: '文件名称', prop: 'name', min_width: '120'},
				{ type: 'text', label: '上传日期', prop: 'create_time', min_width: '120'},
				{ type: 'text', label: '上传人', prop: 'uploader', min_width: '100', render_simple: 'name'},
				{ type: 'text', label: '大小', prop: 'size', min_width: '80'},
				{ 
				type: 'action',
				label: '操作',
				fixed: false,
				min_width: '120',
				btns: [
					{ type: 'download', click: ({downloadUrl})=>{window.open(downloadUrl)}},
					{ type: 'view', click:({viewUrl})=>{window.open(viewUrl)}}    
				]
				}
			],
			uploadData: [],
			columns: [
				{ type: 'text', label: '案号', prop: 'serial' },
				{ type: 'text', label: '案件名称', prop: 'title' },
				{ type: 'text', label: '费用类型', prop: 'code', render_simple: 'name' },
				{ type: 'text', label: '费用', prop: 'amount' },
				{ type: 'text', label: '审核意见', prop: 'remark_enterprise', width: '188' },
				{ 
					type: 'text', 
					label: '附件',
					width: '178', 
					prop: 'attachments',
					render: this.attachmentsRender,
				},
				{ 
					type: 'text',  
					fixed: true, 
					label: '', 
					prop: 'status', 
					width: '60',
					render: this.checkTypeRender
				},
			],
			data: [],
			tableLoading: false,
		};
	},
	computed: {
		
	},
	methods: {
		finish () {
			const url = `/invoices/${this.id}/complete`;
			const success = () => {
				this.$message({type: 'success', message: '完成上传成功'});
			};
			return this.$axiosPut({url, success});
		},
		render (id) {
			this.id = id;
			const url = `/fees`;
			const data = {
				listRows: 100,
				page: 1,
				fee_invoice: id,	
			};
			const success = (data) => {
				this.data = data.fees.data;
			};
			const complete = () => {
				this.tableLoading = false;
			};
			this.tableLoading = true;
			this.$axiosGet({url, data, success, complete});
		},
		refresh () {
			this.render(this.id);
		},
		checkTypeRender (h, item) {
			let yFlag = false;
			let nFlag = false;
			let color = '';
			console.log(item);
			if(item.id === 5) {
				yFlag = true;
				color = 'green';
			}

			return h('i', {
				class: {
					'el-icon-check': yFlag,
					'el-icon-close': nFlag,
				},
				style: {
					color,
				}
			});
		},
		attachmentsRender (h, item) {
			let body;
			
			if(item.length == 0) {
				body = '';
			}else if(item.length == 1) {
				const obj = {
					attrs: { href: item[0]['downloadUrl'] },
				};
				body = [h('a', obj, item[0].name )];
			}else if(item.length > 1) {
				body = [];
				const obj = {
					attrs: { href: item[0]['downloadUrl'] },
					style: { width: '120px', display: 'inline-block',overflow: 'hidden',textOverflow:'ellipsis',
					whiteSpace : 'nowrap' },
				};

				body.push(h('a', obj, item[0].name ));
				body.push(h('el-button', {
					props: {
						type: 'text',
						size: 'mini',
					},
					on: {
						click: () => {
							this.dialogVisible = true;
							this.uploadData = item;
						}
					}
				}, '更多'));
			}

			return h('span',{style:{display: 'flex',justifyContent:'flex-start',}}, body);
		}
	},
	components: {
		AppTable,
		Upload,
	}
}
</script>