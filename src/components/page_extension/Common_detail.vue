<template>
  <div>
    <app-shrink :title="title" :visible=visibleAuth @update:visible="handleVisible">
      <span slot="header" style="float: right">
        <el-button size="small" type="primary" @click="edit" :disabled="btnDisabled">保存</el-button>
        <el-button style="margin-left: 5px;" size="small" type="danger" @click="dialogClosed = true" v-if="type == 'patent'" :disabled="btnDisabled">结案</el-button>
        <el-dropdown @command="handleCommand" trigger="click" style="margin-left: 5px;" size="small" v-if="type == 'patent'">
          <el-button size="small">
            委案<i class="el-icon-caret-bottom el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown" class="app-dropdown-menu">
            <el-dropdown-item command="cancel" :disabled="btnDisabled">撤回</el-dropdown-item>
            <el-dropdown-item command="change" :disabled="btnDisabled">变更</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </span>
      <div  v-loading="detailLoading && visibleAuth" :element-loading-text="config.loadingText" :style="divStyle">
        <el-tabs v-model="activeName">
          <el-tab-pane label="基本信息" name="base">
      			<detail-patent page-type="edit" v-if="type == 'patent'" @editSuccess="editSuccess" ref="patent"></detail-patent>
            <detail-copyright page-type="edit" v-if="type == 'copyright'" @editSuccess="editSuccess" ref="copyright"></detail-copyright>
          </el-tab-pane>
          <el-tab-pane label="流程管理" name="control">
      			<detail-control></detail-control>
          </el-tab-pane>
          <el-tab-pane label="官方来文" name="notice">
      			<detail-notice></detail-notice>
          </el-tab-pane>
          <el-tab-pane label="所有费用" name="fourth">
      			<detail-fee></detail-fee>
          </el-tab-pane>
          <el-tab-pane label="往來邮件" name="fee">
      			<detail-email></detail-email>
          </el-tab-pane>
          <el-tab-pane label="文档" name="documents">
      			<detail-documents></detail-documents>
          </el-tab-pane>
        </el-tabs>
      </div>
    </app-shrink>
    <el-dialog title="提交结案请求" :visible.sync="dialogClosed" @close="$refs.closeForm.clear();">
      <close-form :id="id" @success="dialogClosed=false" ref="closeForm"></close-form>
    </el-dialog>
    <el-dialog title="委案变更" :visible.sync="dialogChange" @close="$refs.changeForm.clear();">
      <change-form :id="id" @success="dialogChange=false;refreshDetailData();" ref="changeForm"></change-form>
    </el-dialog>
  </div>
</template>

<script>
import AppShrink from '@/components/common/AppShrink'
import DetailPatent from '@/components/page/PatentAdd'
import DetailCopyright from '@/components/page/CopyrightAdd'
import DetailControl from '@/components/page_extension/CommonDetail_control'
import DetailNotice from '@/components/page_extension/CommonDetail_notice'
import DetailFee from '@/components/page_extension/CommonDetail_fee'
import DetailEmail from '@/components/page_extension/CommonDetail_email'
import DetailDocuments from '@/components/page_extension/CommonDetail_documents'
import CloseForm from '@/components/page_extension/CommonDetail_closed'
import ChangeForm from '@/components/page_extension/CommonDetail_commision_change'

import { mapGetters } from 'vuex'
import { mapActions } from 'vuex'

const config = [
	['patent', {
		loadingText: '加载专利信息中...',
    auth: '/patent/detail_panel',
	}],
	['copyright', {
		loadingText: '加载版权信息中...',
    auth: '/copyright/detail_panel'
	}]
];
const map = new Map(config);

export default {
  name: 'commonDetailShrink',
  props: {
    'type': String,
    'id': [Number, String],
    'visible': {
      type: Boolean,
      default: false,
    },
    'title': String,
    'refreshSwitch': {
      type: Boolean,
      default: true,
    }//是否自动刷新
  },
  data () {
		return {
		  activeName: 'base',
      rendered: false,
      dialogClosed: false,
      dialogChange: false,
      btnDisabled: false,
		}
  },
  computed: {
    ...mapGetters([
      'shrinkHeight',
      'detailLoading',
      'menusMap',
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
      // if(this.menusMap.get(this.config.auth)) return;

      const type = this.type;
      const id = this.id;
      // this.$store.commit('setDetailType', type);
      this.refreshDetailData({id, type});
    },
    edit () {
      
      if(this.$refs.patent) {
        this.btnDisabled = true;
        this.$refs.patent.edit({
          complete: _=>{ this.btnDisabled = false; }
        });
      }

      if(this.$refs.copyright) {
        this.btnDisabled = true;
        this.$refs.copyright.edit({
          complete: _=>{ this.btnDisabled = false; }
        });
      }
    },
    editSuccess () {
      this.refreshDetailData();
      this.$emit('update:visible', false);
      this.$emit('editSuccess');
    },
    handleVisible (val) {
      this.$emit('update:visible', val);
    },
    closeProjectSubmit () {

    },
    handleCommand(command) {
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
    commisionChange () {

    }
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
  	DetailControl,
  	DetailNotice,
  	DetailFee,
  	DetailEmail,
  	DetailDocuments,
    CloseForm,
    ChangeForm,
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>