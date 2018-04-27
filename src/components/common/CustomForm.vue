<template>
<div style="height: 100%;display: flex;flex-direction: column;">
	<div style="overflow-y: auto;overflow-x: hidden;flex: 1;">
		
			<!--
				这里选择将固定表单和自定义表单分开 是为了使用element内置的校验和清空方法 
				若合为一个表单 由于form是分离的 清空表单方法会失效 校验方法可能也会出现问题
				所以选择分开处理
			-->
			<div>
				
				<el-form :model="model" :label-width="labelWidth" :rules="rules" ref="fixedForm">		
					<slot></slot>
				</el-form>

				<template v-if="!!extend">

					<el-form :model="form" :label-width="labelWidth" ref="customForm">
						<el-form-item v-for="item in extendIn['']" :prop="item.prop" :label="item.label" :key="item.prop" :rules="item.rules">
							<custom-form-component :type="item.type" :placeholder="item.placeholder" :options="item.options" v-model="form[item.prop]" :key="item.prop"></custom-form-component>
						</el-form-item>

						<app-collapse v-for="(v, k) in extendIn" v-if="k != ''" :colTitle="k" :key="k">
								<el-form-item v-for="item in v" :prop="item.prop" :label="item.label" :key="item.prop" :rules="item.rules">
									<custom-form-component :type="item.type" :placeholder="item.placeholder" :options="item.options" v-model="form[item.prop]" :key="item.prop"></custom-form-component>
								</el-form-item>
						</app-collapse>

					</el-form>

				</template>

			</div>
			
		</el-form>
	</div>
	<div style="flex-shrink: 0;height: 60px;line-height: 60px;border-top: solid 1px #dedede;text-align: right;">
		<el-button @click="save" type="primary" :loading="loading">{{ loading ? '保存中...' : '保存' }}</el-button>
		<el-button @click="cancel" type="danger">取消</el-button>
		<el-button @click="resetFields">清空</el-button>
	</div>
</div>
</template>

<script>
import AppCollapse from '@/components/common/AppCollapse'
import CustomFormComponent from '@/components/common/CustomFormComponent'
import {mapGetters} from 'vuex'

const typeMap = new Map([
	['1', {
		key: 'input',
		value: '',
	}],
	['2', {
		key: 'select',
		value: '',
	}],
	['3', {
		key: 'date',
		value: '',
	}],
	['4', {
		key: 'textarea',
		value: '',
	}],
	['5', {
		key: 'switch',
		value: 0,
	}],
]);
const validateType = new Map([
	['input', {
		type: 'string',
		trigger: 'blur',
	}],
	['textarea', {
		type: 'string',
		trigger: 'blur',
	}],
	['select', {
		type: 'string',
		trigger: 'change',
	}],
	['date', {
		type: 'date',
		trigger: 'change',
	}],
	['switch', {
		type: 'number',
		trigger: 'change',
	}]
])
const validateMesg = new Map([
	['require', {
		message: '该字段不能为空',
		required: true,
	}]
]);
const FORM_ERROR_MESG = '请正确填写表单字段';

export default {
	name: 'custonForm',
	data () {
		return {
			form: {},
			loading: false,
		};
	},
	props: {
		extend: {
			type: Object,
			default () {
				return null;
			}
		},
		model: {
			type: Object,
			default () {
				return {};
			},
		},
		labelWidth: {
			type: String,
			default: '',
		},
		rules: {
			type: Object,
			default () {
				return {};
			}
		},
		postData: {
			type: Function,
			default () {
				return new Promise((resolve)=>{ 
					resolve(); 
				});
			}
		}
	},
	computed: {
		...mapGetters([
			'innerHeight',
		]),
		//el-form 组件本身使用的对象的引用特性去修改值 所以这里要保留引用
		extendIn () {
			const copy = this.$tool.deepCopy(this.extend);
			for(let k in copy) {
				copy[k].forEach(v => {
					const validate_key = 'validate';
					const validate_str = v[validate_key];
					const arr = validate_str ? validate_str.split('|') : [];
					const type = typeMap.get(v['type']);
					v['rules'] = arr.map(item => {
						return Object.assign({}, validateType.get(v.type), validateMesg.get(item));
					});
					v['type'] = type ? type['key'] : ''; 
				})
			}
			// console.log(copy);
			return copy;
		},
		extendMap () {
			const extend = this.extendIn; 
			const arr = [];
			for(let k in extend) {
				arr.push(...extend[k]);
			}
			return arr;
		}
	},
	methods: {
		async save () {
			const boolean = await this.checkForm();
			if(boolean) {
				this.loading = true;
				try {
					const form = this.$tool.shallowCopy(Object.assign({}, this.model, this.form), {date: true});

					await this.postData(form);
				}catch (e) {
					console.log(e);
				}
				this.loading = false;
				
			}else {
				this.$message({type: 'warning', message: FORM_ERROR_MESG});
			}
		},
		cancel () {
			this.$emit('cancel');
		},
		checkForm () {
			return new Promise(resolve => {
				this.validate(resolve);
			})
		},
		generateForm () {
			const e = this.extend;
			const form = {};
			for(let k in e) {
				e[k].forEach(v => {
					const type = typeMap.get(v.type);
					form[v.prop] = type ? type['value'] : '';
				})
			}
			console.log('------------form--------');
			console.log(form);
			console.log('------------form--------');
			
			this.form = form;
		},
		//清空表单
		resetFields () {
			this.$refs.fixedForm.resetFields();
			if(this.$refs.customForm) {
				this.$refs.customForm.resetFields();
			}
		},
		//校验表单
		validate (callback) {
			this.$refs.fixedForm.validate(fiexedBoolean => {
				if(this.$refs.customForm) {
					this.$refs.customForm.validate(customBoolean => {
						callback(fiexedBoolean && customBoolean);
					});
				}else {
					callback(fiexedBoolean);
				}
			});
		},
		//校验单个字段(只对固定表单字段生效)
		validateField (prop, callback) {
			this.$refs.fixedForm.validateField(prop, callback);
		},
		//填充表单自定义部分 固有表单部分填充逻辑 由父组件定义 
		//原因是固定表单的填充逻辑会比自定义表单复杂 同时固定表单的form并不存放于当前组件
		fillCustomForm (form) {
			const f = this.form;
			const map = this.extendMap;
			for(let k in f) {
				if(form[k] == undefined) continue;
				const option = extendMap.get(k);
				option.type === 'date' ? f[k] = new Date(form[k]) : f[k] = form[k]; 
			}
		}
	},
	created () {
		this.generateForm();
	},
	watch: {
		extend (val) {
			this.generateForm();
		}
	},
	components: {
		AppCollapse,
		CustomFormComponent,
	}
}
</script>