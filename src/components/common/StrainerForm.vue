<template>
	<proposal ref="form" v-if="type == 'proposal'"></proposal>
	<patent ref="form" v-else-if="type == 'patent'"></patent>
	<copyright ref="form" v-else-if="type == 'copyright'"></copyright>
	<task ref="form" v-else-if="type == 'task'"></task>
	<fee ref="form" v-else-if="type == 'income' || type == 'pay' "></fee>
	<invoice ref="form" v-else-if="type == 'invoice'"></invoice>
</template>
<script>
import Proposal from '@/components/page_extension/Proposal_strainer_form'
import Patent from '@/components/page_extension/Patent_strainer_form'
import Copyright from '@/components/page_extension/Copyright_strainer_form'
import Task from '@/components/page_extension/TaskCommon_strainer_form'
import Fee from '@/components/page_extension/FeeCommon_strainer_form'
import Invoice from '@/components/page_extension/InvoiceCommon_strainer_form'

import {strainers} from '@/const/reportConfig'

export default {
	name: 'strainerForm',
	props: {
		type: {
			type: String,
			required: true,
		}
	},
	data () {
		return {};
	},
	computed: {
		dateArr () {
			return strainers[this.type]['date'];
		},
		remoteArr () {
			return strainers[this.type]['remote'];
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
		getViewData (form) {
			form = form ? form : this.$refs.form.form;
			const copy = {};
			const dateArr = this.dateArr;
			for (let k in form) {
				const d = form[k];

				if(d == '' || d == undefined || d.length == 0) continue;

				if(d instanceof Array) {
					if(dateArr.indexOf(k) > -1) {
						copy[k] = d.map(_=>{
							return this.$tool.getDate(_);
						}).join(",");
					}else {
						copy[k] = d.join(",")
					}
				}else{
					copy[k] = d;
				}
			}
			return copy;
		},
		getSaveData (form) {
			form = form ? form : this.$tool.deepCopy(this.$refs.form.form);
			
			const copy = {};
			const dateArr = this.dateArr;
			const remoteArr = this.remoteArr;
			for (let k in form) {
				const d = form[k];

				if(d == '' || d == undefined || d.length == 0) continue;

				if(dateArr.indexOf(k) > -1) {
					copy[k] = d.map(_=>{
						return this.$tool.getDate(new Date(_));
					})
				}else if(remoteArr.indexOf(k) > -1) {
					if(d instanceof Array) {
						copy[k] = this.$refs.form.$refs[k].getSelected();
					}else if(d != '') {
						copy[k] = this.$refs.form.$refs[k].getSelected()[0];
					}
				}else {
					copy[k] = d;
				}
			}

			return copy;
		}
	},
	components: {
		Proposal,
		Patent,
		Copyright,
		Task,
		Fee,
		Invoice,
	}
}
</script>