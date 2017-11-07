<template>
	<div class="main">
		<el-form :model="form" label-width="80px">
			<el-form-item label="商标名">
				<el-input v-model="form.name"></el-input>
			</el-form-item>
		</el-form>
	</div>
</template>
<script>
import {mapGetters} from 'vuex'

export default {
	name: 'trademarkAdd',
	props: {
		'pageType': {
			type: String,
			default: 'add',
		},
	},
	data () {
		return {
			form: {
				name: ''
			}
		}
	},
	computed: {
		...mapGetters([
			'detailBaseTrademark',
		])
	},
	created () {
		console.log(this.detailBaseTrademark);
	}
}
</script>