import { AlovaMethodCreateConfig, createAlova, Method } from "alova"
import adapterFetch from "alova/fetch"
import VueHook from "alova/vue"
import { baseURL } from "./constant"
import { useUserStore } from "@/store/user"
import router from "@/router"

// 发布订阅
class EventEmitter {
	constructor() {
		this.event = {}
	}

	on(type: string, cbres: any, cbrej: any) {
		if (!this.event[type]) {
			this.event[type] = [[cbres, cbrej]]
		} else {
			this.event[type].push([cbres, cbrej])
		}
	}

	emit(type: string, res: any, ansType: any) {
		if (!this.event[type]) {
			return
		}

		this.event[type].forEach((cbArr: any[]) => {
			if (ansType === "resolve") {
				cbArr[0](res)
			} else {
				cbArr[1](res)
			}
		})
	}
}

/**
 * 根据请求生成对应的key
 * @param method 请求方法，地址，参数
 * @param hash 页面hash
 */
function generateReqKey(method: Method, hash: any): string {
	const { type, url, config, data } = method
	return [
		type,
		url,
		JSON.stringify(config.params),
		JSON.stringify(data),
		hash
	].join("&")
}

// 是否为FormData类型
function isFileUploadApi(config: any) {
	return Object.prototype.toString.call(config.data) === "[object FormData]"
}

// 存储已发送但未响应的请求
const pendingRequest = new Set()
// 发布订阅容器
const ev = new EventEmitter()

const alovaInstance = createAlova({
	baseURL,
	// 在vue项目下引入VueHook，它可以帮我们用vue的ref函数创建请求相关的，可以被alova管理的状态
	statesHook: VueHook,
	// 请求适配器，这里我们使用fetch请求适配器
	requestAdapter: adapterFetch(),
	// 设置全局的请求拦截器，与axios相似
	async beforeRequest(method: Method<any>) {
		const useUser = useUserStore()
		// 假设我们需要添加token到请求头
		method.config.headers.Authorization =
			useUser.token || localStorage.getItem("uen-recruitmentTool-token") || ""
		// 判断是否是hash模式
		const isHashMode = router.options.history.base.includes("#")
		const hash = isHashMode ? location.hash : location.pathname
		// 生成请求key
		const reqKey = generateReqKey(method, hash)
		if (!isFileUploadApi(method.config) && pendingRequest.has(reqKey)) {
			// 如果是相同请求,在这里将请求挂起，通过发布订阅来为该请求返回结果
			// 这里需注意，拿到结果后，无论成功与否，都需要return Promise.reject()来中断这次请求，否则请求会正常发送至服务器
			let res: any = null
			try {
				// 接口成功响应
				res = await new Promise((resolve, reject) => {
					ev.on(reqKey, resolve, reject)
				})
				return Promise.reject({
					type: "limitResSuccess",
					val: res
				})
			} catch (limitFunErr) {
				// 接口报错
				return Promise.reject({
					type: "limitResError",
					val: limitFunErr
				})
			}
		} else {
			// 将key保存在请求里
			method.config.pendKey = reqKey
			pendingRequest.add(reqKey)
		}
	},
	// 响应拦截器
	responded: {
		// 请求成功的拦截器
		// 当使用GlobalFetch请求适配器时，第一个参数接收Response对象
		// 第二个参数为当前请求的method实例，你可以用它同步请求前后的配置信息
		onSuccess: async (response: Response, config: Method<any>) => {
			if (response.status === 200) {
				let data: any = null
				if (config.config?.header.responseType === "blob") {
					// 流文件处理，使用response.blob()拿数据（异步）
					data = response
				} else {
					const json = await response.json()
					data = json.data
					if (json.code !== 200) {
						// 未登录
						if (json.code === 401) {
							await router.replace("/login")
						}
						handleErrorResponse_limit(data, config)
						// 抛出错误或返回reject状态的Promise实例时，此请求将抛出错误
						ElMessage.error(json.message)
						throw new Error(json.message) // error.message
					}
					// 解析的响应数据将传给method实例的transformData钩子函数
				}
				handleSuccessResponse_limit(data, config)
				return data
			}
			handleSuccessResponse_limit(response.statusText, config)
			switch (response.status) {
				case 500:
					ElMessage.error("服务器错误")
					break
				case 404:
					ElMessage.error("页面未找到")
					break
				default:
					ElMessage.error("未知错误")
					break
			}
			throw new Error(response.statusText) // error.message
		},
		// 请求失败的拦截器
		// 请求错误时将会进入该拦截器。
		// 第二个参数为当前请求的method实例，你可以用它同步请求前后的配置信息
		onError: async (err, method: Method<any>) => {
			// throw new Error(err.message)
			await handleErrorResponse_limit(err, method)
		},
		// 请求完成的拦截器
		// 当你需要在请求不论是成功、失败、还是命中缓存都需要执行的逻辑时，可以在创建alova实例时指定全局的`onComplete`拦截器，例如关闭请求 loading 状态。
		// 接收当前请求的method实例
		onComplete: async (method: Method<any>) => {}
	}
})

// 接口响应成功
function handleSuccessResponse_limit(data: any, config: Method<any>) {
	const reqKey = config.config.pendKey
	if (pendingRequest.has(reqKey)) {
		let handleData: any
		try {
			handleData = JSON.parse(JSON.stringify(data))
		} catch (e) {
			handleData = data
		}
		pendingRequest.delete(reqKey)
		ev.emit(reqKey, handleData, "resolve")
		delete ev.event[reqKey]
	}
}

// 接口走失败响应
function handleErrorResponse_limit(error: any, method: Method) {
	if (error?.type === "limitResSuccess") {
		return Promise.resolve(error.val)
	} else if (error?.type === "limitResError") {
		return Promise.reject(error.val)
	}
	const reqKey = method.config.pendKey
	if (pendingRequest.has(reqKey)) {
		let handleData: any
		try {
			handleData = JSON.parse(JSON.stringify(error))
		} catch (e) {
			handleData = error
		}
		pendingRequest.delete(reqKey)
		ev.emit(reqKey, handleData, "reject")
		delete ev.event[reqKey]
	}

	return Promise.reject(error)
}

const get = (url: string, data?: any, header = {}) =>
	alovaInstance.Get(url, <any>{ params: data, header }).send(true)

const post = (url: string, data?: any, config = {}) =>
	alovaInstance.Post(url, data, config).send(true)

const put = (url: string, data?: any, config = {}) =>
	alovaInstance.Put(url, data, config).send(true)

const del = (url: string, data?: any, config = {}) =>
	alovaInstance.Delete(url, data, config).send(true)

export { get, post, put, del }
