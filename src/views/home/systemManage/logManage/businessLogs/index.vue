<template>
	<div class="templatePage-layout">
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
				<el-table-column align="center" label="日志内容" prop="param" />
				<el-table-column align="center" label="创建者" prop="createBy" />
				<el-table-column align="center" label="创建时间" prop="createTime" />
				<el-table-column align="center" label="是否已删除">
					<template #default="{ row }">
						{{ row.isDel ? "是" : "否" }}
					</template>
				</el-table-column>
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
import { getBusinessLogs } from "@/api/systemManage/logManage/businessLogs/index.js"

const loading = ref(false)

// 弹出框配置
const saveDialogData = reactive({
	visible: false,
	data: {}
})

const timeRange = ref([]) // 选择的时间范围

// 查询条件
const searchList = reactive({
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
	getBusinessLogs(searchList).then((res) => {
		loading.value = true
		tableData.value = res.records
		searchList.current = res.current
		searchList.size = res.size
		total.value = res.total
		loading.value = false
	})
}

getList()
</script>

<style lang="scss" scoped>
.date {
	width: 25%;
}
</style>
