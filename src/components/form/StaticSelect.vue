<template>
  <el-select
    :value="value"
    @input="handleInput"
  	:multiple="multiple"
  	:disabled="disabled"
    :placeholder="config.placeholder"
    filterable
    :size="size"
    :allow-create="config.allowCreate !== undefined ? config.allowCreate : false"
    :default-first-option="config.defaultFirstOption !== undefined ? config.defaultFirstOption : false"
    ref="select"
    clearable
    @change="handleChange"
  >
  	<el-option
  		v-for="item in optionsIn"
  		:key="item.id"
  		:label="item.name"
  		:value="item.id"
  	>
  	</el-option>
  </el-select>
</template>


<script>



const config = [
  ['categories',{
    placeholder: '请选择商标大类',
    options:[
      {id:1,name:"[1]化学品"},{id:2,name:"[2]颜料、染料和防腐制品"},{id:3,name:"[3]清洁制剂和梳妆用制剂"},{id:4,name:"[4]工业用油和油脂，燃料和照明材料"},{id:5,name:"[5]药品和其他医用或兽医用制剂"},{id:6,name:"[6]未加工的和半加工的普通金属"},{id:7,name:"[7]机器、机床、马达和引擎"},{id:8,name:"[8]各种行业的作为工具使用的手动器具"},{id:9,name:"[9]装置和仪器"},{id:10,name:"[10]医疗仪器、器械及用品"},{id:11,name:"[11]照明通风"},{id:12,name:"[12]运载工具"},{id:13,name:"[13]火器和花炮产品"},{id:14,name:"[14]贵重金属、珠宝"},{id:15,name:"[15]乐器"},{id:16,name:"[16]纸、纸制品和办公用品"},{id:17,name:"[17]电绝缘，隔热或隔音材料"},{id:18,name:"[18]皮革、人造皮革"},{id:19,name:"[19]非金属建筑材料"},{id:20,name:"[20]家具及其部件"},{id:21,name:"[21]家庭和厨房用小型手动器具"},{id:22,name:"[22]缆及帆篷制品"},{id:23,name:"[23]纺织用纱和线"},{id:24,name:"[24]纺织品"},{id:25,name:"[25]服装，鞋，帽"},{id:26,name:"[26]缝纫用品"},{id:27,name:"[27]在已建成的地板和墙壁上的制品"},{id:28,name:"[28]游戏器具和玩具"},{id:29,name:"[29]动物类食品"},{id:30,name:"[30]植物类食品"},{id:31,name:"[31]未经制作的田地产物"},{id:32,name:"[32]不含酒精的饮料及啤酒"},{id:33,name:"[33]含酒精的饮料（啤酒除外）"},{id:34,name:"[34]烟草；烟具；火柴"},{id:35,name:"[35]广告与商业"},{id:36,name:"[36]保险金融"},{id:37,name:"[37]房屋建筑"},{id:38,name:"[38]电信"},{id:39,name:"[39]运输旅行"},{id:40,name:"[40]材料处理"},{id:41,name:"[41]教育培训"},{id:42,name:"[42]复杂领域活动服务"},{id:43,name:"[43]提供食物和饮料的服务"},{id:44,name:"[44]医疗、卫生和美容"},{id:45,name:"[45]法律服务"}
    ]
  }],
  ['type',{
    placeholder: '请选择商标类型',
    options:[
      { name: '文字', id: 1},
      { name: '图形', id:2},
      { name: '文字+图形', id: 3},
      { name: '立体', id: 4},
      { name: '声音', id: 5},
      { name: '气味', id: 6},
    ]
  }],
  ['agency_scope', {
    placeholder: '请选择代理机构业务范围',
    options: [
      { name: '国内新申请', id: '国内新申请'},
      { name: '国外新申请', id: '国外新申请'},
      { name: '国内无效诉讼', id: '国内无效诉讼'},
      { name: '国外无效诉讼', id: '国外无效诉讼'},
      { name: '分析', id: '分析'},
    ]
  }],
  ['ipr', {
    placeholder: '请选择IPR',
    options: 'iprOptions',
    refresh: 'refreshIpr',
  }],
  ['patent_type', {
    placeholder: '请选择专利类型',
    options: [
      { name: '发明专利', id: 1 },
      { name: '实用新型', id: 2 },
      { name: '外观设计', id: 3 },
      { name: '发明+新型', id: 4 },
    ]
  }],
  ['agency_type', {
    placeholder: '请选择代理类型',
    options: [
      {id:1, name:"申请及OA阶段"},
      {id:2, name:"OA阶段"},
      {id:3, name:"复审阶段"},
      {id:4, name:"无效阶段"},
      {id:5, name:"被无效答复"},
      {id:6,name:"分析"}
    ]
  }],
  ['case_type', {
    placeholder: '请选择案件类型',
    options: [
      { id: 0, name: '提案' },
      { id: 1, name: '专利' },
      { id: 2, name: '商标' },
      { id: 3, name: '版权' },
    ]
  }],
  ['file_type', {
    placeholder: '请选择文件类型',
    url: '/api/fileTypes',
  }],
  ['file_type_patent', {
    placeholder: '请选择专利文件类型',
    url: '/api/fileTypes?category=1',
  }],
  ['file_type_trademark', {
    placeholder: '请选择商标文件类型',
    url: '/api/fileTypes?category=2'
  }],
  ['file_type_copyright', {
    placeholder: '请选择版权文件类型',
    url: '/api/fileTypes?category=3',
  }],
  ['group', {
    placeholder: '请选择用户组',
    options: 'groupOptions',
  }],
  ['mail', {
    placeholder: '请输入邮箱地址',
    url: '/api/mailAddress',
    handle (data) {
      return data.list.map(_=>{return {id: _.value, name: _.label}});
    },
    allowCreate: true,
    defaultFirstOption: true,
  }],
  ['tag', {
    placeholder: '请输入或选择标签',
    url: '/api/tags',
    handle (data) {
      return data.tags.map(_=>{return {id: _.tag, name: _.tag}});
    },
    allowCreate: true,
    defaultFirstOption: true,
  }],
  ['area', {
    placeholder: '请选择地区',
    options: 'areaData',
  }],
  ['flow_node', {
    placeholder: '请选择流程节点',
    url: '/api/flownodes',
    handle: _=>_.flownodes,
    // set: 'setFlowNodes',
    // refresh: 'refreshFlowNodes',
  }],
  ['fee_code', {
    placeholder: '请选择费用代码',
    // options: 'feeCodesOptions'
    url: '/api/feeCodes',
    handle (data) {
      return data.codes.map(_=>{
        _.id = _.id - 0;
        _.amount = _.amount - 0;
        return _;
      })
    }
  }],
  ['fee_code_renewal', {
    placeholder: '请选择年费类型',
    url: '/api/feeCodes?type=renewal',
    handle (data) {
      return data.codes.map(_=>{
        _.id = _.id - 0;
        _.amount = _.amount - 0;
        return _;
      })
    }
  }],
  ['fee_target_income', {
    placeholder: '请选择收入对象',
    url: '/api/feeTargets',
    params: {
      debit: 1,
    },
  }],
  ['fee_target_expenditure', {
    placeholder: '请选择支出对象',
    url: '/api/feeTargets',
    params: {
      debit: 0,
    }
  }],
  ['progress', {
    placeholder: '请选择当前进度',
    url: '/api/progress',
  }],
  ['branch', {
    placeholder: '请选择部门',
    options: 'branchOptions',
  }],
  ['strategy', {
    placeholder: '请选择申请策略',
    options: [
      { id: 1, name: '占领性申请' },
      { id: 2, name: '进攻性申请' },
      { id: 3, name: '防御性申请' },
      { id: 4, name: '策略性申请' },
    ]
  }],
  ['timing', {
    placeholder: '请选择实审实际',
    options: [
      { id: 1, name: '提前公开' },
      { id: 2, name: '18个月' },
      { id: 3, name: '3年' },
    ]
  }],
  ['patent_in', {
    placeholder: '请选择',
    options: [
      { id: '', name: '申请专利' },
      { id: 827, name: '暂缓' },
      { id: 825, name: '不申请专利，以技术秘密保护更有利' },
      { id: 826, name: '不申请专利，以文献发表形式做防御性公开，避免他人申请专利' },
    ]
  }],
  ['patent_importance', {
    options: [
      { id: 1, name: '核心' },
      { id: 2, name: '很重要' },
      { id: 3, name: '重要' },
      { id: 4, name: '普通' },
      { id: 5, name: '不清楚' },
    ]
  }],
  ['patent_avoidability', {
    options: [
      { id: 1, name: '很困难' },
      { id: 2, name: '比较困难' },
      { id: 3, name: '容易' },
      { id: 4, name: '很容易' },
    ]
  }],
  ['patent_evidence', {
    options: [
      { id: 1, name: '非常容易' },
      { id: 2, name: '可以' },
      { id: 3, name: '可以但需要借助复杂手段' },
      { id: 4, name: '不容易' },
    ]
  }],
  ['patent_profitability', {
    options: [
      { id: 1, name: '较大' },
      { id: 2, name: '中等' },
      { id: 3, name: '较小' },
      { id: 4, name: '不确定' },
      { id: 5, name: '没有在用' },
    ]
  }],
  ['patent_selling', {
    options: [
      { id: 1, name: '相关' },
      { id: 2, name: '不相关' },
      { id: 3, name: '不确定' },
    ]
  }],
  ['patent_marketing', {
    options: [
      { id: 1, name: '阻挡对手' },
      { id: 2, name: '宣传' },
      { id: 3, name: '防止抄袭' },
      { id: 4, name: '其他用途' },
    ]
  }],
  ['currency', {
    placeholder: '请选择费用类型',
    options: [
      { name: "人民币[CNY]", id: "CNY" },
      { name: "美元[USD]", id: "USD" },
      { name: "欧元[EUR]", id: "EUR" },
      { name: "日元[JPY]", id: "JPY" },
      { name: "韩元[KRW]", id: "KRW" },
      { name: "港币[HKD]", id: "HKD" },
      { name: "新台币[NTD]", id: "NTD" },
      { name: "英磅[GBP]", id: "GBP" },
      { name: "德国马克[DEM]", id: "DEM" },
      { name: "瑞士法郎[CNY]", id: "CHF" },
      { name: "加拿大元[CAD]", id: "CAD" },
      { name: "澳大利亚元[AUD]", id: "AUD" },
      { name: "新西兰元[NZD]", id: "NZD" },
    ]
  }]
];

