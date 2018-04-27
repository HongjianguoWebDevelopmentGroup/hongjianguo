<!-- 列表筛选 -->
<template>
	<div>
		<shrink title="筛选条件" size="small" :modal="true" :visible="visible" @update:visible="handleVisible">
			<div class="filter-editor-condition">
				<div v-for="(item, index) in listFilterLabel" class="filter-editor-condition-cell">
					<div class="filter-editor-condition-cell-field">
						<div class="filter-editor-condition-cell-field-operate">{{ item.key }}</div>
						<div class="filter-editor-condition-cell-field-status">
							<el-button icon="edit" type="text" size="mini" @click="(e) => { edit(e, index) }"></el-button>
							<el-button icon="close" type="text" size="mini" @click="(e) => { remove(e, index); }"></el-button>
						</div>
					</div>
					<div class="filter-editor-condition-cell-value">
						<span class="filter-editor-condition-cell-value-in">{{ item.value }}</span>
					</div>
				</div>
			
				<div class="filter-editor-condition-add">
					<el-button @click="addPop"  style="padding: 0px;" icon="plus" type="text">新增筛选条件</el-button>
				</div>
			</div>
		</shrink>
		<el-dialog :title="selectedKey ? '编辑筛选条件' : '新增筛选条件'" :visible.sync="dialogVisible" class="dialog-small" @close="clear">
			<el-form label-position="top">
				<el-form-item label="属性" prop="key">
					<static-select :type="selectType" v-model="key" ref="key" :skip="selectSkip"></static-select>
				</el-form-item>
				<el-form-item label="值" prop="value">
					<filter-value :source="source" v-model="value" ref="value"></filter-value>
				</el-form-item>
				<el-form-item style="margin-bottom: 0px;">
					<el-button type="primary" @click="confirm">确定</el-button>
					<el-button @click="dialogVisible = false">取消</el-button>
				</el-form-item>
			</el-form>
		</el-dialog>
	</div>
</template>

<script>
import StaticSelect from '@/components/form/StaticSelect'
import Shrink from '@/components/common/AppShrink'
import FilterValue from '@/components/common/FilterValue'
import {mapActions} from 'vuex' //filter-cache
import {mapGetters} from 'vuex' //filter-cache

const DATA = [
	{id: 'type', name: '版权类型', components: 'static_select', type: 'copyright_type'},
	{id: 'proposer', name: '提案人', components: 'remote_select', type: 'member'},
	{id: 'applicant', name: '申请人', components: 'remote_select', type: 'applicant'},
	{id: 'agent', name: '代理人', components: 'remote_select', type: 'agent'},
	{id: 'agency', name: '代理机构', components: 'remote_select', type: 'agency'},
	{id: 'product', name: '产品分类', components: 'static_select', type: 'product'},
	{id: 'tag', name: '标签', components: 'static_select', type: 'tag'},
	{id: 'apd', name: '申请日', components: 'date'},
	{id: 'issue_date', name: '公告日', components: 'date'},
]
const DATA_MAP = new Map();
DATA.forEach((v) => {
	DATA_MAP.set(v.id, v);
})

export default {
	name: 'appListFilter',
	props: {
		visible: {
			type:Boolean,
			default: false,
		},
		type: {
			type: String,
			default: '',
		}
	},
	data () {
		return {
			configuration: [],
			dialogVisible: false,
			options: [],
			key: '',
			value: '',
			selectedKey: '',
		};
	},
	computed: {
		...mapGetters([
			'listFilterLabel',
			'listFilterValue',
		]),
		selectSkip () {
			if(this.selectedKey) {
				return this.keys.filter(v => !v === this.selectedKey );
			}else {
				return this.keys;
			}
		},
		keys () {
			return this.listFilterValue.map(v => v.key);
		},
		selectType () {
			return {
				placeholder: '请选择筛选属性',
				options: DATA,
			}
		},
		source () {
			const val = DATA_MAP.get(this.key);
			return val ? val : null;
		}
	},
	methods: {
		...mapActions([
			'addListFilter',
			'removeListFilter',
			'editListFilter',
		]),
		clear () {
			this.key = '';
			this.value = '';
			this.selectedKey = '';
		},
		edit (event, index) {
			const data = this.listFilterValue[index];
			const key = data.key;
			let value = data.value;
			const components =  DATA_MAP.get(key).components;
			if(components == 'remote_select') {
				value = {id: value, name: this.listFilterLabel[index]['value']};
			}

			this.dialogVisible = true;
			this.selectedKey = key;
			this.$nextTick(() => {
				this.key = key;
				this.$nextTick(() => {
					this.value = value;
				})
			}) 
		},
		remove (event, index) {
			this.removeListFilter(index);
		},
		handleVisible (val) {
			this.$emit('update:visible', val);
		},
		addPop () {
			this.dialogVisible = true;
		},
		confirm () {
			if(this.key == '') {
				this.$message({ type: 'warning', message: '属性不能为空' });
				return; 
			}
			if(this.$refs.value.checkNull()) {
				this.$message({ type: 'warning', message: '值不能为空' });
				return;
			}

			const keyLabel = this.$refs.key.map.get(this.key).name;
			const key = { label: keyLabel, value: this.key };
			const valueLabel = this.$refs.value.getLabel();
			const value = { label: valueLabel, value: this.value };
			const item = { key, value };

			if(this.selectedKey) {
				this.editListFilter({key: this.selectedKey, item});
			}else {
				this.addListFilter(item);
			}

			this.dialogVisible = false;
		}
	},
	watch: {
		key (val) {

		}
	},
	components: {
		StaticSelect,
		Shrink,
		FilterValue,
	}
}
</script>

<style>
.filter-editor-condition {
	margin-top: 20px;
  border-radius: 3px;
  box-sizing: border-box;
  display: inline-block;
  height: auto;
  line-height: auto;
  width: 100%;
  border: 1px solid #dedede;
  border-radius: 0px;
  -webkit-flex: 0 0 auto;
  flex: 0 0 auto;
}

.filter-editor-condition-cell {
	min-height: 64px;
  border-bottom: 1px solid #dedede;
  padding: 15px;
  box-sizing: border-box;
}

.filter-editor-condition-cell-field {
	display: -webkit-flex;
  display: flex;
  -webkit-align-items: center;
  align-items: center;
}

.filter-editor-condition-cell-field-operate {
	font-size: 12px;
  color: #909090;
  -webkit-flex: 1 0 auto;
  flex: 1 0 auto;
  line-height: 18px;
}

.filter-editor-condition-cell-field-status {
	-webkit-flex: 0 0 auto;
  flex: 0 0 auto;
  -webkit-align-self: baseline;
  align-self: baseline;
  line-height: 18px;
}

.filter-editor-condition-cell-value {
	word-wrap: break-word;
	line-height: 20px;
}

.filter-editor-condition-cell-value-in {
	font-size: 14px;
}

.filter-editor-condition-add {
  padding: 15px;
  display: -webkit-flex;
  display: flex;
  -webkit-align-items: center;
  align-items: center;
  -moz-user-select: none;
  -webkit-user-select: none;
  -o-user-select: none;
  transition: border-color 0.2s, background-color 0.2s, color 0.2s;
  cursor: pointer;
  outline: none;
  text-align: center;
  border: none;
  box-shadow: 0 4px 6px 0 rgba(0, 62, 118, 0.05), 0 0 2px 0 rgba(0, 62, 118, 0.2);
  color: #606060;
  background-color: #fff;
}
</style>