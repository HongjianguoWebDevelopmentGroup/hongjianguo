<template>
  <el-dialog title="文件上传" :visible.sync="dialogVisible" class="dialog-medium">  
    <el-table
      height="250"
      style="width: 100%; margin-bottom: 10px;"
      empty-text="暂无可上传数据"
      :data="tableData"
    >
      <el-table-column label="文件名称" prop="name" width="200"></el-table-column>
      <el-table-column label="关联案件" prop="project" min-width="200">
        <template slot-scope="scope">
          <remote-select :type="config.type" v-model="scope.row.project" single></remote-select>
        </template>
      </el-table-column>
      <el-table-column label="文件类型" prop="type" width="200">
        <template slot-scope="scope">
          <static-select :type="config.file_type" v-model="scope.row.type" style="width: 100%;" @change="val=>{handleTypeChange(val, scope.$index)}"></static-select>
        </template>
      </el-table-column>
      <el-table-column label="发文日" prop="time" v-if="config.time" width="200">
        <template slot-scope="scope">
          <el-date-picker type="date" v-model="scope.row.time" style="width: 100%;" v-show="!!tableData[scope.$index]['show_mail_date']"></el-date-picker>
        </template>
      </el-table-column>
      <el-table-column label="法定期限" prop="legal_time" v-if="config.legal_time" width="200">
        <template slot-scope="scope">
          <el-date-picker type="date" v-model="scope.row.legal_time" style="width: 100%;" v-show="!!tableData[scope.$index]['show_deadline']"></el-date-picker>
        </template>
      </el-table-column>
      <el-table-column label="申请日" prop="apd" v-if="config.apd" width="200">
        <template slot-scope="scope">
          <el-date-picker type="date" v-model="scope.row.apd" style="width: 100%;" v-show="!!tableData[scope.$index]['show_apd']"></el-date-picker>
        </template>
      </el-table-column>      
      <el-table-column label="授权日期" prop="issue_date" v-if="config.issue_date" width="200">
        <template slot-scope="scope">
          <el-date-picker type="date" v-model="scope.row.issue_date" style="width: 100%;" v-show="!!tableData[scope.$index]['show_issue_date']"></el-date-picker>
        </template>
      </el-table-column>
      <el-table-column label="申请号" prop="apn" v-if="config.apn" width="200">
        <template slot-scope="scope">
          <el-input v-model="scope.row.apn" style="width: 100%;" v-show="!!tableData[scope.$index]['show_apn']"></el-input>
        </template>
      </el-table-column>       
      <el-table-column label="国际检索日期" prop="pct_search_date" v-if="config.pct_search_date" width="200">
        <template slot-scope="scope">
          <el-date-picker type="date" v-model="scope.row.pct_search_date" style="width: 100%;" v-show="!!tableData[scope.$index]['show_pct_search_date']"></el-date-picker>
        </template>
      </el-table-column>
      <el-table-column label="检索结论摘要" prop="pct_search_result" v-if="config.pct_search_result" width="200">
        <template slot-scope="scope">
          <el-input v-model="scope.row.pct_search_result" style="width: 100%;" v-show="!!tableData[scope.$index]['show_pct_search_result']"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button icon="delete" size="mini" type="text" @click="handleDelete(scope.$index)">删除</el-button>
        </template>
      </el-table-column>
        
      
    </el-table>
    <el-upload
      :action="upload_url"
      :on-success="handleSuccess"
      drag
      multiple
      style="line-height: 40px;"
      :show-file-list="false"
    >
      <div class="el-upload__text"><em>单个或多个文件上传</em></div>
    </el-upload>
    <el-upload
      :action="`${upload_url}Zip`"
      :on-success="handleSuccess"
      drag
      multiple
      style="line-height: 40px;"
      :show-file-list="false"
      v-if="!config.no_zip"
    >
      <div class="el-upload__text"><em>压缩包上传</em></div>
    </el-upload>

    <el-button type="primary" @click="importData" :loading="loading">{{ loading ? '上传中...' : '确认上传' }}</el-button>
    
<!--    <el-dialog title="指定案件号" :visible.sync="dialogVisibleIn" :modal-append-to-body="false" :modal="false">
      <el-form label-width="100px">
        <el-form-item label="案件">
          <remote-select :type="config.type" v-model="project_id"></remote-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="design" type="primary">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog> -->
  </el-dialog>
</template>

