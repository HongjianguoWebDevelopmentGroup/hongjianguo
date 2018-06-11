//路径取名规则:
//子路径应包含父路径
const menu = {};
const map = {};
const taskMenu = [
	{ type: 'item', text: '我的待办', path: '/task/pending', icon: 'iconfont el-icon-my-task' },
	{ type: 'item', text: '我的关注', path: '/task/regardful', icon: 'iconfont el-icon-my-task' },
	{ type: 'item', text: '暂停处理', path: '/task/pause', icon: 'iconfont el-icon-my-task' },
	{ type: 'item', text: '已完成', path: '/task/finish', icon: 'iconfont el-icon-my-task' },
	{ 
		type: 'submenu', 
		text: '按任务期限', 
		path: '/task/duration', 
		icon: 'iconfont el-icon-my-task',
		children: [
			{ type: 'item', text: '已过期', path: '/task/duration/expired', icon: '' },
			{ type: 'item', text: '本周过期', path: '/task/duration/week', icon: '' },
			{ type: 'item', text: '下周过期', path: '/task/duration/nextWeek', icon: '' },
			{ type: 'item', text: '本月过期', path: '/task/duration/month', icon: '' },
			{ type: 'item', text: '下月过期', path: '/task/duration/nextMonth', icon: '' },
			{ type: 'item', text: '更晚', path: '/task/duration/later', icon: '' },
		]
	},
	{ 
		type: 'submenu',
		text: '按任务阶段', 
		path: '/task/stage', 
		icon: 'iconfont el-icon-my-task',
		children: [
			{ type: 'item', text: '新申请', path: '/task/stage/application', icon: '' },
			{ type: 'item', text: 'OA', path: '/task/stage/oa', icon: '' },
			{ type: 'item', text: '复审', path: '/task/stage/review', icon: '' },
			{ type: 'item', text: '授权', path: '/task/stage/authorization', icon: '' },
			{ type: 'item', text: '无效', path: '/task/stage/invalid', icon: '' },
			{ type: 'item', text: '年费续展', path: '/task/stage/annualFee', icon: '' },
			{ type: 'item', text: '行政诉讼', path: '/task/stage/procedure', icon: '' },
		]
	},
	{ 
		type: 'submenu',
		text: '按案件类型',
		path: '/task/type',
		icon: 'iconfont el-icon-my-task',
		children: [
			{ type: 'item', text: '提案', path: '/task/type/proposal', icon: '' },
			{ type: 'item', text: '专利', path: '/task/type/patent', icon: '' },
			{ type: 'item', text: '商标', path: '/task/type/trademark', icon: '' },
			{ type: 'item', text: '版权', path: '/task/type/copyright', icon: '' },
		],
	},
];

const proposalMenu = [
	{ type: 'item', text: '全部提案', path: '/proposal/list', icon: 'iconfont el-icon-my-proposal' },
	{
		type: 'submenu',
		text: '按提案时间',
		path: '/proposal/creatTime',
		icon: 'iconfont el-icon-my-proposal',
		children: [
			{ type: 'item', text: '本月', path: '/proposal/creatTime/month', icon: '' },
			{ type: 'item', text: '本季度', path: '/proposal/creatTime/quarter', icon: '' },
			{ type: 'item', text: '本年', path: '/proposal/creatTime/year', icon: '' },
		],
	},
	{
		type: 'submenu',
		text: '按新颖性',
		path: '/proposal/novelty',
		icon: 'iconfont el-icon-my-proposal',
		children: [
			{ type: 'item', text: '有新颖性', path: '/proposal/novelty/existent', icon: '' },
			{ type: 'item', text: '无新颖性结案', path: '/proposal/novelty/non-existent', icon: '' },
		]
	},
]

