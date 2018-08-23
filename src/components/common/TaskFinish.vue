<template>
<div v-loading="loading" element-loading-text="数据加载中" >
   <!-- <information :row="row" @more="handleMore"></information> -->
  <el-steps :space="150" style="padding: 5px 40px;" v-if="data.tips" align-center>
    <el-step v-for="(item, index) in data.tips" :key="index" :title="item.name" :status="item.current ? 'finish' : 'wait'"></el-step>
  </el-steps>
  
  <el-form :model="form" label-width="100px" ref="form" style="min-height: 150px;" :key="`${id}-${next}`"><!--这里需要给form加key 保证每个form的验证规则互不影响-->
  	<el-form-item :label="data.procedure.label" v-if="data.fields && data.fields.procedure">
      <el-select v-model="next">
        <el-option
          v-for="item in data.procedure.items"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        >
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="下一节点" v-if="ifNext">
  		<el-select v-model="next" :disabled="data.fields.procedure ? true : false">
  		 <el-option
				v-for="item in data.next"
				:key="item.id"
				:label="item.name"
				:value="item.id"
  		 >
  		 </el-option>
  		</el-select>
  	</el-form-item>
  	<el-form-item prop="person_in_charge" label="承办人" v-if="fields.person_in_charge">
  		<remote-select type="member" v-model="form.person_in_charge" v-if="defaultVal == 'sender' || defaultVal =='proposer' || defaultVal == 'reviewer' || defaultVal == 'previous' || !defaultVal "></remote-select>
  		<remote-select type="agency" v-model="form.person_in_charge" v-else-if="defaultVal == 'agency'"></remote-select>
      <remote-select type="agent" v-model="form.person_in_charge" v-else-if="defaultVal == 'agent'"></remote-select>
  		<static-select type="ipr" v-model="form.person_in_charge" v-else-if="defaultVal == 'ipr'"></static-select>
  		<!-- <span v-else>{{ data[defaultVal]['name'] }}</span> -->
  	</el-form-item>
    <el-form-item prop="agency" label="代理机构" v-if="fields.agency" :rules="{ required: true, type: 'number', message: '代理机构不能为空', trigger: 'change'}">
      <div v-if="fields.agency == 1">
        <remote-select type="agency_poa" v-model="form.agency" :static-map="agencyMap"></remote-select>
        <!-- <el-button size="mini" type="text" @click="showAgencyLoad">负载</el-button> -->
      </div>
      <span v-else class="form-item-text">{{ agencyMap[0] ? agencyMap[0].name : '' }}</span>
    </el-form-item>
    <el-form-item prop="is_division" label="是否分案" v-if="fields.is_division">
      <app-switch type="is" v-model="form.is_division"></app-switch>
    </el-form-item>
    <el-form-item prop="agency_serial" label="事务所案号" v-if="fields.agency_serial" :rules="{required: true, message: '事务所案号不能为空'}">
      <el-input placeholder="请填写事务所案号" v-model="form.agency_serial"></el-input>
    </el-form-item>
    <el-form-item prop="agent" label="代理人" v-if="fields.agent" :rules=" next == 14 ? { required: true, type: 'number', message: '代理人不能为空',trigger: 'change'} : []">
      <remote-select type="agent" v-model="form.agent" :static-map="this.agentMap" :para=agentControl ref="agent"></remote-select>
    </el-form-item>
    <el-form-item prop="agency_type" label="代理类型" v-if="fields.agency_type"
      :rules="{ required: true, message: '代理类型不能为空'}"
    >
      <static-select type="agency_type" key="patent_type" v-model="form.agency_type"></static-select>
    </el-form-item>
  	<el-form-item prop="due_time" label="内部期限" v-if="fields.due_time">
			<el-date-picker v-model="form.due_time" type="date" placeholder="选择内部期限"></el-date-picker>
  	</el-form-item>
    <el-form-item prop="pay_time" label="支付时间" v-if="fields.pay_time">
      <el-date-picker v-model="form.pay_time" type="date" placeholder="选择支付时间"></el-date-picker>
    </el-form-item>
  	<el-form-item prop="dealine" label="法限" v-if="fields.deadline">
			<el-date-picker v-model="form.dealine" type="date" placeholder="选择法限"></el-date-picker>
  	</el-form-item>
    <el-form-item prop="area" label="申请地区" v-if="fields.area" :rules="{type: 'array', required: true, message: '申请地区不能为空'}">
      <static-select type="area" v-model="form.area"  multiple></static-select>
    </el-form-item>
    <el-form-item prop="type" label="专利类型" v-if="fields.type" :rules="{type: 'number', required: true, message: '专利类型不能为空', trigger: 'blur'}">
      <static-select type="patent_type" v-model="form.type" key="patent_type"></static-select>
    </el-form-item>   
    <el-form-item prop="technical_field" label="技术领域" v-if="fields.technical_field" :rules="{required: true, message: '技术领域必选', trigger: 'change'}">
      <el-radio-group v-model="form.technical_field">
        <el-radio-button label="机械"></el-radio-button>
        <el-radio-button label="电子"></el-radio-button>
        <el-radio-button label="软件"></el-radio-button>
      </el-radio-group>
    </el-form-item>
     <el-form-item prop="original_inventors" label="原发明人" v-if="fields.original_inventors" >
      <remote-select type="inventor" v-model="form.original_inventors"></remote-select>
    </el-form-item>
    <el-form-item prop="title" label="专利标题"  v-if="ifTitle" :rules="{required: true, message: '专利标题不能为空'}">
      <el-input v-model="form.title" placeholder="请填写正式递交的标题"></el-input>
    </el-form-item>
    <el-form-item prop="pct_areas" label="PCT国家" v-if="fields.pct_areas"  :rules="{required: true, message: '请选择PCT要进入的国家'}">
      <static-select type="area" v-model="form.pct_areas" multiple></static-select>
    </el-form-item>
    <el-form-item prop="is_amend" label="是否提出变更" v-if="fields.is_amend">
      <app-switch type="is" v-model="form.is_amend"></app-switch>
    </el-form-item>
    <el-form-item prop="is_reexam" label="是否提出复审" v-if="fields.is_reexam">
      <app-switch type="is" v-model="form.is_reexam"></app-switch>
    </el-form-item>
    <template v-if="fields.oa">
      <el-form-item prop="opinion" label="审查要点" :rules="{required: true, message: '请填写审查要点'}">
        <el-input type="textarea" placeholder="请填写审查要点" v-model="form.opinion"></el-input>
      </el-form-item>
      <el-form-item prop="response" label="修改/答辩" :rules="{required: true, message: '请填写修改/答辩内容'}">
        <el-input type="textarea" placeholder="请填写修改/答辩摘要" v-model="form.response"></el-input>
      </el-form-item>
    </template>
    <el-form-item prop="pct_review" label="PCT国家阶段评审意见" v-if="fields.pct_review" :rules="{required: true, message: '请填写PCT进入国家阶段评审意见'}">
      <el-input type="textarea" v-model="form.pct_review"></el-input>
    </el-form-item>
    <el-form-item prop="issue_review" label="授权前评估意见" v-if="fields.issue_review" :rules="{required: true, message: '请填写授权前评估意见'}">
      <el-input type="textarea" v-model="form.issue_review"></el-input>
    </el-form-item>
    <el-form-item prop="reexam_opinion" label="复审理由" v-if="fields.reexam_opinion" :rules="{required: true, message: '请填写复审理由'}">
      <el-input type="textarea" v-model="form.reexam_opinion"></el-input>
    </el-form-item>
    <el-form-item prop="attachments" label="附件" v-if="fields.attachments && !hide_r_a">
      <upload v-model="form.attachments" :file-list="attachments"> 
      </upload>
    </el-form-item>
    <ul v-if="!hide_r_a && fields.attachments && description&&description.length != 0" style="margin-left:115px;padding: 0;margin-top:-10px; font-size:14px;color:#bbb;">
      <li v-for="(item, index) in description" :key="index">{{ item }}</li>
    </ul>    
    <div v-if="data.inventor_tips" style="margin-left:100px;padding: 0;margin-bottom: 20px; font-size:14px;color:#bbb;">
      <span>{{ data.inventor_tips }}</span>
    </div>
    <el-form-item prop="level" label="案件等级" v-if="fields.level" :rules="{required: true, message: '案件等级必选', trigger: 'change'}">
      <el-radio-group v-model="form.level">
        <el-radio-button label="A"></el-radio-button>
        <el-radio-button label="B"></el-radio-button>
        <el-radio-button label="C"></el-radio-button>
        <el-radio-button label="D"></el-radio-button>
      </el-radio-group>
    </el-form-item>
    
    <!-- <el-form-item prop="rank" label="评分" v-if="fields.rank">
      <el-rate 
        v-model="form.rank" 
        style="margin-top: 10px" 
        :colors="['#99A9BF', '#F7BA2A', '#FF9900']" 
        show-text 
        :texts="['20','40','60','80','100']"
      ></el-rate>
    </el-form-item> -->
    <el-form-item prop="tech_rank" label="技术理解" v-if="fields.tech_rank" :rules="{type: 'number', required: true, message: '技术理解评分必填'}">
      <!-- <el-rate 
        v-model="form.tech_rank" 
        style="margin-top: 10px" 
        :colors="['#99A9BF', '#F7BA2A', '#FF9900']" 
        show-text 
        :texts="['20','40','60','80','100']"
      ></el-rate> -->
      <el-slider
        v-model="form.tech_rank"
        show-input
        :max="100"
      >
    </el-slider>
    </el-form-item>
    <el-form-item prop="draft_rank" label="撰写质量" v-if="fields.draft_rank" :rules="{type: 'number', required: true, message: '撰写质量评分必填'}">
