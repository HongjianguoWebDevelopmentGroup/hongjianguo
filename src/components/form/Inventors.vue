<template>
  <div class="main">
    <inventor v-for="(item, index) in value" :key="index" style="margin-bottom: 5px" :value="value[index]" @input="(val)=>{handleInput({val, index})}" is-delete @deleteInventor="handleDelete(index)" :disabled="disabled"></inventor>

    <el-row>
      <el-button type='text' @click="handleAdd">添加发明人</el-button>
      <!-- <slot name="addInventor"></slot> -->
    </el-row>
     <el-dialog title="添加发明人" :visible.sync="dialogVisible2" :modal="false">
        <el-form :model="inventorForm" ref="inventorForm">
          <el-form-item label="请选择发明人" prop="newValue" :rules="{type: 'number',required:true,message:'发明人不能为空',trigger: 'change'}">
            <remote-select  no-data-text="无数据, 请增加发明人" type="member" v-model="inventorForm.newValue" ref="member"></remote-select>
          </el-form-item>
            <p>如果系统中不存在该发明人，请<a href="#" @click="addPop">新增</a></p> 
            <el-button type="primary" @click="submitInventor('inventorForm')">确认</el-button>
        </el-form>
     </el-dialog>
     <pop-panel ref="pop" @refresh="tansmitData"></pop-panel>
  </div>
 
</template>

<script>
import Multiline from '@/mixins/multiline'
import Inventor from '@/components/form/Inventor'
import RemoteSelect from '@/components/form/RemoteSelect'
import PopPanel from '@/components/page_extension/InventorList_pop'
const shareMap = new Map([
  [1, [1]],
  [2, [1,1]],
  [3, [4,3,3]],
  [4, [1,1,1,1]],
  [5, [1,1,1,1,1]],
]);

export default {
  name: 'inventors',
  mixins: [ Multiline ],
  props: ['propType'],
  data () {
    return {
      dialogVisible2: false,
      inventorForm:{
        newValue: '',
      },
      inventors: '',
    }
  },
  methods: {
    handleAdd () {
      // const v = this.$tool.deepCopy(this.value);
      // v.push({share: '', id: ''});
      // this.handleShare(v);
      this.dialogVisible2 = true;
      // this.$emit('input', v);
      // this.$emit('addInventor');
    },
    addPop () {
      this.$refs.pop.show();
    },
    tansmitData(data){
      console.log('------------------')
      console.log(data);
      if(data[1] !== undefined) {
        // this.inventors = data[1];
        this.inventorForm.newValue = { 'id': data[1].id, 'name': data[1].name };
        // if(this.formData.inventors && this.formData.inventors.length != 0) {
        //     //复用组件内置的方法...
        //   this.$refs.inventors.handleShare(this.formData.inventors);
        // }
      }
    },
    submitInventor (formName) {
      this.$refs[formName].validate((_)=>{
        if(_){
         const id = this.$refs.member.getSelected()[0];
         const obj =  Object.assign(id,{share:''});
           // this.inventors.splice(this.inventors - 1,0,obj);
  /*        if(this.formData.inventors && this.formData.inventors.length != 0) {
                //复用组件内置的方法...
            this.$refs.inventors.handleShare(this.formData.inventors);
          }*/
          // console.log(this.inventors);
          this.$emit('inventors',obj);
          this.dialogVisible2 = false;
        }else{
           return false; 
        }
      })
    },    
    handleDelete (index) {
      const v = this.$tool.deepCopy(this.value);
      v.splice(index, 1);
      // this.handleShare(v);
      this.$emit('input', v);
      this.$emit('deleteInventor', index);
    },
    //自动生成发明人贡献率
    handleShare (v) {
      let l = v.length;
      if(l == 0) return v;
      let arr = shareMap.get(l);
      if(arr) {
        let total = 0;
        arr.forEach(_=>{total += _});
        const i = Number.parseInt(100/total);
        arr = arr.map(_=>i*_);
      }else {
        arr = [];
        const i = Number.parseInt(100/l);
        const remainder = 100%l;
        while(l--) {
          if(l == 0) {
            arr.unshift(i + remainder);
          }else {
            arr.unshift(i);
          }
        }
      }
      console.log(arr, v);
      v = v.map((_,i)=>{
        _.share = arr[i];
        return _;
      })
    },
    handleInput ({val, index}) {
      const copy = this.$tool.deepCopy(this.value);
      copy[index] = val;
      this.$emit('input', copy);
    }
  },
  components: { 
    Inventor,
    PopPanel,
    RemoteSelect,
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
