<template>
	<!-- 用于将主窗口显示为加载页面 -->
	<div class="main" v-loading="true" element-loading-text="加载中..." :style="`width: 100%;height:${innerHeight - 60}px;`"></div>
</template>
<script>
import {mapGetters} from 'vuex'
export default {
	name: 'Loading',
	computed: {
		...mapGetters([
			'innerWidth',
			'innerHeight',
		])
	}
}
</script>