<template>
  <div class="main">
    <span>通知书：
    <el-upload
      :action="upload_url"
      :on-success="handleSuccess"
      multiple
      :show-file-list="false"
      style="display: inline-block;"
    >
      <el-button type="primary" size="small">上传</el-button>
    </el-upload>
    </span>
	   <app-table :columns="columns" :data="tableData" style="margin-top: 15px;"></app-table>
     <div class="documents" style="margin-top: 15px;">
      <span>其他文档：<el-button type="primary" size="small">上传</el-button></span>
       <documents style="margin-top: 15px;"></documents>
     </div>
  </div>
</template>

<script>
import AppTable from '@/components/common/AppTable' 
import Documents from '@/components/page_extension/CommonDetail_documents'

const config = [
  ['patent', {
    action: 'getPatentDocuments',
    url: '/patents/documents',
    type: 'patent',
    file_type: 'file_type_patent',
  }],
  ['trademark', {
    action: 'getTrademarkDocuments',
    url: '/trademarks/documents',
    type: 'trademark',
    file_type: 'file_type_trademark',
  }],
  ['copyright', {
    action: 'getCopyrightDocuments',
    url: '/copyrights/documents',
    type: 'copyright',
    file_type: 'file_type_copyright',
  }],
  ['patent_notice', {
    action: 'getPatentNoticesDocuments',
    url: '/patents_notice/documents',
    type: 'patent',
    file_type: 'file_type_patent_notice',
    time: true,
    legal_time: true,
    issue_date: true,
    apd: true,
    apn: true,
    pct_search_date: true,
    pct_search_result: true,
    no_zip: true,
  }],
  ['copyright_notice', {
    action: 'getCopyrightNoticesDocuments',
    url: '/copyrights_notice/documents',
    type: 'copyright',
    file_type: 'file_type_copyright_notice',
    time: true,
    legal_time: true,
    issue_date: true,
    apd: true,
    apn: true,
    pct_search_date: true,
    pct_search_result: true,
    no_zip: true,
  }],  
  ['trademark_notice', {
    action: 'getTrademarkNoticesDocuments',
    url: '/trademarks_notice/documents',
    type: 'trademark',
    file_type: 'file_type_trademark_notice',
    time: true,
    legal_time: true,
    issue_date: true,
    apd: true,
    apn: true,
    pct_search_date: true,
    pct_search_result: true,
    no_zip: true,
  }],
]
const map = new Map(config);
export default {
  name: 'commonDeatailNotice',
  data () {
  	return {
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
          'min_width': '168',
          btns: [
            { type: 'download', click: ({downloadUrl})=>{ window.location.href = downloadUrl } },
            // { type: 'delete',  click: ({notice_name})=>{ this.$message({message: `暂时不可删除${notice_name}`, type: 'warning'}) } },
            { type: 'view', click: ({viewUrl})=>{ window.open(viewUrl) } },
          ]
        }
      ]
  	};
  },
  props: ['type'],
  computed: {
    config () {
      const config = map.get(this.type);
      return config ? config : this.type;
    },
    upload_url () {
      const action = this.config.action;
      let url = '/api/files';
      if(action != '') {
        url += `?action=${action}`;
      }

      return url;
    },    
    tableData () { 
      return this.$store.getters.detailNotices; 
    }
  },
  created(){
    this.$nextTick(_=>{
      
    console.log(this.type);
    });
  },
  methods: {
    handleSuccess (a,b,c) {
      const l = this.tableDatas.length;
      const lists = [];
      if(a.status) {
        
        a.data.list.forEach((_, key)=>{ 
          _.time = '';
          _.legal_time = '';
          _.apd = '';
          _.issue_date = '';
          _.apn = '';
          _.pct_search_result = '';
          _.pct_search_date = '';   
          if(_.type) {
            _.type =  _.type.id;
          }
          lists.push(this.$tool.deepCopy(_));
          _.type = '';
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
  },
  components: { 
    AppTable,
    Documents,
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>