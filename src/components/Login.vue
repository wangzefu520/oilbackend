<template>
  <a-form :form="form" class="demo-ruleForm login-container" @submit="submitHandler">
    <h3 class="title">系统登录</h3>
    <a-form-item prop="account">
      <a-input
        v-decorator="[
          'username',
          {rules: [
            { required: true, message: '请输入用户名' },
            { min:5, message: '用户名长度需要大于5' },
            { max:20, message: '用户名长度需要小于20' }
          ]}
        ]"
        placeholder="账号"
      />
    </a-form-item>
    <a-form-item prop="checkPass">
      <a-input
        v-decorator="[
          'password',
          {rules: [
            { required: true, message: '请输入密码' },
            { min:5, message: '密码长度需要大于5' },
            { max:20, message: '密码长度需要小于50' }
          ]}
        ]"
        type="password"
        placeholder="密码"
      />
    </a-form-item>
    <!-- <a-checkbox v-model="remember" checked class="remember">记住密码</a-checkbox> -->
    <a-form-item style="width:100%;">
      <a-button type="primary" style="width:100%;" html-type="submit" :loading="loginLoading">登录</a-button>
      <!--<el-button @click.native.prevent="handleReset2">重置</el-button>-->
    </a-form-item>
  </a-form>
</template>

<script>
import { message } from "ant-design-vue";
import { mapState, mapMutations, mapActions } from "vuex";
export default {
  data() {
    return {
      remember: true
    };
  },
  beforeCreate() {
    this.form = this.$form.createForm(this);
  },
  computed: {
    ...mapState({
      loginLoading: state => state.Login.loginLoading
    })
  },
  methods: {
    ...mapActions(["loginHandle","loadMenus"]),
    submitHandler(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
            values.remember = this.remember;
            this.loginHandle(values).then(res=>{
              let token = res;
              this.loadMenus(this.$router).then(path=>{
                this.$router.replace({ path: '/backend/'+path });
              });
            }).catch(err=>{
              message.error(err);
            });
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.login-container {
  /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
  -webkit-border-radius: 5px;
  border-radius: 5px;
  -moz-border-radius: 5px;
  box-sizing: content-box;
  background-clip: padding-box;
  margin: 180px auto;
  width: 350px;
  padding: 35px 35px 15px 35px;
  background: #fff;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;
  .title {
    font-size:1.5em;
    margin: 0px auto 40px auto;
    text-align: center;
    font-weight: bold;
    color: #505458;
  }
  .remember {
    margin: 0px 0px 35px 0px;
  }
}
</style>