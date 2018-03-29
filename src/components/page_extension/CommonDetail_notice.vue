<template>
  <div class="main">
<!--     <div class="attachments" v-if="type=='patent'">
      <span><el-tag>交底书：</el-tag>
      <el-upload
        :action="attachments_upload_url"
        :on-success="handleAttachSuccess"
        :show-file-list="false"
        style="display: inline-block;"
      >
        <el-button type="primary" size="small">上传</el-button>
      </el-upload>  
      <app-table :columns="columns2" :data="tableData2" style="margin-top: 15px;"></app-table>    
      </span>
    </div> -->
    <div class="notice" style="margin-top: 15px;">
      <span><el-tag>通知书：</el-tag>
      <el-upload
        :action="notice_upload_url"
        :on-success="handleSuccess"
        :before-upload="handleBeforeUpload"
        :show-file-list="false"
        style="display: inline-block;"
      >
        <el-button type="primary" size="small">上传</el-button>
      </el-upload>
      </span>
  	   <app-table :columns="columns" :data="detailNotices" style="margin-top: 15px;" :border="true"></app-table>
     </div>
     <div class="documents" style="margin-top: 15px;">
      <span><el-tag>其他文档：</el-tag> 
      <el-upload
      :action="upload_url"
      :on-success="handleSuccess"
      :before-upload="handleBeforeUploads"
      :show-file-list="false"
      style="display: inline-block;"
    >
      <el-button type="primary" size="small">上传</el-button>
    </el-upload>
  </span>
       <documents style="margin-top: 15px;"></documents>
     </div>
    <el-dialog title="文件上传" :visible.sync="dialogVisible" class="dialog-medium" :modal="false"> 
     <documents-upload  :type="types" :tableData="tableDatas" :file="file" @dialogVisible="val=>{dialogVisible=val}" @uploadSuccess="refreshDetailData"></documents-upload>
   </el-dialog>
  </div>
</template>

<script>
import AppTable from '@/components/common/AppTable' 
import Documents from '@/components/page_extension/CommonDetail_documents'
import DocumentsUpload from '@/components/common/DocumentsUpload'
import { mapActions } from 'vuex'
import { mapGetters } from 'vuex'

