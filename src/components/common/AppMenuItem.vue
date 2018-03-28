<template>
	      
	<el-submenu v-if="dd.type == 'submenu' && menuIf(dd.path)" :index="dd.path">
		<template slot="title"><i :class="dd.icon"></i>{{ dd.text }}</template>
		<template v-if="forChildren(dd)">
			<app-menu-item v-for="item in dd.children" :key="item.path" :dd="item"></app-menu-item>
		</template>
	</el-submenu>

	<el-menu-item @click="handleClick" v-else-if="dd.type == 'item' && !menusMap.get(dd.path) ? true : false" :index="dd.path"><i :class="dd.icon"></i>{{ dd.text }}<span v-if="map[dd.path] != undefined">({{ getCount(dd.path) }})</span></el-menu-item>

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
        '/task/pause': 'pausedTaskCount',
        '/task/expiring': 'monitoredTaskCount',
      }
    }
  },
  computed: {
    ...mapGetters([
      'menusMap',
      'pendingTaskCount',
      'pausedTaskCount',
      'monitoredTaskCount',
      'hideProposal',
    ])
  },
  methods: {
    ...mapMutations([
      'clearScreen',
    ]),
    handleClick (a) {
      if(a.index == '/task/pending' || a.index == '/patent/list') {
        this.clearScreen();
      }
    },
  	forChildren(item) {
  		if(item.children && item.children.length != 0) {
  			return true;
  		}else {
  			return false;
  		}
  	},
    getCount (key) {
      return this[this.map[this.dd.path]];
    },
    menuIf (p) {
      if(p == '/proposal' && this.hideProposal == "1" ) {
        return false;
      }

      if(this.menusMap.get(p)) {
        return false;
      }

      return true;
    }
  },
}
</script>