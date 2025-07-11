<template>
	<el-dialog
		v-model="dialogVisible"
		:center="false"
		:title="isEdit ? '编辑角色' : '添加角色'"
		class="dialogCommonStyle"
		width="35rem"
	>
		<el-form
			ref="dataFormRef"
			:model="resource"
			:rules="rules"
			class="editform"
			label-position="right"
			label-width="115px"
		>
			<el-form-item label="角色名:" prop="name">
				<el-input v-model="resource.name" />
			</el-form-item>
			<el-form-item class="btnItem" label="角色字符:">
				<el-input v-model="resource.authStr" clearable />
			</el-form-item>
			<el-form-item class="btnItem" label="是否是默认角色:">
				<el-switch
					v-model="resource.isDefault"
					:active-value="true"
					:inactive-value="false"
					active-color="#13ce66"
					inactive-color="#ff4949"
				/>
			</el-form-item>
			<el-form-item class="btnItem" label="是否启用:">
				<el-switch
					v-model="resource.status"
					:active-value="1"
					:inactive-value="0"
					active-color="#13ce66"
					inactive-color="#ff4949"
				/>
			</el-form-item>
		</el-form>
		<template #footer>
			<el-button round size="default" @click="dialogVisible = false"
				>{{ isEdit ? "放弃修改" : "放弃添加" }}
			</el-button>
			<el-button round size="default" type="primary" @click="sure"
				>{{ isEdit ? "修改" : "添加" }}
			</el-button>
		</template>
	</el-dialog>
</template>

<script setup>
import { ref, watch } from "vue"
import { roleAdd, roleEdit } from "@/api/systemManage/roleManage"
import { debounce } from "lodash"

const props = defineProps({
	editData: {
		type: Object,
		require: true,
		default: () => {
			return {}
		}
	},
	isEdit: { type: Boolean, require: true }
})
const emits = defineEmits(["restList"])

// 默认表单对象
const defaultResource = {
	isDefault: true,
	name: "",
	status: 1,
	authStr: ""
}
const rules = {
	name: [{ required: true, message: "必填", trigger: "blur" }]
}
const dataFormRef = ref(null) // 表单组件实例
const resource = ref(Object.assign({}, defaultResource))
const dialogVisible = ref(false)

watch(
	() => dialogVisible.value,
	(n) => {
		if (n) {
			// 弹窗出现 如果是编辑模式 则回显
			if (props.isEdit) {
				let obj = {}
				obj = props.editData
				resource.value = Object.assign({}, obj)
			}
		} else {
			// 弹窗消失(重置表单)
			resource.value = Object.assign({}, defaultResource)
			dataFormRef.value.clearValidate()
		}
	}
)

const sure = debounce(async () => {
	dataFormRef.value.validate(async (vaild) => {
		if (vaild) {
			if (props.isEdit) {
				await roleEdit(resource.value)
				ElMessage.success("修改成功")
				dialogVisible.value = false
				emits("restList")
			} else {
				await roleAdd(resource.value)
				ElMessage.success("添加成功")
				dialogVisible.value = false
				emits("restList")
			}
		} else {
			ElMessage.success("数据验证失败")
		}
	})
},500)

defineExpose({
	dialogVisible
})
</script>

<style lang="scss" scoped>
.el-dialog {
	display: flex;
	justify-content: flex-start;
	align-items: flex-start;
}

:deep(.editform) {
	.el-input .el-input__inner {
		height: 2.38rem;
		font-size: 12px !important;
	}

	& .el-form-item__label {
		text-align: left;
		width: 11.5rem;
	}
}

.editform .el-form-item__content {
	height: 2.38rem;
	width: 75%;
	margin: 0;
	display: flex;
	justify-content: flex-start;
	align-items: center;
}
</style>
