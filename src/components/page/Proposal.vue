<template>
	<div class="main">    
		<table-component :tableOption="tableOption" :data="tableData" ref="table" :refreshTableData="refreshTableData" :refresh-proxy="refreshProxy">
      <el-button v-if="menusMap && !menusMap.get('/proposals/proposer')" type="primary" icon="d-arrow-right" class="table-header-btn" @click="transferPop" slot="transfer" style="margin-left: 5px;">移交</el-button>
      
      <template slot="row_action" slot-scope="scope">
        <el-button type="text" icon="edit" size="mini" @click="edit(scope.row)" :disabled="scope.row.status ? true : false" >编辑</el-button>
      </template>
    </table-component>

    <app-shrink :title="currentRow.title" :visible.sync="shrinkVisible"><proposal-detail :id="currentRow.id"></proposal-detail></app-shrink>
    
    <el-dialog title="移交提案" :visible.sync="transferVisible">
      <el-form>
        <el-form-item label="移交至">
          <remote-select type="member" v-model="transferProposal"></remote-select>
        </el-form-item>
        <el-form-item style="margin-bottom: 0px;">
          <el-button type="primary" :disabled="transferDisabled" @click="transferAxios">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import TableComponent from '@/components/common/TableComponent'
import AppCollapse from '@/components/common/AppCollapse'
import Classification from '@/components/form/Classification'
import Product from '@/components/form/Product'
import Branch from '@/components/form/Branch'
import AppShrink from '@/components/common/AppShrink'
import ProposalDetail from '@/components/page_extension/Proposal_detail'

import RemoteSelect from '@/components/form/RemoteSelect'
import StaticSelect from '@/components/form/StaticSelect'

import {mapGetters} from 'vuex'

