<template>
	<div>
		<el-card style="margin-bottom: 15px;">
			<el-form :model="form" label-width="80px">
				<el-row>
					<el-col :span="6">
						<el-form-item label="统计类型" prop="role">
							<static-select type="role" v-model="form.role"></static-select>
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="代理机构" prop="agency">
							<remote-select type="agency" v-model="form.agency"></remote-select>
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="状态" prop="nstage">
								<static-select type="get_stage"  v-model="form.nstage"></static-select>
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="案件等级" prop="level">
							<static-select type="case_level" v-model="form.level"></static-select>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
		</el-card>
		<app-table :columns="columns" :data="taskExpiringData" @cell-click="handleCellClick" ></app-table>
	</div>
</template>

<script>
import AppTable from '@/components/common/AppTable'
import RemoteSelect from '@/components/form/RemoteSelect'
import StaticSelect from '@/components/form/StaticSelect'
const URL = '/api/getcountdata';
const config = [
	['new_apply', 1],
	['oa', 2],
	['review',3],
	['others','4,5,6'],
	['over_duetime',1],
	['over_deadline',1],
	['expiring',1],
];
const map = new Map(config);

export default {
	name: 'TaskExpiringControl',
	data () {
		return {
			taskExpiringData: [
				// {id:1, member: '代理人1', new_apply: '2', oa: '5', review: '4', others: '10', due_time: '2', deadline: '1', expire: '2' },
				// {id:2, member: '代理人2', new_apply: '1', oa: '3', review: '4', others: '8', due_time: '2', deadline: '1', expire: '2' },
			],
			form: {
				role: 6,
				agency: '',
				nstage: '',
				level: 'A',
			},
			columns: [
				{ type: 'text', label: '承办人', prop: 'member',render_simple: 'name'},
				{ type: 'text', label: '新申请', prop: 'new_apply',},
				{ type: 'text', label: 'OA', prop: 'oa',},
				{ type: 'text', label: '复审', prop: 'review',},
				{ type: 'text', label: '其他', prop: 'others',},
				{ type: 'text', label: '已超指定期限', prop: 'over_duetime',},
				{ type: 'text', label: '已超官方期限', prop: 'over_deadline',},
				{ type: 'text', label: '重点案件即将到期', prop: 'expiring',},
			],
			filter: {},
		}
	},
	computed: {
		
	},
	methods:{
		handleCellClick (row, column, cell, event) {
			console.log(column);
			const url = URL;
			let option = {
				agent: row.member.id,
			};
			if(column.property == 'over_deadline' || column.property == 'over_duetime' || column.property == 'expiring'){
				option[column.property] = map.get(column.property);
			}else{
				option['stage'] = map.get(column.property);
			}
			const data = Object.assign({},option,this.filterObj(this.form));
			const success = _=>{
				this.$router.push({name: 'TaskPending',params:{taskExpisingdata:_.data}},);
			};
			this.$axiosPost({url, data, success});
		},
		refreshTaskExpiring (option) {
			const url = URL;
			const obj = this.filterObj(this.form);
			const data = Object.assign({},this.$tool.shallowCopy(obj,{date:false}));
			const success = _=>{
				this.taskExpiringData = _.data;
			};
			this.$axiosGet({url, data, success});
		},
		filterObj (obj) {
			for( let k in obj){
				if(obj[k]==''){
					delete obj[k];
				}
			}
			return obj;
		},
	},
	created () {
		this.refreshTaskExpiring();
	},
	watch: {
		'form.role': {
			handler (val) { 
				if (val) {
					this.refreshTaskExpiring();
				}
			}
		},
		'form.agency': {
			handler(val) {
				if (val) {
					this.refreshTaskExpiring();
				}
			},
		},
		'form.nstage': {
			handler (val) { 
				if (val) {
					this.refreshTaskExpiring();
				}
			}
		},
		'form.level': {
			handler (val) {
				if (val) {
					this.refreshTaskExpiring();
				}
			}
		},
	},
	components: {
		AppTable,
		RemoteSelect,
		StaticSelect,
	}
}
</script>