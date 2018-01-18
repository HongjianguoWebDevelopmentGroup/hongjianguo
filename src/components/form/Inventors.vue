<template>
  <div>
    <inventor v-for="(item, index) in value" :key="index" style="margin-bottom: 5px" :value="value[index]" @input="(val)=>{handleInput({val, index})}" is-delete @deleteInventor="handleDelete(index)" :disabled="disabled"></inventor>

    <el-row>
      <el-button type='primary' @click="handleAdd" v-if="!disabled" icon="plus" size="mini"></el-button>
      <slot name="addInventor"></slot>
    </el-row>
  </div>
</template>

<script>
import Multiline from '@/mixins/multiline'
import Inventor from '@/components/form/Inventor'

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
  methods: {
    handleAdd () {
      const v = this.$tool.deepCopy(this.value);
      v.push({share: '', id: ''});
      this.handleShare(v);
      this.$emit('input', v);
      this.$emit('addInventor');
    },
    handleDelete (index) {
      const v = this.$tool.deepCopy(this.value);
      v.splice(index, 1);
      this.handleShare(v);
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
      v.forEach((_,i)=>{
        _.share = arr[i];
      })
    },
    handleInput ({val, index}) {
      const copy = this.$tool.deepCopy(this.value);
      copy[index] = val;
      this.$emit('input', copy);
    }
  },
  components: { Inventor }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
