//路径取名规则:
//子路径应包含父路径
const menu = {};
const map = {};
const taskMenu = [
	{ type: 'item', text: '我的待办', path: '/task/pending', icon: 'iconfont el-icon-my-task' },
	// { type: 'item', text: '所有待办', path: '/task/all', icon: 'iconfont el-icon-my-task' },
	{ type: 'item', text: '暂停处理', path: '/task/paused', icon: 'iconfont el-icon-my-task' },
	{ type: 'item', text: '已完成', path: '/task/finished', icon: 'iconfont el-icon-my-task' },
	{ type: 'item', text: '期限管控(新申请)', path: '/task/expiringControlNew', icon: 'iconfont el-icon-my-task' },
	{ type: 'item', text: '期限管控(OA)', path: '/task/expiringControlOA', icon: 'iconfont el-icon-my-task' },
	{ 
		type: 'submenu', 
		text: '按任务期限', 
		path: '/task/duetime', 
		icon: 'iconfont el-icon-my-task',
		children: [
			{ type: 'item', text: '已过期', path: '/task/duetime/expired', icon: '' },
			{ type: 'item', text: '本周过期', path: '/task/duetime/week', icon: '' },
			{ type: 'item', text: '下周过期', path: '/task/duetime/nextWeek', icon: '' },
			{ type: 'item', text: '本月过期', path: '/task/duetime/month', icon: '' },
			{ type: 'item', text: '下月过期', path: '/task/duetime/nextMonth', icon: '' },
			{ type: 'item', text: '更晚', path: '/task/duetime/later', icon: '' },
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
			{ type: 'item', text: '复审', path: '/task/stage/reexam', icon: '' },
			{ type: 'item', text: '授权', path: '/task/stage/grant', icon: '' },
			{ type: 'item', text: '无效', path: '/task/stage/invalid', icon: '' },
			{ type: 'item', text: '年费续展', path: '/task/stage/annualFee', icon: '' },
			{ type: 'item', text: '行政诉讼', path: '/task/stage/litigation', icon: '' },
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
			// { type: 'item', text: '商标', path: '/task/type/trademark', icon: '' },
			{ type: 'item', text: '版权', path: '/task/type/copyright', icon: '' },
		],
	},
	// {
	// 	type: 'submenu',
	// 	text: '我的搜索项',
	// 	path: '/task/custom',
	// 	icon: 'iconfont el-icon-my-task',
	// 	children: [],
	// }
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
			{ type: 'item', text: '有新颖性', path: '/proposal/novelty/yes', icon: '' },
			{ type: 'item', text: '无新颖性结案', path: '/proposal/novelty/no', icon: '' },
		]
	},
	// {
	// 	type: 'submenu',
	// 	text: '我的搜索项',
	// 	path: '/proposal/custom',
	// 	icon: 'iconfont el-icon-my-proposal',
	// 	children: [],
	// }
]

