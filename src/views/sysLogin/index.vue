<template>
	<div ref="login_ref" class="login">
		<div class="login-content animate__animated animate__fadeInTopRight">
			<div class="login-content-title">
				<img alt="" src="@/assets/img/login_bg.webp" />
				<span>数字评价基地</span>
			</div>
			<div class="login-content-main">
				<div class="login-bg"></div>
				<div class="login-box">
					<div class="login-box-title">欢迎使用</div>
					<div class="login-box-form">
						<el-form
							ref="loginForm_ref"
							:model="loginForm"
							:rules="loginRule"
							size="large"
						>
							<el-form-item label="" prop="loginName" required>
								<el-input v-model="loginForm.loginName" prefix-icon="User" />
							</el-form-item>
							<el-form-item label="" prop="password" required>
								<el-input
									v-model="loginForm.password"
									prefix-icon="Lock"
									show-password
									type="password"
								/>
							</el-form-item>
						</el-form>
					</div>
					<button
						ref="loginBtn_ref"
						:class="{ 'is-loading': loginLoading }"
						:disabled="loginLoading"
						class="login-box-btn bubbly-button"
						@click="login"
					>
						<el-icon
							v-if="loginLoading"
							:class="{ 'loading-icon': loginLoading }"
						>
							<Loading />
						</el-icon>
						登录
					</button>
					<div class="login-box-noAccount">
						没有账号？
						<span class="login-box-noAccount-creat">联系管理员</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script name="SystemLogin" setup>
import router from "@/router"
import { Loading } from "@element-plus/icons"
import { getUserInfo, sysLogin } from "@/api"
import md5 from "md5"
import { nextTick, onBeforeUnmount, onMounted, reactive, ref } from "vue"
import { useUserStore } from "@/store/user.ts"
import { initStoreData } from "@/store/index.ts"
import { routeWhitelist } from "@/utils/constant.ts"
import { useSystemStore } from "@/store/system.ts"
import * as THREE from "three"
import CLOUDS from "vanta/dist/vanta.clouds.min.js"

const useUser = useUserStore()
const useSystem = useSystemStore()

// 3d
let vantaEffect

const login_ref = ref()

// 按钮加载状态
const loginLoading = ref(false)
// 按钮节点
const loginBtn_ref = ref()
// 表单节点
const loginForm_ref = ref()
// 表单数据
const loginForm = reactive({
	loginName: "admin",
	password: "123456"
})
// 校验规则
const loginRule = {
	loginName: [{ required: true, message: "请输入账号", trigger: "blur" }],
	password: [{ required: true, message: "请输入密码", trigger: "blur" }]
}

// 登录
function login() {
	console.log(1)
	loginForm_ref.value.validate((valid) => {
		if (valid) {
			loginLoading.value = true
			sysLogin({
				loginName: loginForm.loginName,
				password: md5(loginForm.password)
			})
				.then((res) => {
					ElMessage.success("登录成功")
					localStorage.setItem("uen-digitalEvaluationBase-token", res.token)
					// 获取用户信息
					useUser.getUser().then(() => {
						nextTick(() => {
							router.replace("/")
						})
					})
					// 获取字典数据
					useSystem.getDictionaryList()
				})
				.finally(() => {
					loginLoading.value = false
				})
		}
	})
}

function init() {
	// 初始化所有存储数据
	initStoreData()
	// // 重置路由（已做token校验未登录拦截强制跳转登录页）
	// router.getRoutes().forEach((route) => {
	// 	const { name } = route //获取路由name
	// 	if (name && !routeWhitelist.includes(name)) {
	// 		//路由不属于白名单,则删除
	// 		router.hasRoute(name) && router.removeRoute(name)
	// 	}
	// })
}

function animateButton(e) {
	//reset animation
	e.target.classList.remove("animate")

	e.target.classList.add("animate")
	setTimeout(function () {
		e.target.classList.remove("animate")
	}, 700)
}

function addEventListener() {
	loginBtn_ref.value.addEventListener("click", animateButton, false)
	window.addEventListener("keydown", (e) => {
		if (e.key === "Enter") {
			login()
		}
	})
}

