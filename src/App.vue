<template>
  <div id="app" :style="`padding-left: ${appPaddingLef};`" v-loading.fullscreen.lock="userinfoLoading" element-loading-text="初始化中...">
<!--     <el-popover
      ref="popover"
      placement="bottom"
      title="系统消息"
      width="400"
      trigger="click"
      v-model="sysPopVisible"
    >
    <div>
      <template v-if="sysmesg.length != 0">
      <ul style="list-style-type: decimal;" >
        <li class="sysmesg-item"  v-for="item in sysmesg" @click="$router.push(`/news/systemMessage/detail?id=${item.id}`)">{{ item.subject }}</li>
      </ul>
      <a href="javascript::void(0)" @click="$router.push('/news/systemMessage');sysPopVisible = false">查看更多...</a>
      </template>
      <div v-else style="color: #ccc; margin-top: 10px; margin-left: 20px;">暂无系统消息...</div>      
    </div>
    </el-popover> -->

    <nav>
        <div style="display: inline-block;vertical-align: top;">
          <img src="/static/static_img/hjg_logo.png" style=" height: 27px;vertical-align: middle;">
        </div>
        <!-- <span class="logo_name">知识产权管理系统</span> -->
        <div style="display: inline-block;">
          <app-nav></app-nav>
        </div>
        <div style="position: absolute;top: 0;right: 0;overflow: hidden;">
          <el-dropdown  trigger="click" style="float: right; margin-right: 40px;" @command="handleCommond">
            <span class="el-dropdown-link" style="color: #20a0ff; cursor: pointer;">
              {{ username }}<i class="el-icon-caret-bottom el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown" >
              <el-dropdown-item command="login_out">登出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        
<!--         <img 
          v-popover:popover  
          style="cursor: pointer; float: right; margin-right: 20px; margin-top: 12px; font-size: 24px;" 
          title="系统消息"
          :src="sysmesg.length != 0 ? '/static/static_img/news_in.png' : '/static/static_img/news.png'"
        />   -->      
          <el-badge :value="pendingTaskCount" class="task-pending-top">
            <el-button size="mini" icon="warning" type="primary" @click="$router.push('/task/pending')" title="待办任务"></el-button>
          </el-badge>
        </div>       
    </nav>
      
    <div class="nav-left" :style="`height: ${innerHeight}px; left: ${navLeft}`" v-if="!noMenu">
      <span class="nav-left-btn" :style="`left: ${navLeftBtn};`" @click="navToggle" v-if="!noMenu"><span :class="navLeftBtnClass"></span></span>
      <el-menu v-if="menusMap != null" theme="dark" router unique-opened :default-active="leftMenuActive" mode="vertical">
        <app-menu-item v-for="item in menuData" :dd="item" :key="item.path"></app-menu-item>
      </el-menu>
    </div>
    <div v-loading="loading" :element-loading-text="loadingText" >
      <div :style="`height: ${innerHeight-10}px; padding: 10px 15px 0; background-color: #F9FAFC;overflow:auto;`">
        <div class="container">
          <!-- <h1 class="container-menu"><i :class="select.icon"></i><span>{{ select.text }}</span></h1> -->
          <div class="container-nav" v-if="!noMenu">
            <el-breadcrumb separator=">">
              <el-breadcrumb-item v-for="item in select_arr" :to="item.path" :key="item.path">
                <i :class="item.icon"></i>{{ item.text }}
              </el-breadcrumb-item>
              <el-breadcrumb-item v-if="navLabel.length != 0" class="container-nav-screen">
                <el-tag 
                  v-for="(item, index) in navLabel"
                  :closable="true"
                  :key="index"
                  type="primary"
                  :close-transition="false"
                  @close="handleClose(item)"
                >
                  {{ item.label }}
                </el-tag>
              </el-breadcrumb-item>
            </el-breadcrumb>
          </div>

          <router-view :key="$route.path.split('__')[0]" ></router-view>
        </div>
      
      </div>
    </div>

    <agency-load :visible="agencyLoadVisible"></agency-load>
    
  </div>
</template>

<script>

import AgencyLoad from '@/components/form/AgencyLoad'

import menu from '@/const/menuConst'
import AppNav from '@/components/common/AppNav'
import AppMenuItem from '@/components/common/AppMenuItem'

import { mapGetters } from 'vuex'
import { mapMutations } from 'vuex'
import { mapActions } from 'vuex'

