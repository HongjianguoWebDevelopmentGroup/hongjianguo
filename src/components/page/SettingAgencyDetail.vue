<template>
  <div class="main">
  <app-tag :tags="tags" is_static>
		<!-- <el-form label-width="140px" slot="basic_information">
			<el-form-item label="代理所名称">
				<span class="detail-item">{{ form.name }}</span>
			</el-form-item>
			<el-form-item label="代理所联系人">
				<span class="detail-item">{{ form.contact }}</span>
			</el-form-item>
			<el-form-item label="代理所邮箱">
				<span class="detail-item">{{ form.email }}</span>
			</el-form-item>
			<el-form-item label="代理所地址">
				<span class="detail-item">{{ form.address }}</span>
			</el-form-item>
			<el-form-item label="联系电话">
				<span class="detail-item">{{ form.telephone }}</span>
			</el-form-item>
			<el-form-item label="代理所评分">
				<el-rate style="margin-top: 8px;" v-if="form.rank ? true : false" :value="form.rank/20" disabled show-text text-color="#f90" :text-template="form.rank + ''"></el-rate>
				<span v-else class="detail-item">暂无评分</span>
			</el-form-item>
			<el-form-item label="核心伙伴">
				<span class="detail-item">{{ form.is_core_partner_name }}</span>
			</el-form-item>
			<el-form-item label="业务范围">
				<el-tag v-for="tag in form.scope" :key="tag" style="margin-right: 20px;">{{ tag }}</el-tag>
			</el-form-item>
			<el-form-item label="代理所状态">
				<span class="detail-item">{{ form.status_name }}</span>
			</el-form-item>
		</el-form> -->
		<div slot="monthly_status_statistics">
			<template>
				<el-button type="primary" size="samll" icon="upload2" style="margin-bottom:10px;" @click="handleExport">导出</el-button>
				<app-table :columns="statisticsColumns" :data="statisticsData" key="a3"></app-table>
			</template>
		</div>
		<div slot="statistics">
			<template v-if="!saveStatus">
				<el-upload
					style="margin-bottom: 10px;"
					class="upload-demo"
					:before-upload="handleBeforeUpload"
					:on-success="handleUploadSuccess"
					action="/api/tempfile?action=getBatchFees"
					:show-file-list="false">
					<el-button size="small" type="primary" :loading="importLoading">{{ importLoading ? '导入中...' : '导入报价' }}</el-button>
					<a slot="tip" style="margin-left: 15px; font-size: 12px;" href="/static/template/price_template.xlsx">下载导入模板</a>
				</el-upload>
				<app-table key="a1" :columns="columns" :data="offerData"></app-table>
			</template>

			<template v-else>
				<div style="margin-bottom: 10px;">
					<el-button :loading="saveLoading" size="small" type="primary" @click="importSave">{{ saveLoading ? '保存中...' : '确认保存'}}</el-button>
					<el-button :disabled="saveLoading" size="small" type="danger" @click="importCancel">取消</el-button>
				</div>
				<app-table key="a2" :columns="importColumns" :data="offerData" :row-class-name="rowClassFunc"></app-table>
			</template>
			
			<app-pop
				:model="offerForm"
				type="edit"
				label-position="top"
				title="报价"
				ref="pop"
				:save="save">
				<el-form-item label="默认报价" prop="amount" :rules="rules_amount">
					<el-input placeholder="请输入默认报价" v-model="offerForm.amount" style="width: 200px;"></el-input><span>&nbsp;&nbsp;元</span>
				</el-form-item>
			</app-pop>
		</div>
	</app-tag>
  </div>
</template>

<script>
import AppTable from '@/components/common/AppTable'
import AppPop from '@/components/common/AppPop'
import AppTag from '@/components/common/AppTag'


const URL = '/agencies';

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
				contact: '',
				email: '',
				address: '',
				telephone: '',
				// rank: '',
				// is_core_partner_name: '',
				// scope: [],
				status_name: '',
			},
			tags: [
				{ text: '月度状况统计', key: 'monthly_status_statistics', default: true},
				// { text: '基本信息', key: 'basic_information', default: true },
				{ text: '报价信息', key: 'statistics' },
			],
			columns: [
				{ type: 'text', label: '报价名称', prop: 'name' },
				{ type: 'text', label: '默认报价', prop: 'amount', render_text: item => `${item}元`, width: '200' },
				{ 
					type: 'action',
					width: '100px',
					fixed: false,
					align: 'center',
					btns: [
						{ type: 'edit', click: this.handleRowClick },
					],
				}
			],
			importColumns: [
				{ type: 'text', label: '报价名称', prop: 'name' },
				{ type: 'text', label: '默认报价', prop: 'amount', render_text: item => `${item}元`, width: '200' },
			],
			statisticsColumns: [
				{ type: 'text', label: '月份', prop:'time', width: '100'},
				{ type: 'text', label: '新申请委案量', prop:'increase_project_amount', width: '100' },
				{ type: 'text', label: 'OA新增数量', prop:'oa_increase_amount', width: '100' },
				{ type: 'text', label: '新申请定稿数', prop:'new_application_final_amount', width: '100' },
				{ type: 'text', label: 'OA定稿数', prop: 'oa_final_amount', width: '100'},
				{ type: 'text', label: '新申请平均评分', prop:'new_application_rank', width: '100' },
				{ type: 'text', label: 'OA平均评分', prop:'oa_rank' , width: '100'},
				{ type: 'text', label: '正面评价数量', prop:'positive_amount', width: '100' },
				{ type: 'text', label: '负面评价数量', prop:'negative_amount', width: '100' },
				{ type: 'text', label: '新申请平均返稿天数', prop:'new_application_daytime', width: '100' },
				{ type: 'text', label: 'OA平均返稿天数', prop:'oa_daytime', width: '100' },
				{ type: 'text', label: '新申请返稿及时率', prop: 'new_application_ontime_rate',  width: '100',render:(h,item)=>{
					item == -1? item = '-': item;
					return h('span',item); 
				}},
				{ type: 'text', label: 'OA返稿及时率', prop: 'oa_ontime_rate', width: '100', render:(h,item)=>{
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
		handleExport() {
			const url = URL;
			const data = Object.assign({},{format: 'excel'});
			const success = _=>{
				this.$message({ message: '导出成功', type: 'success'});
				window.location.href = _.agency.downloadUrl;
			};
			this.$axiosPost({url, data, success});
		},
		refresh () {
			const id = this.$route.query.id;
			const url = `${URL}/${id}`;
			const success = _=>{
				this.form = _.agency;
				this.offerData = _.agency.partner_fee;
				this.statisticsData =_.agency.agency_statistics;
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