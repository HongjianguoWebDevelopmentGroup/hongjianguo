<template>
	<div class="main">
		<div class="filter-visible-body">
			<el-tree
				v-loading="groupLoading"
				class="filter-visible-body-left"
			  :data="groupOptions"
			  :props="defaultProps"
			  highlight-current
			  @current-change="handleCurrentChange"
			  ref="tree"
			>
			</el-tree>
			<div class="filter-visible-body-right">
				<static-select type="table_type" v-model="tableType"></static-select>
				<app-transfer-panel v-loading="listLoading" element-loading-text="加载中..." style="width: 100%; margin-top: 10px;" list-style="height: 400px;" :is-move="false" title="权限控制" placeholder="查询字段..." :data="fields" v-model="checkedFields"></app-transfer-panel>
				<!-- <app-transfer style="margin-top: 10px;" ref="transfer" title1="有权限" title2="无权限" placeholder="查询字段..." v-model="transferValue"></app-transfer> -->
				<div style="margin-top: 10px;" v-if="currentId != '' && tableType != ''">
					<el-button type="primary" @click="save" :loading="saveLoading">{{ saveLoading ? '保存中....' : '保存' }}</el-button>
					<el-button @click="restore" :disabled="saveLoading">还原</el-button>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import {mapGetters} from 'vuex';
import {mapActions} from 'vuex';
import {config} from '@/const/fieldConfig'
import StaticSelect from '@/components/form/StaticSelect';
import AppTransferPanel from '@/components/common/AppTransferPanel';

const URL = '/ruleexcept';
const map = new Map(config);

export default {
	name: 'filterVisible',
	data () {
		return {
			defaultProps: {
				label: 'name',
				children: 'children',
			},
			tableType: '',		
			checkedFields: [],
			cache: {},
			listLoading: false,
			currentId: '',
			saveLoading: false,
		};
	},
	computed: {
		...mapGetters([
			'groupOptions',
			'groupLoading',
			'usergroups',
		]),
		fields () {
			const fields = map.get(this.tableType);
			return fields ? fields : [];
		},
		except: {
			set (val) {
				const map = new Map();
				val.forEach(v => {map.set(v, true)});
				this.checkedFields = this.fields.filter(v => !map.get(v.value)).map(v => v.value);
			},
			get () {
				const map = new Map();
				this.checkedFields.forEach(v => {map.set(v, true)});
				return this.fields.filter(v => !map.get(v.value)).map(v => v.value);
			}
		},
	},
	methods: {
		...mapActions([
			'refreshGroup',
			'refreshUser',
		]),
		async handleCurrentChange (data) {
			this.currentId = data['id'];
			this.refreshExcept({group_id: data['id'], model: this.tableType});
		},
		async refreshExcept ({group_id, model}) {
			if(group_id == '' || model == '') return;
			
			let except = this.cache[group_id][model];
			if(!except) {
				this.listLoading = true;
				try {
					const response = await this.$axiosGet({
						url: URL,
						data: {group_id, module: model},
						success: (data) => {
							except = data.data;
							this.cache[group_id][model] = except; //缓存
						}
					})
				}catch(e) {}
				this.listLoading = false;
			}
			if(except) {
				this.except = except;
			}
		},
		async save () {
			const group_id = this.currentId;
			const model = this.tableType;
			const except = this.except;
			if(group_id == '' || model == '') return;
			this.saveLoading = true;
			try {
				this.$axiosPost({
					url: URL,
					data: {group_id, module: model, except},
					success: () => {
						this.$message({type: 'success', message: '保存成功'});
						this.cache[group_id][model] = except;
						if(this.usergroups.indexOf(group_id) > -1) {
							this.refreshUser();
						}
					}
				});
			}catch(e) {}
			this.saveLoading = false;
		},
		restore () {
			const group_id = this.currentId;
			const model = this.tableType;
			if(group_id == '' || model == '') return;
			this.except = this.cache[group_id][model];
		},
	},
	created () {
		this.refreshGroup().then(() => {
			this.groupOptions.forEach(v => {
				this.cache[v.id] = {};
			});
		});
	},
	watch: {
		tableType (val) {
			this.refreshExcept({group_id: this.currentId, model: val});
		}
	},
	components: {
		StaticSelect,
		AppTransferPanel,
	},
}
</script>

<style>
.filter-visible-body {
	display: -webkit-flex;
  display: flex;
}
.filter-visible-body-left {
	-webkit-flex: 0 0 auto;
  flex: 0 0 auto;
  width: 200px;
  margin-right: 10px;
}
.filter-visible-body-right {
	-webkit-flex: 1;
  flex: 1;
}
.filter-visible-body-right .el-checkbox-group>label:first-child {
	margin-left: 15px;
}
</style>