<template>
  <div class="main">
    
    <table-component :tableOption="tableOption" :data="tableData" @refreshTableData="refreshTableData" ref="table" :refresh-proxy="refreshProxy">
      <!-- <el-button v-if="!!(menusMap && !menusMap.get('/patent/download') )" slot="download" :loading="downloadLoading" icon="share" @click="downloadPop" type="primary" style="margin-left: 5px;">批量下载</el-button> -->
    </table-component>
    
    
      <common-detail
        :title="currentRow.title"
        :visible.sync="shrinkVisible" 
        type="patent" 
        :id="currentRow.id" 
        ref="detail"
        @editSuccess="refresh"
        @sendEmail="handleSendMail">
      </common-detail>
    
    <app-shrink :visible.sync="mailVisible" :modal="true" :modal-click="false" :is-close="false" title="发送邮件">
      <mail-edit style="margin-top: 10px; " ref="mailEdit" @sendSuccess="mailCallBack" @cancelSending="mailCallBack"></mail-edit>
    </app-shrink> 

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

    <el-dialog title="案件类型" :visible.sync="caseVisible" size="tiny">
      <el-form ref="caseForm" :model="caseForm">
        <el-form-item label="案件类型" prop="caseType" :rules="{type: 'number',required: true, message: '案件类型不能为空', trigger: 'change'}">
          <static-select type="relative_projects_type" v-model="caseForm.caseType"></static-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="dropAdd">保存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import AppFilter from '@/components/common/AppFilter'
import TableComponent from '@/components/common/TableComponent'
import AppTree from '@/components/common/AppTree'
import AppDatePicker from '@/components/common/AppDatePicker'
import AppShrink from '@/components/common/AppShrink'
import CommonDetail from '@/components/page_extension/Common_detail'
import StaticSelect from '@/components/form/StaticSelect'
import RemoteSelect from '@/components/form/RemoteSelect'
import MailEdit from '@/components/common/MailEditForm'
import AppDate from '@/components/common/AppDate'
import { mapGetters,mapActions } from 'vuex'

const URL = '/patents';
const PATENT_TYPE = ['发明专利', '实用新型', '外观设计']; 

const renderMap = new Map([
  ['serial', this.serialRender],
]);

