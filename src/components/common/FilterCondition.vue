<template>
  <div class="main">
    <template v-if="this.source.type == 'remote_select' || this.source.type == 'static_select'">
      <el-input
        placeholder="输入关键字进行过滤"
        v-model="filterText"
        class="input-no-radius"
        style="border-radius: 0;">
      </el-input>    
      <el-tree 
        :data="cacheData"
        :props="props"
        node-key="id"
        show-checkbox
        highlight-current
        :expand-on-click-node="false"
        :current-node-key="currentNodeKey"
        style="height: 160px; overflow: auto; font-size: 14px;border: 1px solid #e1e1e1;"
        :filter-node-method="filterNode"
        :default-expanded-keys="defaultKeys"
        ref="tree"
      >
      </el-tree>
    </template>
    <template v-if="this.source.type == 'date'">
      <app-date
        ref="date"
        :value="value"
        @input="handleInput"
      ></app-date>    
    </template>
    <template v-if="this.source.type == 'text'">
      <el-input
       ref="input"
       :value="value"
       @input="handleInput" 
      ></el-input>    
    </template>
  </div>
</template>

<script>
import AppDate from '@/components/common/AppDate' 
import { mapGetters } from 'vuex'
import { mapMutations } from 'vuex'
import { mapActions } from 'vuex'

export default {
  name: 'filtercondition',
  props: {
    source: Object,
    default() {
      return null;
    },
    value: {
      type: [String, Number, Date, Array],
      required: true,
    },       
  },
  data () {
    return {
      filterText: '',
      defaultKeys: [],
      initVal: '',
      'currentNodeKey': '',
      'props': {
        label: 'name',
        children: 'children',
      },
    }
  },
  methods: {
    ...mapMutations([
      'setDataKey',
    ]),
    ...mapActions([
      'refreshFilterData',
      'setUrl',
      'initializeSelectorCache',
    ]),
    getCheckedNodes () {
      const nodeArr = this.$refs.tree.getCheckedNodes();
      return nodeArr;
    },
    filterNode (value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    handleInput (val) {
      this.$emit('input',val);
    },
    getLabel () {
      const t = this.source.type;  
      if(t == 'date') {
        return this.$refs.date.getLabel();
      }
      if(t == 'text') {
        console.log(this.value);
        return this.value;
      }
    },       
  },
  computed: {
    ...mapGetters([
      'innerHeight',
      'filterData',
      'staticFilterMap',
      'staticSelectorCache',
    ]),
    // value : {
    //   get() {
    //    if(this.source.type == 'date' ) {
    //       return this.initVal = ['',''];
    //     }else if(this.source.type == 'text') {
    //       return this.initVal ;
    //     }
    //   },
    //   set(val) {
    //     this.initVal = val;
    //   }
    // },
    staticConfig () {
      if(this.source && this.source.map_type) {
        const config = this.staticFilterMap.get(this.source.map_type);
        return config? config : this.source.map_type;
      }
    },
    staticCacheData () {
      if(this.source && this.source.map_type && this.source.url != undefined) {
        return this.staticSelectorCache[this.source.map_type];
      }
    },
    filterUrl () {
      const source = this.source;
      return source!=null && source.url? source.url : '';
    },
    filterDataKey () {
      const source = this.source;
      // console.log(this.source);
      return source!=null && source.data_key? source.data_key : '';
    },
    cacheData () {
      console.log(this.filterData);
      console.log(this.source.id)
      console.log(this.filterData[this.source.id]);
      if(this.source.type == 'remote_select' && this.source.url) {
        return this.filterData[this.source.id];
      }else if(this.source.type == 'static_select' && this.source.url == undefined) {
        return this.staticConfig.options;
      }else if(this.source.type == 'static_select' && this.source.url != undefined) {
        return this.staticCacheData;
      }
    },
  },
  created() {
    console.log(this.staticConfig);
    if(this.filterDataKey){
      this.setDataKey({key:this.source.id,data_key:this.filterDataKey});
    }
    if(this.filterUrl) {
      this.setUrl({key:this.source.id,url:this.filterUrl});
    }
    if(this.filterDataKey && this.filterUrl) {
      this.refreshFilterData({key:this.source.id});
    }
    if(this.source && this.source.map_type &&this.source.url != undefined) {
      this.initializeSelectorCache({type: this.source.map_type});
    }
  },
   watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
    value(val) {
      console.log('测试智')
      console.log(val);
    },
  }, 
  components: {
    AppDate,
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>