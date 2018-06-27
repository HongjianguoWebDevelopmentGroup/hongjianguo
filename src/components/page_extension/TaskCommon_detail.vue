<template>
  <div class="task-detail" style="min-height: 44px;" v-loading="loading">
    
  	<el-collapse accordion v-if="collapse.length != 0">
      <el-collapse-item v-for="item in collapse" :key="item.id" :title="`流程节点：${item.flownode.name} | 承办人：${item.person_in_charge.name} | 完成时间：${item.end_time ? item.end_time : '正在处理中'}`">
        <el-form label-width="100px">
          <el-form-item label="流程节点：" style="margin-bottom: 0;">{{ item.flownode.name }}</el-form-item>
          <el-form-item label="开始时间：" style="margin-bottom: 0;">{{ item.start_time }}</el-form-item>
          <el-form-item label="结束时间：" style="margin-bottom: 0;">{{ item.end_time ? item.end_time : '正在处理中' }}</el-form-item>
          <el-form-item label="承办人：" style="margin-bottom: 0;">{{ item.person_in_charge.name }}</el-form-item>
          <el-form-item label="备注：" style="margin-bottom: 0;">{{ item.remark }}</el-form-item>
          <el-form-item label="附件：" style="margin-bottom: 0;">
            <table-component :data=item.attachments :tableOption="tableOption"></table-component>
          </el-form-item>
        </el-form>
      </el-collapse-item>
    </el-collapse>
    <div v-else style="padding: 10px 20px; font-size: 14px;">暂无相关任务的记录...</div>
  </div>
</template>

<script>
import TableComponent from '@/components/common/TableComponent'
import AxiosMixins from '@/mixins/axios-mixins'
import { mapGetters } from 'vuex' 
export default {
  name: 'taskEdit',
  mixins: [ AxiosMixins ],
  props: ['row'],
  data () {
  	return {
  	  tableOption: {
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
              {type: 'download', click: ({downloadUrl})=>{window.location.href = downloadUrl}},
              {type: 'delete', click: this.handleDelete,btn_if:_=>{return this.menusMap && !this.menusMap.get('/flows')? true :false}},
            ],
          }
        ]
      },
      loading: false,
      
      collapse: [],
  	}
  },
  computed: {
    ...mapGetters([
      'menusMap',
    ]),
    id () {
      return this.row.id;  
    }
  },
  methods: {
    refreshData () {
      this.loading = true;
      const url = `/api/tasks/${this.id}`;
      const success = _=>{this.collapse = _.task.siblings; console.log(_.task.siblings);};
      const complete = _=>{setTimeout(_=>this.loading = false, 500)};

      this.axiosGet({url, success, complete});
    },
    handleDelete ({id}) {
      this.$confirm('此操作将删除当前附件，是否继续？', '提示',{type: 'warning'})
      .then(_=>{
        const url = `/tasks/${this.id}/files/${id}`;
        const success = _=>{
          this.$message({type: 'success', message: _.info});
          this.refreshData();
        };

        this.axiosDelete({url, success });
      }).catch(_=>{

      })
    },    
  },
  created () {
    this.refreshData();
  },
  watch: {
    id () {
      this.refreshData();
    }
  },
  components: { TableComponent },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>