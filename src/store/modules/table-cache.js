
const state = {
	columns: {
		'proposal': [          
      { id: 'serial',         'name': '案号'},
      { id: 'title',          'name': '标题'},
      { id: 'abstract',       'name': '摘要'},
      { id: 'create_time',    'name': '提案日期', date: true},
      { id: 'ipr',            'name': '负责IPR'},
      { id: 'proposer',       'name': '提案人'},
      { id: 'inventors',      'name': '发明人'},
      { id: 'branch',         'name': '部门'},
      { id: 'classification', 'name': '技术分类'},
      { id: 'products',       'name': '产品'},
      { id: 'tags',           'name': '标签'},
      { id: 'patents',        'name': '相关专利'},
      { id: 'remark',         'name': '备注'},
      { id: 'flow_node',      'name': '当前节点'},
    ],
    'patent': [
    	{ id: 'serial',                        'name': '案号'},
      { id: 'agency_serial',                 'name': '事务所案号'},
      { id: 'applicants',                    'name': '申请人'},
      { id: 'apn',                           'name': '申请号'},
      { id: 'apd',                           'name': '申请日', date: true },
      { id: 'type',                          'name': '专利类型'},
      { id: 'area',                          'name': '申请地区'},
      { id: 'title',                         'name': '标题'},
      { id: 'abstract',                      'name': '摘要'},
      { id: 'public_date',                   'name': '公开日', date: true },
      { id: 'public_number',                 'name': '公开号'},
      { id: 'progress',                      'name': '当前状态'},
      { id: 'inventors',                     'name': '发明人'},
      { id: 'tags',                          'name': '标签'},
      { id: 'branch',                        'name': '部门'},
      { id: 'classification',                'name': '技术分类'},
      { id: 'products',                      'name': '产品'},
      { id: 'ipr',                           'name': '负责IPR'},
      { id: 'proposer',                      'name': '提案人'},
      { id: 'priorities',                    'name': '优先权'},
      { id: 'relative_projects',             'name': '相关专利'},
      { id: 'fees',                          'name': '费用'},//费用
      { id: 'is_support',                    'name': '是否已申请资助'}, //是否已申请资助
      { id: 'agency',                        'name': '代理机构'}, //代理机构
      { id: 'agent',                         'name': '代理人'}, //代理人
      { id: 'pre_exam_ok_date',              'name': '初审合格日', date: true },
      { id: 'sub_exam_start_date',           'name': '进入实审日', date: true },
      { id: 'issue_date',                    'name': '公告日', date: true },
      { id: 'issue_number',                  'name': '公告号'},
      { id: 'main_ipc',                      'name': '主国际分类号'},
      { id: 'pct_apd',                       'name': '国际申请日', date: true },
      { id: 'pct_no',                        'name': '国际申请号'},
      { id: 'pct_priority_date',             'name': '国际优先权日', date: true },
      { id: 'pct_public_date',               'name': '国际公开日', date: true },
      { id: 'pct_public_language',           'name': '国际公开语言'},
      { id: 'pct_public_no',                 'name': '国际公开号'},
      { id: 'board_number',                  'name': '复审委内编号'},
      { id: 'is_biological',                 'name': '是否与生物相关'},
      { id: 'is_division',                   'name': '是否是分案申请'},
      { id: 'is_exam_request',               'name': '是否提出实质审查请求'},
      { id: 'is_genetic',                    'name': '是否依赖于遗传资源'},
      { id: 'is_leakage',                    'name': '是否不丧失新颖性公开'},
      { id: 'is_pre_public',                 'name': '是否提前公开'},
      { id: 'is_priority',                   'name': '是否要求优先权'},
      { id: 'is_secure_check',               'name': '是否保密审查'},
      { id: 'is_sequence',                   'name': '是否有序列表'},
      { id: 'is_utility',                    'name': '是否同日申请了同样的实用新型/发明'},
      { id: 'words',                         'name': '说明书字数'},
      { id: 'first_edition_to_inventstring', 'name': '返发明人初稿时间', date: true }, //返发明人初稿时间
      { id: 'inventor_review_time',          'name': '发明人完成技术审核时间', date: true },//发明人完成技术审核时间
      { id: 'inventor_review_times',         'name': '发明人审核次数'},//发明人审核次数
      { id: 'inventor_rank',                 'name': '发明人技术评分'},//发明人技术评分
      { id: 'first_edition_to_ipr_tig',      'name': '返IPR初稿时间', date: true },//返IPR初稿时间
      { id: 'ipr_final_edition_time',        'name': 'IPR定稿时间', date: true }, //IPR定稿时间
      { id: 'ipr_review_times',              'name': 'IPR审核次数'}, //IPR审核次数
      { id: 'first_ipr_rank',                'name': 'IPR初稿评分'},//IPR初稿评分
      { id: 'final_ipr_rank',                'name': 'IPR定稿评分'},//IPR定稿评分
      { id: 'agent_drafting_period',         'name': '代理撰稿时间', date: true },//代理撰稿时间
      { id: 'inventor_review_period',        'name': '发明人审核时间', date: true },//发明人审核时间
      { id: 'ipr_review_period',             'name': 'IPR审核时间', date: true },//IPR审核时间
      { id: 'agent_amending_period',         'name': '代理人修改时间', date: true },//代理人修改时间
      { id: 'group_number',                  'name': '群组号码'},//群组号码
      { id: 'family_number',                 'name': '专利族号码'},//专利族号码
      { id: 'extends1',                      'name': '自定义字段1'},//自定义字段1
      { id: 'extends2',                      'name': '自定义字段2'},//自定义字段2
      { id: 'extends3',                      'name': '自定义字段3'},//自定义字段3
      { id: 'application_strategy',          'name': '申请类型'},//申请类型
      { id: 'subexam_timing',                'name': '实审时间', date: true },//实审时间
      { id: 'core_concepts',                 'name': '新申请申请策略'},//新申请申请策略
      { id: 'decision_reason',               'name': '决定原因'},//决定原因
      { id: 'innovation_introduction',       'name': '创新点简述'},//创新点简述
      { id: 'importance',                    'name': '重要性'},//重要性
      { id: 'avoidability',                  'name': '可回避性'},//可回避性
      { id: 'evidence_discovery',            'name': '举证难易度'},//举证难易度
      { id: 'profitability',                 'name': '利润贡献度'},//利润贡献度
      { id: 'marketing_value',               'name': '推广价值'},//推广价值
      { id: 'selling_point',                 'name': '卖点相关性'},//卖点相关性
      { id: 'selling_point_technique',       'name': '卖点相关技术'},//卖点相关技术
      { id: 'competitor_usage',              'name': '竞争对手使用'},//竞争对手使用
      { id: 'project_name',                  'name': '研发项目名称'},//研发项目名称
      { id: 'project_serial',                'name': '研发项目编号'},//研发项目编号
      { id: 'remark',                        'name': '备注'},
    ]
	},
	//报表模块相关配置
	configs: {
		'proposal': {
			url: '/api/proposals',
			list_url: '/proposal/report',
			add_url: '/proposal/report/add',
			data_key: 'proposals',
			text: '提案数量统计',
		},
		'patent': {
			url: '/api/patents',
			list_url: '/patent/report',
			add_url: '/patent/report/add',
			data_key: 'patents',
			text: '专利数量统计',
		}
	},
	pagesize: 20,
}

const getters = {
	tableColumnsCache: state=>state.columns,
	tableConfigsCache: state=>state.configs,
	pagesize: state=>state.pagesize,
}

const mutations = {
	setTableColumns (state, {type, value}) {
		state.columns = { ...state.columns, [type]: value };
	},
	setPageSize (state, num){ 
		state.pagesize = num;
	},
}

const actions = {

}

export default {
	state,
	getters,
	mutations,
	actions,
}