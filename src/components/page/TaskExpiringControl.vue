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
					<el-col :span="6"  v-if="menusMap && !menusMap.get('/iprs')">
						<el-form-item label="代理机构" prop="agency" v-show="form.role == '6'">
							<remote-select type="agency" v-model="form.agency" class="no_wrap"></remote-select>
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="状态" prop="nstage">
								<static-select type="get_stage"  v-model="form.nstage"></static-select>
						</el-form-item>
					</el-col>
					<el-col :span="6"  v-if="menusMap && !menusMap.get('/iprs')">
						<el-form-item label="案件等级" prop="level">
							<static-select type="case_level" v-model="form.level"></static-select>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
		</el-card>
		<app-table :columns="columns" :data="taskExpiringData" @cell-click="handleCellClick" @cell-mouse-enter="handleMouseEnter" height="default2" border></app-table>
	</div>
</template>

<script>
import AppTable from '@/components/common/AppTable'
import RemoteSelect from '@/components/form/RemoteSelect'
import StaticSelect from '@/components/form/StaticSelect'
import {mapGetters} from 'vuex'
import {mapActions} from 'vuex'
const URL = '/getcountdata';
const config = [
	['new_apply', 1],
	['oa', 2],
	['review',3],
	['others','other'],
	['over_duetime',1],
	['over_deadline',1],
	['expiring',1],
];
const map = new Map(config);

export default {
	name: 'TaskExpiringControl',
	data () {
		return {
			taskExpiringData: [],
			identity: '',
			form: {
				role: 6,
				agency: '',
				nstage: '',
				level: '',
			},
			columns: [
				{ type: 'text', label: '承办人', prop: 'member',render_simple: 'name'},
				{ type: 'text', label: '代理机构', prop: 'agency',render_simple: 'name'},
				{ type: 'text', label: '正常处理中', prop: 'processing',},
				{ type: 'text', label: '已逾期未返稿（1个月内）', prop: 'processing_expired_1_month',},
				{ type: 'text', label: '已逾期未返稿（1-3个月）', prop: 'processing_expired_1_3_month',},
				{ type: 'text', label: '已逾期未返稿（3-6个月）', prop: 'processing_expired_3_6_month',},
				{ type: 'text', label: '已逾期未返稿（6个月以上）', prop: 'processing_expired_gt_6_month',},
				{ type: 'text', label: '正常核稿中', prop: 'reviewing',},
				{ type: 'text', label: '已返稿未审核（1个月内）', prop: 'reviewing_expired_1_month',},
				{ type: 'text', label: '已返稿未审核（1-3个月）', prop: 'reviewing_expired_1_3_month',},
				{ type: 'text', label: '已返稿未审核（3-6个月）', prop: 'reviewing_expired_3_6_month',},
				{ type: 'text', label: '已返稿未审核（6个月以上）', prop: 'reviewing_expired_gt_6_month',},
			],
			filter: {},
		}
	},
	computed: {
		...mapGetters([
			'menusMap',
		]),
		defaultParams () {
			const params = this.$route.meta.params;
			return params ? params : {};
		},
	},
	methods:{
		...mapActions([
			'addListFilter',
		]),
		handleCellClick (row, column, cell, event) {
			if(column.property == 'member') return false;
				let option = {};
				if(this.form.role == 6){
					option['agent'] = row.member.id;
					this.identity = '代理人';
				}
				if (this.form.role == 3)  {
					option['ipr'] = row.member.id;
					this.identity = 'IPR';
				}
				if(column.property == 'over_deadline' || column.property == 'over_duetime' || column.property == 'expiring'){
					option[column.property] = map.get(column.property);
				}else{
					option['stage'] = map.get(column.property);
				}
				const extraOption = Object.assign({},option,this.filterObj(this.form));
				const name = `期限管控：${this.identity}:${row.member['name']}`;
				const label = `管控类型：${column.label}`;
				const key = '';
				const value = '';
				const item = {name, label, key, value,extraOption};
				this.addListFilter(item);
				this.$router.push({path: '/task/all'});
			
		},
		handleMouseEnter (row, column, cell, event) {
			if(column.property == 'member') { return false };
				const tbody = cell.parentNode.parentNode;

				cell.style.cursor = 'pointer';
				const tr=tbody.getElementsByTagName("tr");
    			const td=tbody.getElementsByTagName("td");
			    for(var i=0; i<td.length; i++) {
			        td[i].onmouseleave = function() {
			            for (var j=0;j< td.length; j++)
			                td[j].style.backgroundColor ='';//去除原来影响
			        };
			        td[i].onmouseenter=function() {
			            
			            const row=this.parentNode.getElementsByTagName('td');
			            // console.log(row)
			            for(var j=0;j<row.length;j++)
			                {
			                    row[j].style.backgroundColor ='#f1f1f1';
			                }//行
			            const col=this.cellIndex;
			            // console.log(col)
			            for(var k=0;k<tr.length;k++)
			                {
			                tr[k].getElementsByTagName("td")[col].style.backgroundColor ='#f1f1f1';
			                }//列
			                this.style.backgroundColor ='#fff';
			        }
			    }
				// this.highLight(tbody);

				// tr.style.backgroundColor = '#f00';
				// cell.style.backgroundColor = '#f00';
		},
		refreshTaskExpiring (option) {
			const url = URL;
			const obj = this.filterObj(this.form);
			const data = Object.assign({},this.$tool.shallowCopy(obj,{date:false}),this.defaultParams);
			const success = _=>{
				this.taskExpiringData = _.data;
			};
			this.$axiosGet({url, data, success});
		},
		changeBgColor (h,item) {
			return h('span',{
				style: {
					color: 'red',
					width: '100%',
					display: 'block',			
				},
			},item)
		},
		filterObj (obj) {
			const form = {};
			for( let k in obj){
				if(obj[k] !== ''){
					form[k] = obj[k]
				}
			}
			return form;
		},
	},
	created () {
		this.refreshTaskExpiring();
	},
	watch: {
		'form': {
			handler (val) { 				
				this.refreshTaskExpiring();				
			},
			deep: true
		},
	},
	components: {
		AppTable,
		RemoteSelect,
		StaticSelect,
	}
}
</script>
<style lang="scss" scoped>
</style>