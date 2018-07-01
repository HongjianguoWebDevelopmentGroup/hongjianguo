<template>
	      
	<el-submenu v-if="dd.type == 'submenu' && !menusMap.get(dd.path) ? true : false" :index="dd.path">
		<template slot="title"><i :class="dd.icon"></i>{{ dd.text }}</template>
		<template v-if="forChildren(dd)">
			<app-menu-item v-for="item in dd.children" :key="item.path" :dd="item"></app-menu-item>
		</template>
	</el-submenu>

	<el-menu-item v-else-if="dd.type == 'item' && !menusMap.get(dd.path) ? true : false" :index="dd.path"><i :class="dd.icon"></i>{{ dd.text }}<span v-if="map[dd.path] != undefined">({{ getCount(dd.path) }})</span></el-menu-item>

</template>

<script>
import { mapGetters } from 'vuex'
import { mapMutations } from 'vuex'

export default {
  name: 'appMenuItem',
  props: ['dd'],
  data () {
    return {
      map: {
        '/task/pending': 'pendingTaskCount',
        '/task/paused': 'pausedTaskCount',
        '/task/expiring': 'monitoredTaskCount',
        '/task/all': 'allTaskCount',
        '/task/finished':'finishedTaskCount',
        '/task/duetime/expired':'expiredTaskCount',
        '/task/duetime/week':'weekTaskCount',
        '/task/duetime/nextWeek':'nextWeekTaskCount',
        '/task/duetime/month':'monthTaskCount',
        '/task/duetime/nextMonth':'nextMonthTaskCount',
        '/task/duetime/later':'laterTaskCount',
        '/task/stage/application':'applicationTaskCount',
        '/task/stage/oa':'oaTaskCount',
        '/task/stage/reexam':'reexamTaskCount',
        '/task/stage/grant':'grantTaskCount',
        '/task/stage/invalid':'invalidTaskCount',
        '/task/stage/annualFee':'annualFeeTaskCount',
        '/task/stage/litigation':'litigationTaskCount',
        '/task/type/proposal':'proposalTaskCount',
        '/task/type/patent':'patentTaskCount',
        '/task/type/copyright':'copyrightTaskCount',
      }
    }
  },
  computed: {

  },
  methods: {
    ...mapMutations([
      'clearScreen',
    ]),
  	forChildren(item) {
  		if(item.children && item.children.length != 0) {
  			return true;
  		}else {
  			return false;
  		}
  	},
    getCount (key) {
      return this[this.map[this.dd.path]];
    }
  },
  computed: {
    ...mapGetters([
      'menusMap',
      'pendingTaskCount',
      'pausedTaskCount',
      'monitoredTaskCount',
      'allTaskCount',
      'finishedTaskCount',
      'expiredTaskCount',
      'weekTaskCount',
      'nextWeekTaskCount',
      'monthTaskCount',
      'nextMonthTaskCount',
      'laterTaskCount',
      'applicationTaskCount',
      'oaTaskCount',
      'reexamTaskCount',
      'grantTaskCount',
      'invalidTaskCount',
      'annualFeeTaskCount',
      'litigationTaskCount',
      'proposalTaskCount',
      'patentTaskCount',
      'copyrightTaskCount',
      // ...
    ])
  }
}
</script>