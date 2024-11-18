<template>
	<!--	<div-->
	<!--		v-if="isOnlineSvg"-->
	<!--		:style="{ '&#45;&#45;svg-icon-url': `url(${iconName})` }"-->
	<!--		class="svg-icon svg-icon-online"-->
	<!--		:class="className"-->
	<!--	/>-->
	<!--	<svg v-else class="svg-icon" :class="iconClassName" aria-hidden="true">-->
	<!--		<use :xlink:href="`#icon-${iconName}`" />-->
	<!--	</svg>-->
	<i
		:class="iconClassName"
		:style="{ fontSize: typeof size === 'string' ? size : size + 'px', color }"
		class="remixIcon"
	></i>
</template>

<script lang="ts" name="SvgIcon" setup>
import { computed } from "vue"

const props = defineProps({
	iconName: {
		type: String,
		required: true
	},
	className: {
		type: String,
		default: ""
	},
	color: {
		type: String,
		default: "#4f4f4f"
	},
	size: {
		type: [String, Number],
		default: "1em"
	}
})

// 图标在 iconfont 中的名字
const iconClassName = computed(() => {
	if (props.iconName.includes("el-icon")) {
		return props.iconName
	}
	return `ri-${props.iconName}`
})
</script>

<style lang="scss" scoped>
.remixIcon {
	transition: all 0.3s;
	display: flex;
	align-items: center;
	justify-content: center;
}

.svg-icon {
	/* v-bind 是 Vue3 才支持的功能，可以将 CSS 的值与 js 的值绑定 */
	width: v-bind("props.size");
	height: v-bind("props.size");
	font-size: v-bind("props.size");
	position: relative;
	fill: currentColor;
	vertical-align: -2px;
}
</style>
