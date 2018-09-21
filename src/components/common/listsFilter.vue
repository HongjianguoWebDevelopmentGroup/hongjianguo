<template>
  <div>
		<el-row class="filter-sort">
			<el-col :span="24">
			  	<span style="display: block; width: 100%;height: 30px;line-height: 30px;font-size: 14px;" @click="handleSort('asc')">升序</span>
			  	<span style="display: block; width: 100%;height: 30px;line-height: 30px;font-size: 14px;" @click="handleSort('desc')">降序</span>
			</el-col>
		</el-row>
		<el-row class="common">
			<el-col :span="24">
	  	 		<static-select type="text_filter_relate" v-model="contain_relate"></static-select>
	  	 	</el-col>
		</el-row>				
		<el-row class="common">
			<el-col :span="24">
				<filter-condition v-if="filterConditionVisible" :source="source"></filter-condition>
	  	 	</el-col>
		</el-row>
		<el-row>
			<el-col :span="24">
				<el-button type="primary">确定</el-button>
				<el-button >取消</el-button>
			</el-col>
		</el-row>
  </div>	
</template>
<script>
import StaticSelect from '@/components/form/StaticSelect'
import FilterCondition from '@/components/common/FilterCondition'
import {map as filterConfig } from '@/const/headerFilterConfig'	

export default {
  name: 'listsFilter',
  props:{
  	listType: {
  		type: String,
  		default: '',
  	},
  	field: {
  		type: String,
  		default: '',
  	},
  	filterConditionVisible: {
  		type: Boolean,
  		default: false,
  	},
  },
  data () {
  	return {
  	  	contain_relate: '',
  	  	search: '', 
  	}
  },
  computed: {
	filterSetting () { //自定义筛选配置项
		const data = filterConfig.get(this.listType);
		return data ? data : []
	},
	filterSettingMap () { //自定义筛选配置项映射
		const map = new Map();
		this.filterSetting.forEach(v => {
			map.set(v.id, v)
		})
		console.log(map);
		return map
	},
	source () {
		//  其中一个配置项的值
		const val = this.filterSettingMap.get(this.field);
		return val ? val : null;
	},
  },
  methods: {
  	handleSort (order) {
  		const sort = `${this.field}-${order}`;	
  		this.$emit('order',sort);
  	},
  },
  created () {

  },
  components:{
  	StaticSelect,
  	FilterCondition,
  }	
}
</script>
<style lang="scss" scoped>
.common {
	margin: 10px 0;
}
.filter-sort span:hover {
	background-color: #eef1f6;
	cursor: pointer;
}
</style>