export default {
  name: 'app',
  computed: {
    ...mapGetters([
      'navLabel',
      'innerHeight',
      'loading',
      'loadingText',
      'viewLoading',
      'viewLoadingText',
      'username',
      'leftVisible',
      'agencyLoadVisible',
      'menusMap',
      'pendingTaskCount',
      'menuData',
      'menuDataMap',
      'menuType',
      'noMenu',
    ]),
    path () {
      let path = this.$route.path;
      path = path.split("__")[0];
      return path;
    },
    select_arr () {
      const d = this;
      const arr = [];
      const path = this.path;
      const params = d.$route.params;

      const arr2 = path.split("/");

      for(let i = 0; i < arr2.length; i++) {
        const str = i == 0 ? "/" : arr2.slice(0, i+1 ).join("/");
        const item = this.menuDataMap[str];
        if(item) {
          arr.push(item);
        }
      }

      return arr;
    },
    sysmesg () {
      let s = this.$store.getters.sysmesg;
      if(s === undefined) {
        s = [];
        this.$store.dispatch('refreshMesg'); 
      }
      if(s.length > 3) s = s.slice(0,3);
      return s;
    },
    appPaddingLef () {
      if(this.noMenu) return '0px';
      return this.leftVisible ? '200px' : '0px';
    },
    navLeft () {
      return this.leftVisible ? '0px' : '-200px';
    },
    navLeftBtn () {
      return this.leftVisible ? '200px' : '0px';
    },
    navLeftBtnClass () {
      const arr = ['nav-left-btn-arrow', 'el-icon-arrow-left'];
      this.leftVisible ? arr.push('el-icon-arrow-left') : arr.push('el-icon-arrow-right');
      return arr.join(' ');   
    }

  },
  data () {
    return {      
      menu_data: menu.data,
      resize_lock: false,
      sysPopVisible: false,
      windowLock: false,
      userinfoLoading: true,
      isCollapse: false,
      leftMenuActive: '',
    };
  },
  methods: {
    ...mapActions([
      // 'refreshExtends', //extend-field
      'refreshProduct', //product
      'refreshClassification', //classification
      'refreshBranch', //branch
      'refreshArea', //area
      'refreshCity', //city
      'closeTag', //filter-cache
    ]),
    ...mapMutations([
      'toggleLeftVisible', //index
      'setInnerHeight', //index
      'setInnerWidth', //index
      'setUser', //current-user
    ]),
    handleClose (item) {
      this.closeTag(item);
    },
    handleCommond (commond) {
      if(commond == 'login_out') {
        const url = '/api/logout';
        const success = _=>{
          this.$message({message: '登出成功', type: 'success'} );
          window.location.href = '/login';
        }

        this.$axiosGet({url, success});
      }
    },
    navToggle () {
      this.toggleLeftVisible();

      // let i = 32;
      // let n = this.leftVisible ? 160 : 0;
      // i = this.leftVisible ? -i : i;
      // animation();
      
      //滑动效果
      // function animation () {        
      //   n += i;
      //   left.css('width', n);
      //   app.css('padding-left', n);
      //   btn.css('left', n);

      //   if(n == 0) {
      //     btn.find('.nav-left-btn-arrow').removeClass('el-icon-arrow-left').addClass('el-icon-arrow-right');
      //   }else if( n== 160) {
      //     btn.find('.nav-left-btn-arrow').removeClass('el-icon-arrow-right').addClass('el-icon-arrow-left');
      //   }else {
      //     window.requestAnimationFrame(animation);
      //   }
      // }     
    }
  },
  created () {
    // this.leftMenuActive = this.path;

    const refreshWindow =  _=> {
      this.setInnerHeight(window.innerHeight);
      this.setInnerWidth(window.innerWidth);
    }

    refreshWindow();
    window.onresize = _=>{
      if( !this.windowLock ) {
        this.windowLock = true;
         
        window.setTimeout(_=>{
          refreshWindow(); 
          this.windowLock = false;
        },100)
      }
    };


    const success = _=>{
      this.userinfoLoading = false;
      
      //设置个人信息
      this.setUser(window.appCache.userinfo);
      
      //获取系统配置数据
      // this.refreshExtends(false);
      // this.$store.dispatch('refreshTags');
      
      //避免每次F5都发送请求的方法：
      //  1.每次使用相关数据的位置添加一个尝试初始化的函数
      //  2.localStorage动态关联 
      this.refreshProduct();
      this.refreshBranch();
      this.refreshClassification();
      
      // this.$store.dispatch('refreshIpr');
      
      //使用localStorage进行本地缓存
      this.refreshArea();
      this.refreshCity();
      
      // this.$store.dispatch('refreshFeeCode');
      // this.$store.dispatch('refreshEntity');
      // this.$store.dispatch('refreshGroup');
      // this.$store.dispatch('refreshFlowNodes');
      // this.$store.dispatch('refreshFileType');
      // this.$store.dispatch('refreshMail');
    };
    success();

  },
  components: { 
    AppMenuItem,
    AgencyLoad,
    AppNav,
  },
  watch: {
    //路径更改 左侧菜单自东变更active项
    path (val) {
      this.leftMenuActive = val; 
    },
    //解决菜单切换时 左侧菜单的active项为空
    menuType () {
      this.leftMenuActive = '';
      this.$nextTick(() => {
        this.leftMenuActive = this.path;
      });
    }
  }
}
</script>
<style lang="scss">
@media only screen and (max-width: 1338px){
  @import './style/common';
}
$nav_bgColor: #383838;
$nav_height: 50px;

