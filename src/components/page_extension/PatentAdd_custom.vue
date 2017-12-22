<template>
  <app-collapse col-title="自定义字段">
  	<!-- <el-form>
		<el-row>
			<el-col :span="24">
				<el-button>单行文本</el-button>
				<el-button>多行文本</el-button>
				<el-button>日期控件</el-button>
			</el-col>
		</el-row>
    </el-form> -->
    <el-form>
      <el-form-item >
    	<el-row :gutter="10">
    		<el-col :span="4"><el-input placeholder="请填写自定义字段名"></el-input></el-col>
    		<el-col :span="20"><el-input placeholder="请填写相关内容"></el-input></el-col>
    	</el-row>
      </el-form-item>
      <el-form-item >
    	<el-row :gutter="10">
    		<el-col :span="4"><el-input placeholder="请填写自定义字段名"></el-input></el-col>
    		<el-col :span="20"><el-input placeholder="请填写相关内容"></el-input></el-col>
    	</el-row>
      </el-form-item>	
      <el-form-item >
    	<el-row :gutter="10">
    		<el-col :span="4"><el-input placeholder="请填写自定义字段名"></el-input></el-col>
    		<el-col :span="20"><el-input placeholder="请填写相关内容"></el-input></el-col>
    	</el-row>
      </el-form-item>		
    </el-form>
  </app-collapse>
</template>
<script>
import AppCollapse from '@/components/common/AppCollapse'
export default {
  name: 'patentAddCustom',
  props:['type'],
  data() {
	return {

    }
  },
  methods: {

  },
  components:{AppCollapse}
}
</script>
<style scoped lang="scss">
.el-row {
    margin-bottom: 20px; 
    &:last-child {
      margin-bottom: 0;
    }
  }
</style>