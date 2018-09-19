<template>
<el-table 
  ref="table"
  stripe
  :data="tableData"
  :border="border" 
  :row-key="rowKey" 
  :default-sort="defaultSort"
  :highlight-current-row="highlightCurrentRow"
  :height="tableHeight"
  :max-height="maxHeight"

  @selection-change="handleSelectionChange" 
  @sort-change="_=>{$emit('sort-change', _)}"
  @row-click="handleRowClick"
  @cell-click="handleCellClick"
  @cell-mouse-enter="handleMouseEnter"
>
  <template v-for="(col, index) in columns">
    
    <template v-if="col.type == 'selection'">
      <el-table-column type="selection" :fixed="col.fixed === false ? false : 'left'"></el-table-column>
    </template>

<!--         <template v-else-if="col.type == 'expand'">
      <el-table-column type="expand">
        <template scope="scope">
          <slot name="expand" :row="scope.row">
          </slot>
        </template>
      </el-table-column>
    </template> -->

    <template v-else-if="col.type == 'text'">
      
      <template v-if="col.render ? true : false">
        <el-table-column :label="col.label" :prop="col.prop" :width="col.width ? col.width : ''" :min-width="col.min_width ? col.min_width : ''" :sortable="col.sortable ? 'custom' : false" :show-overflow-tooltip="col.overflow !== undefined ? col.overflow : true" :align="col.align !== undefined ? col.align :'left'" :header-align="col.header_align !== undefined ? col.header_align :'left'" :class-name="col.className? col.className : ''" :render-header="col.render_header !== undefined  && filterVisible ?handleRenderHeader:null">
          <template slot-scope="scope">
            <table-render :render="col.render" :scope="scope" :prop="col.prop"></table-render>
          </template>
        </el-table-column>
      </template>

      <template v-else-if="col.render_text ? true : false ">
        <el-table-column :label="col.label" :prop="col.prop" :width="col.width ? col.width : ''" :min-width="col.min_width ? col.min_width : ''" :sortable="col.sortable ? 'custom' : false" :show-overflow-tooltip="col.overflow !== undefined ? col.overflow : true" :class-name="col.className? col.className : ''" :render-header="col.render_header !== undefined && filterVisible ?handleRenderHeader:null">
          <template slot-scope="scope">
            <span class="table-column-render">{{ col.render_text(scope.row[col.prop]) }}</span>
          </template>
        </el-table-column>
      </template>

      <template v-else-if="col.render_simple ? true : false ">
        <el-table-column :label="col.label" :prop="col.prop" :width="col.width ? col.width : ''" :min-width="col.min_width ? col.min_width : ''" :sortable="col.sortable ? 'custom' : false" :show-overflow-tooltip="col.overflow !== undefined ? col.overflow : true" :class-name="col.className? col.className : ''" :render-header="col.render_header !== undefined && filterVisible ?handleRenderHeader:null">
          <template slot-scope="scope">
            <span class="table-column-render">{{ handleSimple(scope.row, col) }}</span>
          </template>
        </el-table-column>
      </template>

      <template v-else>
        <el-table-column :label="col.label" :prop="col.prop" :width="col.width ? col.width : ''" :min-width="col.min_width ? col.min_width : ''" :sortable="col.sortable ? 'custom' : false" :show-overflow-tooltip="col.overflow !== undefined ? col.overflow : true" :class-name="col.className? col.className : ''" :render-header="col.render_header !== undefined && filterVisible ?handleRenderHeader:null">
          <!-- <template v-if="col.default !== undefined" scope="scope">{{ scope.row[col.prop] ? scope.row[col.prop] : col.default }}</template> -->
        </el-table-column>
      </template>

    </template>

    <template v-else-if="col.type == 'array'">
      <el-table-column :label="col.label" :prop="col.prop" :width="col.width ? col.width : ''" :min-width="col.min_width ? col.min_width : ''" :sortable="col.sortable ? 'custom' : false" :show-overflow-tooltip="col.overflow !== undefined ? col.overflow : true" :class-name="col.className? col.className : ''" :render-header="col.render_header !== undefined && filterVisible ?handleRenderHeader:null">
        <template slot-scope="scope">

          <el-tag v-for="(item, i) in scope.row[scope.column.property]" style="margin-left: 5px;" close-transition :key="i">{{ item }}</el-tag>

        </template>
      </el-table-column>
    </template>

    <template v-else-if="col.type == 'action'">
      <el-table-column type="action" :label="col.label ? col.label : '操作'" :align="col.align ? col.align : 'left'" :width="col.width ? col.width : ''" :min-width="col.min_width ? col.min_width : ''" header-align="center" :fixed="col.fixed === false ? false : 'right'" :class-name="col.className? col.className : ''" :render-header="col.render_header !== undefined  ?handleRenderHeader:null">
        <template slot-scope="scope">
          <template v-if="col.btns_render ? true : false">
            <slot name="row_action" :row="scope.row">
            </slot>
          </template>
          <template v-else v-for="(btn, index) in col.btns" v-if="btn.btn_if ? btn.btn_if(scope.row) : true">

            <el-dropdown v-if="btn.type == 'dropdown'" :key="index" trigger="click" menu-align="start">
              <el-button class="table-header-btn" :type="btn.btn_type ? btn.btn_type : ''" :size="btn.size ? btn.size : 'mini'" :icon="btn.icon ? btn.icon : ''">
                {{ btn.label }}<i class="el-icon-caret-bottom el-icon--right"></i>            
              </el-button>
              <el-dropdown-menu v-if="btn.items">
                <el-dropdown-item v-for="(item,index2) in btn.items" :key="index2" :divided="item.divided"><div @click="handleCommand(item.click, $event)" style="margin: 0 -10px; padding: 0 10px;">{{ item.text }}</div></el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>

            <el-button v-else-if="btn.type == 'confirm'" :type="btn.btn_type ? btn.btn_type : 'text'" :key="index" :size="btn.size ? btn.size : 'mini'" icon="edit" @click="handleActionCommand(btn.click, scope, $event)">确认</el-button>

            <el-button v-else-if="btn.type == 'edit'" :disabled="handleBtnBoolean(btn, scope.row, 'btn_disabled')" :type="btn.btn_type ? btn.btn_type : 'text'" :key="index" :size="btn.size ? btn.size : 'mini'" icon="edit" @click="handleActionCommand(btn.click, scope, $event)">编辑</el-button>

            <el-button v-else-if="btn.type == 'detail'" :type="btn.btn_type ? btn.btn_type : 'text'" :key="index" :size="btn.size ? btn.size : 'mini'" icon="information" @click="handleActionCommand(btn.click, scope, $event)" >详情</el-button>

            <el-button v-else-if="btn.type == 'delete'" :type="btn.btn_type ? btn.btn_type : 'text'" :key="index" :size="btn.size ? btn.size : 'mini'" icon="delete" @click="handleActionCommand(btn.click, scope, $event)" >删除</el-button>

            <el-button v-else-if="btn.type == 'download'" :type="btn.btn_type ? btn.btn_type : 'text'" :key="index" :size="btn.size ? btn.size : 'mini'" icon="my-download" @click="handleActionCommand(btn.click, scope, $event)" >下载</el-button>

            <el-button v-else-if="btn.type == 'view' && (scope.row.isView || scope.row.is_view)" :type="btn.btn_type ? btn.btn_type : 'text'" :key="index" :size="btn.size ? btn.size : 'mini'" icon="view" @click="handleActionCommand(btn.click, scope, $event)" >查看</el-button>

            <el-button v-else-if="btn.type == undefined || btn.type == 'custom'" :disabled="handleBtnBoolean(btn, scope.row, 'btn_disabled')" :type="btn.btn_type ? btn.btn_type : ''" :key="index" :size="btn.size ? btn.size : 'mini'" :icon="btn.icon" @click="handleActionCommand(btn.click, scope, $event)">{{ btn.label }}</el-button>

          </template>
        </template>
      </el-table-column>
    </template>

  </template>
