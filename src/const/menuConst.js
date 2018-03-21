const menu = {};
const map = {};
menu.data = [
	{
		text: '个人中心',
		path: '/statistics',
		icon: 'iconfont el-icon-my-statistics',
		type: 'item'
	},
	{
		text: '消息',
		path: '/news',
		icon: 'iconfont el-icon-my-email',
		type: 'submenu',
		children: [
			{
				text: '邮件',
				path: '/news/mailList',
				icon: 'iconfont el-icon-my-email',
				type: 'item',
			},
			{
				text: '系统消息',
				path: '/news/systemMessage',
				icon: 'iconfont el-icon-my-newlabel',
				type: 'item',
			}
		]
	},
	// {
	// 	text: '邮件',
	// 	path: '/mailList',
	// 	icon: 'iconfont el-icon-my-email',
	// 	type: 'item',
	// },
	{
		text: '任务',
		path: '/task',
		icon: 'iconfont el-icon-my-task',
		type: 'submenu',
		children: [
			{
				text: '未完成',
				path: '/task/pending',
				icon: 'iconfont el-icon-my-task-pending',
				type: 'item',
			},
			{
				text: '暂停处理',
				path: '/task/pause',
				icon: 'iconfont el-icon-my-pause',
				type: 'item',
			},
			{
				text: '已完成',
				path: '/task/finish',
				icon: 'iconfont el-icon-my-task-finish',
				type: 'item',
			},
			{
				text: '期限管控',
				path: '/task/expiring',
				icon: 'iconfont el-icon-my-task-pending',
				type: 'item',
			}
		]
	},
	{
		text: '提案',
		path: '/proposal',
		icon: 'iconfont el-icon-my-proposal',
		type: 'submenu',
		children: [
			{
				text: '新建提案',
				path: '/proposal/add',
				icon: 'iconfont el-icon-my-proposal-add',
				type: 'item'
			},
			{
				text: '提案列表',
				path: '/proposal/list',
				icon: 'iconfont el-icon-my-proposal',
				type: 'item'
			},
		]
	},
	{
		text: '专利',
		path: '/patent',
		icon: 'iconfont el-icon-my-patent',
		type: 'submenu',
		children: [
			{
				text: '新建专利',
				path: '/patent/add',
				icon: 'iconfont el-icon-my-proposal-add',
				type: 'item'
			},
			{
				text: '专利管理',
				path: '/patent/list',
				icon: 'iconfont el-icon-my-patent',
				type: 'item',
			},
			// {
			// 	text: '专利统计',
			// 	path: '/patent/statistics',
			// 	icon: '',
			// 	type: 'item',
			// },
			{
				text: '通知书管理',
				path: '/patent/notice',
				icon: 'iconfont el-icon-my-notice',
				type: 'item',
			}
		]
	},
	{
		text: '商标',
		path: '/trademark',
		icon: 'iconfont	 el-icon-my-task',
		type: 'submenu',
		children: [
			{
				text: '新建商标',
				path: '/trademark/add',
				icon: 'iconfont el-icon-my-proposal-add',
				type: 'item'
			},{
				text: '商标管理',
				icon: 'iconfont el-icon-my-trademark',
				path: '/trademark/list',
				type: 'item',
			},
			{
				text: '通知书管理',
				icon: 'iconfont el-icon-my-notice',
				type: 'item',
				path: '/trademark/notice',
			}
		]
	},
	{
		text: '版权',
		path: '/copyright',
		icon: 'iconfont	 el-icon-my-copyright',
		type: 'submenu',
		children: [
			{
				text: '新建版权',
				path: '/copyright/add',
				icon: 'iconfont el-icon-my-proposal-add',
				type: 'item'
			},
			{
				text: '版权管理',
				path: '/copyright/list',
				icon: 'iconfont	 el-icon-my-copyright',
				type: 'item'
			},
			// {
			// 	text: '通知书管理',
			// 	path: '/copyright/notice',
			// 	icon: 'iconfont el-icon-my-notice',
			// 	type: 'item',
			// },
		]
	},
	{
		text: '费用',
		path: '/fee',
		icon: 'iconfont el-icon-my-fee',
		type: 'submenu',
		children: [{
			text: '应收明细',
			path: '/fee/income',
			icon: 'iconfont el-icon-my-deal',
			type: 'item',
		},{
			text: '应付明细',
			path: '/fee/pay',
			icon: 'iconfont el-icon-my-receipt',
			type: 'item',
		},{
			text: '请款单',
			path: '/fee/bill',
			icon: 'iconfont el-icon-my-deal',
			type: 'item',
		},{
			text: '付款单', 
			path: '/fee/payment',
			icon: 'iconfont el-icon-my-pay',
			type: 'item',
		}]
	},
	{
		text: '年费',
		path: '/renewal',
		icon: 'iconfont el-icon-my-renewal',
		type: 'submenu',
		children: [
			{
				text: '年费明细',
				path: '/renewal/fee',
				icon: 'iconfont el-icon-my-renewal-fee',
				type: 'item',
			},
			{
				text: '年费评估单',
				path: '/renewal/estimate',
				icon: 'iconfont el-icon-my-renewal-estimate',
				type: 'item',
			},
		]
	},
	{
		text: '发文',
		path: '/dispatch',
		icon: 'iconfont el-icon-my-email',
		type: 'submenu',
		children: [{
			text: '发文管理',
			path: '/dispatch/administration',
			icon: 'iconfont el-icon-my-dispatch',
			type: 'item'
		}]
	},
	{
		text: '交互',
		path: '/interact',
		icon: 'iconfont el-icon-my-interact',
		type: 'submenu',
		children: [{
			text: '邮件交互',
			path: '/interact/email',
			icon: 'iconfont el-icon-my-email',
			type: 'item',
		}]
	},
	{
		text: '设置',
		path: '/setting',
		icon: 'iconfont el-icon-my-setting',
		type: 'submenu',
		children: [{
			text: '我的个人设置',
			path: '/setting/individual',
			icon: 'iconfont el-icon-my-set-copy',
			type: 'item'
		},
		{
			text: '用户管理',
			path: '/userList',
			icon: 'iconfont el-icon-my-users',
			type: 'item',
		},
		{
			text: '申请人管理',
			path: '/applicantList',
			icon: 'iconfont el-icon-my-proposer',
			type: 'item',
		},
		{ 
			text: '发明人管理',
			path: '/inventorList',
			icon: 'iconfont el-icon-my-proposer',
			type: 'item',
		},
		{
			text: '技术分类管理',
			path: '/classification',
			icon: 'iconfont el-icon-my-techonology',
			type: 'item',
		},
		{
			text: '产品分类管理',
			path: '/product',
			icon: 'iconfont el-icon-my-products',
			type: 'item',
		},
		{
			text: '部门管理',
			path: '/branch',
			icon: 'iconfont el-icon-my-department',
			type: 'item',
		},{
			text: '代理机构管理',
			path: '/setting/agency',
			icon: 'iconfont el-icon-my-organization',
			type: 'item'
		},
		// {
		// 	text: '案件类型管理',
		// 	path: '/setting/case',
		// 	icon: '',
		// 	type: 'item'
		// },
		{
			text: '系统设置',
			path: '/setting/system',
			icon: 'iconfont el-icon-my-system',
			type: 'item'
		},
		// {
		// 	text: '模板管理',
		// 	path: '/setting/template',
		// 	icon: '',
		// 	type: 'item'
		// },
		// {
		// 	text: '发文规则',
		// 	path: '/setting/rule',
		// 	icon: '',
		// 	type: 'item'
		// }
		]
	},
];