const patentMenu = [
	{ type: 'item', text: '全部专利', path: '/patent/list', icon: 'iconfont el-icon-my-patent' },
	{ 
		type: 'submenu', 
		text: '专利（按阶段）', 
		path: '/patent/stage',
		icon: 'iconfont el-icon-my-patent',
		children: [
			{ type: 'item', text: '新申请', path: '/patent/stage/application', icon: '' },
			{ type: 'item', text: 'OA', path: '/patent/stage/oa', icon: '' },
			{ type: 'item', text: '复审', path: '/patent/stage/review', icon: '' },
			{ type: 'item', text: '授权', path: '/patent/stage/authorization', icon: '' },
			{ type: 'item', text: '无效', path: '/patent/stage/invalid', icon: '' },
			{ type: 'item', text: '年费续展', path: '/patent/stage/annualFee', icon: '' },
			{ type: 'item', text: '行政诉讼', path: '/patent/stage/procedure', icon: '' },
			{ type: 'item', text: '失效', path: '/patent/stage/failure', icon: '' },
		]
	},
	{ 
		type: 'submenu', 
		text: '专利（按国家）', 
		path: '/patent/area',
		icon: 'iconfont el-icon-my-patent',
		children: [
			{ type: 'item', text: 'CN', path: '/patent/area/cn', icon: '' },
			{ type: 'item', text: 'PCT', path: '/patent/area/pct', icon: '' },
			{ type: 'item', text: '其他', path: '/patent/area/other', icon: '' },
		],
	},
	{ 
		type: 'submenu', 
		text: '期限到期', 
		path: '/patent/duration',
		icon: 'iconfont el-icon-my-patent',
		children: [
			{ type: 'item', text: '下月优先权到期', path: '/patent/duration/priority', icon: '' },
			{ type: 'item', text: '下月主动修改到期', path: '/patent/duration/modification', icon: '' },
			{ type: 'item', text: '下月PCT进国家到期', path: '/patent/duration/pct', icon: '' },
			{ type: 'item', text: '下月PCT19条修改到期', path: '/patent/duration/pct19', icon: '' },
		]
	},
];

const trademarkMenu = [
	{ type: 'item', text: '全部商标', path: '/trademark/list', icon : 'iconfont el-icon-my-trademark' },
	{ 
		type: 'submenu', 
		text: '商标（按阶段）',
		path: '/trademark/stage',
		icon: 'iconfont el-icon-my-trademark',
		children: [
			{ type: 'item', text: '新申请', path: '/trademark/stage/application', icon: '' },
			{ type: 'item', text: 'OA', path: '/trademark/stage/oa', icon: '' },
			{ type: 'item', text: '复审', path: '/trademark/stage/review', icon: '' },
			{ type: 'item', text: '授权', path: '/trademark/stage/authorization', icon: '' },
			{ type: 'item', text: '无效', path: '/trademark/stage/invalid', icon: '' },
			{ type: 'item', text: '年费续展', path: '/trademark/stage/annualFee', icon: '' },
			{ type: 'item', text: '行政诉讼', path: '/trademark/stage/procedure', icon: '' },
			{ type: 'item', text: '失效', path: '/trademark/stage/failure', icon: '' },
		],
	},
	{ 
		type: 'submenu', 
		text: '商标（按国家）',
		path: '/trademark/area',
		icon: 'iconfont el-icon-my-trademark',
		children: [
			{ type: 'item', text: 'CN', path: '/trademark/area/cn', icon: '' },
			{ type: 'item', text: '马德里', path: '/trademark/area/madrid', icon: '' },
			{ type: 'item', text: '其他', path: '/trademark/area/other', icon: '' },
		], 
	},
];

const copyrightMenu = [
	{ type: 'item', text: '全部版权', path: '/copyright/list', icon: 'iconfont el-icon-my-copyright' },
	{ 
		type: 'submenu', 
		text: '版权（按阶段）',
		path: '/copyright/stage',
		icon: 'iconfont el-icon-my-copyright',
		children: [
			{ type: 'item', text: '新申请', path: '/copyright/stage/application', icon: '' },
			{ type: 'item', text: 'OA', path: '/copyright/stage/oa', icon: '' },
			{ type: 'item', text: '授权', path: '/copyright/stage/authorization', icon: '' },
		],
	},
	{ 
		type: 'submenu', 
		text: '版权（按国家）',
		path: '/copyright/area',
		icon: 'iconfont el-icon-my-copyright',
		children: [
			{ type: 'item', text: 'CN', path: '/copyright/area/cn', icon: '' },
			{ type: 'item', text: '其他', path: '/copyright/area/other', icon: '' },
		], 
	},
];

