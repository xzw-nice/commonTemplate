import { defineStore } from "pinia"
import { getAllDictionary } from "@/api"

export const useSystemStore = defineStore("system", {
	state: () => ({
		dictionary: {} // 字典数据
	}),
	actions: {
		/** 获取字典数据 */
		async getDictionaryList() {
			return getAllDictionary().then((res: any) => {
				this.setDictionary(res)
			})
		},
		/** 设置字典数据 */
		setDictionary(dictionary: any) {
			this.dictionary = dictionary
			localStorage.setItem(
				"uen-hiddenDangerManage-dictionary",
				JSON.stringify(dictionary)
			)
		},
		/** 初始化系统数据 */
		initSystem() {
			this.dictionary = {}
			localStorage.removeItem("uen-hiddenDangerManage-dictionary")
		}
	}
})