menu.map = {
	'/': {text: '主页', icon: 'iconfont el-icon-my-home', path: '/'},
	'/task/pending/check': {text: '提案审核', icon: 'iconfont el-icon-my-task-check', 'path': '/task/pending/check'},
	'/patent/applied/detail': {text: '专利详情', icon: '', path: '/patent/applied/detail'},
	'/patent/list/detail': {text: '专利详情', icon: '', path: '/patent/list/detail'},
	'/copyright/list/detail': {text: '版权详情', icon: '', path: '/copyright/list/detail'},
	'/proposal/edit': {text: '提案编辑', icon: '', path: '/proposal/edit'},
	'/proposal/detail': {text: '提案详情', icon: '', path: '/proposal/detail'},
	'/trademark/list/detail': {text: '商标详情', icon: '', path: '/trademark/list/detail/babel'},
	'/news/mailList/mailAdd': {text: '写邮件', icon: 'el-icon-edit', path: '/news/mailList/mailAdd'},
	'/news/mailList/mailEdit': {text: '编辑邮件', icon: 'el-icon-edit', path: '/news/mailList/mailEdit'},
	'/setting/agency/detail': {text: '代理机构详情', icon: '', path: '/setting/agency/detail'},
	'/setting/template/edit': {text: '编辑模板', icon: 'el-icon-edit', path: '/setting/template/edit'},
	'/news/systemMessage/detail': {text: '消息详情', icon: '', path: '/news/systemMessage/detail'},

	'/proposal/report': {text: '报表', icon: 'el-icon-my-report', path: '/proposal/report'},
	'/proposal/report/add': {text: '新建报表', icon: '', path: '/proposal/report/add'},	
	
	'/patent/report': {text: '报表', icon: 'el-icon-my-report', path: '/patent/report'},
	'/patent/report/add': {text: '新建报表', icon: '', path: '/patent/report/add'},	
	
	'/trademark/report': {text: '报表', icon: 'el-icon-my-report', path: '/trademark/report'},
	'/trademark/report/add': {text: '新建报表', icon: '', path: '/trademark/report/add'},	
	
	'/copyright/report': {text: '报表', icon: 'el-icon-my-report', path: '/copyright/report'},
	'/copyright/report/add': {text: '新建报表', icon: '', path: '/copyright/report/add'},

	'/task/pending/report': {text: '报表', icon: 'el-icon-my-report', path: '/task/pending/report'},
	'/task/pending/report/add': {text: '新建报表', icon: '', path: '/task/pending/report/add'},

	'/task/finish/report': {text: '报表', icon: 'el-icon-my-report', path: '/task/finish/report'},
	'/task/finish/report/add': {text: '新建报表', icon: '', path: '/task/finish/report/add'},

	'/task/pause/report': {text: '报表', icon: 'el-icon-my-report', path: '/task/pause/report'},
	'/task/pause/report/add': {text: '新建报表', icon: '', path: '/task/pause/report/add'},

	'/fee/income/report': {text: '报表', icon: 'el-icon-my-report', path: '/fee/income/report'},
	'/fee/income/report/add': {text: '新建报表', icon: '', path: '/fee/income/report/add'},

	'/fee/pay/report': {text: '报表', icon: 'el-icon-my-report', path: '/fee/pay/report'},
	'/fee/pay/report/add': {text: '新建报表', icon: '', path: '/fee/pay/report/add'},

	'/fee/bill/report': {text: '报表', icon: 'el-icon-my-report', path: '/fee/bill/report'},
	'/fee/bill/report/add': {text: '新建报表', icon: '', path: '/fee/bill/report/add'},

	'/fee/payment/report': {text: '报表', icon: 'el-icon-my-report', path: '/fee/payment/report'},
	'/fee/payment/report/add': {text: '新建报表', icon: '', path: '/fee/payment/report/add'},

};
tailRecursion(menu.data);

export default menu;

function tailRecursion(data) {
	for( let x of data ) {
		menu["map"][x["path"]] = {text: x["text"], icon: x["icon"], path: x["path"]};
		if( x.children && x.children.length != 0) {
			tailRecursion(x["children"]);
		}
	}
}