const feeMenu = [
	{	
		type: 'submenu',
		text: '南山区资助',
		path: '/fee/nanshan',
		icon: 'iconfont el-icon-my-receipt',
		children: [
			{ type: 'item', text: '专利', path: '/fee/nanshan/patent', icon: '' },
			{ type: 'item', text: '商标', path: '/fee/nanshan/trademark', icon: '' },
			{ type: 'item', text: '著作权', path: '/fee/nanshan/copyright', icon: '' },
		]
	},
	{
		type: 'submenu',
		text: '深圳市资助',
		path: '/fee/shenzhen',
		icon: 'iconfont el-icon-my-receipt',
		children: [
			{ type: 'item', text: '专利', path: '/fee/shenzhen/patent', icon: '' },
			{ type: 'item', text: '商标', path: '/fee/shenzhen/trademark', icon: '' },
			{ type: 'item', text: '著作权', path: '/fee/shenzhen/copyright', icon: '' },
		]
	},
	{
		type: 'submenu',
		text: '账单',
		path: '/fee/account',
		icon: 'iconfont el-icon-my-receipt',
		children: [
			{ type: 'item', text: '待审核', path: '/fee/account/check', icon: '' },
			{ type: 'item', text: '待上传凭证', path: '/fee/account/upload', icon: '' },
			{ type: 'item', text: '待付款', path: '/fee/account/pay', icon: '' },
			{ type: 'item', text: '已付款', path: '/fee/account/paid', icon: '' },
			{ type: 'item', text: '已退回', path: '/fee/account/refuse', icon: '' },
		]
	},
	{
		type: 'submenu',
		text: '年费',
		path: '/fee/renewal',
		icon: 'iconfont el-icon-my-renewal-fee',
		children: [
			{ type: 'item', text: '待缴纳', path: '/fee/renewal/pay' },
			{ type: 'item', text: '已缴纳', path: '/fee/renewal/paid' },
			{ type: 'item', text: '评估放弃', path: '/fee/renewal/refuse' },
		]
	},
];

const renewalMenu = [
	
];

const reportMenu = [
	{ type: 'item', text: '任务报表', path: '/report/task', icon: 'el-icon-my-report' },
	{ type: 'item', text: '提案报表', path: '/report/proposal', icon: 'el-icon-my-report' },
	{ type: 'item', text: '专利报表', path: '/report/patent', icon: 'el-icon-my-report' },
	{ type: 'item', text: '商标报表', path: '/report/trademark', icon: 'el-icon-my-report' },
	{ type: 'item', text: '版权报表', path: '/report/copyright', icon: 'el-icon-my-report' },
	{ type: 'item', text: '费用报表', path: '/report/fee', icon: 'el-icon-my-report' },
	{ type: 'item', text: '账单报表', path: '/report/invoice', icon: 'el-icon-my-report' },
]

const newsMenu = [
	{ type: 'item', text: '通知邮件', path: '/news/mailList', icon: 'iconfont el-icon-my-email' },
	// { type: 'item', text: '交互邮件', path: '/news/interact', icon: 'iconfont el-icon-my-interact' },
	{
		type: 'item',
		text: '专利通知书',
		path: '/news/patent_notice',
		icon: 'iconfont el-icon-my-patent',
	},
	{
		type: 'item',
		text: '商标通知书',
		path: '/news/trademark_notice',
		icon: 'iconfont el-icon-my-trademark',
	},
	{
		text: '版权通知书',
		path: '/news/copyright_notice',
		icon: 'iconfont el-icon-my-copyright',
		type: 'item',
	},
];

const settingMenu = [
	{ type: 'item', text: '我的个人设置', path: '/setting/individual', icon: 'iconfont el-icon-my-set-copy' },
	{ type: 'item', text: '用户管理', path: '/setting/userList', icon: 'iconfont el-icon-my-users' },
	{ type: 'item', text: '申请人管理', path: '/setting/applicantList', icon: 'iconfont el-icon-my-proposer' },
	{ type: 'item', text: '发明人管理', path: '/setting/inventorList', icon: 'iconfont el-icon-my-proposer' },
	{ type: 'item', text: '技术分类管理', path: '/setting/classification', icon: 'iconfont el-icon-my-techonology' },
	{ type: 'item', text: '产品分类管理', path: '/setting/product', icon: 'iconfont el-icon-my-products' },
	{ type: 'item', text: '部门管理', path: '/setting/branch', icon: 'iconfont el-icon-my-department' },
	{ type: 'item', text: '代理机构管理', path: '/setting/agency',icon: 'iconfont el-icon-my-organization' },
	{ type: 'item', text: '报价管理', path: '/setting/offer', icon: 'iconfont el-icon-my-organization' },
	{ type: 'item', text: '系统设置', path: '/setting/system', icon: 'iconfont el-icon-my-system' },
];

const testMenu = [
	{ type: 'item', text: '自定义表单', path: '/test/form', icon: '' },
]

