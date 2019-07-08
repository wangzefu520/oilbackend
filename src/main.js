// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'

Vue.config.productionTip = false

Vue.use(Antd)
router.beforeEach((to, from, next) => {
  if (to.name == 'Login') {
    next();
    return;
  }
  let initRoute = store.state.Route.initRoute;
  let accessToken = sessionStorage.getItem('accessToken');
  if (initRoute) {
    if (accessToken&&accessToken!='undefined') {
      next();
    } else {
      next({ path: '/' });
    }
  } else {
    if (accessToken&&accessToken!='undefined') {
      store.commit('LOADLOGININFO');
      store.dispatch('loadMenus', router).then(res => {
        store.commit('CHANGEROUTEINIT');
        next({ path: '/backend/' + res });
      }).catch(err => {
        console.log("加载路由失败", err);
      });
    } else {
      next({ path: '/' });
    }

  }
});

new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
