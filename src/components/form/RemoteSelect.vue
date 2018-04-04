<template>
  <div id="select_list">
  	<el-select
  	  :value="value2"
  	  @input="handleInput"
  	  filterable
  	  remote
  	  :placeholder="PLACEHOLDER"
  	  :disabled="disabled"
  	  :remote-method="remoteMethod"
  	  :loading="loading"
      :allow-create="allowCreate"
      :default-first-option="choose.defaultFirstOption !== undefined ? choose.defaultFirstOption : false"
  	  :multiple="!single"
  	  ref="select"
      :no-data-text="noDataText" 
  	  @visible-change.once="initialization"
  	>
  		<el-option
  			v-for="item in option_in"
  			:key="item.id"
  			:label="item.name"
  			:value="item.id"
  		>
  		</el-option>
  	</el-select>
  </div>
</template>

<script>
import AxiosMixins from '@/mixins/axios-mixins'

const map = new Map([
	['member', {
		URL: '/api/members',
		DATA_KEY: 'members',
		PLACEHOLDER: '请输入用户关键词',
	}],
	['applicant', {
		URL: '/api/applicants',
		DATA_KEY: 'applicants',
		PLACEHOLDER: '请输入申请人关键词',
	}],
	['inventor', {
		URL: '/api/inventors',
		DATA_KEY: 'data',
		PLACEHOLDER: '请输入发明人关键词',
	}],
	['agent', {
		URL: '/api/agents',
		DATA_KEY: 'members',
		PLACEHOLDER: '请输入代理人关键词',
	}],
	['agency', {
		URL: '/api/agencies',
		DATA_KEY: 'agencies',
		PLACEHOLDER: '请输入代理机构关键词',
	}],
  ['project', {
    URL: '/api/projects',
    DATA_KEY: 'projects',
    PLACEHOLDER: '请输入案件关键词',
  }],	
  ['progress', {
		URL: '/api/progress',
		DATA_KEY: 'progress',
		PLACEHOLDER: '请输入状态关键词',
    PARAMS: { category: 1 },
	}],
	['proposal', {
		URL: '/api/proposals',
		DATA_KEY: 'proposals',
		PLACEHOLDER: '请输入提案关键词',
	}],
	['patent', {
		URL: '/api/projects',
		DATA_KEY: 'projects',
		PLACEHOLDER: '请输入专利关键词',
		PARAMS: { category: 1 },
	}],
  ['trademark', {
    URL: '/api/projects',
    DATA_KEY: 'projects',
    PLACEHOLDER: '请输入商标关键词',
    PARAMS: { category: 2 },
  }],
	['copyright', {
		URL: '/api/projects',
		DATA_KEY: 'projects',
		PLACEHOLDER: '请输入版权关键词',
		PARAMS: { category: 3 },
	}],
  ['bill', {
    URL: '/api/invoices',
    DATA_KEY: 'invoices',
    PLACEHOLDER: '请输入请款单关键词',
    PARAMS: { debit: 1 },
  }],
  ['pay', {
    URL: '/api/invoices',
    DATA_KEY: 'invoices',
    PLACEHOLDER: '请输入付款单关键词',
    PARAMS: { debit: 0 },
  }],
  ['mail', {
    URL: '/api/mailAddress',
    DATA_KEY: 'list',
    PLACEHOLDER: '请输入邮箱',
    dynamicCreate: true,
    defaultFirstOption: true,
  }],
  ['estimate', {
    URL: '/api/renewalestimate',
    DATA_KEY: 'data.data',
    PLACEHOLDER: '请选择年费评估单',
    handleData: _=>{
      return _.map(_=>({ id: _.id, name: _.number }));
    }
  }]
]);

