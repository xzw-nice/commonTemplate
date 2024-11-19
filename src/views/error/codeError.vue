<template>
	<div class="error-codeError">
		<div class="error-codeError-bg">
				<img :src="imgMap[currentError.code]" alt="">
		</div>
			<div class="error-codeError-reason">
        {{ currentError.title }}
			</div>
			<div class="error-codeError-back">
				<el-button icon="back" @click="pageUp" type="primary"> 返回上一页 </el-button>
				<el-button icon="HomeFilled" @click="toHome" > 首页 </el-button>
			</div>
	</div>
</template>

<script setup>
import router from "@/router/index.ts";
import error from "@/assets/img/errorImg/error.webp"
import error403 from "@/assets/img/errorImg/403.svg"
import error404 from "@/assets/img/errorImg/404.svg"
import error500 from "@/assets/img/errorImg/500.svg"
import {ref} from "vue";

const currentError = ref({
  code:"error",
  title:""
})

const imgMap = {
  error,
  403:error403,
  404:error404,
  500:error500,
}

function init(){
  const errorCode = router.currentRoute.value.query?.type || "error"
  const currentRoute = router.getRoutes().find(item => item.name === "错误")
  currentError.value = currentRoute.meta.typeList.find(type => type.code === errorCode)
}

// 返回上一页
function pageUp(){
    router.back()
}
// 返回首页
function toHome(){
    router.push("/")
}

init()
</script>

<style scoped lang="scss">
.error-codeError{
	padding: 5% 10%;
  text-align: center;
	@include flex(center,center,column);
	&-bg{
		width: 100%;
		height: 600px;
    >img{
      height: 100%;
    }
	}
	&-reason{
    margin: 60px 0;
    font-size: 24px;
    font-weight: 700;
    letter-spacing: 1px;
  }
  &-back{
    .el-button{
      height: 32px;
      &:first-child{
        margin-right: 24px;
      }
      &:last-child{
        height: 34px;
      }
    }
  }
}
</style>
