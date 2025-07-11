import { ref } from "vue"
import { cloneDeep } from "lodash"

export default function (fn) {
	// 原始数据
	const originData = ref([])
	// 原始数据处理完后的树形数据
	const treeData = ref([])
	// 最后绑定返回的表格数据
	const tableData = ref([])
	// 处理后的数据总数
	const total = ref(0)
	// 匹配父级的标识
	const parentIdentKey = ref("pid")
	// 当前标识
	const identKey = ref('id')

	// 绑定原始数据
	const bindData = (data,pKey,key) => {
		originData.value = data
		parentIdentKey.value = pKey
		identKey.value = key
	}


	/**
	 * 筛选分页处理数据
	 * @param {{page?: number, size?: number, filter?: object,isOrigin?:boolean}} params 页码、每页条数、过滤条件、是否所有数据/是否原始数据
	 */
	const tableFilter = ({ page, size, filter, isOrigin }) => {
		let data = cloneDeep(isOrigin ? originData.value : treeData.value)
		if (tableData.value?.length) {
			// 筛选条件过程
			if (filter && Object.keys(filter)?.length) {
				for (const key in filter) {
					const value = filter[key]
					if (typeof value === "string") {
						// 字符串模糊匹配
						data = data.filter((item) => item[key].includes(value))
					} else if (typeof value === "number" || typeof value === "boolean") {
						// 值类型和布尔类型全等
						data = data.filter((item) => item[key] === value)
					} else if (typeof value === "object") {
						// 数组存在
						if (value instanceof Array && value.length) {
							data = data.filter((item) => value.includes(item[key]))
						}
					}
				}
			}
			// 条件过滤后总条数
			total.value = data.length
			// 分页
			if (!size) {
				// 若没有size值，则默认全部数据
				tableData.value = data
			} else {
				if (page && size * (page - 1) < total.value) {
					tableData.value = data.slice((page - 1) * size, page * size)
				}
			}
		} else {
			tableData.value = []
		}
	}

	// 将扁平数据处理
	const handleFlatData = (targetList, n = -1, levelList = []) => {
		let finalList = cloneDeep(levelList)
		if (targetList.length) {
			const list = cloneDeep(targetList)
			// 最后一级父数组
			let currentList = []
			const newList = []
			// 如果层级数组有长度，则取最后一级, 没有取原始数据数组
			if (levelList.length && levelList.every(a=>a.length)) {
				currentList = cloneDeep(levelList[n])
				for (let i = 0; i < list.length; i++) {
					const cData = list[i]
					// 若当前项的父标识在上一级出现，则添加到当前级
					if(currentList.length){
						for (let j = 0; j < currentList.length; j++) {
							const pData = currentList[j]
							if (cData[parentIdentKey.value] === pData[identKey.value]) {
								list.splice(i, 1)
								newList.push(cData)
								i--
								break
							}
						}
					}
				}
			} else {
				currentList = originData.value
				const identList = currentList.map((item) => item[identKey.value])
				for (let i = 0; i < list.length; i++) {
					const cData = list[i]
					// 若当前项的父标识在上一级出现，则添加到当前级
					if (!identList.includes(cData[parentIdentKey.value]) || !cData[identKey.value]) {
						list.splice(i, 1)
						newList.push(cData)
						i--
					}
				}
			}
			const fList = [...finalList,newList ]
			if (list.length) {
				finalList = handleFlatData(list, n + 1, fList)
			} else {
				return fList
			}

		} else {
			// 若只有一层，则返回原始数据
			if (n === -1) {
				finalList = targetList
			}
		}
		return finalList
	}

	// 将数据处理树
	const handleTree = () => {
		if (originData.value.length > 0) {
			const data = handleToTree(originData.value)
			treeData.value = data[0]
			total.value = treeData.value.length
			tableData.value = data[0]
		} else {
			tableData.value = []
		}
	}

	const handleToTree = (data=[])=>{
		const levelList = handleFlatData(data)

		if (levelList.length) {
			// 反向循环添加子集
			for (let i = levelList.length - 1; i > 0; i--) {
				const cList = levelList[i]
				const pList = levelList[i - 1]
				for (let a = 0; a < cList.length; a++) {
					for (let j = 0; j < pList.length; j++) {
						if (cList[a][parentIdentKey.value] === pList[j][identKey.value]) {
							pList[j].children = pList[j].children || []
							pList[j].children.push(cList[a])
						}
					}
				}
			}

		}
		return levelList
	}

	return {
		treeData,
		tableData,
		total,
		bindData,
		tableFilter,
		handleTree
	}
}
