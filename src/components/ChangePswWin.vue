<template>
  <a-modal
    title="密码修改"
    :visible="show"
    :closable="false"
    :maskClosable="false"
    @ok="submitChangePswWinHandler"
    @cancel="hideChangePswWinHanlder"
  >
    <a-form :form="psdForm">
      <a-form-item label="用户名" :label-col="{ span: 5 }" :wrapper-col="{ span: 16 }">
        <a-input
          autocomplete="off"
          readonly="readonly"
          v-decorator="[
              'name',
              {
                initialValue:username
              }
            ]"
        />
      </a-form-item>
      <a-form-item label="原始密码" :label-col="{ span: 5 }" :wrapper-col="{ span: 16 }">
        <a-input
          autocomplete="off"
          type="password"
          v-decorator="[
              'prePassword',
              {
                rules: [{ 
                  required: true, 
                  message: '请输入原始密码' 
                },{ 
                  min:5, 
                  message: '原始密码长度需要大于6' 
                },{ 
                  max:20, 
                  message: '原始密码长度需要小于20' 
                }]
              }
            ]"
        />
      </a-form-item>
      <a-form-item label="新密码" :label-col="{ span: 5 }" :wrapper-col="{ span: 16 }">
        <a-input
          autocomplete="off"
          type="password"
          v-decorator="[
              'password',
              {
                rules: [{ 
                  required: true, 
                  message: '请输入新密码' 
                },{ 
                  min:5, 
                  message: '新密码长度需要大于5' 
                },{ 
                  max:20, 
                  message: '新密码长度需要小于20' 
                },{
                  validator: validateToNextPassword
                }]
              }
            ]"
        />
      </a-form-item>
      <a-form-item label="确认密码" :label-col="{ span: 5 }" :wrapper-col="{ span: 16 }">
        <a-input
          autocomplete="off"
          type="password"
          v-decorator="[
              'confirmPassword',
              {
                rules: [{ 
                  required: true, 
                  message: '请输入确认密码' 
                },, {
                  validator: compareToPassword,
                }]
              }
            ]"
          @blur="handleConfirmBlur"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script>
import { mapState, mapMutations, mapActions } from "vuex";
import { message } from "ant-design-vue";
export default {
  name: "ChangePswWin",
  props: {
    show: {
      type: Boolean
    }
  },
  data() {
    return {
      confirmDirty: false,
      psdForm: this.$form.createForm(this)
    };
  },
  computed: {
    ...mapState({
      username: state => state.Login.username
    })
  },
  methods: {
    ...mapActions(["changePsw"]),
    handleConfirmBlur(e) {
      const value = e.target.value;
      this.confirmDirty = this.confirmDirty || !!value;
    },
    validateToNextPassword(rule, value, callback) {
      let form = this.psdForm;
      if (value && this.confirmDirty) {
        form.validateFields(["confirmPassword"], { force: true });
      }
      callback();
    },
    compareToPassword(rule, value, callback) {
      const form = this.psdForm;
      if (value && value !== form.getFieldValue("password")) {
        callback("两次输入的密码不一致");
      } else {
        callback();
      }
    },
    submitChangePswWinHandler() {
      this.psdForm.validateFields((err, values) => {
        if (!err) {
          let password = values.password;
          let obj = {
            username: values.name,
            password: values.prePassword,
            newPassword: password
          };
          this.changePsw(obj)
            .then(res => {
              message.success("修改密码成功，新密码为：" + password);
              this.hideChangePswWinHanlder();
            })
            .catch(err => {
              message.warning(err);
            });
        }
      });
    },
    hideChangePswWinHanlder() {
      this.psdForm.resetFields();
      this.$emit("hide");
    }
  }
};
</script>
