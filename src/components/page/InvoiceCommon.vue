<template>
  <div class="main">
    <strainer v-model="filter" @refresh="refresh"></strainer>
    <table-component @refreshTableData="refreshTableData" :tableOption="option" :data="tableData" ref="table">
      <el-tag v-if="curTotal !== ''" slot="cur_total" style="margin-left: 15px;">当前页费用：{{ curTotal }}</el-tag>
      <el-tag v-if="allTotal !== ''" slot="all_total" style="margin-left: 10px;">所有费用：{{ allTotal }}</el-tag>
      <div slot="row_action" slot-scope="scope" class="invoice-action">
        <el-button :disabled="scope.row.status.id != 1" size="mini" type="text" @click="checkClick(scope.row)">审核账单</el-button>
        <i class="el-icon-arrow-right" style="font-size: 12px;"></i>
        <el-button :disabled="scope.row.status.id != 5" size="mini" type="text" @click="payClick(scope.row)">确认付款</el-button>
        <i style="font-size: 12px;">|</i>
        <el-button :disabled="scope.row.voucher == 1" size="mini" type="text" @click="uploadClick(scope.row)">上传凭证</el-button>
      </div>
    </table-component>
    
    <pop :feeType="feeType" :popType="popType" ref="pop" @refresh="handleEdit"></pop>
    
    <app-shrink :visible.sync="shrinkVisible" title="详细信息">
      <el-button type="primary" slot="header" @click="editPop" size="small" style="float: right; margin-top: 6px;">编辑</el-button>
      <invoice-detail :id="currentId" ref="detail"></invoice-detail>
    </app-shrink>

    <app-shrink v-if="feeType == 0" :visible.sync="checkVisible" title="审核帐单" :modal="true">
      <template slot="header">
        <span style="float: right; line-height: 40px;">
          <el-button type="primary" size="small" @click="checkSave">暂存</el-button>
        </span>
      </template>
      <check-invoice style="margin-top: 10px;" @callback="checkCallBack" ref="checkInvoice"></check-invoice>
    </app-shrink>
    
    <app-shrink v-if="feeType == 0" :visible.sync="uploadVisible" title="上传凭证" :modal="true">
      <template slot="header">
        <span style="float: right; line-height: 40px;">
          <el-button type="primary" size="small" @click="uploadFinish">完成上传</el-button>
        </span>
      </template>
      <upload-invoice style="margin-top: 10px;" ref="uploadInvoice"></upload-invoice>
    </app-shrink>

    <el-dialog v-if="feeType == 0" :visible.sync="payVisible" title="确认付款" @close="payTime = ''" class="dialog-mini">
      <el-date-picker type="date" v-model="payTime" placeholder="请选择付款时间"></el-date-picker>
      <div style="margin-top: 10px;">
        <el-button :loading="payLoading" @click="confirmPay" type="primary">{{ payLoading ? '确认中...' : '确认付款' }}</el-button>
      </div>
    </el-dialog>


  </div>

</template>

<script>
import TableComponent from '@/components/common/TableComponent'
import Strainer from '@/components/page_extension/InvoiceCommon_strainer'
import Pop from '@/components/page_extension/InvoiceCommon_pop'
import AppShrink from '@/components/common/AppShrink'
import InvoiceDetail from '@/components/page_extension/InvoiceCommon_detail'
import CheckInvoice from '@/components/page_extension/InvoiceCommon_check'
import UploadInvoice from '@/components/page_extension/InvoiceCommon_upload'

const URL = '/invoices';

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
        'is_numbers': true,
        'height': 'default',
        'highlightCurrentRow': true, 
        'rowClick': this.handleRowClick,
        'header_btn': [
          { type: 'export' },
          { type: 'delete' },
          {},
          { type: 'control' },
        ],
        'header_slot': ['cur_total', 'all_total'],
        'columns': [
          { type: 'selection' },
          { type: 'text', label: '账单编号', prop: 'serial', width: '200' },
          { type: 'text', label: '账单对象', prop: 'target', render_simple: 'name', width: '200' },
          { type: 'text', label: '创建时间', prop: 'create_time',width: '175' },
          { type: 'text', label: '付款期限', prop: 'due_time', width: '175' },
          { type: 'text', label: '付款时间', prop: 'pay_time',width: '175' },
          { 
            type: 'text', 
            label: '外币金额', 
            prop: 'amount', 
            width: '150',
            render:(h,item,row)=>{
              if( row.roe == 1 ){
                return h('span','N/A');
              }else{
                return h('span',`${item}${row.currency}`);
              }
            } 
          },
          { 
            type: 'text', 
            label: '汇率', 
            prop: 'roe', 
            width: '150',
            render:(h,item)=>{
              if( item == 1 ){
                return h('span','N/A');
              }else{
                return h('span',item);
              } 
            }
          },
          { 
            type: 'text', 
            label: '人民币金额', 
            prop: 'rmb', 
            width: '150',
            render:(h,item)=>{
              return h('span',`${item}CNY`)
            }
          },
          { type: 'text', label: '状态', prop: 'status', render_simple: 'name', width: '200' },
          { type: 'text', label: '备注', prop: 'remark',min_width: '200' },
        ],
        'import_columns': [
          { type: 'text', label: '费用期限', prop: 'due_time', width: '200' },
          { type: 'text', label: '汇率', prop: 'roe', width: '80' },
          { type: 'text', label: '货币', prop: 'currency', width: '80' },
          { type: 'text', label: '人民币', prop: 'amount', width: '100' },
          { type: 'text', label: '备注', prop: 'remark', width: '160' },
        ]
      },
      option_action: { 
        type: 'action',
        align: 'center',
        width: '240',
        btns_render: true,
      },
      tableData: [],
      filter: {},
      popType: 'edit',
      curTotal: '',
      allTotal: '',
      shrinkVisible: false,
      checkVisible: false,
      uploadVisible: false,
      payVisible: false,
      currentId: '',
      payId: '',
      payTime: '',
      payLoading: false,
    }
  },
  computed: {
    feeType () {
      return this.debit; 
    }
  },
  methods: {
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
    payClick ({id}) {
      this.payId = id;
      this.payVisible = true;
    },
    uploadClick ({id}) {
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
      const data = {
        pay_time,
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
    handleEdit (form) {
      this.$message({message: '编辑成功', type: 'success'});
      this.update();
      this.$refs.detail.refresh();
    },
    handleRowClick (row) {
      this.currentId = row.id;
      this.shrinkVisible = true;
    },
    refreshTableData (option) {
      const url = URL;
      const debit = this.feeType;
      const data = Object.assign({}, option, { debit }, this.filter, this.defaultParams);
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
      this.$refs.pop.show(Object.assign({id: this.currentId}, this.$refs.detail.row));
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
    if(!this.feeType) {
      this.option.header_btn.splice(2,1,{'type': 'import'});
      this.option.import_type = 'invoicePayable';
      this.option.columns = [...this.option.columns, this.option_action]; 
    }
  },
  mounted () {
    this.refresh();
  },
  components: { 
    TableComponent, 
    Strainer, 
    Pop,
    AppShrink,
    InvoiceDetail,
    CheckInvoice,
    UploadInvoice,
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