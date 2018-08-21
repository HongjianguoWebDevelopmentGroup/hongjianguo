<template>
  <div class="main">
    <table-component @refreshTableData="refreshTableData" :tableOption="option" :data="tableData" ref="table">
      <fee-status slot="status" v-model="fee_status" style="width: 150px; margin-left: 5px;" :feeType="feeType"></fee-status>
      <remote-select v-if="fee_invoice_if" slot='invoice' v-model="fee_invoice" style="width: 220px; margin-left: 10px; display: inline-block;" class="pay_search" :type="feeType ? 'bill' : 'pay'"></remote-select>
    </table-component>
    <pop ref="pop" :feeType="feeType" @refresh="refresh"></pop>

    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" class="dialog-small">
      <div style="margin-bottom: 10px; color: #8492A6; font-size: 14px;">
        <span v-if="invoicePopType == 'add'">从选取的费用创建一个新的{{ feeTypeName }}，用于批量追踪请款费用，如果需要跨页选取费用，请在窗口左下角将分页数量调整为一个较大的值。</span>
        <span v-if="invoicePopType == 'put'">将选取的费用添加到一个现有的{{ feeTypeName }}中，如果需要跨页选取费用，请在窗口左下角将分页数量调整为一个较大的值。</span>
      </div>
      <remote-select v-if="invoicePopType=='put'" v-model="fee_invoice_pop" style="margin-bottom: 10px;" :type="feeType ? 'bill' : 'pay'"></remote-select>
      <div>
      <el-button v-if="invoicePopType=='add'" type="primary" @click="invoiceAdd" :loading="btn_disabled">{{btn_disabled ? '新建中...' : '确认新建'}}</el-button>
      <el-button v-if="invoicePopType=='put'" type="primary" @click="invoicePut" :loading="btn_disabled">{{btn_disabled ? '添加中...' : '确认添加'}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import TableComponent from '@/components/common/TableComponent' 
import Pop from '@/components/page_extension/feeCommon_pop'
import FeeStatus from '@/components/form/FeeStatus'
import RemoteSelect from '@/components/form/RemoteSelect'
import {mapActions} from 'vuex'
import {mapGetters} from 'vuex'

const URL = '/fees';
const URL_INVOICE = '/invoices';

export default {
  name: 'feeCommon',
  props: {
    debit: {
      type: null,
      default: 1,
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
      popType: '',
        option: {
        'name': 'fees',
        'url': URL,
        'is_list_filter': true,
        'list_type': 'fee',
        'height': 'default',
        'header_btn': [
          { type: 'add', click: this.addPop },
          { 
            type: 'dropdown',
            label:  '',
            items: [
              {text: '新建{key}', click: ()=>{ this.invoicePop('add') }, icon: 'plus' },
              {text: '添加到已有{key}', click: ()=>{ this.invoicePop('put') }, icon: 'd-arrow-right'  },
            ],
          },
          { type: 'delete' },
          { type: 'export' },
          { type: 'import' },
          { type: 'control' },
        ],
        'import_type': '',
        'header_slot': [ 'status', 'invoice' ],
        'columns': [
          { type: 'selection' },
          // { type: 'text', label: '案号', prop: 'serial', width: '140' },
          { type: 'text', label: '请款单号', prop: 'serial', width: '150' },
          { type: 'text', label: '事务所案号', prop: 'agency_serial', width: '140' },
          { type: 'text', label: '费用对象', prop: 'target', render_simple: 'name', width: '140' },
          { type: 'text', label: '费用名称', prop: 'code', render_simple: 'name', width: '140' },
          //{ type: 'text', label: '费用类型', prop: 'type_name', width: '190' },
          { 
            type: 'text', 
            label: '外币金额', 
            prop: 'amount', 
            width: '100',
            align: 'right',
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
            width: '80',
            align: 'right',
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
            width: '120',
            align: 'right',
            render:(h,item)=>{
              return h('span',`${item}CNY`)
            }
          },
          { type: 'text', label: '费用状态', prop: 'status', render_simple: 'name', width: '180'},
          { type: 'text', label: '案件类型', prop: 'category', width: '145' },
          { type: 'text', label: '专利类型', prop: 'patent_type', width: '145' },
          { type: 'text', label: '案件名称', prop: 'title', width: '189' },
          { type: 'text', label: '申请号', prop: 'apn', width: '200' },
          { 
            type: 'text', 
            label: '申请日', 
            prop: 'apd',  
            width: '175',
            render_text: item=>item ? this.$tool.getDate(new Date(item*1000)) : '',
          },
          { 
            type: 'text', 
            label: '地区', 
            prop: 'area', 
            render_text: item=>{
              return item.id ? this.areaMap.get(item.id) : '';
            }, 
            width: '210' 
          },
          { type: 'text', label: '发文日', prop: 'mail_date', width: '175' },
          { type: 'text', label: '创建日期', prop: 'create_time', width: '175' },
          { type: 'text', label: '费用期限', prop: 'due_time', is_import: true, width: '175' },
          { type: 'text', label: '官方绝限', prop: 'deadline', width: '175' },
          { type: 'text', label: '发放时间', prop: 'pay_time', width: '175' },
          { type: 'text', label: '审核意见', prop: 'remark_enterprise', width: '160' },
          { type: 'text', label: '备注', prop: 'remark', is_import: true, width: '160',},
          { 
            type: 'action',
            width: '80',
            align: 'center',
            btns: [
              { type: 'edit', click:  this.editPop, btn_disabled: row=>row.status.name != '未付款' },
            ]
          }
        ],
      },
      tableData: [],
      fee_status: '',
      fee_invoice: '',
      fee_invoice_if: false,
      fee_invoice_scope: '',
      dialogVisible: false,
      totalAmount: '',

      invoicePopType: '',
      invoiceSwitchType: '',
      invoiceSwitchDisabled: false,
      invoiceSelected: [],
      fee_invoice_pop: '',
      btn_disabled: false,
    }
  },
  computed: {
    ...mapGetters([
      'areaMap',
    ]),
    feeType () {      
      const path = this.$route.path;
      const type = !/bonus/.test(path) ? 1 : 0;
      const k = type ? '请款单' : '付款单';
      const o = this.option.header_btn[1];
      o.label = k;
      o.items.forEach(d=>{d.text = d.text.replace('{key}', k)});

      this.option.import_type = type ? 'feesIncome' : 'feesPayable';
    
      this.option.header_btn.splice(1, 1, o);
      
      return type;  
    },
    feeTypeName () {
      return this.feeType ? '请款单' : '付款单';
    },
    dialogTitle () { 
      const str = this.invoicePopType == 'add' ? '新建为' : '添加到已有';
      return  `将费用${str}${this.feeTypeName}`;
    }
  },
  methods: {
    ...mapActions([
      'refreshRoeData',//cache.js
      'refreshUser',//current-user.js
      'initializeSelectorCache',//selector-cache.js
    ]),
    refreshTableData (option) {
      if(this.fee_invoice instanceof Object) return;

      const url = URL;
      const debit = this.feeType;
      const status = this.fee_status === '' ? {} : {status: this.fee_status};
      const invoice = this.fee_invoice_if && this.fee_invoice != '' ? {fee_invoice: this.fee_invoice} : {};
      const data = Object.assign({}, option, { debit }, invoice, status, this.defaultParams);
      const success = d=>{ 
        const totalData = d.fees.data;
        if(data['format'] == 'excel') {
          if(d.fees.downloadUrl) {
            window.location.href = d.fees.downloadUrl;  
          }
        }else {
          this.tableData = d.fees;  
        } 
      };
      this.$axiosGet({url, data, success});
    },
    addPop () {
      this.$refs.pop.show();  
    },
    editPop (row) {
      this.$refs.pop.show('edit', row);
    },
    feeDelete ({id, name}) {
      this.$confirm(`删除后不可恢复，确认删除‘${name}’吗？`, { type: 'warning' })
        .then(()=>{
          const url = `${URL}/${id}`;
          const success = ()=>{ 
            this.$message({message: '删除费用成功', type: 'success'});
            this.$refs.table.update() 
          };
          this.$axiosDelete({url, success});   
        })
        .catch(()=>{});     
    },
    refresh () {
      this.$refs.table.refresh();
    },
    invoicePop (type) {
      
      //若未选择弹出警告并结束当前函数
      const s = this.$refs.table.getSelect();
      if(!s) return;

      //选择项若不符合条件 弹出警告并结束当前函数
      const o = {};
      for(let i = 0; i < s.length; i++) {
        const row = s[i];
        // if(row.status.id != 0) return this.$message({type: 'warning', message: '请不要选择未付款状态以外的费用'});
        o[row.target.id] = true;
      }
      if(this.$tool.getObjLength(o) != 1) {
        return this.$message({type: 'warning', message: '请选择具有相同费用对象的费用'});
      }
      
      this.invoicePopType = type;
      this.invoiceSelected = s;
      this.invoiceSwitchType = 'selected';
      this.fee_invoice_pop = '';
      this.dialogVisible = true;  
       
    },
    invoiceAdd () {

      const scope = this.invoiceSwitchType;
      const s = this.invoiceSelected;
      let fees;
      
      if( scope == "all" ) {
        this.$message({message: '暂未实现新建全部的接口', type: 'warning'});
        this.dialogVisible = false;
        return false;
      }else {
        fees = s.map(_=>_.id); 
      }

      const url = URL_INVOICE;
      const data = { debit: this.feeType, scope, fees };
      const success = ()=>{
        this.$message({message: `新建${this.feeTypeName}成功`, type: 'success'});
        this.dialogVisible = false;
        this.refreshUser();
        this.refresh();
      };
      const complete = _=>{ this.btn_disabled = false; }
      this.btn_disabled = true;
      this.$axiosPost({ url, data, success, complete });

    },
    invoicePut () {
      const scope = this.invoiceSwitchType;
      const s = this.invoiceSelected;
      let fees;

      if(this.fee_invoice_pop == '') {
        this.$message({message: `请选择${this.feeTypeName}`, type: 'warning'});
        return false;
      }
      
      if(scope == 'all') {
        this.$message({message: '暂未实现添加全部的接口', type: 'warning'});
        this.dialogVisible = false;
        return false;
      }else {
        fees = s.map(_=>_.id);
      }

      const url = `${URL_INVOICE}/${this.fee_invoice_pop}/fees`;
      const data = { scope, fees };
      const success = _=>{ 
        this.$message({message: `添加到已有${this.feeTypeName}成功`, type: 'success'});
        this.dialogVisible = false;
        this.refresh();
      };
      const complete = _=>{ this.btn_disabled = false; }
      this.btn_disabled = true;
      this.$axiosPut({url, data, success,complete});
    }
  },
  watch: {
    fee_status (val) {
      if( val == 1 || val == 2) {
        this.fee_invoice_if = true;
      }else {
        this.fee_invoice_if = false;
        this.fee_invoice = '';
      }

      this.refresh();
    },
    fee_invoice (val) {
      if( this.fee_invoice_if ) {
        this.refresh(); 
      }
    }
  },
  mounted () {
    this.initializeSelectorCache({type: 'fee_code'});
    this.refreshRoeData();
    if(this.$route.query.id) {
      this.fee_status = this.feeType ? 1 : 2;
      this.fee_invoice = {id: this.$route.query.id, name: this.$route.query.name};
    }else {
      this.refresh();  
    }
  },
  
  components: { 
    TableComponent,
    Pop, 
    FeeStatus, 
    RemoteSelect,
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>