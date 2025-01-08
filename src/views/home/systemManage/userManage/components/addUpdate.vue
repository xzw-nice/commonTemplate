<template>
	<el-dialog
		ref="useManageAddUploadDialog_ref"
		v-model="dialogVisible"
		:center="false"
		:close-on-click-modal="false"
		:title="isEdit ? '编辑用户' : '添加用户'"
		append-to="#main"
		width="800px"
	>
		<el-form
			:key="fKey"
			ref="dataFormRef"
			:model="resource"
			:rules="rules"
			class="userManage-editForm"
			label-position="right"
			label-width="100px"
		>
			<el-form-item label="用户名：" prop="userName">
				<el-input v-model="resource.userName" placeholder="请输入" />
			</el-form-item>
			<el-form-item label="登录账号：" prop="loginName">
				<el-input
					v-model="resource.loginName"
					:disabled="isEdit"
					placeholder="请输入"
				/>
			</el-form-item>
			<el-form-item v-if="!isEdit" label="登录密码：" prop="password">
				<el-input v-model="resource.password" placeholder="请输入" />
			</el-form-item>
			<el-form-item label="手机号：" prop="phone">
				<el-input v-model="resource.phone" placeholder="请输入" />
			</el-form-item>
			<el-form-item label="邮箱：" prop="email">
				<el-input v-model="resource.email" placeholder="请输入" />
			</el-form-item>
			<!--			<el-form-item v-if="isEdit" label="重置部门">-->
			<!--				<el-switch-->
			<!--					v-model="deptBtn"-->
			<!--					:active-value="true"-->
			<!--					:inactive-value="false"-->
			<!--					active-color="#13ce66"-->
			<!--					inactive-color="#ff4949"-->
			<!--				/>-->
			<!--			</el-form-item>-->
			<el-form-item v-if="isEdit" label="重置角色：">
				<el-switch
					v-model="roleBtn"
					:active-value="true"
					:inactive-value="false"
					active-color="#13ce66"
					inactive-color="#ff4949"
				/>
			</el-form-item>
			<el-form-item label="角色：" prop="roleList">
				<el-select
					v-model="resource.roleList"
					:disabled="!roleBtn && isEdit"
					multiple
					style="width: 100%"
				>
					<el-option
						v-for="role in roleList"
						:key="role.id"
						:label="role.name"
						:value="role.id"
					/>
				</el-select>
			</el-form-item>
			<!--			<el-form-item label="app角色" prop="appRoleList">-->
			<!--				<el-select-->
			<!--					v-model="resource.appRoleList"-->
			<!--					:disabled="!roleBtn && isEdit"-->
			<!--					multiple-->
			<!--					style="width: 100%"-->
			<!--				>-->
			<!--					<el-option-->
			<!--						v-for="role in appRoleList"-->
			<!--						:key="role.id"-->
			<!--						:label="role.name"-->
			<!--						:value="role.id"-->
			<!--					/>-->
			<!--				</el-select>-->
			<!--			</el-form-item>-->
			<!--			<el-form-item label="电子签名" prop="appRoleList">-->
			<!--				<div>-->
			<!--					<PictureUpload-->
			<!--						id="avatar"-->
			<!--						:custom-style="{-->
			<!--							width: '100px',-->
			<!--							height: '100px'-->
			<!--						}"-->
			<!--						:file-list="signImgList"-->
			<!--						@uploadDialog="signImgUpload"-->
			<!--					/>-->
			<!--				</div>-->
			<!--			</el-form-item>-->
			<el-form-item label="头像:" prop="photo">
				<div>
					<PictureUpload
						id="avatar"
						:append-element="useManageAddUploadDialog_ref"
						:custom-style="{
							width: '6rem',
							height: '6rem'
						}"
						:file-list="signImgList"
						@upload="signImgUpload"
					/>
				</div>
			</el-form-item>
		</el-form>
		<template #footer>
			<el-button size="default" @click="dialogVisible = false"
				>{{ isEdit ? "放弃修改" : "放弃添加" }}
			</el-button>
			<el-button size="default" type="primary" @click="sure"
				>{{ isEdit ? "修改" : "添加" }}
			</el-button>
		</template>
	</el-dialog>
</template>

<script setup>
import { ref, watch } from "vue"
import { getRoleList } from "@/api/systemManage/roleManage"
import { addUser, editUser } from "@/api/systemManage/userManage/index.js"
import PictureUpload from "@/components/Upload/CropperUpload/index.vue"
import md5 from "md5"
import { fileUpload } from "@/utils/global.ts"
import { fileProxy } from "@/utils/constant.ts"
import { debounce } from "lodash"

