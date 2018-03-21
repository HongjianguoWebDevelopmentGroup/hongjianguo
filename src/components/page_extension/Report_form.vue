<template>
<div>
	<el-form label-position="top">
		<el-form-item label="字段控制" prop="field_control">
			<el-input :value="fieldShow" readonly @focus="dialogControl = true"></el-input>
		</el-form-item>
		<el-form-item label="行标签" prop="row">
			
			<static-select :key="`${reportType}-row`" :type="reportType == 'line' ? selectTypeDate : selectType" v-model="form.row" :multiple="multiple" :multiple-limit="2"></static-select>
		
		</el-form-item>
		<el-form-item label="列标签" prop="column" v-if="reportType != 'pie'">
			<static-select :key="`${reportType}-column`" :type="selectType" v-model="form.column" :multiple="multiple" :multiple-limit="2"></static-select>
		</el-form-item>
		<el-form-item label="日期类型" prop="date_type" v-show="ifDate">
			<static-select type="cycle" v-model="form.date_type"></static-select>
		</el-form-item>
	</el-form>
	<div style="font-size: 14px;color: #48576a;"><span>筛选条件</span>(<el-button type="text" @click="$refs.strainer.clear();">清空</el-button>)</div>
	<strainer-form style="padding-left: 20px; padding-top: 10px;" :type="tableType" ref="strainer"></strainer-form>
	
	<el-dialog class="dialog-control" :visible.sync="dialogControl" title="字段控制" @close="$refs.transfer.clear();" :modal="false">
    <div style="margin-bottom: 10px;padding-left: 50px;color: rgb(132, 146, 166);">提示：可拖动字段调整顺序</div>
    <app-transfer ref="transfer" title1="未显示" title2="已显示" placeholder="查询字段..." v-model="transferValue" style="text-align: center;"></app-transfer>
  </el-dialog>

</div>
</template>
<script>

import StaticSelect from '@/components/form/StaticSelect'
import AppTransfer from '@/components/common/AppTransfer'
import StrainerForm from '@/components/common/StrainerForm'

import {mapGetters} from 'vuex'

export default {
	name: 'reportForm',
	props: {
		reportType: {
			type: String,
			required: true,
		},
		tableType: {
			type: String,
			required: true,
		}
	},
	data () {
		return {
			form: {
				fields: '',
				row: '',
				column: '',
				date_type: '',
			},
			fileterShow: '',
			fieldShow: '',
			dialogControl: false,
			transferValue: [[],[]],
		}
	},
	computed: {
		...mapGetters([
			'tableColumnsCache'
		]),
		multiple () {
			return this.reportType == 'view';
		},
		option () {
			return this.tableColumnsCache[this.tableType];
		},
		optionMap () {
			const map = new Map();
			this.option.forEach(_=>{
				map.set(_.id, _);
			});

			return map;
		},
		selectType () {
			return {
				placeholder: '请选择列表项',
				options: this.option,
			};
		},
		selectTypeDate () {
			return {
				placeholder: '请选择列表项',
				options: this.option.filter(_=>_.date),
			};
		},
		allOps () {
			const r = this.form.row instanceof Array ? this.form.row : this.form.row == '' ? [] : [this.form.row];
			const c = this.form.column instanceof Array ? this.form.column : this.form.column == '' ? [] : [this.form.column];
			
			return [...r, ...c];
		},
		ifDate () {
			const a = this.allOps;
			const l = a.length;
			for(let i = 0; i < l; i++) {
				if(this.optionMap.get(a[i]).date) return true;
			}
			return false;
		}
	},
	methods: {
		setForm (form) {

			const f = this.$tool.deepCopy(form);
			if(this.multiple) {
				f.row = f.row.split(',');
				f.column = f.column.split(',');
			}

			this.$tool.coverObj(this.form, f, {skip: ['fields']});

			//字段控制处理
			const fields = f.fields.split(',');
			const fields2 = [];
			const arr1 = fields.map(_=>{
				const item = this.optionMap.get(_);
				return {label: item.name, value: item.id};
			});
			const arr2 = this.option.filter(_=>{
				return fields.indexOf(_.id) <= -1;
			}).map(_=>({ label: _.name, value: _.id })); 
			this.transferValue.splice(0, 1, arr2);
			this.transferValue.splice(1, 1, arr1);

			//筛选处理
			this.$refs.strainer.setForm(f.filter.length == 0 ? {} : f.filter);
		},
		check () {
			const t = this.reportType;
			if(this.form.fields == '') {
				return '请至少选择一个字段';
			}
			if(this.form.row == '') {
				return '行数据不能为空';
			}
			if(this.ifDate && !this.form.date_type) {
				return '请选择日期类型';
			}
			if(t == 'pie') {

			}else if(t == 'line' || t == 'bar') {
				if(this.form.row == this.form.column) {
					return '行数据与列数据不可重复';
				}
			}else if(t == 'view') {
				const arr = [...this.form.row, ...this.form.column];
				if(arr.length != new Set(arr).size) {
					return '行数据与列数据不可重复';
				}
			}
		},
		//获取Form数据 一种用于生成视图 一种用于存储(主要区别在于filter的数据)
		getFormData (type = 'view') {

			if(type == 'view') {
				const o = this.$tool.shallowCopy(this.form);
				o.filter = this.$refs.strainer.getViewData();
				return o;
			}

			if(type == 'save') {
				const o = this.$tool.shallowCopy(this.form);
				o.filter = this.$refs.strainer.getSaveData();
				return o;
			}

		}
	},
	created () {
		//根据类型修改存储类型
		if(this.multiple) {
			this.form.row = [];
			this.form.column = [];
		}

		//若transferValue值不存在 则初始化
		if(this.transferValue[0].length == 0 && this.transferValue[1].length == 0) {
			this.transferValue.splice(1, 1, this.option.map(_=>({label: _.name, value: _.id})));
		}
	},
	watch: {
		transferValue (val) {
			this.form.fields = val[1].map(_=>_.value).join(',');
			this.fieldShow = val[1].map(_=>_.label).join(',');
		},
		ifDate (val) {
			if(val == false) {
				this.form.date_type = '';
			}
		}
	},
	components: {
		StaticSelect,
		AppTransfer,
		StrainerForm,
	}
}
</script>