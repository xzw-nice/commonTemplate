import router from "@/router"
import nProgress from "nprogress"
import { useMenuStore } from "@/store/menu"
import { useSystemStore } from "@/store/system"
import { routeSortOut } from "@/utils/constant"
import defaultRoutes from "@/router/modules/default"
import { getSelfMenu} from "@/api/systemManage/menuManage"
import { useUserStore } from "@/store/user"
import { getFirstMenu } from "@/utils/global"

// 获取菜单
async function getRouterData(to: any, next: any, useMenu: any) {
	try {
		const syncMenu = await getSelfMenu({ })
		useMenu.setMenu([...defaultRoutes, ...syncMenu])
		useMenu.setSyncMenu(syncMenu)
		addRouterData(useMenu.syncMenuList)
		// 登录默认跳转第一个菜单
		if (to.path === "/" || to.path === "/home") {
			const firstMenu = getFirstMenu(useMenu.syncMenuList)
			// 需要跳转的链接
			if (firstMenu.link) {
				next({ path: firstMenu.link, replace: true })
			} else {
				// 正常跳转菜单
				next({ path: firstMenu.path, replace: true })
			}
		} else {
			next({ ...to, replace: true })
		}
	} catch (e: any) {
		next({ path: "login", replace: true })
		console.log(e.message)
	}
}

/**
 * 动态添加路由
 * @param data 路由数组
 * @param parName 父路由名称
 */
function addRouterData(data: Record<string, any>[], parName = "") {
	data.forEach((item: Record<string, any>) => {
		if (item.path && item.name && item.type !== 3) {
			const obj: any = {
				...item
			}
			if (item.children?.length && item.children[0].type !== 3) {
				Object.assign(obj, {
					redirect: item.children[0].path || ""
				})
			}
			let pName: string = parName
			if (!parName) {
				for (let i = 0; i < routeSortOut.list.length; i++) {
					if (item.path.includes(routeSortOut.list[i])) {
						pName = routeSortOut.nameList[routeSortOut.list[i]]
						break
					}
				}
			}
			router.addRoute(pName, obj)
			if (item.children?.length) {
				addRouterData(item.children, item.name)
			}
		}
	})
}

async function firstEnter(to: any, next: any) {
	const useMenu = useMenuStore()
	const useUser = useUserStore()
	const useSystem = useSystemStore()
	// 若没有用户信息，发送请求获取用户信息
	if (!useUser.user?.info?.id) {
		await useUser.getUser()
		await useSystem.getDictionaryList()
	}
	const hasSyncRouter: Record<string, any>[] = useMenu.syncMenuList
	// 若没有异步菜单，发送请求获取菜单
	if (!hasSyncRouter.length) {
		await getRouterData(to, next, useMenu)
	} else {
		next()
	}
}
// 路由前置守卫
router.beforeEach((to, from, next) => {
	// 开始进度条
	nProgress.start()
	const token = localStorage.getItem("uen-hiddenDangerManage-token")
	if (!token) {
		if (to.path === "/login") {
			next()
		} else {
			next("/login")
		}
	} else if (to.path !== "/login") {
		firstEnter(to, next).then()
	} else {
		next()
	}
})

// 路由后置守卫
router.afterEach(() => {
	nProgress.done()
})
