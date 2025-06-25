<template>
	<div class="templatePage-layout">
		<div class="templatePage-layout-topOperate">
			<div class="templatePage-layout-topOperate-left">
				<el-input
					v-model="listQuery.userName"
					class="templatePage-layout-topOperate-left-input"
					clearable
					placeholder="输入用户名搜索"
					@change="getList"
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
				@selectionChange="handleSelect"
			>
				<template #empty>
					<el-empty description="暂无描述" />
				</template>
				<el-table-column
					:show-overflow-tooltip="false"
					align="center"
					type="selection"
					width="60"
				></el-table-column>
				<el-table-column
					:show-overflow-tooltip="false"
					align="center"
					fixed="left"
					label="序号"
					type="index"
					width="70"
				>
				</el-table-column>
				<el-table-column align="center" label="用户名" prop="userName" />
				<el-table-column align="center" label="登录账号" prop="loginName" />
				<el-table-column align="center" label="手机号" prop="phone" />
				<el-table-column align="center" label="邮箱" prop="email" />
				<el-table-column align="center" label="状态" prop="status" width="180">
					<template #default="prop">
						<el-popconfirm
							:confirm-button-text="prop.row.status === 1 ? '启用' : '禁用'"
							:title="prop.row.status === 1 ? '确定启用吗？' : '确定禁用吗？'"
							cancel-button-text="取消"
							confirm-button-type="text"
							icon="el-icon-info"
							icon-color="red"
							@cancel="getList"
							@confirm="changeSwitch(prop.row.status, prop.row.id)"
						>
							<template #reference>
								<el-switch
									v-model="prop.row.status"
									:active-value="1"
									:inactive-value="0"
									active-color="#13ce66"
									active-text="启用"
									class="table_switch"
									inactive-color="#ff4949"
									inactive-text="禁用"
								/>
							</template>
						</el-popconfirm>
					</template>
				</el-table-column>

				<el-table-column align="center" label="详情" width="80">
					<template #default="prop">
						<el-button
							icon="View"
							link
							type="primary"
							@click="getDetail(prop.row.id)"
							>详情
						</el-button>
					</template>
				</el-table-column>

				<el-table-column align="center" fixed="right" label="操作" width="180">
					<template #default="{ row }">
						<el-button
							icon="Edit"
							link
							type="primary"
							@click="handleEdit(row)"
							>编辑
						</el-button>
						<el-button
							icon="Delete"
							link
							type="danger"
							@click="handleDelete(row)"
							>删除
						</el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination
				v-model:current-page="listQuery.current"
				v-model:page-size="listQuery.size"
				:page-sizes="[20, 30, 40, 50, 100]"
				:total="total"
				class="templatePage-layout-table-pagination"
				layout="total, sizes, prev, pager, next, jumper"
				@size-change="getList"
				@current-change="getList"
			/>
		</div>
		<addUpdate
			ref="addUpdateRef"
			:edit-data="editData"
			:is-edit="isEdit"
			:table-data="tableData"
			@rest-list="getList"
		/>
		<userDetail ref="userDetailRef" :user-data="userDetailData" />
	</div>
</template>

<script setup>
import addUpdate from "./components/addUpdate.vue"
import userDetail from "./components/userDetail.vue"
import moreOperate from "@/components/MoreOperate"
import {
	userList,
	getUserDetail,
	deleteUser,
	enableUser
} from "@/api/systemManage/userManage/index.js"
import { nextTick, reactive, ref } from "vue"
import { ElMessage } from "element-plus"

const tableData = ref([]) //表格数据
const listQuery = ref({
	current: 1,
	size: 20,
	userName: ""
}) //列表查询对象
const total = ref(0) //列表条数
const defaultListQuery = {
	current: 1,
	size: 20,
	userName: ""
}
// 新增&修改 显隐
const isEdit = ref(false)
// 修改传递的
const editData = ref({})
// 详情 组件实例
const userDetailRef = ref(null)
// 添加&修改 组件实例
const addUpdateRef = ref(null)
// 用户详情
const userDetailData = ref({})
// 表格加载
const loading = ref(false)
// 下拉项
const dropdown = reactive({
	list: [
		{
			name: "新增",
			bind: {
				command: {
					fn: addUser
				},
				icon: "Plus"
			}
		},
		{
			name: "删除",
			bind: {
				command: {
					fn: handleDelete
				},
				icon: "Delete"
			}
		}
	],
	event(e) {
		e.fn()
	}
})
// 选中的数据
const selectList = ref([])

// 下拉菜单-更多操作命令
function dropDown(e) {
	e.fn()
}

// 查询列表进行防抖

// 查询列表
function getList() {
	loading.value = true
	userList(listQuery.value)
		.then((res) => {
			tableData.value = []
			tableData.value = res.records
			listQuery.value.current = res.current
			listQuery.value.size = res.size
			total.value = res.total
		})
		.finally(() => {
			loading.value = false
		})
}

// 搜索按钮查询
function searchBtn() {
	listQuery.value.current = 1
	getList()
}

// 重置
function searchRest() {
	listQuery.value = { ...defaultListQuery }
	getList()
}

// 条数改变时
function handleSizeChange(val) {
	listQuery.value.size = val
	getList()
}

// 页数改变时
function handleCurrentChange(val) {
	listQuery.value.size = val
	getList()
}

// 状态变更
function cancelSwitch() {
	getList()
}

function changeSwitch(status, id) {
	enableUser(id).then(() => {
		getList()
	})
}

// 点击新增
function addUser() {
	// 弹窗出现
	isEdit.value = false
	nextTick(() => {
		addUpdateRef.value.dialogVisible = true
	})
}

// table复选框
function handleSelect(e) {
	selectList.value = [...e]
}

// 删除
function handleDelete(e) {
	const ids = e ? [e.id] : selectList.value.map((item) => item.id)
	if (!ids.length) {
		return ElMessage.warning("请选择需要删除的数据")
	}
	ElMessageBox.confirm("是否确认删除?", "提示", {
		confirmButtonText: "确认",
		cancelButtonText: "取消",
		type: "warning"
	})
		.then(() => {
			deleteUser(ids).then(() => {
				ElMessage({
					type: "success",
					message: "操作成功"
				})
				getList()
			})
		})
		.catch(() => {
			ElMessage({
				type: "info",
				message: "取消操作"
			})
		})
}

// 详情
function getDetail(id) {
	getUserDetail(id).then((res) => {
		userDetailData.value = res
		nextTick(() => {
			userDetailRef.value.dialogVisible = true
		})
	})
}

// 修改
async function handleEdit(con) {
	editData.value = await getUserDetail(con.id)
	isEdit.value = true
	nextTick(() => {
		addUpdateRef.value.dialogVisible = true
	})
}

getList()
</script>

<style lang="scss" scoped></style>