menu.source = [
	{
		text: '个人中心',
		key: 'statistics',
		path: '/statistics',
	},
	{
		text: '任务',
		key: 'task',
		path: '/task',
		icon: 'iconfont el-icon-my-task',
		menu: taskMenu,
	},
	{
		text: '提案',
		key: 'proposal',
		path: '/proposal',
		icon: 'iconfont el-icon-my-proposal',
		menu: proposalMenu,
	},
	{
		text: '专利',
		key: 'patent',
		path: '/patent',
		icon: 'iconfont el-icon-my-patent',
		menu: patentMenu,
	},
	{
		text: '商标',
		key: 'trademark',
		path: '/trademark',
		icon: 'iconfont el-icon-my-trademark',
		menu: trademarkMenu,
	},
	{
		text: '版权',
		key: 'copyright',
		path: '/copyright',
		icon: 'iconfont el-icon-my-copyright',
		menu: copyrightMenu,
	},
	{
		text: '费用',
		key: 'fee',
		path: '/fee',
		icon: 'iconfont el-icon-my-fee',
		menu: feeMenu,
	},
	// {
	// 	text: '年费',
	// 	key: 'renewal',
	// 	path: '/renewal',
	// 	icon: 'iconfont el-icon-my-renewal',
	// 	menu: renewalMenu,
	// },
	{
		text: '报表',
		key: 'report',
		path: '/report',
		icon: 'el-icon-my-report',
		menu: reportMenu,
	},
	{
		text: '交互',
		key: 'news',
		path: '/news',
		icon: 'iconfont el-icon-my-email',
		menu: newsMenu,
	},
	{
		text: '设置',
		key: 'setting',
		path: '/setting',
		icon: 'iconfont el-icon-my-setting',
		menu: settingMenu,
	},
	// {
	// 	text: '测试',
	// 	key: 'test',
	// 	path: '/test',
	// 	icon: '',
	// 	menu: testMenu,
	// }
]

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

	'/proposal/add': {text: '新建提案', icon: '', path: '/proposal/add'},
	'/patent/add': {text: '新建专利', icon: '', path: '/patent/add'},
	'/trademark/add': {text: '新建商标', icon: '', path: '/trademark/add'},
	'/copyright/add': {text: '新建版权', icon: '', path: '/copyright/add'},

	'/report/task/add': {text: '新建报表', icon: '', path: '/report/task/add'},	
	'/report/proposal/add': {text: '新建报表', icon: '', path: '/report/proposal/add'},	
	'/report/patent/add': {text: '新建报表', icon: '', path: '/report/patent/add'},	
	'/report/trademark/add': {text: '新建报表', icon: '', path: '/report/trademark/add'},	
	'/report/copyright/add': {text: '新建报表', icon: '', path: '/report/copyright/add'},
	'/report/fee/add': {text: '新建报表', icon: '', path: '/report/fee/add'},
	'/report/invoice/add': {text: '新建报表', icon: '', path: '/report/invoice/add'},

};

const tailRecursion = (data) => {
	for( let x of data ) {
		if(!x["path"]) continue;
		const path = x['type'] && x['type'] == 'submenu' ? '' : x["path"];
		menu["map"][x["path"]] = { text: x["text"], icon: x["icon"], path };
		if( x.children && x.children.length != 0) {
			tailRecursion(x["children"]);
		}
	}
}

for(let k in menu.source) {
	const item = menu.source[k];
	const text = item["text"] ? item["text"] : '';
	const icon = item["icon"] ? item["icon"] : '';
	const path = item["path"]; 
	const parent = '/';
	menu["map"][item["path"]] = { text, icon, path, parent };
	if(item['menu'] && item['menu']['length'] != 0) {
		tailRecursion(item['menu']);		
	}
}


export default menu;

// menu.data = [
// 	{
// 		text: '个人中心',
// 		path: '/statistics',
// 		icon: 'iconfont el-icon-my-statistics',
// 		type: 'item'
// 	},
// 	{
// 		text: '邮件',
// 		path: '/news',
// 		icon: 'iconfont el-icon-my-email',
// 		type: 'submenu',
// 		children: [
			
