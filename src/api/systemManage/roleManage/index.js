import { get, post, put, del } from "@/utils/request"

const getRoleList = (data) => get("/sys/role", data) // 角色列表
const roleAdd = (data) => post("/sys/role", data) // 角色添加
const roleDel = (data) => del("/sys/role", data) // 角色删除
const roleEdit = (data) => put("/sys/role", data) // 角色修改
const restRoleMenu = (data) => post("/sys/menu/reset", data) // 重置角色菜单关联

export { getRoleList, roleAdd, roleDel, roleEdit, restRoleMenu }