</el-table>
</template>
<script>
import {mapGetters} from 'vuex'
import FilterValue from '@/components/common/FilterValue'
import {listPathMap, map as filterConfig} from '@/const/filterConfig'
import {mapActions} from 'vuex'
const labelMap = new Map();
export default {
  name: 'appTable',
  props: {
    filterVisible: {
      type: Boolean,
      default: false,
    },
    value:{
      type: [String,Number,Boolean,Array],
      // required: true,
    },
    border: {
      type: Boolean,
      default: false,
    },
    rowKey: {
      type: null,
      default: 'id',
    },
    defaultSort: {
      type: Object,
      default () {
        return {};
      }, 
    },
    highlightCurrentRow: {
      type: Boolean,
      default: false,
    },
    height: {
      type: [String, Number],
      default: '',
    },
    columns: {
      type: Array,
      required: true,
    },
    data: {
      type: Array,
      required: true,
    },
    tableSelected: {
      type: Array,
      default () {
        return [];
      },
    },
    maxHeight: {
      type: [String, Number],
      default: '',
    },
    type: {
      type: String,
      default: '',
    }
  },
  data () {
    return {
      selected: [],
      filters: {},
      headerClass: 'header_wrap',
      // filterVisible: false,
      // re_render: true,
    };
  },
  computed: {
    ...mapGetters([
      'innerHeight',
    ]),
    value2() {},
    filterSetting () { //自定义筛选配置项
      const data = filterConfig.get(this.type);
      return data ? data : []
    },
    filterSettingMap () { //自定义筛选配置项映射
      const map = new Map()
      this.filterSetting.forEach(v => {
        map.set(v.id, v)
      })
      return map
    }, 
    source () {
      //  其中一个配置项的值
      const val = this.filterSettingMap.get();
      return val ? val : null;
    },       
    tableData () {
      //这里对得到的数据进行一些额外的处理,element-ui中难以操控:
      const r = this.data;
      //  .暂时将array类型的render处理放到这里,因为如果放到v-for里面会被多次重复执行
      this.columns.forEach(_=>{
        if(_.type == 'array' && _.render) {
          r.forEach(d_c=>{
            const p = _.prop;
            d_c[p] = _.render(d_c[p]);
          })
        }
      })
      // console.log('------------------------table-data------------------------');
      // console.log(r);
      return r;
    },
    tableHeight () {
      let height = '';
      const hk = this.height;

      if(hk !== undefined) {
        if(hk == 'default') {
          height = this.innerHeight - 150;
          height = height < 300 ? 300 : height;
        }else if(hk == 'default2') {
          height = this.innerHeight - 180;
          height = height < 300 ? 300 : height;
        }else if(hk === 'default3') {
          height = this.innerHeight - 100;
          height = height < 300 ? 300 : height;
        }else if(hk === 'default4') {
          height = this.innerHeight - 55;
          height = height < 300 ? 300 : height;
        }else if(hk === 'default5') {
          height = this.innerHeight - 120;
          height = height < 300 ? 300 : height;
        }else if(hk === 'default6') {
          height = (this.innerHeight - 285)/2;
          height = height < 300 ? 300 : height;
        }else if(hk === 'default7') {
          height = (this.innerHeight - 256)/2;
          height = height < 300 ? 300 : height;
        }else if(hk === 'default8') {
          height = (this.innerHeight - 100)/2;
          height = height < 300 ? 300 : height;
        }else if(hk === 'userList') {
          height = this.innerHeight - 200;
          height = height < 300 ? 300 : height;
        }else {
          height = hk;
        }
      }

      return height;
    },
  },
  mounted() {
    console.log('渲染开的')
    if(this.filterVisible) {
      this.handleDynamicData();
      window.listHeaderFilter = this;
    }
  },
  destroyed() {
    window.listHeaderFilter = null;
  },
  methods: {
    ...mapActions([
      'fillListFilter',
      'addListFilter',
      'clearFilter'
    ]),
    handleDynamicData () {
      this.filterSetting.forEach(_=>{
        const item = this.getDefaultValue(_.id);
        this.$set(this.filters,_.id,item);
      });
      console.log(this.filters);
      return this.filters;
    },
    handleRowClick (row, event, column) {
      event.stopPropagation();
      console.log(row);
      if(column.type == 'selection' || column.type == 'action') return false;
          
      this.$emit('row-click', row, event, column);
    },
    handleCellClick (row, column, cell, event) {
      event.stopPropagation();
       if(column.type == 'selection' || column.type == 'action') return false;
       this.$emit('cell-click',row, column, cell, event);
    },
    handleMouseEnter (row, column, cell, event) {
      this.$emit('cell-mouse-enter',row, column, cell, event);
    },
    handleSelectionChange(s) { 
      this.selected = s;
      this.$emit('update:tableSelected', s);
    },
    getSelected (flag = false) {
      const s = this.selected;
      if(!flag) {
        if(s.length == 0) {
          this.$message({ message: '请至少选择一项！', type: 'warning' });
          return false;
        }
      }

      return s;
    },
    setCurrentRow (row) {
      this.$refs.table.setCurrentRow(row);
    },
    handleActionCommand (func, scope, event) {
      event.stopPropagation();
      if(func) {
        func(scope.row, event);
      }
    },
    getDefaultValue (key) {
      const item = this.filterSettingMap.get(key)
      let val = ''
      const multiple = item.multiple !== undefined ? item.multiple : true
      if (item.components == 'static_select' || item.components == 'remote_select') {
        val = multiple ? [] : ''
      } else if(item.components == 'date' ) {
        val = ['','']
      } else if(item.components == 'input') {
        val = ''
      }
      return val
    },
    clearRenderHeaderField (key) {
      this.filters[key] = this.getDefaultValue(key);
    },
    handleSimple (row, col) {
      const key = col.render_key ? col.render_key : col.prop;
      const obj = row[key];

      return row[key] ? row[key][col.render_simple] : '';

    },
    handleBtnBoolean (btn, row, key) {
      return btn[key] ? btn[key](row) : false; 
    },
    handleRenderHeader (h,{column,$index},func) {
      console.log('aaa');
        let self = this;
        let item = column.label;
      if(func){
        func();
      }else if(column.type == 'action'){
        return h('span',{},[h('el-button',{
          style: {
            float: 'left',
          },
          attrs: {
            type: 'text',
            icon: 'plus'
          },
          on: {
            click(e) {
              e.stopPropagation();
              self.filterVisible = !self.filterVisible;
              console.log(self.filterVisible)
            },
          },
        },''),h('el-button',{
           style: {
            float: 'left',
            display: 'inline-block'
          },
          attrs: {
            type: 'text',
            icon: 'edit'
          },
        },'')])
      }else{
        // const sindex =column.property.indexOf('__');
        // if(sindex!== -1) {
        //   column.property = column.property.substring(0,sindex);
        // }
        const source = this.filterSettingMap.get(column.property) !== undefined ?
        this.filterSettingMap.get(column.property) : null;
        const data = {  
          style: {
            padding: '6px 18px',
          },
          on: {
            input(val) {
              if(!val) return;
              self.filters[column.property] = val;
            },
            labelname(val) {
              val.forEach(v=>{
                labelMap.set(v.key,v);
              });
            },
          },
          nativeOn: {
            click(e) {
              // 阻止表头默认点击事件
              e.stopPropagation();
            }
          },
          props: {
            source: source,
            value: self.filters[column.property],
          },
        }
        return (
            source!=null?
            <div class={[self.headerClass]}>
              <span style={{width: '100%', height: '30px',position :'relative',padding: '0 18px'}} >{item}</span>
              <i style={{borderTop: '1px solid #dfe6ec',height: '1px',lineHeight: '1px',width: '100%',display:'block'}}></i>
              <div style={{width: '100%',}}>
                  <FilterValue  {...data}></FilterValue>
              </div> 
            </div>
            :<span>{item}</span>

        )
      }
    },
  },
  watch:{
    filters: {
      handler(form) {
        console.log('dfdfdf')
        window.setTimeout(() => {
          const obj = {}
          for (let key in form) {
            const map = this.filterSettingMap.get(key);
            const value = form[key];

            if (value === '' || value.length === 0 || (value.length === 2 && value[0] === '' && value[1] === '')) {
              obj[key] = false;
            }else {
              const name = map['name'];
              const label = labelMap.get(key)['value'];
              obj[key] = { name, key, label, value };
            }
          }
           this.fillListFilter(obj);
        }, 0)
      },
      deep: true,
    },
    // filterVisible (val) {
    //   this.re_render = false;
    //   this.$nextTick(_=>{
    //     this.re_render = true;
    //   });
    // },
  },
  components: {
    'TableRender': {
      render: function(h) { 
        return this.render(h, this.scope.row[this.prop], this.scope.row, this.prop);
      },
      props: {
        'render': null, 
        'scope': null,
        'simple': {
          type: Boolean,
          default: false,
        },
        'prop': {
          type: String,
          default: '',        
        }
      },
    },
    FilterValue,
  }
}
</script>
<style lang="scss">
  .header_wrap {
    background-color: #e1e1e1;
  }
  .el-table__header-wrapper  .cell{
      padding: 0px;
    }
</style>
