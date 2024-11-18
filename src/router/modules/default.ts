import { RouteRecordRaw } from "vue-router"
import layout from "@/components/layout"

// 默认路由
const defaultRoutes: RouteRecordRaw[] = [
	{
		path: "/",
		name: "初始页",
		redirect: "/home"
		// component: () => import("@/views/home/index.vue")
	},
	{
		path: "/home",
		name: "首页",
		component: layout,
		meta: {
			title: "首页",
			sortOut: "home" // 归类字符
		},
		children: []
	},
	{
		path: "/login",
		name: "登录",
		component: () => import("@/views/sysLogin/index.vue") // 注意这里要带上 文件后缀.vue
	},
	{
		path: "/dataCenter",
		name: "数据中心",
		// component: () => import("@/views/home/index.vue")
		component: layout,
		meta: {
			title: "数据中心",
			sortOut: "dataCenter" // 归类字符
		},
		children: []
	},
	{
		path: "/systemManage",
		name: "系统",
		// component: () => import("@/views/home/index.vue")
		component: layout,
		meta: {
			title: "系统",
			sortOut: "systemManage" // 归类字符
		},
		children: []
	}
]
export default defaultRoutes