import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router"
import defaultRoutes from "@/router/modules/default"
const routes: RouteRecordRaw[] = [...defaultRoutes]

const router = createRouter({
	history: createWebHistory(),
	routes
})

export default router
