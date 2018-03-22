<template>
	<proposal ref="form" v-if="type == 'proposal'"></proposal>
	<patent ref="form" v-else-if="type == 'patent'"></patent>
	<trademark ref="form" v-else-if="type == 'trademark'"></trademark>
	<copyright ref="form" v-else-if="type == 'copyright'"></copyright>
	<task ref="form" v-else-if="type == 'task_pending' || type == 'task_finish' || type == 'task_pause'"></task>
	<fee ref="form" v-else-if="type == 'fee_income' || type == 'fee_pay' "></fee>
	<invoice ref="form" v-else-if="type == 'fee_bill' || type == 'fee_payment'"></invoice>
</template>
<script>
import Proposal from '@/components/page_extension/Proposal_strainer_form'
import Patent from '@/components/page_extension/Patent_strainer_form'
import Trademark from '@/components/page_extension/Trademark_strainer_form'
import Copyright from '@/components/page_extension/Copyright_strainer_form'
import Task from '@/components/page_extension/TaskCommon_strainer_form'
import Fee from '@/components/page_extension/FeeCommon_strainer_form'
import Invoice from '@/components/page_extension/InvoiceCommon_strainer_form'

const taskMap = {
	date: ['apd', 'end_time', 'due_time', 'inner_deadline', 'deadline'],
	remote: ['agency', 'agent', 'person_in_charge'],
};

const feeMap = {
	date: ['mail_date', 'pay_time', 'create_time', 'due_time', 'deadline', 'apd'],
	remote: ['target'],
};

const invoiceMap = {
	date: ['pay_time', 'create_time', 'due_time'],
	remote: ['target'],
};

const map = new Map([
	['proposal', {
		date: ['create_time'],
		remote: ['inventors', 'proposer'],
	}],
	['patent', {
		date: ['apd', 'create_time', 'public_date', 'issue_date'],
		remote: ['agency', 'agent', 'proposer', 'applicants', 'inventors'],
	}],
	['trademark', {
		date: ['apd', 'public_date', 'issue_date', 'expiring_date'],
		remote: ['applicants'],
	}],
	['copyright', {
		date: ['apd', 'issue_date'],
		remote: ['proposer', 'applicant', 'agent', 'agency'],
	}],
	['task_pending', taskMap],
	['task_finish',  taskMap],
	['task_pause',   taskMap],
	['fee_income',   feeMap],
	['fee_pay',      feeMap],
	['fee_bill',     invoiceMap],
	['fee_payment',  invoiceMap],
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
		return {};
	},
	computed: {
		dateArr () {
			return map.get(this.type)['date'];
		},
		remoteArr () {
			return map.get(this.type)['remote'];
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
		Trademark,
		Copyright,
		Task,
		Fee,
		Invoice,
	}
}
</script>