const props = defineProps({
	editData: { type: Object, required: true },
	isEdit: { type: Boolean, require: true },
	// dictionary: {
	// 	type: Object,
	// 	require: true
	// },
	deptTree: {
		type: Array,
		require: true,
		default: () => []
	}
})
const emits = defineEmits(["restList"])

const useManageAddUploadDialog_ref = ref()

const defaultResource = {
	deptList: null,
	email: "",
	loginName: "",
	password: "",
	phone: "",
	photo: "",
	status: 1,
	userName: "",
	// appRoleList: [], // app 角色列表
	roleList: [], // pc 角色列表
	signImg: "",
	signImgInfo: null
	// userDeptList: []
}

const rules = {
	loginName: [{ required: true, message: "必填", trigger: "blur" }],
	email: [
		{
			type: "email",
			message: "请输入正确的邮箱地址",
			trigger: ["blur", "change"]
		}
	],
	password: [{ required: true, message: "必填", trigger: "blur" }],
	userName: [{ required: true, message: "必填", trigger: "blur" }],
	phone: [
		{
			pattern:
				/^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[189]))\d{8}$/,
			message: "手机号格式错误",
			trigger: ["blur", "change"]
		}
	]
}
const resource = ref(Object.assign({}, defaultResource))
const dialogVisible = ref(false)
const roleBtn = ref(false)
const deptBtn = ref(false)
const roleList = ref([]) // pc 角色列表
const appRoleList = ref([]) // app 角色列表
const fKey = ref(1)
const valueConsistsOf = ref("ALL")
const signImgList = ref([])
const signImgInfo = ref({})
const dataFormRef = ref(null)
// icons: icons,

watch(
	() => dialogVisible.value,
	(n) => {
		if (n) {
			// getRoleListApp({ isAll: true, size: -1 }).then((res) => {
			// 	appRoleList.value = res.records
			// })
			getRoleList({ status: 1, size: -1 }).then((res) => {
				roleList.value = res.records
			})
			// 如果是编辑模式
			if (props.isEdit) {
				let obj = {}
				obj = Object.assign({}, props.editData)
				const rarr = []
				// 将权限列表的ID拿出来
				if (obj.roleList && obj.roleList?.length > 0) {
					obj.roleList?.forEach((item) => {
						rarr.push(item.id)
					})
				}
				obj.roleList = rarr
				console.log(obj)
				resource.value = JSON.parse(JSON.stringify(obj))
				// 有图片的情况下
				if (resource.value.photo) {
					signImgList.value = [
						{
							name: "",
							url: fileProxy + resource.value.photo
						}
					]
				}
			}
		} else {
			// 弹窗消失(重置表单)
			resource.value = Object.assign({}, defaultResource)
			signImgList.value = []
			signImgInfo.value = {}
			roleBtn.value = false
			deptBtn.value = false
			emits("restList")
			dataFormRef.value.clearValidate() // 清除校验
		}
	}
)

const sure = debounce(async () => {
	dataFormRef.value.validate(async (valid) => {
		if (valid) {
			// if (signImgInfo.value && Object.keys(signImgInfo.value).length) {
			// 	const signImgRes = await changeFile(signImgInfo, postUploadFile)
			// 	console.log(signImgRes)
			// 	resource.value.photo = signImgRes.data.url
			// }
			// 如果有file对象 则上传拿到url后再携带修改
			if (signImgInfo.value && Object.keys(signImgInfo.value).length) {
				console.log(signImgInfo.value)
				const upload = await fileUpload({ file: signImgInfo.value })
				console.log(upload)
				resource.value.photo = upload.url
			}
			if (props.isEdit) {
				// 用户编辑
				editUser({
					...resource.value,
					password: md5(resource.value.password)
				}).then(() => {
					ElMessage.success("修改成功")
					dialogVisible.value = false
					// this.$store.dispatch("getInfo")
				})
			} else {
				// obj.password = md5(this.resource.password)
				addUser({
					...resource.value,
					password: md5(resource.value.password)
				}).then(() => {
					ElMessage.success("添加成功")
					dialogVisible.value = false
				})
			}
		}
	})
}, 500)

function signImgUpload(imgInfo, currentImg) {
	const arr = [
		{
			name: imgInfo.name,
			url: currentImg
		}
	]
	signImgInfo.value = imgInfo
	console.log(imgInfo)
	signImgList.value = arr
}

defineExpose({
	dialogVisible
})
</script>

<style lang="scss" scoped>
.el-dialog {
	display: flex;
	justify-content: flex-start;
}

.userManage-editForm {
	:deep(.el-form-item) {
		display: inline-flex;
		margin-left: 1rem;
		width: 45%;
	}
}
</style>
