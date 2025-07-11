//rem
import "amfe-flexible"
const baseSize = 16
// 设置 rem 函数
export function setRem() {
	// 当前页面宽度缩放比例，可根据自己需要修改
	const scale1 = document.documentElement.clientWidth / 1920
	const scale2 = document.documentElement.clientHeight / 929
	const scale = scale1 < scale2 ? scale1 : scale2
	// 设置页面根节点字体大小
	document.documentElement.style.fontSize = baseSize * Math.min(scale, 2) + "px"
}
