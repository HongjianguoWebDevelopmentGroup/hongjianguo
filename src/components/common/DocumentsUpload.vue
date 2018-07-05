<template>
  <div class="main">
    <el-form :model="form" :rule="form" ref="uploadForm" label-width="110px">
      <el-form-item label="文件名称">
        <span>{{ name }}</span>
      </el-form-item>
      <el-form-item label="关联案件">
        <span>{{ title }}</span>
      </el-form-item>
      <el-form-item label="文件类型" prop="type">
        <static-select :type="config.file_type"  v-model="form.type" style="width: 100%;" @change="val=>{handleTypeChange(val, 0)}" ref="static"></static-select>
      </el-form-item>
      <el-form-item label="发文日" prop="time" v-if="config.time&&(!!tableData[0]['show_mail_date'])">
        <el-date-picker type="date" v-model="form.time"></el-date-picker>
      </el-form-item>      
      <el-form-item label="官方绝限" prop="legal_time" v-if="(!!tableData[0]['show_deadline'])&&config.legal_time">
        <el-date-picker type="date" v-model="form.legal_time"  ></el-date-picker>
      </el-form-item>    
      <el-form-item label="申请日" prop="apd" v-if="config.apd&&(!!tableData[0]['show_apd'])">
        <el-date-picker type="date" v-model="form.apd"></el-date-picker>
      </el-form-item>      
      <el-form-item label="申请号" prop="apn" v-if="!!tableData[0]['show_apn']&&config.apn">
        <el-input v-model="form.apn"></el-input>
      </el-form-item>    
      <el-form-item label="公开日" prop="public_date" v-if="config.public_date&&(!!tableData[0]['show_public_date'])">
        <el-date-picker type="date" v-model="form.public_date"></el-date-picker>
      </el-form-item>      
      <el-form-item label="公开号" prop="public_number" v-if="!!tableData[0]['show_public_number']&&config.public_number">
        <el-input v-model="form.public_number"></el-input>
      </el-form-item>
      <el-form-item label="授权公告日" prop="issue_date" v-if="!!tableData[0]['show_issue_date']&&config.issue_date">
        <el-date-picker type="date" v-model="form.issue_date" ></el-date-picker>
      </el-form-item>  
      <el-form-item label="授权公告号" prop="issue_number" v-if="!!tableData[0]['show_issue_number']&&config.issue_number">
        <el-input v-model="form.issue_number" ></el-input>
      </el-form-item>
      <el-form-item label="国际检索日期" prop="pct_search_date" v-if="!!tableData[0]['show_pct_search_date']&&config.pct_search_date">
        <el-date-picker type="date" v-model="form.pct_search_date"></el-date-picker>
      </el-form-item>
      <el-form-item label="国际检索摘要" prop="pct_search_result" v-if="!!tableData[0]['show_pct_search_result']&&config.pct_search_result">
        <el-input v-model="form.pct_search_result"></el-input>
      </el-form-item>
      <el-form-item label="首次年费年度" prop="start_year" v-if="!!tableData[0]['show_start_year']">
        <el-select v-model="form.start_year" placeholder="请选择">
          
          <el-option label="1" value="1"></el-option>
          <el-option label="2" value="2"></el-option>
          <el-option label="3" value="3"></el-option>
          <el-option label="4" value="4"></el-option>
          <el-option label="5" value="5"></el-option>
          <el-option label="6" value="6"></el-option>
          <el-option label="7" value="7"></el-option>
          <el-option label="8" value="8"></el-option>
          <el-option label="9" value="9"></el-option>
          <el-option label="10" value="10"></el-option>
            
        </el-select>
      </el-form-item>
      <el-form-item style="margin-bottom: 0px;">
        <el-button type="primary" @click="importData" :loading="loading">{{ loading ? '上传中...' : '确认上传' }}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import AxiosMixins from '@/mixins/axios-mixins'
