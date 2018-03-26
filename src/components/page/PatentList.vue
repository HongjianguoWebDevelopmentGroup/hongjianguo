<template>
  <div class="main">
    <strainer v-model="filter" @refresh="refresh"></strainer>
    
    <table-component :tableOption="tableOption" :data="tableData" @refreshTableData="refreshTableData" ref="table" :refresh-proxy="refreshProxy" :filter="filter">
      <el-button v-if="!!(menusMap && !menusMap.get('/patent/download') )" slot="download" :loading="downloadLoading" icon="share" @click="downloadPop" type="primary" style="margin-left: 5px; ">批量下载</el-button>
    </table-component>
    
    <common-detail
      :title="currentRow.title"
      :visible.sync="shrinkVisible" 
      type="patent" 
      :id="currentRow.id" 
      ref="detail"
      @editSuccess="refresh">
    </common-detail>    

    <el-dialog title="批量下载" :visible.sync="downloadVisible">
      <el-form>
        <el-form-item label="文件类型">
          <static-select type="file_type" v-model="downloadFileType" multiple></static-select>
        </el-form-item>
        <el-form-item style="margin-bottom: 0px;">
          <el-button type="primary" @click="downloadAxios">下载</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

      <el-dialog title="附件下载" :visible.sync="dialogVisible" >
      <template>
        <table-component :tableOption="option2" :data="tableData2.attachments"></table-component>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import AxiosMixins from '@/mixins/axios-mixins'
import AppFilter from '@/components/common/AppFilter'
import TableComponent from '@/components/common/TableComponent'
import AppTree from '@/components/common/AppTree'
import AppDatePicker from '@/components/common/AppDatePicker'
import Strainer from '@/components/page_extension/PatentList_strainer'
import AppShrink from '@/components/common/AppShrink'
import CommonDetail from '@/components/page_extension/Common_detail'
import StaticSelect from '@/components/form/StaticSelect'
import { mapGetters } from 'vuex'
import { mapActions } from 'vuex'

const URL = '/api/patents';
const PATENT_TYPE = ['发明专利', '实用新型', '外观设计']; 