$navL_bgColor: #324157;
$navL_width: 200px;

$container_padding: 20px;

$table_margin: 10px;

body {
  margin: 0;
  font-family: "Helvetica Neue",Helvetica,Arial,sans-serif;
}
a {
  color: #20a0ff;
}
#app {
  position: relative;
  padding: {
    top: $nav_height;
    left: $navL_width;
  };
}
nav {
  position: fixed;
  background-color: $nav_bgColor;
  top: 0;
  left: 0;
  height: $nav_height;
  line-height: $nav_height;
  width: 100%;
  color: #fff;
  padding-left: 20px;
  box-shadow: 0 1px 2px rgba(0,0,0,.5);
  z-index: 10;
}
.nav-left {
  overflow-x: hidden;
  overflow-y: auto;
  width: $navL_width;
  position: fixed;
  top: $nav_height;
  left: 0;
  background-color: $navL_bgColor;
}
.nav-left-btn {
  position: fixed;
  left: $navL_width;
  top: 50%;
  margin-top: -50px;
  background-color: #68758a;
  width: 10px;
  height: 150px;
  border-bottom-right-radius: 20px;
  border-top-right-radius: 20px;
  cursor: pointer;
  opacity: .5;
}
.nav-left-btn-arrow {
  position: absolute;
  top: 50%;
  left: -4px;
  color: #324157;
  transform: translate(0, -50%);
}
.nav-left .iconfont {
  position: relative;
  padding-right: 10px;
  top: 1px;
}
.container-menu {
  font-size: 24px;
  color: #acb1b8;
  height: 46px;
  line-height: 46px;
}
.container-menu .iconfont {
  
  opacity: .3;
  font-size: 42px;
  margin-right: 10px;
  vertical-align: middle;
  position: relative;
  top: -8px;
}
.container-nav {
  border-radius: 4px;
  background: #f3f5f6;
  padding: 8px;
  margin-bottom: 10px;
}
.container-nav .el-breadcrumb {
  font-size: 14px;
}
.container-nav .iconfont {
    font-size: 14px;
    padding-right: 5px;
}
.container-nav-screen .el-tag+.el-tag {
  margin-left: 10px;
}
.el-table {
  /*margin-bottom: 10px;*/
}

.table-header {
  margin-bottom: 10px;
  overflow: hidden;
}
.table-search {
  width: 130px;
  float: right;
  transition: all 1s;
}
.table-search-focus  {
  width: 200px;
}
.el-pagination {
/*  text-align: right;
  padding-right: 40px;*/
}
.row {
  overflow: hidden;
}
.left {
  float: left;
  width: 200px;
}
.right {
  margin-left: 220px;
}
.left .tree-search>input {
  border-radius: 0;
}

