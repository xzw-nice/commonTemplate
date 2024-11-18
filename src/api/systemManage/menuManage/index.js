import { get, post, put, del } from "@/utils/request"

/**
 * 获取菜单树
 * @param {{isAll?:boolean,isLogin?:boolean,menuId?:number,name?:string,roleId?:number}} data
 * @return {*}
 */
const getMenuTree = (data) => get("/sys/menu/tree", data)

/**
 * 查询菜单
 */
const getMenu = (data) => get("/sys/menu", data)

/**
 * 新增菜单
 * @param data
 * @return {Method<any, any, unknown, unknown, any, any, any>}
 */
const addMenu = (data) => post("/sys/menu", data)

/**
 * 修改菜单
 * @param data
 * @return {Method<any, any, unknown, unknown, any, any, any>}
 */
const editMenu = (data) => put("/sys/menu", data)

/**
 * 删除菜单
 * @param {number[]} ids
 * @return {Method<any, any, unknown, unknown, any, any, any>}
 */
const delMenu = (ids) => del("/sys/menu", ids)

export { getMenuTree, addMenu, editMenu, delMenu, getMenu }
