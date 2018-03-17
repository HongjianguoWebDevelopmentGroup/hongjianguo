<template>
<div>
	<el-form label-position="top">
		<el-form-item label="字段控制" prop="field_control">
			<el-input :value="fieldShow" readonly @focus="dialogControl = true"></el-input>
		</el-form-item>
		<el-form-item label="表格行数据" prop="row">
			
			<static-select :type="reportType == 'line' ? selectTypeDate : selectType" v-model="form.row" :multiple="multiple" :multiple-limit="2"></static-select>
			
			<static-select type="cycle" style="margin-top: 10px;" v-model="form.date_type" v-if="reportType == 'line'"></static-select>
		
		</el-form-item>
		<el-form-item label="表格列数据" prop="column" v-if="reportType != 'pie'">
			<static-select :type="selectType" v-model="form.column" :multiple="multiple" :multiple-limit="2"></static-select>
		</el-form-item>
	</el-form>
	<div style="font-size: 14px;color: #48576a;"><span>筛选条件</span>(<el-button type="text" @click="form.filter = {}; $refs.strainer.clear();">清空</el-button>)</div>
	<strainer-form style="padding-left: 20px; padding-top: 10px;" :type="tableType" ref="strainer" @change="handleStrainerChange"></strainer-form>
	
	<el-dialog class="dialog-control" :visible.sync="dialogControl" title="字段控制" @close="$refs.transfer.clear();">
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

const map = new Map([
	['proposal', {
		'url': '/api/proposals'
	}],
]);

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
				filter: {},
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
		config () {
			return map.get(this.tableType);
		},
		multiple () {
			return this.reportType == 'view';
		},
		option () {
			return this.tableColumnsCache[this.tableType];
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
		setForm (row) {
			
		}
	},
	methods: {
		handleStrainerChange (val) {
			this.form.filter = val;
		},
		check () {
			const t = this.reportType;
			if(this.form.fields == '') {
				return '请至少选择一个字段';
			}
			if(this.form.row == '') {
				return '行数据不能为空';
			}

			if(t == 'pie') {

			}else if(t == 'line' || t == 'bar') {
				if(this.form.row == this.form.column) {
					return '行数据与列数据不可重复';
				}
				if(t == 'line' && !this.form.date_type) {
					return '请选择行数据周期';
				}
			}else if(t == 'view') {
				const arr = [...this.form.row, ...this.form.column];
				if(arr.length != new Set(arr).size) {
					return '行数据与列数据不可重复';
				}
			}
		}
	},
	created () {
		//根据类型修改存储类型
		if(this.multiple) {
			this.form.row = [];
			this.form.column = [];
		}

		this.transferValue.splice(1, 1, this.option.map(_=>({label: _.name, value: _.id})));
	},
	watch: {
		transferValue (val) {
			this.form.fields = val[1].map(_=>_.value).join(',');
			this.fieldShow = val[1].map(_=>_.label).join(',');
		}
	},
	components: {
		StaticSelect,
		AppTransfer,
		StrainerForm,
	}
}
</script>