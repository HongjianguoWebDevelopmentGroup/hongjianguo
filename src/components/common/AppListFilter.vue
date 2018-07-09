<!-- 列表筛选 -->
<template>
	<div>
		<shrink title="筛选条件" size="small" :modal="true" :visible="visible" @update:visible="handleVisible">
			<div v-if="custom" slot="header" style="float: right;">
				<el-button size="small" type="primary" @click="savePop('edit')">重命名</el-button>
				<el-button size="small" type="success" @click="saveSerialize">保存</el-button>
				<el-button size="small" type="danger" @click="deletePop">删除</el-button>
			</div>
			<div class="filter-editor-condition">

				<el-form v-if="usedFlag" label-width="80px" :model="usedForm"  ref="usedForm" style="border-bottom: 1px solid #dedede;">
					<el-form-item v-for="item in usedOptions" :label="item.name" :key="item.id" :prop="item.id">
						<filter-value :source="item" v-model="usedForm[item.id]" :ref="`usedForm_${item.id}`"></filter-value>
					</el-form-item>
        		</el-form>

				<div v-for="(item, index) in listFilterIn" class="filter-editor-condition-cell">
					<div class="filter-editor-condition-cell-field">
						<div class="filter-editor-condition-cell-field-operate">{{ item.name }}</div>
						<div class="filter-editor-condition-cell-field-status">
							<el-button icon="edit" type="text" size="mini" @click="(e) => { edit(e, index) }"></el-button>
							<el-button icon="close" type="text" size="mini" @click="(e) => {remove(e, item.key); }"></el-button>
						</div>
					</div>
					<div class="filter-editor-condition-cell-value">
						<span class="filter-editor-condition-cell-value-in">{{ item.label }}</span>
					</div>
				</div>
				<div @click="addPop" class="filter-editor-condition-add">
					<el-button style="padding: 0px;" icon="plus" type="text">新增筛选条件</el-button>
				</div>
			</div>

			<div class="filter-editor-operate">
				<el-button @click="refreshTable" class="filter-editor-operate-btn" type="primary">筛选</el-button>
				<el-button @click="clearTableFilter" class="filter-editor-operate-btn">清空</el-button>
			</div>
		</shrink>

		<el-dialog :title="selectedKey ? '编辑筛选条件' : '新增筛选条件'" :visible.sync="dialogVisible" class="dialog-small" @close="clear">
			<el-form label-position="top">
				<el-form-item label="字段" prop="key">
					<static-select :type="selectType" v-model="key" ref="key" :skip="selectSkip"></static-select>
				</el-form-item>
				<el-form-item label="筛选条件" prop="value">
					<filter-value :source="source" v-model="value" ref="value"></filter-value>
				</el-form-item>
				<el-form-item style="margin-bottom: 0px;">
					<el-button type="primary" @click="confirm">确定</el-button>
					<el-button @click="dialogVisible = false">取消</el-button>
				</el-form-item>
			</el-form>
		</el-dialog>

		<el-dialog :title="saveTitle" :visible.sync="saveVisible" @close="addClose" class="dialog-small">
			<div class="form-description">筛选器名称</div>
			<el-input v-model="name"></el-input>
			<div style="margin-top: 10px;">
				<el-button :loading="saveLoading" @click="save" type="primary">{{ saveLoading ? '保存中...' : '保存' }}</el-button>
				<el-button :disabled="saveLoading" @click="saveVisible = false;">取消</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import StaticSelect from '@/components/form/StaticSelect'
import Shrink from '@/components/common/AppShrink'
import FilterValue from '@/components/common/FilterValue'
import {listPathMap, map as filterConfig} from '@/const/filterConfig'

import {mapActions} from 'vuex' //filter-cache
import {mapGetters} from 'vuex' //filter-cache
import {mapMutations} from 'vuex'

