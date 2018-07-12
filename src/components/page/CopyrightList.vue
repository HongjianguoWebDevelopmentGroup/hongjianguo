<template>
  <div class="main">
    <table-component :tableOption="tableOption" :data="tableData" :refreshTableData="refreshTableData" ref="table"></table-component>
    
      <common-detail
        :title="currentRow.title"
        :visible.sync="shrinkVisible" 
        type="copyright" 
        :id="currentRow.id"
        @editSuccess="refresh">
      </common-detail>

  </div>
</template>

<script>
import TableComponent from '@/components/common/TableComponent'
import Strainer from '@/components/page_extension/CopyrightList_strainer'
import AppShrink from '@/components/common/AppShrink'
import CommonDetail from '@/components/page_extension/Common_detail'
import {mapGetters} from 'vuex'

const URL = '/copyrights';

export default {
  name: 'copyrightList',
  data () {
    return {
      currentRow: '',
      shrinkVisible: false,
      tableOption: {
        'name': 'copyrightList',
        'url': URL,
        'height': 'default',
        'highlightCurrentRow': true, 
        'rowClick': this.handleRowClick,
        'is_filter': true,
        'is_list_filter': true,
        'list_type': 'copyright',
        'import_type': 'copyright',
        'upload_type': 'copyright',
        'header_btn': [
          { type: 'add', click: this.add },
          { type: 'delete' },
          { type: 'export' },
          { type: 'import' },
          { type: 'batch_upload' },
          { type: 'control', label: '字段' },
        ],
        'columns': [
          { type: 'selection' },
          { type: 'text', label: '案号', prop: 'serial', width: '200', sortable: true },
          { type: 'text', label: '事务所案号', prop: 'agency_serial', width: '200', sortable: true },
          { type: 'text', label: '版权类型', prop: 'type', is_import: true, render_simple: 'name', width: '160', sortable: true },
          { type: 'text', label: '案件状态', prop: 'progress', is_import: true, render_simple: 'name', width: '198', sortable: true},
          { type: 'text', label: '标题', prop: 'title', is_import: true, width: '160'},
          { type: 'text', label: '摘要', prop: 'abstract', width: '280' },
          { type: 'text', label: '完成时间', prop: 'create_time', width: '173', sortable: true },
          { type: 'text', label: '申请日', prop: 'apd', sortable: true, is_import: true, width: '173', sortable: true },
          { type: 'text', label: '申请号', prop: 'apn', width: '263', sortable: true },
          { type: 'text', label: '公告日', prop: 'issue_date', is_import: true, width: '183', sortable: true },
          { type: 'text', label: '公告号', prop: 'issue_number', is_import: true, width: '263', sortable: true },
          { type: 'text', label: '代理人', prop: 'agent', render_simple: 'name', is_import: true, width: '140' },
          { type: 'text', label: '代理机构名称', prop: 'agency', render_simple: 'name', width: '143' },
          { type: 'text', label: '代理机构案号', prop: 'agency_serial', width: '263', sortable: true },
          { type: 'text', label: '备注', prop: 'remark', is_import: true, width: '285' },
          { type: 'array', label: '申请人', prop: 'applicants', is_import: true, render: _=>_.map(_=>_.name), width: '220' },
          { type: 'text', label: '技术联系人', prop: 'proposer', is_import: true, render_simple: 'name', width: '145' },
          { type: 'array', label: '标签', prop: 'tags', is_import: true, width: '200' },
          { type: 'array', label: '产品名称', prop: 'products', is_import: true, render: _=>_.map(_=>_.name), width: '150' },
          // {
          //   type: 'action',
          //   width: '150',
          //   btns: [
          //     // { type: 'detail', click: this.detail },
          //     { type: 'delete', click: this.deleteSingle },
          //   ], 
          // },
        ] 
      },
      tableData: [],
      filter: {},
    };
  },
  computed: {
    ...mapGetters([
      'menusMap',
    ]),
    defaultParams () {
      const params = this.$route.meta.params;
      return params ? params : {};
    },
    custom () {
      const custom = this.$route.meta.custom;
      return custom !== undefined ? custom : false;
    }
  },
  methods: {
    add () {
      this.$router.push('/copyright/add');
    },
    refreshTableData (option) {
      const url = URL;
      const data = Object.assign({}, option, this.defaultParams);
      const success = d=>{
        if(data['format'] == 'excel') {
          window.location.href = d.copyrights.downloadUrl;
        }else {
          this.tableData = d.copyrights;  
        }      
      };

      return this.$axiosGet({url, data, success});
    },
    refresh () {
      this.$refs.table.refresh();
    },
    deleteSingle ({ title, id }) {
      this.$confirm(`删除后不可恢复，确认删除‘${title}’吗？`)
        .then(()=>{
          const url=`${URL}/${id}`;
          const success = _=>{this.$refs.table.update()};
          this.$axiosDelete({url, success});    
        })
        .catch(()=>{});
    },
    detail ({id}) {
      const path = `/copyright/list/detail/${id}`; 
      this.$router.push( path );
    },
    handleRowClick (row) {
      if( this.menusMap && !this.menusMap.get('/copyright/detail_panel') ) {
        this.currentRow = row;
        if(!this.shrinkVisible) this.shrinkVisible = true;
      }
    },
    close () {
      this.$refs.table.setCurrentRow();
    }
  },
  mounted () {
    if(!this.custom) {
      this.refresh();
    }
    this.$refs.table.refresh();
  },
  components: { 
    TableComponent, 
    AppShrink, 
    CommonDetail 
  }
}
</script>
<style>

</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">



</style>
