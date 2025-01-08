import { ElLoading, ElMessage } from "element-plus"
import { useUserStore } from "@/store/user"

/**
 * 文件上传
 * @param file 文件
 * @param url 上传地址
 * @param params 文件携带的参数
 */
export function fileUpload(
	file: any,
	params: Record<string, any>,
	url = "/minio/upload"
): any {
	const upload: any = (
		currentFile: any,
		successFn: (data: any) => void,
		failedFn: (data: any) => void
	) => {
		// 创建文件对象
		const formData = new FormData()
		formData.append("file", currentFile.file)
		if (params) {
			for (const i in params) {
				formData.append(i, params[i])
			}
		}
		const loading = ElLoading.service({
			lock: true,
			text: "正在上传中...",
			spinner: "el-icon-loading",
			background: "rgba(0, 0, 0, 0.7)"
		})

		const xhr: XMLHttpRequest = new XMLHttpRequest()
		xhr.timeout = 10000
		xhr.open("post", `/api${url}`, true)

		// 获取token
		const token: string =
			useUserStore().token ||
			localStorage.getItem("uen-digitalEvaluationBase-token")

		//请求头添加token
		xhr.setRequestHeader("Authorization", token)
		xhr.send(formData)
		xhr.onreadystatechange = function () {
			if (xhr.readyState === 4) {
				loading.close()
				if (xhr.status < 200 || xhr.status >= 300) {
					ElMessage.error("上传失败")
					failedFn?.(xhr.responseText)
				} else if (xhr.response) {
					const response = JSON.parse(xhr.response)
					if (response?.code === 200) {
						ElMessage.success("上传成功")
						successFn?.(response.data)
					} else {
						ElMessage.error(response.message)
					}
				}
			}
		}
		xhr.ontimeout = () => {
			loading.close()
			ElMessage.error("请求超时")
		}
	}
	return new Promise<void>((resolve, reject) => {
		upload(
			file,
			(res: any) => {
				resolve(res)
			},
			(err: any) => {
				reject(err)
			}
		)
	})
}

/**
 * 对象转换成数组
 * @param data 需要装换成数组的对象
 * @param key 数组下每个对象的key的名称
 * @param value 数组下每个对象value的名称
 * @returns Array
 */
export function objToArr<T>(
	data: Record<string, any>,
	key: string,
	value: any
): Array<T> {
	const newData: T[] | any = []
	for (const item in data) {
		if (Object.prototype.hasOwnProperty.call(data, item)) {
			newData.push({
				[key]: item,
				[value]: data[item]
			})
		}
	}
	return newData
}

/**
 * 循环截取指定长度并返回数组（数组均分）
 * @param arr 目标数组
 * @param chunkSize 截取指定长度
 * @return 二维数组
 */
export function chunkArray(
	arr: Record<string, any>[],
	chunkSize: number
): Record<string, any>[][] {
	const chunks: Record<string, any>[][] = []
	for (let i = 0; i < arr.length; i += chunkSize) {
		chunks.push(arr.slice(i, i + chunkSize))
	}
	return chunks
}

/**
 * 计算时间差返回
 * @param startDate 开始日期
 * @param endDate 结束日期
 * @param unit 时间差单位
 * @return 时间差
 */
export function calculateDateDifference(
	startDate: string | number | Date,
	endDate: string | number | Date = new Date(),
	unit: "" | "days" | "months" | "years" = ""
): number {
	// 将日期字符串转换为日期对象
	const start: Date = new Date(startDate)
	const end: Date = new Date(endDate)

	// 计算时间差
	const timeDifference: number = (end as any) - (start as any)

	// 将时间差转换为天数、月数或年数
	switch (unit) {
		case "days":
			return Math.floor(timeDifference / (1000 * 60 * 60 * 24))
		case "months":
			let months: number = (end.getFullYear() - start.getFullYear()) * 12
			months -= start.getMonth() + 1
			months += end.getMonth() + 1
			return months
		case "years":
			let years: number = end.getFullYear() - start.getFullYear()
			const monthDiff: number = end.getMonth() - start.getMonth()
			if (
				monthDiff < 0 ||
				(monthDiff === 0 && end.getDate() < start.getDate())
			) {
				years--
			}
			return years
		default:
			return timeDifference // 默认返回时间差
	}
}

