<template>
  <div>
  <app-shrink :title="title" :visible=visibleAuth @update:visible="handleVisible">
   <span slot="header" style="float: right">
      <el-button size="small" type="primary" class="table-header-btn" @click="edit">保存</el-button>
        <el-dropdown  @command="handleCommandSend" trigger="click" style="margin-left: 5px;" size="small" v-if="type === 'patent' || type === 'trademark'">
          <el-button size="small">
            主动递交<i class="el-icon-caret-bottom el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown" class="app-dropdown-menu">
            <el-dropdown-item command="revision" :disabled="btnDisabled" v-if="type === 'patent'">主动补正</el-dropdown-item>
            <el-dropdown-item command="articleChange" :disabled="btnDisabled">著录变更</el-dropdown-item>
            <el-dropdown-item command="divide" :disabled="btnDisabled">分案</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>      
        <el-dropdown @command="handleCommand" trigger="click" style="margin-left: 5px;" size="small">
          <el-button size="small">
            委案<i class="el-icon-caret-bottom el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown" class="app-dropdown-menu">
            <el-dropdown-item command="appiontCase" :disabled="btnDisabled">委案</el-dropdown-item>
            <el-dropdown-item command="cancel" :disabled="btnDisabled">撤回</el-dropdown-item>
            <el-dropdown-item command="change" :disabled="btnDisabled">变更</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>  
      <el-button style="margin-left: 5px;" size="small" type="danger" @click="dialogClosed=true">结案</el-button>
    </span>
    <div  v-loading="detailLoading && visibleAuth" :element-loading-text="config.loadingText" :style="divStyle">
      <el-tabs v-model="activeName">
        <el-tab-pane label="基本信息" name="base">
    			<detail-patent page-type="edit" v-if="type == 'patent'" @editSuccess="editSuccess" ref="patent"></detail-patent>
          <detail-copyright page-type="edit" v-if="type == 'copyright'" @editSuccess="editSuccess" ref="copyright"></detail-copyright>
          <detail-trademark page-type="edit" v-if="type == 'trademark'" @editSuccess="editSuccess" ref="trademark"></detail-trademark>
        </el-tab-pane>
        <el-tab-pane label="流程管理" name="control">
    			<detail-control></detail-control>
        </el-tab-pane>
        <el-tab-pane label="官文&附件" name="notice">
    			<detail-notice :type="type" @uploadSuccess="edit"></detail-notice>
        </el-tab-pane>
        <el-tab-pane label="所有费用" name="fourth">
    			<detail-fee></detail-fee>
        </el-tab-pane>
        <el-tab-pane label="往来邮件" name="fee">
    			<detail-email></detail-email>
        </el-tab-pane>
<!--         <el-tab-pane label="文档" name="documents">
          <detail-documents></detail-documents>
        </el-tab-pane>  -->       
        <el-tab-pane label="动态" name="amendments">
    			<detail-amendments></detail-amendments>
        </el-tab-pane>
        <el-tab-pane label="提醒" name="remind" v-if="type=='patent'">
          <detail-remind></detail-remind>
        </el-tab-pane>
        <el-tab-pane label="委托历史" name="history">
          <detail-agencies></detail-agencies>
        </el-tab-pane>
      </el-tabs>
    </div>
  </app-shrink>
   <el-dialog title="提交结案请求" :visible.sync="dialogClosed" @close="$refs.closeForm.clear();">
    <close-form :id="id" @success="closeSuccess" ref="closeForm"></close-form>
  </el-dialog>
    <el-dialog title="委案变更" :visible.sync="dialogChange" @close="$refs.changeForm.clear();">
      <change-form :id="id" @success="dialogChange=false;refreshDetailData();" ref="changeForm"></change-form>
    </el-dialog>
  <el-dialog title="分案请求" :visible.sync="dialogDivide"  @close="$refs.divideForm.clear();">
    <divide-form :id="id" @success="dialogDivide=false;$emit('editSuccess');$emit('update:visible', false);" ref="divideForm"></divide-form>
  </el-dialog>
  <el-dialog title="新增任务" :visible.sync="dialogTask">
    <task-edit type="add" :id="id" ref="taskEdit" @addSuccess="addSuccess"></task-edit>
  </el-dialog>   
  <el-dialog title="申请委案" :visible.sync="dialogAppointVisible" @close="$refs.appiontCase.clearForm()">
    <appoint-case @appointSuccess="appiontCase" type="patent" :project-id="id" ref="appiontCase"></appoint-case>
  </el-dialog>  
  </div>
</template>

