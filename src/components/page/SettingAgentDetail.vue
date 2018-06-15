<template>
  <div class="main">
  <app-tag :tags="tags" is_static>
		<el-form label-width="140px" slot="basic_information">
			<el-form-item label="代理人名称">
				<span class="detail-item">{{ form.name }}</span>
			</el-form-item>
			<el-form-item label="代理人邮箱">
				<span class="detail-item">{{ form.email }}</span>
			</el-form-item>
			<el-form-item label="擅长技术领域">
				<span class="detail-item">{{ form.major }}</span>
			</el-form-item>
			<el-form-item label="联系电话">
				<span class="detail-item">{{ form.mobile }}</span>
			</el-form-item>
			
			<el-form-item label="工作年限">
				<span class="detail-item">{{ form.working_experience }}</span>
			</el-form-item>
			<el-form-item label="简介">
				<span class="detail-item">{{ form.introduction}}</span>
			</el-form-item>
			<el-form-item label="代理所状态">
				<span class="detail-item">{{ form.status_name }}</span>
			</el-form-item>
		</el-form>
		<div slot="monthly_status_statistics">
			<template>
				<app-table :columns="statisticsColumns" :data="statisticsData" key="a3"></app-table>
			</template>
		</div>
	</app-tag>
  </div>
</template>

<script>
import AppTable from '@/components/common/AppTable'
import AppPop from '@/components/common/AppPop'
import AppTag from '@/components/common/AppTag'


const URL = '/agents';

export default {
  name: 'settingAgencyDetail',
  data () {
		return {
			id: '',
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
			tags: [
				{ text: '基本信息', key: 'basic_information', default: true },
				{ text: '月度状况统计', key: 'monthly_status_statistics'},
			],
			statisticsColumns: [
				{ type: 'text', label: '月份', prop:'time' },
				{ type: 'text', label: '新申请委案量', prop:'increase_project_amount' },
				{ type: 'text', label: 'OA新增数量', prop:'oa_increase_amount' },
				{ type: 'text', label: '新申请定稿数', prop:'new_application_final_amount' },
				{ type: 'text', label: 'OA定稿数', prop: 'oa_final_amount'},
				{ type: 'text', label: '新申请平均评分', prop:'new_application_rank' },
				{ type: 'text', label: 'OA平均评分', prop:'oa_rank' },
				{ type: 'text', label: '正面评价数量', prop:'positive_amount' },
				{ type: 'text', label: '负面评价数量', prop:'negative_amount' },
				{ type: 'text', label: '新申请平均返稿天数', prop:'new_application_daytime' },
				{ type: 'text', label: 'OA平均返稿天数', prop:'oa_daytime' },
				{ type: 'text', label: '新申请返稿及时率', prop: 'new_application_ontime_rate' },
				{ type: 'text', label: 'OA返稿及时率', prop: 'oa_ontime_rate'},
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
		refresh () {
			const id = this.$route.query.id;
			const url = `${URL}/${id}`;
			const success = _=>{
				this.form = _.agency;
				this.offerData = _.agency.partner_fee;
				this.statisticsData =_.agency.angecy_statistics;
			}
			const complete = _=>{
				this.$store.commit('cancelLoading');
			}

			this.$store.commit('onLoading');
			this.$axiosGet({url, success, complete});	
		},
		async importSave () {
			this.saveLoading = true;
			try {
				await this.$axiosPost({
					url: '/partnerfee/batchUpdate',
					data: {
						agency_id: this.$route.query.id,
						data: this.offerData.filter(v => v.flag).map(v => ({code: v.fee_code, amount: v.amount})),
					},
					success: () => {
						this.saveStatus = false;
						this.refresh();
					}
				})
			}catch(e){}
			this.saveLoading = false;
			
		},
		importCancel () {
			this.saveStatus = false;
			this.refresh();

		},
	},
	created () {
		this.refresh();
	},
	components: {
		AppTag,
		AppTable,
		AppPop,
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.agency-fee-red {color: red;}
</style>