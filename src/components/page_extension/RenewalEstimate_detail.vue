<template>
	
	<el-form label-width="70px" label-position="left" class="form-information" v-loading="loading" element-loading-text="加载评估单信息中..." style="padding: 0px 20px;">
		<el-row :gutter="20">
		<el-col :span="12">
      <el-form-item label="创建人"><span>{{ info ? info.member.name : '' }}</span></el-form-item>
    </el-col>
    <el-col :span="12">
      <el-form-item label="创建时间"><span>{{ info ? info.create_time : '' }}</span></el-form-item>
    </el-col>
  </el-row>
    <el-form-item label="备注"><span class="form-item-text">{{ info ? info.remark : '' }}</span></el-form-item>    
		<el-form-item label="年费列表">
	  	<app-table :columns="columns" :data="info ? info.renewal_fees : []" style="margin: 10px 0;"></app-table>
	  </el-form-item>
	</el-form>

</template>

<script>
import AppTable from '@/components/common/AppTable'
const URL = '/api/renewalestimate'
export default {
	name: 'renewalEstimateDetail',
	props: ['id'],
	data () {
		return {
			info: '',
			loading: false,
			columns: [
				{ type: 'text', label: '案号', prop: 'serial', render_key: 'project', render_simple: 'serial', width: '200'},
				{ type: 'text', label: '案件名称', prop: 'title',  render_key: 'project', render_simple: 'title', width: '200'},
				{ type: 'text', label: '年费类型', prop: 'code', render_simple: 'name', width: '200'},
				{ type: 'text', label: '创建时间', prop: 'create_time', width: '200'},
				{ type: 'text', label: '创建人', prop: 'member', render_simple: 'name', width: '200' },
        { 
        	type: 'text', 
        	label: '人民币金额', 
        	prop: 'rmb', 
        	width: '120',
        	align: 'right',
        	render:(h,item)=>{
            return h('span',`${item}CNY`)
          }
        },
				{ type: 'text', label: '费用期限', prop: 'due_time', width: '200'},
				{ type: 'text', label: '官方绝限', prop: 'deadline', width: '200'},
				{ type: 'text', label: '备注', prop: 'remark', width: '200'},
			],
		}
	},
	methods: {
		refreshDetail () {
			const id = this.id;
			if(!id) return;
			this.loading = true;
			this.$axiosGet({
				url: `${URL}/${this.id}`,
				success: _=>{
					this.info = _.data;
				},
				complete: _=>{
					this.loading = false;
				}
			})
		}
	},
	created () {
		this.refreshDetail();
	},
	watch: {
		id () {
			this.refreshDetail();
		}
	},
	components: {
		AppTable,
	},
}
</script>