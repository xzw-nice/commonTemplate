<!-- 更多操作下拉菜单配置 -->
<template>
	<el-dropdown :teleported="false" v-bind="bind" v-on="props.dropdownEvents">
		<slot name="default">
			<el-button :size="bind.size || 'default'" type="primary">
				更多操作
				<el-icon class="el-icon--right">
					<arrow-down />
				</el-icon>
			</el-button>
		</slot>
		<template #dropdown>
			<el-dropdown-menu>
				<div
					v-for="(item, index) in props.dropdownItem"
					:key="`${item.name}_${index}`"
					v-has="item.vHas || 'show'"
				>
					<el-dropdown-item v-bind="item.bind">
						{{ item.name }}
					</el-dropdown-item>
				</div>
			</el-dropdown-menu>
		</template>
	</el-dropdown>
</template>
<script name="MoreOperate" setup>
import { ref } from "vue"

const props = defineProps({
	// 绑定属性
	dropdownBind: {
		type: Object,
		default: () => {
			return {}
		}
	},
	// 绑定事件
	dropdownEvents: {
		type: Object,
		default: () => {
			return {}
		}
	},
	/**
	 * 下拉项配置
	 * name {String} 菜单名称
	 * bind {Object} 绑定的属性
	 * vHas {String} 权限控制
	 */
	dropdownItem: {
		type: Array,
		default: () => []
	}
})

console.log(props.dropdownItem)

const bind = ref({
	trigger: "click",
	...props.dropdownBind
})
</script>
<style lang="scss" scoped></style>
