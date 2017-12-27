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

const URL = '/api/inventors'

export default {
  name: 'inventorList',
  mixins: [ AxiosMixins ],
  data () {
		return {
      popType: '',
		  option: {
        'name': 'contractwList',
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
		  		{ type: 'text', label: '分所', prop: 'branch', sortable: true, width: '260' },
		  		{ type: 'text', label: '上传用户', prop: 'uid', sortable: true, width: '150' },
		  		{ type: 'text', label: '签订日期', prop: '', sortable: true, width: '160' },
		  		{ type: 'text', label: '上传日期', prop: 'email', sortable: true, width: '160' },
		  		{ type: 'text', label: '状态', prop: '', sortable: true, width: '135' },
		  		{ type: 'text', label: '扫描件', prop: 'name_en', width: '200' },
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
  	editPop (col) {
      this.popType = 'edit';
  		this.$refs.pop.show('edit', col);
  	},
  	deleteSingle ({id, name}) {
  		this.$confirm(`删除后不可恢复，确认删除发明人‘${name}’？`)
        .then(_=>{
          const url = `${URL}/${id}`;
          const success = _=>{
            this.$message({message: '删除发明人成功', type: 'success'});
            this.update();
          };

          this.axiosDelete({url, success});
        })
        .catch(_=>{});
  	},
  	refreshTableData (option) {
      const url = URL;
      const data = Object.assign({}, option);
      const success = _=>{ this.tableData = _.data };

      this.axiosGet({url, data, success});
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