const patentMenu = [
	{ type: 'item', text: '全部专利', path: '/patent/list', icon: 'iconfont el-icon-my-patent' },
	{ type: 'item', text: '获奖专利', path: '/patent/award', icon: 'iconfont el-icon-my-patent' },
	{ 
		type: 'submenu', 
		text: '专利（案件等级）', 
		path: '/patent/level',
		icon: 'iconfont el-icon-my-patent',
		children: [
			{ type: 'item', text: 'A', path: '/patent/level/a', icon: '' },
			{ type: 'item', text: 'B', path: '/patent/level/b', icon: '' },
			{ type: 'item', text: 'C', path: '/patent/level/c', icon: '' },
			{ type: 'item', text: 'D', path: '/patent/level/d', icon: '' },
		],
	},
	{ 
		type: 'submenu', 
		text: '专利（法律状态）', 
		path: '/patent/stage',
		icon: 'iconfont el-icon-my-patent',
		children: [
			{ type: 'item', text: '新申请', path: '/patent/stage/new', icon: '' },
			{ type: 'item', text: '受理', path: '/patent/stage/receipt', icon: '' },
			{ type: 'item', text: '初审合格', path: '/patent/stage/pre_exam_ok', icon: '' },
			{ type: 'item', text: '公布', path: '/patent/stage/public', icon: '' },
			{ type: 'item', text: '实审', path: '/patent/stage/subexam', icon: '' },
			{ type: 'item', text: '补正', path: '/patent/stage/amendment', icon: '' },
			{ type: 'item', text: '审查意见', path: '/patent/stage/oa', icon: '' },
			{ type: 'item', text: '复审', path: '/patent/stage/reexam', icon: '' },
			{ type: 'item', text: '授权办登', path: '/patent/stage/grant', icon: '' },
			{ type: 'item', text: '专利权有效', path: '/patent/stage/valid', icon: '' },
			{ type: 'item', text: '专利权届满', path: '/patent/stage/expired', icon: '' },
			{ type: 'item', text: '驳回', path: '/patent/stage/rejected', icon: '' },
			{ type: 'item', text: '专利权无效', path: '/patent/stage/invalid', icon: '' },
			{ type: 'item', text: '结案', path: '/patent/stage/closed', icon: '' },
			{ type: 'item', text: '国际检索', path: '/patent/stage/pct_search', icon: '' },
			{ type: 'item', text: '进入国家阶段', path: '/patent/stage/pct_national', icon: '' },
			{ type: 'item', text: '国际公布', path: '/patent/stage/pct_public', icon: '' },
			{ type: 'item', text: '其它', path: '/patent/stage/other', icon: '' },
		]
	},
	{ 
		type: 'submenu', 
		text: '专利（国家）', 
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
			{ type: 'item', text: '本月月优先权到期', path: '/patent/duration/priority_this_month', icon: '' },
			{ type: 'item', text: '下月优先权到期', path: '/patent/duration/priority_next_month', icon: '' },
			{ type: 'item', text: '本月主动修改到期', path: '/patent/duration/modification_this_month', icon: '' },
			{ type: 'item', text: '下月主动修改到期', path: '/patent/duration/modification_next_month', icon: '' },
			{ type: 'item', text: '本月PCT进国家到期', path: '/patent/duration/pct_this_month', icon: '' },
			{ type: 'item', text: '下月PCT进国家到期', path: '/patent/duration/pct_next_month', icon: '' },
			{ type: 'item', text: '本月PCT19条修改到期', path: '/patent/duration/pct19_this_month', icon: '' },
			{ type: 'item', text: '下月PCT19条修改到期', path: '/patent/duration/pct19_next_month', icon: '' },
		]
	},
	{ 
		type: 'submenu', 
		text: '通知书', 
		path: '/patent/notice',
		icon: 'iconfont el-icon-my-patent',
		children: [
			{ type: 'item', text: '所有通知书', path: '/patent/notice', icon: '' },
			{ type: 'item', text: '本周上传', path: '/patent/notice/thisweek', icon: '' },
			{ type: 'item', text: '上周上传', path: '/patent/notice/lastweek', icon: '' },
			{ type: 'item', text: '本月上传', path: '/patent/notice/thismonth', icon: '' },
			{ type: 'item', text: '上月上传', path: '/patent/notice/lastmonth', icon: '' },
			{ type: 'item', text: '更早上传', path: '/patent/notice/earlier', icon: '' },
		]
	},
	{ 
		type: 'submenu', 
		text: '专利证书', 
		path: '/patent/certificate',
		icon: 'iconfont el-icon-my-patent',
		children: [
			{ type: 'item', text: '发明专利', path: '/patent/certificate/invention', icon: '' },
			{ type: 'item', text: '实用新型', path: '/patent/certificate/utility', icon: '' },
			{ type: 'item', text: '外观设计', path: '/patent/certificate/design', icon: '' },
			{ type: 'item', text: '台湾', path: '/patent/certificate/taiwan', icon: '' },
			{ type: 'item', text: '国外', path: '/patent/certificate/foreign', icon: '' },
		]
	},

	// {
	// 	type: 'submenu',
	// 	text: '我的搜索项',
	// 	path: '/patent/custom',
	// 	icon: 'iconfont el-icon-my-patent',
	// 	children: [],
	// }
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
	// {
	// 	type: 'submenu',
	// 	text: '我的搜索项',
	// 	path: '/trademark/custom',
	// 	icon: 'iconfont el-icon-my-trademark',
	// 	children: [],
	// }
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
	// {
	// 	type: 'submenu',
	// 	text: '我的搜索项',
	// 	path: '/copyright/custom',
	// 	icon: 'iconfont el-icon-my-copyright',
	// 	children: [],
	// }
];

