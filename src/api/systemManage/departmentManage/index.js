import { get, post, del, put } from "@/utils/request.ts"

/**
 * 获取部门树(get)
 * @param {{isAll:boolean,cid?:number,deptName?:string,isLogin?:boolean,status?:boolean}} data
 * @return {Promise}
 */
const getDepartmentTree = (data) => get("/sys/department/tree", data)

/**
 * 获取部门树(post)
 * @param data
 * @return {Promise<RespondedAlovaGenerics<AlovaGenerics<any, any, FetchRequestInit, Response, Headers, AlovaDefaultCacheAdapter, AlovaDefaultCacheAdapter, VueHookExportType<unknown>>, unknown, unknown>["Responded"]>}
 */
const getDepartment = (data) => post("/sys/department/tree", data)

/**
 * 重置用户部门关联
 *
 * @return {Promise}
 */
const resetDepartmentTree = (data) => post("/sys/department/reset", data)

/**
 * 部门-删除
 * @param {number[]} data
 * @return {Promise}
 */
const delDepartment = (data) => del("/sys/department", data)

/**
 * 部门-修改
 * @param {{isAll:boolean,cid?:number,deptName?:string,isLogin?:boolean,status?:boolean}} data
 * @return {Promise}
 */
const updateDepartment = (data) => put("/sys/department", data)

/**
 * 部门-新增
 * @param {{isAll:boolean,cid?:number,deptName?:string,isLogin?:boolean,status?:boolean}} data
 * @return {Promise}
 */
const addDepartment = (data) => post("/sys/department", data)

/**
 * 获取部门 分页
 * @param {{isAll:boolean,cid?:number,deptName?:string,isLogin?:boolean,status?:boolean}} data
 * @return {Promise}
 */
const getDepartmentList = (data) => get("/sys/department", data)

export {
	getDepartment,
	getDepartmentTree,
	resetDepartmentTree,
	delDepartment,
	updateDepartment,
	addDepartment,
	getDepartmentList
}
