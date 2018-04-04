<template>
  <div class="main">
	<table-component :tableOption="tableOption" :data="detailAmendments"></table-component>
  </div>
</template>
<script>
import TableComponent from '@/components/common/TableComponent'
import { mapGetters } from 'vuex'
  export default {
    name: 'commonDetailAmendments',
    data () {
      return {
      	tableOption: {
      	  'is_search': false,
      	  'is_pagination': false,
      	  'is_header': false,
      	  'columns':[
      	    { type: 'text', label: '变更项目', prop: 'item', width: '180'},
      	    { type: 'text', label: '变更日期', prop: 'create_time', width: '160'},
            { type: 'text', label: '变更前', prop: 'original', width: '200'},
            { type: 'text', label: '变更后', prop: 'current', width: '200'},
      	    { type: 'text', label: '操作人', prop: 'operator', render_simple: 'name', min_width: '140'},
      	  ],
      	},
      }
    },
    computed: {
    	...mapGetters([
    		'detailAmendments',
    	]),
    },
    components: {
      TableComponent,
    }
  }
</script>
<style lang="scss" scoped></style>