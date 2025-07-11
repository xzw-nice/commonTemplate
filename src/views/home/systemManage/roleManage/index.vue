<template>
	<div class="systemManage-roleManage">
		<div class="systemManage-roleManage-left">
			<div class="roleManage-topOperate">
				<div class="roleManage-topOperate-left">
					<el-form
						:inline="true"
						:model="searchList"
						class="demo-form-inline s1"
					>
						<el-form-item>
							<el-input
								v-model="searchList.name"
								class="roleManage-topOperate-left-input"
								clearable
								placeholder="输入角色名称查询"
								@change="getList"
							></el-input>
						</el-form-item>
					</el-form>
				</div>
				<div class="roleManage-topOperate-right">
					<more-operate
						:dropdown-events="{ command: dropdown.event }"
						:dropdown-item="dropdown.list"
					/>
				</div>
			</div>
			<div class="roleManage-table">
				<div v-loading="loading">
					<el-table
						:data="tableData"
						border
						row-key="id"
						show-overflow-tooltip
						style="width: 100%"
					>
						<template #empty>
							<el-empty description="暂无描述" />
						</template>
						<el-table-column
							align="center"
							fixed="left"
							label="序号"
							width="60"
						>
							<template #default="prop">
								{{
									(searchList.current - 1) * searchList.size + prop.$index + 1
								}}
							</template>
						</el-table-column>

						<el-table-column align="center" label="角色名" prop="name" />

						<el-table-column align="center" label="状态" prop="status">
							<template #default="prop">
								<el-switch
									v-model="tableData[prop.$index].status"
									:active-value="1"
									:inactive-value="0"
									active-color="#13ce66"
									active-text="启用"
									class="table_switch"
									inactive-color="#ff4949"
									inactive-text="禁用"
									@change="switchChange($event, prop.$index, 'status')"
								/>
							</template>
						</el-table-column>
						<el-table-column align="center" label="默认角色" prop="isDefault">
							<template #default="prop">
								<el-switch
									v-model="prop.row.isDefault"
									:active-value="true"
									:inactive-value="false"
									active-color="#13ce66"
									active-text="是"
									class="table_switch"
									inactive-color="#ff4949"
									inactive-text="否"
									@change="switchChange($event, prop.$index, 'isDefault')"
								/>
							</template>
						</el-table-column>

						<el-table-column
							align="center"
							fixed="right"
							label="操作"
							width="250"
						>
							<template #default="scope">
								<el-button
									link
									type="primary"
                  v-has="'sys:role:update'"
									@click="handleEdit(scope.row)"
									>编辑
									<el-icon class="el-icon--right">
										<Edit />
									</el-icon>
								</el-button>
								<el-popconfirm

									cancel-button-text="取消"
									confirm-button-text="确认"
									icon="Delete"
									icon-color="#626AEF"
									title="确认要删除此角色吗?"
									width="220"
									@confirm="handleDelete(scope.row)"
								>
									<template #reference>
										<el-button v-has="'sys:role:del'" link type="danger"
											>删除
											<el-icon class="el-icon--right">
												<Delete />
											</el-icon>
										</el-button>
									</template>
								</el-popconfirm>

								<el-button
									link
									type="warning"
									@click="menuConfiguration(scope.row)"
									>菜单分配
									<el-icon class="el-icon--right">
										<Right />
									</el-icon>
								</el-button>
							</template>
						</el-table-column>
					</el-table>
					<el-pagination
						v-model:current-page="searchList.current"
						v-model:page-size="searchList.size"
						:page-sizes="[20, 30, 40, 50, 100]"
						:total="total"
						class="roleManage-table-pagination"
						layout="total, sizes, prev, pager, next, jumper"
						@size-change="getList"
						@current-change="getList"
					/>
				</div>
			</div>
		</div>
		<div class="systemManage-roleManage-right">
			<div class="title">
				<el-button class="divide" icon="Operation" type="warning">
					菜单分配
				</el-button>
			</div>
			<div class="treeWrap">
				<el-tree
					:key="treeKey"
					ref="menuTree"
          check-strictly
					:data="menuList"
					:default-expanded-keys="roleMenus"
					:props="defaultProps"
					accordion
					highlight-current
					node-key="id"
					show-checkbox
				/>
			</div>
			<el-button
				class="saveBtn"
				icon="List"
				style="width: 100%"
				type="primary"
        v-has="'sys:menu:reset'"
				@click="saveRoleMenus"
			>
				保存
			</el-button>
		</div>
		<addUpdate
			ref="addUpdateRef"
			:edit-data="saveDialogData.data"
			:is-edit="isEdit"
			@restList="getList"
		/>
	</div>
