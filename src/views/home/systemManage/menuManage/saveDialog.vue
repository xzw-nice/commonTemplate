<template>
	<el-dialog
		v-model="visible"
		:close-on-click-modal="false"
		:title="menuForm.id ? '编辑' : '新增'"
		style="min-width: 720px"
		width="48vw"
	>
		<el-form
			ref="menuForm_ref"
			:model="menuForm"
			:rules="formRules"
			class="menuManage-saveDialog-form"
			inline
			label-position="right"
			label-width="120px"
		>
			<el-form-item label="上级菜单：" prop="pid" required>
				<el-cascader
					v-model="menuForm.pid"
					:options="menuTree"
					:props="{
						label: 'name',
						value: 'id',
						children: 'children',
						checkStrictly: true
					}"
					:show-all-levels="false"
					placeholder="请选择上级菜单"
				/>
			</el-form-item>
			<el-form-item label="菜单类型：" prop="type" required>
				<el-radio-group v-model="menuForm.type">
					<el-radio :value="1">目录</el-radio>
					<el-radio :value="2">菜单</el-radio>
					<el-radio :value="3">按钮</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item label="菜单名称：" prop="name" required>
				<el-input
					v-model="menuForm.name"
					clearable
					placeholder="请输入菜单名称"
				></el-input>
			</el-form-item>
			<el-form-item v-if="menuForm.type !== 3" label="菜单地址：" prop="path" >
				<el-input
					v-model="menuForm.path"
					clearable
					placeholder="请输入菜单地址"
				></el-input>
			</el-form-item>
			<el-form-item
				v-if="menuForm.type !== 3"
				class="menuManage-saveDialog-form-formItem-icon"
				label="菜单图标："
				prop="icon"
			>
				<el-select
					v-model="menuForm.icon"
					filterable
					placeholder="请选择图标"
					popper-class="menuManage-saveDialog-iconPopup"
				>
					<el-option
						v-for="(item, index) in remixIconsLineValues"
						:key="`${item}_${index}`"
						:label="item"
						:value="item"
					>
						<remix-icon
							:icon-name="item"
							color="#606266"
							size="24px"
						></remix-icon>
					</el-option>
				</el-select>
				<remix-icon
					:icon-name="menuForm.icon"
					color="#333333"
					size="24px"
				></remix-icon>
			</el-form-item>
			<el-form-item v-if="menuForm.type !== 3" label="链接地址：">
				<el-input
					v-model="menuForm.link"
					clearable
					placeholder="请输入链接地址"
				></el-input>
			</el-form-item>
			<el-form-item v-if="menuForm.type !== 3" label="组件地址：">
				<el-input
					v-model="menuForm.component"
					clearable
					placeholder="请输入组件地址"
				></el-input>
			</el-form-item>
			<el-form-item label="权限字符：" prop="authStr">
				<el-input
					v-model="menuForm.authStr"
					clearable
					placeholder="请输入权限字符"
				></el-input>
			</el-form-item>
			<el-form-item label="是否可见：" prop="isHide">
				<el-switch v-model="menuForm.isHide" />
			</el-form-item>
			<el-form-item label="是否启用：" prop="isHide">
				<el-switch
					v-model="menuForm.status"
					:active-value="1"
					:inactive-value="0"
				/>
			</el-form-item>
			<el-form-item
				v-if="menuForm.type !== 3"
				label="新的标签页："
				prop="isHide"
			>
				<el-switch v-model="menuForm.isOpenBlank" />
			</el-form-item>
			<el-form-item label="排序：" prop="sort">
				<el-input-number v-model="menuForm.sort" />
			</el-form-item>
		</el-form>
		<div slot="footer" class="menuManage-saveDialog-footer">
			<el-button @click="handleClose">关闭</el-button>
			<el-button type="primary" @click="handleSubmit">提交</el-button>
		</div>
	</el-dialog>
</template>