<!--       <el-rate 
        v-model="form.draft_rank" 
        style="margin-top: 10px" 
        :colors="['#99A9BF', '#F7BA2A', '#FF9900']" 
        show-text 
        :texts="['20','40','60','80','100']"
      ></el-rate> -->
      <el-slider 
        v-model="form.draft_rank"
        show-input
        :max="100"
      >
      </el-slider>
    </el-form-item>
    <el-form-item prop="service_rank" label="服务状态" v-if="fields.service_rank" :rules="{type: 'number', required: true, message: '服务状态评分必填'}">
      <!-- <el-rate 
        v-model="form.service_rank" 
        style="margin-top: 10px" 
        :colors="['#99A9BF', '#F7BA2A', '#FF9900']" 
        show-text 
        :texts="['20','40','60','80','100']"
      ></el-rate> -->
      <el-slider 
        v-model="form.service_rank"
        show-input
        :max="100"
      >
      </el-slider>
    </el-form-item>
    <el-form-item prop="negative_flag" label="特别评价" v-if="fields.negative_flag">
      <el-radio-group v-model="form.negative_flag">
        <el-radio-button label="无"></el-radio-button>
        <el-radio-button label="好评"></el-radio-button>
        <el-radio-button label="差评"></el-radio-button>
      </el-radio-group>
    </el-form-item>
    <el-form-item prop="negative_comment" label="评价理由" v-if="fields.negative_comment" v-show="form.negative_flag !== '无'&& form.negative_flag">
      <el-input type="text" v-model="form.negative_comment"></el-input>
    </el-form-item>
    <el-form-item v-if="(next == '20' && level != 'A')  || next == '114'" prop="pconfirm" label="确认" :rules="confirmValidator">
      <el-checkbox v-model="form.pconfirm">已确认送件信息完整</el-checkbox><el-button type="text" size="mini" style="margin-left: 10px;" @click="$emit('more', 'patent')">查看</el-button>
    </el-form-item>
    <el-form-item prop="remark" label="任务备注" v-if="fields.remark && !hide_r_a">
      <el-input type="textarea" v-model="form.remark"></el-input>
    </el-form-item>
    
    <el-form-item style="margin-bottom: 0px;">
  		<el-button type="primary" @click="submitFunc" :loading="btn_disabled">{{ btn_disabled ? '提交中...' : '提交' }}</el-button>
  	</el-form-item>
  </el-form>