.el-select {
  width: 100%;
}
.el-input__inner {
  height: 37px;
}
.table-header-btn .el-icon-menu::before {
  font-size: 12px;
}
.el-table .table-error {
  color: #FF4949;
}
.el-table .table-warning {
 color: #F7BA2A;
}
.ql-toolbar.ql-snow {
  line-height: initial;
}
.ql-container.ql-snow {
  height: 300px;
}
.table-flag {
  display: inline-block;

  width: 10px;
  height: 10px;
  border-radius: 50%;
}
.table-flag-read {
  background-color: #ccc;
}
.table-flag-unread {
  background-color: #58B7FF;
}
.sysmesg-item {
  cursor: pointer;
  margin-bottom: 5px; 
}
.sysmesg-item:hover {
  color: #58B7FF;
}
.hjg-table .el-pagination {
  margin-top: 10px;
}
.logo_name {
  padding-left: 10px;
  font-size: 18px;
  height: 28px;
  line-height: 28px;
  /*font-weight: bold;*/
  display: inline-block;
}
.float-block:before {
  display: table;
  content: "";
}
.float-block:after {
  display: table;
  content: "";
  clear: both;
} 
/*这里放入重写element-ui样式的内容*/
#app {
  .dialog-control>.el-dialog {
    width: 600px;
    position: static;
    transform: initial;
    margin: 0 auto;
    margin-top: 80px;
  }
  .el-tree-node__expand-icon.expanded {
    -ms-transform: rotate(90deg);
    transform: rotate(90deg);
  }
  .el-tree-node__expand-icon {
    cursor: pointer;
    height: 0;
    margin-left: 12px;
    border: 8px solid transparent;
    border-right-width: 0;
    border-left-color: #97a8be;
    border-left-width: 12px;
    transition: transform .3s ease-in-out;
  }
  .el-tree-node__content>.el-checkbox, .el-tree-node__content>.el-tree-node__expand-icon {
    margin-right: 10px;
  }
  .el-tree-node__content {
    line-height: 36px;
    height: 36px;
  }
  .el-tree-node__expand-icon.is-leaf {
    border-color: transparent;
    cursor: default;
  }
  .dialog-mini>.el-dialog {
    width: 300px;
  }
  .dialog-small>.el-dialog {
    width: 600px;
  }
  .dialog-size>.el-dialog {
    width: 800px;
  }
  .dialog-medium>.el-dialog {
    width: 900px;
  }
  .el-dropdown-menu__item {
    line-height: 25px;
    font-size: 14px;
    font-family: "microsoft yahei", Helvetica, Tahoma, Arial, sans-serif;
    padding: 0 20px;
  }
  .el-dialog {
    border-radius: 6px;
    -webkit-box-shadow: 0 5px 15px rgba(0,0,0,.5);
    box-shadow: 0 5px 15px rgba(0,0,0,.5);
  }
  .el-dialog__header {
    border-bottom: 1px solid #e5e5e5;
    padding: 15px 10px 15px 20px;
  }
  .dialog-mini .el-dialog--tiny {
    width: 300px;
  }
  .el-dropdown-menu__item--divided:before {
    margin: 0 -20px;
  }
  .el-upload-dragger {
    height: auto;
  }
  textarea {
    height: 80px;
    font-family: "Helvetica Neue",Helvetica,Arial,sans-serif;
  }
  .custom-textarea textarea{
    height: auto;
  }
  .el-step.is-vertical .el-step__main {
    padding-left: 40px;
  }
  .form-information .el-form-item {
    margin-bottom: 0px;
    border-bottom: 1px solid #f2f2f2; 
  }
  .form-information .el-form-item__label {
    color: #92a3b7;
    font-size: 12px;  
  }
  .form-information .el-form-item__content {
    font-size: 12px;
    min-height: 36px;
  }
  .el-select__tags {
    overflow: auto;
  }
  .task-pending-top{
    float: right;
    margin-right: 30px;
  }
  .task-pending-top .el-badge__content.is-fixed {
    border-color: #ff4949;
    top: 14px;
    transform: translateY(-50%) translateX(100%) scale(0.8);
  }
  .el-submenu .el-menu-item {
    /*margin-left: -15px;*/
  }
  .empty-top-left .el-table__empty-text {
    top: 40px;
    left: 80px;
  }
  .input-no-radius input {
    border-radius: 0px;
  }
  .el-form-item__content {
    line-height: 36px;
    position: relative;
    font-size: 14px;
  }
  .el-breadcrumb:after, .el-breadcrumb:before, .el-button-group:after, .el-button-group:before, .el-form-item:after, .el-form-item:before, .el-form-item__content:after, .el-form-item__content:before {
    display: table;
    content: "";
  }
  .app-upload {
    .el-upload-list {
      padding: 0;
      list-style: none;
      display: block;
      margin-bottom: 40px;
    }
    .el-upload {
      display: inline-block;
      text-align: center;
      cursor: pointer;
      position: absolute;
      bottom: 4px;
      left: 0px;
    }
  }
 .el-dialog--small  .el-upload--text {
    display: inline-block;
    text-align: center;
    cursor: pointer;
    /*position: static;*/
  }
  .el-tooltip__popper {
    max-width: 500px;
  }
  .el-message-box__message p{
    margin: 0;
    line-height: 1.4;
    word-wrap:break-word;
  }
  /*icon库扩展*/
  [class^="el-icon-my"], [class*=" el-icon-my"] {
    font-family:"iconfont" !important;
    font-size:16px;
    font-style:normal;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
}

.left-tree-header {
  font-size: 14px;
  height: auto;
  line-height: 40px;
  background-color: #eef1f6;
  border: 1px solid #dfe6ec;
  border-bottom: none;
}

.form-description {
  margin-bottom: 10px;
  color: rgb(132, 146, 166);
  font-size: 14px;
}



  
</style>