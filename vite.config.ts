import { defineConfig } from "vite"
import compression from "vite-plugin-compression"
import vue from "@vitejs/plugin-vue"
import { resolve } from "path"
import AutoImport from "unplugin-auto-import/vite"
import Components from "unplugin-vue-components/vite"
import { ElementPlusResolver } from "unplugin-vue-components/resolvers"
// https://vitejs.dev/config/
export default defineConfig({
	server: {
		port: 8087, // 启动端口
		open: true, // 打开默认浏览器
		hmr: true, //开启热更新
		host: "0.0.0.0",
		proxy: {
			"/api": {
				target: "http://192.168.0.103:8002/uen", //你要跨域访问的网址
				changeOrigin: true, // 允许跨域
				rewrite: (path) => path.replace(/^\/api/, "") // 重写路径把路径变成空字符
			},
			"/file": {
				target: "http://192.168.0.103/file", //你要跨域访问的网址
				changeOrigin: true, // 允许跨域
				rewrite: (path) => path.replace(/^\/file/, "") // 重写路径把路径变成空字符
			}
		}
	},
	plugins: [
		vue(),
		// PkgConfig(),
		// OptimizationPersist(),
		// 需要 nginx 开启gzip
		compression({
			verbose: true, // 默认即可
			disable: false, //开启压缩(不禁用)，默认即可
			deleteOriginFile: false, //删除源文件
			threshold: 10240, //压缩前最小文件大小
			algorithm: "gzip", //压缩算法
			ext: ".gz" //文件类型
		}),
		// 依赖按需加载
		AutoImport({
			resolvers: [ElementPlusResolver()]
		}),
		// 组件按需导入
		Components({
			resolvers: [ElementPlusResolver()]
		})
	],
	build: {
		target: "es2021",
		assetsDir: "static",
		minify: "terser",
		rollupOptions: {
			input: {
				index: resolve(__dirname, "index.html")
			},
			output: {
				chunkFileNames: "static/js/[name]-[hash].js",
				entryFileNames: "static/js/[name]-[hash].js",
				assetFileNames: "static/[ext]/name-[hash].[ext]",
				manualChunks(id) {
					//静态资源分拆打包
					if (id.includes("node_modules")) {
						return id
							.toString()
							.split("node_modules/")[1]
							.split("/")[0]
							.toString()
					}
				}
			}
		},
		terserOptions: {
			compress: {
				//生产环境时移除console
				drop_console: true,
				drop_debugger: true
			}
		}
	},
	// 去除浏览器打印
	esbuild: {
		pure: ["console.log"],
		minifyIdentifiers: true,
		minifyWhitespace: true,
		minifySyntax: false
	},
	resolve: {
		alias: {
			"@": resolve(__dirname, "./src")
		},
		extensions: [".mjs", ".js", ".ts", ".json", ".vue"]
	},
	// 配置全局scss样式文件
	css: {
		preprocessorOptions: {
			scss: {
				additionalData: '@import "@/style/index.scss";'
			}
		},
		// 此代码为适配移动端px2rem
		postcss: {
			plugins: []
		}
	}
})
