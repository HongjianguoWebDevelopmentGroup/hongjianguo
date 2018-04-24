<template>
	<el-dialog :visible.sync="dialogVisible" :title="title" class="dialog-small">
		<el-form ref="form" :model="form">	
			<el-form-item label="部门名称" prop="name" :rules="{required: true, message: '部门名称不能为空'}">
				<el-input v-model="form.name" placeholder="请填写部门名称"></el-input>
			</el-form-item>
			<el-form-item label="部门描述" prop="description">
				<el-input v-model="form.description" type="textarea" placeholder="请填写部门描述"></el-input>
			</el-form-item>
			<el-form-item label="部门默认IPR" prop="ipr">
				<static-select type="ipr" v-model="form.ipr"></static-select>
			</el-form-item>
			<el-form-item label="拥有查看权限" prop="board">
				<remote-select type="inventor" v-model="form.board" multiple></remote-select>
			</el-form-item>
			<el-form-item label="父部门" prop="parent">
				<branch v-model="form.parent" placeholder="请选择当前新增部门挂载的父部门节点"></branch>
			</el-form-item>
			<el-form-item style="margin-bottom: 0px;">
				<el-button v-if="type == 'add'" type="primary" :disabled="btn_disabled" @click="add">添加</el-button>
				<el-button v-if="type == 'edit'" type="primary" :disabled="btn_disabled" @click="edit">编辑</el-button>
			</el-form-item>
		</el-form>
	</el-dialog>
</template>

<script>
import PopMixins from '@/mixins/pop-mixins'
import StaticSelect from '@/components/form/StaticSelect'
import RemoteSelect from '@/components/form/RemoteSelect'
import Branch from '@/components/form/Branch'
export default {
	URL: '/api/branches',
	REMINDER_TEXT: '部门',
	name: 'branchPop',
	mixins: [PopMixins],
	props: ['currentId'],
	data () {
		return {
			form: {
				name: '',
				description: '',
				ipr: '',
				board: [],
				parent: '',
			}
		}
	},
	methods: {
		addForm () {
			if(!this.form.parent) {
				this.form.parent = 0;
			}
			return this.form;
		}
	},
	components: {
		StaticSelect,
		RemoteSelect,
		Branch,
	}
}	
</script>
