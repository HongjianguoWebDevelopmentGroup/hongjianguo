const taskOptions = [
  { id: 'serial',                name: '案号' },
  { id: 'agency_serial',         name: '事务所案号' },
  { id: 'category',              name: '案件类型' },
  { id: 'type_name',             name: '专利/商标类型' },
  { id: 'title',                 name: '标题' },
  { id: 'name',                  name: '管制事项' },
  { id: 'node_name',             name: '流程节点' },
  { id: 'source',                name: '任务来源' },
  { id: 'ipr',                   name: 'IPR' },
  { id: 'branch',                name: '部门' },
  { id: 'proposer',              name: '部门' },
  { id: 'person_in_charge_name', name: '承办人' },
  { id: 'agency',                name: '代理机构' },
  { id: 'agent',                 name: '代理人' },
  { id: 'apn',                   name: '申请号' },
  { id: 'apd',                   name: '申请日',   date: true },
  { id: 'start_time',            name: '开始时间', date: true },
  { id: 'end_time',              name: '完成时间', date: true },
  { id: 'due_time',              name: '指定期限', date: true },
  { id: 'review_deadline',       name: '定稿期限', date: true },
  { id: 'deadline',              name: '法定期限', date: true },
  { id: 'remark',                name: '备注' },
];

const feeOptions = [
  { id: 'serial',                name: '案号' },
  { id: 'category',              name: '案件类型' },
  { id: 'patent_type',           name: '专利类型' },
  { id: 'area',                  name: '申请地区' },
  { id: 'title',                 name: '标题' },
  { id: 'apd',                   name: '申请日', date: true },
  { id: 'apn',                   name: '申请号' },
  { id: 'mail_date',             name: '发文日', date: true },
  { id: 'create_time',           name: '创建日期', date: true },
  { id: 'due_time',              name: '费用期限', date: true },
  { id: 'deadline',              name: '官方绝限', date: true },
  { id: 'pay_time',              name: '付款时间', date: true },
  { id: 'target',                name: '费用对象' },
  { id: 'code',                  name: '费用名称' },
  { id: 'amount',                name: '金额' },
  { id: 'roe',                   name: '汇率' },
  { id: 'currency',              name: '货币' },
  { id: 'rmb',                   name: '人民币' },
  { id: 'status',                name: '状态' },
  { id: 'remark',                name: '费用备注' }, 
];

const invoiceOptions = [
  { id: 'target',                name: '账单对象' },
  { id: 'create_time',           name: '创建日期', date: true },
  { id: 'amount',                name: '金额' },
  { id: 'currency',              name: '货币' },
  { id: 'roe',                   name: '汇率' },
  { id: 'rmb',                   name: '人民币' },
  { id: 'due_time',              name: '费用期限', date: true },
  { id: 'pay_time',              name: '付款时间', date: true },       
  { id: 'status',                name: '状态' },
  { id: 'remark',                name: '费用备注' },
  { id: 'flownode',              name: '当前节点' },
];