/**
 * 比较数组是否相等
 * @param arr1
 * @param arr2
 * @return 是否相等
 */
export function areArraysContentEqual3(
	arr1: any[] = [],
	arr2: any[] = []
): Boolean {
	if (arr1.length !== arr2.length) {
		return false
	}

	const countMap: Map<string, any> = new Map()

	// 计数第一个数组的元素
	for (const item of arr1) {
		countMap.set(item, (countMap.get(item) || 0) + 1)
	}

	// 比较第二个数组与计数
	for (const item of arr2) {
		const val = countMap.get(item)
		if (val === undefined || val <= 0) {
			return false
		}
		countMap.set(item, val - 1)
	}

	return true
}

/**
 * 当前菜单的父菜单
 * @param targetMenu 目标菜单数组
 * @param path 当前菜单地址
 * @param lastMenu 父菜单
 */
export function getParentMenu(
	targetMenu: Record<string, any>[],
	path: string,
	lastMenu?: {
		path?: string
		[key: string]: any
	}
): string {
	let finalPath = ""
	for (let i = 0; i < targetMenu.length; i++) {
		const menu: Record<string, any> = targetMenu[i]
		if (menu?.path === path) {
			return lastMenu?.path || path
		}
		if (menu.children?.length) {
			finalPath = getParentMenu(menu.children, path, menu)
		}
	}
	return finalPath
}

/**
 * 获取第一个菜单
 * @param targetMenu
 * @param lastMenu
 * @return {*|*[]}
 */
export function getFirstMenu(
	targetMenu: Record<string, any>[],
	lastMenu: Record<string, any> = {}
): Record<string, any> {
	const menu: Record<string, any> = targetMenu[0]
	if (menu.type !== 3) {
		if (menu.children?.length) {
			return getFirstMenu(menu.children, menu)
		}
		return menu
	}
	return lastMenu
}

/**
 * 文件下载
 * @param res 文件流
 * @param fileFormat 文件格式
 */
export async function downLoadFile(res: any, fileFormat?: string) {
	// 流数据
	const data = await res.blob()
	// 从相应头部拿到文件名称
	const temp = res.headers
		.get("content-disposition")
		?.split(";")[1]
		?.split("filename=")[1]
	if (!temp) {
		return Promise.reject(false)
	}

	const url = temp ? decodeURIComponent(temp) : ""
	const download = (response: any, fileName?: string) => {
		return new Promise((resolve, reject) => {
			const reader = new FileReader() //  实例化 FileReader
			reader.readAsDataURL(response) // 将读取到的文件编码成DataURL
			reader.onload = (e: any) => {
				// 调用API onload  文件读取成功时触发
				// 模拟a标签点击
				const a: any = document.createElement("a") // 创建a标签，
				if (fileFormat) {
					a.download = fileName + "." + fileFormat
				} else {
					a.download = fileName
				}
				// 设置格式
				a.href = e.target.result // 下载文件流链接
				document.body.appendChild(a) // 将标签DOM，放置页面
				a.click()
				document.body.removeChild(a) // 移除标签节点
				resolve(true)
			}
			reader.onerror = () => {
				ElMessage({
					message: "解析文件发生错误",
					type: "warning"
				})
				reject(false)
			}
			reader.onabort = () => {
				ElMessage({
					message: "解析文件发生意外终止",
					type: "warning"
				})
				reject(false)
			}
		})
	}
	return download(data, url)
}

/**
 * 字典中文转换
 * @param dictionary 当前字典项
 * @param value 值——value
 * @param valueKey 值对应的属性——key
 * @return 值对应的名称
 */
