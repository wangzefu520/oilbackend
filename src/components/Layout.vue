<template>
    <a-layout id="components-layout-demo-custom-trigger">
      <a-layout-sider :trigger="null" collapsible v-model="collapsed" :style="{ overflow: 'auto', height: '100vh', position: 'fixed', left: 0 }">
        <div class="logo"/>
        <a-menu
          theme="dark"
          mode="inline"
          :defaultSelectedKeys="selectMenu"
          @click="menuClickHandler"
        >
          <template v-for="menu in menus">
            <a-menu-item
              v-if="!menu.children||menu.children.length==0"
              :key="menu.id"
              :path="menu.key"
            >
              <a-icon :type="menu.iconCls"/>
              <span>{{menu.name}}</span>
            </a-menu-item>
            <a-sub-menu :key="menu.id" v-if="menu.children&&menu.children.length>0">
              <span slot="title">
                <a-icon :type="menu.iconCls"/>
                <span>{{menu.name}}</span>
              </span>
              <a-menu-item
                v-for="submenu in menu.children"
                :key="submenu.id"
                :path="submenu.key"
              >{{submenu.name}}</a-menu-item>
            </a-sub-menu>
          </template>
        </a-menu>
      </a-layout-sider>
      <a-layout :style="{ marginLeft: (collapsed?'80px':'200px'),transition: 'all 0.2s' }">
        <a-layout-header style="background: #fff; padding: 0">
          <a-icon
            class="trigger"
            :type="collapsed ? 'menu-unfold' : 'menu-fold'"
            @click="toggleCollapsed"
          />
          <div class="page-header-detail">
            <a-dropdown class="page-header-logo">
                <span class="ant-dropdown-link" href="#">
                  <a-avatar size="small" icon="user" v-if="avater.length==0"/>
                  <a-avatar :src="avater" v-if="avater.length>0"/>
                  <span class="username">{{nickName}}</span>
                </span>
                <a-menu slot="overlay" @click="userMenuClickHandler">
                  <!-- <a-menu-item key="0">
                    <a href="http://www.alipay.com/">个人设置</a>
                  </a-menu-item>
                  <a-menu-divider /> -->
                  <a-menu-item key="loginout">退出登录</a-menu-item>
                </a-menu>
            </a-dropdown>
          </div>
        </a-layout-header>
        <a-layout-content
          :style="{ margin: '24px 16px', padding: '24px', background: '#fff', minHeight: '280px' }"
        >
          <router-view></router-view>
        </a-layout-content>
      </a-layout>
    </a-layout>
</template>

<script>
import { message } from "ant-design-vue";
import { mapState, mapMutations, mapActions } from "vuex";
export default {
  name: "layout",
  data(){
    return {
    }
  },
  computed: {
    ...mapState({
      collapsed: state => state.Layout.collapsed,
      selectMenu: state => state.Layout.selectMenu,
      menus: state => state.Route.routes,
      nickName: state=> state.Login.nickName,
      avater:state=>state.Login.avater
    })
  },
  created() {
  },
  methods: {
    ...mapActions(["logoutHandle","toggleCollapsed"]),
    menuClickHandler(e) {
      let attrs = e.item.$attrs;
      let path = attrs.path;
      this.$router.push(path);
    },
    userMenuClickHandler(e){
      let key = e.key;
      if(key == 'loginout'){
        this.loginoutHandler();
      }
    },
    loginoutHandler(){
      this.logoutHandle().then(res=>{
        this.$router.replace("Login");
      });
    }
  }
};
</script>

<style>
#components-layout-demo-custom-trigger {
  min-height: 100vh;
}
#components-layout-demo-custom-trigger .trigger {
  font-size: 18px;
  line-height: 64px;
  padding: 0 24px;
  cursor: pointer;
  transition: color 0.3s;
}

#components-layout-demo-custom-trigger .trigger:hover {
  color: #1890ff;
}

#components-layout-demo-custom-trigger .logo {
  height: 32px;
  background: rgba(255, 255, 255, 0.2);
  margin: 16px;
}
#components-layout-demo-custom-trigger .page-header-detail{
  float: right;
  height: 100%;
  overflow: hidden;
}
#components-layout-demo-custom-trigger .page-header-logo{
  display: inline-block;
  height: 100%;
  padding: 0 12px;
  margin-right:20px;
  cursor: pointer;
  transition: all .3s;
}
#components-layout-demo-custom-trigger .page-header-logo .username{
  margin-left:4px;
}
#components-layout-demo-custom-trigger .page-header-logo:hover{
  background: rgba(0,0,0,.025);
}
</style>