const columns = {
	'proposal': [          
    { id: 'serial',         name: '案号'},
    { id: 'title',          name: '标题'},
    { id: 'abstract',       name: '摘要'},
    { id: 'create_time',    name: '提案日期', date: true},
    { id: 'ipr',            name: '负责IPR'},
    { id: 'proposer',       name: '提案人'},
    { id: 'inventors',      name: '发明人'},
    { id: 'branch',         name: '部门'},
    { id: 'classification', name: '技术分类'},
    { id: 'products',       name: '产品'},
    { id: 'tags',           name: '标签'},
    { id: 'patents',        name: '相关专利'},
    { id: 'remark',         name: '备注'},
    { id: 'flow_node',      name: '当前节点'},
  ],
  'patent': [
  	{ id: 'serial',                        name: '案号'},
    { id: 'agency_serial',                 name: '事务所案号'},
    { id: 'applicants',                    name: '申请人'},
    { id: 'apn',                           name: '申请号'},
    { id: 'apd',                           name: '申请日', date: true },
    { id: 'type',                          name: '专利类型'},
    { id: 'area',                          name: '申请地区'},
    { id: 'title',                         name: '标题'},
    { id: 'create_time',                   name: '创建时间', date: true },
    { id: 'abstract',                      name: '摘要'},
    { id: 'public_date',                   name: '公开日', date: true },
    { id: 'public_number',                 name: '公开号'},
    { id: 'progress',                      name: '当前状态'},
    { id: 'inventors',                     name: '发明人'},
    { id: 'tags',                          name: '标签'},
    { id: 'branch',                        name: '部门'},
    { id: 'classification',                name: '技术分类'},
    { id: 'products',                      name: '产品'},
    { id: 'ipr',                           name: '负责IPR'},
    { id: 'proposer',                      name: '提案人'},
    { id: 'priorities',                    name: '优先权'},
    { id: 'relative_projects',             name: '相关专利'},
    { id: 'fees',                          name: '费用'},//费用
    { id: 'is_support',                    name: '是否已申请资助'}, //是否已申请资助
    { id: 'agency',                        name: '代理机构'}, //代理机构
    { id: 'agent',                         name: '代理人'}, //代理人
    { id: 'pre_exam_ok_date',              name: '初审合格日', date: true },
    { id: 'sub_exam_start_date',           name: '进入实审日', date: true },
    { id: 'issue_date',                    name: '公告日', date: true },
    { id: 'issue_number',                  name: '公告号'},
    { id: 'main_ipc',                      name: '主国际分类号'},
    { id: 'pct_apd',                       name: '国际申请日', date: true },
    { id: 'pct_no',                        name: '国际申请号'},
    { id: 'pct_priority_date',             name: '国际优先权日', date: true },
    { id: 'pct_public_date',               name: '国际公开日', date: true },
    { id: 'pct_public_language',           name: '国际公开语言'},
    { id: 'pct_public_no',                 name: '国际公开号'},
    { id: 'board_number',                  name: '复审委内编号'},
    { id: 'is_biological',                 name: '是否与生物相关'},
    { id: 'is_division',                   name: '是否是分案申请'},
    { id: 'is_exam_request',               name: '是否提出实质审查请求'},
    { id: 'is_genetic',                    name: '是否依赖于遗传资源'},
    { id: 'is_leakage',                    name: '是否不丧失新颖性公开'},
    { id: 'is_pre_public',                 name: '是否提前公开'},
    { id: 'is_priority',                   name: '是否要求优先权'},
    { id: 'is_secure_check',               name: '是否保密审查'},
    { id: 'is_sequence',                   name: '是否有序列表'},
    { id: 'is_utility',                    name: '是否同日申请了同样的实用新型/发明'},
    { id: 'words',                         name: '说明书字数'},
    // { id: 'first_edition_to_inventstring', name: '返发明人初稿时间', date: true }, //返发明人初稿时间
    // { id: 'inventor_review_time',          name: '发明人完成技术审核时间', date: true },//发明人完成技术审核时间
    // { id: 'inventor_review_times',         name: '发明人审核次数'},//发明人审核次数
    // { id: 'inventor_rank',                 name: '发明人技术评分'},//发明人技术评分
    // { id: 'first_edition_to_ipr_tig',      name: '返IPR初稿时间', date: true },//返IPR初稿时间
    { id: 'ipr_final_edition_time',        name: 'IPR定稿时间', date: true }, //IPR定稿时间
    // { id: 'ipr_review_times',              name: 'IPR审核次数'}, //IPR审核次数
    // { id: 'first_ipr_rank',                name: 'IPR初稿评分'},//IPR初稿评分
    { id: 'final_ipr_rank',                name: 'IPR定稿评分'},//IPR定稿评分
    // { id: 'agent_drafting_period',         name: '代理撰稿时间', date: true },//代理撰稿时间
    // { id: 'inventor_review_period',        name: '发明人审核时间', date: true },//发明人审核时间
    // { id: 'ipr_review_period',             name: 'IPR审核时间', date: true },//IPR审核时间
    // { id: 'agent_amending_period',         name: '代理人修改时间', date: true },//代理人修改时间
    { id: 'group_number',                  name: '群组号码'},//群组号码
    { id: 'family_number',                 name: '专利族号码'},//专利族号码
    { id: 'extends1',                      name: '自定义字段1'},//自定义字段1
    { id: 'extends2',                      name: '自定义字段2'},//自定义字段2
    { id: 'extends3',                      name: '自定义字段3'},//自定义字段3
    { id: 'manner',                        name: '申请方式' },
    { id: 'application_strategy',          name: '申请策略'},//申请类型
    { id: 'subexam_timing',                name: '实审时机', date: true },//实审时间
    { id: 'core_concepts',                 name: '关键保护点'},//新申请申请策略
    { id: 'decision_reason',               name: '决定原因'},//决定原因
    { id: 'innovation_introduction',       name: '创新点简述'},//创新点简述
    { id: 'importance',                    name: '重要性'},//重要性
    { id: 'avoidability',                  name: '可回避性'},//可回避性
    { id: 'evidence_discovery',            name: '举证难易度'},//举证难易度
    { id: 'profitability',                 name: '利润贡献度'},//利润贡献度
    { id: 'marketing_value',               name: '推广价值'},//推广价值
    { id: 'selling_point',                 name: '卖点相关性'},//卖点相关性
    { id: 'selling_point_technique',       name: '卖点相关技术'},//卖点相关技术
    { id: 'competitor_usage',              name: '竞争对手使用'},//竞争对手使用
    { id: 'project_name',                  name: '研发项目名称'},//研发项目名称
    { id: 'project_serial',                name: '研发项目编号'},//研发项目编号
    { id: 'remark',                        name: '备注'},
  ],
  'trademark': [
    { id: 'serial',        name: '案号' },
    { id: 'type',          name: '商标类型' },
    { id: 'area',          name: '地区' },
    { id: 'title',         name: '标题' },
    { id: 'apd',           name: '申请日', date: true },
    { id: 'apn',           name: '申请号' },
    { id: 'issue_date',    name: '公告日', date: true },
    { id: 'issue_number',  name: '公告号' },
    { id: 'public_date',   name: '初审公告日', date: true },
    { id: 'public_number', name: '初审公告期数' },
    { id: 'progress',      name: '当前状态' },
    { id: 'create_time',   name: '创建时间', date: true },
    { id: 'applicants',    name: '申请人' },
    { id: 'remark',        name: '备注' },
  ],
  'copyright': [
    { id: 'serial',         name: '案号' },
    { id: 'type',           name: '版权类型' },
    { id: 'title',          name: '标题' },
    { id: 'abstract',       name: '摘要' },
    { id: 'apd',            name: '申请日', date: true },
    { id: 'apn',            name: '申请号' },
    { id: 'issue_date',     name: '公告日', date: true },
    { id: 'issue_number',   name: '公告号' },
    { id: 'ipr',            name: '负责IPR' },
    { id: 'agency',         name: '代理机构' },
    { id: 'agency_serial',  name: '代理机构案号' },
    { id: 'progress',       name: '当前状态' },
    { id: 'create_time',    name: '创建时间', date: true },
    { id: 'applicants',     name: '申请人' },
    { id: 'tags',           name: '标签' },
    { id: 'branch',         name: '部门' },
    { id: 'classification', name: '技术分类' },
    { id: 'products',       name: '产品' },
    { id: 'remark',         name: '备注' },
  ],
  'task': taskOptions,
  'income': feeOptions,
  'pay': feeOptions,
  'invoice': invoiceOptions,
  'task_pending': taskOptions,
  'task_pause': taskOptions,
  'task_finish': taskOptions,
  'fee_income': feeOptions,
  'fee_pay': feeOptions,
  'fee_bill': invoiceOptions,
  'fee_payment': invoiceOptions,
};

