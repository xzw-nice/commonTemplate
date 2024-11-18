<template>
	<el-dialog
		v-model="visible"
		:close-on-click-modal="false"
		:draggable="true"
		:title="form.id ? '编辑字典' : '新增字典'"
		style="min-width: 540px"
		width="40vw"
	>
		<el-form
			ref="dialogForm_ref"
			:model="form"
			:rules="formRules"
			class="saveDialog-form"
			inline
			label-position="right"
			label-width="auto"
		>
			<el-form-item label="归属：" prop="belong">
				<el-input
					v-model="form.belong"
					clearable
					placeholder="请输入名称"
				></el-input>
			</el-form-item>
			<el-form-item label="归属说明：">
				<el-input
					v-model="form.statement"
					clearable
					placeholder="请输入名称"
				></el-input>
			</el-form-item>
			<el-form-item label="关键字：" prop="keyword">
				<el-input
					v-model="form.keyword"
					clearable
					placeholder="请输入名称"
				></el-input>
			</el-form-item>
			<el-form-item label="参数：">
				<el-input
					v-model="form.param"
					clearable
					placeholder="请输入名称"
				></el-input>
			</el-form-item>
			<el-form-item label="值：">
				<el-input
					v-model="form.val"
					clearable
					placeholder="请输入名称"
				></el-input>
			</el-form-item>
			<el-form-item label="属性说明：">
				<el-input
					v-model="form.state"
					clearable
					placeholder="请输入名称"
				></el-input>
			</el-form-item>
			<el-form-item label="排序：">
				<el-input-number v-model="form.sort" />
			</el-form-item>
			<el-form-item label="状态：">
				<el-switch
					v-model="form.status"
					:active-value="1"
					:inactive-value="0"
					active-color="#13ce66"
					inactive-color="#ff4949"
				/>
			</el-form-item>
		</el-form>
		<template #footer>
			<el-button @click="handleClose">关闭</el-button>
			<el-button type="primary" @click="handleSubmit">提交</el-button>
		</template>
	</el-dialog>
</template>

<script setup>
import { ref, computed, watch } from "vue"
import { addDictionary, editDictionary } from "@/api/dictionary/index.js"
import { debounce } from "radash"

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

// 默认表单
const defaultForm = {
	belong: "", // 归属
	statement: "", // 归属说明
	keyword: "", // 关键字
	param: "", // 参数
	val: "", // 值
	state: "", // 属性说明
	sort: 0, // 排序
	status: 1 // 状态
}

// 表单
const form = ref({ ...defaultForm })

// 表单校验
const formRules = {
	keyword: [{ required: true, message: "必填", trigger: "blur" }],
	belong: [{ required: true, message: "必填", trigger: "blur" }]
}

// 弹框关闭
function handleClose() {
	visible.value = false
}

// 提交
const handleSubmit = debounce({ delay: 500 }, async () => {
	if (!dialogForm_ref.value) {
		return
	}
	await dialogForm_ref.value.validate(async (valid) => {
		if (valid) {
			const request = form.value.id ? editDictionary : addDictionary
			try {
				// 有传递过来的数据则编辑 否则是添加
				await request(form.value)
				emit("getList")
				visible.value = false
				ElMessage.success("操作成功")
			} catch (e) {
				console.log(e)
			}
		}
	})
})

// 监听表单数据变化
watch(
	() => props.originData,
	(val) => {
		// 有id说明点击了编辑 传递过来进行回显
		if (val.id) {
			form.value = {
				...val
			}
		} else {
			// 否则重置表单 添加操作
			form.value = {
				...defaultForm
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

.saveDialog-form {
	.el-form-item {
		margin-right: 5px !important;
	}
}
</style>
