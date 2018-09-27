<template>
  <div>
		<el-row class="filter-sort">
			<el-col :span="24">
			  	<span style="display: block; width: 100%;height: 30px;line-height: 30px;font-size: 14px;" @click="handleSort('asc')">升序</span>
			  	<span style="display: block; width: 100%;height: 30px;line-height: 30px;font-size: 14px;" @click="handleSort('desc')">降序</span>
			</el-col>
		</el-row>
		<el-row class="common" v-if="source.type!='date'">
			<el-col :span="24">
	  	 		<static-select type="text_filter_relate" v-model="contain_relate"></static-select>
	  	 	</el-col>
		</el-row>				
		<el-row class="common">
			<el-col :span="24">
				<filter-condition  :source="source" v-model="filters[source.id]" ref="filterCondition"></filter-condition>
	  	 	</el-col>
		</el-row>
		<el-row>
			<el-col :span="24">
				<el-button type="primary" @click="handleFilter">确定</el-button>
				<el-button @click="cancle">取消</el-button>
			</el-col>
		</el-row>
  </div>	
</template>
<script>
import StaticSelect from '@/components/form/StaticSelect'
import FilterCondition from '@/components/common/FilterCondition'
import {map as filterConfig } from '@/const/headerFilterConfig'	
import {mapActions} from 'vuex'

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
  	  	value:'',
  	  	filters:{},
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
		// console.log(map);
		return map
	},
	source () {
		//  其中一个配置项的值
		const val = this.filterSettingMap.get(this.field);
		return val ? val : null;
	},
  },
  methods: {
  	...mapActions([
  		'addListFilter',
  		'fillListFilter',
  	]),
    handleDynamicData () {
    	// 初始化filters对象
      this.filterSetting.forEach(_=>{
        const item = this.getDefaultValue(_.id);
        this.$set(this.filters,_.id,item);
      });
      console.log(this.filters);
      return this.filters;
    },  	
  	handleSort (order) {
  		const sort = `${this.field}-${order}`;	
  		this.$emit('order',sort);
  	},
  	handleInput (val) {
  		console.log(val);
  		this.value = val;
  	},
    clearRenderHeaderField (key) {
      console.log('调用我')
      this.filters[key] = this.getDefaultValue(key); 
      console.log(this.filters[key]);
    },   	
  	handleFilter () {
  		const obj = {};
		const name = this.source.name;
		const key =  this.field;
		let [label,value]= [null,null];
		if(this.source.type == "date" || this.source.type == "text") {
			value = this.filters[this.source.id];
			label = this.$refs.filterCondition.getLabel();
		}else if(this.source.type == 'static_select' || this.source.type == 'remote_select') {
  			const nodeArr =	this.$refs.filterCondition.getCheckedNodes();
			value = this.$tool.splitObj(nodeArr,'id');
			label = this.$tool.splitObj(nodeArr,'name');
		}
		 obj[key] = { name, key, label, value };
		this.fillListFilter(obj);
	},
    getDefaultValue (key) {
      const item = this.filterSettingMap.get(key)
      let val = ''
	  if(item.type == 'date' ) {
        val = ['','']
      } else if(item.type == 'text') {
        val = ''
      } else if(item.type == 'static_select' || item.type == 'remote_select') {
        val = []
      }
      return val
    },		
	cancle() {
		this.$emit('popover');
		// console.log(this.$refs);
		
	},
  },
  created () {
  	this.handleDynamicData();
  	window.listHeaderFilter = this;
  },
  destroyed() {
    window.listHeaderFilter = null;
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