const map = new Map(config);
const dataMap = new Map([
  ['mail', {data: null}],
  ['fee_target_income', {data: null}],
  ['fee_target_expenditure', {data: null}],
  ['file_type', {data: null}],
  ['file_type_patent', {data: null}],
  ['file_type_trademark',{data: null}],
  ['tag', {data: null}],
  ['fee_code', {data: null}],
  ['fee_code_renewal', {data: null}],
  ['flow_node', {data: null}],
  ['progress',{data: null}]
]);

//-----------------------------配置数据分界线-----------------------------------------------

import AxiosMixins from '@/mixins/axios-mixins'

export default {
  name: 'staticSelect',
  mixins: [ AxiosMixins ],
  props: {
    'value': null,
    'multiple': {
      type: Boolean,
      default: false,
    },
    'disabled': {
      type: Boolean,
      default: false,
    },
    'size': {
      type: String,
    },
    'type': null,
    'filterOptions': {
      type: Array,
      default () {
        return [];
      },
    },
  },
  data () {

    let o = dataMap.get(this.type);
    o = o ? o : null;
    
    return {
      cacheData: o,
      options: [],
    }
  },
  computed: {
  	config () {
  		const config = map.get(this.type);
  		return config ? config : this.type;
  	},
    map () {
      const map = new Map ();
      this.options.forEach(_=>{map.set(_.id, _)});

      return map;
    },
    options_vuex () {
      let op = null;
      if( typeof this.config.options === 'string') {
        op = this.$store.getters[this.config.options];
      }

      return op;
    },
    optionsIn () {
      const f = this.filterOptions;
      if(f.length != 0) {
        return this.options.filter(_=>{
          for(let i = 0; i < f.length; i++) {
            const item = f[i];

            if(_[item['key']] != item['value']) {
              return false;
            }
          }
          return true;
        })
      }else {
        return this.options;
      }
    }
  },
  watch: {
    options_vuex (val) {
      this.options = val;
    },
    value (val) {
      this.$refs.select.visible = false;
    }
  },
  methods: {
    handleInput (val) {
      this.$emit('input', val);
    },
    handleChange (val) {
      this.$emit('change', this.map.get(val));
    },
    getSelected (value) {
      const arr = [];
      let v = value != undefined ? value : this.value;
      let cv = this.multiple ? v : [ v ];
      
      cv.forEach(_=>{
        const val = this.map.get(_);
        if(val) {
          arr.push(val);
        }else if(_ != '') {
          arr.push({id: _, name: _});
        }
      })

      return arr;
    },
    setOptions () {
      let op = this.config.options;
      

      if(op instanceof Array) {
        
        //存储在配置项的下拉框数据直接使用
        this.options = op;

      }else if(typeof op === 'string') {
        op = this.options_vuex;

        //存储在vuex中的数据,op代表getters的名字,
        //当数据不止在Select而是在全局中有多处被使用,或者数据在使用过程中需要保持动态更新,使用vuex存储
        if(op === undefined) {
          if(this.config.refresh) {
            this.$store.dispatch(this.config.refresh);  
          }
        }else {
          this.options = op;
        }

      }else if(op === undefined && this.cacheData) {
        
        //初始化缓存数据,这里利用了对象的索引特性,所以在回掉函数改变cacheData之后,同类型组件的options都会改变
        //但是这会导致同一类型的组件的options实际上共用一个数组
        //如果需要每个组件的options数组私有,可使用拷贝函数与watch
        if(this.cacheData.data == null) {
          this.cacheData.data = [];
          if(this.config.url) {
            const url = this.config.url;
            const data = this.config.params ? this.config.params : {};
            const success = _=>{
              const handle = this.config.handle;
              const r = handle ? handle(_) : _.list;

              this.cacheData.data.push(...r);
            }

            this.axiosGet({url, data, success});
          }
        }
        this.options = this.cacheData.data;
      }

    }
  },
  created () {
    this.setOptions();
  },
  watch: {
    filterOptions () {
      if(this.multiple) {
        this.$emit('input', []);
      }else {
        this.$emit('input', '');
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>