export default {
  name: 'patentList',
  data () {
    return {
      value6: '',
      refreshProxy: '',
      caseForm:{
        caseType: '',
      },
      currentRow: '',
      selectData: [],
      shrinkVisible: false,
      caseVisible: false,
      downloadVisible: false,
      downloadIds: [],
      downloadFileType: [],
      downloadLoading: false,
      mailVisible: false,
      tableOption: {
        'name': 'patentList',
        'url': URL,
        'height': 'default',
        'search_placeholder': '搜索案号、标题、申请号、提案号', 
        'highlightCurrentRow': true,
        'rowClick': this.handleRowClick,
        'is_filter': true,
        'is_list_filter': true,
        'list_type': 'patent',
        'import_type': 'patent',
        'upload_type': 'patent',
        'header_btn': [
          { type: 'add', click: this.add, map_if: '/patent/add', },
          { type: 'delete', map_if: '/patent/delete' }, 
          { type: 'import', map_if: '/patent/import' },
          { type: 'export2', map_if: '/patent/export' },
          { type: 'batch_upload', map_if: '/patent/upload' },
          { type: 'control', label: '字段' },
        ],
        'header_slot': ['download'],
        'columns': [

          { type: 'selection' },
          // { type: 'text', label: '专利状态', prop: 'status', render: (h,item)=>h('span', item ? '正常' : '暂停处理') },
          { type: 'text', label: '案号', prop: 'serial', is_agency: true, sortable: true, width: '160',render: this.serialRender, },
          { type: 'text', label: '事务所案号', prop: 'agency_serial', is_agency: true, sortable: true, width: '150',  },
          { type: 'text', label: '案件名称', prop: 'title', sortable: true, is_import: true, width: '200', is_agency: true },
          { type: 'text', label: '英文名称', prop: 'english_title', sortable: true, is_import: true, width: '200', is_agency: true },
          { type: 'text', label: '专利类型', prop: 'type', render_simple: 'name', is_agency: true,  is_import: true, width: '120',  },
          { type: 'text', label: '申请国家', prop: 'area',  is_import: true, width: '120', is_agency: true, },
          { type: 'array', label: '申请人', prop: 'applicants', width: '200', is_import: true,render: _=>{ return _.map(_=>_.name);},},
          { type: 'text', label: '申请号', prop: 'apn', sortable: true, is_import: true, width: '140', is_agency: true},
          { type: 'text', label: '申请日', prop: 'apd', sortable: true, is_import: true, width: '123', is_agency: true,},
          { type: 'text', label: '提案号', prop: 'proposal_serial', sortable: true, width: '140' },
          { type: 'text', label: '法律状态', prop: 'legal_status', sortable: true, width: '180', is_agency: true, render_simple: 'name'},
          { type: 'text', label: 'IPR', prop: 'ipr', render_simple: 'name',  is_import: true, width: '90', is_agency: true, },
          // { type: 'array', label: '提案标题', prop: 'proposals', width: '200', render: _=>_.map(_=>_.title),},
          { type: 'text', label: '产品相关', prop: 'product_relevance', render_simple:'name', width: '115', sortable: true,},
          { type: 'text', label: '技术联系人', prop: 'proposer', sortable: true, width: '130', is_import: true, is_agency: true, render_simple: 'name',},
          { type: 'array', label: '发明人', width: '238', prop: 'inventors', is_import: true, is_agency: true, render: _=>_.map(_=>`${_.name}_${_.email}:${_.share}%`),},          
          { type: 'array', label: '送件发明人', width: '238', prop: 'alias_inventors', is_import: true, is_agency: true, render: _=>_.map(_=>`${_.name}_${_.email}`),},
          { type: 'text', label: '代理机构', width: '130', prop: 'agency', render_simple: 'name', is_import: true},
          { type: 'text', label: '代理人', width: '90', prop: 'agent', render_simple: 'name', is_import: true},
          { type: 'text', label: '技术理解评分', prop: 'tech_rank', is_import: true,  width: '130', show: true},
          { type: 'text', label: '撰写质量评分', prop: 'draft_rank', is_import: true, width: '130', show: true},
          { type: 'text', label: '服务态度评分', prop: 'service_rank', is_import: true,  width: '130', show: true},
          { type: 'text', label: '特别评价', prop: 'negative_flag', is_import: true, width: '110', show: true},
          { type: 'text', label: '评价详情', prop: 'negative_comment', is_import: true, width: '110', show: true,},
          { type: 'text', label: '专利摘要', prop: 'abstract', sortable: true, width: '200'},
          { type: 'text', label: '公开日', prop: 'public_date', sortable: true, is_import: true, width: '110', show: false},
          { type: 'text', label: '公开号', prop: 'public_number', sortable: true, is_import: true, width: '110', show: false},
          { type: 'text', label: '初审合格日', prop: 'pre_exam_ok_date', sortable: true, width: '140', show: false,},
          { type: 'text', label: '进入实审日', prop: 'sub_exam_start_date', sortable: true, width: '140', show: false},
          { type: 'text', label: '公告日', prop: 'issue_date', sortable: true, is_import: true, width: '110', show: false},
          { type: 'text', label: '公告号', prop: 'issue_number', sortable: true, is_import: true, width: '110', show: false},
          { type: 'text', label: '主国际分类号', prop: 'main_ipc', sortable: true, width: '160', show: false},
          { type: 'text', label: '国际申请日', prop: 'pct_apd', sortable: true, width: '140', show: false},
          { type: 'text', label: '国际申请号', prop: 'pct_no', sortable: true, width: '140', show: false},
          { type: 'text', label: '国际优先权日', prop: 'pct_priority_date', sortable: true, width: '160', show: false},
          { type: 'text', label: '国际公开日', prop: 'pct_public_date', sortable: true, width: '140', show: false},
          { type: 'text', label: '国际公开语言', prop: 'pct_public_language', sortable: true, width: '160', show: false},
          { type: 'text', label: '国际公开号', prop: 'pct_public_no', sortable: true, width: '140', show: false},
          { type: 'text', label: '复审委内编号', prop: 'board_number', sortable: true, width: '160', show: false},
          { type: 'text', label: '证书编号', prop: 'certificate_no', sortable: true, width: '160', show: false},
          { type: 'text', label: '说明书字数', prop: 'words', sortable: true, width: '140', show: false},
          { type: 'array', label: '标签', prop: 'tags', render: _=>_.map(_=>_.name), is_import: true, width: '123',},
          { type: 'text', label: '案件等级', prop: 'level',width: '100',},
          { type: 'text', label: '部门全名', prop: 'branch', sortable: true, render:  (h,item)=>h('span', item.name), width: '123' },
          { type: 'text', label: '部门简称', prop: 'abbr', sortable: true, render_simple: 'abbr', width:'123'},
          { type: 'text', label: '技术分类', width: '123' , prop: 'classification', sorable: true, is_import: true, render_simple: 'name',},
          // { type: 'array', label: '优先权', prop: 'priorities', width: '145',render: _=>_.map(_=>_.number),},
          // { type: 'array', label: '产品名称', width: '180', prop: 'products', sortable: true, render: _=>_.map(_=>_.name),},
          // { type: 'array', label: '相关案件', prop: 'relates', width: '200', render: _=>_.map(_=>`${_.title}-${_.serial}`),},
          { type: 'text', label: '委案时间', prop: 'entrusting_time', is_import: true, width: '123',         
            render: (h,item)=>{
              let t = item;
              if(t) {
                t = this.$tool.getDate(new Date(t));
              }
              return h('span', t);
            }
          },
          { type: 'text', label: '返发明人稿时间', prop: 'first_edition_to_inventor_time', is_import: true, width: '160', show: false},
          { type: 'text', label: '发明人审核时间', prop: 'inventor_review_time', is_import: true, width: '160', show: false},
          { type: 'text', label: '发明人审核次数', prop: 'inventor_review_times', is_import: true, width: '160', show: false},
          { type: 'text', label: '发明人评分', prop: 'inventor_rank', is_import: true, render: this.rateRender, width: '160', show: false},
          { type: 'text', label: '返IPR稿时间', prop: 'first_edition_to_ipr_time', is_import: true, width: '160', show: false},
          { type: 'text', label: 'IPR定稿时间', prop: 'ipr_final_edition_time', is_import: true, width: '160', show: false},
          { type: 'text', label: 'IPR审核次数', prop: 'ipr_review-times', is_import: true, width: '160', show: false},
          // { type: 'text', label: 'IPR首次评分', prop: 'first_ipr_rank', is_import: true, render: this.rateRender, width: '160', show: false},
          // { type: 'text', label: 'IPR终稿评分', prop: 'final_ipr_rank', is_import: true, render: this.rateRender, width: '160', show: false},
          { type: 'text', label: '代理人撰稿耗时', prop: 'agent_drafting_period', is_import: true, width: '160', show: false},
          { type: 'text', label: '发明人审核耗时', prop: 'inventor_review_period', is_import: true, width: '160', show: false},
          { type: 'text', label: 'IPR审核耗时', prop: 'ipr_review_period', is_import: true, width: '160', show: false},
          { type: 'text', label: '代理人修改耗时', prop: 'amending_period', is_import: true, width: '170', show: false},
          { type: 'text', label: '详细状态', prop: 'flownode', sortable: true, width: '180', is_agency: true, render_simple: 'name'},
          { type: 'text', label: '备注', prop: 'remark', sortable: true, width: '123' },
          { type: 'array', label: '项目/奖项名称', prop: 'awards',  render: _=>{ return _.map(_=>_.name);}, width: '200'},
          { type: 'text', label: '主动修改期限', prop: 'active_supplement_expire_date', sortable: true, width: '145' },
          { type: 'text', label: '委案类型', prop: 'agency_type', sortable: true, width: '145' , render_simple: 'name'},
          { type: 'text', label: '代理人修改时间', prop: 'agent_amending_period', sortable: true, width: '160' },
          { type: 'text', label: '立案时间', prop: 'create_time', sortable: true, width: '145' },
          { type: 'text', label: 'DAS码', prop: 'das', sortable: true, width: '145' },
          { type: 'text', label: '专利族号', prop: 'family_number', sortable: true, width: '145' },
          { type: 'text', label: '群组号', prop: 'group_number', sortable: true, width: '145' },
          { type: 'text', label: 'IPR审核次数', prop: 'ipr_review_times', sortable: true, width: '145' },
          { type: 'text', label: 'PCT19条修改期限', prop: 'pct_19_expire_date', sortable: true, width: '198' },
          { type: 'text', label: 'PCT进入国家阶段期限', prop: 'pct_national_stage_expire_date', sortable: true, width: '198' },
          { type: 'text', label: 'PCT国际初步审查期限', prop: 'pct_pre_exam_expire_date', sortable: true, width: '198' },
          { type: 'text', label: '国际检索日期', prop: 'pct_search_date', sortable: true, width: '145' },
          { type: 'text', label: '优先权届满期限', prop: 'priority_expire_date', sortable: true, width: '178' },
          { type: 'text', label: '项目名称', prop: 'project_name', sortable: true, width: '145' },
          { type: 'text', label: '项目编号', prop: 'project_serial', sortable: true, width: '145' },
          { type: 'text', label: '提案标题', prop: 'proposal_title', sortable: true, width: '145' },
          { type: 'text', label: '首次年费年度', prop: 'start_year', sortable: true, width: '145' },
          // { type: 'text', label: '详细类型', prop: 'type_name', sortable: true, width: '145' },
          { type: 'text', label: '是否变更', prop: 'is_amended', sortable: true, width: '178',show: false, render:this.booleanRender},         
          { type: 'text', label: '是否与生物相关', prop: 'is_biological', sortable: true, width: '198',show: false, render:this.booleanRender},          
          { type: 'text', label: '是否是分案申请', prop: 'is_division', sortable: true, width: '178',show:false,render:this.booleanRender},         
          { type: 'text', label: '是否依赖于遗传资源', prop: 'is_genetic', sortable: true, width: '198',show: false, render:this.booleanRender},         
          { type: 'text', label: '是否不丧失新颖性公开', prop: 'is_leakage', sortable: true, width: '178',show: false, render:this.booleanRender},         
          { type: 'text', label: '是否许可备案', prop: 'is_licensed', sortable: true, width: '145',show: false,render:this.booleanRender},         
          { type: 'text', label: '是否提前公开', prop: 'is_pre_public', sortable: true, width: '145',show: false,render:this.booleanRender},          
          { type: 'text', label: '是否要求优先权', prop: 'is_priority', sortable: true, width: '178',show: false, render:this.booleanRender},          
          { type: 'text', label: '是否保密审查', prop: 'is_secure_check', sortable: true, width: '145',show: false,render:this.booleanRender},         
          { type: 'text', label: '是否有序列表', prop: 'is_sequence', sortable: true, width: '145',show: false, render:this.booleanRender},          
          { type: 'text', label: '是否同日新型/发明', prop: 'is_utility', sortable: true, width: '178',show: false, render:this.booleanRender},  
          { type: 'text', label: '技术领域', prop: 'technical_field', sortable: true, width: '130', is_import: true, is_agency: true, render_simple: 'name',},
        // {
          //   type: 'action',
          //   width: '145',
          //   btns: [
          //     // { type: 'detail', click: this.detail },
          //     { type: 'delete', click: this.deletePatent },
          //   ], 
          // },
        ] 
      },
      tableData: [],
    };
  },
  computed: {
    ...mapGetters([
      'areaMap',
      'menusMap',
      'nextUser',
      'userrole',
    ]),
    defaultParams () {
      const params = this.$route.meta.params;
      return params ? params : {};
    },
    custom () {
      const custom = this.$route.meta.custom;
      return custom !== undefined ? custom : false;
    },
    // certificateParams () {
    //   const certificate = this.$route.params.id;
    //   return  certificate !== undefined ? certificate : false; 
    // }
  },
  methods: {
    ...mapActions([
      'refreDetailData',
      'initializeSelectorCache',
      'refreshFlows',
      'refreshTaskDefs',
      'refreshFlownodes'
    ]),
    handleSendMail (id) {
      this.mailVisible = true;
      this.$nextTick(() => {
        this.$refs.mailEdit.initForm(id);
      });
    },
    mailCallBack() {
      this.mailVisible = false;
      this.refreDetailData();
    },
    dropAdd () {
      this.$refs['caseForm'].validate((v)=>{
        if(v){
          this.caseVisible = false;
          this.$router.push({ path: '/patent/add', query: {s:this.selectData,t:this.caseForm.caseType}});
        }else{
          this.$message({type: 'warning',message: '案件类型不能为空'});
        }
      })
    },    
    add () {
      this.selectData = this.$refs.table.getSelection();
      if (this.selectData.length != 0) {
        this.caseVisible = true;
      }else {
        this.$router.push('/patent/add');
      }
    },
    ifAgency () {
      const r = this.userrole;
      if( r == 5 || r == 6 ) {
        
        const arr = this.tableOption.columns;
        let i = arr.length;
        while(i--) {
          if( !arr[i]['is_agency'] ) {
            arr.splice(i, 1);
          }
        }
        this.$forceUpdate();
      } 
    },
    booleanRender(h,item) {
      item == 1 ? item = '是' : item = '否';
      return h('span', item);
    },
    refreshTableData (option) {
      const url = URL;
      const data = Object.assign({}, option, this.defaultParams);
      const success = d=>{
        if(data['format'] == 'excel') {
          window.location.href = d.patents.downloadUrl;
        }else {
          this.tableData = d.patents;
        }
      };

      this.refreshProxy = this.$axiosGet({url, data, success});
    },
    refresh () {
      // this.$refs.table.refresh();
      this.$refs.table.update();
    },
    deletePatent ({ title, id }) {
      this.$confirm(`删除后不可恢复，确认删除‘${title}’吗？`)
        .then(()=>{
          const url=`${URL}/${id}`;
          const success = _=>{this.$refs.table.update()};
          this.$axiosDelete({url, success});    
        })
        .catch(()=>{});
    },
    detail ({id}) {
      const path = `/patent/list/detail/${id}`; 
      this.$router.push( path );
    },
    handleRowClick (row) {
      if( this.menusMap && !this.menusMap.get('/patent/detail_panel') ) {
        this.currentRow = row;
        if(!this.shrinkVisible) this.shrinkVisible = true;
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
      this.$axiosPost({url, data, success, complete})
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
          value: item,
          disabled: true,
          // showText: true,
          textColor: '#f90',
          textTemplate: item +'',
        }
      })
    },
    serialRender (h,item,data) {
      return(
        <span>
           {data.icon&&data.icon.length==2?<i class="el-icon-my-keyPoint" style="color: #ff2121"><i class="el-icon-my-award" style="color: #f2be45"></i></i>:data.icon&&data.icon.length==1&&data.icon[0]==1?<i class="el-icon-my-keyPoint" style="color: #ff2121"></i>:data.icon&&data.icon.length==1&&data.icon[0]==2?<i class="el-icon-my-award" style="color: #f2be45"></i>:<i></i>}
           <span>{ item }</span>
        </span>
      )
    },
  },
  created () {
    this.ifAgency()
    this.initializeSelectorCache({type: 'file_type_patent_notice'});
    this.refreshFlows();
    this.refreshTaskDefs();
    this.refreshFlownodes();
  },
  mounted () {
    if(!this.custom) {
      this.refresh();
    }
  },
  components: {  
    AppFilter, 
    TableComponent, 
    AppTree, 
    AppDatePicker,
    AppShrink, 
    CommonDetail,
    StaticSelect,
    RemoteSelect,
    MailEdit,
    AppDate,
  },
}
</script>
<style>

</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">



</style>
