<template>
  <div class="main">
    
    <table-component :tableOption="tableOption" :data="tableData" @refreshTableData="refreshTableData" ref="table" :refresh-proxy="refreshProxy">
<!--       <el-button v-if="!!(menusMap && !menusMap.get('/patent/download') )" slot="download" :loading="downloadLoading" icon="share" @click="downloadPop" type="primary" style="margin-left: 5px;">批量下载</el-button> -->
    </table-component>
    <el-dialog title="编辑证书" :visible.sync="dialogVisible">
    	<el-form :model="form">
    		<el-form-item label="备注">
    			<el-input type="textarea" v-model="form.remark"></el-input>
    		</el-form-item>
    		<el-form-item label="是否已申报资助">
    			<el-switch
					v-model="form.is_district_funding"
					on-text="是"
					off-text="否"
					on-color="#13ce66"
					off-color="#ff4949"
    			></el-switch>
    		</el-form-item>    		
    		<el-form-item label="是否已申报资助">
    			<el-switch
					v-model="form.is_city_funding"
					on-text="是"
					off-text="否"
					on-color="#13ce66"
					off-color="#ff4949"
    			></el-switch>
    		</el-form-item>
    		<el-form-item>
    			<el-button type="primary" @click="editSave">保存</el-button>
    		</el-form-item>
    	</el-form>
    </el-dialog>
   
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
  </div>
</template>

<script>
import AppFilter from '@/components/common/AppFilter'
import TableComponent from '@/components/common/TableComponent'
import StaticSelect from '@/components/form/StaticSelect'
import RemoteSelect from '@/components/form/RemoteSelect'

import { mapGetters} from 'vuex'

const urlMap = new Map([
	['invention','/certificate/invention'],
	['utility','/certificate/utility'],
	['appearance', '/certificate/appearance'],
	['taiwan', '/certificate/taiwan'],
	['foreign', '/certificate/foreign'],
	]);
const PATENT_TYPE = ['发明专利', '实用新型', '外观设计']; 

export default {
  name: 'patentCertificate',
  data () {
    return {
      value6: '',
      dialogVisible: false,
      refreshProxy: '',
      currentRow: '',
      downloadVisible: false,
      form:{
        remark: '',
        is_district_funding: '',
        is_city_funding: '',
      },
      downloadIds: [],
      downloadFileType: [],
      downloadLoading: false,
      tableOption: {
        'name': 'patentcertificate',
        'url': this.URL,
        'height': 'default',
        'search_placeholder': '搜索证书编号、名称、申请号、申请人', 
        'highlightCurrentRow': true,
        'is_list_filter': true,
        'list_type': 'certificate',
        'import_type': 'certificate',
        'header_btn': [
          { type: 'export2'},
        ],
        'header_slot': ['download'],
        'columns': [

          { type: 'selection' },
          { type: 'text', label: '证书编号', prop: 'certificate_no', sortable: true, width: '160',},
          { type: 'text', label: '申请名称', prop: 'title', sortable: true, is_import: true, width: '200', is_agency: true },
          { type: 'array', label: '申请人', prop: 'applicants', width: '200', is_import: true,render: _=>{ return _.map(_=>_.name);}},
          { type: 'text', label: '申请号', prop: 'apn', sortable: true, is_import: true, width: '140', is_agency: true},
          { type: 'text', label: '申请日', prop: 'apd', sortable: true, is_import: true, width: '123', is_agency: true},
          { type: 'array', label: '发明人', width: '238', prop: 'inventors', is_import: true, is_agency: true, render: _=>_.map(_=>`${_.name}_${_.email}:${_.share}%`),},          
          { type: 'text', label: '代理机构', width: '145', prop: 'agency', render_simple: 'name', is_import: true},
          { type: 'text', label: '代理人', width: '145', prop: 'agent', render_simple: 'name', is_import: true},
          { type: 'text', label: '备注', width: '178', prop: 'remark', is_import: true},
          { type: 'text', label: '是否已申报资助', width: '150', prop: 'is_district_funding', is_import: true},
          { type: 'text', label: '是否已申报市资助', width: '150', prop: 'is_city_funding', is_import: true},
          {
            type: 'action',
            width: '178',
            btns: [
			  { type: 'download', click: ({downloadUrl})=>{ window.location.href = downloadUrl; } },
			  { type: 'view', click: ({viewUrl})=>{window.open(viewUrl)} },
			  { type: 'edit', click: this.editShow}
            ], 
          },
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

    URL () {
      const certificate = this.$route.params.id;
      return  certificate !== undefined ? urlMap.get(certificate) : null; 
    }
  },
  methods: {

    booleanRender(h,item) {
      item == 1 ? item = '是' : item = '否';
      return h('span', item);
    },
    refreshTableData (option) {
      const url = this.URL;
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
    editShow(row) {
      this.dialogVisible = true;
      this.$tool.coverObj(this.form,row);
    },
    editSave({id}) {
      const url = `${this.URL}/${id}`;
      const data = Object.assign({},this.form);
      const success = _=>{
      	this.dialogVisible = false;
      	this.$refs.table.update();
      }
      this.$axiosPost({url, data, success});
    },
    refresh () {
      // this.$refs.table.refresh();
      this.$refs.table.update();
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
  },
  created () {
  },
  components: {  
    AppFilter, 
    TableComponent,  
    StaticSelect,
    RemoteSelect,
  },
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
