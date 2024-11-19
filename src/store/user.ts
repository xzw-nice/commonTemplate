import { defineStore } from "pinia"
import { getUserInfo } from "@/api"

export const useUserStore = defineStore("user", {
	state: () => {
		const token = JSON.parse(localStorage.getItem("token") as any)
		return {
			user: {
				isLogin: false, //是否登录
				info: {} //用户信息
			},
			token: token || "",
			roleList:
				<string[]>(
					JSON.parse(
						localStorage.getItem("uen-digitalEvaluationBase-roleList") as any
					)
				) || [] // 权限字符列表
		}
	},
	getters: {},
	actions: {
		/** 获取用户信息 */
		getUser() {
			return new Promise((resolve: any, reject: any) => {
				getUserInfo()
					.then((res: any) => {
						this.setUser(res)
						this.setRoleList(res.authStrList || [])
						resolve()
					})
					.catch((err: any) => {
						reject(err)
					})
			})
		},
		/**设置用户信息 */
		setUser(info: Record<string, any>) {
			this.user.info = { ...info }
			localStorage.setItem(
				"uen-digitalEvaluationBase-userInfo",
				JSON.stringify(this.user.info)
			)
		},
		/**设置token */
		setToken(token: string) {
			this.token = token
			this.user.isLogin = true
			localStorage.setItem("uen-digitalEvaluationBase-token", token)
		},
		/** 设置权限 */
		setRoleList(roleList: string[] = []) {
			this.roleList = [...roleList, "show"]
			localStorage.setItem(
				"uen-digitalEvaluationBase-roleList",
				JSON.stringify(this.roleList)
			)
		},
		/** 初始化用户数据 */
		initUser() {
			this.user = {
				isLogin: false, //是否登录
				info: {} //用户信息
			}
			this.token = ""
			this.roleList = []
			localStorage.removeItem("uen-digitalEvaluationBase-token")
			localStorage.removeItem("uen-digitalEvaluationBase-roleList")
			localStorage.removeItem("uen-digitalEvaluationBase-userInfo")
		}
	}
})
