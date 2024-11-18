<template>
	<el-container class="layout">
		<el-header class="layout-header header-nopx">
			<nav-bar></nav-bar>
		</el-header>
		<el-container class="layout-container container-nopx">
			<el-aside
				:style="{
					width: collapse
						? sideMenuWidth.collapsedWidth
						: sideMenuWidth.expandedWidth
				}"
				class="layout-aside aside-nopx"
			>
				<div class="aside-collapse" @click="changeCollapse">
					<el-icon>
						<Fold v-if="!collapse" />
						<Expand v-else />
					</el-icon>
					<span v-show="!collapse" class="fold-text">收起</span>
				</div>
				<el-scrollbar style="height: calc(100% - 50px)">
					<side-menu :is-collapse="collapse"></side-menu>
				</el-scrollbar>
			</el-aside>
			<el-main id="elMain" class="layout-main">
				<!--				<router-view v-slot="{ Component, route }">-->
				<!--					<keep-alive>-->
				<!--						<component :is="Component" :key="route.fullPath" />-->
				<!--					</keep-alive>-->
				<!--				</router-view>-->
				<router-view></router-view>
			</el-main>
		</el-container>
	</el-container>
</template>
<script name="Layout" setup>
import NavBar from "./NavBar.vue"
import SideMenu from "./SideMenu.vue"
import { ref } from "vue"
import { sideMenuWidth } from "@/utils/constant.ts"
import { useMenuStore } from "@/store/menu.ts"

const useMenu = useMenuStore()

const collapse = ref(false)

function changeCollapse() {
	collapse.value = !collapse.value
	useMenu.setSideMenuCollapse(collapse.value)
}

// // 异步加载组件
// const AsyncSideMenu = defineAsyncComponent({
// 	loader: () => import("./SideMenu.vue"),
// 	loadingComponent: () => ({ template: "<div>Loading...</div>" }),
// 	errorComponent: () => ({ template: "<div>加载失败</div>" }),
// 	delay: 200,
// 	timeout: 3000
// })
</script>
<style lang="scss" scoped>
.layout {
	width: 100%;
	height: 100%;
	background-color: #ffe4b5;

	&-header {
		padding: 0;
		position: sticky;
		top: 0;
	}

	.header-nopx {
		height: $top-bar-height;
	}

	.container-nopx {
		height: calc(100% - 60px);
	}

	&-container {
		.aside-nopx {
			//min-width: $menu-left-shrink-width;
			width: auto;
			background: linear-gradient(to bottom, #53628a, rgba(29, 41, 61, 0.8));
			transition: all 0.2s;

			.aside-collapse {
				height: 50px;
				cursor: pointer;
				@include flex;
				color: #ffffff;
				border-bottom: 1px solid rgba(51, 51, 51, 0.3);
				transition: background-color 0.3s;

				> i {
					font-size: 24px;
					color: #ffffff;
				}

				.fold-text {
					display: inline-block;
					margin-left: 8px;
				}

				&:hover {
					background-color: rgba(84, 143, 243, 0.3);
				}
			}
		}

		.layout-main {
			height: 100%;
			background-color: $default-background;
			position: relative;

			:deep(> div) {
				height: 100% !important;
			}
		}
	}
}
</style>
