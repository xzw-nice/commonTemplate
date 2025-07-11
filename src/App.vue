<template>
	<div id="main" class="main">
    <el-config-provider :locale="zhCn">
		<router-view />
    </el-config-provider>
	</div>
</template>

<script lang="ts" setup>
import zhCn from "element-plus/dist/locale/zh-cn"
import {onMounted} from "vue";
import autofit, {elRectification} from 'autofit.js'

onMounted(()=>{
	autofit.init({
		el: "#main",
		resize: true,
	});
  elRectification('div[id*="el-popper-container"]');
})

</script>
<style lang="scss">
* {
	margin: 0;
	padding: 0;
}

html,
body {
	width: 100vw;
	height: 100vh;
	font-size: 16px;
}

ul {
	list-style: none;
}

a {
	text-decoration: none;
}

img {
	vertical-align: top;
	border: none;
}

#app{
  width: 100%;
  height: 100%;
}
.main {
	width: 100%;
	height: 100%;

	> div {
		width: 100%;
		height: 100%;
	}
}

div {
	box-sizing: border-box;
}
</style>
