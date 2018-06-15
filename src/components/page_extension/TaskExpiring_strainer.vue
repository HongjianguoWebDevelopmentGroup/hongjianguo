<template>
  <app-collapse col-title="期限管控筛选" :default-close="isClose">
  	<el-form :model="form" label-width="140px" ref="form">
  		<el-row>
				<el-col :span="12">
				
					<el-form-item label="统计类型" prop="role">
						<static-select type="role" v-model="form.role"></static-select>
					</el-form-item>
					
					<el-form-item label="代理机构" prop="agency">
						<remote-select type="agency" v-model="form.agency" multiple></remote-select>
					</el-form-item>
					
				</el-col>
				<el-col :span="12">
					<el-form-item label="状态" prop="nstage">
						<static-select v-model="form.nstage"></static-select>
					</el-form-item>
					<el-form-item label="案件等级" prop="level">
						<static-select type="case_level" v-model="form.level"></static-select>
					</el-form-item>
					
					
				</el-col>
  		</el-row>
  		<el-row style="text-align: center;">
				<el-button @click="search(form, $refs.form)" type="primary" size="small">查询</el-button>
				<el-button @click="clear($refs.form)" type="danger" size="small">清空</el-button>
  		</el-row>
  	</el-form>
  </app-collapse>
</template>

<script>
import AppCollapse from '@/components/common/AppCollapse'
import RemoteSelect from '@/components/form/RemoteSelect'
import StaticSelect from '@/components/form/StaticSelect'

export default {
  name: 'patentListStrainer',
  props: ['value'],
  data () {
		return {
			isClose: true,
			form: {
				role: '',
				agency: [],
				nstage '',
				level: '',
			},
		}
  },
  methods: {
  	search (f, form) { 
  		const filter = {};
  		for(let k in f) {
  			const d = f[k];
  			if( d instanceof Array ) {
  				if(d[0]) {
  					if(d[0] instanceof Date) {
  						filter[k] = d.map(_=>this.$tool.getDate(_)).join(",")
  					}else {
  						filter[k] = d.join(",")
  					}
  				}
  			}else {
  				if(d !== "") filter[k] = d;

  			}
  		}
  		console.log(filter);
  		this.$emit('input', filter);
  		this.$emit('refresh');
  		this.isClose = !this.isClose;
  	},
  	clear (form) {
  		form.resetFields();
  		this.$emit('input', {});
  		this.$emit('refresh');
  	}
  },
  components: { 
  	AppCollapse, 
  	RemoteSelect, 
  	StaticSelect,
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
