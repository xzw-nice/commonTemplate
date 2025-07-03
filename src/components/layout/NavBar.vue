<template>
	<div class="layout-navBar">
		<div class="layout-navBar-main">
			<div class="layout-navBar-logo" @click="toHome">
				<!--				<img alt="暂无图片" src="@/assets/img/logo.png" />-->
				数字评价基地
			</div>
			<div class="layout-navBar-personal">
				<el-popover :width="200" placement="top-start" title="" trigger="click">
					<template #reference>
						<!--            <el-button class="m-2">Hover to activate</el-button>-->
						<div class="layout-navBar-personal-main">
							<el-avatar :size="46" :src="avatar" />
							<div class="layout-navBar-personal-name">
								<span class="layout-navBar-personal-name-value">{{
									useUser.user.info.userName
								}}</span>
								<el-icon>
									<ArrowDown />
								</el-icon>
							</div>
						</div>
					</template>
					<div class="personal-popover">
						<div class="personal-popover-main">
							<div class="personal-popover-item">
								<remix-icon
									color="#696969"
									icon-name="user-3-line"
									size="16px"
								></remix-icon>
								{{ useUser.user.info.loginName || "暂无数据" }}
							</div>
							<div class="personal-popover-item">
								<remix-icon
									color="#696969"
									icon-name="phone-line"
									size="16px"
								></remix-icon>
								{{ useUser.user.info.phone || "暂无数据" }}
							</div>
							<div class="personal-popover-item">
								<remix-icon
									color="#696969"
									icon-name="mail-line"
									size="16px"
								></remix-icon>
								{{ useUser.user.info.email || "暂无数据" }}
							</div>
						</div>
						<div class="personal-popover-bottom">
							<div
								class="personal-popover-item personal-popover-bottom-changePassword"
								@click="openResetDialog"
							>
								<remix-icon
									color="#2E8B57"
									icon-name="key-line"
									size="1.2rem"
								></remix-icon>
								修改密码
							</div>
							<div
								class="personal-popover-item personal-popover-bottom-layout"
								@click="logout"
							>
								<remix-icon
									color="#FF6347"
									icon-name="logout-box-r-line"
									size="1.2rem"
								></remix-icon>
								退出登录
							</div>
						</div>
					</div>
				</el-popover>
			</div>
		</div>
	</div>
	<el-dialog
		v-model="changePasswordDialog.visible"
		append-to-body
		title="修改密码"
		style="min-width: 300px"
		width="24rem"
	>
		<el-form
			ref="changePassword_ref"
			:rules="formRules"
			:model="changePasswordDialog.data"
			label-width="7rem"
		>
			<el-form-item label="旧密码：" prop="oldPassword">
				<el-input v-model="changePasswordDialog.data.oldPassword"></el-input>
			</el-form-item>
			<el-form-item label="新密码：" prop="newPassword">
				<el-input v-model="changePasswordDialog.data.newPassword"></el-input>
			</el-form-item>
			<el-form-item label="确认密码：" prop="confirmPassword">
				<el-input
					v-model="changePasswordDialog.data.confirmPassword"
				></el-input>
			</el-form-item>
		</el-form>
		<div class="layout-navBar-changePassword-btn">
			<el-button @click="cancel">取 消</el-button>
			<el-button type="primary" @click="changePassword">确 认</el-button>
		</div>
	</el-dialog>
</template>
<script name="navBar" setup>
import router from "@/router"
import { sysLogout } from "@/api/index"
import { initStoreData } from "@/store/index"
import { useUserStore } from "@/store/user.ts"
import { computed, reactive, ref } from "vue"
import { fileProxy } from "@/utils/constant.ts"
import { ArrowDown } from "@element-plus/icons"
import { userChangePassword } from "@/api/systemManage/userManage/index.js"
import md5 from "md5"

const useUser = useUserStore()

const changePassword_ref = ref()

// 重置密码弹框
const changePasswordDialog = reactive({
	visible: false,
	data: {
		oldPassword: "", // 旧密码
		newPassword: "", // 新密码
		confirmPassword: "" // 再次确认
	}
})

const formRules = {
	oldPassword: [{ required: true, message: "旧密码不能为空", trigger: "blur" }],
	newPassword: [{ required: true, message: "新密码不能为空", trigger: "blur" }],
	confirmPassword: [
		{ required: true, message: "请再次确认新密码", trigger: "blur" },
		{
			validator: (rule, value, callback) => {
				if (value !== changePasswordDialog.data.newPassword) {
					callback(new Error("两次输入的新密码不一致"))
				} else {
					callback()
				}
			}
		}
	]
}

const avatar = computed(() => {
	const img = useUser.user.info.photo
	return img
		? fileProxy + img
		: "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"
})

function logout() {
	sysLogout().finally(() => {
		initStoreData()
		ElMessage.success("已退出登录")
		router.replace("/login")
	})
}

function toHome() {
	router.push("/")
}
// 打开重置密码弹框
function openResetDialog() {
	changePasswordDialog.visible = true
}
// 取消重置
function cancel() {
	changePasswordDialog.visible = false
	changePasswordDialog.data = {
		oldPassword: "",
		newPassword: "",
		confirmPassword: ""
	}
}
// 重置
function changePassword() {
	if (!changePassword_ref.value) {
		return
	}
	changePassword_ref.value.validate(async (valid) => {
		if (valid) {
			try {
				await userChangePassword({
					oldPassword: md5(changePasswordDialog.data.oldPassword),
					newPassword: md5(changePasswordDialog.data.newPassword)
				})
				changePasswordDialog.visible = false
				ElMessage.success("操作成功，请重新登录")
				await useUser.getUser()
			} catch (e) {
				console.log(e)
			}
		}
	})
}
</script>
<style lang="scss" scoped>
.layout-navBar {
	width: 100%;
	height: 100%;
	//background-color: #364870;
	background: linear-gradient(to right, #364870, rgba(54, 72, 112, 0.8));
	box-shadow: 0 1px 6px 0 rgba(54, 72, 112, 1);

	:deep(.layout-navBar-main) {
		width: 100%;
		height: 100%;
		padding: 0 $padding-large;
		@include flex(space-between);

		> div {
			height: 100%;
			@include flex;
		}

		.layout-navBar-logo {
			height: 100%;
			color: #ffffff;
			font-size: 24px;
			cursor: pointer;

			> img {
				height: 100%;
			}
		}

		.layout-navBar-personal {
			&-main {
				@include flex(flex-end);
				cursor: pointer;

				.layout-navBar-personal-name {
					margin-left: $margin-small;
					@include flex(flex-end);
					color: #ffffff;

					&-value {
						min-width: 50px;
						display: inline-block;
						margin-right: $margin-small;
					}
				}
			}
		}
	}
}
.personal-popover {
	font-size: 13px;

	.personal-popover-item {
		padding: 8px 0;
		@include flex(flex-start);

		.remixIcon {
			margin-right: 8px;
		}
	}

	&-main {
		border-bottom: 1px solid #e9ecef;

		.personal-popover-item {
			&:first-child {
				padding-top: 0;
			}
		}
	}
	&-bottom {
		.personal-popover-item {
			padding-bottom: 0;
			cursor: pointer;
		}
		&-changePassword {
			color: #2e8b57;
		}
		&-layout {
			color: #ff6347;
		}
	}
}
.layout-navBar-changePassword-btn {
	text-align: right;
}
</style>
