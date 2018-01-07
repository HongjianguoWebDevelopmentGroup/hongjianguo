<template>
<div>
	<div>
		<a v-for="(item, index) in config.templates" :href="item.href" :key="index" style="margin: 10px; margin-top: 0;">{{ item.text }}</a>
	</div>
	<div>
		<el-upload
	  	v-for="item in config.btns"
	  	style="display: inline-block;margin: 10px;"
	  	:key="item.action"
	  	:action="`/api/files?action=${item.action}`"
	  	:show-file-list="false"
	  	:on-success="(response, file, fileList)=>{ handleUploadSuccess(item.action, {response, file, fileList}) }"
	  	:multiple="false"
	  >
	  	<el-button type="primary">{{ item.label }}</el-button>
		</el-upload>
	</div>
	
	<template v-if="uploadType ? true : false">
		<el-table
	    :data="tableData"
	    height="300px"
	    row-key="index"
	    stripe
	    style="width: 100%">
	    <el-table-column v-for="item in columns" :key="item.prop" :prop="item.prop" :label="item.label" :width="item.width"></el-table-column>
	  </el-table> 
		<el-button type="primary" @click="submitUpdate">确认更新</el-button>
	</template>
</div>
</template>
<script>

const URL = '/api/patentUpdate'

const arr = [
	['patent', {
		templates: [
		  { href: '/static/templates/annual_fields.xlsx', text: '年费评估模板' },
		  { href: '/static/templates/review_fields.xlsx', text: '专利评审模板' },
		],
		btns: [
			{label: '年费评估', action: 'getAnnual'},
			{label: '诉讼专利评审', action: 'getReview'},
		],
		columns: {
			'getAnnual': [
				{ label: '案件号', prop: 'serial', width: '200'},
				{ label: '标题', prop: 'title', width: '200'},
				{ label: '是否续费', prop: 'is_continue', width: '200'},
				{ label: '备注', prop: 'remark', width: '200'},
			],
			'getReview': [
				{ label: '案件号', prop: 'serial', width: '200'},
				{ label: '标题', prop: 'title', width: '200'},
				{ label: '权利要求范围', prop: 'claim_scope', width: '200'},
				{ label: '权利要求/稳定性', prop: 'claim_stability', width: '200'},
				{ label: '举证难易程度', prop: 'evidence_difficulty', width: '200'},
				{ label: '备注', prop: 'remark', width: '200'},
			]
		}
	}]
];
const map = new Map(arr);

export default {
	name: 'batchUpdate',
	props: ['type'],
	data () {
		return {
			columns: [],
			tableData: [],
			refreshRender: false,
			select: '',
			uploadType: '',
		}
	},
	computed: {
		config () {
			let config = {};
			if(this.type) {
				config = map.get(this.type);
			}
			return config;
		},
	},
	methods: {
		handleUploadSuccess (str, {response}) {
			const r = response;
			const d = r.data;
			if(r.status) {
				if(d.list && d.list.length != 0) {
					this.$message({type: 'success', message: response.info});
					this.uploadType = '';
					this.tableData = d.list;
					this.columns = this.config.columns[str];
					this.$nextTick(_=>{
						this.uploadType = str;
					})
				}else {
					this.$message({type: 'warning', message: '上传列表不存在或上传列表为空'});	
				}
				
			}else {
				this.$message({type: 'warning', message: response.info});
			}
		},
		submitUpdate () {
			const o = {
				'getAnnual': 'annual',
				'getReview': 'review',
			};
			this.$axiosPost({
				url: `${URL}/${o[this.uploadType]}`,
				data: {
					list: this.tableData,
				},
				success: _=> {
					this.$message({type: 'success', message: _.info});
				}
			})
		}
	},
}
</script>