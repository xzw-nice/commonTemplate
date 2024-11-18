import { del, get, post, put } from "@/utils/request.js"

/**
 * 获取字典数据
 * @param {{current:number,size:number,keyword?:string,belong?:string,status?:boolean}} data
 * @return {Promise<unknown>}
 */
const getDictionaryPage = (data) => get("/sys/dictionaries", data)

/**
 * 新增字典项
 * @param {{belong:string,keyword:string,param:string,val:number,status:boolean,sort?:number,state?:string,statement?:string}} data
 * @return {Promise<unknown>}
 */
const addDictionary = (data) => post("/sys/dictionaries", data)

/**
 * 修改字典
 * @param {{belong:string,keyword:string,param:string,val:number,status:boolean,sort?:number,state?:string,statement?:string}} data
 * @return {*}
 */
const editDictionary = (data) => put("/sys/dictionaries", data)

/**
 * 删除字典项
 * @param {number[]} ids
 * @return {Promise<unknown>}
 */
const delDictionary = (ids) => del("/sys/dictionaries", ids)

export { getDictionaryPage, addDictionary, editDictionary, delDictionary }