<script>
import AxiosMixins from '@/mixins/axios-mixins'
import RemoteSelect from '@/components/form/RemoteSelect'
import StaticSelect from '@/components/form/StaticSelect'
import {mapActions} from 'vuex'

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
  name: 'fileUpload',
  mixins: [ AxiosMixins ],
  props: {
    'type': null,
  },
  data () {
    return {
      fileList: [],
      tableData: [],
      file: [],
      dialogVisible: false,
      dialogVisibleIn: false,
      project_id: '',
      $index: null,
      loading: false,
    }
  },
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
    }
  },
  methods: {
    ...mapActions([
      'initializeSelectorCache',
    ]),
    show () {
      this.project_id = "";
      this.dialogVisible = true;
    },
    design() {
      const o = this.$tool.deepCopy(this.tableData[this.$index]);
      o.project_id = this.project_id;

      this.tableData.splice(this.$index, 1, o);
      this.dialogVisible = false;
    },
    handleTypeChange (selected, index) {
      console.log(selected, index);
      let f;
      if(!selected) {
        f = {};
      }else {
        f = selected.fields;
      }
      if (!f) return;
      const copy = this.$tool.deepCopy(this.tableData[index]);
      copy['show_mail_date'] = f.mail_date == 1 && this.config.time ? true : false;
      copy['show_deadline'] = f.deadline == 1 && this.config.legal_time ? true : false;
      copy['show_apd'] = f.apd == 1 && this.config.apd ? true : false;
      copy['show_issue_date'] = f.issue_date == 1 && this.config.issue_date ? true : false;
      copy['show_apn'] = f.apn == 1 && this.config.apn ? true : false;
      copy['show_pct_search_date'] = f.pct_search_date == 1 && this.config.pct_search_date ? true : false;
      copy['show_pct_search_result'] = f.pct_search_result == 1 && this.config.pct_search_result ? true : false;

      this.tableData.splice(index, 1, copy);
      // console.log(this.tableData);

      //这里使用强制刷新 无法触发更新（why？可能是数据 不在当前组件强制刷新的作用范围内）
      //只有使用数组截取的方法 让它自动检测刷新了 麻烦一些 比起直接在row上进行修改
      // this.$forceUpdate();
    
    },
    designPop (scope) {
      this.$index = scope.$index;
      this.dialogVisibleIn = true;
    },
    deleteSingle (scope) {
      this.tableData.splice(scope.$index, 1);
    },
    importData () {
      
      if(this.tableData.length == 0) {
        return this.$message({message: '上传数据不能为空', type: 'warning'});
      }

      for(let d of this.tableData) {
        // if( this.config.time && !d.time ) {
        //   return this.$message({message: '发文日不能为空', type: 'warning'});
        // }
        if( !d.project  ) {
          return this.$message({message: '关联案件不能为空', type: 'warning'});
        }
        if( !d.type ) {
          return this.$message({message: '文件类型不能为空', type: 'warning'});
        }
      }

      const url = this.config.url;
      const list = this.$tool.deepCopy(this.tableData);
      const list2 = [];
      for(let i = 0; i < list.length; i++ ) {
        const _ = list[i];
        const o = {};
        o.file_id = _.file_id;
        o.project = _.project;
        o.name = _.name;
        o.type = _.type;
        if(_.subfile) {
          o.subfile = _.subfile;
        }
        if(_.zip) {
          o.zip = _.zip;
        }
        if(_.show_mail_date) {
          if(_.time) {
            o.time = this.$tool.getDate( new Date(_.time) );
          }else {
            return this.$message({type: 'warning', message: '请填写发文日'});
          }
        }
        if(_.show_deadline) {
          if(_.legal_time) {
            o.legal_time = this.$tool.getDate( new Date(_.legal_time) );
          }else {
            return this.$message({type: 'warning', message: '请填写法定期限'}); 
          }
        }
        if(_.show_apd) {
          if(_.apd) {
            o.apd = this.$tool.getDate( new Date(_.apd) );
          }else {
            return this.$message({type: 'warning', message: '请填写申请日'}); 
          }
        }        
        if(_.show_issue_date) {
          if(_.issue_date) {
            o.issue_date = this.$tool.getDate( new Date(_.issue_date) );
          }else {
            return this.$message({type: 'warning', message: '请填写授权日期'}); 
          }
        }
        if(_.show_apn) {
          if(_.apn) {
            o.apn = _.apn;
          }else {
            return this.$message({type: 'warning', message: '请填写申请号'}); 
          }
        }
        if(_.show_pct_search_date) {
          if(_.pct_search_date) {
            o.pct_search_date = this.$tool.getDate( new Date(_.pct_search_date) );
          }else {
            return this.$message({type: 'warning', message: '请填写国际检索日期'}); 
          }
        }
        if(_.show_pct_search_result) {
          if(_.pct_search_result) {
            o.pct_search_result = _.pct_search_result;
          }else {
            return this.$message({type: 'warning', message: '请填写检索结论摘要'}); 
          }
        }           
        list2.push(o);  
      }

      const data = {file: this.file, list: list2 };
      const success = _=>{
        this.clear();
        this.dialogVisible = false;
        this.$message({message: '上传文件成功', type: 'success'});
        this.$emit('uploadSuccess');
      };
      const complete = _=>{
        this.loading = false;
      }

      this.loading = true;
      this.$axiosPost({url, data, success, complete});
    },
    handleSuccess (a,b,c) {
      const l = this.tableData.length;
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
          this.tableData.push(...a.data.list);
          this.file.push(a.data.file);
          this.$nextTick(_=>{
            lists.forEach((v,k)=>{
              this.tableData.splice(k+l,1,v);
            })
          })
      }else {
        this.$message({message: a.info, type: 'warning'});
      }
    },
    arrayRender (row, col) {
      const arr = row[col.prop];
      return col.render ? col.render(arr) : arr;
    },
    handleDelete (index) {
      this.tableData.splice(index, 1);
      this.file.splice(index, 1);
    },
    clear () {
      this.file = [];
      this.tableData = [];
    }
  },
  created () {
    this.initializeSelectorCache({type: this.config.file_type});
  },
  watch: {

  },
  components: { 
    RemoteSelect,
    StaticSelect,   
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>