export default {
  name: 'remoteSelect',
  props: {
    'value': [Number, String, Array, Object],
    'disabled': {
      type: Boolean,
      default: false,
    },
    'multiple': {
      type: Boolean,
      default: false,
    },
  	'type': [String, Object],
    'para': {
      type: Object,
      default () {return {}},
    },
    'single': {
      type: Boolean,
      default: false,
    },
    'staticMap': {
      type: Array,
      default () { return [] },
    },
    'noDataText':{
      type: String,
      default: '无数据',
    }
  },
  data () {
  	return {
      options: [],
      loading: false, 
  		selected: [],
  	};
  },
  methods: {
    handleInput (val) {
      if(!this.multiple && !this.single) {
        let v = '';
        if(val[0] && val[1]) {
          v = val[1];
        }
        if(val[0] && !val[1]) {
          v = val[0];
        }
        this.$emit('input', v);  
      }else {
        this.$emit('input', val);
      }
    },
  	initialization () {
      this.remoteMethod('');       
  	},	
  	getSelected () {
  		return this.selected;
  	},
    refreshSelected (val) {
      val = this.single ? [val] : val;
      //通过staticMap传入静态对象
      if(this.staticMap.length > 0) {
        this.selected = this.staticMap;
      }
      //直接传入对象 之后自动处理
      if( val[0] && val[0] instanceof Object ) {
        
        this.selected = val;
        const arr = val.map(_=>_.id);
        if(this.multiple) {
          this.$emit('input', arr);
        }else {
          this.$emit('input', arr[0])
        }

      }else {
        //selected通过map映射
        const arr = [];
        console.log(val);
        val.forEach(_=>{
          //在map中搜索, 若不存在，则自定义
          const v = this.map.get(_);
          
          if(v) {
            arr.push(v);
          }else if(_ != ''){
            arr.push({id: _, name: _}); 
          }
        });

        this.selected = arr;
      }
    },
    remoteMethod (keyword) {
     
      const s = { keyword, listOnly: '1' };
      const os = this.PARAMS;
      const key = this.DATA_KEY;
      const url = this.URL;
      const h = this.choose.handleData;
      const data = os ? Object.assign({}, s, os) : s;
      const success = _=>{
        this.loading = false;
        let op = this.$tool.safeGet(_, key);
        if(!op) return this.options = [];

        op = op.map(_=>{
          if(!_.name) _.name = _.label;
          if(!_.id) _.id = _.value;
          return _;
        });
        this.options = h ? h(op) : op;
      }

      this.loading = true;
      this.$axiosGet({url, data, success});
    },
    clear (flag = true) {
      this.selected = [];
      this.multiple ? this.$emit('input', []) : this.$emit('input', '');
      if(flag) {
        this.remoteMethod(''); 
        
      }
    }
  },
  computed: {
  	choose () {
  		if(typeof this.type == 'string') {
  			return map.get(this.type);	
  		}else {
  			return this.type;
  		}		
  	},
    allowCreate () {


      if(this.choose.allowCreate) {
        return true;
      }


      if(this.choose.dynamicCreate && this.options.length == 0) {
        return true;
      }

      return false;
    },  
  	URL () {
  		return this.choose.URL;
  	},
  	DATA_KEY () {
  		return this.choose.DATA_KEY;
  	},
  	PLACEHOLDER () {
  		return this.choose.PLACEHOLDER;
  	},
  	PARAMS () {
      let obj = {};

      if(this.para) {
        Object.assign(obj, this.para);
      }
      if(this.choose.PARAMS) {
        Object.assign(obj, this.choose.PARAMS);
      }

  		return obj;
  	},
  	option_in () {
      //将已经选择的OPTION合并到查询OPTION中
  		const arr = [ ...this.selected, ...this.options ];
      //对象去重(ID)
  		return this.$tool.singleObject(arr,'id');
  	},
  	map () {
  		//有选项获取映射关系 为了方便在更新selected的时候 快速查询
  		const map = new Map();
      this.option_in.forEach(_=>map.set(_.id, _));
  		return map;
  	},
    value2 () {

      if(!this.multiple && !this.single) {
        
        return this.value == "" || (this.value instanceof Object && this.$tool.getObjLength(this.value) == 0 ) ? [] : [ this.value ];
      }else {
        return this.value;
      }
    }
  },
  watch: {
  	value2 (val) {
      // console.log('-------------val');
      // console.log(val);
      // console.log('-------------val');
      //value类型为对象时，添加静态映射，并将其值转为id
      if( !this.single ) {
      // if( !this.multiple && !this.single && this.$refs.select) {
        this.$refs.select.visible = false;
      }

      this.refreshSelected(val);   

  	}
  },
  created () {
    this.refreshSelected(this.value2);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
<style>
#select_list .el-tag {
  min-height: 24px; 
  white-space: pre-wrap;
  padding: 0 20px 0 5px;
}
#select_list .el-select .el-tag{
  height: auto;
  min-height: 24px;
  line-height: 24px;
  box-sizing: border-box;
  margin: 3px 0 3px 6px;
  max-width: 100%;
  word-wrap: break-word;
  word-break: break-all;
  position: relative;
}
#select_list .el-tag .el-icon-close {
    border-radius: 50%;
    text-align: center;
    position: absolute;
    cursor: pointer;
    font-size: 12px;
    -ms-transform: scale(.75,.75);
    transform: scale(.75,.75);
    height: 18px;
    width: 18px;
    line-height: 18px;
    vertical-align: middle;
    top: 5px;
    right: 0px;
}
#select_list .el-select__input {
    border: none;
    outline: 0;
    padding: 0;
    margin-left: 10px;
    color: #666;
    font-size: 14px;
    vertical-align: baseline;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
     height: 16px; 
    background-color: transparent;
}
</style>