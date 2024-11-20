<template>
	<div class="templatePage-layout">
		<div class="templatePage-layout-topOperate">
			<div class="templatePage-layout-topOperate-left">
				<el-input
					v-model="searchList.belong"
					class="templatePage-layout-topOperate-left-input"
					clearable
					placeholder="根据-归属-查询"
					@change="handleSearch"
				></el-input>
				<el-input
					v-model="searchList.keyword"
					class="templatePage-layout-topOperate-left-input"
					clearable
					placeholder="根据-关键字-查询"
					@change="handleSearch"
				></el-input>
				<el-select
					v-model="searchList.status"
					class="templatePage-layout-topOperate-left-input"
					clearable
					placeholder="根据-状态-查询"
					@change="handleSearch"
				>
					<el-option :key="1" :label="'已启用'" :value="1"></el-option>
					<el-option :key="0" :label="'未启用'" :value="0"></el-option>
				</el-select>
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
				@selection-change="handleSelect"
			>
				<template #empty>
					<el-empty description="暂无描述" />
				</template>
				<el-table-column
					:show-overflow-tooltip="false"
					align="center"
					fixed="left"
					type="selection"
					width="60"
				/>
				<el-table-column align="center" fixed="left" label="序号" width="60">
					<template #default="{ $index }"
						>{{ $index + 1 + (searchList.current - 1) * searchList.size }}
					</template>
				</el-table-column>
				<el-table-column align="center" label="创建者" prop="createBy" />
				<el-table-column
					align="center"
					label="创建时间"
					prop="createTime"
					width="200px"
				/>
				<el-table-column
					align="center"
					label="更新时间"
					prop="updateTime"
					width="200px"
				/>
				<el-table-column align="center" label="归属" prop="belong" />
				<el-table-column align="center" label="归属说明" prop="statement" />

				<el-table-column align="center" label="关键字" prop="keyword" />
				<el-table-column align="center" label="参数" prop="param" />
				<el-table-column align="center" label="值" prop="val" />
				<el-table-column align="left" label="属性说明" prop="state" />
				<el-table-column align="center" label="状态" prop="status">
					<template #default="{ row }">
						{{ row.status === 1 ? "启用中" : "未启用" }}
					</template>
				</el-table-column>
				<el-table-column align="center" fixed="right" label="操作" width="180">
					<template #default="{ row }">
						<el-button
							v-has="'dictionaries-update'"
							icon="Edit"
							link
							type="primary"
							@click="editBtn(row)"
							>编辑
						</el-button>
						<el-button
							v-has="'dictionaries-del'"
							icon="Delete"
							link
							type="danger"
							@click="delBtn(row)"
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
		<save-dialog
			v-model:modelValue="saveDialogData.visible"
			:origin-data="saveDialogData.data"
			@get-list="getList"
		/>
	</div>
</template>

<script setup>
import { ref, reactive, nextTick } from "vue"
import moreOperate from "@/components/MoreOperate"
import saveDialog from "./saveDialog.vue"
import { getDictionaryPage, delDictionary } from "@/api/dictionary/index.js"

const loading = ref(false)

// 弹出框配置
const saveDialogData = reactive({
	visible: false,
	data: {}
})

// 查询条件
const searchList = reactive({
	current: 1,
	size: 20
})

// 已选中的项的id数组
const selectIds = ref([])

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
			},
			vHas: "dictionaries-save"
		},
		{
			name: "删除",
			bind: {
				command: {
					fn: multipleDelete
				},
				icon: "Delete"
			},
			vHas: "dictionaries-del"
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
function getList() {
	loading.value = true
	getDictionaryPage(searchList).then((res) => {
		// 数据需要处理 是否已删除  状态
		tableData.value = res.records.map((item) => {
			return item
		})
		console.log(tableData.value)
		searchList.current = res.current
		searchList.size = res.size
		total.value = res.total
	})
	loading.value = false
}

// 新增按钮
function addBtn() {
	saveDialogData.data = {}
	saveDialogData.visible = true
}

// 编辑按钮
function editBtn(e) {
	saveDialogData.data = { ...e }
	nextTick(() => {
		saveDialogData.visible = true
	})
}

// 多选时
function handleSelect(items) {
	selectIds.value = items.map((item) => item.id)
}

// 删除多个时
function multipleDelete() {
	if (selectIds.value.length < 1) {
		return ElMessage.warning("请选择要删除的数据")
	}
	ElMessageBox.confirm("是否确认删除?", "提示", {
		confirmButtonText: "确认",
		cancelButtonText: "取消",
		type: "warning"
	})
		.then(async () => {
			await delDictionary(selectIds.value)
			selectIds.value = []
			getList()
			ElMessage.success("删除成功")
		})
		.catch(() => {
			ElMessage({
				type: "info",
				message: "取消操作"
			})
		})
}

// 删除按钮
function delBtn(e) {
	ElMessageBox.confirm("是否确认删除?", "提示", {
		confirmButtonText: "确认",
		cancelButtonText: "取消",
		type: "warning"
	})
		.then(async () => {
			await delDictionary([e.id])
			ElMessage.success("删除成功")
			getList()
		})
		.catch(() => {
			ElMessage({
				type: "info",
				message: "取消操作"
			})
		})
}

getList()
</script>

<style lang="scss" scoped>
.templatePage-layout-topOperate-left-input {
	margin-right: 10px;
}
</style>
