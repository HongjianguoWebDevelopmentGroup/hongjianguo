<template>
  <div class="main">
 <app-shrink :title="shrinkTitle" :visible="visible" @update:visible="handleVisible">
<!--   <app-tag :tags="tags" is_static> -->
	<el-tabs v-model="active">
		<el-tab-pane label="基本信息" name="basic_information">
			<el-row>
			<el-col :span="12">		
			  	<el-card  :body-style="{padding:'0px',}">
			  		<div class="name_card">
			  			<img src="../../assets/head_img.png">
			  			<div class="name_email">
				  			<span class="detail-item">{{ form.name }}</span>
						</div>
			  		</div>
			  		<el-form label-width="110px" label-position="left" style="padding: 0 20px">
					<el-form-item label="擅长技术领域">
						<span class="detail-item">{{ form.major }}</span>
					</el-form-item>
					<el-form-item label="联系电话">
						<span class="detail-item">{{ form.mobile }}</span>
					</el-form-item>			
					<el-form-item label="邮箱">
						<span class="detail-item">{{ form.email }}</span>
					</el-form-item>
					
					<el-form-item label="工作年限">
						<span class="detail-item">{{ form.working_experience }}</span>
					</el-form-item>
					<el-form-item label="简介">
						<span class="detail-item">{{ form.introduction}}</span>
					</el-form-item>
					<el-form-item label="代理人状态">
						<span class="detail-item">{{ form.status_name }}</span>
					</el-form-item>
					</el-form>
				</el-card>	
			</el-col>
			</el-row>

	</el-tab-pane>
	<el-tab-pane label="月度状况统计" name="monthly_status_statistics">
		<div>
			<template>
				<!-- <el-button type="primary" size="samll" icon="upload2" style="margin-bottom:10px;" @click="handleExport">导出</el-button> -->
				<app-table :columns="statisticsColumns" :data="statisticsData" key="a3"></app-table>
			</template>
		</div>
	</el-tab-pane>	
	</el-tabs>	
	<!-- </app-tag> -->
	</app-shrink>
  </div>
</template>

<script>
import AppTable from '@/components/common/AppTable'
import AppPop from '@/components/common/AppPop'
import AppTag from '@/components/common/AppTag'
import AppShrink from '@/components/common/AppShrink'

const URL = '/api/agent';

