<template>
  <div class="main">
	<table-component :tableOption="tableOption" :data="detailAgencies"></table-component>
  </div>
</template>
<script>
import TableComponent from '@/components/common/TableComponent'
import { mapGetters } from 'vuex'
  export default {
    name: 'commonDetailAgencyHistory',
    data () {
      return {
      	tableOption: {
      	  'is_search': false,
      	  'is_pagination': false,
      	  'is_header': false,
      	  'columns':[
      	    { type: 'text', label: '委案时间', prop: 'agency_date', width: '145'},
      	    { type: 'text', label: '委案类型', prop: 'agency_type', width: '160', render_simple: 'name'},
            { type: 'text', label: '代理机构名称', prop: 'agency', render_simple: 'name', width: '198'},
            { type: 'text', label: '代理人', prop: 'agent', render_simple: 'name', width: '145'},
            { type: 'text', label: '委案确认时间', prop: 'agency_confirm_date', min_width: '140'},
      	    { type: 'text', label: '当前委托', prop: 'is_current', width: '120'},
      	  ],
      	},
      }
    },
    computed: {
    	...mapGetters([
    		'detailAgencies',
    	]),
    },
    components: {
      TableComponent,
    }
  }
</script>
<style lang="scss" scoped></style>