</template>

<script setup>
import { nextTick, reactive, ref } from "vue"
import {
	getRoleList,
	roleDel,
	roleEdit,
	restRoleMenu
} from "@/api/systemManage/roleManage"
import addUpdate from "./components/addUpdate.vue"
import { getMenu, getMenuTree } from "@/api/systemManage/menuManage/index.js"
import { Delete, Edit, Right } from "@element-plus/icons"
import { debounce } from "lodash"
import { ElMessage } from "element-plus"
// 查询条件
const searchList = reactive({
	name: "",
	current: 1,
	size: 20
})

const total = ref(0)

const loading = ref(false)

const tableData = ref([])

const isEdit = ref(false) // 修改 || 编辑

const menuTree = ref(null)
const nameNow = ref("") //分配菜单时的角色名
const menuList = ref([]) //菜单列表
const roleMenus = ref([]) // 默认展开的角色菜单
const roleId = ref("") // 当前分配菜单的角色ID
const treeKey = ref(1)
const check_strictly = ref(true)
const defaultProps = reactive({
	children: "children",
	label: "name"
})

// 下拉项配置
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
      vHas:"sys:role:save"
		}
	],
	event(e) {
		e.fn()
	}
})

// 新增、编辑 组件实例
const addUpdateRef = ref(null)
// // 新增、编辑弹出框
const saveDialogData = reactive({
	// visible: addUpdateRef.value,
	data: {}
})

// 获取表格数据
function getList() {
	loading.value = true
	tableData.value = []
	getRoleList(searchList).then((res) => {
		tableData.value = res.records
		loading.value = false
		searchList.current = res.current
		searchList.size = res.size
		total.value = res.total
	})
}

// 取消转换
function cancelSwitch() {
	getList()
}

// 设置角色状态
async function setStatus(status, id) {
	await roleEdit({ status, id })
	ElMessage.success(status === 1 ? "已启用" : "已禁用")
}

function switchChange(e, index, key) {
	ElMessageBox.confirm("是否确认操作?", "提示", {
		confirmButtonText: "确认",
		cancelButtonText: "取消",
		type: "warning"
	})
		.then(() => {
			if (key === "status") {
				roleEdit({ status: e, id: tableData.value[index].id }).then(() => {
					ElMessage.success(e ? "已启用" : "已禁用")
				})
			} else if (key === "isDefault") {
				roleEdit({ isDefault: e, id: tableData.value[index].id }).then(() => {
					ElMessage.success(e ? "已设为默认角色" : "已取消默认角色")
				})
			}
		})
		.catch(() => {
			tableData.value[index][key] = typeof e === "number" ? (e ? 0 : 1) : !e
		})
}

// 设置角色为默认
async function setDefaultRole(isDefault, id) {
	await roleEdit({ isDefault, id })
	ElMessage.success(isDefault ? "已设为默认角色" : "已设为非默认角色")
}

// 新增按钮点击时
function addBtn() {
	saveDialogData.data = {}
	isEdit.value = false
	nextTick(() => {
		addUpdateRef.value.dialogVisible = true
	})
}

// 修改按钮点击时
function handleEdit(row) {
	saveDialogData.data = Object.assign({}, row)
	isEdit.value = true
	nextTick(() => {
		addUpdateRef.value.dialogVisible = true
	})
}

// 删除
async function handleDelete(row) {
	await roleDel([row.id])
	ElMessage.success("删除成功")
	getList()
}

