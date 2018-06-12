<!-- 快速筛选 -->
<template>
  <div>
  <div v-if="!show" style="padding: 5px; padding-left: 20px; font-size: 12px; color: #ccc;">暂时没有快速筛选项...</div>
  <div class="app-filter" v-show="show">
  	<div :class="index === multipled_index ? 'app-filter-row app-filter-row-multipled' : 'app-filter-row'" v-for="(row, index) in filterList" :key="row.key" v-if=" !screenControl.get(row.key) && row.items.length != 0 ">
  		<div class="app-filter-label">
  			{{ row.label }}
  		</div>
  		<template v-if="index !== multipled_index">
	  		<div class="app-filter-items">
	  			<template v-if="row.tidy && row.tidy.length != 0">
	  				<template v-if="more[row.key]">
	  					<template v-for="(item, ind) in row.items">
                <el-button type="text" :key="ind" style="margin-left: 15px; margin-top: 10px;" @click="handleClick(row, item)" size="small">{{ `${item.label}(${item.count})` }}</el-button>
              </template>
	  				</template>
	  				<template v-else>
	  					<template v-for="(item, ind) in row.tidy">
                <el-button type="text" :key="ind" style="margin-left: 15px; margin-top: 10px;" @click="handleClick(row, item)" size="small">{{ `${item.label}(${item.count})` }}</el-button>
              </template>
	  				</template>
	  			</template>
	  			<template v-else>
            <template v-for="(item, ind) in row.items">
					      <el-button type="text" :key="ind" style="margin-left: 15px; margin-top: 10px;" @click="handleClick(row, item)" size="small">{{ `${item.label}(${item.count})` }}</el-button>
            </template>
	  			</template>
	  			
	  		</div>
	  		<div class="app-filter-btns">
	  			<template v-if="row.tidy && row.tidy.length != 0">
	  				<el-button v-if="!(more[row.key])" @click="more[row.key] = true" size="mini" icon="caret-bottom">更多</el-button>
	  				<el-button v-else-if="more[row.key]" @click="more[row.key] = false" size="mini" icon="caret-top">收起</el-button>
	  			</template>
	  			
	  			<el-button v-if="row.multipled" size="mini" icon="plus" @click="handleMultipled(index)">多选</el-button>
	  		</div>
  		</template>
  		<template v-else-if="index === multipled_index">
  			<div class="app-filter-items">
				  <el-checkbox-group v-model="checkList">
  					<el-checkbox v-for="(item2, ind2) in row.items" :label="ind2" :key="ind2">{{ item2.label }}</el-checkbox>
					</el-checkbox-group>
					<div style="text-align: center">
					<el-button size="small" type="danger" :disabled="checkList.length == 0 ? true : false" @click="handleSure(row)">确认</el-button>
					<el-button size="small" @click="handleCancel">取消</el-button>
					</div>
				</div>
  		</template>
  	</div> 		
  </div>
  </div>
</template>

<script>
//###数据格式 begin###
/*data = [
  {
    label: '行头', //左侧表头
    key: 'key', //后台关键词
    tidy: [], //同items格式相同,用于显示缩略项
    items: [
      {
        label: '数据1', //右侧数据项
        value: 'value', //数据项的值
        count: 1, //当前数量
      },
      {
        label: '数据2',
        value: 'value2',
        count: 2,
      }
    ],
    multipled: true, //是否多选, 默认false

  }
]*/
//###数据格式 end#####
import {mapGetters} from 'vuex'
import {mapActions} from 'vuex'

export default {
  name: 'appFilter',
  props: ['data'],
  data () {
  	return {
  	  multipled_index: -1,
      checkList: [],
      more: {},
  	}
  },
  methods: {
    ...mapActions([
      'addScreen',
      'setScreenVisible',
    ]),
    init () {
      const list = this.filterList;
      const more = {};
  
      for(let a of list) {
        if(a["key"] && a["tidy"] && a["tidy"]["length"] != 0) {
          more[a["key"]] = false;
        }
      }
      this.more = more;
    },
  	handleClick (row, item) {

  		const name = row.label;
  		const key = row.key;
  		const items = [item];

  		this.addScreen({name, key, items});
      this.setScreenVisible(true);
      this.$nextTick(() => {
        this.setScreenVisible(false);
      });
      
  	},
  	handleMultipled (index) {
  		const d = this;
  		
  		d.multipled_index = index;
  		d.checkList.length = 0;
  	},
  	handleCancel () {
  		const d =this;

  		d.multipled_index = -1;
  		d.checkList.length = 0;
  	},
  	handleSure (row) {
  		const d = this;
      const set = new Set(this.checkList);

  		const name = row.label;
  		const key = row.key;
  		const items = row.items.filter((item, index)=>set.has(index));

      this.addScreen({name, key, items});

      d.multipled_index = -1;
  		d.checkList.length = 0;
  	},
  	handleMore (key, flag) {
  		const d = this;
  		d["more"][key] = flag;
  	}
  },
  computed: {
    ...mapGetters([
      'screenControl', //filter-cache
    ]),
  	show () {
  		let flag = false;
  		for(let d of this.data) {
  			if( !this.screenControl.get(d["key"]) && d.items && d.items.length != 0 ) {
  				flag = true;
  				break;
  			}
  		}

  		return flag;
  	},
    filterList () {
      const filterList = [];
      for(let a of this.data) {
        const arr = [];
        for(let t of a.items) {
          arr.push({
            label: t.label !== undefined ? t.label : '', 
            value: t.value !== undefined ? t.value : '',
            count: t.count !== undefined ? t.count : 0,
          });
        }
        filterList.push(Object.assign({}, a, {items: arr}));
      }

      return filterList;
    },
  },
  created () {
    this.init();
  },
  watch: {
    filterList () {
      this.init();
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@mixin top_radius($radius) {
	border-top-left-radius: $radius;
	border-top-right-radius: $radius;
}
.app-filter {
	width: 100%;
	background-color: #deedf6;
	@include top_radius(4px);
	position: relative;
}
.app-filter {
	width: 100%;
}

.app-filter-row {
	position: relative;
	overflow: hidden;
	border-bottom: 1px solid #ddd;
	border-right: 1px solid #ddd;
  border-left: 1px solid #ddd;
}
.app-filter-row:first-child {
	border-top: 1px solid #ddd;

	@include top_radius(4px);
}
.app-filter-row:first-child .app-filter-label {
	@include top_radius(4px);
}


.app-filter-label {
	width: 100px;
	float: left;
	
	padding-top: 10px;
	padding-left: 10px; 
	font-size: 14px;
	font-weight: bold;
	color: #707070;
}
.app-filter-items {
	margin-left: 110px;
	padding-right: 130px;
	min-height: 40px;
	/*line-height: 40px;*/
	background-color: #f3f5f6;
}
.app-filter-btns {
	position: absolute;
	top: 5px;
	right: 10px;
}
.app-filter-item {
    font-size: 13px;
    margin-left: 20px;
    color: #005aa0;
    cursor: pointer;
}
.app-filter-item:hover {
	color: #e4393c;
}
.el-checkbox {
	color: #005aa0;
	margin-left: 20px;
}
</style>