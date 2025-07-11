<template>
	<div
		:class="{ boxFocus }"
		:style="{
			height: props.height
				? parseFloat(props.height) + 'px'
				: 'calc(100% - 4px)'
		}"
		class="dateCheckOut"
	>
		<el-select
			v-model="currentDateType"
			:size="props.size"
			:style="{ width: props.typeWidth }"
			class="dateCheckOut-typeSelect"
			@blur="boxFocus = false"
			@change="typeChange"
			@focus="boxFocus = true"
		>
			<el-option
				v-for="item in props.options"
				:key="item.value"
				:label="item.label"
				:value="item.value"
			/>
		</el-select>
		<el-date-picker
			:key="currentDateType"
			v-model="date"
			:size="size"
			:style="{ width: datePickerWidth }"
			:type="currentDateType"
			clearable
			placeholder="请选择"
			@blur="boxFocus = false"
			@change="dateChange"
			@focus="boxFocus = true"
			v-on="bind"
		/>
	</div>
</template>

<script name="DateCheckOut" setup>
import { reactive, ref, computed } from "vue"

const props = defineProps({
	// 类型双向绑定(使用时需要加.sync修饰)
	dateType: {
		type: String,
		default: ""
	},
	modelValue: {
		type: Array,
		default: []
	},
	height: {
		type: [String, Number],
		default: ""
	},
	size: {
		type: String,
		default: "default"
	},
	// 下拉组件宽度
	typeWidth: {
		type: String,
		default: "60px"
	},
	// 时间组件宽度
	datePickerWidth: {
		type: String,
		default: "auto"
	},
	// bind: {
	//   type: Object,
	//   default: () => ({})
	// },
	// 类型选择器类型下拉列表
	currentType: {
		type: String,
		default: ""
	},
	// 时间选择器类型下拉列表
	options: {
		type: Array,
		default: () => [
			{
				label: "日",
				value: "date",
				dateBind: {}
			}
		]
	}
})

const emits = defineEmits([
	"update:dateType",
	"update:modelValue",
	"typeChange",
	"dateChange"
])

// 双向绑定时间
const date = computed({
	get() {
		return props.modelValue || []
	},
	set(val) {
		emits("update:modelValue", val)
	}
})
// 是否聚焦
const boxFocus = ref(false)
// 时间值类型列表分类
const typeObj = reactive({
	typeString: [
		"year",
		"month",
		"date",
		"dates",
		"months",
		"years",
		"week",
		"datetime"
	],
	typeArray: ["datetimerange", "daterange", "monthrange"]
})

const bind = computed(() => {
	return (
		props.options.find((item) => item.value === props.currentType)?.dateBind ||
		{}
	)
})

// 绑定当前类型
const currentDateType = computed({
	get() {
		return props.dateType
	},
	set(val) {
		emits("update:dateType", val)
	}
})

//  时间选择器类型切换
function typeChange(e) {
	date.value = []
	emits("typeChange", { type: e, date: date.value })
}

// 时间选择器值改变
function dateChange(val) {
	emits("dateChange", val)
}
</script>

<style scoped lang="scss">
.dateCheckOut {
	border: 1px solid #dcdfe6;
	border-radius: 4px;
	transition: all 0.3s;
	@include flex(flex-start);
	&:hover {
		border-color: #c0c4cc;
	}
	&:focus {
		border-color: #0a76a4;
	}
	:deep(.dateCheckOut-typeSelect) {
		height: 100%;
		.el-input {
			height: inherit;
			@include flex(flex-start, flex-start);
		}
		.el-select__wrapper {
			height: 100%;
			box-shadow: none;
			min-height: auto;
		}
	}
	:deep(.el-date-editor) {
		height: 100% !important;
		padding: 0;
		box-shadow: none;
		> i {
			width: 30px;
			height: inherit;
			@include flex;
		}
		.el-range-input {
			height: inherit;
		}

		.el-input__wrapper {
			box-shadow: none;
		}
	}
	.el-input__inner {
		height: inherit;
		border: none;
	}
}

.boxFocus {
	border-color: #0a76a4;
	&:hover {
		border-color: #0a76a4;
	}
}
</style>
