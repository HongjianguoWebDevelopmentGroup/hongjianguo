<template>
<div>
	<div v-if="detailBasePatent" style="padding: 10px;">
		<el-tag>群组号：{{  detailBasePatent.group_number }}</el-tag>
		<a v-if="detailBasePatent.group_number" :href="`#/patent/list?group_number=${detailBasePatent.group_number}`" target="_blank">群组详情</a>
	</div>
	<app-table :columns="columns" :data="detailGroup" height="default7"></app-table>
	<div v-if="detailBasePatent" style="padding: 10px;">
		<el-tag>专利族号：{{ detailBasePatent.family_number }}</el-tag>
		<a v-if="detailBasePatent.family_number" :href="`#/patent/list?family_number=${detailBasePatent.family_number}`" target="_blank">专利族详情</a>
	</div>
	<app-table :columns="columns" :data="detailFamily" height="default7"></app-table>
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