import RemoteSelect from '@/components/form/RemoteSelect'
import StaticSelect from '@/components/form/StaticSelect'
import {mapActions} from 'vuex'
import {mapGetters} from 'vuex'

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
    issue_number:true,
    apd: true,
    apn: true,
    public_date:true,
    public_number:true,
    pct_search_date: true,
    pct_search_result: true,
    no_zip: true,
    start_year:true,
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
    no_zip: true,
  }],
]
const map = new Map(config);

export default {
  name: 'documentsUpload',
  mixins: [ AxiosMixins ],
  props: {
    'type': null,
    'tableData':Array,
    'file': Array,
  },
  data () {
    return {
      fileList: [],
      dialogVisibleIn: false,
      dialogVisible: false,
      project_id: '',
      $index: null,
      loading: false,
      form: {
        type: '',
        time: '',
        legal_time: '',
        apn: '',
        apd: '',
        public_date:'',
        public_number:'',
        issue_date: '',
        issue_number:'',
        pct_search_date: '',
        pct_search_result: '',
        start_year: '',
      }
    }
  },
  computed: {
    ...mapGetters([
      'title',
      'detailId',
    ]),
    config () {
      const config = map.get(this.type);
      return config ? config : this.type;
    },
    name () {
      return this.tableData.length!=0?this.tableData[0]['name']:'';
    },
  },
  methods: {
    show () {
        this.$nextTick(_=>{
        if(this.tableData.length!=0) {
          this.form.type = this.tableData[0]['type']['id']?this.tableData[0]['type']['id']-0:'';
          const v = this.$refs.static.getSelected(this.form.type);
          console.log('----------v---------');
          console.log(v);
          this.handleTypeChange(v,0);
        }  
       });
    },
    design() {
      const o = this.$tool.deepCopy(this.tableData[this.$index]);
      o.project_id = this.project_id;

      this.tableData.splice(this.$index, 1, o);
      this.dialogVisible = false;
    },
    handleTypeChange (selected, index) {
      let f;
      if(!selected) {
        f = {};
      }else {
        f = selected.fields;
        if(selected instanceof Array && selected.length !== 0 ) {
          f = selected[0].fields;
        }
      }
      if (!f) return;
      const copy = this.$tool.deepCopy(this.tableData[index]);
      copy['show_mail_date'] = f.mail_date == 1 && this.config.time ? true : false;
      copy['show_deadline'] = f.deadline == 1 && this.config.legal_time ? true : false;
      copy['show_apn'] = f.apn == 1 && this.config.apn ? true : false;
      copy['show_apd'] = f.apd == 1 && this.config.apd ? true : false;
      copy['show_public_date'] = f.public_date == 1 && this.config.public_date ? true : false;
      copy['show_public_number'] = f.public_number == 1 && this.config.public_number ? true : false;
      copy['show_issue_date'] = f.issue_date == 1 && this.config.issue_date ? true : false;
      copy['show_issue_number'] = f.issue_number == 1 && this.config.issue_number ? true : false;
      copy['show_pct_search_date'] = f.pct_search_date == 1 && this.config.pct_search_date ? true : false;
      copy['show_pct_search_result'] = f.pct_search_result == 1 && this.config.pct_search_result ? true : false;
      copy['show_start_year'] = f.start_year == 1 && this.config.start_year ? true : false;

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
    importData () {
      
      if(this.tableData.length == 0) {
        return this.$message({message: '上传数据不能为空', type: 'warning'});
      }

      if(!this.form.type) {
        this.$message({type: 'warning', message: '文件类型不能为空'});
        return false;
      }

      const url = this.config.url;
      const list = this.$tool.deepCopy(this.tableData);
      const list2 = [];
      for(let i = 0; i < list.length; i++ ) {
        const _ = list[i];
        console.log(_);
        const o = {};
        o.file_id = _.file_id;
        o.project = this.detailId;
        o.name = _.name;
        if(_.type && _.type.id == this.form.type) {
          o.type = _.type;
        }else {
          o.type = this.form.type;
        }
        if(_.subfile) {
          o.subfile = _.subfile;
        }
        if(_.zip) {
          o.zip = _.zip;
        }
        if(_.show_mail_date) {
          if(this.form.time) {
            o.time = this.$tool.getDate( new Date(this.form.time) );
          }else {
            return this.$message({type: 'warning', message: '请填写发文日'});
          }
        }
        if(_.show_deadline) {
          if(this.form.legal_time) {
            o.legal_time = this.$tool.getDate( new Date(this.form.legal_time) );
          }else {
            return this.$message({type: 'warning', message: '请填写官方绝限'}); 
          }
        }
        if(_.show_apd) {
          if(this.form.apd) {
            o.apd = this.$tool.getDate( new Date(this.form.apd) );
          }else {
            return this.$message({type: 'warning', message: '请填写申请日'}); 
          }
        }        
        if(_.show_apn) {
          if(this.form.apn) {
            o.apn = this.form.apn;
          }else {
            return this.$message({type: 'warning', message: '请填写申请号'}); 
          }
        }
        if(_.show_issue_date) {
          if(this.form.issue_date) {
            o.issue_date = this.$tool.getDate( new Date(this.form.issue_date) );
          }else {
            return this.$message({type: 'warning', message: '请填写授权公告日'}); 
          }
        }
        if(_.show_issue_number) {
          if(this.form.issue_number) {
            o.issue_number = this.form.issue_number;
          }else {
            return this.$message({type: 'warning', message: '请填写授权公告号'}); 
          }
        }
        if(_.show_public_date) {
          if(this.form.public_date) {
            o.public_date = this.$tool.getDate( new Date(this.form.public_date) );
          }else {
            return this.$message({type: 'warning', message: '请填写公开日'}); 
          }
        }
        if(_.show_public_number) {
          if(this.form.public_number) {
            o.public_number = this.form.public_number;
          }else {
            return this.$message({type: 'warning', message: '请填写公开号'}); 
          }
        }
        if(_.show_pct_search_date) {
          if(this.form.pct_search_date) {
            o.pct_search_date = this.$tool.getDate( new Date(this.form.pct_search_date) );
          }else {
            return this.$message({type: 'warning', message: '请填写国际检索日'}); 
          }
        }
        if(_.show_pct_search_result) {
          if(this.form.pct_search_result) {
            o.pct_search_result = this.form.pct_search_result;
          }else {
            return this.$message({type: 'warning', message: '请填写检索结论摘要'}); 
          }
        }
        if(_.show_start_year) {
          if(this.form.start_year) {
            o.start_year = this.form.start_year;
          }else {
            return this.$message({type: 'warning', message: '请填写首次年费年度'}); 
          }
        }
        list2.push(o);  
      }

      const data = {file: this.file, list: list2 };
      const success = _=>{
        this.clear();
        this.close();
        this.$message({message: '上传文件成功', type: 'success'});
        this.$emit('uploadSuccess');
      };
      const complete = _=>{
        this.loading = false;
      }

      this.loading = true;
      this.$axiosPost({url, data, success, complete});
    },

    arrayRender (row, col) {
      const arr = row[col.prop];
      return col.render ? col.render(arr) : arr;
    },
    clear () {
      this.file = [];
      this.tableData = [];
      this.$refs.uploadForm.resetFields();
    },
    close () {
      this.dialogVisible = false;
      this.$emit('dialogVisible',this.dialogVisible);
    },
  },
  created () {
    // console.log(this.tableData[0])
  },
  watch: {
    'form.type': {
      handler:function(val,oVal){
        if(val !== "") {  
          const v =  this.$refs.static.getSelected(val);
          console.log('-------watch v--------')
          console.log(v)
          this.handleTypeChange(v,0);
        }
      }
    },
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