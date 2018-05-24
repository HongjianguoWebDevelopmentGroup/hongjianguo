<template>
  <div class="main">
    <strainer v-model="filter" @refresh="refresh"></strainer>
    <table-component :tableOption="tableOption" :data="tableData" @refreshTableData="refreshTableData" ref="table"></table-component>
    
      <common-detail
        :title="currentRow.title"
        :visible.sync="shrinkVisible" 
        type="copyright" 
        :id="currentRow.id"
        @editSuccess="update">
      </common-detail>

  </div>
</template>

<script>
import AxiosMixins from '@/mixins/axios-mixins'
import TableComponent from '@/components/common/TableComponent'
import Strainer from '@/components/page_extension/CopyrightList_strainer'
import AppShrink from '@/components/common/AppShrink'
import CommonDetail from '@/components/page_extension/Common_detail'
import { mapActions } from 'vuex'

const URL = '/api/copyrights';

export default {
  name: 'copyrightList',
  mixins: [ AxiosMixins ],
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
        'import_type': 'copyright',
        'upload_type': 'copyright',
        'header_btn': [
          { type: 'add', click: this.add },
          { type: 'delete' },
          { type: 'export' },
          { type: 'import' },
          { type: 'batch_upload' },
          { type: 'control', label: '字段' },
          { type: 'report', click: _=>{this.$router.push('/copyright/report')} },          
          { type: 'serial_search'},
        ],
        'columns': [
          { type: 'selection' },
          { type: 'text', label: '案号', prop: 'serial', width: '140',sortable : true, },
          { type: 'text', label: '著作权名称', prop: 'title', is_import: true, width: '160',sortable : true,},
          { type: 'text', label: '著作权类型', prop: 'type', is_import: true, render_simple: 'name', width: '160' ,sortable : true,},
          { type: 'text', label: '版本号', prop: 'version', width: '145' ,sortable : true,},
          { type: 'text', label: '分类号', prop: 'main_ipc', width: '145' ,sortable : true,},
          { type: 'text', label: '申请号', prop: 'apn', width: '178',sortable : true, },
          { type: 'text', label: '申请日', prop: 'apd', sortable: true, is_import: true, width: '120' },
          { type: 'text', label: '立案时间', prop: 'create_time', width: '175',sortable : true, },
          { type: 'text', label: '发证日', prop: 'issue_date', is_import: true, width: '120',sortable : true, },
          { type: 'text', label: '证书号', prop: 'issue_number', is_import: true, width: '198',sortable : true, },
          { type: 'text', label: '状态', prop: 'progress', is_import: true, width: '160',sortable : true, render_simple: 'name',},
          { type: 'text', label: '原创类型', prop: 'original_flag', is_import: true,render_simple: 'name', width: '160',sortable : true, },
          { type: 'text', label: '修改软件作品说明', prop: 'modification_introduction', is_import: true, width: '240',sortable : true, },
          { type: 'text', label: '开发完成日期', prop: 'develop_date', width: '145',sortable : true, },
          { type: 'text', label: '首次发表日期', prop: 'publish_date', width: '145',sortable : true, },
          { type: 'text', label: '开发方式', prop: 'develop_mode', render_simple: 'name', width: '145',sortable : true, },
          { type: 'text', label: '权利获取方式', prop: 'right_source', render_simple: 'name', width: '145',sortable : true, },
          { type: 'text', label: '软件鉴别材料', prop: 'deposition_material', render_simple: 'name', width: '145',sortable : true, },
          { type: 'text', label: '文档种类', prop: 'numbers_of_document', render_simple: 'name', width: '145',sortable : true, },
          { type: 'text', label: '交存方式', prop: 'deposition_manner', render_simple: 'name', width: '145',sortable : true, },
          { type: 'text', label: '硬件环境', prop: 'hardware_environment', width: '178',sortable : true, },
          { type: 'text', label: '软件环境', prop: 'software_environment', width: '178',sortable : true, },
          { type: 'text', label: '编程语言', prop: 'program_language', width: '145',sortable : true, },
          { type: 'text', label: '源程序量', prop: 'source_lines', width: '160',sortable : true, },
          { type: 'text', label: '摘要', prop: 'abstract', width: '240', show: true, sortable : true,},
          { type: 'array', label: '著作权人', prop: 'applicants', is_import: true, render: _=>_.map(_=>_.name), width: '220' ,sortable : true,},
          { type: 'text', label: '提案人', prop: 'proposer', is_import: true, render_simple: 'name', width: '145',sortable : true, },
          { type: 'text', label: 'IPR', prop: 'ipr', render_simple: 'name', is_import: true, width: '140',sortable : true, },
          { type: 'text', label: '代理机构名称', prop: 'agency', render_simple: 'name', width: '240',sortable : true, },
          { type: 'text', label: '事务所案号', prop: 'agency_serial', width: '168',sortable : true, },
          { type: 'array', label: '产品名称', prop: 'products', sortable: true, is_import: true, render: _=>_.map(_=>_.name), width: '150' },
          { type: 'array', label: '标签', prop: 'tags', is_import: true, width: '160',sortable : true, },
          { type: 'text', label: '备注', prop: 'remark', is_import: true, width: '265',sortable : true, },
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
  methods: {
    ...mapActions([
      'initializeSelectorCache',
    ]),
    add () {
      this.$router.push('/copyright/add');
    },
    refreshTableData (option) {
      const url = URL;
      const data = Object.assign({}, option, this.filter);
      const success = d=>{
        if(data['format'] == 'excel') {
          window.location.href = d.copyrights.downloadUrl;
        }else {
          this.tableData = d.copyrights;  
        }      
      };
      this.axiosGet({url, data, success});
    },
    refresh () {
      this.$refs.table.refresh();
    },    
    update () {
      this.$refs.table.update();
    },
    deleteSingle ({ title, id }) {
      this.$confirm(`删除后不可恢复，确认删除‘${title}’吗？`)
        .then(()=>{
          const url=`${URL}/${id}`;
          const success = _=>{this.$refs.table.update()};
          this.axiosDelete({url, success});    
        })
        .catch(()=>{});
    },
    detail ({id}) {
      const path = `/copyright/list/detail/${id}`; 
      this.$router.push( path );
    },
    handleRowClick (row) {
      this.currentRow = row;
      if(!this.shrinkVisible) this.shrinkVisible = true;
    },
    close () {
      this.$refs.table.setCurrentRow();
    }
  },
  mounted () {
    this.$refs.table.refresh();
  },
  created () {
    this.initializeSelectorCache({ type: 'file_type_copyright_notice' });
  },
  components: { 
    TableComponent, 
    Strainer, 
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
