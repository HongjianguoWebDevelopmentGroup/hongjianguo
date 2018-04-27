<template>

	<el-input
		v-if="type === 'input'"
		:placeholder="placeholder" 
		:value="value" 
		@input="handleInput">
	</el-input>

	<static-select
		v-else-if="type === 'select'"
		:type="selectType" 
		:value="value" 
		@input="handleInput">
	</static-select>

	<el-date-picker
		v-else-if="type === 'date'"
		:placeholder="placeholder"
		:value="value" 
		@input="handleInput">
	</el-date-picker>

	<el-input
		v-else-if="type === 'textarea'"
		:placeholder="placeholder" 
		:value="value" 
		@input="handleInput" 
		type="textarea">
	</el-input>

	<el-switch
		v-else-if="type === 'switch'"
  	on-color="#13ce66"
  	off-color="#ff4949"
  	on-text="是"
  	off-text="否"
  	:on-value="1"
  	:off-value="0"
  	:value="value"
  	@input="handleInput">
	</el-switch>

	<span v-else></span>

</template>

<script>
import StaticSelect from '@/components/form/StaticSelect'
export default {
	props: {
		type: {
			type: String,
			required: true,	
		},
		value: {
			type: null,
			required: true,
		},
		placeholder: {
			type: String,
			default: '',
		},
		options: {
			type: [Array, String],
			default: '',
		}
	},
	computed: {
		selectType () {
			if(this.type != 'select') return '';

			const options = this.options && this.options instanceof Array ? this.options : []; 
			const placeholder = this.placeholder; 
			//由于校验插件(async-validator)只支持校验一种类型
			//所以强制将所有select的值都转为string类型
			return {
				placeholder,
				options: options.map(v => ({id: v.id + '', name: v.name})),
			};
		}
	},
	methods: {
		handleInput (val) {
			this.$emit('input', val);
		}
	},
	components: {
		StaticSelect,
	}
}
</script>