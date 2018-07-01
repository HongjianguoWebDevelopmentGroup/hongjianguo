<template>
  <div class="main">
    <app-table :columns="columns" :data="detailTasks" height="default6" style="overflow-y:auto;overflow-x: hidden; ">
    <template slot="row_action" slot-scope="scope">
      <el-button type="text" size='mini' @click='toggle(scope.row)'>{{ show == scope.row.id ? '隐藏详情' : '显示详情'}}</el-button>
    </template>
    </app-table>
    <template v-if="show ? true : false">
      <app-table :columns="columns2" :data="tableData2" @row-click="handleRowClick" style="margin-top: 20px;"  height="default8"></app-table>
    </template>
    <el-dialog title="附件下载" :visible.sync="dialogVisible" :modal="false">
      <template>
        <app-table :columns="columns3" :data="tableData3.attachments"></app-table>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import AppTable from '@/components/common/AppTable'
import AxiosMixins from '@/mixins/axios-mixins'
import {mapGetters,mapActions} from 'vuex'

export default {
  name: 'commonDetailControl',
  mixins: [ AxiosMixins ],
  data () {
    return {
      columns: [
        { type: 'text', label: '管制事项', prop: 'taskdef', render: this.taskdefRender},
        // { type: 'text', label: '流程节点', prop: 'flownode', render_simple: 'name'},
        { type: 'text', label: '开始时间', prop: 'start_time' },
        { type: 'text', label: '内部期限', prop: 'due_time' },
        { type: 'text', label: '官方绝限', prop: 'deadline' },
        { type: 'text', label: '完成时间', prop: 'end_time' },
        // { type: 'text', label: '状态', prop: 'status', render_text: v => v ? '已完成' : '未完成' },
        // { type: 'text', label: '代理机构', prop: 'agency' },
        // { type: 'text', label: '代理人', prop: 'agent' },
        // { 
        //   type: 'text', label: '定稿文件', prop: 'attachments',
        //   render (h,item) {
          
        //     return h(
        //       'span', 
        //       item.map(function (g) {
        //           return h('a', 
        //           {
        //             style: {
        //             marginRight: '2px',
        //         },
        //         attrs: {
        //           href: '#',
        //         },
        //           },g.name)
        //       })
        //     )
        //   } 
        // },
        { 
          type: 'action', 
          label: '操作',
          fixed: false,
          width:'100',
          btns_render: 'action'
        },
      ],
      columns2: [
        { type: 'text', label: '子节点名称', prop: 'flownode', render_simple: 'name' },
        { type: 'text', label: '承办人', prop: 'person_in_charge', render_simple: 'name' },
        { type: 'text', label: '开始时间', prop: 'start_time' },
        { type: 'text', label: '完成时间', prop: 'end_time' },
        { 
          type: 'text', label: '附件', prop: 'attachments',
          render (h,item) {
          
            return h(
              'span', 
              item.map(function (g) {
                  return h('span', 
                  {
                    style: {
                    marginRight: '2px',
                },
                attrs: {
                  href: '#',
                },
                  },g.name)
              })
            )
          } 
        },
        { type: 'text', label: '备注', prop: 'remark' },
      ],      
      columns3:[
        { type: 'text', label: '文件名称', prop: 'name', min_width: '120'},
        { type: 'text', label: '上传人', prop: 'uploader', min_width: '100'},
        { type: 'text', label: '上传日期', prop: 'create_time', min_width: '120'},
        { type: 'text', label: '大小', prop: 'size', min_width: '80'},
        { 
          type: 'action',
          label: '操作',
          width: '198',
          btns: [
            { type: 'view', click: ({viewUrl})=>{window.open(viewUrl)}},
            { type: 'download', click: ({downloadUrl})=>{window.open(downloadUrl)}},
            { type: 'delete', click:this.handleDelete,btn_if:()=>{return this.menusMap && !this.menusMap.get('/flows')? true :false}},  
          ]
        }
      ],
      tableData2: [],
      tableData3: [],
      show: null,
      dialogVisible: false,
    };
  },
  computed: {
    ...mapGetters([
      'detailTasks',
      'menusMap',
    ]),
  },
  methods: {
    ...mapActions([
      'refreshDetailData',
    ]),
    toggle ({id}) {
      if (id === 0) {
        this.tableData2 = [];
        return;
      }
      if(this.show == null || this.show != id) {
        const url = `/api/tasks/${id}`;
        const success = _=>{
          this.tableData2 = _.task.siblings;
          // console.log(_)
        };

        this.axiosGet({url, success});  
      }
      this.show = this.show == id ? null : id;
    },
    handleRowClick (row) {
      this.tableData3 = row;
      this.dialogVisible = true;
    },
    handleDelete ({id}) {
      this.$confirm('此操作将删除当前附件，是否继续？', '提示',{type: 'warning'})
      .then(_=>{
        const url = `/task/${this.tableData3['id']}/files/${id}`;
        const success = _=>{
          this.$message({type: 'success', message: _.info});
          this.dialogVisible = false;
          this.refreshDetailData();
        };

        this.axiosDelete({url, success });
      }).catch(_=>{

      })
    },
    taskdefRender (h,item,data) {
      return ( 
        <span>
          {data.status?<i class="el-icon-check" style="color: #3c3;margin-right:10px;"></i>:<i class="el-icon-loading" style="color: #f90;margin-right:10px;"></i>}
            <span>{ data.taskdef.name }</span>
        </span>
      );
    },
  },
  watch: {
    detailTasks (val) {
      if(val.length != 0) {
        this.toggle(val[0]);  
      }else {
        this.tableData2 = [];
      }   
    },
  },
  components: { 
    AppTable 
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>