<script setup>
import { computed, ref, watch } from "vue"
import { remixIconsLineValues } from "@/assets/icon/remixIcon/icons.js"
import RemixIcon from "@/components/SvgIcon/RemixIcon.vue"
import { addMenu, editMenu } from "@/api/systemManage/menuManage"
import { debounce } from "lodash"
import { reverseTreeQuery } from "@/utils/global.ts"

const props = defineProps({
	modelValue: {
		type: Boolean,
		default: false
	},
	menuList: {
		type: Array,
		required: true
	},
	originData: {
		type: Object,
		required: true
	}
})

const menuTree = computed(() => {
	return [{ name: "顶级菜单", id: null, children: [] }, ...props.menuList]
})

const emit = defineEmits(["update:modelValue", "getList"])

// 表单节点
const menuForm_ref = ref(null)

// 表单校验规则
const formRules = ref({
	pid: [{ required: true, message: "请选择父菜单", trigger: "change" }],
	type: [{ required: true, message: "请选择菜单类型", trigger: "change" }],
	name: [{ required: true, message: "请输入菜单名称", trigger: "blur" }],
	path: [{ required: computed(()=>menuForm.value.type !== 3), message: "请输入菜单路径/地址", trigger: "blur" }],
	icon: [{ required: computed(()=>menuForm.value.type !== 3), message: "请选择菜单图标", trigger: "change" }],
	authStr: [{ required: computed(()=>menuForm.value.type === 3), message: "请输入权限字符", trigger: "blur" }]
})

// 双向绑定modelValue
const visible = computed({
	get: () => props.modelValue,
	set: (value) => {
		if (!value && menuForm_ref.value) {
			menuForm_ref.value.resetFields()
		}
		emit("update:modelValue", value)
	}
})

// 表单数据
const menuForm = ref({
	pid: [], // 上级菜单
	type: null, // 菜单类型
	name: "", // 菜单名称
	path: "", // 菜单路径/地址
	icon: remixIconsLineValues[0], // 菜单图标
	link: "", // 链接地址
	component: "", // 组件地址
	authStr: "", // 权限字符
	isHide: true, // 是否可见
	status: 1, // 是否启用
	sort: 0, // 排序
	isOpenBlank: false // 新的标签页
})

// 弹框关闭
function handleClose() {
	visible.value = false
}

// 提交
const handleSubmit = debounce( async () => {
	if (!menuForm_ref.value) {
		return
	}
	await menuForm_ref.value.validate(async (valid) => {
		if (valid) {
			const request = menuForm.value.id ? editMenu : addMenu
			try {
				await request({
					...menuForm.value,
					pid: menuForm.value.pid.at(-1)
				})
				emit("getList")
				visible.value = false
				ElMessage.success("操作成功")
			} catch (e) {
				console.log(e)
			}
		}
	})
},500)

watch(
	() => props.originData,
	(val) => {
		if (val.id) {
			menuForm.value = {
				...props.originData,
				pid: [val.pid]
			}
			if (val.pid) {
				const str = reverseTreeQuery(menuTree.value, val.pid, "id")
				menuForm.value.pid = str ? str.split(",").map(item=>Number(item)) : []
			}
		} else {
			menuForm.value = {
				pid: null,
				type: null,
				name: "",
				path: "",
				icon: remixIconsLineValues[0],
				link: "",
				component: "",
				authStr: "",
				isHide: true,
				status: 1,
				sort: 0
			}
		}
	},
	{
		deep: true
	}
)
</script>

<style lang="scss" scoped>
.menuManage-saveDialog-form {
	&-formItem-icon {
		:deep(.el-form-item__content) {
			@include flex(flex-start);

			.el-select {
				width: calc(100% - 12px - 30px) !important;
				margin-right: 12px;
			}
		}

		> i {
			width: 30px;
		}
	}
}

.menuManage-saveDialog-footer {
	text-align: right;
}
</style>
<style lang="scss">
.menuManage-saveDialog-iconPopup {
	.el-select-dropdown__list {
		width: 260px;
		display: inline-flex;
		flex-wrap: wrap;

		.el-select-dropdown__item {
			width: 50px;
			padding: 0 !important;
			@include flex;
		}
	}
}
</style>
