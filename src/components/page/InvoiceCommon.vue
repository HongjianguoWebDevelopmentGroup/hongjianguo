<template>
  <div class="main">
    <strainer v-model="filter" @refresh="refresh"></strainer>    
    <table-component @refreshTableData="refreshTableData" :tableOption="option" :data="tableData" ref="table">
      <a href="/static/templates/fee_template.xlsx" target="_blank" slot="invoice_template" style="margin-left: 6px;font-size: 14px;">账单导入模板</a>
      <el-tag v-if="curTotal !== ''" slot="cur_total" style="margin-left: 15px;">当前页费用：{{ curTotal }}</el-tag>
      <el-tag v-if="allTotal !== ''" slot="all_total" style="margin-left: 10px;">所有费用：{{ allTotal }}</el-tag>
      <div slot="row_action" slot-scope="scope" class="invoice-action">
        <!-- <el-button :disabled="scope.row.status.id != 1" v-if="scope.row.fee_type != 5" size="mini" type="text" @click="checkClick(scope.row)">{{feeType == 0 ? '审核账单' : '确认请款'}}</el-button>
        <i class="el-icon-arrow-right" v-if="scope.row.fee_type != 5 && feeType == 0 " style="font-size: 12px;" ></i>
        <el-button :disabled="scope.row.status.id != 2" v-if="scope.row.fee_type != 5 && feeType == 0" size="mini" type="text" @click="uploadClick(scope.row)">上传凭证</el-button>
        <i class="el-icon-arrow-right" v-if="scope.row.fee_type != 5" style="font-size: 12px;"></i>
        <el-button :disabled="scope.row.status.id != 5" size="mini" type="text" @click="payClick(scope.row)">{{feeType == 0 ? '确认付款' : '确认收款' }}</el-button> -->
        <el-button v-if="scope.row.status.id == 1 && feeType == 0" size="mini" type="text" @click="checkClick(scope.row)">审核账单</el-button>      
        <el-button v-if="scope.row.status.id == 1 && feeType == 1" size="mini" type="text" @click="handleRequestPay(scope.row)">确认请款</el-button>
        <!-- <i class="el-icon-arrow-right" v-if="scope.row.fee_type != 5 && feeType == 0 " style="font-size: 12px;" ></i> -->
        <el-button v-if="scope.row.status.id == 2" size="mini" type="text" @click="uploadClick(scope.row)">上传凭证</el-button>
        <!-- <i class="el-icon-arrow-right" v-if="scope.row.fee_type != 5" style="font-size: 12px;"></i> -->
        <el-button v-if="scope.row.status.id == 5" size="mini" type="text" @click="payClick(scope.row)">{{feeType == 0 ? '确认付款' : '确认收款' }}</el-button>
        <el-button type="text" size="mini" @click="editPop(scope.row)">编辑</el-button>
      </div> 
    </table-component>
    
    <pop :feeType="feeType" :popType="popType" ref="pop" @refresh="handleEdit"></pop>
    
    <app-shrink :visible.sync="shrinkVisible" title="详细信息">
      <!-- <el-button type="primary" slot="header" @click="editPop" size="small" style="float: right; margin-top: 6px;">编辑</el-button> -->
      <!-- <invoice-detail :id="currentId" ref="detail"></invoice-detail> -->
        <upload-invoice style="margin-top: 10px;" ref="uploadInvoices"></upload-invoice>
    </app-shrink>

    <app-shrink  :visible.sync="checkVisible" title="审核帐单" :modal="true">
      <template slot="header">
        <span style="float: right; line-height: 40px;">
          <el-button @click="handlePass" type="primary" :disabled="disabled" size="small">通过</el-button>
          <el-button @click="handleRefuse" type="danger" :disabled="disabled" size="small">拒绝</el-button>
          <el-button  size="small" @click="checkSave">暂存</el-button>
        </span>
      </template>
      <check-invoice style="margin-top: 10px;" @callback="checkCallBack" @disabled="(val)=>{this.disabled = val}" ref="checkInvoice"></check-invoice>
    </app-shrink>

    <el-dialog  :visible.sync="payVisible" :title="`确认${payTitle}`" @close="payTime = ''" class="dialog-mini">
      <el-date-picker type="date" v-model="payTime" :placeholder="`请选择${payTitle}时间`"></el-date-picker>
      <div style="margin-top: 10px;">
        <el-button :loading="payLoading" @click="confirmPay" type="primary">{{ payLoading ? '确认中...' : `确认${payTitle}` }}</el-button>
      </div>
    </el-dialog>

    <app-shrink v-if="feeType == 0" :visible.sync="uploadVisible" title="上传凭证" :modal="true">
      <template slot="header">
        <span style="float: right; line-height: 40px;display: inline-block">   
              <el-upload
                :show-file-list="false"
                :on-success="uploadSuccess"
                :on-error="uploadError"
                :before-upload="beforeUpload"
                style="display: inline-block"
                :action="action">
                <el-button size="small" type="primary">上传</el-button>
              </el-upload>     
          <el-button type="primary" size="small" @click="uploadFinish"  style="display: inline-block">提交</el-button>
        </span>
      </template>
      <upload-invoice style="margin-top: 10px;" ref="uploadInvoice">
        <template slot="fee_tips">
          <span style="font-size: 14px; color: #bbb;">凭证只支持zip压缩包，压缩包内的凭证文件需要为jpg、pdf、png格式，凭证文件名称里需要包括视源案号</span>
        </template>
      </upload-invoice>
    </app-shrink>

  </div>

