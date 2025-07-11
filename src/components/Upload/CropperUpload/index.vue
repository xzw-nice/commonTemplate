<template>
	<el-upload
		:id="`upload_${id}`"
		:before-remove="beforeRemove"
		:before-upload="beforeUpload"
		:limit="limit"
		:show-file-list="false"
		:style="customStyle"
		action="/"
		class="avatar-uploader"
		image-preview
		list-type="picture-card"
	>
		<img v-if="list.length" :src="list[0].url" alt="暂无数据" class="avatar" />
		<el-icon v-else>
			<Plus></Plus>
		</el-icon>
	</el-upload>
	<cropper
		ref="cropper_picture"
		:append-elements="props.appendElement"
		:clip-option="clipOption"
		@upload="toUpload"
	/>
</template>

<script>
import { ref, watch } from "vue"
import Cropper from "./UploadCropper.vue"

export default {
	components: {
		Cropper
	},
	props: {
		id: {},
		accept: {
			type: String,
			default: ""
		},
		fileList: {
			type: Array,
			default: () => []
		},
		// 上传数量限制
		limit: {
			type: Number,
			default: 0
		},
		showRemoveButton: {
			type: Boolean,
			default: true
		},
		// 弹出框挂载的元素
		appendElement: {
			type: [String, Object],
			default: "body"
		},
		// 自定义裁剪配置
		clipOption: {
			type: Object,
			default: () => {
				return {}
			}
		},
		customStyle: {
			type: Object,
			default: () => {
				return {}
			}
		}
	},
	emits: ["upload", "beforeRemove"],
	setup(props, { emit }) {
		const cropper_picture = ref()

		const list = ref([])

		/**上传前钩子函数 */
		function beforeUpload(file) {
			cropper_picture.value.beforeUpload(file)
			return false
		}

		function toUpload(imgInfo, currentImg) {
			emit("upload", imgInfo, currentImg)
		}

		// 重新上传主动打开文件选择框--仅限单文件上传
		function open() {
			const dom = document.getElementById(`upload_${props.id}`)
			dom.childNodes[2].childNodes[1].click()
		}

		//
		function beforeRemove(e) {
			emit("beforeRemove", e)
		}

		watch(
			() => props.fileList,
			(val) => {
				list.value = val
			},
			{
				deep: true,
				immediate: true
			}
		)
		return {
			props,
			beforeUpload,
			open,
			beforeRemove,
			toUpload,
			cropper_picture,
			list
		}
	}
}
</script>

<style lang="scss" scoped>
.avatar-uploader {
	height: 100%;
	width: 100%;

	:deep(.el-upload-list) {
		width: 100%;
		height: 100%;
	}

	img {
		width: 100%;
		//height: 100%;
	}

	:deep(.el-upload--picture-card) {
		height: 100%;
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}
}

.cropper {
	width: 600px;
	height: 500px;
}
</style>
<style lang="scss">
.changeCropper {
	.arco-modal-body {
		overflow: hidden;
	}
}
</style>
