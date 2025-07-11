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
			label-width="80px"
		>
			<el-form-item label="名称：" prop="title" required>
				<el-input
					v-model="form.title"
					clearable
					placeholder="请输入名称"
				></el-input>
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
	}
})

const emit = defineEmits(["update:modelValue", "getList"])

// 表单ref
const dialogForm_ref = ref()

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

function getList() {}

// 表单
const form = ref({
	title: "" // 名称
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
			const request = form.value.id ? "编辑接口" : "新增接口"
			try {
				await request({
					...form.value
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
				...val
			}
		} else {
			form.value = {
				title: ""
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
