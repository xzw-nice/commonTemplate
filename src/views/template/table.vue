<template>
	<div class="templatePage-layout">
		<div class="templatePage-layout-topOperate">
			<div class="templatePage-layout-topOperate-left">
				<div class="templatePage-layout-topOperate-left-defaultFilter">
					<el-input
						v-model="searchList.name"
						class="templatePage-layout-topOperate-left-input"
						clearable
						placeholder="输入关键词搜索"
						@change="handleSearch"
					></el-input>
				</div>
				<div class="templatePage-layout-topOperate-left-moreFilter">
					<el-popover
						ref="filterPopoverRef"
						title="更多筛选"
						trigger="click"
						:width="filterOptions.width"
						v-model:visible="filterOptions.visible"
						:teleported="false"
					>
						<template #reference>
							<el-button type="warning" icon="Filter">更多筛选</el-button>
						</template>
						<div class="moreFilter-popover">
							<div class="moreFilter-popover-form">
								<el-form :model="filterOptions.form" inline label-position="right" :label-width="filterOptions.labelWidth">
									<el-row :gutter="item.gutter" v-for="(item,index) in filterOptions.options" :key="index">
										<el-col v-for="m in item.formItems" :key="m.prop" :span="m.span">
											<el-form-item :label="m.label">
												<component v-model="filterOptions.form[m.prop]" :is="m.component" v-bind="m.bind">
													<template v-if="m.selectOptions">
														<el-option v-for="a in m.selectOptions" :key="a.value" :label="a.label" :value="a.value"></el-option>
													</template>
												</component>
											</el-form-item>
										</el-col>
									</el-row>
								</el-form>
							</div>
							<div class="moreFilter-popover-operate">
								<div class="moreFilter-popover-operate-left">
									<el-button @click="cancelFilter">取消</el-button>
								</div>
								<div class="moreFilter-popover-operate-right">
									<el-button @click="resetFilter" type="warning">重置</el-button>
									<el-button @click="confirmFilter" type="primary">筛选</el-button>
								</div>
							</div>
						</div>
					</el-popover>
				</div>
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
import {cloneDeep} from "lodash";


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

const filterPopoverRef = ref(null)

// 更多筛选配置
const filterOptions = reactive({
	visible:false,
	width: 800,
	form:{
		name:"",
		gender:""
	},
	labelWidth:"130px",
	options:[
		{
			gutter:16,
			formItems:[
				{
					span:12,
					label:"姓名",
					component:"ElInput",
					prop:"name",
					bind:{
						clearable:true,
						placeholder:"输入姓名"
					}
				},
				{
					span:12,
					label:"性别",
					component:"ElSelect",
					prop:"gender",
					selectOptions:[
						{
							label:"男",
							value:true
						},
						{
							label:"女",
							value:false
						}
					],
					bind:{
						placeholder:"选择性别",
						clearable: true,
						teleported:false,
						appendTo: filterPopoverRef.value
					}
				}
			]
		},
		{

		}
	]
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

// 更多筛选取消
function cancelFilter(){
	filterOptions.visible = false
}

// 重置筛选
function resetFilter(){
	for (const i in filterOptions.form) {
		switch (typeof filterOptions.form[i]) {
			case 'string':
				filterOptions.form[i] = '';
				break;
			case 'number':
				filterOptions.form[i] = null;
				break;
			case 'boolean':
				filterOptions.form[i] = "";
				break;
			case 'object':
				if (filterOptions.form[i] === null) {
					filterOptions.form[i] = null;
				} else if (Array.isArray(filterOptions.form[i])) {
					filterOptions.form[i] = [];
				} else {
					filterOptions.form[i] = {};
				}
				break;
			default:
				filterOptions.form[i] = null;
		}
	}
}

// 更多筛选确认
function confirmFilter(){
	for (const i in filterOptions.form) {
		searchList[i] = cloneDeep(filterOptions.form[i])
	}
	handleSearch()
	filterOptions.visible = false
}

getList()
</script>

<style lang="scss" scoped>
.moreFilter-popover{
	&-form{
		:deep(.el-form-item){
			width: 100%;
		}
	}
	&-operate{
		@include flex(space-between);
	}
}
</style>