const URL = '/api/proposals';
const url = 'http://www.zhiq.wang/proposal/lists';
const delete_url = 'http://www.zhiq.wang/proposal/lists';
const tag_url = 'http://www.zhiq.wang/tag/lists';
const strainerArr = ['classification', 'product', 'proposer', 'tags', 'inventors', 'branch', 'create_time','ipr'];
const map = new Map([['flownodes', 'progress'],['time', 'create_time']]);
export default {
  name: 'proposalList',
  methods: {
    add () {
      this.$router.push('/proposal/add');
    },
    edit (row) {
      this.$router.push({path: '/proposal/edit', query: {id: row.id}});
    },
    deleteSingle (row) {
      this.$confirm(`删除后不可恢复，确认删除“${row.title}”?`, {type: 'warning'})
        .then(()=>{
          this.$axios
            .delete(`/api/proposals/${row.id}`)
            .then(response=>{
              console.log(response);
              const d = response.data;

              if(d.status) {
                this.$refs.table.refresh();
              }else {
                this.$alert("删除失败！", {type: 'error'});
              }
            })
            .catch(err=>{
              console.log(err);
              this.$alert("网络错误！", {type: 'error'});
            });
        })
        .catch(()=>{})
    },
    deleteMul () {
      const s = this.$refs.table.tableSelect;
      if(s.length == 0) {
        this.$message({message: '请选择需要删除的提案', type: 'warning'});
        return false;
      }else {
        this.$confirm('删除后不可恢复，确认删除？')
          .then(_=>{
            const url = URL;
            const data = { ids: this.$tool.splitObj(s, 'id') };
            const success = _=>{ this.update() };

            this.$axiosDelete({ url, data, success });
          })
          .catch(_=>{console.log(_)});
      }
    },
    detail (row) {
      this.$router.push({path: '/proposal/detail', query: {id: row.id}});
    },
    query () {
      const obj = {};
      
      obj.title = this.title;
      strainerArr.forEach(d=>{
        if(d == 'create_time') {
          obj[d] = this[d].map(_=>this.$tool.getDate(_)).join(',');
        }else {
          obj[d] = this[d].join(',')  
        }
        
      });

      this.filter = obj;
      this.$refs.table.refresh();
      this.$refs.collapse.toggle();
    },
    clear () {
      this.title = "";
      strainerArr.forEach(d=>{this[d] = []});

      this.filter = {};
      this.$refs.table.refresh();
    },
    refreshTableData (option) {
      const url = '/api/proposals';
      const data = Object.assign({}, option, this.inParams);
      const success = _=>{
        if(data.format == 'excel') {
          window.location.href = _.proposals.downloadUrl;
        }else {
          this.tableData = _.proposals;
        }
      }
      
      this.refreshProxy = this.$axiosGet({url, data, success});
    },
    refresh () {
      this.$refs.table.refresh();
    },
    update () {
      this.$refs.table.update();
    },
    handleRowClick (row) {
      this.currentRow = row;
      if(!this.shrinkVisible) this.shrinkVisible = true;
    },
    transferPop () {
      const s = this.$refs.table.getSelect();
      if(s) {
        this.transferIds = this.$tool.splitObj(s, 'id');
        this.transferVisible = true;
      }
    },
    transferAxios () {
      if(this.transferProposal == '') {
        this.$message({message: '请选择需要移交的人员', type: 'warning'});
        return;
      }

      const url = '/proposals/proposer';
      const data = {ids: this.transferIds, proposer: this.transferProposal};
      const success = _=>{ 
        this.$message({message: '移交成功', type: 'success'});
        this.transferVisible = false;
        this.refresh();
      };
      const complete = _=>{this.transferDisabled = false};

      this.transferDisabled = true;
      this.$axiosPut({url, data, success, complete});
    }
  },
  data () {
    return {
      filterVisible: false,
      refreshProxy: '',
      tableOption: {
        'name': 'proposalList',
        'url': URL,
        'is_filter': true,
        'is_list_filter': true,
        'list_type': 'proposal',
        'height': 'default',
        'search_placeholder': '搜索案号、标题、标签、发明人',
        'highlightCurrentRow': true, 
        'rowClick': this.handleRowClick,
        'header_btn': [
          { type: 'add', click: this.add },
          { type: 'delete' },
          { type: 'export' },
          { type: 'control' },
        ],
        'header_slot': ['transfer'],
        'columns': [
          { type: 'selection'},
          { type: 'text', label: '案号', prop: 'serial', sortable: true, width: '200' },
          { type: 'text', label: '提案标题', prop: 'title', sortable: true, width: '300' },
          { type: 'text', label: '提案人', prop: 'proposer', render_simple: 'name', sortable: true, width: '160' },
          { type: 'text', label: '代理人', prop: 'agent', sortable: true, width: '160'},
          { type: 'text', label: 'IPR', prop: 'ipr', render_simple: 'name', sortable: true, width: '160'},
          { type: 'text', label: '当前节点', prop: 'flow_node', sortable: true, width: '240' },
          { type: 'text', label: '提案简介', prop: 'abstract', sortable: true, width: '300' },
          { type: 'text', label: '创建时间', prop: 'create_time', sortable: true, width: '200' },
          { type: 'text', label: '部门', prop: 'branch', render_simple: 'name', sortable: true, width: '200' },
          { type: 'text', label: '技术分类', prop: 'classification', render_simple: 'name', sortable: true, width: '200' },
          { type: 'array', label: '产品分类', prop: 'products', render: _=>_.map(_=>_.name), width: '200' },
          { type: 'array', label: '发明人', prop: 'inventors', render: _=>_.map(_=>`${_.name}：${_.share}%；`), overflow: true, width: '200' },
          { type: 'array', label: '标签', prop: 'tags', width: '200' },
          { type: 'text', label: '备注', prop: 'remark', width: '280' },
          {
            type: 'action',
            label: '操作', 
            btns_render: true,
            width: '160',
          },
        ]
      },
      tableData: [],
      filter: {},
      title: '',
      classification: [],
      product: [],
      branch: [],
      create_time: [],
      proposer: [],
      tags: [],
      ipr:[],
      inventors: [],
      filters: {},
      currentRow: '',
      shrinkVisible: false,
      transferVisible: false,
      transferIds: [],
      transferProposal: '',
      transferDisabled: false,
    }
  },
  computed: {
    ...mapGetters([
      'menusMap',
    ]),
    inParams () {
      const p = this.$route.meta.params; 
      return p ? p : {};
    },
    custom () {
      const custom = this.$route.meta.custom;
      return custom !== undefined ? custom : false;
    },
  },
  mounted () {
    if(!this.custom) {
      this.refresh();
    }
  },
  components: { 
    TableComponent,
    AppCollapse, 
    Classification, 
    Product, 
    RemoteSelect,  
    AppShrink, 
    ProposalDetail, 
    StaticSelect,
    Branch,
  }, 
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>