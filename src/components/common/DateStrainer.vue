<template>
  <div class="app-date-picker" style="display: flex;display: -webkit-flex;flex-wrap: nowrap;">
        <el-date-picker type="date" placeholder="起始日期" :size=size :style="sizeFormate.get(size)" :value="date[0]" @input="startUpdate" @change="startUpdate" :picker-options="startOption"></el-date-picker>
        <span style="padding: 0 5px;">-</span>
        <el-date-picker type="date" placeholder="结束日期" :size=size :style="sizeFormate.get(size)" :value="date[1]"  @input="endUpdate" @change="endUpdate" :picker-options="endOption"></el-date-picker>
  </div>
</template>

<script>
export default {
  name: 'appDatePicker',
  props: ['size', 'value'],
  methods: {
	startUpdate (val) {
		this.startTime = val;
		// console.log(val);
		const s = this.startTime ? this.startTime : '';
		const e = this.endTime ? this.endTime : ''; 
		const arr = [s, e];
		// console.log('startUpdate');
		this.$emit("input", arr);
    this.$emit("change",arr);
    },
    endUpdate (val) {
    	// console.log(val);
    	this.endTime = val;
		const s = this.startTime ? this.startTime : '';
		const e = this.endTime ? this.endTime : '';
    	const arr = [s, e];
    	// console.log('endUpdate');
    	this.$emit("input", arr);
      this.$emit("change",arr);
    },
    clearDate () {
    	this.startTime = "";
    	this.endTime = "";
    },
  },
  watch: {
  	'date': {
  		handler:function(val) {
  			if(!val[0] && !val[1]) {
  				this.clearDate();
  			}
  		},
  	}
  },
  computed: {
  	date () {
  		const v = this.value;
  		return !v || v[0] == undefined || v[1] == undefined 
  					 	? ['', '']
  						: [...v];
  	}
  },
  data () {
  	const sizeFormate = new Map();
  	const d = this;
  	sizeFormate.set('mini', 'width: 110px;');
		return {
			sizeFormate,
			startTime: '',
			endTime: '',
		  startOption: {
	      disabledDate (time) {
	        let flag;

	        if(d.endTime == "") {
	          flag = time.getTime() > new Date('1970-01-01');  
	        }else {
	          flag = time.getTime() <  new Date(d.endTime).getTime() + 8.64e7; 
	        }
	        return !flag;
	      }
	    },
	    endOption: {
	      disabledDate (time) {
	        let flag;

	        if(d.startTime == "") {
	          flag = time.getTime() > new Date('1970-01-01');
	        }else {
	          flag = time.getTime() > new Date('1970-01-01') && time.getTime() >new Date(d.startTime).getTime() - 8.64e7;
	        }

	        return !flag;
	      }
	    },
		}
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
