import { useUserStore } from "@/store/user"
import { nextTick } from "vue"

export const hasPermission = {
	// 判断是否拥有按钮的权限
	name: "has",
	value: {
		mounted(el, binding) {
			const type = binding.value || ""
			const useUser = useUserStore()
			if (!useUser.roleList.includes(type)) {
				el.style.display = "none"
				nextTick(() => {
					el.parentNode.removeChild(el)
				})
			}
		}
	}
}
