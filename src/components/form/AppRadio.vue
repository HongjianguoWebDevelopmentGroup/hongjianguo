<template>
  <div>
    <input type="radio" value="复审"  @change="handleInput($event)"/>复审
  </div>
</template>

<script>

export default {
  name: 'appRadio',
  // model: {
  // 	prop: 'checked',
  // 	event: 'change'
  // },
  props: {
  	'checked':{
  	'type': [Boolean, String, Number],
  	default(){
  		return true
  	},
  	'value': String,
  },
  	'datas':{
  		type: Array,
  		default() {
  			return []
  		}
  	}
  		
  },
 	computed: {
 
 	},
 	methods: {
 		handleInput($event) {
 			this.$emit('change', $event.target.value);
 		}
 	} 
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .next_point {
    width: 100%;
    height: auto;
    list-style: none;
    padding: 0px;
  }
  .next_ponit__child {
  	list-style: none;
    float: left;
    padding: 0px 15px;
    margin: 0 10px 0 0;
    height: 30px;
    line-height: 30px;
    border: 1px solid #ccc;
    background: #fafafd;  
  }
</style>