<template>
  <div id="static_select">
    <el-select
      :value="value"
      @input="handleInput"
    	:multiple="multiple"
      :multiple-limit="multipleLimit"
    	:disabled="disabled"
      :placeholder="config.placeholder"
      filterable
      :size="size"
      :allow-create="config.allowCreate !== undefined ? config.allowCreate : false"
      :default-first-option="config.defaultFirstOption !== undefined ? config.defaultFirstOption : false"
      ref="select"
      clearable
      @change="handleChange"
    >
    	<el-option
    		v-for="item in optionsIn"
    		:key="item.id"
    		:label="item.name"
    		:value="item.id"
    	>
    	</el-option>
    </el-select>
  </div>
</template>


<script>

//-----------------------------配置数据分界线-----------------------------------------------

import AxiosMixins from '@/mixins/axios-mixins'
import {mapGetters} from 'vuex'
import {mapActions} from 'vuex'

export default {
  name: 'staticSelect',
  mixins: [ AxiosMixins ],
  props: {
    'value': null,
    'multiple': {
      type: Boolean,
      default: false,
    },
    'disabled': {
      type: Boolean,
      default: false,
    },
    'size': {
      type: String,
    },
    'type': null,
    'filterOptions': {
      type: Array,
      default () {
        return [];
      },
    },
    'multipleLimit': {
      type: Number,
      default: 0,
    }
  },
  data () {    
    return {
      options: [],
    }
  },
  computed: {
    ...mapGetters([
      'staticSelectorMap',//selector-cache
      'staticSelectorCache',//selector-cache
    ]),
    cacheData () {
      return this.staticSelectorCache[this.type];
    },
  	config () {
  		const config = this.staticSelectorMap.get(this.type);
  		return config ? config : this.type;
  	},
    map () {
      const map = new Map ();
      this.options.forEach(_=>{map.set(_.id, _)});

      return map;
    },
    options_vuex () {
      let op = null;
      if( typeof this.config.options === 'string') {
        op = this.$store.getters[this.config.options];
      }

      return op;
    },
    optionsIn () {
      const f = this.filterOptions;
      if(f.length != 0) {
        return this.options.filter(_=>{
          for(let i = 0; i < f.length; i++) {
            const item = f[i];

            if(_[item['key']] != item['value']) {
              return false;
            }
          }
          return true;
        })
      }else {
        return this.options;
      }
    }
  },
  watch: {
    options_vuex (val) {
      this.options = val;
    },
    value (val) {
      this.$refs.select.visible = false;
    }
  },
  methods: {
    ...mapActions([
      'initializeSelectorCache'
    ]),
    handleInput (val) {
      this.$emit('input', val);
    },
    handleChange (val) {
      this.$emit('change', this.map.get(val));
    },
    getSelected (value) {
      const arr = [];
      let v = value != undefined ? value : this.value;
      let cv = this.multiple ? v : [ v ];
      
      cv.forEach(_=>{
        const val = this.map.get(_);
        console.log(this.map,val);
        if(val) {
          arr.push(val);
        }else if(_ != '') {
          arr.push({id: _, name: _});
        }
      })

      return arr;
    },
    setOptions () {
      let op = this.config.options;
      

      if(op instanceof Array) {
        
        //存储在配置项的下拉框数据直接使用
        this.options = op;

      }else if(typeof op === 'string') {
        op = this.options_vuex;

        //存储在vuex中的数据,op代表getters的名字,
        //当数据不止在Select而是在全局中有多处被使用,或者数据在使用过程中需要保持动态更新,使用vuex存储
        if(op === undefined) {
          if(this.config.refresh) {
            this.$store.dispatch(this.config.refresh);  
          }
        }else {
          this.options = op;
        }

      }else if(op === undefined && this.config.url !== undefined) {
        
        //尝试初始化静态数据 
        this.initializeSelectorCache({ type: this.type });
        if(this.cacheData) this.options = this.cacheData;
        
      }

    }
  },
  created () {
    this.setOptions();
  },
  watch: {
    cacheData (val) {
      if(val) {
        this.options = val;  
      }
    },
    filterOptions () {
      if(this.multiple) {
        this.$emit('input', []);
      }else {
        this.$emit('input', '');
      }
    },
    value () {
      if(this.multiple) {
        this.$refs.select.visible = false;
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
<style>
#static_select .el-tag {
  min-height: 24px; 
  white-space: pre-wrap;
  padding: 0 20px 0 5px;
}
#static_select .el-select .el-tag{
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
#static_select .el-tag .el-icon-close {
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
#static_select .el-select__input {
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