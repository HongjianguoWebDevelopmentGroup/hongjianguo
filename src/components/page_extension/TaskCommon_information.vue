<template>  
	<el-collapse v-model="activeNames">
	  <el-collapse-item title="任务详情" name="1" :gutter="20">
	    <el-form label-width="70px" label-position="left" class="form-information">
	    	<el-row :gutter="20">
	    		<el-col :span="12">
	    			<el-form-item label="节点名称"><span class="form-item-text">{{ row.node_name }}</span></el-form-item>
	    			<el-form-item label="法定期限"><span class="form-item-text">{{ row.deadline }}</span></el-form-item>
	    		</el-col>
	    		<el-col :span="12">
	    			<el-form-item label="承办人"><span class="form-item-text">{{ row.person_in_charge_name }}</span></el-form-item>
	    			<el-form-item label="承办期限"><span class="form-item-text">{{ row.due_time }}</span></el-form-item>
	    		</el-col>
	    	</el-row>
        <el-row>
          <el-form-item label="备注"><span class="form-item-text">{{ row.remark }}</span></el-form-item>
        </el-row>
        <el-form-item label="附件">
          <table-component :tableOption="attachmentsOption" :data="row.attachments"></table-component>
        </el-form-item>
	    </el-form>
	  </el-collapse-item>
	  <el-collapse-item title="提案详情" name="2" v-if="row.category == 0">
	    <el-form label-width="70px" label-position="left" class="form-information" v-loading="loading" element-loading-text="加载提案信息中...">
	    	<el-row :gutter="20">
	    		<el-col :span="12">
            <el-form-item label="提案人"><span class="form-item-text">{{ row_p.proposer.name }}</span></el-form-item>
            <el-form-item label="技术分类"><span class="form-item-text">{{ row_p.classification.name }}</span></el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="发明人"><span class="form-item-text">{{ row_p.inventors.length? row_p.inventors.map(_=>_.name).join(';') : ''}}</span></el-form-item>
            <el-form-item label="标签"><span class="form-item-text">{{ row_p.tags.join(';') }}</span></el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="产品名称"><span class="form-item-text">{{ row_p.products.length? row_p.products.map(_=>_.name).join(';') : '' }}</span></el-form-item>
        </el-row>
        <el-row>
            <el-form-item label="备注"><span class="form-item-text">{{ row_p.remark }}</span></el-form-item>
        </el-row>
        <el-row>
	    			<el-form-item label="案件摘要"><span class="form-item-text">{{ row_p.abstract }}</span></el-form-item>
        </el-row>
	    	<el-row>
	    		<el-form-item label="附件">
						<table-component :tableOption="attachmentsOption" :data="row_p.attachments"></table-component>
	    		</el-form-item>
	    	</el-row>
	    </el-form>
	  </el-collapse-item>
	  <el-collapse-item  name="2" v-else-if="row.category == 1">
      <template slot="title">
        专利详情<el-button v-if="ifMore" size="mini" type="text" style="margin-left: 10px;" @click.stop="editPatent">更多...</el-button>
      </template>
	    <el-form label-width="70px" label-position="left" class="form-information" v-loading="detailLoading" element-loading-text="加载专利信息中..." style="min-height: 300px;">
	    	<template v-if="!!detailBasePatent">
          <el-row :gutter="20">
  	    		<el-col :span="12">	    			
  	    			<el-form-item label="发明人"><span class="form-item-text">{{  detailBasePatent.inventors.length? detailBasePatent.inventors.map(_=>_.name).join(';') : ''}}</span></el-form-item>
  	    			<el-form-item label="技术分类"><span class="form-item-text">{{ detailBasePatent.classification.name }}</span></el-form-item>
  	    			<el-form-item label="申请地区"><span class="form-item-text">{{ detailBasePatent.area.name }}</span></el-form-item>
              <el-form-item label="专利类型"><span class="form-item-text">{{ detailBasePatent.type.name }}</span></el-form-item>
  	    			<el-form-item label="相关提案"><span class="form-item-text">{{ detailBasePatent.proposals.length? detailBasePatent.proposals.map(_=>_.serial).join(';') : ''}}</span></el-form-item>
  	    		</el-col>
  	    		<el-col :span="12">
  	    			<el-form-item label="产品名称"><span class="form-item-text">{{ detailBasePatent.products.length? detailBasePatent.products.map(_=>_.name).join(';') : '' }}</span></el-form-item>
  	    			<el-form-item label="标签"><span class="form-item-text">{{ detailBasePatent.tags.join(';') }}</span></el-form-item>
  	    			<el-form-item label="申请日"><span class="form-item-text">{{ detailBasePatent.apd }}</span></el-form-item>
              <el-form-item label="申请号"><span class="form-item-text">{{ detailBasePatent.apn }}</span></el-form-item>
  	    			<el-form-item label="提案人"><span class="form-item-text">{{ detailBasePatent.proposer.name }}</span></el-form-item>
  	    		</el-col>
  	    	</el-row>
  	    	<el-row>
  	    		<el-form-item label="案件摘要"><span class="form-item-text">{{ detailBasePatent.abstract }}</span></el-form-item>
  	    	</el-row>
  	    	<el-row>
  	    			<el-form-item label="备注"><span class="form-item-text">{{ detailBasePatent.remark }}</span></el-form-item>
  	    	</el-row>
  	    	<el-row>
  	    		<el-form-item label="附件">
  						<table-component :tableOption="attachmentsOption" :data="detailBasePatent.attachments"></table-component>
  	    		</el-form-item>
  	    	</el-row>
        </template>
        <div v-else style="text-align: center;line-height: 300px;">
          <span>暂无专利详情数据...</span>
	      </div>
      </el-form>
	  </el-collapse-item>
	  <el-collapse-item name="2" v-else-if="row.category == 3">
	    <template slot="title">
        版权详情<el-button v-if="ifMore" size="mini" type="text" style="margin-left: 10px;" @click.stop="editCopyright">更多...</el-button>
      </template>
      <el-form label-width="70px" label-position="left" class="form-information" v-loading="detailLoading" element-loading-text="加载版权信息中..." style="min-height: 300px;">
        <template v-if="!!detailBaseCopyright" >
          <el-row :gutter="20">
            <el-col :span="12">
              
              <el-form-item label="申请人"><span class="form-item-text">{{ detailBaseCopyright.applicants.length? detailBaseCopyright.applicants.map(_=>_.name).join(';') : '' }}</span></el-form-item>
              <el-form-item label="技术分类"><span class="form-item-text">{{ detailBaseCopyright.classification.name }}</span></el-form-item>
              <el-form-item label="申请地区"><span class="form-item-text">{{ detailBaseCopyright.area.name }}</span></el-form-item>
              <el-form-item label="版权类型"><span class="form-item-text">{{ detailBaseCopyright.type.name }}</span></el-form-item>
              <el-form-item label="IPR"><span class="form-item-text">{{ detailBaseCopyright.ipr.name }}</span></el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="产品名称"><span class="form-item-text">{{ detailBaseCopyright.products.length ? detailBaseCopyright.products.map(_=>_.name).join(';') : '' }}</span></el-form-item>
              <el-form-item label="标签"><span class="form-item-text">{{ detailBaseCopyright.tags.join(';') }}</span></el-form-item>
              <el-form-item label="申请日"><span class="form-item-text">{{ detailBaseCopyright.apd }}</span></el-form-item>
              <el-form-item label="申请号"><span class="form-item-text">{{ detailBaseCopyright.apn }}</span></el-form-item>
              <el-form-item label="提案人"><span class="form-item-text">{{ detailBaseCopyright.proposer.name }}</span></el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-form-item label="案件摘要"><span class="form-item-text">{{ detailBaseCopyright.abstract }}</span></el-form-item>
          </el-row>
          <el-row>
              <el-form-item label="备注"><span class="form-item-text">{{ detailBaseCopyright.remark }}</span></el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="附件">
              <table-component :tableOption="attachmentsOption" :data="detailBaseCopyright.attachments"></table-component>
            </el-form-item>
          </el-row>
        </template>
        <div v-else style="text-align: center;line-height: 300px;">
          <span>暂无版权详情数据...</span>
        </div>
      </el-form>
	  </el-collapse-item>
    <el-collapse-item name="2" v-else-if="row.category == 2">
      <template slot="title">
        商标详情<el-button v-if="ifMore" size="mini" type="text" style="margin-left: 10px;" @click.stop="editCopyright">更多...</el-button>
      </template>
      <el-form label-width="100px" label-position="left" class="form-information" v-loading="detailLoading" element-loading-text="加载商标信息中..." style="min-height: 300px;">
        <template v-if="!!detailBaseTrademark" >
          <el-row :gutter="20">
            <el-col :span="12">
              
              <el-form-item label="申请人"><span class="form-item-text">{{ detailBaseTrademark.applicants.length ? detailBaseTrademark.applicants.map(_=>_.name).join(';') : '' }}</span></el-form-item>
              <el-form-item label="申请地区"><span class="form-item-text">{{ detailBaseTrademark.area.name }}</span></el-form-item>
              <el-form-item label="商标类型"><span class="form-item-text">{{ detailBaseTrademark.type.name }}</span></el-form-item>
              <el-form-item label="初审公告日"><span class="form-item-text">{{ detailBaseTrademark.public_date }}</span></el-form-item>
              <el-form-item label="初审公告期数"><span class="form-item-text">{{ detailBaseTrademark.public_number }}</span></el-form-item>
              <!-- <el-form-item label="专用权期限"><span class="form-item-text">{{ detailBaseTrademark.expiring_date }}</span></el-form-item> -->
            </el-col>
            <el-col :span="12">
              <el-form-item label="商标类别"><span class="form-item-text">{{ detailBaseTrademark.categories.length ? detailBaseTrademark.categories.map(_=>_.name).join(';') : '' }}</span></el-form-item>
              <el-form-item label="申请日"><span class="form-item-text">{{ detailBaseTrademark.apd }}</span></el-form-item>
              <el-form-item label="申请号"><span class="form-item-text">{{ detailBaseTrademark.apn }}</span></el-form-item>

              <el-form-item label="核准注册日"><span class="form-item-text">{{ detailBaseTrademark.issue_date }}</span></el-form-item>
              <el-form-item label="核准公告期数"><span class="form-item-text">{{ detailBaseTrademark.issue_number }}</span></el-form-item>
              
            </el-col>
          </el-row>
          <el-row>
            <el-form-item label="详细类别"><span class="form-item-text">{{ detailBaseTrademark.detail }}</span></el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="备注"><span class="form-item-text">{{ detailBaseTrademark.remark }}</span></el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="附件">
              <table-component :tableOption="attachmentsOption" :data="detailBaseTrademark.attachments"></table-component>
            </el-form-item>
          </el-row>
        </template>
        <div v-else style="text-align: center;line-height: 300px;">
          <span>暂无商标详情数据...</span>
        </div>
      </el-form>
    </el-collapse-item>
    <el-collapse-item name="2" v-else-if="row.category == 5" title="账单详情">

      <invoice-detail :id="row.project_id"></invoice-detail>

    </el-collapse-item>
	</el-collapse>
