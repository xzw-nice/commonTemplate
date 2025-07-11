import { get, post } from "@/utils/request.ts"

/**
 * 获取异常日志列表
 * @param data
 * @return {*}
 */
const getExceptionList = data => post('/sys/sysErrorLog/page', data)

export {
	getExceptionList
}

