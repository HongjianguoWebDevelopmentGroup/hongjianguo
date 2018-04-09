<template>
	<div :style="`position: relative; font-size: 14px; border-left: solid 1px #dedede; border-top: solid 1px #dedede; width: ${totalWidth}px; height: ${totalHeight}px;`">
		<div :style="`${commonStyle}left: 0;top: 0;width: ${columnWidth}px;height: ${rowHeight}px`" class="data-view-cell data-view-header"></div>
		<template v-for="(row, k1) in rows">
			<div v-for="(item, k2) in row" :style="rowStyle(item.count, k2, k1)" class="data-view-cell data-view-header"><div :title="item.name" class="data-view-header-text">{{ item.name }}</div></div>
		</template>
		<template v-for="(column, k1) in columns">
			<div v-for="(item, k2) in column" :style="columnStyle(item.count, k1, k2)" class="data-view-cell data-view-header"><div :title="item.name" class="data-view-header-text">{{ item.name }}</div></div>
		</template>
		<template v-for="(row, k1) in matrix">
			<div v-for="(item, k2) in row" :style="matrixStyle(k2, k1)" class="data-view-cell">{{ item }}</div>
		</template>
	</div>
</template>
<script>
let rowCache = 0;
let columnCache = 0;
export default {
	name: 'dataView',
	data () {
		return {
			blockHeight: 48,
			blockWidth: 110,
			rows: [],
			columns: [],
			matrix: [],
			commonStyle: 'position: absolute;',	
		};
	},
	computed: {
		rowHeight () {
			return this.rows.length * this.blockHeight;
		},
		columnWidth () {
			return this.columns.length * this.blockWidth;
		},
		totalHeight () {
			const h = this.blockHeight;
			let count = 0;
			if(this.columns[0]) this.columns[0].forEach(_=>{ count += _.count*h });
			return this.rowHeight + count;
		},
		totalWidth () {
			const w = this.blockWidth;
			let count = 0;
			if(this.rows[0]) this.rows[0].forEach(_=>{ count += _.count*w });
			return this.columnWidth + count;
		}
	},
	methods: {
		rowStyle (count, left, top) {
			if(left == 0) {
				rowCache = 0;
			}
			const cache = rowCache;
			const w = this.blockWidth;
			const h = this.blockHeight;
			const cw = this.columnWidth;
			const style = `${ this.commonStyle }width: ${ count*w }px;height: ${ h }px;line-height: ${ h }px;left: ${ cache+cw }px;top: ${ top*h }px;`;
			rowCache = cache + count*w;
			return style;
		},
		columnStyle (count, left, top) {
			if(top == 0) {
				columnCache = 0;
			}
			const cache = columnCache;
			const w = this.blockWidth;
			const h = this.blockHeight;
			const rh = this.rowHeight;
			const style = `${ this.commonStyle }width: ${ w }px;height: ${ count*h }px;line-height: ${ count*h }px;left: ${ left*w }px;top: ${ cache+rh }px;`;
			columnCache = cache + count*h;
			return style;
		},
		matrixStyle (left, top) {
			const w = this.blockWidth;
			const h = this.blockHeight;
			const cw = this.columnWidth;
			const rh =	this.rowHeight;
			return `${ this.commonStyle }width: ${ w }px;height: ${ h }px; line-height: ${ h }px;left: ${ left*w+cw }px;top: ${ top*h+rh }px;`;
		},
		init ({r,c,m}) {
			//内部使用 未做值判定
			this.rows = r;
			this.columns = c;
			this.matrix = m;
		}
	}
}
</script>
<style>
.data-view-header {
	background-color: #f9fafd;
  font-weight: 500;
}
.data-view-cell {
    border-right: solid 1px #dedede;
    border-bottom: solid 1px #dedede;
    box-sizing: border-box;
    padding: 0 10px;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
}
.data-view-header-text {
	overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>