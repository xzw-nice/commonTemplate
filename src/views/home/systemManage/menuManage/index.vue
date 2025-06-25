<template>
  <div class="systemManage-menuManage">
    <div class="menuManage-topOperate">
      <div class="menuManage-topOperate-left">
        <el-input
            v-model="searchList.name"
            class="menuManage-topOperate-left-input"
            clearable
            placeholder="输入菜单名称查询"
            @change="getMenu"
        ></el-input>
      </div>
      <div class="menuManage-topOperate-right">
        <more-operate
            :dropdown-events="{ command: dropdown.event }"
            :dropdown-item="dropdown.list"
        />
      </div>
    </div>
    <div v-loading="loading" class="menuManage-tableTree">
      <el-table
          :data="menuList"
          border
          lazy
          row-key="id"
          :show-overflow-tooltip="{

          }"
          default-expand-all
      >
        <template #empty>
          <el-empty description="暂无数据"/>
        </template>
        <el-table-column
            align="left"
            fixed="left"
            label="菜单名称"
            min-width="160"
            prop="name"
        >
          <template #header>
            <div class="menuManage-tableTree-label-menuName">菜单名称</div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="菜单图标">
          <template #default="{ row }">
            <remix-icon
                :icon-name="row?.icon"
                color="#606266"
                size="24px"
            ></remix-icon>
          </template>
        </el-table-column>
        <el-table-column
            align="center"
            label="菜单类型"
            prop="type"
            width="100"
        >
          <template #default="{ row }">
            <el-tag v-if="row?.type === 1" type="success">目录</el-tag>
            <el-tag v-else-if="row?.type === 2" type="primary">菜单</el-tag>
            <el-tag v-else type="warning">按钮</el-tag>
          </template>
        </el-table-column>
        <el-table-column
            align="center"
            label="路由地址"
            min-width="200"
            prop="path"
        />
        <el-table-column
            align="center"
            label="组件地址"
            min-width="200"
            prop="component"
        />
        <el-table-column
            align="center"
            label="链接地址"
            min-width="120"
            prop="link"
        />
        <el-table-column
            align="center"
            label="启用状态"
            prop="status"
            width="100"
        >
          <template #default="{ row }">
            <el-tag v-if="row?.status" type="success">启用</el-tag>
            <el-tag v-else type="danger">禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column
            align="center"
            label="权限字符"
            prop="authStr"
            width="200"
        />
        <el-table-column align="center" label="可见" prop="isHide" width="100">
          <template #default="{ row }">
            <el-tag v-if="row?.isHide" type="success">可见</el-tag>
            <el-tag v-else type="danger">不禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" fixed="right" label="操作" width="180">
          <template #default="{ row }">
            <el-button
                icon="Edit"
                link
                type="primary"
                @click="editMenu(row)"
            >编辑
            </el-button>
            <el-button
                icon="Delete"
                link
                type="danger"
                @click="delMenuData(row)"
            >删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
  <saveDialog
      v-if="menuList"
      v-model:modelValue="saveDialogData.visible"
      :menu-list="menuList"
      :origin-data="saveDialogData.data"
      @getList="getMenu"
  ></saveDialog>
</template>

<script name="MenuManage" setup>
import {delMenu, getMenuTree} from "@/api/systemManage/menuManage/index"
import {ref, reactive, nextTick} from "vue"
import moreOperate from "@/components/MoreOperate"
import RemixIcon from "@/components/SvgIcon/RemixIcon.vue"
import saveDialog from "./saveDialog.vue"

const loading = ref(false)

const saveDialogData = reactive({
  visible: false,
  data: {}
})

// 查询条件
const searchList = reactive({
  name: "",
  isAll: true
})

const dropdown = reactive({
  list: [
    {
      name: "新增",
      bind: {
        command: {
          fn: addBtn
        },
        icon: "Plus"
      }
    }
  ],
  event(e) {
    e.fn()
  }
})

// 菜单
const menuList = ref([])

// 获取菜单树
function getMenu() {
  loading.value = true
  menuList.value = []
  getMenuTree(searchList)
      .then((res) => {
        menuList.value = res
      })
      .finally(() => {
        loading.value = false
      })
}

// 新增按钮
function addBtn() {
  saveDialogData.data = {}
  saveDialogData.visible = true
}

// 编辑按钮
function editMenu(e) {
  saveDialogData.data = {...e}
  nextTick(() => {
    saveDialogData.visible = true
  })
}

// 删除按钮
function delMenuData(e) {
  ElMessageBox.confirm("是否确认删除?", "提示", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning"
  })
      .then(() => {
        delMenu([e.id]).then(() => {
          ElMessage({
            type: "success",
            message: "操作成功"
          })
          getMenu()
        })
      })
      .catch(() => {
        ElMessage({
          type: "info",
          message: "取消操作"
        })
      })
}

getMenu()
</script>

<style lang="scss" scoped>
.systemManage-menuManage {
  .menuManage-topOperate {
    height: 36px;
    margin-bottom: 24px;
    @include flex;

    &-left {
      flex: 1;
      margin-right: 24px;

      &-input {
        width: 270px;
      }
    }
  }

  .menuManage-tableTree {
    height: calc(100% - 36px - 24px);

    .el-table {
      height: 100%;
    }
  }

  .menuManage-tableTree-label-menuName {
    @include flex;
  }
}
</style>
