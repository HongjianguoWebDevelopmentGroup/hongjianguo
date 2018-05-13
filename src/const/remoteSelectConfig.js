const config = [
  ['family_number', {
    URL: '/patents/groupfamily',
    DATA_KEY: 'data',
    PLACEHOLDER: '请输入群组号',
    PARAMS: { type: 'family' },
    handleData: data => {
      return data.map(v => ({ id: v, name: v }));
    }
  }],
  ['group_number', {
    URL: '/patents/groupfamily',
    DATA_KEY: 'data',
    PLACEHOLDER: '请输入专利族号',
    PARAMS: { type: 'group' },
    handleData: data => {
      return data.map(v => ({ id: v, name: v }));
    }
  }],
	['member', {
		URL: '/members',
		DATA_KEY: 'members',
		PLACEHOLDER: '请输入用户关键词',
	}],
	['applicant', {
		URL: '/applicants',
		DATA_KEY: 'applicants',
		PLACEHOLDER: '请输入申请人关键词',
	}],
	['inventor', {
		URL: '/inventors',
		DATA_KEY: 'data',
		PLACEHOLDER: '请输入发明人关键词',
	}],
	['agent', {
		URL: '/agents',
		DATA_KEY: 'members',
		PLACEHOLDER: '请输入代理人关键词',
	}],
	['agency', {
		URL: '/agencies',
		DATA_KEY: 'agencies',
		PLACEHOLDER: '请输入代理机构关键词',
	}],
	['project', {
		URL: '/projects',
		DATA_KEY: 'projects',
		PLACEHOLDER: '请输入案件关键词',
	}],
	['proposal', {
		URL: '/proposals',
		DATA_KEY: 'proposals',
		PLACEHOLDER: '请输入提案关键词',
	}],
	['patent', {
		URL: '/projects',
		DATA_KEY: 'projects',
		PLACEHOLDER: '请输入专利关键词',
		PARAMS: { category: 1 },
	}],
  ['trademark', {
    URL: '/projects',
    DATA_KEY: 'projects',
    PLACEHOLDER: '请输入商标关键词',
    PARAMS: { category: 2 },
  }],
	['copyright', {
		URL: '/projects',
		DATA_KEY: 'projects',
		PLACEHOLDER: '请输入版权关键词',
		PARAMS: { category: 3 },
	}],
  ['bill', {
    URL: '/invoices',
    DATA_KEY: 'invoices',
    PLACEHOLDER: '请输入请款单关键词',
    PARAMS: { debit: 1 },
  }],
  ['pay', {
    URL: '/invoices',
    DATA_KEY: 'invoices',
    PLACEHOLDER: '请输入付款单关键词',
    PARAMS: { debit: 0 },
  }],
  ['mail', {
    URL: '/mailAddress',
    DATA_KEY: 'list',
    PLACEHOLDER: '请输入邮箱',
    dynamicCreate: true,
    defaultFirstOption: true,
  }],
  ['estimate', {
    URL: '/renewalestimate',
    DATA_KEY: 'data.data',
    PLACEHOLDER: '请选择年费评估单',
    handleData: _=>{
      return _.map(_=>({ id: _.id, name: _.number }));
    }
  }]
]

export default config;