const config = [
  ['patent', {
    action: 'getPatentDocuments',
    type: 'patent',
  }],
  ['trademark', {
    action: 'getTrademarkDocuments',
    type: 'trademark',
  }],
  ['copyright', {
    action: 'getCopyrightDocuments',
    type: 'copyright',
  }],
  ['patent_notice', {
    action: 'getPatentNoticesDocuments',
    type: 'patent',
  }],
  ['copyright_notice', {
    action: 'getCopyrightNoticesDocuments',
    type: 'copyright',
  }],  
  ['trademark_notice', {
    action: 'getTrademarkNoticesDocuments',
    type: 'trademark',
  }],
]
const map = new Map(config);
export default {
  name: 'commonDeatailNotice',
  data () {
  	return {
      dialogVisible: false,
      noticeType: '',
      isNotice: false,
      tableDatas: [],
      file: [],
      columns: [
          { type: 'text', label: '通知书名称', prop: 'notice_name', min_width: '180' },
          { type: 'text', label: '发文日', prop: 'mail_date', width: '160' },
          { type: 'text', label: '法定期限', prop: 'deadline', width: '160' },
          { type: 'text', label: '发文序列号', prop: 'notice_serial', width: '190' },
          // { type: 'text', label: '审查员', prop: 'examiner', width: '210' },
          // { type: 'text', label: '审查部门', prop: 'examiner_dept', width: '210' },
          // { type: 'text', label: '审查员电话', prop: 'examiner_phone', width: '210' },
        {
          type: 'action',
          fixed: false,
          width: '150',
          btns: [
            { type: 'download', click: ({downloadUrl})=>{ window.location.href = downloadUrl } },
            // { type: 'delete',  click: ({notice_name})=>{ this.$message({message: `暂时不可删除${notice_name}`, type: 'warning'}) } },
            { type: 'view', click: ({viewUrl})=>{ window.open(viewUrl) } },
          ]
        }
      ],
      columns2: [
        { type: 'text', label: '文件名称', prop: 'name',min_width: '178' },
        { type: 'text', label: '文件类型', prop: 'type',width:'100' },
        { type: 'text', label: '文件格式', prop: 'ext' ,width:'100'},
        { type: 'text', label: '文件大小', prop: 'size' ,width:'100'},
        { type: 'text', label: '上传人', prop: 'uploader',width:'100' },
        { type: 'text', label: '上传时间', prop: 'create_time' ,width:'145'},
        {
          type: 'action',
          width: '150',
          fixed: false,
          btns: [
            { type: 'download', click: ({downloadUrl})=>{ window.location.href = downloadUrl } },
            // { type: 'delete',  click: ({notice_name})=>{ this.$message({message: `暂时不可删除${notice_name}`, type: 'warning'}) } },
            { type: 'view', click: ({viewUrl})=>{ window.open(viewUrl) } },
          ]
        }        
      ],
      tableData2: [],
  	};
  },
  props: ['type'],
  computed: {
    ...mapGetters([
      'detailBase',
      'detailNotices',
    ]),
    notice_upload_url () {
      this.noticeType = this.type;
      this.noticeType += '_notice';
      const config = map.get(this.noticeType);
      const action =config.action;
      let url = '/api/files';
      if(action != '') {
        url += `?action=${action}`;
      }
      return url;
    },
    upload_url () {
      const config = map.get(this.type);
      const action = config.action;
      let url = '/api/files';
      if(action != '') {
        url += `?action=${action}`;
      }

      return url;
    },
    attachments_upload_url () {
      let url = '/api/files';
      return url;
    },
/*    tableData () { 
      return this.$store.getters.detailNotices; 
    },*/
    types () {
      return this.isNotice ? this.noticeType : this.type;
    },
  },
  created(){
  },
  methods: {
    ...mapActions([
      'refreshDetailData',
    ]),
    handleBeforeUpload (a) {
      console.log(123);
      this.isNotice = true;
    },
    handleBeforeUploads (a) {
      console.log(456);
      this.isNotice =false;
    },
    handleSuccess (a,b,c) {
       console.log(a);
      const l = this.tableDatas.length;
      const lists = [];
      if(a.status) {
        this.dialogVisible = true;
        a.data.list.forEach((_, key)=>{ 
          _.time = '';
          _.legal_time = '';
          _.apd = '';
          _.issue_date = '';
          _.apn = '';
          _.pct_search_result = '';
          _.pct_search_date = '';   
          // if(_.type) {
          //   _.type =  _.type.id;
          // }
          lists.push(this.$tool.deepCopy(_));
        });
          this.tableDatas.push(...a.data.list);
          this.file.push(a.data.file);
         
          this.$nextTick(_=>{
            lists.forEach((v,k)=>{
              this.tableDatas.splice(k+l,1,v);
            })
          })
      }else {
        this.$message({message: a.info, type: 'warning'});
      }
    },
    handleAttachSuccess (p, f, list) {
          if(p.status) {
            const id = p.data.file.id;
            let copy;
            if(this.multiple) {
              copy = [...this.value];
              copy.push(id);
            }else {
              copy = id;
            }
            
            f.id = id;
            f.downloadUrl = p.data.file.downloadUrl;
            this.$emit('uploadSuccess', p, f, list);
            this.refreshDetailData();
            this.$nextTick(_=>{
              this.tableData2 = this.detailBase.attachments;
            });
            this.$emit('input', copy);

          }else {
            this.$message({message: p.info, type: 'warning'});
          }
    },
  },
  watch: {
    types: function(val){
      if(val){
        console.log(val);
        return val;
      }
    },
  },
  components: { 
    AppTable,
    Documents,
    DocumentsUpload,
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>