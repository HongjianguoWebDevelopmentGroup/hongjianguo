<template>
	<div style="height: 100%; overflow: auto;" v-loading="loading" element-loading-text="生成报表中...">
		<div key="nul" v-if="!show" style="font-size: 14px;text-align: center;padding-top: 50px;">暂未查询到相关数据...</div>
		<div key="chart" v-else-if="show && para.report_type != 'view'" id="chart" style="width: 100%; height: 100%;"></div>
		<data-view v-else-if = "show && para.report_type == 'view'" ref="dataView"></data-view>
	</div>
</template>
<script>
import DataView from '@/components/common/DataView'
import {columns, configs} from '@/const/reportSetting'
import {mapGetters} from 'vuex'

const pieOptions = {
  title : {
    text: '',
    subtext: '',
    x:'center'
  },
  toolbox: {
    feature: {
      saveAsImage: {}
    }
  },
  tooltip : {
    trigger: 'item',
    formatter: "{a} <br/>{b} : {c} ({d}%)"
  },
  legend: {
    orient: 'vertical',
    left: 'left',
    data: [],
  },
  series : [
      {
        name: '',
        type: 'pie',
        radius : '55%',
        center: ['50%', '60%'],
        data:[],
        itemStyle: {
          emphasis: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
  ]
};
const barOptions = {
	title : {
    text: '',
    subtext: '',
  },
  toolbox: {
    feature: {
      saveAsImage: {}
    }
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {            // 坐标轴指示器，坐标轴触发有效
      type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
    }
  },
  legend: {
     data: [],
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true,
  },
  xAxis: [{type: 'category', data: []}],
  yAxis: [{type : 'value'}],
  series: [
    {
     name:'',
     type:'bar',
     data:[],
     barMaxWidth: 100,
    },
  ]
};
const lineOptions =	 {
  title: {
  	text: '',
  	subtext: '',
  },
  toolbox: {
    feature: {
      saveAsImage: {}
    }
  },
  tooltip: {
  	trigger: 'axis',
  },
  legend: {
  	data: [],
  },
  grid: {
  	left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true,	
  },
  xAxis: [{type: 'category', data: [], boundaryGap: false}],
	 	yAxis: [{type : 'value'}],
  series: [
  	{
  		name: '',
  		type: 'line',
  		// stack: '堆叠',
  		smooth: true,
  	}
  ],
};
export default {
	name: 'reportView',
	props: {
		para: {
			type: null,
			default: '',
		}
	},
	data () {
		return {
			loading: false,
			show: true,
			chart: null,
		}
	},
	computed: {
		...mapGetters([
			'innerHeight',
			'innerWidth',
		]),
		config () {
			return configs[this.para.table_type];
		},
		columnsMap () {
			const columnsMap = new Map();
			columns[this.para.table_type].forEach(_=>{columnsMap.set(_.id, _.name)});
			return columnsMap;
		}
	},
	methods: {
		refreshView () {
			if(!this.para) return;

			this.show = true;

			this.$nextTick(_=>{

				if(this.para.report_type != 'view') {
					this.initChart();
				}else if(this.chart) {
					this.chart.clear();
					this.chart = '';
				}

				const data = {};
				Object.assign(data, this.para.filter, this.$tool.shallowCopy(this.para, {array: true, skip: ['fields', 'filter']}), {format: 'report_data'});
				this.loading = true;
				this.$axiosGet({
					url: this.config.url,
					data,
					success: this.handleSuccess,
					complete: _=>{ this.loading = false; this.$emit('complete', _); },
				})

			})
			
		},
		initChart () {
			if(!this.chart) {
				this.chart = echarts.init(document.getElementById('chart'));
			}
		},
		handleSuccess (data) {

			data = data[this.config.data_key];
			
			//数据空处理
			if(data instanceof Array && data.length == 0) {
				this.show = false;
				if(this.chart) {
					this.chart.clear();
					this.chart = '';
				}
				return;
			}
			
			if(this.para.report_type == 'pie') {
				this.handlePie(data);
			}else if(this.para.report_type == 'bar') {
				this.handleBarLine(data, 'bar');
			}else if(this.para.report_type == 'line') {
				this.handleBarLine(data, 'line');
			}else if(this.para.report_type == 'view') {
				this.handleView(data);
			}	

			

		},
		handlePie (data) {
			const keys = Object.keys(data);
			const lists = keys.map(_=>({name: _, value: data[_]}));
			const options = this.$tool.deepCopy(pieOptions);
			const name = this.columnsMap.get(this.para.row);
			options.title.text = this.config.text;
			options.title.subtext = name;
			options.series[0].name = name;
			options.legend.data = keys;
			options.series[0].data = lists;
			this.chart.setOption(options, true);
		},
		handleBarLine (data, type) {
			const options = this.$tool.deepCopy(type == 'bar' ? barOptions : lineOptions);
			options.title.text = this.config.text;
			if(data['c'][0]) {
				options.title.subtext = `${this.columnsMap.get(this.para.row)},${this.columnsMap.get(this.para.column)}`;
				const series = options.series[0];
				options.series = []; 
				data['c'][0].forEach((v, k)=>{
					const item = this.$tool.deepCopy(series);
					item.name = v.name;
					item.data = data['m'][k];
					options.legend.data.push(v.name);
					options.series.push(item);
				});
			}else {
				options.title.subtext = this.columnsMap.get(this.para.row);
				options.series[0].name = this.config.text;
				options.series[0].data = data['m'][0];
			}
			data['r'][0].forEach(v=>{
				options.xAxis[0].data.push(v.name);
			});
			this.chart.setOption(options, true);
		},
		handleView (data) {
			if(!data['c'][0]) data['c'][0] = [ {name: this.config.text, count: 1} ];
			this.$refs.dataView.init(data);
		},
		resizeChart () {
			if(this.para.report_type != 'view' && this.chart) {
				this.chart.resize();
			}
		}
	},
	mounted () {
		this.refreshView();
	},
	watch: {
		innerWidth () {
			this.resizeChart();
		},
		innerHeight () {
			this.resizeChart();
		},
		para () {
			this.$nextTick(_=>{
				this.refreshView();
			})
		}
	},
	components: {
		DataView,
	}
}
</script>