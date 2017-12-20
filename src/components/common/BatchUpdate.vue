<template>
<div>
	<el-select v-model="select" placeholder="请选择需要更新的字段">
		<el-option
			v-for="item in config.selection"
			:key="item.value"
			:value="item.value"
			:label="item.label"
		></el-option>
	</el-select>
	<el-table
    :data="tableData"
    stripe
    style="width: 100%">
    <el-table-column v-for="item in columns" :key="item.prop" :prop="item.prop" :label="item.label"></el-table-column>
  </el-table> 
	<upload></upload>
	<el-button type="primary" >确认更新</el-button>
</div>
</template>
<script>

import Upload from '@/components/form/Upload'

const arr = [
	['patent', {
		default: 'result',
		selection: [
			{label: '评审结果', value: 'result'},
			{label: '年费评审', value: 'fee'},
		],
		columns: {
			'result': [
				{ label: '案件号', prop: 'serial'},
				{ label: '评审结果一', prop: 'result1'},
				{ label: '评审结果二', prop: 'result2'},
				{ label: '评审结果三', prop: 'result3'},
			],
			'fee': [
				{ label: '案件号', prop: 'serial'},
				{ label: '年费评审', prop: 'fee'},
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
		}
	},
	computed: {
		config () {
			let config = {};
			if(this.type) {
				config = map.get(this.type);
			}
			return config;
		}
	},
	created () {
		this.select = this.config.default;
	},
	watch: {
		select (val) {
			this.refreshRender = false;
			this.tableData = [];
			this.columns = this.config.columns[val];

			this.$nextTick(_=>{
				this.refreshRender = true;
			})
		}
	},
	components: {
		Upload,
	}
}
</script>