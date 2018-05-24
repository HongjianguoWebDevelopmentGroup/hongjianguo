<template>
  <div class="main">
  <app-tag :tags="tags" is_static>
		<el-form label-width="140px" slot="basic_information">
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
		</el-form>
		<div slot="statistics">
			<app-table :columns="columns" :data="offerData"></app-table>
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
			form: {
				name: '',
				contact: '',
				email: '',
				address: '',
				telephone: '',
				rank: '',
				is_core_partner_name: '',
				scope: [],
				status_name: '',
			},
			tags: [
				{ text: '基本信息', key: 'basic_information', default: true },
				{ text: '报价信息', key: 'statistics' },
			],
			columns: [
				{ type: 'text', label: '报价名称', prop: 'name' },
				{ type: 'text', label: '默认报价', prop: 'amount', render_text: item => `${item}元` },
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
			offerData: [],
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
				this.offerForm.amount = amount;
			});
		},
		refresh () {
			const id = this.$route.query.id;
			const url = `${URL}/${id}`;
			const success = _=>{
				this.form = _.agency;
				this.offerData = _.agency.partner_fee;
			}
			const complete = _=>{
				this.$store.commit('cancelLoading');
			}

			this.$store.commit('onLoading');
			this.$axiosGet({url, success, complete});	
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
<style scoped lang="scss">
</style>