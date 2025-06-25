// 请求api前缀(根据当前环境判断)
export const baseURL: string = import.meta.env.DEV ? "/api" : "/uen/itr/api"

// 文件代理常量
export const fileProxy = "/file/"

// 路由白名单
export const routeWhitelist = ["初始页", "首页", "登录", "数据", "系统"]

// 文本区域的宽高
export const documentSize = {
	// 默认尺寸
	default: {
		width: 1920,
		height: 929
	},
	// 最小尺寸
	min: {
		width: 1253,
		height: 554
	}
}

// 左侧菜单宽度
export const sideMenuWidth: Record<string, any> = {
	collapsedWidth: "64px",
	expandedWidth: "220px"
}

// 路由大归类
export const routeSortOut: any = {
	list: ["home"],
	nameList: {
		home: "首页",
	}
}

// TODO 打包时删除
export const menuTree: Record<string, any>[] = [
	{
		id: 260,
		pid: 0,
		name: "工作台",
		component: "home/workbench/index",
		path: "/home/workbench",
		icon: "home-3-line",
		type: 1,
		authStr: "untest",
		isHide: false,
		status: 1,
		sort: 0
		// children: [
		//     {
		//         id: 261,
		//         pid: 260,
		//         name: "测试页",
		//         component: null,
		//         path: "/testpage",
		//         icon: "pie-chart-line",
		//         type: 2,
		//         authStr: "testpage",
		//         isHide: false,
		//         status: 1,
		//         sort: 0,
		//         link: "/",
		//         children: [
		//             {
		//                 id: 264,
		//                 pid: 261,
		//                 name: "测试页11",
		//                 component: "test/children",
		//                 path: "/testpage11",
		//                 icon: "building-fill",
		//                 type: 2,
		//                 authStr: "testpage",
		//                 isHide: false,
		//                 status: 1,
		//                 sort: 0,
		//                 link: "/",
		//                 children: null
		//             },
		//             {
		//                 id: 267,
		//                 pid: 261,
		//                 name: "test4",
		//                 component: "test/test2/test4",
		//                 path: "/test4",
		//                 icon: "el-icon-cpu",
		//                 type: 2,
		//                 authStr: "testpage",
		//                 isHide: false,
		//                 status: 1,
		//                 sort: 0,
		//                 link: "/",
		//                 children: null
		//             }
		//         ]
		//     },
		//     {
		//         id: 265,
		//         pid: 260,
		//         name: "test2",
		//         component: null,
		//         path: "test/test2",
		//         icon: "el-icon-cpu",
		//         type: 2,
		//         authStr: "testpage",
		//         isHide: false,
		//         status: 1,
		//         sort: 0,
		//         link: "/",
		//         children: [
		//             {
		//                 id: 266,
		//                 pid: 265,
		//                 name: "test2-1",
		//                 component: "test/test2/index",
		//                 path: "/test2",
		//                 icon: "el-icon-cpu",
		//                 type: 2,
		//                 authStr: "testpage",
		//                 isHide: false,
		//                 status: 1,
		//                 sort: 0,
		//                 link: "/",
		//                 children: null
		//             }
		//         ]
		//     },
		//     {
		//         id: 266,
		//         pid: 260,
		//         name: "test3",
		//         component: "test/test2/test3",
		//         path: "/test3",
		//         icon: "grid-fill",
		//         type: 2,
		//         authStr: "testpage",
		//         isHide: false,
		//         status: 1,
		//         sort: 0,
		//         link: "/",
		//         children: null
		//     }
		// ]
	},
	{
		id: 261,
		pid: 1,
		name: "统计分析",
		component: "home/statisticalAnalysis/index",
		path: "/home/statisticalAnalysis",
		icon: "bubble-chart-line",
		type: 1,
		authStr: "untest1",
		isHide: false,
		status: 1,
		sort: 0
		// children: [
		// 	{
		// 		id: 262,
		// 		pid: 261,
		// 		name: "测试页1",
		// 		component: "test/test1",
		// 		path: "/testpage1",
		// 		icon: "el-icon-cpu",
		// 		type: 2,
		// 		authStr: "testpage1",
		// 		isHide: false,
		// 		status: 1,
		// 		sort: 0,
		// 		link: "/",
		// 		children: null
		// 	}
		// ]
	},
	{
		id: 244,
		pid: 1,
		name: "考评计划",
		component: "home/appraisalPlan/index",
		path: "/home/appraisalPlan",
		icon: "file-list-line",
		type: 1,
		authStr: "untest1",
		isHide: false,
		status: 1,
		sort: 0
	},
	{
		id: 255,
		pid: 1,
		name: "数据中心",
		component: "/",
		path: "/home/dataCenter",
		icon: "pie-chart-line",
		type: 1,
		authStr: "untest1",
		isHide: false,
		status: 1,
		sort: 0,
		link: "/dataCenter",
		isOpenBlank: true
	},
	{
		id: 266,
		pid: 1,
		name: "系统管理",
		component: "",
		path: "/home/systemManage",
		icon: "apps-line",
		type: 1,
		authStr: "untest1",
		isHide: false,
		status: 1,
		sort: 0,
		children: [
			{
				id: 267,
				pid: 270,
				name: "用户管理",
				component: "home/systemManage/userManage/index",
				path: "/home/systemManage/userManage",
				icon: "user-3-line",
				type: 2,
				authStr: "testpage",
				isHide: false,
				status: 1,
				sort: 0
			},
			{
				id: 268,
				pid: 270,
				name: "角色管理",
				component: "home/systemManage/roleManage/index",
				path: "/home/systemManage/roleManage",
				icon: "user-settings-line",
				type: 2,
				authStr: "testpage",
				isHide: false,
				status: 1,
				sort: 1
			},
			{
				id: 269,
				pid: 270,
				name: "菜单管理",
				component: "home/systemManage/menuManage/index",
				path: "/home/systemManage/menuManage",
				icon: "menu-line",
				type: 2,
				authStr: "testpage",
				isHide: false,
				status: 1,
				sort: 2
			}
		]
	}
]