export default {
  name: 'patentList',
  mixins: [ AxiosMixins ],
  data () {
    return {
      value6: '',
      refreshProxy: '',
      currentRow: '',
      shrinkVisible: false,
      dialogVisible: false,
      
      downloadVisible: false,
      downloadIds: [],
      downloadFileType: [],
      downloadLoading: false,
      
      tableOption: {
        'name': 'patentList',
        'url': URL,
        'height': 'default',
        'search_placeholder': '搜索案号、标题、申请号', 
        'highlightCurrentRow': true,
        'rowClick': this.handleRowClick,
        'cellClick': this.handleCellClick,
        'is_filter': true,

        'header_btn': [
          { type: 'add', click: this.add, map_if: '/patent/add', },
          { type: 'delete', map_if: '/patent/delete' }, 
          { type: 'export2', map_if: '/patent/export' },
          { type: 'import', map_if: '/patent/import' },
          { type: 'batch_upload', map_if: '/patent/upload' },
          // { type: 'batch_update' },
          { type: 'control', label: '字段' },
          { type: 'report', click: _=>{this.$router.push('/patent/report')} },
        ],
        'export_type': 'patent',
        'import_type': 'patent',
        'upload_type': 'patent',
        // 'update_type': 'patent',
        'header_slot': ['download'],
        'columns': [
          { type: 'selection' },
          // { type: 'text', label: '专利状态', prop: 'status', render: (h,item)=>h('span', item ? '正常' : '暂停处理') },
          { type: 'text', label: '案号', prop: 'serial', sortable: true, width: '200' },
          { type: 'text', label: '事务所案号', prop: 'agency_serial', sortable: true,width: '200' },
          { type: 'array',label: '申请人',prop: 'applicants', width: '300',is_import: true, render: _=>{return _.map(_=>_.name);}},
          { type: 'text', label: '申请号', prop: 'apn', sortable: true, is_import: true, width: '263'},
          { type: 'text', label: '申请日', prop: 'apd', sortable: true, is_import: true, width: '145'},
          { type: 'text', label: '专利标题', prop: 'title', sortable: true, is_import: true, width: '160' },
          { type: 'text', label: '地区', prop: 'area', render_simple: 'name', sortable: true, is_import: true, width: '100' },
          { type: 'text', label: '当前状态', prop: 'progress', render_simple: 'name',  sortable: true, width: '180' },
          { type: 'text', label: 'IPR', prop: 'ipr', render_simple: 'name', sortable: true, is_import: true, width: '145' },
          { type: 'text', label: '提案号', prop: 'proposal_serial', sortable: true,width: '200' },
          { type: 'text', label: '专利类型', prop: 'type', render_simple: 'name', sortable: true, is_import: true, width: '142',  },
          { type: 'text', label: '专利摘要', prop: 'abstract', sortable: true, width: '280'},
          { type: 'text', label: '公开日', prop: 'public_date', sortable: true, is_import: true, width: '145', show: false },
          { type: 'text', label: '公开号', prop: 'public_number', sortable: true, is_import: true, width: '263', show: false },
          { type: 'text', label: '初审合格日', prop: 'pre_exam_ok_date', sortable: true, width: '175', show: false },
          { type: 'text', label: '进入实审日', prop: 'sub_exam_start_date', sortable: true, width: '175', show: false },
          { type: 'text', label: '公告日', prop: 'issue_date', sortable: true, is_import: true, width: '145', show: false },
          { type: 'text', label: '公告号', prop: 'issue_number', sortable: true, is_import: true, width: '263', show: false },
          { type: 'text', label: '主国际分类号', prop: 'main_ipc', sortable: true, width: '263', show: false },
          { type: 'text', label: '国际申请日', prop: 'pct_apd', sortable: true, width: '175', show: false },
          { type: 'text', label: '国际申请号', prop: 'pct_no', sortable: true, width: '263', show: false },
          { type: 'text', label: '国际优先权日', prop: 'pct_priority_date', sortable: true, width: '175', show: false },
          { type: 'text', label: '国际公开日', prop: 'pct_public_date', sortable: true, width: '175', show: false },
          { type: 'text', label: '国际公开语言', prop: 'pct_public_language', sortable: true, width: '263', show: false },
          { type: 'text', label: '国际公开号', prop: 'pct_public_no', sortable: true, width: '263', show: false },
          { type: 'text', label: '复审委内编号', prop: 'board_number', sortable: true, width: '263', show: false },
          { type: 'text', label: '说明书字数', prop: 'words', sortable: true, width: '145', show: false },
          {  type: 'text', label: '费用', prop: 'fees', sortable: true, width: '130',
            render_text (item) {
              if(!(item instanceof Array)) {
                return 0;
              }
              let rmb = 0;
              
              item.forEach(_=>{
                rmb += Number.parseFloat(_.rmb);
              })
              return rmb;
            },
          },
          // { type: 'text', label: '提案人', prop: 'proposer', sortable: true, width: '123', is_import: true, render_simple: 'name',},
          { type: 'text', label: '代理机构', prop: 'agency', sortable: true, width: '168', is_import: true, render_simple: 'name'},
          { type: 'array', label: '发明人', width: '238', prop: 'inventors', is_import: true, render: _=>_.map(_=>_.name),},
          { type: 'array', label: '标签', prop: 'tags', is_import: true, width: '160',},
          { type: 'text', label: '部门名称', prop: 'branch', sortable: true, render:  (h,item)=>h('span', item.name), width: '142' },
          { type: 'text', label: '技术分类', width: '142' , prop: 'classification', sorable: true, is_import: true, render_simple: 'name',},
          { type: 'array', label: '优先权', prop: 'priorities', width: '145', render: _=>_.map(_=>_.number),},
          { type: 'array', label: '产品名称', width: '180', prop: 'products', sortable: true, render: _=>_.map(_=>_.name),},
          { type: 'array', label: '相关案件', prop: 'relative_projects', width: '200', render: _=>_.map(_=>`${_.title}-${_.serial}`),},
          { type: 'text', label: '委案时间', prop: 'entrusting_time', is_import: true, width: '145',         
            render: (h,item)=>{
            let t = item;
              if(t) {
                 t = this.$tool.getDate(new Date(t));
              }
              return h('span', t);
            }
          },
          { type: 'text', label: '附件', prop: 'attachments', width: '240',   
            render (h,item) {
              return h(
                'span', 
                item.map(function (g) {
                    return h('a', 
                    {
                      style: {
                      marginRight: '2px',
                  },
                  attrs: {
                    href: '#',
                  },
                    },g.name)
                })
              )
            } 
          },
          { type: 'text', label: '创建时间', prop: 'create_time', width: '200'},
          { type: 'text', label: '奖励等级', prop: 'bonus_level', width: '145'},
          { type: 'text', label: '返发明人稿时间', prop: 'first_edition_to_inventor_time', is_import: true, width: '175', show: false,},
          { type: 'text', label: '发明人审核时间', prop: 'inventor_review_time', is_import: true, width: '175', show: false,},
          { type: 'text', label: '发明人审核次数', prop: 'inventor_review_times', is_import: true, width: '175', show: false,},
          { type: 'text', label: '发明人评分', prop: 'inventor_rank', is_import: true, width: '150', show: false,},
          { type: 'text', label: '返IPR稿时间', prop: 'first_edition_to_ipr_time', is_import: true, width: '175', show: false,},
          { type: 'text', label: 'IPR定稿时间', prop: 'ipr_final_edition_time', is_import: true, width: '175', show: false,},
          { type: 'text', label: 'IPR审核次数', prop: 'ipr_review-times', is_import: true, width: '175', show: false,},
          { type: 'text', label: 'IPR首次评分', prop: 'first_ipr_rank', is_import: true, width: '150',show: false,},
          { type: 'text', label: 'IPR终稿评分', prop: 'final_ipr_rank', is_import: true, width: '150', show: false,},
          { type: 'text', label: '代理人撰稿耗时', prop: 'agent_drafting_period', is_import: true, width: '175', show: false,},
          { type: 'text', label: '发明人审核耗时', prop: 'inventor_review_period', is_import: true, width: '175', show: false,},
          { type: 'text', label: 'IPR审核耗时', prop: 'ipr_review_period', is_import: true, width: '175', show: false,},
          { type: 'text', label: '代理人修改耗时', prop: 'amending_period', is_import: true, width: '175',show: false,},
          { type: 'text', label: '备注', prop: 'remark', sortable: true, width: '280', show: false},
          { type: 'text', label: '群组号', prop: 'group_number', width: '200', show: false },
          { type: 'text', label: '专利族号', prop: 'family_number', width: '200', show: false },
          { type: 'text', render_simple: 'name', label: '申请策略', prop: 'application_strategy', width: '200', show: false },
          { type: 'text', render_simple: 'name', label: '实审时机', prop: 'subexam_timing', width: '200', show: false },
          { type: 'text', label: '创新点描述', prop: 'innovation_introduction', width: '200', show: false },
          { type: 'text', label: '新申请的申请策略', prop: 'core_concepts', width: '200', show: false },
          { type: 'text', label: '决定要申请专利的原因', prop: 'decision_reason', width: '200', show: false },
          { type: 'text', render_simple: 'name', label: '技术重要性', prop: 'importance', width: '200', show: false },
          { type: 'text', render_simple: 'name', label: '是否容易回避', prop: 'avoidability', width: '200', show: false },
          { type: 'text', render_simple: 'name', label: '是否容易获取侵权证据', prop: 'evidence_discovery', width: '200', show: false },
          { type: 'text', render_simple: 'name', label: '对产品盈利的贡献度', prop: 'profitability', width: '200', show: false },
          { type: 'text', render_simple: 'name', label: '卖点相关性', prop: 'selling_point', width: '200', show: false },
          { type: 'text', label: '卖点相关的技术', prop: 'selling_point_technique', width: '200', show: false },
          { type: 'text', label: '对手使用情况', prop: 'competitor_usage', width: '200', show: false },
          { type: 'text', render_simple: 'name', label: '市场推广或宣传上的价值', prop: 'marketing_value', width: '200', show: false },
          { type: 'text', label: '项目名称', prop: 'project_name', width: '178', show: false },
          { type: 'text', label: '项目代号', prop: 'project_serial', width: '178', show: false },
          { type: 'text', label: '是否申请资助', prop: 'is_support', width: '158', is_import:true, render: this.renderBoolean},
          { type: 'text', label: '是否生物相关', prop: 'is_biological', width: '158', is_import:true, render: this.renderBoolean},
          { type: 'text', label: '是否分案申请', prop: 'is_division', width: '158', is_import:true, render: this.renderBoolean},
          { type: 'text', label: '是否提出实审请求', prop: 'is_exam_request', width: '178', is_import:true, render: this.renderBoolean},
          { type: 'text', label: '是否遗传资源相关', prop: 'is_genetic', width: '178', is_import:true, render: this.renderBoolean},
          { type: 'text', label: '是否有泄漏', prop: 'is_leakage', width: '158', is_import:true, render: this.renderBoolean},
          { type: 'text', label: '是否提前公开', prop: 'is_pre_public', width: '158', is_import:true, render: this.renderBoolean},
          { type: 'text', label: '是否要求优先权', prop: 'is_priority', width: '178', is_import:true, render: this.renderBoolean},
          { type: 'text', label: '是否保密审查', prop: 'is_secure_check', width: '158', is_import:true, render: this.renderBoolean},
          { type: 'text', label: '是否有序列表', prop: 'is_sequence', width: '158', is_import:true, render: this.renderBoolean},
          { type: 'text', label: '是否发明/新型同日申请', prop: 'is_utility', width: '198', is_import:true, render: this.renderBoolean},
        ] 
      },
      option2: {
        'is_search': false,
        'is_pagination': false,
        'columns':[
          { type: 'text', label: '文件名称', prop: 'name', min_width: '120'},
          { type: 'text', label: '上传日期', prop: 'create_time', min_width: '120'},
          { type: 'text', label: '上传人', prop: 'uploader', min_width: '100'},
          { type: 'text', label: '大小', prop: 'size', min_width: '80'},
          { 
            type: 'action',
            label: '操作',
            min_width: '120',
            btns: [
              { type: 'view', click: ({viewUrl})=>{window.open(viewUrl)}},
              { type: 'download', click: ({downloadUrl})=>{window.open(downloadUrl)}},  
            ]
          }
        ],
      },
      tableData: [],
      tableData2: [],
      filter: {},
    };
  },
  computed: {
    ...mapGetters([
      'areaMap',
      'menusMap',
      'configsExtends1',
      'configsExtends2',
      'configsExtends3',
      'extendsData',
    ])
  },
  methods: {
    ...mapActions([
      'refreshFlows',
      'refreshTaskDefs',
    ]),
    add () {
      this.$router.push('/patent/add');
    },
    refreshTableData (option) {
      const url = URL;
      const data = Object.assign({}, option, this.filter);
      const success = d=>{
        if(data['format'] == 'excel') {
          window.location.href = d.patents.downloadUrl;
        }else {
          this.tableData = d.patents;
        }
      };

      this.refreshProxy = this.axiosGet({url, data, success});
    },
    refresh () {
      this.$refs.table.refresh();
    },
    renderBoolean (h,item) {
      item?item = "是" : item = "否";
      return h('span',item)
    },
    deletePatent ({ title, id }) {
      this.$confirm(`删除后不可恢复，确认删除‘${title}’吗？`)
        .then(()=>{
          const url=`${URL}/${id}`;
          const success = _=>{this.$refs.table.update()};
          this.axiosDelete({url, success});    
        })
        .catch(()=>{});
    },
    detail ({id}) {
      const path = `/patent/list/detail/${id}`; 
      this.$router.push( path );
    },
    handleRowClick (row) {
      this.currentRow = row;
      if(!this.shrinkVisible) this.shrinkVisible = true;
    },
    handleCellClick (row,columns,cell) {
      if(columns.property=='attachments'){
        this.dialogVisible = true;
        this.tableData2 = row;
      }
    },
    close () {
      this.$refs.table.setCurrentRow();
    },
    downloadPop () {
      const select = this.$refs.table.getSelect();
      
      if(select) {
        this.downloadIds = this.$tool.splitObj(select, 'id');
        this.downloadVisible = true;
      }
    },
    downloadAxios () {
      if(this.downloadFileType == '') {
        this.$message({message: '请选择文件类型', type: 'warning'});
        return;
      }

      const url = '/patents/documents/download';
      const data = {ids: this.downloadIds, type: this.downloadFileType };
      const success = _=>{ 
        window.location.href = _.url;
      };
      const complete = _=>{ this.downloadLoading = false; };

      this.downloadVisible = false;
      this.downloadLoading = true;
      this.axiosPost({url, data, success, complete})
    },
    save () {
      this.$refs.detail.edit();
    },
    rateRender (h,item) {
      item = item ? item : 0;
      // return (
      //   <el-rate 
      //     value={item}
      //     disabled
      //     show-text
      //     text-color="#ff9900"
      //     text-template="{value}">
      //   </el-rate>
      // );
      return h('el-rate', {
        attrs: {
          value: item/20,
          disabled: true,
          showText: true,
          textColor: '#f90',
          textTemplate: item + '',
        }
      })
    },
  },
  created () {
    
    const getExtends = (label, prop)=>{
      return {
        type: 'text',
        label: this[label],
        prop,
        width: '200',
        show: false,
      }
    }
    
    if(this.extendsData.length != 0) {
      const c = this.tableOption.columns;
      c.push(getExtends('configsExtends1', 'extends1'));
      c.push(getExtends('configsExtends2', 'extends2'));
      c.push(getExtends('configsExtends3', 'extends3'));
    }

    this.filter = this.$route.query;
    this.refreshFlows();
    this.refreshTaskDefs();
  },
  mounted () {
    
    if(this.$route.query) {
      console.log(this.$route.query);
    }
    
    this.$refs.table.refresh();
  },
  components: {  
    AppFilter, 
    TableComponent, 
    AppTree, 
    AppDatePicker, 
    Strainer, 
    AppShrink, 
    CommonDetail,
    StaticSelect,
  },
}
</script>
<style lang="scss">


</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">


</style>
