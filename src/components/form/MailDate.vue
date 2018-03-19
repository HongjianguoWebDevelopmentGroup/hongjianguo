<template>
<el-cascader :options="options" expand-trigger="hover" :value="value" @input="handleInput"></el-cascader>
</template>
<script>
export default {
	name: 'mailDate',
  props: ['value'],
  data() {
  	const month = [
  		{ label: '月初', value: 'early' },
  		{ label: '月中', value: 'mid' },
  		{ label: '月末', value: 'end' },
  	]
    return {
      options: [
      	{
      		label: '每天',
      		value: 'everyday',
      	},
      	{
      		label: '每个工作日',
      		value: 'every_working_day',
      	},
      	{
      		label: '每周',
      		value: 'every_week',
      		children: [
      			{ label: '周一', value: 'monday' },
      			{ label: '周二', value: 'tuesday' },
      			{ label: '周三', value: 'wednesday' },
      			{ label: '周四', value: 'thursday' },
      			{ label: '周五', value: 'friday' },
      			{ label: '周六', value: 'saturday' },
      			{ label: '周天', value: 'sunday' },
      		]
      	},
      	{
      		label: '每月',
      		value: 'every_month',
      		children: month,
      	},
      	{
      		label: '每年',
      		value: 'every_year',
      		children: [
      			{ label: '一月',   value: 'january', children: month },
      			{ label: '二月',   value: 'february', children: month },
      			{ label: '三月',   value: 'march', children: month },
      			{ label: '四月',   value: 'april', children: month },
      			{ label: '五月',   value: 'may', children: month },
      			{ label: '六月',   value: 'june', children: month },
      			{ label: '七月',   value: 'july', children: month },
      			{ label: '八月',   value: 'august', children: month },
      			{ label: '九月',   value: 'september', children: month },
      			{ label: '十月',   value: 'october', children: month },
      			{ label: '十一月', value: 'november', children: month },
      			{ label: '十二月', value: 'december', children: month },
      		]
      	}
      ],
    };
  },
  methods: {
  	handleInput (val) {
  		this.$emit('input', val);
  	} 
  }
}
</script>