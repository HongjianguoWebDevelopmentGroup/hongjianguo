<template>
<div>
	<div style="padding: 10px;"><el-tag>群组号：{{ detailBasePatent ? detailBasePatent.group_number : '' }}</el-tag></div>
	<app-table :columns="columns" :data="detailGroup"></app-table>
	<div style="padding: 10px;"><el-tag>专利族号：{{ detailBasePatent ? detailBasePatent.family_number : '' }}</el-tag></div>
	<app-table :columns="columns" :data="detailFamily"></app-table>
</div>
</template>
<script>
import AppTable from '@/components/common/AppTable'
import {mapGetters} from 'vuex'
export default {
	name: 'groupFamily',
	data () {
		return {
			columns: [
				{type: 'text', label: '案件号', prop: 'serial'},
				{type: 'text', label: '专利标题', prop: 'title'},
				{
					type: 'text', 
					label: '地区', 
					prop: 'area',
					render_text: _=>this.areaMap.get(_),
				},
			],
		};
	},
	computed: {
		...mapGetters ([
			'detailBasePatent',
			'detailGroup',
			'detailFamily',
			'areaMap',
		]),
	},
	components: {
		AppTable,
	}
}
</script>