const URL = '/definesearch';

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
		},
		refresh: {
			type: Function,
			required: true,
		}
	},
	data () {
		return {
			configuration: [],
			dialogVisible: false,
			saveVisible: false,
			saveLoading: false,
			saveType: '',
			options: [],
			key: '',
			value: '',
			selectedKey: '',
			name: '',
			usedForm: null
		};
	},
	computed: {
		...mapGetters([
			'listFilter'
		]),
		filterSetting () { //自定义筛选配置项
			const data = filterConfig.get(this.type)
			return data ? data : []
		},
		filterSettingMap () { //自定义筛选配置项映射
			const map = new Map()
			this.filterSetting.forEach(v => {
				map.set(v.id, v)
			})
			return map
		},
		custom () {
			const custom = this.$route.meta.custom;
			return custom !== undefined ? custom : false;
		},
		customId () {
			const id = this.$route.params.id;
			return this.custom && id ? id : ''
		},
		saveTitle () {
			let str = '';
			if(this.saveType == 'add') {
				str = '另存为筛选器';
			}else if(this.saveType == 'edit') {
				str = '重命名筛选器';
			}
			return str; 
		},
		selectSkip () {
			if(this.selectedKey) {
				return this.keys.filter(v => !v === this.selectedKey );
			}else {
				return this.keys;
			}
		},
		keys () {
			return this.listFilter.map(v => v.key);
		},
		selectType () {
			return {
				placeholder: '请选择筛选属性',
				options: this.filterSetting.filter(item => !item.used)
			}
		},
		usedOptions () {
			return this.filterSetting.filter(item => item.used)
		},
		usedFlag () {
			return this.usedOptions.length === 0 ? false : true
		},
		source () {
			const val = this.filterSettingMap.get(this.key);
			return val ? val : null;
		},
		listFilterIn () {
			if (this.usedForm === null) {

				return this.listFilter
			}else {
				console.log(this.listFilter);
				return this.listFilter.filter(item => this.usedForm[item.key] === undefined)
			}
		}
	},
	methods: {
		...mapActions([
			'setListFilter',
			'addListFilter',
			'removeListFilter',
			'fillListFilter',
			'editListFilter',
			'clearFilter',
			'setFilterType', //filter-cachef

			// 'getCustomFilter',
			// 'refreshCustomData', //menu-cache
		]),
		clearUsedFormField (key) {
			this.usedForm[key] = this.getDefaultValue(key)
		},
		clearTableFilter () {
			this.$refs.usedForm.resetFields();
			this.clearFilter(true);
		},
		init (type) {
			this.setFilterType(type);
			this.name = '';
			if(this.custom) {
				this.getCustomFilter({id: this.customId}).then(response => {
					const data = response.data;
					if(data.status && data.data[0]) {
						this.name = data.data[0]['name'];
						this.setListFilter(data.data[0]['serialize']);	
					}
				});
			}
		},
		async save () {
			if(!this.name) return this.$message({type: 'warning', message: '筛选器名称不能为空'});
			this.saveLoading = true;
			try {
				if(this.saveType == 'add') {
					await this.saveAdd();
				}else if(this.saveType == 'edit') {
					await this.editName();
				}
			}catch(e) {}
			this.saveLoading = false;
		},
		saveAdd () {
			const url = URL;
			const data = {
				name: this.name,
				model: this.type,
				serialize: this.listFilter,
			};
			const success = () => {
				this.$message({type: 'success', message: '新建筛选器成功'});
				this.saveVisible = false;
				this.refreshCustomData();
			};
			return this.$axiosPost({url, data, success});
		},
		editName () {
			const url = `${URL}/${this.customId}`;
			const data = {
				data: {
					name: this.name,
				}
			};
			const success = () => {
				this.$message({type: 'success', message: '重命名成功'});
				this.saveVisible = false;
				this.refreshCustomData();
			}
			return this.$axiosPut({url, data, success});
		},
		saveSerialize () {
			const url = `${URL}/${this.customId}`;
			const data = {
				data: {
					serialize: this.listFilter,
				}
			};
			const success = () => {
				this.$message({type: 'success', message: '保存筛选器成功'});
			}
			return this.$axiosPut({url, data, success});
		},
		deleteFilter () {
			const url = `${URL}/${this.customId}`;
			const success = () => {
				this.$message({type: 'success', message: '删除成功'});
				this.$router.push(listPathMap.get(this.type));
				this.refreshCustomData();
			}
			return this.$axiosDelete({url, success});
		},
		savePop (type) {
			this.saveType = type;
			this.saveVisible = true;
		},
		deletePop () {
			this.$confirm('此操作将永久删除该搜索项, 是否继续?', '提示', {
        type: 'warning'
      }).then(() => {
        this.deleteFilter();
      }).catch(() => {});
		},
		addClose () {
			this.name = '';
		},
		refreshTable () {
			this.refresh();
			this.handleVisible(false);
		},
		clear () {
			this.key = '';
			this.value = '';
			this.selectedKey = '';
		},
		edit (event, index) {
			const data = this.listFilter[index];
			const key = data.key;
			let value = data.value;
			const components =  this.filterSettingMap.get(key).components;
			
			//remote-select填充处理
			if(components == 'remote_select') {
				let label = data.label;
				if(Array.isArray(value)) {
					label = label.split('，');
					value = value.map((v, i) => ({id: v, name: label[i]}));
				}else {
					value = {id: value, name: label};
				}
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
			console.log(index);
			this.removeListFilter(index);
			// this.$nextTick(() => {
			// 	this.refresh();
			// })
		},
		handleVisible (val) {
			this.$emit('update:visible', val);
		},
		addPop () {
			this.dialogVisible = true;
		},
		confirm () {
			if(this.key == '') {
				this.$message({ type: 'warning', message: '筛选字段不能为空' });
				return; 
			}
			if(this.$refs.value.checkNull()) {
				this.$message({ type: 'warning', message: '筛选条件不能为空' });
				return;
			}

			const name = this.$refs.key.map.get(this.key).name;
			const key =  this.key;
			const label = this.$refs.value.getLabel();
			const value =  this.value;
			const item = { name, key, label, value };

			if(this.selectedKey) {
				this.editListFilter({key: this.selectedKey, item});
			}else {
				this.addListFilter(item);
			}

			this.dialogVisible = false;
			
			// this.$nextTick(() => {
			// 	this.refresh();
			// });
		},
		getDefaultValue (key) {
			const item = this.filterSettingMap.get(key)
			let val = null
			const multiple = item.multiple !== undefined ? item.multiple : true
			if (item.components == 'static_select' || item.components == 'remote_select') {
				val = multiple ? [] : ''
			} else if(item.components == 'date' ) {
				val = ['','']
			} else if(item.components == 'input') {
				val = ''
			}
			return val
		}
	},
	watch: {
		type (val) {
			this.init(val);
		},
		usedForm: {
			deep: true,
			handler (form) {
				console.log(form);
				window.setTimeout(() => {
					const obj = {}
					for (let key in form) {
						const map = this.filterSettingMap.get(key)
						const value = form[key]

						if (value === '' || value.length === 0 || (value.length === 2 && value[0] === '' && value[1] === '')) {
							obj[key] = false
						}else {
							const name = map['name']
							const str = 'usedForm_' + key
							const label = this.$refs[str][0].getLabel()
							obj[key] = { name, key, label, value }
						}
					}
					this.fillListFilter(obj)
				}, 0)
			}
		}
	},
	created () {
		if (this.usedFlag) {
			const obj = {}
			this.usedOptions.forEach(item => {
				let val = this.getDefaultValue(item.id)
				if (val !== null) {
					obj[item.id] = val;
				}
			})
			this.usedForm = obj	
		}
			
	},
	mounted () {
		this.init(this.type);
		if (this.usedFlag) {
			window.listFilter = this
		}
	},
	destroyed () {
		window.listFilter = null
	},
	components: {
		StaticSelect,
		Shrink,
		FilterValue,
	},

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

.filter-editor-operate {
	display: -webkit-flex;
  display: flex;
  margin-top: 20px;
  -webkit-flex: 0 0 auto;
  flex: 0 0 auto;
}

.filter-editor-operate-btn {
	-webkit-flex: 1;
  flex: 1;
    
}
</style>