<template>
	<el-dialog
		v-model="visible"
		:close-on-click-modal="false"
		:title="form.id ? '编辑' : '新增'"
		style="min-width: 540px"
		width="40vw"
	>
		<el-form
			ref="dialogForm_ref"
			:model="form"
			:rules="formRules"
			class="saveDialog-form"
			inline
			label-width="120px"
			label-position="right"
		>
			<el-form-item label="上级部门：">
				<el-cascader
					v-model="form.pid"
					:options="baseOptions"
					:props="{
						label: 'name',
						value: 'id',
						children: 'children',
						checkStrictly: true
					}"
					:show-all-levels="false"
					placeholder="请选择上级部门"
				/>
			</el-form-item>
			<el-form-item label="部门名称：">
				<el-input
					v-model="form.name"
					clearable
					placeholder="请输入名称"
				></el-input>
			</el-form-item>
			<el-form-item label="序号：">
				<el-input-number
					v-model="form.ord"
					placeholder="请输入序号"
				></el-input-number>
			</el-form-item>
			<el-form-item label="是否启用：">
				<el-switch
					v-model="form.status"
					:active-value="1"
					:inactive-value="0"
					active-color="#13ce66"
					class="table_switch"
					inactive-color="#ff4949"
				/>
			</el-form-item>
		</el-form>
		<div slot="footer" class="saveDialog-footer">
			<el-button @click="handleClose">关闭</el-button>
			<el-button type="primary" @click="handleSubmit">提交</el-button>
		</div>
	</el-dialog>
</template>

<script setup>
import { ref, computed, watch } from "vue"
import {
	addDepartment,
	updateDepartment
} from "@/api/systemManage/departmentManage/index.js"
import { reverseTreeQuery } from "@/utils/global.ts"

const props = defineProps({
	// 弹框显隐
	modelValue: {
		type: Boolean,
		default: false
	},
	// 原始数据
	originData: {
		type: Object,
		default: () => ({})
	},
	// 部门树形列表
	departTreeList: {
		type: Array,
		default: () => []
	}
})

const emit = defineEmits(["update:modelValue", "getList"])

// 表单ref
const dialogForm_ref = ref()

// 树形基地列表
const baseOptions = computed(() => {
	return [{ name: "顶级部门", id: "0", children: [] }, ...props.departTreeList]
})

// 双向绑定modelValue
const visible = computed({
	get: () => props.modelValue,
	set: (value) => {
		if (!value && dialogForm_ref.value) {
			dialogForm_ref.value.resetFields()
		}
		emit("update:modelValue", value)
	}
})

// 表单
const form = ref({
	pid: [], // 父编号
	name: "", // 名称
	status: 1, // 状态
	ord: null
})

// 表单校验
const formRules = {
	title: [{ required: true, message: "名称不能为空", trigger: "blur" }]
}

// 弹框关闭
function handleClose() {
	visible.value = false
}

// 提交
async function handleSubmit() {
	if (!dialogForm_ref.value) {
		return
	}
	await dialogForm_ref.value.validate(async (valid) => {
		if (valid) {
			const request = form.value.id ? updateDepartment : addDepartment
			try {
				await request({
					...form.value,
					pid: form.value.pid.at(-1)
				})
				emit("getList")
				visible.value = false
				ElMessage.success("操作成功")
			} catch (e) {
				console.log(e)
			}
		}
	})
}

// 监听表单数据变化
watch(
	() => props.originData,
	(val) => {
		if (val.id) {
			form.value = {
				...val,
				pid: reverseTreeQuery(props.departTreeList, val.pid, "id").split(",")
			}
		} else {
			form.value = {
				pid: [], // 父编号
				name: "", // 名称
				status: 1, // 状态
				ord: null
			}
		}
	},
	{
		deep: true
	}
)
</script>

<style lang="scss" scoped>
.saveDialog-footer {
	text-align: right;
}
</style>