// 			// {
// 			// 	text: '系统消息',
// 			// 	path: '/news/systemMessage',
// 			// 	icon: 'iconfont el-icon-my-newlabel',
// 			// 	type: 'item',
// 			// }
// 		]
// 	},
// 	// {
// 	// 	text: '邮件',
// 	// 	path: '/mailList',
// 	// 	icon: 'iconfont el-icon-my-email',
// 	// 	type: 'item',
// 	// },
// 	{
// 		text: '任务',
// 		path: '/task',
// 		icon: 'iconfont el-icon-my-task',
// 		type: 'submenu',
// 		children: [
// 			{
// 				text: '未完成',
// 				path: '/task/pending',
// 				icon: 'iconfont el-icon-my-task-pending',
// 				type: 'item',
// 			},
// 			{
// 				text: '暂停处理',
// 				path: '/task/pause',
// 				icon: 'iconfont el-icon-my-pause',
// 				type: 'item',
// 			},
// 			{
// 				text: '已完成',
// 				path: '/task/finish',
// 				icon: 'iconfont el-icon-my-task-finish',
// 				type: 'item',
// 			},
// 			{
// 				text: '期限管控',
// 				path: '/task/expiring',
// 				icon: 'iconfont el-icon-my-task-pending',
// 				type: 'item',
// 			}
// 		]
// 	},
// 	{
// 		text: '提案',
// 		path: '/proposal',
// 		icon: 'iconfont el-icon-my-proposal',
// 		type: 'submenu',
// 		children: [
// 			{
// 				text: '新建提案',
// 				path: '/proposal/add',
// 				icon: 'iconfont el-icon-my-proposal-add',
// 				type: 'item'
// 			},
// 			{
// 				text: '提案列表',
// 				path: '/proposal/list',
// 				icon: 'iconfont el-icon-my-proposal',
// 				type: 'item'
// 			},
// 		]
// 	},
// 	{
// 		text: '专利',
// 		path: '/patent',
// 		icon: 'iconfont el-icon-my-patent',
// 		type: 'submenu',
// 		children: [
// 			{
// 				text: '新建专利',
// 				path: '/patent/add',
// 				icon: 'iconfont el-icon-my-proposal-add',
// 				type: 'item'
// 			},
// 			{
// 				text: '专利管理',
// 				path: '/patent/list',
// 				icon: 'iconfont el-icon-my-patent',
// 				type: 'item',
// 			},
// 			// {
// 			// 	text: '专利统计',
// 			// 	path: '/patent/statistics',
// 			// 	icon: '',
// 			// 	type: 'item',
// 			// },
// 			{
// 				text: '通知书管理',
// 				path: '/patent/notice',
// 				icon: 'iconfont el-icon-my-notice',
// 				type: 'item',
// 			}
// 		]
// 	},
// 	{
// 		text: '商标',
// 		path: '/trademark',
// 		icon: 'iconfont	 el-icon-my-task',
// 		type: 'submenu',
// 		children: [
// 			{
// 				text: '新建商标',
// 				path: '/trademark/add',
// 				icon: 'iconfont el-icon-my-proposal-add',
// 				type: 'item'
// 			},{
// 				text: '商标管理',
// 				icon: 'iconfont el-icon-my-trademark',
// 				path: '/trademark/list',
// 				type: 'item',
// 			},
// 			{
// 				text: '通知书管理',
// 				icon: 'iconfont el-icon-my-notice',
// 				type: 'item',
// 				path: '/trademark/notice',
// 			}
// 		]
// 	},
// 	{
// 		text: '版权',
// 		path: '/copyright',
// 		icon: 'iconfont	 el-icon-my-copyright',
// 		type: 'submenu',
// 		children: [
// 			{
// 				text: '新建版权',
// 				path: '/copyright/add',
// 				icon: 'iconfont el-icon-my-proposal-add',
// 				type: 'item'
// 			},
// 			{
// 				text: '版权管理',
// 				path: '/copyright/list',
// 				icon: 'iconfont	 el-icon-my-copyright',
// 				type: 'item'
// 			},
// 			{
// 				text: '通知书管理',
// 				path: '/copyright/notice',
// 				icon: 'iconfont el-icon-my-notice',
// 				type: 'item',
// 			},
// 		]
// 	},
	
// 	{
// 		text: '发文',
// 		path: '/dispatch',
// 		icon: 'iconfont el-icon-my-email',
// 		type: 'submenu',
// 		children: [{
// 			text: '发文管理',
// 			path: '/dispatch/administration',
// 			icon: 'iconfont el-icon-my-dispatch',
// 			type: 'item'
// 		}]
// 	},
// 	// {
// 	// 	text: '交互',
// 	// 	path: '/interact',
// 	// 	icon: 'iconfont el-icon-my-interact',
// 	// 	type: 'submenu',
// 	// 	children: [{
// 	// 		text: '邮件交互',
// 	// 		path: '/interact/email',
// 	// 		icon: 'iconfont el-icon-my-email',
// 	// 		type: 'item',
// 	// 	}]
// 	// },
// 	{
// 		text: '设置',
// 		path: '/setting',
// 		icon: 'iconfont el-icon-my-setting',
// 		type: 'submenu',
// 		children: [],
// 	},
// ];