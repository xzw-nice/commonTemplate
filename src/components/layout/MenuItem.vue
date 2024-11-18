<template>
	<template
		v-for="(item, index) in props.menuList"
		:key="`${item.id}_${index}`"
	>
		<!-- 如果当前菜单有下级,循环下级 -->
		<template v-if="item?.type !== 3">
			<el-sub-menu
				v-if="
					!item.link &&
					item?.children?.length &&
					item.children.some((m) => m.type !== 3)
				"
				:index="item?.path"
			>
				<template #title>
					<remix-icon
						:icon-name="item?.icon"
						color="#ffffff"
						size="24px"
					></remix-icon>
					<span class="menu-name">{{ item?.name }}</span>
				</template>
				<!-- 递归调用自身 -->
				<MenuItem :menu-list="item?.children"></MenuItem>
			</el-sub-menu>
			<!-- 没有下级 -->
			<el-menu-item
				v-else-if="
					item.component && (item.component !== '#' || item.component !== '/')
				"
				:class="{
					activeMenu: router.currentRoute.value.fullPath === item?.path
				}"
				:index="item?.path"
				@click="goPage(item)"
			>
				<remix-icon
					:icon-name="item?.icon"
					color="#ffffff"
					size="24px"
				></remix-icon>
				<template #title>
					<span class="menu-name">{{ item?.name }}</span></template
				>
			</el-menu-item>
			<!-- 最后一级非当前页跳转 -->
			<div v-else class="el-menu-item" @click="goPage(item)">
				<remix-icon
					:icon-name="item?.icon"
					color="#ffffff"
					size="24px"
				></remix-icon>
				<span class="menu-name">{{ item?.name }}</span>
			</div>
		</template>
	</template>
</template>
<script name="MenuItem" setup>
import RemixIcon from "@/components/SvgIcon/RemixIcon.vue"
import router from "@/router"

const props = defineProps({
	menuList: {
		type: Array,
		default: () => []
	}
})

function goPage(item = { path: "/" }) {
	// 打开新页面
	if (item.isOpenBlank) {
		window.open(item.link)
	} else if (item.link) {
		// 当前页面跳转
		router.push(item.link)
	} else {
		// 正常路由跳转
		router.push({ path: item.path })
	}
}
</script>

<style lang="scss" scoped>
.activeMenu {
	color: #fff !important;
	background-color: rgba(84, 143, 243, 0.3) !important;
}

.menu-name {
	margin-left: 4px;
}
</style>