const configs = {
	'proposal': {
		url: '/proposals',
		list_url: '/report/proposal',
		add_url: '/report/proposal/add',
		data_key: 'proposals',
		text: '提案数量统计',
	},
	'patent': {
		url: '/patents',
		list_url: '/report/patent',
		add_url: '/report/patent/add',
		data_key: 'patents',
		text: '专利数量统计',
	},
  'trademark': {
    url: '/trademarks',
    list_url: '/report/trademark',
    add_url: '/report/trademark/add',
    data_key: 'trademarks',
    text: '商标数量统计',
  },
  'copyright': {
    url: '/copyrights',
    list_url: '/report/copyright',
    add_url: '/report/copyright/add',
    data_key: 'copyrights',
    text: '版权数量统计',
  },
  'task': {
    url: '/tasks',
    list_url: '/report/task',
    add_url: '/report/task/add',
    data_key: 'tasks',
    text: '任务统计',
  },
  'income': {
    url: '/fees?debit=1',
    list_url: '/report/income',
    add_url: '/report/income/add',
    data_key: 'fees',
    text: '资助统计',
  },
  'pay': {
  	url: '/fees?debit=0',
  	list_url: '/report/pay',
  	add_url: '/report/pay/add',
  	data_key: 'fees',
  	text: '支出统计',
  },
  'invoice': {
    url: '/invoices',
    list_url: '/report/invoice',
    add_url: '/report/invoice/add',
    data_key: 'invoices',
    text: '账单统计',
  },
};

const taskMap = {
	date: ['apd', 'end_time', 'due_time', 'inner_deadline', 'deadline'],
	remote: ['agency', 'agent', 'person_in_charge'],
};

const feeMap = {
	date: ['mail_date', 'pay_time', 'create_time', 'due_time', 'deadline', 'apd'],
	remote: ['target'],
};

const invoiceMap = {
	date: ['pay_time', 'create_time', 'due_time'],
	remote: ['target'],
};

const strainers = {
	'proposal': {
		date: ['create_time'],
		remote: ['inventors', 'proposer'],
	},
	'patent': {
		date: ['apd', 'create_time', 'public_date', 'issue_date'],
		remote: ['agency', 'agent', 'proposer', 'applicants', 'inventors'],
	},
	'trademark': {
		date: ['apd', 'public_date', 'issue_date', 'expiring_date'],
		remote: ['applicants'],
	},
	'copyright': {
		date: ['apd', 'issue_date'],
		remote: ['proposer', 'applicant', 'agent', 'agency'],
	},
	'task': taskMap,
	'income': feeMap,
	'pay': feeMap,
	'invoice': invoiceMap,
	'task_pending': taskMap,
	'task_finish':  taskMap,
	'task_pause':   taskMap,
	'fee_income':   feeMap,
	'fee_pay':      feeMap,
	'fee_bill':     invoiceMap,
	'fee_payment':  invoiceMap,
}

export {columns, configs, strainers};
