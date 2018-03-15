<template>
  <div class="main">
	<table-component :tableOption="tableOption" :data="detailFundings"></table-component>
  </div>
</template>
<script>
import TableComponent from '@/components/common/TableComponent'
import { mapGetters } from 'vuex'
  export default {
    name: 'commonDetailFundings',
    data () {
      return {
      	tableOption: {
      	  'is_search': false,
      	  'is_pagination': false,
      	  'is_header': false,
      	  'columns':[
      	    { type: 'text', label: '获奖名称', prop: 'name', min_width: '180'},
      	    { type: 'text', label: '获奖日期', prop: 'date', width: '240'},
      	    { type: 'text', label: '金额', prop: 'amount', width: '180'},
      	  ],
      	},
      }
    },
    computed: {
    	...mapGetters([
    		'detailFundings',
    	]),
    },
    components: {
      TableComponent,
    }
  }
</script>
<style lang="scss" scoped></style>