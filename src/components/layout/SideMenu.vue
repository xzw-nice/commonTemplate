<template>
	<div class="layout-sideMenu layout-sideMenu-nopx">
		<el-menu
			:collapse="props.isCollapse"
			:default-active="router.currentRoute.value.path"
			:default-openeds="defaultOpenPath"
			class="layout-sideMenu-menu sideMenu-menu-nopx"
			popper-effect="dark"
			router
			unique-opened
		>
			<menu-item :menu-list="sideMenu" />
		</el-menu>
	</div>
</template>
<script name="SideMenu" setup>
import { useMenuStore } from "@/store/menu"
import MenuItem from "./MenuItem.vue"
import router from "@/router"
import { ref, watch } from "vue"
import { getParentMenu, reverseTreeQuery } from "@/utils/global"
import { routeSortOut } from "@/utils/constant"

const props = defineProps({
	isCollapse: {
		type: Boolean,
		default: false
	}
})
const useMenu = useMenuStore()

// const defaultOpenPath = computed(() => {
// 	const currentPath = router.currentRoute.value.path
// 	const path = getParentMenu(useMenu.syncMenuList, currentPath)
// 	return [path]
// })

// 默认打开的菜单
const defaultOpenPath = ref([])

// 侧边栏数据
const sideMenu = ref([])
watch(
	() => router.currentRoute.value.path,
	(val) => {
		// 获取侧边栏数据
		let name = ""
		for (let i = 0; i < routeSortOut.list.length; i++) {
			if (val.includes(routeSortOut.list[i])) {
				name = "/" + routeSortOut.list[i]
				break
			}
		}

		// 绑定默认路由子路由（唯一）
		sideMenu.value = useMenu.syncMenuList.find(
			(item) => item.path === name
		).children
		const openPath = reverseTreeQuery(sideMenu.value, val, "path")
		if (openPath) {
			const finalPath = openPath.split(",") || []
			finalPath.pop()
			defaultOpenPath.value.vlaue = finalPath
		}
	},
	{
		immediate: true,
		deep: true
	}
)
</script>
<style lang="scss" scoped>
.layout-sideMenu {
	height: 100%;

	:deep(.sideMenu-menu-nopx) {
		width: 100%;
		border-right: none;
		background-color: transparent;

		.el-menu-item {
			color: #ececec;
			font-size: $default-font-size;
			border-bottom: 1px solid rgba(51, 51, 51, 0.2);
			letter-spacing: 1px;
			height: 60px;
			padding: 0 20px;

			.el-menu-tooltip__trigger {
				padding: 0 20px;
			}

			&:hover {
				color: #fff !important;
				background-color: rgba(84, 143, 243, 0.3) !important;
			}

			&:focus {
				color: #fff !important;
				background-color: rgba(84, 143, 243, 0.3) !important;
			}
		}

		.el-sub-menu {
			$padding-left: 16px;
			border-bottom: 1px solid rgba(51, 51, 51, 0.3);

			.el-icon {
				font-size: 12px;
			}

			.el-sub-menu {
				background-color: rgb(69, 85, 116, 0.5);
				border-bottom: none;

				.el-sub-menu__title {
					padding-left: calc(20px + $padding-left);
				}

				.el-menu-item {
					padding-left: calc(20px + $padding-left + $padding-left);
				}
			}

			.el-sub-menu__title {
				color: #ffffff;
				letter-spacing: 1px;
				font-size: 14px;
				height: 54px;
				padding: 0 20px;

				&:hover {
					background-color: transparent;
				}
			}

			.el-menu-item {
				background-color: rgba(69, 85, 116, 0.5);
				height: 54px;
				padding: 0 24px 0 calc(20px + $padding-left);

				&:last-child {
					border-bottom: none;
				}
			}

			.el-menu {
				background-color: transparent;
				box-shadow: 0 0 2px 0 rgba(3, 8, 16, 0.1) inset;
			}
		}

		//
		//.is-active {
		//	color: #00b1ff;
		//	background-color: rgba(84, 143, 243, 0.3) !important;
		//}
	}
}
</style>
