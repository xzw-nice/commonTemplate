<template>
	<el-dialog
		v-model="data.sureCropper"
		:append-to="appendElement"
		:close-on-click-modal="false"
		:modal="false"
		custom-class="upload-dialog"
		top="20vh"
		width="20%"
	>
		<div>是否需要进行裁剪</div>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="normalUpload"> 否 </el-button>
				<el-button type="primary" @click="openClip">是</el-button>
			</span>
		</template>
	</el-dialog>
	<el-dialog
		v-model="data.visibleCropper"
		:close-on-click-modal="false"
		:modal="false"
		append-to-body
		class="upload-dialog changeCropper"
		title="图片裁剪"
		top="5vh"
		width="640px"
	>
		<vue-cropper
			ref="cropper"
			class="cropper"
			v-bind="data.option"
			@realTime="realTime"
		>
		</vue-cropper>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="data.visibleCropper = !data.visibleCropper"
					>取消</el-button
				>
				<el-button type="primary" @click="handleOk"> 确认 </el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script>
import { reactive, ref, watch } from "vue"
import VueCropper from "vue-cropper/next/lib/vue-cropper.vue"
import "vue-cropper/next/dist/index.css"

export default {
	components: { VueCropper },
	props: {
		clipOption: {
			type: Object,
			default: () => {
				return {}
			}
		},
		appendElement: {
			type: [String, Object],
			default: "body"
		}
	},
	emits: ["upload"],
	setup(props, { emit }) {
		const cropper = ref()
		const data = reactive({
			sureCropper: false,
			visibleCropper: false,
			currentImg: "",
			option: {
				img: "", // 裁剪图片的地址
				outputSize: 1, // 裁剪生成图片的质量
				outputType: "jpeg", // 裁剪生成图片的格式\
				info: true, // 裁剪框的大小信息
				canScale: true, // 	图片是否允许滚轮缩放
				autoCrop: true, // 是否默认生成截图框
				// autoCropWidth: 500, // 默认生成截图框宽度 0 ~ max
				// autoCropHeight: 500, // 默认生成截图框高度 0 ~ max
				fixed: false, // 是否开启截图框宽高固定比例
				full: false, // 是否输出原图比例的截图
				fixedBox: false, // 固定截图框大小
				canMove: true, // 上传图片是否可以移动
				canMoveBox: true, // 截图框能否拖动
				original: false, // 上传图片按照原始比例渲染
				centerBox: false, // 截图框是否被限制在图片里面
				high: true, // 	是否按照设备的dpr 输出等比例图片
				infoTrue: false, // true 为展示真实输出图片宽高 false 展示看到的截图框宽高
				maxImgSize: 3000, // 限制图片最大宽度和高度 0 ~ max
				enlarge: 1, // 图片根据截图框输出比例倍数0 ~ max(建议不要太大不然会卡死的呢)
				mode: "contain" // 图片默认渲染方式
			},
			clipInfo: {}, // 已裁剪图片信息
			imgInfo: {} // 保存上传文件信息
		})
		watch(
			() => props.clipOption,
			(val) => {
				data.option = { ...data.option, ...val }
			},
			{
				deep: true,
				immediate: true
			}
		)

		function realTime(realTimeData) {
			data.clipInfo = realTimeData
		}

		/**打开裁剪框 */
		function openClip() {
			data.visibleCropper = !data.visibleCropper
			data.option.img = data.currentImg
			data.sureCropper = false
		}

		/**未裁剪上传 */
		function normalUpload() {
			emit("upload", data.imgInfo, data.currentImg)
			data.sureCropper = !data.sureCropper
		}

		/**
		 * base64转成files
		 * @param dataurl
		 */
		function transformToFiles(dataUrl, fileName) {
			const arr = dataUrl.split(",")
			const mime = arr[0].match(/:(.*?);/)[1]
			const bstr = atob(arr[1])
			let n = bstr.length
			const u8arr = new Uint8Array(n)
			while (n--) {
				u8arr[n] = bstr.charCodeAt(n)
			}
			return new File([u8arr], fileName, { type: mime })
		}

		/**已裁剪上传 */
		function handleOk() {
			cropper.value.getCropBlob((blobData) => {
				const blob = window.URL.createObjectURL(blobData)
				const img = new Image()
				img.src = blob
				img.onload = function () {
					const w = data.clipInfo.w
					let h = data.clipInfo.h
					const scale = w / h
					h = w / scale
					const canvas = document.createElement("canvas")
					const ctx = canvas.getContext("2d")
					canvas.width = w
					canvas.height = h
					ctx.drawImage(img, 0, 0, w, h)
					const cropperPic = canvas.toDataURL(data.option.outputType)
					const files = transformToFiles(cropperPic, data.imgInfo.name)
					data.visibleCropper = false
					emit("upload", files, blob)
				}
			})
		}

		/**上传前操作，获取图片信息 */
		function beforeUpload(file) {
			data.imgInfo = file
			const start = file.type.indexOf("/") + 1
			const end = file.type.length
			data.option.outputType = file.type.substring(start, end)
			// 图片转成流
			data.currentImg = window.URL.createObjectURL(file)
			// 终止上传，进行图片裁剪
			data.sureCropper = true
		}

		watch(
			() => props.clipOption,
			() => {
				data.option = {
					...data.option,
					...props.clipOption
				}
			},
			{
				immediate: true,
				deep: true
			}
		)
		return {
			cropper,
			data,
			realTime,
			openClip,
			normalUpload,
			beforeUpload,
			handleOk
		}
	}
}
</script>

<style lang="scss" scoped>
.cropper {
	width: 600px;
	height: 500px;
}
</style>
<style lang="scss">
.upload-dialog {
	.el-dialog__body {
		padding-top: 0;
		padding-bottom: 0;
	}

	.el-dialog__footer {
		padding: 20px;
	}
}

.changeCropper {
	height: auto;

	.el-dialog__body {
		padding-top: 10px;
		overflow: hidden;
	}
}
</style>
