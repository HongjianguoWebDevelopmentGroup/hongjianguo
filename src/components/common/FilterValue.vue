<template>
<div>
	<span v-if="type == ''" class="form-description">请选择需要筛选的属性</span>
	
	<keep-alive>
	
		<span v-if="type == ''"></span>

		<static-select 
			v-else-if="type == 'static_select'" 
			ref="select"
			:type="selectType"
			:multiple="multiple"
			:value="value"
			@input="handleInput">
		</static-select>

		<remote-select 
			v-else-if="type == 'remote_select'" 
			ref="select"
			:key="selectType"
			:type="selectType"
			:multiple="multiple"
			:value="value"
			@input="handleInput">
		</remote-select>
		
		<app-date 
			ref="date"
			v-else-if="type == 'date'"
			:value="value"
			@input="handleInput">
		</app-date>

	</keep-alive>
</div>

</template>
<script>
import StaticSelect from '@/components/form/StaticSelect'
import RemoteSelect from '@/components/form/RemoteSelect'
import AppDate from '@/components/common/AppDate'

const typeMap = new Map([
 ]) 

export default {
	name: 'filterValue',
	props: {
		source: {
			type: Object,
			default () {
				return null;
			}
		},
		value: {
			type: [String, Number, Date, Array],
			required: true,
		}
	},
	data () {
		return {};
	},
	computed: {
		type () {
			const source = this.source;
			return source && source.components ? source.components : ''; 
		},
		multiple () {
			const source = this.source;
			return source && source.multiple ? source.multiple : true; 
		},
		selectType () {
			const source = this.source;
			return source && source.type ? source.type : '';
		}
	},
	methods: {
		initialValue () {
			let val = null;
			if(this.type == 'static_select' || this.type == 'remote_select' || this.type == 'product') {
				val = this.multiple ? [] : '';
			}else if(this.type == 'date' ) {
				val = ['',''];
			}
			if (val !== null) {
				this.handleInput(val);
			}
		},
		checkNull () {
			const t = this.type;

			if(t == 'static_select' || t == 'remote_select') {
				return this.multiple ? this.value.length == 0 : this.value === ''; 
			}

			if(t == 'date') {
				return this.value.length != 2 || (!this.value[0] && !this.value[1]);
			}
		},
		handleInput (val) {
			this.$emit('input', val);
		},
		getLabel () {
			const t = this.type;
			
			if(t == 'static_select' || t == 'remote_select') {
				return this.$refs.select.getSelected().map(v => v.name).join('，');
			}
			
			if(t == 'date') {
				return this.$refs.date.getLabel();
			}
		}
	},
	created () {
		this.initialValue();
	},
	watch: {
		source () {
			this.initialValue();
		}
	},
	components: {
		StaticSelect,
		RemoteSelect,
		AppDate,	
	}
}
</script>