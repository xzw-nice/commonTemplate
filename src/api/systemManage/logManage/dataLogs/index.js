import { get, post } from "@/utils/request.ts"

/**
 * 获取数据日志
 * @param {{current:number,size:number,beginTime?:string,endTime?:string,[key:string]:any}} data
 * @return {*}
 */
const getDataLogs = (data) => get("/sys/log/data", data)

/**
 * 下载数据日志excel
 * @param {{beginTime?:string,endTime?:string,[key:string]:any}} data
 * @return {Promise<unknown>}
 */
const downloadDataLogsExcel = (data) =>
	post("/sys/log/data/downExcl", data, {
		responseType: "blob",
		headers: {
			"Content-Type": "application/json"
		}
	})

export { getDataLogs, downloadDataLogsExcel }
