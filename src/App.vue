<template>
	<div id="main" class="main">
		<router-view />
	</div>
</template>

<script lang="ts" setup>
import { onMounted } from "vue"
import autofit from "autofit.js"

onMounted(() => {
	autofit.init({
		el: "#main",
		resize: true
	})
})
</script>
<style lang="scss">
* {
	margin: 0;
	padding: 0;
}

html,
body {
	width: 100%;
	height: 100%;
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

.main {
	width: 100%;
	height: 100vh;

	> div {
		width: 100%;
		height: 100%;
	}
}

div {
	box-sizing: border-box;
}
</style>