export default {
  name: 'settingAgentDetail',
  props: {
  	'visible': {
  		type: Boolean,
  		default: false,
  	},
  	'row': {
  		type: Object,
  		default(){
  			return {}
  		}
  	},
  },
  data () {
		return {
			id: '',
			active: 'basic_information',
			saveStatus: false,
			importLoading: false,
			saveLoading: false,
			form: {
				name: '',
				mobile: '',
				introduction: '',
				working_experience: '',
				email: '',
				major: '',
				status_name: '',
			},
			// tags: [
			// 	{ text: '基本信息', key: 'basic_information', default: true },
			// 	{ text: '月度状况统计', key: 'monthly_status_statistics', default: true},
			// ],
			statisticsColumns: [
				{ type: 'text', label: '月份', prop:'time', width:'120' },
				{ type: 'text', label: '新申请委案量', prop:'increase_project_amount' , width:'120'},
				{ type: 'text', label: 'OA新增数量', prop:'oa_increase_amount' , width:120},
				{ type: 'text', label: '新申请定稿数', prop:'new_application_final_amount' , width:120},
				{ type: 'text', label: 'OA定稿数', prop: 'oa_final_amount', width:120},
				{ type: 'text', label: '新申请平均评分', prop:'new_application_rank', width:120 },
				{ type: 'text', label: 'OA平均评分', prop:'oa_rank', width:120 },
				{ type: 'text', label: '正面评价数量', prop:'positive_amount' , width:120},
				{ type: 'text', label: '负面评价数量', prop:'negative_amount', width:120 },
				{ type: 'text', label: '新申请平均返稿天数', prop:'new_application_daytime', width:120 },
				{ type: 'text', label: 'OA平均返稿天数', prop:'oa_daytime', width:120 },
				{ type: 'text', label: '新申请返稿及时率', prop: 'new_application_ontime_rate',width:120, render:(h,item)=>{
					item == -1? item = '-': item;
					return h('span',item); 
				}},
				{ type: 'text', label: 'OA返稿及时率', prop: 'oa_ontime_rate', width:120,render:(h,item)=>{
					item == -1? item = '-': item;
					return h('span',item); 
				}},
			],
			offerData: [],
			statisticsData: [],
			offerForm: {
				amount: '',
			},
			rules_amount://验证规则
			[
				{ required: true, message: '默认报价不能为空', trigger: 'blurs' },
				{ pattern: /^(0|(([1-9][0-9]*)+(.[0-9]{1,2})?))$/, message: '价格只能为数字,保留至小数后两位', trigger: 'blur' },
			],
			
		}
	},
	computed: {
		shrinkTitle () {
			return	this.row.name && this.row.email ? `${this.row.name}_${this.row.email}` : this.row.name; 
		}
	},
	methods: {
		handleBeforeUpload () {
			this.importLoading = true;
		},
		rowClassFunc ({flag}) {
			if(flag) {
				return 'agency-fee-red';
			}else {
				return '';
			}
		},
		handleUploadSuccess (data) {
			if(!data.status) return this.$message({message: data.info, type: 'warning'});
			this.saveStatus = true;
			this.importLoading = false;

			const map = new Map();
			data.data.forEach(v => map.set(v.code, v.amount));
			this.offerData.forEach(v => {
				const amount = map.get(v.fee_code);
				if(amount) {
					v.amount = amount;
					v.flag = true;
				}
			});
		},
		save () {
			const url = `/partnerfee/${this.id}`;
			const data = this.offerForm;
			const success = () => {
				this.$message({type: 'success', message: '编辑报价成功'});
				this.refresh();
			}
			return this.$axiosPut({url, data, success});
		},
		handleRowClick ({id, amount}) {
			this.$refs.pop.show();
			this.$nextTick(() => {
				this.id = id;
				this.offerForm.amount = amount + '';
			});
		},
		handleVisible (val) {
     		 this.$emit('update:visible', val);
  		},
		handleExport() {
			const url = `/agents/${this.$route.query.id}/excel`;
			const success = _=>{
				this.$message({ message: '导出成功', type: 'success'});
				window.location.href = _.agent.downloadUrl;
			};
			this.$axiosPost({url, success});
		},
		refresh () {
			// const id = this.$route.query.id;
			const id = this.row.id;
			const url = `${URL}/${id}`;
			const success = _=>{
				this.form = _.agent;
				// this.offerData = _.agency.partner_fee;
				if(_.agent.agent_statistics) {
					this.statisticsData =_.agent.agent_statistics;
				}
			}
			const complete = _=>{
				this.$store.commit('cancelLoading');
			}

			this.$store.commit('onLoading');
			this.$axiosGet({url, success, complete});	
		},
		importCancel () {
			this.saveStatus = false;
			this.refresh();

		},
	},
	created () {
		// this.refresh();
	},
	watch: {
		row(val) {
			this.refresh();
		}
	},
	components: {
		AppTag,
		AppTable,
		AppPop,
		AppShrink,
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.agency-fee-red {color: red;}
.name_card {
	height: 200px;
	background: url('../../assets/card.jpg') center center no-repeat;
	position: relative;
	text-align: center;
	width: 100%;
}
.name_card img {
	text-align: center;
	position: absolute;
	left: 50%;
	top: 50%;
	z-index: 1;
	margin-left: -50px;
	margin-top: -50px;
}
.name_card .name_email {
	width: 100%;
	position: absolute;
	left: 0px;;
	bottom: 10%;
	color: #fff;
}

</style>