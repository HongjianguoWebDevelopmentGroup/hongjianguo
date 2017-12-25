<template>
	<div>
	<div style="border-radius: 4px;
    border: 1px solid #ebeef5;
    background-color: #fff;
    overflow: hidden;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    color: #303133;
    margin: 10px;"
     v-show="show">
     	<div style="width: 100%;min-height: 30px;height:auto;border-bottom:1px solid #edeef5;">
     		<ul style="list-style: none;height: auto;overflow: hidden;"><span style="float: left;font-weight: bold;">注：</span>
     			<li v-for="item  in lineArr" :style="{float:'left',marginLeft: '5px',fontSize:'14px',paddingBottom: '6px',}"><i :style="{width: '30px',
					height: '1px',
					lineheight: '16px',
					marginRight: '3px',
					borderTopWidth:'3px',
					borderTopStyle:'solid',
					borderTopColor:`${item.color}`,
					display: 'inline-block'}">
					</i><span>{{ item.text }}</span>
					<!-- <span style="clear: all;"></span> -->
				</li>
     		</ul>
     	</div>
		<div id="quote_chart" style="width: 900px; height: 600px;"></div>
	</div>
		<span v-show="!show" style="margin-left: 20px;">暂无引用关系...</span>
	</div>
</template>
<script>

import {mapGetters} from 'vuex' 
const option = 
{
	title: {
    text: '引用关系图',
    // subtext: 'Default layout',
    top: 'bottom',
    left: 'right'
  },
  // animation: false,
  tooltip: {},
  tooltip: {
		show: true,
		type: 'item',
		transitionDuration: 0,
		formatter (a) {
			const d = a.data;
			if(d.type) {
				return lineMap.get(d.type)['text'];
			}else {
				return `案号：${d.serial}<br/>标题：${d.title}<br/>地区：${d.area}<br/>申请号：${d.apn}`;
			}
		}
	},
  series : [
    {
      name: 'Les Miserables',
      type: 'graph',
		  layout: 'force',
		  // circular: {
		  //   rotateLabel: true
		  // },
		  roam: true,
		  draggable: true,
      nodes: [],
      links: [],
			label: {
        normal: {
          show: true,
          position: 'right',
          formatter: function (a,b,c) {return a.data.title ? a.data.title : ''},
        }
      },
      force: {
        repulsion: 100,
      }
      // lineStyle: {
      //   normal: {
      //       color: 'source',
      //       curveness: 0.3
      //   }
      // }
    }
  ]
}
const lineMap = new Map([
	[1,{
		color: '#099',
		text: '要求优先权',
	}],
	[2,{
		color: '#c33',
		text: '分案申请',
	}],
	[3,{
		color: '#369',
		text: '部分连续案',
	}],
	[4,{
		color: '#fcc',
		text: '同套发明与新型',
	}],
	[5,{
		color: '#969',
		text: '不同地区同族',
	}],
	[6,{
		color: '#f90',
		text: '要求同日送件',
	}],
]);
export default {
	name: 'quote',
	data () {
		return {
			chart: '',
			show: true,
			lineArr:[],
		};
	},
	computed: {
		...mapGetters([
			'detailQuote',
		])
	},
	methods: {
		refreshChart () {
			if (this.detailQuote) {
				const copy = this.$tool.deepCopy(option);
				const nodes = this.$tool.deepCopy(this.detailQuote['nodes']);
				const links = this.$tool.deepCopy(this.detailQuote['links']);
				nodes.forEach(_=>{_.name = _.name + "";});
				links.forEach(_=>{
					_.source = _.source + ""; 
					_.target =_.target + "";
					_.lineStyle = {
						normal: {
							color: lineMap.get(_.type)['color']
						}
					}; 
				});
				copy.series[0]['nodes'] = nodes; 
				copy.series[0]['links'] = links;
				this.chart.setOption(copy);
				this.show = true;
			}else {
				this.chart.setOption(option);
				this.show = false;
			}
		},
		lineNum (){
			lineMap.forEach(_=>{
				console.log(_.color)
				this.lineArr.push(_);
			})	
			console.log(this.lineArr)
		}
	},
	mounted () {
		this.chart = echarts.init(document.getElementById('quote_chart'));
		this.refreshChart ();
		this.lineNum();
	},
	watch: {
		detailQuote () {
			this.refreshChart();
		}
	}
}
</script>
<style scoped lang="scss">
</style>