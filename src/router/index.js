import Vue from 'vue'
import Router from 'vue-router'
const Home                     = () => import('@/components/page/Home')
const Proposal                 = () => import('@/components/page/Proposal')
const InventorList             = () => import('@/components/page/InventorList')
const ApplicantList            = () => import('@/components/page/ApplicantList')
const ProposalCommon           = () => import('@/components/page/ProposalCommon')
const CheckProposal            = () => import('@/components/page/CheckProposal')
const TaskCommon               = () => import('@/components/page/TaskCommon')
const TaskExpiring             = () => import('@/components/page/TaskExpiring')
const TaskExpiringControl      = () => import('@/components/page/TaskExpiringControl')
const PatentList               = () => import('@/components/page/PatentList')
const PatentAward              = () => import('@/components/page/PatentAward')
const ApplyingPatent           = () => import('@/components/page/ApplyingPatent')
const PatentAdd                = () => import('@/components/page/PatentAdd')
const NoticeCommon             = () => import('@/components/page/NoticeCommon')

// const TrademarkNotice          = () => import('@/components/page/NoticeCommon')
const TrademarkStatistics      = () => import('@/components/page/TrademarkStatistics')
const CopyrightList            = () => import('@/components/page/CopyrightList')
const CopyrightAdd             = () => import('@/components/page/CopyrightAdd')
const UserList                 = () => import('@/components/page/UserList')
const Technology               = () => import('@/components/page/Technology')
const Branch                   = () => import('@/components/page/Branch')
const FeeCommon                = () => import('@/components/page/FeeCommon')
const DispatchAdministration   = () => import('@/components/page/DispatchAdministration')
const InvoiceCommon            = () => import('@/components/page/InvoiceCommon')
const ClassificationCommon     = () => import('@/components/page/ClassificationCommon')
const MailList                 = () => import('@/components/page/MailList')
const SystemMessage            = () => import('@/components/page/SystemMessage')
const SystemMessageDetail      = () => import('@/components/page/SystemMessageDetail')
const MailAdd                  = () => import('@/components/page/MailAdd')
const RenewalFee               = () => import('@/components/page/RenewalFee')
const RenewalEstimate          = () => import('@/components/page/RenewalEstimate')
const Report                   = () => import('@/components/page/Report')
const ReportAdd                = () => import('@/components/page/ReportAdd')
//###################
const CommonDetail             = () => import('@/components/page/CommonDetail')
const Babel                    = () => import('@/components/page_extension/CommonDetail_base')
const Control                  = () => import('@/components/page_extension/CommonDetail_control')
const Notice                   = () => import('@/components/page_extension/CommonDetail_notice')
const Fee                      = () => import('@/components/page_extension/CommonDetail_fee')
const Email                    = () => import('@/components/page_extension/CommonDetail_email')
const Documents                = () => import('@/components/page_extension/CommonDetail_documents')
//#################

//-------------------设置 begin-----------------
const SettingAgent            = () => import('@/components/page/SettingAgent')
const SettingAgentDetail      = () => import('@/components/page/SettingAgentDetail')           
const SettingAgency            = () => import('@/components/page/SettingAgency')
const SettingAgencyDetail      = () => import('@/components/page/SettingAgencyDetail')
const SettingCase              = () => import('@/components/page/SettingCase')
const SettingJurisdiction      = () => import('@/components/page/SettingJurisdiction')
const SettingRule              = () => import('@/components/page/SettingRule')
const SettingTemplate          = () => import('@/components/page/SettingTemplate')
const SettingTemplateEdit      = () => import('@/components/page/SettingTemplateEdit')
const OfferList                = () => import('@/components/page/OfferList')
const SettingUser              = () => import('@/components/page/SettingUser')

