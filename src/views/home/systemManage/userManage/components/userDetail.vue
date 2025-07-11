<template>
	<el-dialog
		v-model="dialogVisible"
		:center="false"
		class="adddialog dialogCommonStyle"
		title="用户信息"
		width="800px"
	>
		<el-descriptions :column="3" border class="margin-top">
			<el-descriptions-item>
				<template #label>
					<i class="el-icon-user"></i>
					用户ID
				</template>
				{{ resource.id }}
			</el-descriptions-item>
			<el-descriptions-item>
				<template #label>
					<el-icon>
						<User></User>
					</el-icon>
					用户名
				</template>
				{{ resource.userName }}
			</el-descriptions-item>
			<el-descriptions-item>
				<template #label>
					<i class="el-icon-mobile-phone"></i>
					手机号
				</template>
				{{ resource.phone }}
			</el-descriptions-item>
			<el-descriptions-item>
				<template #label>
					<i class="el-icon-message"></i>
					邮箱
				</template>
				{{ resource.email }}
			</el-descriptions-item>
			<el-descriptions-item>
				<template #label>
					<i class="el-icon-office-building"></i>
					所属部门
				</template>
				<ul>
					<li v-for="item in resource.deptList" :key="item.id">
						{{ item.name }}
					</li>
				</ul>
			</el-descriptions-item>
			<el-descriptions-item>
				<template #label>
					<i class="el-icon-user"></i>
					角色列表
				</template>
				<ul>
					<li v-for="item in resource.roleList" :key="item.id">
						{{ item.name }}
					</li>
				</ul>
			</el-descriptions-item>
			<el-descriptions-item>
				<template #label>
					<i class="el-icon-tickets"></i>
					累计登录次数
				</template>
				{{ resource.loginCount }}
			</el-descriptions-item>
			<el-descriptions-item>
				<template #label>
					<i class="el-icon-mouse"></i>
					最终登录IP
				</template>
				{{ resource.loginHost }}
			</el-descriptions-item>
			<el-descriptions-item>
				<template #label>
					<i class="el-icon-timer"></i>
					最终登录时间
				</template>
				{{ resource.loginTime }}
			</el-descriptions-item>
		</el-descriptions>
	</el-dialog>
</template>

<script setup>
import { ref, reactive, watch } from "vue"

const props = defineProps({
	userData: {
		type: Object,
		default() {
			return {}
		}
	}
})
const dialogVisible = ref(false)
const resource = ref({})
defineExpose({
	dialogVisible
})
watch(
	() => dialogVisible.value,
	(n) => {
		if (n) {
			// 显示
			console.log(props.userData)
			resource.value = props.userData
		} else {
			//弹窗消失(重置表单)
			resource.value = Object.assign({})
		}
	}
)
</script>

<style></style>