const feeMenu = [
	// {	
	// 	type: 'submenu',
	// 	text: '应付',
	// 	path: '/fee/fee_pay',
	// 	icon: 'iconfont el-icon-my-receipt',
	// 	children: [
	// 		{ type: 'item', text: '应付明细', path: '/fee/fee_pay/pay', icon: 'iconfont el-icon-my-receipt' },
	// 		{ type: 'item', text: '账单', path: '/fee/fee_pay/payment',icon: 'iconfont el-icon-my-pay' },
	// 	]
	// },
	// {
	// 	type: 'submenu',
	// 	text: '应收',
	// 	path: '/fee/fee_in',
	// 	icon: 'iconfont el-icon-my-deal',
	// 	children: [
	// 		{ type: 'item', text: '政府资助', path: '/fee/fee_in/income', icon: 'iconfont el-icon-my-deal' },
	// 		{ type: 'item', text: '资助申请单', path: '/fee/fee_in/bill', icon: 'iconfont el-icon-my-deal' },
	// 	]
	// },
	// { 
	// 	type: 'submenu',
	// 	text: '年费',
	// 	path: '/fee/renewal',
	// 	icon: 'iconfont el-icon-my-renewal-fee',
	// 	children: [
	// 		{ type: 'item', text: '年费明细', path: '/fee/renewal/fee', icon: 'iconfont el-icon-my-renewal-fee' },
	// 		{ type: 'item', text: '年费评估单', path: '/fee/renewal/estimate', icon: 'iconfont el-icon-my-renewal-estimate' },
	// 	]
	// }
	{	
		type: 'submenu',
		text: '发明人奖金',
		path: '/fee/bonus',
		icon: 'iconfont el-icon-my-receipt',
		children: [
			{ type: 'item', text: '所有', path: '/fee/bonus/all', icon: '' },
			{ type: 'item', text: '申请奖', path: '/fee/bonus/application', icon: '' },
			{ type: 'item', text: '授权奖', path: '/fee/bonus/grant', icon: '' },
			// { type: 'item', text: '专利实施许可奖', path: '/fee/bonus/license', icon: '' },
			// { type: 'item', text: '年度专利奖', path: '/fee/bonus/year', icon: '' },
			// { type: 'item', text: '特别专利奖', path: '/fee/bonus/special', icon: '' },
			// { type: 'item', text: '优秀实用新型', path: '/fee/bonus/utility', icon: '' },
		]
	},
	{
		type: 'submenu',
		text: '付款账单',
		path: '/fee/invoice',
		icon: 'iconfont el-icon-my-receipt',
		children: [
			{ type: 'item', text: '待审核', path: '/fee/invoice/to_be_reviewed', icon: '' },
			{ type: 'item', text: '待上传凭证', path: '/fee/invoice/voucher_upload', icon: '' },
			{ type: 'item', text: '待付款', path: '/fee/invoice/paying', icon: '' },
			{ type: 'item', text: '已付款', path: '/fee/account/paid', icon: '' },
			{ type: 'item', text: '已退回', path: '/fee/invoice/rejected', icon: '' },
		]
	},
	{
		type: 'submenu',
		text: '广州市资助',
		path: '/fee/guangzhou',
		icon: 'iconfont el-icon-my-receipt',
		children: [
			{ type: 'item', text: '专利', path: '/fee/guangzhou/patent', icon: '' },
			// { type: 'item', text: '商标', path: '/fee/guangzhou/trademark', icon: '' },
			// { type: 'item', text: '著作权', path: '/fee/guangzhou/copyright', icon: '' },
		]
	},
	{	
		type: 'submenu',
		text: '黄埔区资助',
		path: '/fee/huangpu',
		icon: 'iconfont el-icon-my-receipt',
		children: [
			{ type: 'item', text: '专利', path: '/fee/huangpu/patent', icon: '' },
			// { type: 'item', text: '商标', path: '/fee/huangpu/trademark', icon: '' },
			// { type: 'item', text: '著作权', path: '/fee/huangpu/copyright', icon: '' },
		]
	},
	{
		type: 'submenu',
		text: '请款单',
		path: '/fee/income',
		icon: 'iconfont el-icon-my-receipt',
		children: [
			{ type: 'item', text: '待提交', path: '/fee/income/submit', icon: '' },
			{ type: 'item', text: '待收款', path: '/fee/income/wating_for_payment', icon: '' },
			{ type: 'item', text: '已收款', path: '/fee/income/confirmed', icon: '' },
			{ type: 'item', text: '已作废', path: '/fee/income/cancelled', icon: '' },
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
			{ type: 'item', text: '评估放弃', path: '/fee/renewal/withdrawn' },
		]
	},	
];

