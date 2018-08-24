<template>
    <label class="ui-radio" :class="{'checked':model==value,'disabled':disabled, 'active': model==value&&!disabled}">
    <input type="radio" ref="radio" :value="value" @click="updateVal" :disabled="disabled">
    <span class="default">
     <slot></slot>
      <template v-if="!$slots.default">{{label}}</template>
    </span>
  </label>
</template>
<script>
 export default {
  name:'ui-radio',
  model: {//自定义 v-model的 prop和event,这个定义的意思就是使用change事件更新model的值,以此来实时更新v-model的值
    prop: 'model',
    event: 'change'
  },
  props:{
    value:{//radio的value属性
      type:[String,Number],
      require:true
    },
    model:{//这里的model指的是上面定义的v-model的prop
      type:[String,Number],
      require:true
    },
    label:{
      type:[String,Number]
    },
    checked:{//是否默认选中
      type:Boolean,
      default:false
    },
    disabled:{//是否禁用
      type:Boolean,
      default:false
    }
  },
  mounted:function(){//当dom渲染完成,判断组件是否默认选中
    if(this.checked===true)
      this.updateVal();
  },
  methods:{
    updateVal:function(){//当用户点击radio时,触发change事件更新v-model
      this.$emit('change',this.$refs.radio.value);
    }
  }
}
</script>
<style lang="scss" scoped>
  .ui-radio{
  width: auto;
  padding: 0 25px 0 0;
  height: 30px;
  line-height: 30px;
  border: 1px solid #4693fe;
  display: inline-block;
  position: relative;
  margin-right: 10px;
}
.ui-radio.disabled{
  border-color: #d1dbe5;
  background-color: #eef1f6;
  color:#bfcbd9;
}
.active {
  background: #4693fe;
  color: #fff;
}
.active::after{
 content: '\2713';
 position: absolute;
 right: 4px;
 bottom:0;
}
.ui-radio.disabled::after{
  background-color: #eef1f6;
  color:#bfcbd9;
}
.ui-radio.checked::after {
   opacity: 1;
   transform: scale(1);
}
.ui-radio input[type=radio]{
  opacity: 0;
  margin: 0;
}
.default {
  display: inline-block;
  height: 20px;

}
</style>
