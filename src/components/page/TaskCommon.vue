<template>
  <div class="main" id="task_common">
    
    <table-component :tableOption="tableOption" :data="tableData" :refreshTableData="refreshTableData" :refresh-proxy="refreshProxy" ref="table">
    </table-component>
 
    <el-dialog title="申请委案" :visible.sync="dialogAgenVisible" class="dialog-small">
      <el-form :form="agen" ref="agen" label-width="80px" :model="agen">
        <el-form-item label="代理机构" prop="agency_id" :rules="{required: true, type: 'number', message: '代理机构必填', trigger: 'change' }">
          <remote-select type="agency" v-model="agen.agency_id"></remote-select><el-button size="mini" type="text" @click="showAgencyLoad">负载</el-button>
        </el-form-item>
        <el-form-item label="代理人" prop="agency_agent" v-show="agen.agency_id !== '' ? true : false">
          <remote-select type="agent" v-model="agen.agency_agent" :para="{'agency': agen.agency_id}" ref="agent"></remote-select>
        </el-form-item>
        <el-form-item label="代理类型" prop="agency_type" :rules="{ required: true, type: 'number', message: '代理类型必填', trigger: 'change' }">
          <static-select type="agency_type" v-model="agen.agency_type"></static-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="agen.remark" type="textarea"></el-input>
        </el-form-item>
        <el-form-item style="margin-bottom: 0px"><el-button @click="agenSubmit" type="primary" :disabled="btn_disabled">申请委案</el-button></el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog title="设置任务提醒偏好" :visible.sync="dialogSettingVisible" class="dialog-mini">
      <el-form label-position="top">
        <el-form-item label="请输入要提前标红色任务到期天数">
          <el-input></el-input>
        </el-form-item>
        <el-form-item label="请输入要顶部显示的任务到期天数">
          <el-input></el-input>
        </el-form-item>
        <el-form-item label="编辑任务时的默认案件类型">
          <el-input></el-input>
        </el-form-item>
        <el-form-item style="margin-bottom: 0">
          <el-button type="primary">保存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog title="新增任务" :visible.sync="dialogAddVisible" class="dialog-medium">
      <edit type="add" @addSuccess="addSuccess" ref="add"></edit>
    </el-dialog>
    <el-dialog title="编辑任务" :visible.sync="dialogEditVisible" class="dialog-medium">
      <edit type="edit" :row="currentRow" @editSuccess="editSuccess"></edit>
    </el-dialog>
    <el-dialog title="移交任务" :visible.sync="dialogTranserVisible" class="dialog-small">
      <el-form label-width="80px">
        <el-form-item label="承办人">
          <remote-select type="member" v-model="transfer_person"></remote-select>
        </el-form-item>
        <el-form-item style="margin-bottom: 0px;">
          <el-button type="primary" @click="transferTask" style="margin-bottom: 0px;">提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    
    <el-dialog title="将选中任务转给以下任务处理人" :visible.sync="dialogTurnoutVisible" class="dialog-mini">
      <el-form label-position="top">
        <el-form-item label="任务处理人">
          <el-input></el-input>
        </el-form-item>
        <el-form-item label="期限">
          <el-input></el-input>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="checkedTest">任务处理人更新为案件的负责人</el-checkbox>
        </el-form-item>
        <el-form-item style="margin-bottom: 0;">
          <el-button type="primary">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <app-shrink :visible.sync="dialogShrinkVisible" :title="currentRow.title" @close="handleShrinkClose">
      <span slot="header" style="margin-left: 10px;">
        <el-tag v-if="currentRow.flow_node">{{ currentRow.flow_node.name }}</el-tag>
        <el-tag v-if="currentRow.serial">{{ currentRow.serial }}</el-tag>
      </span>
      <span slot="header" style="float: right">
        <el-button size="small" type="primary" @click="dialogEditVisible = true" v-if="menusMap && !menusMap.get('/tasks/update')">编辑</el-button>
        <el-button size="small" style="margin-left: 0px;" v-if="menusMap && !menusMap.get('/tasks/transfer')" @click="dialogTranserVisible = true; transfer_person = {id: currentRow.person_in_charge, name: currentRow.person_in_charge_name }">移交</el-button>
        <el-button size="small" @click="handleReject" style="margin-left: 0px;" type="danger" v-if="menusMap && !menusMap.get('/tasks/reject')">退回</el-button>
      </span>
      <el-tabs v-model="activeName">        
        <el-tab-pane label="前往处理" name="finish" v-if="task_status == 0">
          <task-finish :id="currentRow.id" @submitSuccess="finishSuccess" @more="handleMore" :action="activeName"></task-finish>
        </el-tab-pane>
        <el-tab-pane label="详细信息" name="information">          
          <information :row="currentRow" @more="handleMore" :action="activeName" ref="information"></information>          
        </el-tab-pane>
        <el-tab-pane label="相关任务" name="associate">          
          <detail :id="currentRow.id" style="margin: 10px 0;" :action="activeName"></detail>  
        </el-tab-pane>
      </el-tabs>
    </app-shrink>

    
    <common-detail 
      :type="categoryType" 
      :id="currentRow.project_id" 
      :visible.sync="moreVisible" 
      :title="currentRow.title"
      @editSuccess="editProjectSuccess"
      :refresh-switch="false"
      ref="detail">
    </common-detail>   

  </div>
