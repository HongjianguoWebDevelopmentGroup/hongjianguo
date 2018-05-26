<template>
  <div class="main">
    <!-- <strainer v-model="filter" @refresh="refresh"></strainer> -->
  	<table-component :tableOption="option" :data="tableData" @refreshTableData="refreshTableData" ref="table"></table-component>
  	<pop ref="pop" @refresh="handlePopRefresh" :popType="popType"></pop>
  </div>
</template>

<script>
import TableComponent from '@/components/common/TableComponent'
// import Strainer from '@/components/page_extension/strainer'
import Pop from '@/components/page_extension/Contract_pop'
import AxiosMixins from '@/mixins/axios-mixins'

const URL = '/contracts'

export default {
  name: 'inventorList',
  mixins: [ AxiosMixins ],
  data () {
		return {
      popType: '',
		  option: {
        'name': 'contractList',
        'url': URL,
        'height': 'default2',
		  	'header_btn': [
		  		{ type: 'add', click: this.addPop },
          { type: 'delete' },
		  		{ type: 'control' },
		  	],
		  	'columns': [
          { type: 'selection' },
		  		{ type: 'text', label: '合同编号', prop: 'serial', sortable: true, width: '210' },
		  		{ type: 'text', label: '合作方', prop: 'party', render_simple: 'name', sortable: true, width: '260' },
		  		{ type: 'text', label: '扫描件', prop: 'files', width: '200', render: (h,item)=>{
           return h(
                'span', 
                item.map(function (g) {
                    return h('a', 
                    {
                      style: {
                      marginRight: '2px',
                  },
                      attrs: {
                    href: g.downloadUrl,
                  },
                  },g.name)
                })
              )
            }},
          { type: 'text', label: '上传日期', prop: 'upload_date', sortable: true, width: '160' },
          { type: 'text', label: '上传用户', prop: 'uploader',render_simple: 'name', sortable: true, width: '150' },
          { type: 'text', label: '签订日期', prop: 'signing_date', sortable: true, width: '160' },
          { type: 'text', label: '失效时间', prop: 'expire_date',sortable: true, width: '160'},
          { type: 'text', label: '状态', prop: 'status', sortable: true, width: '135' },
          { type: 'text', label: '备注', prop: 'remark', width: '260',},
		  		{ 
		  			type: 'action',
            width: '160',
		  			btns: [
		  				{ type: 'edit', click: this.editPop },
		  				{ type: 'delete', click: this.deleteSingle },
		  			]
		  		}
		  	]
		  },
		  tableData: [],
      filter: {},
		}
  },
  methods: {
  	addPop () {
      this.popType = 'add';
  		this.$refs.pop.show();
  	},
  	editPop (row) {
      this.popType = 'edit';
  		this.$refs.pop.show(row);
  	},
  	deleteSingle ({id, name}) {
  		this.$confirm(`删除后不可恢复，确认删除合同‘${name}’？`,'删除确认',{type : 'warning'})
        .then(_=>{
          const url = `${URL}/${id}`;
          const success = _=>{
            this.$message({message: '删除合同成功', type: 'success'});
            this.update();
          };

          this.$axiosDelete({url, success});
        })
        .catch(_=>{});
  	},
  	refreshTableData (option) {
      const url = URL;
      const data = Object.assign({}, option);
      const success = _=>{ 
        console.log(_.list);
        this.tableData = _.list 
      };

      this.$axiosGet({url, data, success});
  	},
    refresh () {
      this.$refs.table.refresh();
    },
    update () {
      this.$refs.table.update();
    },
    handlePopRefresh (key) {
      this.refresh();
    }
  },
  mounted () {
    this.refresh();
  },
  components: { TableComponent, Pop }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>