// 获取菜单树
async function getMenuTreeData() {
	loading.value = true
	menuList.value = []
	menuList.value = await getMenuTree({ isAll: true })
	loading.value = false
}

// 获取
function menuConfiguration(con) {
	roleId.value = con.id
	// 获取当前角色的菜单信息
	getMenu({ roleId: roleId.value, size: -1 }).then((res) => {
		console.log(res)
		nextTick(() => {
			check_strictly.value = true // 选中父节点 子节点不自动选中
			if (res) {
				// 设置勾选的节点
				menuTree.value.setCheckedNodes(res.records)
				// 设置默认展开的节点数组
				const flattenArr = flatten(menuList.value)
				// 展开菜单树所有
				roleMenus.value = flattenArr.map((item) => item.id)
			}
		})
	})
	nameNow.value = con.name
}

// 将二维数组转化为一维数组
function flatten(treeMenu, result) {
	result = result || []
	treeMenu.map((menu) => {
		result.push(menu)
		if (menu.children) {
			flatten(menu.children, result)
		}
	})
	return result
}

// 保存菜单
const saveRoleMenus = debounce(async () => {
	// 角色菜单为空
	roleMenus.value = []
	// 返回选中子节点的key
	const arr = menuTree.value.getCheckedKeys()
	// 返回选中子节点的父节点的key
	const arr1 = menuTree.value.getHalfCheckedNodes().map((item) => item.id)
	roleMenus.value.push(...arr, ...arr1)
	if (roleId.value) {
		// 判断角色菜单是否有内容
		if (roleMenus.value.length > 0) {
			const obj = {}
			obj.menuIds = roleMenus.value
			obj.roleId = roleId.value
			console.log(obj)
			// 调用角色菜单保存接口
			await restRoleMenu(obj)
			ElMessage.success(nameNow.value + "--菜单配置成功")
			menuConfiguration({ id: roleId.value })
		} else {
			ElMessage.error("所选菜单不能为空")
		}
	} else {
		ElMessage.error("请指定角色后操作")
	}
},500)

getList()
getMenuTreeData()
</script>

<style lang="scss" scoped>
.systemManage-roleManage {
	@include flex;

	&-left {
		width: calc(100% - 240px - 24px);
		height: 100%;
	}

	&-right {
		width: 240px;
		height: 100%;
		margin-left: 24px;
	}

	.roleManage-topOperate {
		@include flex(flex-start, flex-start);

		&-left {
			flex: 1;
			margin-right: 24px;

			&-input {
				width: 270px !important;
			}
		}
	}

	.roleManage-table {
		height: calc(100% - 36px - 24px);

		> div {
			height: 100%;

			.el-table {
				height: calc(100% - 36px - 12px);
				margin-bottom: 12px;
			}

			.el-pagination {
				display: flex;
				justify-content: flex-end;
			}
		}
	}

	.roleManage-tableTree-label-menuName {
		@include flex;
	}
}

.systemManage-roleManage-right {
	position: relative;
	display: flex;
	flex-direction: column;
	background-color: #fff;

	.title {
		@include flex(flex-start, center);
		width: 100%;
		font-size: 13px;
		color: #fff;
		font-weight: 600;

		.el-button {
			display: flex;
			justify-content: flex-start;
			width: 100%;
			font-weight: 600;
			background: #ffc833;
			border-color: #ffc833;
		}
	}

	:deep(.treeWrap) {
		height: 90%;
		overflow: scroll;
		overflow-x: hidden;
		overflow-y: auto; // 设置垂直方向上的滚动条
		scrollbar-width: none; // 兼容火狐
		-ms-overflow-style: none; // 兼容IE10+
		/*  解决 ios 上滑动不流畅 */
		-webkit-overflow-scrolling: touch;

		// 隐藏滚动条，兼容 chrome 和 safari 浏览器

		::-webkit-scrollbar {
			display: none;
		}

		.el-tree-node__content {
			//padding-left: 0 !important;
		}
	}

	.saveBtn {
		position: absolute;
		bottom: 0;
		width: 100%;
		text-align: center;
	}
}

.nameNow {
	color: #fff;
	font-size: 13px;
}
</style>
