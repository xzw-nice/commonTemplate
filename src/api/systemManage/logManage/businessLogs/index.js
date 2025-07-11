import { get } from "@/utils/request.ts"

/**
 * 获取业务日志
 * @param {{beginTime?:string,endTime?:string}} data
 * @return {*}
 */
const getBusinessLogs = (data) => get("/sys/log/work", data)

export { getBusinessLogs }