//#################
const SettingIndividual        = () => import('@/components/page/SettingIndividual')
const SI_Base                  = () => import('@/components/page_extension/SettingIndividual_base')
const SI_Notice                = () => import('@/components/page_extension/SettingIndividual_notice')
const SI_Email                 = () => import('@/components/page_extension/SettingIndividual_email')
//#################
const SettingSystem            = () => import('@/components/page/SettingSystem')
const SS_Base                  = () => import('@/components/page_extension/SettingSystem_base')
const SS_Email                 = () => import('@/components/page_extension/SettingSystem_email')
const SS_Number                = () => import('@/components/page_extension/SettingSystem_number')
const SS_Case                  = () => import('@/components/page_extension/SettingSystem_case')
const SS_Fee                   = () => import('@/components/page_extension/SettingSystem_fee')
//-------------------设置 end---------------------

Vue.use(Router);
const router = new Router({
  // mode: 'history',
  routes: [
    //###重定向###
    { path: '/', redirect: '/statistics' },
    { path: '/proposal', redirect: '/proposal/list' },
    { path: '/task', redirect: '/task/pending' },
    { path: '/patent', redirect: '/patent/list' },
    { path: '/trademark', redirect: '/trademark/list' },
    { path: '/copyright', redirect: '/copyright/list' },
    { path: '/news', redirect: '/news/mailList' },
    { path: '/dispatch', redirect: '/dispatch/administration' },
    { path: '/fee_menu', redirect: '/fee_menu/fee_pay/pay' },
    { path: '/setting', redirect: '/setting/individual' },
    { path: '/renewal', redirect: '/renewal/fee' },
    { path: '/report', redirect: '/report/task' },
    { path: '/test', redirect: '/test/form' },
    //###重定向###
    {
      path: '/statistics',
      name: 'Home',
      component: Home
    },
    {
      path: '/setting/inventorList',
      name: 'InventorList',
      component: InventorList
    },
    {
      path: '/setting/applicantList',
      name: 'ApplicantList',
      component: ApplicantList
    },
    {
      path: '/task/pending/check',
      name: 'CheckProposal',
      component: CheckProposal
    },

//################### 任务路由 begin ###################
    {
      path: '/task/pending',
      name: 'TaskPending',
      component: TaskCommon,
      meta: { 
        status: 0,
        params: { scope: 'personal'  }, 
      },
    },
    {
      path: '/task/regardful',
      name: 'TaskRegardful',
      component: TaskCommon,
      meta: { 
        status: 0,
        params: { scope: 'all'  }, 
      },
    },
    {
      path: '/task/pause',
      name: 'TaskPause',
      component: TaskCommon,
      meta: { status: -1 },
    },
    {
      path: '/task/finish',
      name: 'TaskFinish',
      component: TaskCommon,
      meta: { status: 1 },
    },
    {
      path: '/task/duration/expired',
      name: 'TaskDurationExpired',
      component: TaskCommon,
      meta: { 
        status: 0,
        params: { due_time: 'expired' },
      },
    },
    {
      path: '/task/duration/week',
      name: 'TaskDurationWeek',
      component: TaskCommon,
      meta: { 
        status: 0,
        params: { due_time: 'thisweek' },
      },
    },
    {
      path: '/task/duration/nextWeek',
      name: 'TaskDurationNextWeek',
      component: TaskCommon,
      meta: { 
        status: 0,
        params: { due_time: 'nextweek' },
      },
    },
    {
      path: '/task/duration/month',
      name: 'TaskDurationMonth',
      component: TaskCommon,
      meta: { 
        status: 0,
        params: { due_time: 'thismonth' },
      },
    },
    {
      path: '/task/duration/nextMonth',
      name: 'TaskDurationNextMonth',
      component: TaskCommon,
      meta: { 
        status: 0,
        params: { due_time: 'nextmonth' },
      },
    },
    {
      path: '/task/duration/later',
      name: 'TaskDurationLater',
      component: TaskCommon,
      meta: { 
        status: 0,
        params: { due_time: 'later' },
      },
    },
    { 
      path: '/task/stage/application',
      name: 'TaskStageApplication',
      component: TaskCommon,
      meta: {
        status: 0,
        params: { stage: 1 },
      }
    },
    { 
      path: '/task/stage/oa',
      name: 'TaskStageOa',
      component: TaskCommon,
      meta: {
        status: 0,
        params: { stage: 2 },
      }
    },
    { 
      path: '/task/stage/review',
      name: 'TaskStageReview',
      component: TaskCommon,
      meta: {
        status: 0,
        params: { stage: 3 },
      }
    },
    { 
      path: '/task/stage/authorization',
      name: 'TaskStageAuthorization',
      component: TaskCommon,
      meta: {
        status: 0,
        params: { stage: 4 },
      }
    },
    { 
      path: '/task/stage/invalid',
      name: 'TaskStageInvalidn',
      component: TaskCommon,
      meta: {
        status: 0,
        params: { stage: 5 },
      }
    },
    { 
      path: '/task/stage/annualFee',
      name: 'TaskStageAnnualFee',
      component: TaskCommon,
      meta: {
        status: 0,
        params: { stage: 6 },
      }
    },
    { 
      path: '/task/stage/procedure',
      name: 'TaskStageProcedure',
      component: TaskCommon,
      meta: {
        status: 0,
        params: { stage: 7 },
      }
    },
    { 
      path: '/task/type/proposal',
      name: 'TaskTypeProposal',
      component: TaskCommon,
      meta: {
        status: 0,
        params: { category: 0 },
      }
    },
    { 
      path: '/task/type/patent',
      name: 'TaskTypePatent',
      component: TaskCommon,
      meta: {
        status: 0,
        params: { category: 1 },
      }
    },
    { 
      path: '/task/type/copyright',
      name: 'TaskTypeCopyright',
      component: TaskCommon,
      meta: {
        status: 0,
        params: { category: 3 },
      }
    },
    {
      path: '/task/expiring',
      name: 'TaskExpiring',
      component: TaskExpiring,
    },
    {
      path: '/task/expiringControl',
      name: 'TaskExpiringControl',
      component: TaskExpiringControl,
    },
    {
      path: '/task/custom/:id',
      name: 'TaskCustom',
      component: TaskCommon,
      meta: {
        status: 0,
        custom: true,
      },
    },
//################### 任务路由 end #####################

//################### 提案路由 begin ###################
    {
      path: '/proposal/list',
      name: 'Proposal',
      component: Proposal,
    },
    {
      path: '/proposal/creatTime/month',
      name: 'ProposalMonth',
      component: Proposal,
      meta: {
        params: { create_time: 'thismonth' },
      }
    },
    {
      path: '/proposal/creatTime/quarter',
      name: 'ProposalQuarter',
      component: Proposal,
      meta: {
        params: { create_time: 'thisseason' },
      }
    },
    {
      path: '/proposal/creatTime/year',
      name: 'ProposalYear',
      component: Proposal,
      meta: {
        params: { create_time: 'thisyear' },
      },
    },
    {
      path: '/proposal/novelty/existent',
      name: 'ProopsalExistent',
      component: Proposal,
      meta: {
        params: { novelty: 1 },
      },
    },
    {
      path: '/proposal/novelty/non-existent',
      name: 'ProopsalNonExistent',
      component: Proposal,
      meta: {
        params: { novelty: 0 },
      },
    },
    {
      path: '/proposal/add',
      name: 'ProposalCommon',
      component: ProposalCommon,
      alias: ['/proposal/detail', '/task/pending/proposal_check', '/proposal/edit'],
    },
    {
      path: '/proposal/custom/:id',
      name: 'ProposalCustom',
      component: Proposal,
      meta: {
        custom: true,
      },
    },
//################### 提案路由 end #####################

//################### 专利路由 start #####################
    {
      path: '/patent/list',
      name: 'PattentList',
      component: PatentList
    },
    {
      path: '/patent/award',
      name: 'PattentAward',
      component: PatentAward
    },
    { 
      path: '/patent/stage/application',
      name: 'PatentStageApplication',
      component: PatentList,
      meta: {
        params: { stage: 1 },
      }
    },
    { 
      path: '/patent/stage/oa',
      name: 'PatentStageOa',
      component: PatentList,
      meta: {
        params: { stage: 2 },
      }
    },
    { 
      path: '/patent/stage/review',
      name: 'PatentStageReview',
      component: PatentList,
      meta: {
        params: { stage: 3 },
      }
    },
    { 
      path: '/patent/stage/authorization',
      name: 'PatentStageAuthorization',
      component: PatentList,
      meta: {
        params: { stage: 4 },
      }
    },
    { 
      path: '/patent/stage/invalid',
      name: 'PatentStageInvalidn',
      component: PatentList,
      meta: {
        params: { stage: 5 },
      }
    },
    { 
      path: '/patent/stage/annualFee',
      name: 'PatentStageAnnualFee',
      component: PatentList,
      meta: {
        params: { stage: 6 },
      }
    },
    { 
      path: '/patent/stage/procedure',
      name: 'PatentStageProcedure',
      component: PatentList,
      meta: {
        params: { stage: 7 },
      }
    },
    { 
      path: '/patent/stage/failure',
      name: 'PatentStageFailure',
      component: PatentList,
      meta: {
        params: { stage: 8 },
      }
    },
    {
      path: '/patent/level/a',
      name: 'PatentLvelA',
      component: PatentList,
      meta: {
        params: { level: 'A' },
      }
    },
    {
      path: '/patent/level/b',
      name: 'PatentLvelB',
      component: PatentList,
      meta: {
        params: { level: 'B' },
      }
    },
    {
      path: '/patent/level/c',
      name: 'PatentLvelC',
      component: PatentList,
      meta: {
        params: { level: 'C' },
      }
    },
    {
      path: '/patent/level/d',
      name: 'PatentLvelD',
      component: PatentList,
      meta: {
        params: { level: 'd' },
      }
    },
    {
      path: '/patent/area/cn',
      name: 'PatentAreaCn',
      component: PatentList,
      meta: {
        params: { area: 'CN' },
      }
    },
    {
      path: '/patent/area/pct',
      name: 'PatentAreaPct',
      component: PatentList,
      meta: {
        params: { area: 'PCT' },
      }
    },
    {
      path: '/patent/area/other',
      name: 'PatentAreaOther',
      component: PatentList,
      meta: {
        params: { area: 'Other' },
      }
    },
    {
      path: '/patent/duration/priority',
      name: 'PatentDurationProprity',
      component: PatentList,
      meta: {
        params: { reminder: 'priority_expire_date' },
      }
    },
    {
      path: '/patent/duration/modification',
      name: 'PatentDurationModification',
      component: PatentList,
      meta: {
        params: { reminder: 'active_supplement_expire_date' },
      }
    },
    {
      path: '/patent/duration/pct',
      name: 'PatentDurationPct',
      component: PatentList,
      meta: {
        params: { reminder: 'pct_national_stage_expire_date' },
      }
    },
    {
      path: '/patent/duration/pct19',
      name: 'PatentDurationPct19',
      component: PatentList,
      meta: {
        params: { reminder: 'pct_19_expire_date' },
      }
    },
    {
      path: '/patent/applying',
      name: 'ApplyingPatent',
      component: ApplyingPatent
    },
    {
      path: '/patent/add',
      name: 'PatentAdd',
      component: PatentAdd,
      props: { pageType: 'add' },
    },
    {
      path: '/patent/notice',
      name: 'PatentNotice',
      component: NoticeCommon,
      meta: {
        params: {  },
        type: 'patent'
      }
    },
    {
      path: '/patent/notice/thisweek',
      name: 'PatentNoticeThisweek',
      component: NoticeCommon,
      meta: {
        params: { create_time: 'thisweek' },
        type: 'patent'
      }
    },
    {
      path: '/patent/notice/lastweek',
      name: 'PatentNoticeLastWeek',
      component: NoticeCommon,
      meta: {
        params: { create_time: 'lastweek' },
        type: 'patent'
      }
    },
    {
      path: '/patent/notice/thismonth',
      name: 'PatentNoticeThisMonth',
      component: NoticeCommon,
      meta: {
        params: { create_time: 'thismonth' },
        type: 'patent'
      }
    },
    {
      path: '/patent/notice/lastmonth',
      name: 'PatentNoticeLastMonth',
      component: NoticeCommon,
      meta: {
        params: { create_time: 'lastmonth' },
        type: 'patent'
      }
    },
    {
      path: '/patent/notice/earlier',
      name: 'PatentNoticeEarlier',
      component: NoticeCommon,
      meta: {
        params: { create_time: 'earlier' },
        type: 'patent'
      }
    },
    // {
    //   path: '/news/patent_notice',
    //   name: 'PatentNotice',
    //   meta: { type: 'patent' },
    //   component: NoticeCommon,
    // },
    {
      path: '/patent/custom/:id',
      name: 'PatentCustom',
      component: PatentList,
      meta: {
        custom: true,
      },
    },
//################### 专利路由 end #####################

//################### 版权路由 begin ###################
    {
      path: '/copyright/list',
      name: 'CopyrightList',
      component: CopyrightList
    },
    {
      path: '/copyright/stage/application',
      name: 'CopyrightStageApplication',
      component: CopyrightList,
      meta: {
        params: { stage: 1 },
      }
    },
    {
      path: '/copyright/stage/oa',
      name: 'CopyrightStageOa',
      component: CopyrightList,
      meta: {
        params: { stage: 2 },
      }
    },
    {
      path: '/copyright/stage/authorization',
      name: 'CopyrightStageAuthorization',
      component: CopyrightList,
      meta: {
        params: { stage: 4 },
      }
    },
    {
      path: '/copyright/area/cn',
      name: 'CopyrightAreaCn',
      component: CopyrightList,
      meta: {
        params: { area: 'CN' },
      }
    },
    {
      path: '/copyright/area/other',
      name: 'CopyrightAreaOther',
      component: CopyrightList,
      meta: {
        params: { area: 'other' },
      }
    },
    {
      path: '/copyright/custom/:id',
      name: 'CopyrightCustom',
      component: CopyrightList,
      meta: {
        custom: true,
      },
    },
    {
      path: '/copyright/add',
      name: 'CopyrightAdd',
      meta: { pageType: 'add' },
      component: CopyrightAdd
    },
    {
      path: '/copyright/list/detail/:id',
      redirect: '/copyright/list/detail__/:id',
    },
    {
      path: '/copyright/list/detail__/:id',
      component: CommonDetail,
      children: [
        { path: '', redirect: 'base',  },
        { path: 'base', component: CopyrightAdd, meta: { pageType: 'edit' } },
        { path: 'control', component: Control },
        { path: 'notice', component: Notice },
        { path: 'fee', component: Fee },
        { path: 'email', component: Email },
        { path: 'documents', component: Documents },
      ]
    },
    {
      path: '/news/copyright_notice',
      name: 'CopyrightNotice',
      meta: { type: 'copyright' },
      component: NoticeCommon,
    },
//################### 版权路由 end #####################
//################### 费用路由 begin ###################
    {
      path: '/fee/huangpu/patent',
      name: 'FeeCommonNP',
      component: FeeCommon,
      props: {
        debit: 1,
        defaultParams: {
          category: 1,
          gov: 'dis',
        }
      }
    },
    {
      path: '/fee/huangpu/trademark',
      name: 'FeeCommonNT',
      component: FeeCommon,
      props: {
        debit: 1,
        defaultParams: {
          category: 2,
          gov: 'dis',
        }
      }
    },
    {
      path: '/fee/huangpu/copyright',
      name: 'FeeCommonNC',
      component: FeeCommon,
      props: {
        debit: 1,
        defaultParams: {
          category: 3,
          gov: 'dis',
        }
      }
    },
    {
      path: '/fee/guangzhou/patent',
      name: 'FeeCommonSP',
      component: FeeCommon,
      props: {
        debit: 1,
        defaultParams: {
          category: 1,
          gov: 'city',
        }
      }
    },
    {
      path: '/fee/guangzhou/trademark',
      name: 'FeeCommonST',
      component: FeeCommon,
      props: {
        debit: 1,
        defaultParams: {
          category: 2,
          gov: 'city',
        }
      }
    },
    {
      path: '/fee/guangzhou/copyright',
      name: 'FeeCommonSC',
      component: FeeCommon,
      props: {
        debit: 1,
        defaultParams: {
          category: 3,
          gov: 'city',
        }
      }
    },
    {
      path: '/fee/account/check',
      name: 'InvoiceCommonAC',
      component: InvoiceCommon,
      props: {
        debit: 0,
        defaultParams: {
          status: 1
        }
      }
    },
    {
      path: '/fee/account/upload',
      name: 'InvoiceCommonAU',
      component: InvoiceCommon,
      props: {
        debit: 0,
        defaultParams: {
          voucher: 0
        }
      }
    },
    {
      path: '/fee/account/pay',
      name: 'InvoiceCommonAP',
      component: InvoiceCommon,
      props: {
        debit: 0,
        defaultParams: {
          status: 5
        }
      }
    },
    {
      path: '/fee/account/paid',
      name: 'InvoiceCommonAPD',
      component: InvoiceCommon,
      props: {
        debit: 0,
        defaultParams: {
          status: 4
        }
      }
    },
    {
      path: '/fee/account/refuse',
      name: 'InvoiceCommonAR',
      component: InvoiceCommon,
      props: {
        debit: 0,
        defaultParams: {
          status: 3
        }
      }
    },
    {
      path: '/fee/renewal/pay',
      name: 'RenewalFeeRP',
      component: RenewalFee,
      props: {
        defaultParams: {
          status: 0,
        }
      }
    },
    {
      path: '/fee/renewal/paid',
      name: 'RenewalFeeRPD',
      component: RenewalFee,
      props: {
        defaultParams: {
          status: 10,
        }
      }
    },
    {
      path: '/fee/renewal/refuse',
      name: 'RenewalFeeRR',
      component: RenewalFee,
      props: {
        defaultParams: {
          status: 3,
        }
      }
    },
//################### 费用路由 end #####################
//################### 报表路由 begin ###################
    {
      path: '/report/task',
      name: 'TaskReport',
      component: Report,
      meta: { 'type': 'task' },
    },
    {
      path: '/report/task/add',
      name: 'TaskReportAdd',
      component: ReportAdd,
      meta: { 'type': 'task' },
    },
    {
      path: '/report/proposal',
      name: 'ProposalReport',
      component: Report,
      meta: {'type': 'proposal'},
    },
    {
      path: '/report/proposal/add',
      name: 'ProposalReportAdd',
      component: ReportAdd,
      meta: {'type': 'proposal'},
    },
    {
      path: '/report/patent',
      name: 'PatentReport',
      component: Report,
      meta: { 'type': 'patent' },
    },
    {
      path: '/report/patent/add',
      name: 'PatentReportAdd',
      component: ReportAdd,
      meta: {'type': 'patent'},
    },
    {
      path: '/report/copyright',
      name: 'CopyrightReport',
      component: Report,
      meta: { 'type': 'copyright' },
    },
    {
      path: '/report/copyright/add',
      name: 'CopyrightReportAdd',
      component: ReportAdd,
      meta: {'type': 'copyright'},
    },
    {
      path: '/report/fee',
      name: 'FeeReport',
      component: Report,
      meta: {'type': 'fee'},
    },
    {
      path: '/report/fee/add',
      name: 'FeeReportAdd',
      component: ReportAdd,
      meta: {'type': 'fee'},
    },
    {
      path: '/report/invoice',
      name: 'InvoiceReport',
      component: Report,
      meta: {'type': 'invoice'},
    },
    {
      path: '/report/invoice/add',
      name: 'InvoiceReportAdd',
      component: ReportAdd,
      meta: {'type': 'invoice'},
    },
//################### 报表路由 end #####################

    {
      path: '/setting/userList',
      name: 'UserList',
      component: UserList,
    },
    {
      path: '/setting/offer',
      name: 'OfferList',
      component: OfferList,
    },
    {
      path: '/news/mailList',
      name: 'MailList',
      component: MailList,
    },
    {
      path: '/news/systemMessage',
      name: 'SystemMessage',
      component: SystemMessage,
    },
    {
      path: '/news/systemMessage/detail',
      name: 'SystemMessageDetail',
      component: SystemMessageDetail,
    },
    {
      path: '/news/mailList/mailAdd',
      name: 'MailAdd',
      meta: { type: 'add' },
      component: MailAdd,
    },
    {
      path: '/news/mailList/mailEdit',
      name: 'mailEdit',
      meta: { type: 'edit' },
      component: MailAdd,
    },
    {
      path: '/setting/classification',
      name: 'Clssification',
      component: ClassificationCommon,
    },
    {
      path: '/setting/product',
      name: 'Product',
      component: ClassificationCommon,
    },
    {
      path: '/setting/branch',
      name: 'Branch',
      component: Branch,
    },
    {
      path: '/fee_menu/fee_in/income',
      name: 'FeeIncome',
      component: FeeCommon,
    },
    {
      path: '/dispatch/administration',
      name: 'DispatchAdministration',
      component: DispatchAdministration,
    },
    {
      path: '/fee_menu/fee_pay/pay',
      name: 'FeePay',
      component: FeeCommon,
    },
    {
      path: '/fee_menu/fee_in/bill',
      name: 'FeeBill',
      component: InvoiceCommon,
    },
    {
      path: '/fee_menu/fee_pay/payment',
      name: 'FeePayment',
      component: InvoiceCommon
    },
    {
      path: '/fee_menu/renewal/fee',
      name: 'RenewalFee',
      component: RenewalFee,
    },
    {
      path: '/fee_menu/renewal/estimate',
      name: 'RenewalEstimate',
      component: RenewalEstimate,
    },
    {
      path: '/patent/list/detail/:id',
      redirect: '/patent/list/detail__/:id',
    },
    {
      path: '/patent/list/detail__/:id',
      component: CommonDetail,
      children: [
        { path: '', redirect: 'base',  },
        { path: 'base', component: PatentAdd, meta: {type: 'edit'} },
        { path: 'control', component: Control },
        { path: 'notice', component: Notice },
        { path: 'fee', component: Fee },
        { path: 'email', component: Email },
        { path: 'documents', component: Documents },
      ]
    },
    {
      path: '/commonDetail/:id',
      component: CommonDetail,
      children: [
        { path: '', redirect: 'babel' },
        { path: 'babel', component: Babel },
        { path: 'control', component: Control },
        { path: 'notice', component: Notice },
        { path: 'fee', component: Fee },
        { path: 'email', component: Email },
        { path: 'documents', component: Documents },
      ],
    },
    { path: '/setting/agent', name: 'SettingAgent', component: SettingAgent },
    { path: '/setting/agent/detail', name: 'SettingAgentDetail', component: SettingAgentDetail },
    { path: '/setting/agency', name: 'SettingAgency', component: SettingAgency },
    { path: '/setting/agency/detail', name: 'SettingAgencyDetail', component: SettingAgencyDetail },
    { path: '/setting/case', name: 'SettingCase', component: SettingAgency },
    { path: '/setting/individual', name: 'SettingIndividual', component: SettingIndividual },
    { path: '/setting/jurisdiction', name: 'SettingJurisdiction', component: SettingJurisdiction },
    { path: '/setting/rule', name: 'SettingRule', component: SettingRule },
    { 
      path: '/setting/system',
      name: 'SettingSystem',
      component: SettingSystem,
    },
    { path: '/setting/template', name: 'SettingTemplate', component: SettingTemplate },
    { path: '/setting/template/edit', name: 'SettingTemplateEdit', component: SettingTemplateEdit },
    { path: '/setting/user', name: 'SettingUser', component: SettingUser },
  ]
});
export default router
