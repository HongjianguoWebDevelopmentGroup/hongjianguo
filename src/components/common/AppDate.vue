<template>
<div>
	<el-select :value="dateType" @input="handleTypeInput">
		<el-option
			v-for="item in options"
			:key="item.value"
			:value="item.value" 
			:label="item.label">
		</el-option>
	</el-select>
	<keep-alive>
		<el-date-picker style="width: 100%" key="date" :value="dateValue" type="date" @input="handleInput" v-if="isDate"></el-date-picker>
		<el-date-picker style="width: 100%" key="daterange" :value="dateValue" type="daterange" @input="handleInput" v-else></el-date-picker>
	</keep-alive>
</div>	
</template>
<script>
export default {
	name: 'appDate',
	props: {
		value: {
			type: Array,
			required: true,
		}
	},
	data () {
		return {
			dateType: '',
			options: [
				{ value: 'equal', label: '特定日期' },
				{ value: 'greater', label: '晚于选择的日期' },
				{ value: 'less', label: '早于选择的日期' },
				{ value: 'range', label: '日期范围' },
			],
			dateValue: '',
			noRefresh: false,
			noInput: false,
		};
	},
	methods: {
		refreshValue () {
			if(this.noRefresh) return;

			const v = this.value;
			const v1 = v[0];
			const v2 = v[1];

			this.inRefresh = true;
			if(!v1 && !v2) {
				this.dateType = 'equal';
				this.dateValue = '';
			}else if(v1 && !v2) {
				this.dateType = 'greater';
				this.dateValue = v1;
			}else if(!v1 && v2) {
				this.dateType = 'less';
				this.dateValue = v2;
			}else if(v1 && v2) {
				const str1 = this.$tool.getDate(v1);
				const str2 = this.$tool.getDate(v2);
	
				if(str1 == str2) {
					this.dateType = 'equal';
					this.dateValue = v1;
				}else {
					this.dateType = 'range';
					this.dateValue = v;
				}
			}
		},
		handleTypeInput (val) {
			if(this.dateType != val) {
				this.dateType = val;
				
				this.noRefresh = true;
				this.noInput = true;
				this.$emit('input', ['', '']);
				this.dateValue = '';
				this.$nextTick(() => {
					this.noRefresh = false;
					this.noInput = false;
				})	
			}
		},
		handleInput (val) {
			if(this.noInput) return;
			this.dateValue = val;

			this.noRefresh = true;
			const type = this.dateType;
			if(type == 'equal') {
				this.$emit('input', [val, val]);
			}else if(type == 'greater') {
				this.$emit('input', [val, '']);
			}else if(type == 'less') {
				this.$emit('input', ['', val]);
			}else if(type == 'range') {
				this.$emit('input', val);
			}
			this.$nextTick(() => {
				this.noRefresh = false;
			})
		},
		getLabel () {
			let str1 = this.options.filter(v => v.value == this.dateType)[0]['label'];
			let str2 = '';
			let value = Array.isArray(this.dateValue) ? this.dateValue : [this.dateValue];
			value = value.map(v => this.$tool.getDate(v));
			str2 = value.join(' - ');

			if(value.length == 2 && value[0] == value[1]) {
				str1 = '等于';
				str2 = value[0];
			}

			return `${str1}：${str2}`;
		}
	},
	watch: {
		value () {
			this.refreshValue();
		},
	},
	created () {
		this.refreshValue();
	},
	computed: {
		isDate () {
			return {
				equal: true,
				greater: true,
				less: true,
				range: false,
			}[this.dateType];
		}
	}
}
</script>