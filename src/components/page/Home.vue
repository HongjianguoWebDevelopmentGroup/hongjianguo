<template>
	<div class="main">
    <el-card v-if="pendingTask" style="position: relative;">
      <div style="display: table;">
      <span v-if="pendingTask.length != 0"  v-for="m in pendingTask" :key="m.label"
        title="点击跳转"
        style="margin: 5px 10px 5px 0; border: 1px solid #ccc; border-radius: 5px; padding: 6px; cursor: pointer;display: table;float: left;" @click="toPending(m.value)">
        <span style="font-size: 14px;" class="personal-sp1">{{ m.label }}</span>
        <template v-if="m.count">
          <span>：</span>
          <span style="font-size: 18px; font-weight: bold; color: #c23531;" class="personal-sp2">{{ m.count }}</span>
        </template>
      </span>
      
      <span v-else style="font-size: 14px;
  font-weight: bold;display:block;float: left;">
        暂无待办任务...
      </span>
      </div>
    
      
    </el-card>

    <el-card style="margin-top: 20px;">
      <div slot="header">
        <span style="color: #888;">新申请提醒</span>
     </div>
      <reminder refresh-url="/api/reminders?type=1"></reminder>
    </el-card>

    <el-card style="margin-top: 20px;">
      <div slot="header">
        <span style="color: #888;">即将过期的OA</span>
     </div>
      <task></task>
    </el-card>

    <el-card style="margin-top: 20px;">
      <div slot="header">
        <span style="color: #888;">自定义提醒</span>
     </div>
      <reminder refresh-url="/api/reminders?type=2"></reminder>
    </el-card>


    <el-row v-for="(row, i) in arr" :gutter="20" :key="i">
      <el-col v-for="(item, i2) in row" :span="24/row.length" :key="i2">
        <chart v-if="!!item" :type="item" style="margin: 10px 0px;"></chart>
      </el-col>
    </el-row>
	</div>
</template>
<script>
import AppFilter from '@/components/common/AppFilter'
import Chart from '@/components/page_extension/Home_charts'
import Reminder from '@/components/page_extension/Home_reminders'
import Task from '@/components/page_extension/Home_tasks'
import {mapGetters} from 'vuex'

export default {
  name: 'home',
  data () {
    return {
      config: '',
      // arr: [
      //   ["proposal_bar", "application_bar"],
      //   ["issue_bar", "copyright_bar"],
      // ],
    }   
  },
  computed: {
    ...mapGetters([
      'innerWidth',
      'pendingTask',
    ]),
    arr () {
      const user = this.$store.getters.getUser;
      let charts = user ? user.charts : [];

      if(this.innerWidth < 1200) {
        const arr = [];
        charts.forEach(_=>{
          _.forEach(_=>{arr.push([_])});
        })
        charts = arr;
      }

      return charts;
    },
  },
  methods: {
    toPending (id) {
      this.$router.push({name: 'TaskPending', params: {id} });
    }
  },
  // methods: {
  //   refreshHome () {
  //     console.log(data);
  //   }
  // },
  // created () {
  //   if(data === undefined) {
  //     const url = URL;
  //     const success = _=>{ 
  //       data = _.data;
  //       this.refreshHome(); 
  //     };
  //     const complete = _=>{
  //       this.$store.commit('cancelLoading');
  //     }

  //     this.$store.commit('onLoading');
  //     this.axiosGet({url, success, complete});
  //   }else {
  //     this.refreshHome();
  //   }
  // },
  components: { 
    AppFilter, 
    Chart,
    Reminder,
    Task,
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