function removeEventListener() {
	loginBtn_ref.value.removeEventListener("click", animateButton, false)
	window.removeEventListener("keydown", (e) => {
		if (e.key === "Enter") {
			login()
		}
	})
}

onMounted(() => {
	// 设置按钮监听动画
	if (loginBtn_ref.value) {
		addEventListener()
	}
	// 使用3d背景动画
	vantaEffect = CLOUDS({
		el: login_ref.value,
		THREE,
		mouseControls: false,
		touchControls: false,
		gyroControls: false,
		minHeight: 200.0,
		minWidth: 200.0,
		cloudShadowColor: 0x53767e,
		sunColor: 0x73131,
		sunGlareColor: 0x1111d,
		sunlightColor: 0xb6b6b6,
		speed: 0.5
	})
})

onBeforeUnmount(() => {
	// 去除按钮监听
	if (loginBtn_ref.value) {
		removeEventListener()
	}
	// 销毁3d背景动画
	if (vantaEffect) {
		vantaEffect.destroy()
	}
})

init()
</script>

<style lang="scss" scoped>
.login {
	width: 100%;
	height: 100%;
	padding: 10%;
	@include flex(space-around);

	&-content {
		width: 850px;
		height: 500px;
		background-color: rgba(240, 248, 255, 0.6);
		box-shadow: 0 0 20px rgba(51, 51, 51, 0.2);
		border-radius: 10px;
		padding: $padding-large;

		&-title {
			height: 40px;
			font-size: 40px;
			margin-bottom: $margin-default;
			//color: #4682b4;
			@include flex(flex-start);
			@include font-gradient(#b0c4de, #3479b2, -90deg);

			> img {
				padding-top: 10px;
				height: calc(100% - 10px);
				margin-right: $margin-small;
			}
		}

		&-main {
			height: calc(100% - 40px - $margin-default);
			@include flex;
		}
	}

	&-bg {
		flex: 1;
		height: 100%;
		background: url("@/assets/img/login_bg.webp") no-repeat center center;
		background-size: cover;
		margin-right: $margin-default;
		opacity: 0.8;
	}

	&-left {
		flex: 1;
		right: 50px;
	}

	&-title {
		text-align: center;
		font-size: 42px;
		color: #0b5f9b;
		margin-bottom: 24px;
	}

	&-box {
		width: 320px;
		height: 100%;
		@include flex(center, center, column);

		&-title {
			font-size: 28px;
			margin: 0 0 30px 0;
			color: #505050;
		}

		&-form {
			width: 100%;
			flex: 1;

			.el-form {
				&-item {
					margin-bottom: 24px;
				}

				:deep(.el-input) {
					font-size: 16px;
					.el-input__prefix {
						font-size: 20px;
					}
					.el-input__wrapper {
						background-color: rgba(70, 130, 180, 0.1);
					}
				}
			}
		}

		&-btn {
			width: 100%;
			@include flex(center, center);
		}

		&-noAccount {
			width: 100%;
			text-align: right;
			font-size: 12px;
			color: #a9a9a9;

			&-creat {
				cursor: pointer;
				color: #1e90ff;
			}
		}

		.is-loading {
			opacity: 0.6;
			cursor: auto !important;

			.loading-icon {
				opacity: 1;
				position: absolute;
				top: 35%;
				left: 38%;
				transform: translateY(-35%);
				animation: loadingRotate 2s infinite linear;
			}
		}
	}

	$fuschia: #4682b4;
	$button-bg: $fuschia;
	$button-text-color: #fff;
	$baby-blue: #fff;

	.bubbly-button {
		font-family: "Helvetica", "Arial", sans-serif;
		display: inline-block;
		font-size: 16px;
		letter-spacing: 2px;
		padding: pxtorem(12) $padding-default;
		margin: $margin-large 0;
		-webkit-appearance: none;
		appearance: none;
		background-color: $button-bg;
		color: $button-text-color;
		border-radius: 4px;
		border: none;
		cursor: pointer;
		position: relative;
		transition: transform ease-in 0.1s, box-shadow ease-in 0.25s;
		box-shadow: 0 2px 25px rgba(70, 130, 180, 0.5);
		cursor: pointer;

		&:focus {
			outline: 0;
		}

		&:before,
		&:after {
			position: absolute;
			content: "";
			display: block;
			width: 140%;
			height: 100%;
			left: -20%;
			z-index: 2;
			transition: all ease-in-out 0.5s;
			background-repeat: no-repeat;
		}

		&:before {
			display: none;
			top: -75%;
			background-image: radial-gradient(circle, $button-bg 20%, transparent 20%),
				radial-gradient(
					circle,
					transparent 20%,
					$button-bg 20%,
					transparent 30%
				),
				radial-gradient(circle, $button-bg 20%, transparent 20%),
				radial-gradient(circle, $button-bg 20%, transparent 20%),
				radial-gradient(
					circle,
					transparent 10%,
					$button-bg 15%,
					transparent 20%
				),
				radial-gradient(circle, $button-bg 20%, transparent 20%),
				radial-gradient(circle, $button-bg 20%, transparent 20%),
				radial-gradient(circle, $button-bg 20%, transparent 20%),
				radial-gradient(circle, $button-bg 20%, transparent 20%);
			background-size: 5% 5%, 10% 10%, 7.5% 7.5%, 10% 10%, 9% 9%, 5% 5%,
				7.5% 7.5%, 5% 5%, 9% 9%;
			background-position: 0% 80%, -5% 20%, 10% 40%, 20% 0%, 30% 30%, 22% 50%,
				50% 50%, 65% 20%, 85% 30%;
		}

		&:after {
			display: none;
			bottom: -75%;
			background-image: radial-gradient(circle, $button-bg 20%, transparent 20%),
				radial-gradient(circle, $button-bg 20%, transparent 20%),
				radial-gradient(
					circle,
					transparent 10%,
					$button-bg 15%,
					transparent 20%
				),
				radial-gradient(circle, $button-bg 20%, transparent 20%),
				radial-gradient(circle, $button-bg 20%, transparent 20%),
				radial-gradient(circle, $button-bg 20%, transparent 20%),
				radial-gradient(circle, $button-bg 20%, transparent 20%);
			background-size: 7.5% 7.5%, 10% 10%, 9% 9%, 10% 10%, 7.5% 7.5%, 5% 5%,
				10% 10%;
			background-position: 5% 90%, 10% 90%, 10% 90%, 15% 90%, 25% 90%, 25% 90%,
				40% 90%, 55% 90%, 70% 90%;
		}

		&:active {
			transform: scale(0.9);
			background-color: darken($button-bg, 5%);
			box-shadow: 0 2px 25px rgba(70, 130, 180, 0.2);
		}

		&.animate {
			&:before {
				display: block;
				animation: topBubbles ease-in-out 0.75s forwards;
			}

			&:after {
				display: block;
				animation: bottomBubbles ease-in-out 0.75s forwards;
			}
		}
	}

	@keyframes topBubbles {
		0% {
			background-position: 5% 90%, 10% 90%, 10% 90%, 15% 90%, 25% 90%, 25% 90%,
				40% 90%, 55% 90%, 70% 90%;
		}
		50% {
			background-position: 0% 80%, 0% 20%, 10% 40%, 20% 0%, 30% 30%, 22% 50%,
				50% 50%, 65% 20%, 90% 30%;
		}
		100% {
			background-position: 0% 70%, 0% 10%, 10% 30%, 20% -10%, 30% 20%, 22% 40%,
				50% 40%, 65% 10%, 90% 20%;
			background-size: 0% 0%, 0% 0%, 0% 0%, 0% 0%, 0% 0%, 0% 0%;
		}
	}

	@keyframes bottomBubbles {
		0% {
			background-position: 10% -10%, 30% 10%, 55% -10%, 70% -10%, 85% -10%,
				70% -10%, 70% 0%;
		}
		50% {
			background-position: 0% 80%, 20% 80%, 45% 60%, 60% 100%, 75% 70%, 95% 60%,
				105% 0%;
		}
		100% {
			background-position: 0% 90%, 20% 90%, 45% 70%, 60% 110%, 75% 80%, 95% 70%,
				110% 10%;
			background-size: 0% 0%, 0% 0%, 0% 0%, 0% 0%, 0% 0%, 0% 0%;
		}
	}

	@keyframes loadingRotate {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}
}
</style>
