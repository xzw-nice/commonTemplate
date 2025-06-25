import { defineStore } from "pinia"
import layout from "@/components/Layout/index.vue"
// 菜单类型
export type MenuType = {
	[key: string]: any
}
// state类型
type StateType = {
	sideMenuCollapse: boolean // 侧边栏是否展开
	menuList: MenuType[] // 所有菜单
	syncMenuList: MenuType[] // 异步获取的菜单
	currentMenu: string // 当前菜单
	homeMenuList: MenuType[] // 主页菜单
	manageMenuList: MenuType[] // 管理页菜单
}

// vite中获取文件
const modules = import.meta.glob([
	"../views/*.vue",
	"../views/*/*.vue",
	"../views/**/*.vue",
	"../views/*/*/*.vue",
	"../views/*/*/*/*.vue",
	"../views/*/*/*/*/*.vue",
	"../components/Layout/index.vue"
])

export const useMenuStore = defineStore("menu", {
	state: (): StateType => ({
		sideMenuCollapse: true, // 侧边栏展开状态
		menuList: [],
		syncMenuList: [],
		currentMenu: "",
		homeMenuList: [],
		manageMenuList: []
	}),
	actions: {
		// 设置侧边栏状态
		setSideMenuCollapse(state: boolean) {
			this.sideMenuCollapse = state
		},
		// 设置菜单
		setMenu(menuList: MenuType[]) {
			this.menuList = menuList
			localStorage.setItem(
				"uen-hiddenDangerManage-menuList",
				JSON.stringify(menuList)
			)
		},
		// 设置异步获取的菜单
		setSyncMenu(syncMenuList: MenuType[]) {
			// 菜单对应组件地址
			const handlerMenu = (targetMenu: MenuType[]) => {
				const m: MenuType[] = targetMenu.map((item: MenuType) => {
					item.children = item?.children?.length
						? handlerMenu(item.children)
						: []
					const obj = {
						...item
					}
					// if (!item.isOpenBlank) {
					Object.assign(obj, {
						path: item.path.startsWith("/") ? item.path : "/" + item.path,
						component:
							typeof item.component === "function"
								? item.component
								: item.component === "#" || item.component === "/"
								? layout
								: modules[`../views/${item.component}.vue`],
						children: item.type === 3 ? [] : item.children
					})
					// }
					return obj
				})
				return m
			}
			this.syncMenuList = handlerMenu(syncMenuList)
			console.log(this.syncMenuList)
			localStorage.setItem(
				"uen-hiddenDangerManage-syncMenuList",
				JSON.stringify(this.syncMenuList)
			)
		},
		// 设置当前菜单
		setCurrentMenu(currentMenu: string) {
			this.currentMenu = currentMenu
			localStorage.setItem("uen-hiddenDangerManage-currentMenu", currentMenu)
		},
		/** 初始化菜单数据 */
		initMenu() {
			this.menuList = []
			this.syncMenuList = []
			this.homeMenuList = []
			this.manageMenuList = []
			localStorage.removeItem("uen-hiddenDangerManage-menuList")
			localStorage.removeItem("uen-hiddenDangerManage-syncMenuList")
		}
	}
})
