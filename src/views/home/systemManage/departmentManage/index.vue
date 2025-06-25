<template>
	<div class="templatePage-layout">
		<div class="templatePage-layout-topOperate">
			<div class="templatePage-layout-topOperate-left">
				<el-input
					v-model="searchList.deptName"
					class="templatePage-layout-topOperate-left-input"
					clearable
					placeholder="输入部门名称搜索"
					@change="handleSearch"
				></el-input>
			</div>
			<div class="templatePage-layout-topOperate-right">
				<more-operate
					:dropdown-events="{ command: dropdown.event }"
					:dropdown-item="dropdown.list"
				/>
			</div>
		</div>
		<div v-loading="loading" class="templatePage-layout-table">
			<el-table
				:data="tableData"
				border
				lazy
				row-key="id"
				@selection-change="multipleDel"
			>
				<template #empty>
					<el-empty description="暂无数据" />
				</template>
				<el-table-column
					:show-overflow-tooltip="false"
					align="center"
					fixed="left"
					prop="selection"
					type="selection"
					width="50"
				></el-table-column>
				<!--				<el-table-column-->
				<!--					align="center"-->
				<!--					fixed="left"-->
				<!--					label="序号"-->
				<!--					prop="index"-->
				<!--					width="60"-->
				<!--				>-->
				<!--					<template #default="{ $index }">-->
				<!--						{{ (searchList.current - 1) * searchList.size + $index + 1 }}-->
				<!--					</template>-->
				<!--				</el-table-column>-->
				<el-table-column
					align="left"
					prop="name"
					label="部门名称"
					header-align="center"
				></el-table-column>
				<el-table-column align="center" prop="status" label="部门状态">
					<template #default="{ row }">
						<el-switch
							v-model="row['status']"
							:active-value="1"
							:inactive-value="0"
							active-text="启用"
							inactive-text="禁用"
							active-color="#ff4949"
							class="table_switch"
							inactive-color="#13ce66"
							@change="handleToggleState(row)"
						/>
					</template>
				</el-table-column>
				<!--				<el-table-column-->
				<!--					width="80"-->
				<!--					align="center"-->
				<!--					prop="ord"-->
				<!--					label="序号"-->
				<!--				></el-table-column>-->
				<el-table-column align="center" fixed="right" label="操作" width="180">
					<template #default="{ row }">
						<el-button icon="Edit" link type="primary" @click="editBtn(row)"
							>编辑
						</el-button>
						<el-button icon="Delete" link type="danger" @click="delBtn(row)"
							>删除
						</el-button>
					</template>
				</el-table-column>
			</el-table>
			<!--			<el-pagination-->
			<!--				v-model:current-page="searchList.current"-->
			<!--				v-model:page-size="searchList.size"-->
			<!--				:page-sizes="[20, 30, 40, 50, 100]"-->
			<!--				:total="total"-->
			<!--				class="templatePage-layout-table-pagination"-->
			<!--				layout="total, sizes, prev, pager, next, jumper"-->
			<!--				@size-change="getList"-->
			<!--				@current-change="getList"-->
			<!--			/>-->
		</div>
		<save-dialog
			v-model="saveDialogData.visible"
			:origin-data="saveDialogData.data"
			:depart-tree-list="tableData"
			@getList="getList"
		/>
	</div>
</template>

<script setup>
import { ref, reactive, nextTick } from "vue"
import moreOperate from "@/components/MoreOperate"
import SaveDialog from "@/views/home/systemManage/departmentManage/saveDialog.vue"
import {
	getDepartmentTree,
	delDepartment,
	updateDepartment
} from "@/api/systemManage/departmentManage/index.js"

const loading = ref(false)

// 弹出框配置
const saveDialogData = reactive({
	visible: false,
	data: {}
})

// 查询条件
const searchList = reactive({
	deptName: ""
	// current: 1,
	// size: 20
})

// // 总数据
// const total = ref(0)

// 更多操作配置
const dropdown = reactive({
	list: [
		{
			name: "新增",
			bind: {
				command: {
					fn: addBtn
				},
				icon: "Plus"
			}
		},
		{
			name: "删除",
			bind: {
				command: {
					fn: delBtn
				},
				icon: "Delete"
			}
		}
	],
	event(e) {
		e.fn()
	}
})

// 表格数据
const tableData = ref([])

// 删除选中的行
const selectIds = ref([])

// 手动查询
function handleSearch() {
	searchList.current = 1
	getList()
}

// 获取部门树数据
function getList() {
	getDepartmentTree({
		...searchList,
		isAll: true
	}).then((res) => {
		if (res?.length) {
			tableData.value = res
		} else {
			tableData.value = []
		}
	})
}

// 新增按钮
function addBtn() {
	saveDialogData.data = {}
	nextTick(() => {
		saveDialogData.visible = true
	})
}

// 编辑按钮
function editBtn(e) {
	saveDialogData.data = { ...e }
	nextTick(() => {
		saveDialogData.visible = true
	})
}

// 多选删除
function multipleDel(e) {
	selectIds.value = e
}

// 删除按钮
function delBtn(e) {
	const delIds = e ? [e.id] : selectIds.value.map((item) => item.id)
	if (!delIds.length) {
		return ElMessage.warning("请选择要删除的项")
	}
	ElMessageBox.confirm("是否确认删除?", "提示", {
		confirmButtonText: "确认",
		cancelButtonText: "取消",
		type: "warning"
	})
		.then(() => {
			delDepartment(delIds).then(() => {
				getList()
				ElMessage.success("删除成功")
			})
		})
		.catch(() => {
			ElMessage({
				type: "info",
				message: "取消操作"
			})
		})
}

// 手动切换状态
function handleToggleState(row) {
	ElMessageBox.confirm("是否确认切换状态?", "提示", {
		confirmButtonText: "确认",
		cancelButtonText: "取消",
		type: "warning"
	})
		.then(() => {
			updateDepartment(row).then(() => {
				getList()
				ElMessage.success("状态切换成功")
			})
		})
		.catch(() => {
			row.status = row.status === 1 ? 0 : 1
			ElMessage({
				type: "info",
				message: "取消操作"
			})
			// getList()
		})
}

getList()
</script>

<style lang="scss" scoped></style>