<script>
import AppShrink from '@/components/common/AppShrink'
import DetailPatent from '@/components/page/PatentAdd'
import DetailCopyright from '@/components/page/CopyrightAdd'
import DetailTrademark from '@/components/page/TrademarkAdd'
import DetailControl from '@/components/page_extension/CommonDetail_control'
import DetailNotice from '@/components/page_extension/CommonDetail_notice'
import DetailFee from '@/components/page_extension/CommonDetail_fee'
import DetailEmail from '@/components/page_extension/CommonDetail_email'
import DetailDocuments from '@/components/page_extension/CommonDetail_documents'
import DetailAmendments from '@/components/page_extension/CommonDetail_amendments'
import DetailRemind from '@/components/page_extension/CommonDetail_remind'
import DetailAgencies from '@/components/page_extension/CommonDetail_AgencyHistory'
import CloseForm from '@/components/page_extension/CommonDetail_closed'
import ChangeForm from '@/components/page_extension/CommonDetail_commision_change'
import DivideForm from '@/components/page_extension/CommonDetail_divide'
import TaskEdit from '@/components/page_extension/TaskCommon_edit'
import AppointCase from '@/components/page_extension/AppointCase'
import { mapGetters } from 'vuex'
import { mapActions } from 'vuex'
const config = [
  ['patent', {
    loadingText: '加载专利信息中...',
    auth: '/patent/detail_panel',
  }],
  ['copyright', {
    loadingText: '加载版权信息中...',
    auth: '/copyright/detail_panel',
  }],
  ['trademark', {
    loadingText: '加载商标信息中...',
    auth: '/trademark/detail_panel',
  }]
];
const map = new Map(config);

export default {
  name: 'commonDetailShrink',
  props: {
    'type': String,
    'id': Number,
    'visible': {
      type: Boolean,
      default: false,
    },
    'title': String,
    'refreshSwitch': {//是否开启自动刷新
      type: Boolean,
      default: true,
    },
  },
  data () {
    return {
      activeName: 'base',
      rendered: false,
      dialogClosed: false,
      btnDisabled: false,
      dialogChange: false,
      dialogDivide: false,
      dialogTask: false,
      dialogAppointVisible: false,
    }
  },
  computed: {
    ...mapGetters([
      'shrinkHeight',
      'detailLoading',
      'menusMap',
      'innerHeight',
      'detailBase',
    ]),
    config () {
      const config = map.get(this.type);
      return config ? config : this.type;
    },
    divStyle () {
      let s = '';
      if(this.detailLoading) {
        s=`height: ${this.shrinkHeight}px; overflow: hidden;`;
      }

      return s;
    },
    visibleAuth () {

      if( this.menusMap && !this.menusMap.get(this.config.auth) ) {
        return this.visible;
      }

      return false;
    }
  },
  methods: {
    ...mapActions([
      'refreshDetailData',
    ]),
    refreshDetail () {
      if(!this.type) return;
      if(!this.refreshSwitch) return;
      
      const type = this.type;
      const id = this.id;
      
      this.refreshDetailData({ id, type });
    },
    edit () {
      
      if(this.$refs.patent) {
        this.$refs.patent.edit();
      }

      if(this.$refs.copyright) {
        this.$refs.copyright.edit();
      }

      if(this.$refs.trademark) {
        this.$refs.trademark.edit();
      }
    },
    editSuccess () {
      this.refreshDetailData();
      // this.$emit('update:visible', false);
      this.$emit('editSuccess');
    },
    handleVisible (val) {
      this.$emit('update:visible', val);
    },
    closeSuccess () {
      this.dialogClosed = false;
      this.refreshDetailData();
    },
    appiontCase (val) {
      this.dialogAppointVisible = false;
      this.refreshDetailData();
    }, 
    handleCommand(command) {
      if(command == 'appiontCase') {
        this.dialogAppointVisible = true;
      }
      if(command == 'cancel') {
        this.commisionCancle(); //委案撤回
      }
      if(command == 'change') {
        const d = this.detailBase;
        //委案变更检测
        if(d.agency && d.agency.name) {
          this.dialogChange = true;
          this.$nextTick(_=>{
            this.$refs.changeForm.fill({agency: d.agency, agent: d.agent});
          })
        }else {
          return this.$message({message: '当前案件没有委案，不可变更', type: 'warning'});
        }
      }
    },
    handleCommandSend (command) {
      if(command == 'revision') {
          this.dialogTask = true;
          this.$nextTick(_=>{
            this.$refs.taskEdit.fill({id: this.id,name: this.title, category: 1},7,'23');
          });
      }
      if(command == 'articleChange') {
          this.dialogTask = true;
          this.$nextTick(_=>{
            this.$refs.taskEdit.fill({id: this.id,name: this.title, category: 1},16,'90');
          });
      }
      if(command == 'divide') {
        this.dialogDivide = true;
      }      
    },
    addSuccess (val) {
      this.dialogTask = false;
      this.refreshDetail();
    },       
    commisionCancle () {
      this.$confirm('此操作将对当前专利进行撤回委托的操作, 是否继续?', '提示', {type: 'warning'})
        .then(_=>{
          this.btnDisabled = true;
          this.$axiosPut({
            url: `/api/projects/${this.id}/withdraw`,
            success: _=>{
              this.$message({type: 'success', message: '撤回委托成功'});
              this.refreshDetail();
            },
            complete: _=>{
              this.btnDisabled = false;
            }
          })
        }).catch(_=>{});
      
    },
  },
  watch: {
    id () {
      if(this.type) {
        this.refreshDetail();
      }else {
        this.$emit('update:visible', false);
      }
    }
  },
  components: {
    AppShrink,
    DetailPatent,
    DetailCopyright,
    DetailTrademark,
    DetailControl,
    DetailNotice,
    DetailFee,
    DetailEmail,
    DetailDocuments,
    DetailAmendments,
    DetailRemind,
    DetailAgencies,
    CloseForm,
    ChangeForm,
    DivideForm,
    TaskEdit,
    AppointCase,
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>