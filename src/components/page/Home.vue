<template>
  <div class="main">
    
      <el-card v-if="pendingTask" style="position: relative;">
        <p slot="header" style="color: #888; margin: 0px;">待办任务摘要，点击查看详细任务列表：</p>
        <div style="display: table;">
        <span v-if="pendingTask.length != 0"  v-for="m in pendingTask" :key="m.label"
          title="点击跳转"
          style="margin: 5px 10px 5px 0; border: 1px solid #ccc; border-radius: 5px; padding: 6px; cursor: pointer;display: table;float: left;" @click="toPending(m.value)">
          <span style="font-size: 14px;">{{ m.label }}</span>
          <template v-if="m.count">
            <span>：</span>
            <span style="font-size: 18px; font-weight: bold; color: #c23531;">{{ m.count }}</span>
          </template>
        </span>
        
        <span v-else style="font-size: 14px;
    font-weight: bold;display:block;float: left;">
          暂无待办任务...
        </span>
        </div>
      </el-card>

      <el-card v-if="userReminders" style="position: relative;margin-top:10px;">
        <p slot="header" style="color: #888; margin: 0px;">案件提醒以及过期任务提醒：</p>
        <div style="display: table;">
        <span v-if="userReminders.length != 0"  v-for="m in userReminders" :key="m.label" title="点击跳转" style="margin: 5px 10px 5px 0; border: 1px solid #ccc; border-radius: 5px; padding: 6px; cursor: pointer;display: table;float: left;" @click="toReminder(m)">
          <span :style="`font-size: 14px; color: ${labelColor[m.color]}`">{{ m.label }}</span>
          <template v-if="m.count !== undefined">
            <span>：</span>
            <span style="font-size: 18px; font-weight: bold; color: #c23531;">{{ m.count }}</span>
          </template>
        </span>
        
        <span v-else style="font-size: 14px;
    font-weight: bold;display:block;float: left;">
          暂无待办提醒...
        </span>
        </div>
      </el-card>

      <el-card v-if="userLinks.length != 0" style="position: relative;margin-top:10px;">
        <p slot="header" style="color: #888; margin: 0px;">快捷操作入口：</p>
        <div>
          <div v-for="(item, index) in userLinks" :key="index" style="display: block; height: 45px;">
            <span style="border: 1px solid #ccc; border-radius: 5px; padding: 6px; cursor: pointer;" @click="$router.push(item.link.url)">
              <span style="font-size: 14px;">{{item.link.label}}</span>
            </span>
            <a slot="content" target="_blank" :href="item.help_link.url" style="font-size: 12px;">{{ item.help_link.label }}</a> 
          </div>
        </div>
      </el-card>


    
    <!-- <el-row v-for="(row, i) in arr" :gutter="20" :key="i">
      <el-col v-for="(item, i2) in row" :span="24/row.length" :key="i2">
        <chart v-if="!!item" :type="item" style="margin: 10px 0px;"></chart>
      </el-col>
    </el-row> -->
  </div>
</template>
<script>
import AppFilter from '@/components/common/AppFilter'
import Chart from '@/components/page_extension/Home_charts'

import {mapGetters} from 'vuex'
export default {
  name: 'home',
  data () {
    return {
      config: '',
      labelColor: {
        1: '#096',
        2: '#f90',
        3: '#f03',
      }
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
      'userLinks',
      'userReminders',
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
    },
    toPage(url) {
      this.$router.push({name: url});
    },
    toReminder (item) {
      if(item.type === 'task') {
        this.$router.push(`/task/pending?expiring_type=${item.value}`);
      }else if(item.type === 'proposal') {
        this.$router.push(`/proposal/list?reminder_type=${item.value}`);
      }else if(item.type === 'patent') {
        this.$router.push(`/patent/list?reminder_type=${item.value}`);
      }else if(item.type === 'trademark') {
        this.$router.push(`/trademark/list?reminder_type=${item.value}`);
      }else if(item.type === 'copyright') {
        this.$router.push(`/copyright/list?reminder_type=${item.value}`);
      }
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
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
