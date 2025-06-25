import { createApp, Component } from "vue"
import App from "./App.vue"
import { createPinia } from "pinia"
import router from "./router"
import "nprogress/nprogress.css"
import "remixicon/fonts/remixicon.css"
import "@/router/permission"
import * as ElementPlusIconsVue from "@element-plus/icons-vue"
import { directive } from "@/utils/directive"
import ElementPlus from "element-plus"

const app = createApp(App)

// 全局使用element icon
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
	app.component(key, component as Component)
}

const pinia = createPinia()

app.use(pinia).use(router).use(ElementPlus).use(directive).mount("#app")