</template>

<script>
import AxiosMixins from '@/mixins/axios-mixins'
import Detail from '@/components/page_extension/TaskCommon_detail'
import RemoteSelect from '@/components/form/RemoteSelect'
import StaticSelect from '@/components/form/StaticSelect'

import AppFilter from '@/components/common/AppFilter'
import AppCollapse from '@/components/common/AppCollapse'
import TableComponent from '@/components/common/TableComponent'
import AppDatePicker from '@/components/common/AppDatePicker'

import Edit from '@/components/page_extension/TaskCommon_edit'
import Information from '@/components/page_extension/TaskCommon_information'

import TaskFinish from '@/components/common/TaskFinish'
import AppShrink from '@/components/common/AppShrink'
import CommonDetail from '@/components/page_extension/Common_detail'

import { mapMutations } from 'vuex'
import { mapGetters } from 'vuex'
import { mapActions } from 'vuex'
// import $ from 'jquery'

const URL = '/tasks';
const colorMap = new Map([
  [-2, '#339'],
  [-1, '#09C'],
  [0, '#3c3'],
  [1, '#f90'],
  [2, '#c03'],
]);
const typeMap = new Map([
  [0, '提案'],
  [1, '专利'],
  [2, '商标'],
  [3, '版权'],
  [4, '项目'],
  [5, '账单'],
  [6, '发文'],
]);
export default {
  name: 'taskList',
  mixins: [ AxiosMixins ],
   data () {

    return {
      dialogScreenVisible: false,
      dialogTurnoutVisible: false,
      dialogAddVisible: false,
      dialogEditVisible: false,
      dialogTranserVisible: false,
      dialogSettingVisible: false,
      dialogShrinkVisible: false,
      moreVisible: false,
      moreType: '',
      filters: {},
      activeName: 'finish',
      shrinkTitle: '',
      expandOldType: '',
      expandType: 'edit',
      checkedTest: [],
      currentRow: {},
      transfer_person: '',
      refreshProxy: '',
      tableOption: {
        'name': 'taskList',
        'url': URL,
        'height': 'default',
        'search_placeholder': '搜索案号、标题、申请号、代理人、备注',
        'is_filter': true,
        'is_list_filter': true,
        'list_type': 'task',
        'row_class': ({due_time}, index)=> {
          return ;
        },
        'header_btn': [
          {},//部分顶部按钮在refreshOption中渲染
          {},
          {},
          {},
          { type: 'export' },
          // { type: 'custom', label: '转出', icon: '', click: ()=>{ this.dialogTurnoutVisible = true; } },
          { type: 'control', label: '字段'},
          // { type: 'custom', label: '设定', icon: '', click: ()=>{ this.dialogSettingVisible = true; } }
        ],
        'highlightCurrentRow': true, 
        'rowClick': this.handleRowClick,
        // 'expandFun': (row, expanded)=>{ 
        //   const expands = this.$refs.table.expands;
        //   const old_id = expands.shift();
        //   if(old_id != row.id) { 
        //     expands.push(row.id);
        //   }else if( this.expandType != this.expandOldType) {
        //     expands.push(row.id);
        //   }
        //   this.expandOldType = this.expandType;
        // },
        'columns': [
          // { type: 'expand' },
          { type: 'selection' },
          { type: 'text', label: '案号', prop: 'serial', sortable: true, width: '210', show_option: true, render: this.titleRender },
          { type: 'text', label: '事务所案号', prop: 'agency_serial', sortable: true, width: '200', show_option: true},
          { type: 'text', label: '案件类型', prop: 'category', sortable: true, width: '145', show_option: true,render:this.categoryRender},
          { type: 'text', label: '案件名称', prop: 'title', sortable: true, width: '200', overflow: true },
          { type: 'text', label: '管制事项', prop: 'name', sortable: true, width: '134' },
          { type: 'text', label: '流程节点', prop: 'flow_node', show:true, sortable: true, width: '159'},
          { type: 'text', label: '任务来源', prop: 'sender_name', show: true,sortable: true, width: '118'},
          { type: 'text', label: 'IPR', prop: 'ipr', sortable: true, width: '118'},
          { type: 'text', label: '部门', prop: 'branch',render_simple: 'name', sortable: true, width: '160'},
          { type: 'text', label: '提案人', prop: 'proposer', render_simple: 'name', sortable: true, width: '160'},
          { type: 'text', label: '承办人', prop: 'person_in_charge_name', show: false, sortable: true, width: '118'},
          { type: 'text', label: '代理机构', prop: 'agency', show: false, sortable: true, width: '130'},
          { type: 'text', label: '代理人', prop: 'agent', sortable: true, width: '118'},
          { type: 'text', label: '申请日', prop: 'apd', sortable: true, width: '190'},
          { type: 'text', label: '申请号', prop: 'apn', sortable: true, width: '130'},
          { type: 'text', label: '开始时间', prop: 'start_time', show: false, sortable: true, width: '190'},
          { type: 'text', label: '完成时间', prop: 'end_time', sortable: true, width: '190'},
          { type: 'text', label: '指定期限', prop: 'due_time', show: false, sortable: true, width: '190'},
          { type: 'text', label: '定稿期限', prop: 'review_dealine', show: false, sortable: true, width: '190'},
          { type: 'text', label: '管控期限', prop: 'inner_dealine', show: false, sortable: true, width: '190'},
          { type: 'text', label: '法定期限', prop: 'deadline', show: false, sortable: true, width: '190'},
          { type: 'text', label: '备注', prop: 'remark', sortable: true, width: '250',overflow: true},
          { 
            type: 'action',
            fixed: false,
            label: '操作',
            min_width: '150',
            align: 'left',
            btns: [
              // { 
              //   type: 'dropdown', 
              //   label: '发送邮件',
              //   items: [
              //     { text: '立案通知' },
              //     { text: '发明人看稿' },
              //     { text: 'IPR看稿' },
              //     { text: '委案处理' },
              //   ],
              // },
              { btn_type: 'text', label: '编辑提案', click: this.proposalEdit, btn_if: _=>_.action == 'proposals/edit' },
              { btn_type: 'text', label: '编辑专利', click: this.patentEdit, btn_if: _=>_.action == 'patents/edit'},
            ],
          }
        ],
      },
      tableData: [],
      agen: {
        agency_id: '',
        agency_agent: '',
        agency_type: '',
        remark: '',
      },
      dialogAgenVisible: false,
      btn_disabled: false,
      install: '',
    };
  },
  computed: {
    ...mapGetters([
      'detailBase',
      'detailId',
      'menusMap',
    ]),
    custom () {
      const custom = this.$route.meta.custom;
      return custom !== undefined ? custom : false;
    },  
    task_status () {
      const s = this.$route.meta.status; 
      return s !== undefined ? s : 0;
    },
    inParams () {
      const p = this.$route.meta.params; 
      return p ? p : {};
    },
    urlParams () {
      return this.$route.query;
    },
    categoryType () {
      let type = '';

      if(this.currentRow.category == 1) {
        type = 'patent';
      }
      if(this.currentRow.category == 3) {
        type = 'copyright';
      }
      if(this.currentRow.category == 2) {
        type = 'trademark';
      }

      return type;
    },
    isCommon () {
      return this.currentRow.category == 1 || this.currentRow.category == 3 || this.currentRow.category == 2;//专利 版权 商标
    }
  },
  methods: {
    ...mapMutations([
      'showAgencyLoad',
      'addScreen',
    ]),
    ...mapActions([
      'refreshUser',
    ]),
    handleReport () {
      const url = {0: '/task/pending/report', '-1': '/task/pause/report', 1: '/task/finish/report'}[this.task_status];
      if(url) {
        this.$router.push(url);
      }
    },
    handleReject () {
      this.$confirm('此操作将退回当前任务，是否继续？', '提示', { 
        type: 'warning'
      }).then(_=>{
        const url = `/tasks/${this.currentRow.id}/reject`;
        const success = _=>{
          this.$message({type: 'success', message: '退回任务成功'});
          this.dialogShrinkVisible = false;
          this.update();
        };

        this.$axiosPost({url, success});
      }).catch(_=>{});
    },
    handleMore (type) {
      //当详情未加载时 通过ID比对 强制加载
      if(this.currentRow.project_id != this.detailId) {
        this.$refs.information.refresh(true);
      }
      
      this.moreVisible = true;
    },
    handleShrinkClose () {
      this.$refs.table.setCurrentRow();
    },
    addPop () {
      if(this.$refs.add) {
        this.$refs.add.clear();
      }
      this.dialogAddVisible = true;
    },
    agenPop () {
      const s = this.$refs.table.getSelect();
      let confirm = false;
      if(s) {
        for(let d of s) {

          if(d.agency !== "") {
            confirm = true;
            break;
          }
        }
        
        const pop = ()=>{
          if(this.$refs.agen) this.$refs.agen.resetFields();
          this.dialogAgenVisible = true;
        }

        if(confirm) {
          this.$confirm('你选择的任务中包含已委案的任务，确认继续委案？','提示',{ type: 'warning'} )
            .then(pop)
            .catch(_=>{});
        }else {
          pop();
        }
      }
    }, 
    agenSubmit () {
      this.$refs.agen.validate(_=>{
        if(_) {
          const ids = this.$refs.table.getSelect().map(_=>_.id);
          const url = '/tasks/agency';
          const data = Object.assign({}, this.agen, { ids });
          const success = _=>{
            this.dialogAgenVisible = false; 
            this.$message({type: 'success', message: '申请委案成功'});
            this.update();
          };
          const complete = _=>{this.btn_disabled = false};

          this.btn_disabled = true;
          this.axiosPost({url, data, success, complete});
        }else {
          this.$message({message: '请认真填写申请委案字段', type: 'warning'});
        }
      })
      
    },
    taskDelete ({title, id}) {
      this.$confirm(`此操作将永久删除任务‘${title}’, 是否继续？`)
        .then(()=>{
          const url = `${URL}/${id}`;
          const success = _=>{ this.update() };

          this.axiosDelete({url, success});
        })
        .catch(()=>{});
    },
    refreshTableData (option) {
      const url = URL;
      const data = Object.assign({}, option, {status: this.task_status}, this.urlParams, this.inParams);
      const success = d=>{
        if( data['format'] == 'excel' ) {
          window.location.href = d.tasks.downloadUrl;
        }else {
          this.tableData = d.tasks;
          this.filters = d.tasks.filters; 
        }

        //初始化接口
        //PS:如果以后多个地方有这样的需求,可将filter改为与query全局相关,而不是用存储内部值的方式,这样不需要特别处理这样的需求
        if(this.install) {
          //找出对应的对象,然后插入
          const s1 = this.filters.filter(_=>_.key == 'flow_node_id')[0];
          const s2 = s1['items'].filter(_=>_.value == this.install);
          this.addScreen({name: s1.label, key: s1.key, items: s2 });
          //只触发一次
          this.install = '';
        }     
      };

      this.refreshProxy = this.axiosGet({url, data, success}); 
    },
    refresh () {
      this.$refs.table.refresh();
    },
    update () {
      this.$refs.table.update();
    },
    transferTask () {
      const url = `${URL}/${this.currentRow.id}/transfer`
      const data = {'person_in_charge': this.transfer_person};
      const success = _=>{
        this.dialogTranserVisible = false;
        this.dialogShrinkVisible = false;
        this.$message({message: '移交成功', type: 'success'});
        this.refreshUser();

        this.update();        
      }

      this.$axiosPost({url, data, success});
    },
    addSuccess () {
      this.dialogAddVisible = false;
      this.$message({message: '添加成功', type: 'success'});
      this.refresh();
    },
    editSuccess () {
      this.dialogEditVisible = false;
      this.dialogShrinkVisible = false;
      this.$message({message: '编辑成功', type: 'success'});

      this.update();
    },
    editProjectSuccess () {
      this.update();
    },
    refreshOption () {
      const t = this.task_status;
      const h = this.tableOption;
      const menusMap = this.menusMap;

      if( t === 0 ) {
        h.header_btn.splice(3,1,{type: 'custom', label: '暂停处理', click: _=>{ this.handleTask('/api/tasks/pause') }});
      }else if( t === -1 ) {
        h.header_btn.splice(3,1,{type: 'custom', label: '恢复处理', click: _=>{ this.handleTask('/api/tasks/resume') }});
      }
      menusMap && !menusMap.get('/tasks/add_btn') ? h.header_btn.splice(0,1,{ type: 'add', click: this.addPop }) : h.header_btn.splice(0,1,{}); 
      menusMap && !menusMap.get('/tasks/delete_btn') ? h.header_btn.splice(1,1,{ type: 'delete', callback: this.refreshUser }) : h.header_btn.splice(1,1,{});
      menusMap && !menusMap.get('/tasks/agency_btn') && t != 1 ? h.header_btn.splice(2,1,{type: 'custom', label: '申请委案', click: this.agenPop}) : h.header_btn.splice(2,1,{});

      this.$forceUpdate();
    },
    handleTask(url) {
      const s = this.$refs.table.getSelect();
      if(s) {
        const data = { ids: this.$tool.splitObj(s, 'id') };
        const success = _=>{ 
          this.$message({type: 'success', message: '操作成功'});
          this.update();
          this.refreshUser();
        };

        this.axiosPut({ url, data, success });
      }
    },
    proposalEdit ({project_id}) {
      this.$router.push({path: '/proposal/edit', query: {id: project_id}});
    },
    patentEdit ({id}) {
      // console.log('patentEdit')
    },
    finishSuccess () {
      this.$message({message: '完成任务成功', type: 'success'});
      this.dialogShrinkVisible = false;
      this.refresh();
    },
    titleRender (h,item,data) {
      const color = colorMap.get(data['color']);
      let tipContent = '';
      if(color === "#3c3"){
        // console.log('绿色');
        tipContent = "正常";
      }else if(color === "#f90"){
        // console.log('橙色');
        tipContent = "即将到期";
      }else if(color === "#c03"){
        // console.log('红色');
        tipContent = "已过期";
      }else if(color === "#339"){
        tipContent = "暂停处理";
      }else if( color === "#09C"){
        tipContent = "已完成";
      }

      let str = '';
      if(data.flag == 1) {
        str += '(代)';
      }else if(data.flag == 2) {
        str += '(移)';
      }else if(data.flag == 3) {
        str += '@';
      }else if(data.flag == 4) {
        str += '(退)';
      }
      str += item;

      return ( 
        
        <span>
          <el-tooltip effect="dark" content={`${tipContent}`} placement="top">
            <i class="table-flag" style={`background-color: ${color}; margin-right: 10px;`}></i>  
          </el-tooltip>  
            <span>{ str }</span>
        </span>
       
      );
    },
    categoryRender (h,item,data) {
      const typeNum = typeMap.get(data['category']);
      return (
        <span>{ typeNum }</span>
      );
    },
    titleClick (data) {
      if(data.category == 0) {
        this.$router.push(`/proposal/detail?id=${data.project_id}`);
      }else if(data.category == 1) {
        this.$router.push(`/patent/list/detail/${data.project_id}`);
      }else if(data.category == 3) {
        this.$router.push(`/copyright/list/detail/${data.project_id}`);
      }
    },
    handleRowClick (row) {
      this.shrinkTitle = row.title; 
      this.currentRow = row;
      if( !this.dialogShrinkVisible ) this.dialogShrinkVisible = true;
    },
    save () {
      this.$refs.detail.edit();
    }
  },  
  watch: {
    filter () {
      this.refresh();
    },
    'agen.agency_id': {
      handler (val) {
        if(val !== '') {
          this.$nextTick(_=>{
            this.$refs.agent.clear()
          });  
        }else {
          this.agen.agency_id = '';
        }
      }
    },
    menusMap () {
      this.refreshOption();
    }
  },
  mounted () {


    if(this.$route.params.id) {
      this.install = this.$route.params.id;
    }
    if(!this.custom) {
      this.refresh();
    } 

    if(this.$store.getters.flowsData === undefined) {
      this.$store.dispatch('refreshFlows');  
    }
    
    if(this.$store.getters.taskDefsData === undefined) {
      this.$store.dispatch('refreshTaskDefs');
    }

    if(this.task_status == 1 || this.task_status == -1) {
      this.activeName = 'information';
    }

    this.refreshOption();
  },
  components: { 
    RemoteSelect,
    StaticSelect,
    AppFilter, 
    TableComponent, 
    AppDatePicker, 
    Edit, 
    AppCollapse, 
    TaskFinish, 
    AppShrink, 
    Information,
    CommonDetail,
    Detail,
  },
} 
</script>
<style>
  #task_common .el-dialog--small  .el-upload--text {
      display: inline-block;
      text-align: center;
      cursor: pointer;
      position: absolute;
      left: 0px;
      bottom: 4px;
  }
  @media screen and (max-width: 1024px) {
  .expand {
    width: 90px !important;
    font-size: 12px;
  }
}
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

</style>