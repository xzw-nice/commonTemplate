<template>
	<div class="layout-navBar">
		<div class="layout-navBar-main">
			<div class="layout-navBar-logo" @click="toHome">
				<!--				<img alt="暂无图片" src="@/assets/img/logo.png" />-->
				数字评价基地
			</div>
			<div class="layout-navBar-personal">
				<el-popover :teleported="false" :width="200" placement="top-start" title="" trigger="click">
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
						<div class="personal-popover-logout">
							<div class="personal-popover-item" @click="logout">
								<remix-icon
									color="#FF6347"
									icon-name="logout-box-r-line"
									size="16px"
								></remix-icon>
								退出登录
							</div>
						</div>
					</div>
				</el-popover>
			</div>
		</div>
	</div>
</template>
<script name="navBar" setup>
import router from "@/router"
import { sysLogout } from "@/api/index"
import { initStoreData } from "@/store/index"
import { useUserStore } from "@/store/user.ts"
import { computed } from "vue"
import { fileProxy } from "@/utils/constant.ts"
import { ArrowDown } from "@element-plus/icons"

const useUser = useUserStore()

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

  &-logout {
    color: #ff6347;

    .personal-popover-item {
      padding-bottom: 0;
      cursor: pointer;
    }
  }
}

</style>