</div>
</template>

<script>
import axiosMixins from '@/mixins/axios-mixins'
import Member from '@/components/form/Member'
import Agent from '@/components/form/Agent'
import Agency from '@/components/form/Agency'
import Upload from '@/components/form/Upload'
import RemoteSelect from '@/components/form/RemoteSelect'
import StaticSelect from '@/components/form/StaticSelect'
import AppSwitch from '@/components/form/AppSwitch'
import Information from '@/components/page_extension/TaskCommon_information'

import {mapMutations} from 'vuex'
import {mapActions} from 'vuex'

const URL = `/tasks`;

export default {
  name: 'taskFinish',
  props: ['id','row'],
  mixins: [axiosMixins],
  data () {
		return {
			'data': {},
			'next': '',
      'description': '',
      'level': '',
			'form': {
        agency_serial: '',
				person_in_charge: '',
				agency: '',
				agent: '',
        agency_type: '',
				due_time: '',
				deadline: '',
				remark: '',
				attachments: [],
        rank: 5,
        area: [],
        type: '',
        original_inventors: '',
        pconfirm: false,
        level: '',
        title: '',
        pay_time: '',
        tech_rank: 60,
        draft_rank: 60,
        service_rank: 60,
        negative_flag:false,
        negative_comment:'',
        pct_areas: [],
        is_division: 0,
        is_amend: 0,
        pct_review:'',
        issue_review:'',
        opinion:'',
        response:'',
        technical_field: '',
        reexam: 0,
        reexam_opinion: '',
			},
			'defaultVal': '',
      'agencyMap': [],
      'agentMap': [],
			'fields': {},
      'loading': false,
      'btn_disabled': false,
      'attachments': [],
      'hide_r_a': false,
      'confirmValidator': { 
          required: true,
          validator: (a,b,c)=>{

            if(b) {
              c();
            }else {
              c('必需确认送件信息完整');
            }

          },
        },
      
		}
  },
	created () {
		this.refreshData(); 
	},
	methods: {
    ...mapMutations([
      'showAgencyLoad',
    ]),
    ...mapActions([
      'refreshUser',
    ]),
  	refreshData () {
      this.loading = true; 
      this.next = "";
  		const url = `${URL}/${this.id}/form`;
  		const success = d=>{
        this.$emit('refreshNext',d.data.next);
  			this.data = d.data;
        this.fields = d.data.fields;
        if(d.data.level){
          this.level= d.data.level;
        }
        if(this.data.next.length != 0 ) {
          this.next = d.data.next[0].id;
        }else {
          this.next = "";
          this.form.agent = this.data.agent;
        }
  		};
      const complete = _=>{ 
        this.loading = false; 
      }
  		this.axiosGet({url, success, complete});
  	},
  	submitFunc () {
      this.$refs.form.validate(_=>{
        if(_) {
          this.btn_disabled = true;
          const url = `${URL}/${this.id}/nexttask`;
          const data = Object.assign({}, {'flow_node_id': this.next}, this.form);
          if(data.rank) {data.rank *= 20};

          const success = ()=>{ 
            this.$message({type: 'success', message: '完成任务成功'});
            this.refreshUser();            
            this.$emit('submitSuccess', data);
          };

          const complete = _=>{ this.btn_disabled=false }; 
          this.$axiosPost({url, data, success, complete}); 
        }else {
          this.$message({message: '请正确填写任务完成字段', type: 'warning'})
        }
      })
  	},
  	cancel () {
  		this.$emit('cancel');
  	},
    handleMore (type) {
      this.$emit('more',type);
    },
  	clear () {
  		this.$refs.form.resetFields();
  	},
    proposalFinish ({remark, attachments}) {
      this.form.remark = remark;
      this.form.attachments = attachments.map(_=>_.id);
      this.hide_r_a = true;
    }
	},
	watch: {
		id () {
			this.clear();
      this.refreshData();
		},
		'next': {
			handler: function (val) {
        // if(val == "") return;
        // console.log('----------------start--------------')
        // console.log(val);
        // console.log('==============end================')
        for (let d of this.data.next) {
          if(d.id == val) {
            // console.log('非空')
            this.fields = d.fields;
            this.defaultVal = d.default == 'agent' && !this.data.agent ? 'ipr' : d.default;
            const person_in_charge = this.data[this.defaultVal] ? this.data[this.defaultVal] : '';

            if(d.description) {
              this.description = d.description;
            }else{
              this.description = this.data.description;
            }
                        
            this.$nextTick(_=>{
              if(this.fields.agency_type) this.form.agency_type = 1;
              if(this.fields.area) this.form.area = ['CN'];
              if(this.fields.agency && this.data.agency) {
                this.agencyMap = [ this.data.agency ];
                this.form.agency = this.data.agency.id;
              }
              
              // if(this.ifTitle) this.form.title = this.data.title;
              if(this.fields.type) this.form.type = 1;
              if(this.fields.level) this.form.level = this.data.level ? this.data.level : '';
              if(this.defaultVal == 'ipr') {
                this.form.person_in_charge = person_in_charge['id'];
              }else {
                this.form.person_in_charge = person_in_charge;
              }

              //附件同步
              const atta = d.attachments; 
              if(!this.hide_r_a && this.attachments && atta ) {
                this.form.attachments = atta.map(_=>_.id);
                this.attachments = atta;
              }

              this.$nextTick(_=>{
                //这里agent需要在agency的监听事件完成后再进行填充
                if(this.fields.agent && this.data.agent) {
                  this.agentMap = [ this.data.agent ];
                  this.form.agent = this.data.agent.id;
                }
              })
            })
            
						break;
					}else{
            // console.log('空数组');
            this.description = this.data.description;
          }
        }
				this.$refs.form.resetFields();
			}
    },
    'form.pconfirm': {
      handler () {
        this.$nextTick(_=>{
          this.$refs.form.validateField('pconfirm');
        })        
      }
    },
    'form.agency': {
      handler (val) {

        if(val !== '' && !(val instanceof Object)) {
          if(this.$refs.agent) {
            this.agentMap = [];
            this.$refs.agent.clear(false);
          }      
        }else {
          this.form.agent = '';
        }

      }
    },
    'defaultDescription': {
      handler(val) {
        if(val && this.next.length == 0) {
          // console.log('next空了且next没变')
          this.description = val;
        }
      }
    },
    'form.negative_flag': {
      handler(val) {
        this.form.negative_comment = '';
      }
    },
	},
	computed: {
    ifNext () {
      return this.data.next && this.data.next.length != 0 ? true : false;
    },
    ifTitle () {
      return this.data.flow_node_id == 20
    },
    defaultDescription () {
      return this.data.description;
    },
    agentControl () {
      return {'agency': this.form.agency};
    },
	},
	components: { Member, Agent, Agency, Upload, RemoteSelect, StaticSelect, AppSwitch,Information, }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
