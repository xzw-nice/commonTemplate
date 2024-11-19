import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router"
import defaultRoutes from "@/router/modules/default"
const routes: RouteRecordRaw[] = [...defaultRoutes]

const router = createRouter({
	// 使用history模式并使用vite.config.ts文件中的base作为动态基准路径
	history: createWebHistory(import.meta.env.BASE_URL),
	routes
})

export default router
