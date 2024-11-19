<template>
  <div @click="toError" class="">
    工作台
  </div>
</template>

<script  setup>
import router from "@/router/index.ts";

function toError(){
  router.push({
    path:'/serverError',
    query:{
      type:"404"
    }
  }); // 跳转到错误页面
}
</script>

<style lang="scss" scoped></style>
