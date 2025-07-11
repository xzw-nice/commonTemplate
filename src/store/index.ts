import { useUserStore } from "./user"
import { useMenuStore } from "./menu"
import { useSystemStore } from "./system"
import { nextTick } from "vue"

/**
 * 初始化本地存储和状态管理
 */
export async function initStoreData() {
	await nextTick(() => {
		const useUser = useUserStore()
		const useMenu = useMenuStore()
		const useSystem = useSystemStore()
		useUser.initUser()
		useMenu.initMenu()
		useSystem.initSystem()
	})
}
