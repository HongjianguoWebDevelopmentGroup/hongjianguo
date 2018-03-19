<template>
	<proposal @change="handleChange" ref="form" v-if="type == 'proposal'"></proposal>
	<patent @change="handleChange" ref="form" v-else-if="type == 'patent'"></patent>
</template>
<script>
import Proposal from '@/components/page_extension/Proposal_strainer_form'
import Patent from '@/components/page_extension/Patent_strainer_form'

const map = new Map([
	['proposal', {
		date: ['create_time'],
	}],
	['patent', {
		date: ['apd', 'create_time', 'public_date', 'issue_date'],
	}]
])
export default {
	name: 'strainerForm',
	props: {
		type: {
			type: String,
			required: true,
		}
	},
	data () {
		return {
			form: {},
		}
	},
	computed: {
		dateArr () {
			return map.get(this.type)['date'];
		}
	},
	methods: {
		clear () {
			if(this.$refs.form && this.$refs.form.clear) {
				this.$refs.form.clear();
			}
		},
		setForm (form) {
			if(this.$refs.form && this.$refs.form.setForm) {
				this.$refs.form.setForm(form);
			}
		},
		handleChange (val) {
			this.form = val;
		},
		getParameter (form) {
			form = form ? form : this.form;
			const copy = {};
			for (let k in form) {
				const d = form[k];
				if(d instanceof Array) {
					if(d.length != 0) {
						if(this.dateArr.indexOf(k) > -1) {
  							copy[k] = d.map(_=>{
  								return this.$tool.getDate(new Date(_));
  							}).join(",")
	  					}else {
	  						copy[k] = d.join(",")
	  					}	
					}
				}else{
					if(d != '' && d != undefined ) copy[k] = d;
				}
			}
			return copy;
		}
	},
	watch: {
		form (val) {
			this.$emit('change', this.getParameter(val));
		}
	},
	components: {
		Proposal,
		Patent,
	}
}
</script>