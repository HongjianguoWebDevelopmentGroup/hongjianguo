<template>
<div class="main" :style="`height: ${innerHeight - 70}px`">
	<custom-form
		v-if="ifFormSource"
    ref="form"
		label-width="60px"     
    :model="form"  
    :post-data="postData"
    :extend="testFormCustom"
    @cancel="cancel">
		<app-collapse col-title="基本信息">
			<el-form-item v-if="testFormVisible['name']" prop="name" :label="testFormVisible['name']">
				<el-input v-model="form.name"></el-input>
			</el-form-item>
			<el-form-item v-if="testFormVisible['sex']" prop="sex" :label="testFormVisible['sex']">
				<el-switch
					v-model="form.sex"
					on-text="男"
					off-text="女"
					on-color="blue"
					off-color="red"
					on-value="1"
					off-value="0">
				</el-switch>
			</el-form-item>
			<el-form-item v-if="testFormVisible['job']" prop="job" :label="testFormVisible['job']">
				<el-select v-model="form.job">
					<el-option
					  v-for="item in options"
					  :key="item.id"
					  :label="item.name"
					  :value="item.id">
					</el-option>
				</el-select>
			</el-form-item>
		</app-collapse>
	</custom-form>
</div>
</template>

<script>
import CustomForm from '@/components/common/CustomForm'
import AppCollapse from '@/components/common/AppCollapse'
import {mapGetters} from 'vuex'
import {mapActions} from 'vuex'

export default {
	name: 'testForm',
	data () {
		return {
			form: {
				name: '',
				sex: '1',
				job: '',
			},
			options: [
			 {"id":"1","name":"程序员"},
			 {"id":"2","name":"设计师"},
			]
		};
	},
	computed: {
		...mapGetters([
			'testFormSource',
			'testFormVisible',
			'testFormCustom',
			'innerHeight',
		]),
		ifFormSource () {
			return this.testFormSource ? true : false;
		}
	},
	methods: {
		...mapActions([
			'getCustomFormSource',
		]),
		postData (form) {
			const success = () => {
				this.$refs.form.resetFields();
			};
			return this.$axiosPost({
				url: '/api/testF',
				data: form,
				success,
			})
		},
		cancel () {

		},
	},
	created () {
		this.getCustomFormSource({type: 'test'});
	},
	components: {
		CustomForm,
		AppCollapse,
	},
}
</script>