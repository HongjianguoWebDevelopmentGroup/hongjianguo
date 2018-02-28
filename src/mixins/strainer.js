import {mapMutations} from 'vuex' 
export default {
	props: ['value'],
	methods: {
		...mapMutations([
			'setViewLoading',
		]),
		search (form) {
			const copy = {};
			for (let k in form) {
				const d = form[k];
				if(d instanceof Array) {
					if(d[0] != undefined) {
						if(d[0] instanceof Date) {
  							copy[k] = d.map(_=>this.$tool.getDate(_)).join(",")
	  					}else {
	  						copy[k] = d.join(",")
	  					}	
					}
					
				}else if( d instanceof Date ){
					copy[k] = this.$tool.getDate(d);
				}else{
					if(d != '' && d != undefined ) copy[k] = d;
				}
			}
			this.$emit('input', copy);
			// this.setViewLoading({loading: true, text: '查询中...'});
			this.$emit('refresh');
		},
		clear (form_ref) {
			form_ref.resetFields();
			this.$emit('input', {});
			// this.setViewLoading({loading: true, text: '查询中...'});
			this.$emit('refresh');
		}
	}
} 