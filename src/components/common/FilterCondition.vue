<template>
  <div class="main">
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
  </div>
</template>

<script>
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
  },
  data () {
    return {
      aId: '',
      filterText: '',
      defaultKeys: [],
      'currentNodeKey': '',
      'props': {
        label: 'name',
        children: 'children',
      },
      'form': {
        name: '',
        description: '',
      },
      'pop_form': {
        name: '',
        description: '',
      },
      'dialogVisible': false,
      'add_id': ''
    }
  },
  methods: {
    ...mapMutations([
      'setDataKey',
    ]),
    ...mapActions([
      'refreshFilterData',
      'setUrl',
    ]),
    getCheckedNodes () {
      const nodeArr = this.$refs.tree.getCheckedNodes();
      return nodeArr;
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
  },
  computed: {
    ...mapGetters([
      'innerHeight',
      'filterData',
    ]),
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
      return this.filterData[this.source.id];
    },
  },
  created() {
    console.log(this.filterDataKey);
    if(this.filterDataKey){
      this.setDataKey({key:this.source.id,data_key:this.filterDataKey});
    }
    if(this.filterUrl) {
      this.setUrl({key:this.source.id,url:this.filterUrl});
    }
    // if(this.filterDataKey && this.filterUrl) {
      this.refreshFilterData({key:this.source.id});
    // }
  },
   watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  }, 
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>