</template>

<script>
import TableComponent from '@/components/common/TableComponent'
import Pop from '@/components/page_extension/InvoiceCommon_pop'
import AppShrink from '@/components/common/AppShrink'
import Strainer from '@/components/page_extension/InvoiceCommon_strainer'
import InvoiceDetail from '@/components/page_extension/InvoiceCommon_detail'
import CheckInvoice from '@/components/page_extension/InvoiceCommon_check'
import UploadInvoice from '@/components/page_extension/InvoiceCommon_upload'
import {mapMutations} from 'vuex'
const URL = '/invoices';
const pathMap = new Map([
  ['/fee/invoice/rejected', true],
  ['/fee/account/paid', true],  
  ['/fee/income/submit', true],  
  ['/fee/income/wating_for_payment', true],  
  ['/fee/income/confirmed', true],  
  ['/fee/income/cancelled', true],
]);
export default {
  name: 'invoiceCommon',
  props: {
    debit: {
      type: null,
      default: 0,
    },
    defaultParams: {
      type: Object,
      default () {
        return {};
      }
    }
  },  
  data () {
    return {
      option: {
        'name': 'invoice',
        'url': URL,
        'height': 'default',
        'highlightCurrentRow': true,
        // 'is_list_filter': true,
        // 'list_type': 'invoice',
        'rowClick': this.handleRowClick,
        'header_btn': [
          {},
          { type: 'export' },
          { type: 'delete' },
          // { type: 'report', click: this.handleReport },
          { type: 'control' },
        ],
        // 'header_slot': [],//['cur_total', 'all_total'],
        'import_columns':[
          // { type: 'text', label: '案号', prop: 'serial'},
          { type: 'text', label: '账单号', prop: 'agency_invoice'},
          { type: 'text', label: '案件名称', prop: 'project', render_simple: 'name',},
          { type: 'text', label: '费用名称', prop: 'code', render_simple: 'name',},
          // { type: 'text', label: '货币', prop: 'currency'},
     //      { type: 'text', label: '金额', prop: 'amount'},
     //      { type: 'text', label: '汇率', prop: 'roe'},
          { type: 'text', label: '金额', prop: 'rmb'},
          { type: 'text', label: '备注', prop: 'remark'},
        ],
        'columns': [
          { type: 'selection' },
          { type: 'text', label: '账单编号', prop: 'serial', width: '130' },
          { type: 'text', label: '账单对象', prop: 'target', render_simple: 'name', width: '150' },
          { type: 'text', label: '对方账单号', prop: 'invoice_no', width: '150' },
          { type: 'text', label: '创建时间', prop: 'create_time',width: '115' },
          { type: 'text', label: '付款期限', prop: 'due_time', width: '115' },
          { type: 'text', label: '付款时间', prop: 'pay_time',width: '115' },
          // { 
          //   type: 'text', 
          //   label: '外币金额', 
          //   prop: 'amount', 
          //   width: '100',
          //   align: 'right',
          //   render:(h,item,row)=>{
          //     if( row.roe == 1 ){
          //       return h('span','N/A');
          //     }else{
          //       return h('span',`${item}${row.currency}`);
          //     }
          //   } 
          // },
          // { 
          //   type: 'text', 
          //   label: '汇率', 
          //   prop: 'roe', 
          //   width: '80',
          //   align: 'right',
          //   render:(h,item)=>{
          //     if( item == 1 ){
          //       return h('span','N/A');
          //     }else{
          //       return h('span',item);
          //     } 
          //   }
          // },
          { 
            type: 'text', 
            label: '人民币金额', 
            prop: 'rmb', 
            width: '150',
            align: 'right',
            render:(h,item)=>{
              return h('span',`${item}CNY`)
            }
          },
          { type: 'text', label: '状态', prop: 'status', render_simple: 'name', width: '120' },
          { type: 'text', label: '备注', prop: 'remark',min_width: '150' },
        ],
      },
      option_action: { 
        type: 'action',
        align: 'center',
        width: '130',
        btns_render: true,
        // btns: [
        //   {
        //     btn_type: 'text',
        //     label: '审核账单',
        //     btn_disabled: ({status}) => status.id !== 1,
        //     click: ({id}) => {
        //       this.checkVisible = true;
        //       this.$nextTick(() => {
        //         this.$refs.checkInvoice.render(id);
        //       });
        //     }
        //   },
        //   {
        //     btn_type: 'text',
        //     label: '确认付款',
        //     btn_disabled: ({status}) => status.id !== 2,
        //     click: ({id}) => {
        //       this.payId = id;
        //       this.payVisible = true;
        //     }
        //   },
        //   {
        //     btn_type: 'text',
        //     label: '上传凭证',
        //     btn_disabled: ({status}) => status.id !== 4,
        //     click: ({id}) => {
        //       this.uploadVisible = true;
        //       this.$nextTick(() => {
        //         this.$refs.uploadInvoice.render(id);
        //       })
        //     }
        //   }
        // ]
      },
      tableData: [],
      popType: 'edit',
      curTotal: '',
      allTotal: '',
      shrinkVisible: false,
      checkVisible: false,
      uploadVisible: false,
      payVisible: false,
      currentId: '',
      disabled: false,
      id: '',
      payId: '',
      payTime: '',
      payLoading: false,
      filter: {},
    }
  },
  computed: {
    feeType () {
      const path = this.$route.path;
      return /income/.test(path) ? 1 : 0; 
    },
    payTitle () {
      return this.feeType == 0 ? '付款' : '收款'
    },
    action () {
      return `/api/tempfile?action=getEvidence&invoice_id=${this.id}`;
    }
  },
  methods: {
    ...mapMutations([
      'onLoading',
      'cancelLoading',
    ]), 
    handlePass () {
      this.$refs.checkInvoice.pass();
    },
    handleRefuse() {
      this.$refs.checkInvoice.refuse();
    },      
    beforeUpload () {
      this.onLoading('解析中...');
    },
    uploadSuccess (response) {
      const func = () => {
        this.cancelLoading();
        if(response.status) {
          this.$message({type: 'success', message: '解析成功'});
          this.$refs.uploadInvoice.refresh();
        }else {
          this.$message({type: 'warning', message: '解析失败,凭证只支持zip压缩包，压缩包内的凭证文件需要为jpg、pdf、png格式，凭证文件名称里需要包括视源案号'});
        }
      }
      window.setTimeout(func, 1500);
    },
    uploadError () {
      this.cancelLoading();
      this.$message({type: 'warning', message: '上传文件失败,凭证只支持zip压缩包，压缩包内的凭证文件需要为jpg、pdf、png格式，凭证文件名称里需要包括视源案号'})
    },    
    checkSave () {
      this.$refs.checkInvoice.save();
    },
    async uploadFinish () {
      const response = await this.$refs.uploadInvoice.finish();

      if(response.data.status) {
        this.uploadVisible = false;
        this.update();
      } 
    },
    checkClick ({id}) {
      this.checkVisible = true;
      this.$nextTick(() => {
        this.$refs.checkInvoice.render(id);
      });
    },
    handleRequestPay({id,target}) {
    this.$confirm(`确认发起${target.name}的请款`,{type: 'info'})
        .then(()=>{ 
      const url = '/feecomment';
      const data = {
        invoice_id: id,
        handle: 'pass',
      };
      const success = _=>{
        this.update();
        this.$message({type: 'success',message: '确认请款成功'});
      };
      this.$axiosPost({url,data, success});
    }).catch(()=>{});
    },
    payClick ({id}) {
      this.payId = id;
      this.payVisible = true;
    },
    uploadClick ({id}) {
      this.id = id;
      this.uploadVisible = true;
      this.$nextTick(() => {
        this.$refs.uploadInvoice.render(id);
      });
    },
    checkCallBack (type) {
      if(type == 'confirm') {
        this.checkVisible = false;
      }else if(type == 'pass') {
        this.update();
        this.checkVisible = false;
      }else if(type == 'cancel') {
        this.checkVisible = false;
      }
    },
    confirmPay () {
      if(this.payTime == '') return this.$message({type: 'warning', message: '付款时间不能为空'});
      const url = `/invoices/${this.payId}`;
      const pay_time = this.$tool.getDate(this.payTime);
      const is_mail = !this.feeType;
      const data = {
        pay_time,
        is_mail,
      };
      const success = () => {
        this.$message({ type: 'success', message: '确认付款成功' });
        this.payVisible = false;
        this.update();
      };
      const complete = () => {
        this.payLoading = false;
      };
      this.payLoading = true;
      this.$axiosPut({url, data, success, complete});
    },
    handleReport () {
      const url = {0: '/fee/payment/report', 1: '/fee/bill/report'}[this.feeType];
      if(url) {
        this.$router.push(url);
      }
    },
    handleEdit (form) {
      this.$message({message: '编辑成功', type: 'success'});
      this.update();
      this.$refs.detail.refresh();
    },
    handleRowClick (row) {
      const path = this.$route.path;
      if(pathMap.get(path)) {
        // this.currentId = row.id;
        this.shrinkVisible = true;
        this.$nextTick(() => {
        this.$refs.uploadInvoices.render(row.id);
        });
      }else {
        return false;
      } 
    },
    refreshTableData (option) {
      const url = URL;
      const debit = this.feeType;
      const data = Object.assign({}, option, { debit },this.filter, this.defaultParams);
      const success = d=>{ 
        if(data['format'] == 'excel') {
          if(d.invoices.downloadUrl) {
            window.location.href = d.invoices.downloadUrl;  
          }
        }else {
          this.tableData = d.invoices;
        }

        if(d.invoices.sum_allpage) {
          this.allTotal = d.invoices.sum_allpage;
        }

        if(d.invoices.sum_curpage) {
          this.curTotal = d.invoices.sum_curpage;
        }
      };

      this.$axiosGet({url, data, success});
    },
    refresh () {
      this.$refs.table.refresh();
    },
    update () {
      this.$refs.table.update();
    },
    editPop (row) {
      this.popType='edit';
      this.$refs.pop.show(row);
    },
    invoiceDelete ({id, target}) {
      this.$confirm(`删除后不可恢复, 确认删除‘${target.name}’的账单？`)
        .then(()=>{
          const url = `${URL}/${id}`;
          const success = ()=>{ 
            this.$message({message: '删除账单成功', type: 'success'});
            this.$refs.table.update() 
          };
          this.$axiosDelete({url, success});
        })
        .catch(()=>{});
    }
  },
  created () {
    // if(!this.feeType) {
      this.option.header_btn.splice(0
        ,1,{'type': 'import'});
      this.option.import_type = 'invoicePayable';
      this.option.columns = [...this.option.columns, this.option_action]; 
    // }
  },
  mounted () {
    this.refresh();
  },
  components: { 
    TableComponent, 
    Pop,
    AppShrink,
    InvoiceDetail,
    CheckInvoice,
    UploadInvoice,
    Strainer,
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.invoice-action .is-disabled {
  color: #080;
  cursor: auto;
}
</style>