const renewalMenu = [
	
];

const reportMenu = [
	{ type: 'item', text: '任务报表', path: '/report/task', icon: 'el-icon-my-report' },
	{ type: 'item', text: '提案报表', path: '/report/proposal', icon: 'el-icon-my-report' },
	{ type: 'item', text: '专利报表', path: '/report/patent', icon: 'el-icon-my-report' },
	// { type: 'item', text: '商标报表', path: '/report/trademark', icon: 'el-icon-my-report' },
	// { type: 'item', text: '版权报表', path: '/report/copyright', icon: 'el-icon-my-report' },
	{ type: 'item', text: '费用报表', path: '/report/fee', icon: 'el-icon-my-report' },
	{ type: 'item', text: '账单报表', path: '/report/invoice', icon: 'el-icon-my-report' },
]

const newsMenu = [
	{ type: 'item', text: '通知邮件', path: '/news/mailList', icon: 'iconfont el-icon-my-email' },
	// {
	// 	type: 'item',
	// 	text: '专利通知书',
	// 	path: '/news/patent_notice',
	// 	icon: 'iconfont el-icon-my-patent',
	// },
	// {
	// 	text: '版权通知书',
	// 	path: '/news/copyright_notice',
	// 	icon: 'iconfont el-icon-my-copyright',
	// 	type: 'item',
	// },
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
	{ type: 'item', text: '代理人管理', path: '/setting/agent', icon: 'iconfont el-icon-my-proposer'},
	// { type: 'item', text: '报价管理', path: '/setting/offer', icon: 'iconfont el-icon-my-organization' },
	{
		text: '字段权限管理',
		path: '/setting/field',
		icon: 'iconfont el-icon-my-set-copy',
		type: 'item',
	},
	{ type: 'item', text: '系统设置', path: '/setting/system', icon: 'iconfont el-icon-my-system' },
];

const testMenu = [
	{ type: 'item', text: '自定义表单', path: '/test/form', icon: '' },
]

menu.source = [
	// {
	// 	text: '个人中心',
	// 	key: 'statistics',
	// 	path: '/home',
	// },
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
	// {
	// 	text: '版权',
	// 	key: 'copyright',
	// 	path: '/copyright',
	// 	icon: 'iconfont el-icon-my-copyright',
	// 	menu: copyrightMenu,
	// },
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
		text: '邮件',
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
// 		path: '/home',
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
// 				path: '/task/paused',
// 				icon: 'iconfont el-icon-my-pause',
// 				type: 'item',
// 			},
// 			{
// 				text: '已完成',
// 				path: '/task/finished',
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
// 			// 	path: '/patent/home',
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