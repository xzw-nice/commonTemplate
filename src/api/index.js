import { get, post } from "@/utils/request.ts"

/**
 * 登录
 * @param {{loginName:string,password:string}} data 登录账号/密码
 * @return {Method<any, any, unknown, unknown, any, any, any>}
 */
const sysLogin = (data) => post("/sys/login", data)

/** 登出 */
const sysLogout = () => get("/sys/logout")

/** 获取登录用户信息 */
const getUserInfo = () => get("/sys/user/getLoginUser")

/** 获取部门树信息 */
const deptTree = (data) => get("/sys/department/tree", data)

/** 文件上传 */
const fileUpload = (data) => post("/minio/upload", data)

/**
 * 获取字典数据（无权限）
 * @param {{belong?:string}} data 字典归类
 * @return {Promise<unknown>}
 */
const getDictionary = (data) => get("/sys/dictionaries/getDictList", data)

/**
 * 获取字典数据
 * @return {Promise<unknown>}
 */
const getAllDictionary = () => get("/sys/dictionaries/getAllDictList")

/**
 * 通用模板下载
 * @param {{fileName?:string,templateName?:string}} data    文件名、模板名
 * @return {Promise}
 */
const downloadTemplate = (data) =>
	post("/file/templateDownload", data, {
		responseType: "blob",
		headers: {
			"Content-Type": "application/json"
		}
	})

export {
	sysLogin,
	sysLogout,
	getUserInfo,
	deptTree,
	fileUpload,
	getDictionary,
	downloadTemplate,
	getAllDictionary
}