export function dictionaryConvert(
	dictionary: Record<string, any>[] = [],
	value: string | number,
	valueKey = "value"
): string {
	let label = ""
	if (dictionary?.length) {
		label = dictionary.find((item) => item[valueKey] === value)?.label
	}
	return label || ""
}

/**
 * 树形数据根据最后一个值反向查询出树形结构的字符串拼接
 * @param {Array} targetList 目标树
 * @param {string | number} value 目标值
 * @param {string} key 值对应的属性名
 * @param {string} parentValue 当前级的往前推的所有父级字符串拼接
 * @return {string} 树形字符串逗号拼接
 */
export function reverseTreeQuery(
	targetList: Record<string, any>,
	value: any,
	key = "value",
	parentValue = ""
): string {
	let finalValue: string = value ? value + "" : ""
	if (targetList?.length) {
		for (let i = 0; i < targetList.length; i++) {
			const current: Record<string, any> = targetList[i]
			if (value === current[key]) {
				if (parentValue) {
					finalValue = parentValue + "," + finalValue
				}
				break
			} else if (current.children?.length) {
				const currentValue: string = current[key] ? current[key] + "" : ""
				const currentParent: string = parentValue
					? parentValue + "," + currentValue
					: currentValue
				finalValue = reverseTreeQuery(
					current.children,
					value,
					key,
					currentParent
				)
			}
		}
	}
	return finalValue
}

/**
 * table列合并
 * @param row 当前行数据
 * @param column 当前列数据
 * @param rowIndex 当前行下标
 * @param targetData 目标数组
 * @param noMerge 不需要合并的字段
 * @param otherKey 其余需要配合合并的字段
 */
export function objectSpanMethod(
	{ row, column, rowIndex }: any,
	targetData: any[] = [],
	noMerge: string[] = [],
	otherKey?: string
) {
	const cellValue = row[column.property] // 当前位置的值
	if (!noMerge.includes(column.property)) {
		const prevRow: any = targetData[rowIndex - 1] // 获取到上一条数据
		let nextRow: any = targetData[rowIndex + 1] // 下一条数据
		let prevOtherKey = true
		let nextOtherKey = true
		if (otherKey) {
			prevOtherKey = row[otherKey] === prevRow[otherKey]
			nextOtherKey = row[otherKey] === nextRow[otherKey]
		}
		if (
			prevRow &&
			cellValue &&
			prevRow[column.property] === cellValue &&
			prevOtherKey
		) {
			// 当有上一条数据，并且和当前值相等时
			return { rowspan: 0, colspan: 0 }
		}
		let countRowspan = 1
		while (
			nextRow &&
			cellValue &&
			nextRow[column.property] === cellValue &&
			nextOtherKey
		) {
			// 当有下一条数据并且和当前值相等时,获取新的下一条
			nextRow = targetData[++countRowspan + rowIndex]
		}
		if (countRowspan > 1) {
			return { rowspan: countRowspan, colspan: 1 }
		}
	}
}

/**
 * 根据值查询树结构下的目标节点
 * @param targetTree 目标树
 * @param value 目标值
 * @param key 值对应的属性名
 * @return 值所对应的当前树节点
 */
export function handleTreeValueToObj(
	targetTree: Record<string, any>[],
	value: string | number,
	key = "value"
) {
	let tree: any
	if (targetTree?.length) {
		for (let i = 0; i < targetTree.length; i++) {
			const target: any = targetTree[i]
			if (value === target[key]) {
				tree = target
				break
			} else if (target?.children?.length) {
				tree = handleTreeValueToObj(target.children, value, key)
			}
		}
	}
	return tree
}

/**
 * 对象数组根据谋一字段去重
 * @param targetList 目标数组
 * @param key 需要匹配相同的字段
 * @return 去重后的数组
 */
export function removeSameItem(targetList: Record<string, any>[], key: string) {
	const unique: Map<string, any> = new Map()
	targetList.forEach((item) => unique.set(item[key], item))
	return [...unique.values()]
}
