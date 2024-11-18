<template>
	<div v-loading="downloading" class="templatePage-layout">
		<div class="templatePage-layout-topOperate">
			<div class="templatePage-layout-topOperate-left">
				<div class="date">
					<el-date-picker
						v-model="timeRange"
						clearable
						date-format="YYYY/MM/DD"
						end-placeholder="结束日期"
						format="YYYY-MM-DD"
						prefix-icon="calendar"
						range-separator="至"
						start-placeholder="开始日期"
						time-format="YYYY-MM-DD"
						type="datetimerange"
						unlink-panels
						value-format="YYYY-MM-DD"
						@change="handleSearch"
					/>
				</div>
			</div>
			<div class="templatePage-layout-topOperate-right">
				<moreOperate
					:dropdown-events="{ command: dropdown.event }"
					:dropdown-item="dropdown.list"
				/>
			</div>
		</div>
		<div v-loading="loading" class="templatePage-layout-table">
			<el-table
				:data="tableData"
				border
				empty-text=""
				lazy
				row-key="id"
				show-overflow-tooltip
			>
				<template #empty>
					<el-empty description="暂无数据" />
				</template>
				<el-table-column align="center" fixed="left" label="序号" width="60">
					<template #default="{ $index }">
						{{ (searchList.current - 1) * searchList.size + $index + 1 }}
					</template>
				</el-table-column>
				<el-table-column align="center" label="用户id" prop="id" />
				<el-table-column align="center" label="请求状态" prop="" />
				<el-table-column align="center" label="请求方式" prop="method" />
				<el-table-column
					align="center"
					label="请求路径"
					prop="requestURI"
					show-overflow-tooltip
				/>
				<el-table-column align="center" label="请求参数" prop="queryString" />
				<el-table-column
					align="center"
					label="客户端主机名/IP"
					prop="remoteHost"
				/>
				<el-table-column
					align="center"
					label="请求协议类型及版本"
					prop="protocol"
				/>
				<el-table-column
					align="center"
					label="请求概略信息"
					prop="requestURL"
					show-overflow-tooltip
				/>
				<el-table-column align="center" label="响应时间" prop="answer" />
				<el-table-column
					align="center"
					label="创建时间"
					prop="createTime"
					width="200px"
				/>
			</el-table>
			<el-pagination
				v-model:current-page="searchList.current"
				v-model:page-size="searchList.size"
				:page-sizes="[20, 30, 40, 50, 100]"
				:total="total"
				class="templatePage-layout-table-pagination"
				layout="total, sizes, prev, pager, next, jumper"
				@size-change="getList"
				@current-change="getList"
			/>
		</div>
	</div>
</template>

<script name="templatePage-layout" setup>
import { ref, reactive } from "vue"
import moreOperate from "@/components/MoreOperate/index.vue"
import {
	getDataLogs,
	downloadDataLogsExcel
} from "@/api/systemManage/logManage/dataLogs/index.js"
import { downLoadFile } from "@/utils/global.ts"

const downloading = ref(false)
const loading = ref(false) // 表格加载
// 弹出框配置
const saveDialogData = reactive({
	visible: false,
	data: {}
})

// 更多操作配置
const dropdown = reactive({
	list: [
		{
			name: "导出",
			bind: {
				command: {
					fn: download
				},
				icon: "Plus"
			}
		}
	],
	event(e) {
		e.fn()
	}
})

const timeRange = ref([]) //时间范围

// 查询条件
const searchList = reactive({
	beginTime: "",
	endTime: "",
	current: 1,
	size: 20
})

// 总数据
const total = ref(0)

// 表格数据
const tableData = ref([])

// 手动查询
function handleSearch() {
	searchList.current = 1
	// 如果有长度就请求 没长度说明点了清空则重置
	if (timeRange.value?.length) {
		searchList.beginTime = timeRange.value[0]
		searchList.endTime = timeRange.value[1]
	} else {
		searchList.beginTime = ""
		searchList.endTime = ""
	}
	getList()
}

// 获取列表数据
function getList() {
	getDataLogs(searchList).then((res) => {
		loading.value = true
		tableData.value = res.records
		searchList.current = res.current
		searchList.size = res.size
		total.value = res.total
		loading.value = false
	})
}

// 导出excel ...
function download() {
	downloading.value = true
	if (timeRange.value?.length) {
		searchList.beginTime = timeRange.value[0]
		searchList.endTime = timeRange.value[1]
	}

	downloadDataLogsExcel(searchList).then((res) => {
		console.log(res)
		if (res?.code && res.code === 500) {
			downloading.value = false
		} else {
			downLoadFile(res).finally(() => {
				downloading.value = false
			})
		}
	})
	// }, 1000)
}

getList()
</script>

<style lang="scss" scoped>
.date {
	width: 25%;
}
</style>
