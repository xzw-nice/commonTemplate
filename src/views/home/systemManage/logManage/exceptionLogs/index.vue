<template>
  <div class="templatePage-layout">
    <div class="templatePage-layout-topOperate">
      <div class="templatePage-layout-topOperate-left">
        <div class="templatePage-layout-topOperate-left-defaultFilter">
          <el-input
              v-model="searchList.name"
              class="templatePage-layout-topOperate-left-input"
              clearable
              placeholder="输入关键词搜索"
              @change="handleSearch"
          ></el-input>
        </div>
      </div>
    </div>
    <div v-loading="loading" class="templatePage-layout-table">
      <el-table
          :data="tableData"
          border
          lazy
          row-key="id"
          show-overflow-tooltip
      >
        <template #empty>
          <el-empty description="暂无数据" />
        </template>
        <el-table-column
            :show-overflow-tooltip="false"
            align="center"
            fixed="left"
            prop="selection"
            type="selection"
            width="50"
        ></el-table-column>
        <el-table-column
            align="center"
            fixed="left"
            label="序号"
            prop="index"
            width="60"
        >
          <template #default="{ $index }">
            {{ (searchList.current - 1) * searchList.size + $index + 1 }}
          </template>
        </el-table-column>
        <el-table-column
            v-for="(item,index) in tableHeader"
            :key="`${item.id}_${index}`"
            :label="item.label"
            :prop="item.prop"
            :type="item.type"
            :width="item.width"
            align="center"
        >
           <template v-if="item.prop === 'isPause'" #default="scoped">
             <el-tag :type="scoped.row.isPause?'warning':'success'">{{ scoped.row.isPause ? '已暂停' : '运行中' }}
             </el-tag>
           </template>
           <template v-else-if="item.custom" #default="{row}">
             <el-button link type="primary" class="examine" @click="showAlert(item.label,row[item.prop],item.prop === 'stackTrace')">查看</el-button>
           </template>
        </el-table-column>
      </el-table>
      <el-pagination
          v-model:current-page="searchList.current"
          v-model:page-size="searchList.size"
          :page-sizes="[20, 30, 40, 50, 100]"
          :total="total"
          class="templatePage-layout-table-pagination"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="getList"
          @current-change="getList"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, nextTick } from "vue"
import moreOperate from "@/components/MoreOperate"
import {cloneDeep} from "lodash";
import {getExceptionList} from "@/api/systemManage/logManage/exceptionLogs/index.js"

const loading = ref(false)

const tableHeader = [
  {
    prop: 'className',
    label: '异常类别'
  },
  {
    prop: 'errorCode',
    label: '错误代码',
    width: '120'
  },
  {
    prop: 'errorLevel',
    label: '错误级别',
    width: '120'
  },
  {
    prop: 'errorMessage',
    label: '错误信息',
    custom: '查看',
    width: '120'
  },
  {
    prop: 'lineNumber',
    label: '异常的代码行号',
    width: '140'
  },
  {
    prop: 'methodName',
    label: '异常的方法名'
  },
  {
    prop: 'stackTrace',
    label: '异常堆栈信息',
    custom: '查看',
    width: '120'
  },
  {
    prop: 'threadName',
    label: '异常的线程名'
  },
  {
    prop: 'createTime',
    label: '创建时间',
    width: '160'
  }
]

// 弹出框配置
const saveDialogData = reactive({
  visible: false,
  data: {}
})

// 查询条件
const searchList = reactive({
  name: "",
  current: 1,
  size: 20
})

// 总数据
const total = ref(0)

// 表格数据
const tableData = ref([])

// 手动查询
function handleSearch() {
  searchList.current = 1
  getList()
}

// 获取列表数据
function getList() {
  loading.value = true
  getExceptionList(searchList).then(res => {
    if (res.records?.length) {
      tableData.value = res.records
      total.value = res.total
    }else{
      tableData.value = []
      total.value = 0
    }
  }).finally(() => {
    loading.value = false
  })
}

// 删除按钮
function delBtn(e) {
  ElMessageBox.confirm("是否确认删除?", "提示", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning"
  })
      .then(() => {})
      .catch(() => {
        ElMessage({
          type: "info",
          message: "取消操作"
        })
      })
}

function showAlert(title, message, large) {
  ElMessageBox.alert(message, title, {
    dangerouslyUseHTMLString: true,
    customClass: `exceptionLog-alertMessage ${large && 'exceptionLogs-alertMessageLarge' || ''}`
  })
}

getList()
</script>

<style lang="scss" scoped>
.moreFilter-popover{
  &-form{
    :deep(.el-form-item){
      width: 100%;
    }
  }
  &-operate{
    @include flex(space-between);
  }
}
</style>
<style lang="scss">
.exceptionLog-alertMessage{
  min-width: 800px;
  .el-message-box__content{
    max-height: 80vh;
    overflow-y: auto;
  }
}
.exceptionLogs-alertMessageLarge{
  min-width: 1400px;
}
</style>
