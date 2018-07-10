<template>
  <!-- <app-collapse col-title="扩展信息"> -->
    <div>
      <el-form label-width="120px" :model="form" ref="form">
<!--         <el-form-item label="摘要">
          <el-input type="textarea" v-model="form.abstract" placeholder="请填写专利摘要" :rows="6" class="custom-textarea"></el-input>
        </el-form-item> -->
        <el-row>
          <el-col :span="8">
            <el-form-item label="公告日" >
              <el-date-picker v-model="form.issue_date" type="date" placeholder="请选择公告日" class="input-min-width"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="公告号">
              <el-input v-model="form.issue_number" placeholder="请填写公告号" class="input-min-width"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="申请日">
              <el-date-picker v-model="form.apd" type="date" placeholder="请选择申请日" class="input-min-width"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="申请号">
              <el-input v-model="form.apn" placeholder="请填写申请号" class="input-min-width"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="公开日">
              <el-date-picker v-model="form.public_date" type="date" placeholder="请选择公开日" class="input-min-width"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="公开号">
              <el-input v-model="form.public_number" placeholder="请填写公开号" class="input-min-width"></el-input>
            </el-form-item>      
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
          <el-form-item label="初审合格日">
            <el-date-picker v-model="form.pre_exam_ok_date" type="date" placeholder="请选择初审合格日" class="input-min-width"></el-date-picker>
          </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="进入实审日">
              <el-date-picker v-model="form.sub_exam_start_date" type="date" placeholder="请选择实审日" class="input-min-width"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="立案时间">
              <el-date-picker v-model="form.create_time" type="date" placeholder="请选择立案时间" class="input-min-width"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
          <el-form-item label="申请方式">
            <el-select v-model="form.manner" value-key="id" class="input-min-width">
              <el-option
                v-for="item in options.manner"
                :key="item.id"
                :label="item.name"
                :value="item"
              ></el-option>
            </el-select>
          </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="复审委内编号">
                <el-input v-model="form.board_number" placeholder="请填写复审委内编号" class="input-min-width"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            
          </el-col>
        </el-row>
        <template v-if="form.manner.id == 3 || area == 'PCT'">
          <el-row>
            <el-col :span="8">
              <el-form-item label="国际申请日">
                <el-date-picker v-model="form.pct_apd" type="date" placeholder="请选择国际申请日" class="input-min-width"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="国际申请号">
                <el-input v-model="form.pct_no" placeholder="请填写国际申请号" class="input-min-width"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="国际优先权日">
                <el-date-picker v-model="form.pct_priority_date" type="date" placeholder="请选择国际优先权日" class="input-min-width"></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="国际公开日">
                <el-date-picker v-model="form.pct_public_date" type="date" placeholder="请选择国际公开日" class="input-min-width"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="国际公开语言">
                <el-select v-model="form.pct_public_language" placeholder="请选择语言" class="input-min-width">
                  <el-option
                    v-for="item in options.language"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="国际公开号">
                <el-input v-model="form.pct_public_no" placeholder="请填写国际公开号" class="input-min-width"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </template>
        <template v-if="area == 'PCT'">
          <el-form-item label="国际检索日期">
            <el-date-picker v-model="form.pct_search_date" type="date" placeholder="请选择国际检索日期" class="input-min-width"></el-date-picker>
          </el-form-item>
          <el-form-item label="国际检索结论">
            <el-input type="textarea" v-model="form.pct_search_result" placeholder="请填写国际检索结论" class="input-min-width"></el-input>
          </el-form-item>
        </template>
      </el-form>
      </div>
    <!-- </app-collapse> -->
</template>

<script>
import AppCollapse from '@/components/common/AppCollapse'
import Branch from '@/components/form/Branch'
import StaticSelect from '@/components/form/StaticSelect'
import RemoteSelect from '@/components/form/RemoteSelect'

import { checkInventors } from '@/const/validator.js'

export default {
  name: 'patentAddPerson',
  props: ['type','area'],
  data () {
		return {
			form: {
        issue_date: '',
        issue_number: '',
        // abstract: '',
        date: '',
        apn: '',

        public_date: '',
        public_number: '',
        pre_exam_ok_date: '',
        sub_exam_start_date: '',
        create_time: '',

        manner: {name:"直接申请",id:1},
        pct_apd: '',
        pct_no: '',
        pct_priority_date: '',
        pct_public_date: '',
        pct_public_language: '',
        pct_search_date: '',
        pct_search_result: '',
        pct_public_no: '',
        board_number: '',
			},
      options: {
        manner: [
          {name:"直接申请",id:1},
          {name:"巴黎公约",id:2},
          {name:"PCT进入国家阶段",id:3},
          {name:"外部转入", id: 4}
        ],
        language: [
          {name:"中文-Chinese",id:"CN"},
          {name:"英文-English",id:"EN"},
          {name:"法文-Franch",id:"FR"},
          {name:"德文-Germany",id:"GE"},
          {name:"日文-Japanese",id:"JP"},
          {name:"俄文-Russian",id:"RU"},
          {name:"西班牙-Spanish",id:"ES"}
        ]
      },
		}
  },
  methods: {
    handleInventor (val) {
      this.form.inventors = val;
      this.$refs.form.validateField('inventors');
    },
  	setForm (data) {
      for(let k in this.form) {
        if( k == 'branch' ) {
          if(data[k]) {
            this.form[k] = data[k]['id'];  
            this.branchName = data[k]['name'];
          }else {
            this.form[k] = '';
            this.branchName = '';
          }
        }else {
          this.form[k] = data[k];
        }
      }
  	},
    submitForm () {
      if(this.type == 'add') this.form.ipr = this.user.id;
      return this.$tool.shallowCopy(this.form, { 'date': true });
    },
    checkForm (callback) {
      callback(true);
    },
  },
  computed: {
    user () {
      return this.$store.getters.getUser;
    }
  },
  components: { 
    AppCollapse, 
    Branch, 
    StaticSelect, 
    RemoteSelect 
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>