</template>

<script>
import TableComponent from '@/components/common/TableComponent'
import InvoiceDetail from '@/components/page_extension/InvoiceCommon_detail'
import { mapGetters } from 'vuex'
import { mapActions } from 'vuex'

const URL = '/api/tasks';
const map = new Map([
  [1, 'patent'],
  [2, 'trademark'],
  [3, 'copyright'],
])
const errMsg = new Map([
  [1, '获取专利详情失败'],
  [2, '获取商标详情失败'],
  [3, '获取版权详情失败'],
])

export default {
  name: 'taskEdit',
  props: {
    'row': Object,
    'action': {
      type: String,
      default: 'information',
    }
  },
  data () {
  	return {
  		activeNames: ['1', '2'],
  		loading: false,
      requested: false,
  		attachmentsOption: {
        'is_search': false,
        'is_pagination': false,
        'is_border': false,
        'columns': [
          { type: 'text', label: '附件名称', prop: 'name' },
          { type: 'text', label: '附件格式', prop: 'ext' },
          { type: 'text', label: '附件大小 ', prop: 'size' },
          { 
            type: 'action', 
            label: '详情',
            btns: [
              {type: 'view', click: ({viewUrl})=>{window.open(viewUrl)}},
              {type: 'download', click: ({downloadUrl})=>{window.open(downloadUrl)}},
            ],
          }
        ]
      },
  		row_p: {
  			abstract: '',
  			inventors: [],
  			classification: '',
  			products: [],
  			tags: [],
  			remark: '',
  			attachments: [],
        proposer: '',
  		},
  		row_patent: {
  			abstract: '',
  			inventors: [],
  			classification: '',
  			products: [],
  			tags: [],
  			remark: '',
  			attachments: [],
  			area: '',
  			type: '',
  			apd: '',
  			apn: '',
        proposals: [],
        ipr: '',
        proposer: '',
  		},
      row_copyright: {
        abstract: '',
        applicants: [],
        classification: '',
        products: [],
        tags: [],
        remark: '',
        attachments: [],
        area: '',
        type: '',
        apd: '',
        apn: '',
        ipr: [],
        proposer: '',
      },
  	}
  },
  computed: {
    ...mapGetters([
      'detailBasePatent',
      'detailBaseCopyright',
      'detailBaseTrademark',
      'detailLoading',
      'menusMap',
    ]),
    ifMore () {
      const c = this.row.category;
      return !this.menusMap.get({1: '/patent/detail_panel', 2: '/copyright/detail_panel', 3: '/trademark/detail_panel'}[c]);
    }
  },
  methods: {
    ...mapActions([
      'refreshDetailData',
    ]),
    refresh: async function (flag = false) {
      if(this.action != 'information' && !flag) return;
      
      const c = this.row.category;
      //refreshDetailoData为全局的详情函数 请求专利、版权、商标详情
      if( c == 0 ) {
        this.loading = true;
        await this.refreshProposal();
        this.loading = false;
      }else if( c == 1 || c == 2 || c == 3){
        await (_=>{
          let next = '';
          this.refreshDetailData({ id: this.row.project_id, type: map.get(c), next: _=>{ next = _ } });
          return next;
        })();
      }
      this.requested = true;
    },
    //获取提案详情
  	refreshProposal () {
  		const url = `/api/proposals/${this.row.project_id}`;
  		const success = _=>{
  			this.$tool.coverObj(this.row_p, _.proposal);
  		};

  		return this.$axiosGet({url, success});
  	},
    //<更多...> 按钮的点击回掉函数 因为需要弹出同级的面板 所以 需要提供外部接口
    editPatent () {
      this.$emit('more', 'patent');
    },
    editCopyright () {
      this.$emit('more', 'copyright');
    },
    editTrademark () {
      this.$emit('more', 'trademark');
    }
  },
  created () {
  	this.refresh();
  },
  watch: {
  	row () {
      this.requested = false;
  		this.refresh();
  	},
    action () {
      if(this.requested) return;
      this.refresh();
    }
  },
  components: {
  	TableComponent,
    InvoiceDetail,
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>