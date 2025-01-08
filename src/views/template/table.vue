<template>
	<div class="templatePage-layout">
		<div class="templatePage-layout-topOperate">
			<div class="templatePage-layout-topOperate-left">
				<el-input
					v-model="searchList.name"
					class="templatePage-layout-topOperate-left-input"
					clearable
					placeholder="输入关键词搜索"
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
				show-overflow-tooltip
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
				<el-table-column
					align="center"
					fixed="left"
					label="序号"
					prop="index"
					width="60"
				>
					<template #default="{ $index }">
						{{ (searchList.current - 1) * searchList.size + $index + 1 }}
					</template>
				</el-table-column>
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

<script setup>
import { ref, reactive, nextTick } from "vue"
import moreOperate from "@/components/MoreOperate"

const loading = ref(false)

// 弹出框配置
const saveDialogData = reactive({
	visible: false,
	data: {}
})

// 查询条件
const searchList = reactive({
	name: "",
	current: 1,
	size: 20
})

// 总数据
const total = ref(0)

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

// 手动查询
function handleSearch() {
	searchList.current = 1
	getList()
}

// 获取列表数据
function getList() {}

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

// 删除按钮
function delBtn(e) {
	ElMessageBox.confirm("是否确认删除?", "提示", {
		confirmButtonText: "确认",
		cancelButtonText: "取消",
		type: "warning"
	})
		.then(() => {})
		.catch(() => {
			ElMessage({
				type: "info",
				message: "取消操作"
			})
		})
}

getList()
</script>

<style lang="scss" scoped></style>
