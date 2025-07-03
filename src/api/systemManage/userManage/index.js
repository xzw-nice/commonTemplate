import { get, post, put, del } from "@/utils/request"

const userList = (data) => get("/sys/user", data) // 分页查询

const getUserDetail = (id) => get(`/sys/user/${id}`) // 获得用户详情
const deleteUser = (data) => del(`/sys/user`, data) // 删除用户
const addUser = (data) => post(`/sys/user`, data) // 添加用户
const editUser = (data) => put(`/sys/user`, data) // 修改用户
const disableUser = (id) => get(`/sys/user/${id}`) // 禁用或启用用户

const enableUser = (id) => get(`/sys/user/disable/${id}`) // 启用/禁用用户

// 重置密码
const resetCipher = (data) => get("/sys/user/restPassword", data)

const userChangePassword = (data) => post("/sys/user/updatePassword", data) // 修改密码


// const restUserRole = (data) => post("/sys/role/reset", data) // 重置用户角色关联

export {
	userList,
	getUserDetail,
	deleteUser,
	addUser,
	editUser,
	disableUser,
	enableUser,
	resetCipher,
	userChangePassword
	// restUserRole
}
