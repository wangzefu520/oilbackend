<template>
  <a-modal
    :title="'油枪'+(null==gun?'添加':'更新')"
    :visible="show"
    :closable="false"
    :maskClosable="false"
    @ok="submitGunWinHandler"
    @cancel="hideGunWinHanlder"
  >
    <a-form :form="gunForm">
      <a-form-item label="油枪名称" :label-col="{ span: 5 }" :wrapper-col="{ span: 16 }">
        <a-input
          autocomplete="off"
          v-decorator="[
              'name',
              {
                rules: [{ 
                  required: true, 
                  message: '请输入油枪名' 
                },{ 
                  min:1, 
                  message: '油枪长度需要大于1' 
                },{ 
                  max:5, 
                  message: '油枪长度需要小于5' 
                }]
              }
            ]"
        />
      </a-form-item>
      <a-form-item label="油品类型" :label-col="{ span: 5 }" :wrapper-col="{ span: 16 }">
        <a-select
          v-decorator="[
          'oilId',
          {
            initialValue: oils.length>0?oils[0].id:''
          },{rules:[{
			  required: true, 
              message: '请输选择油号' 
		  }]}]"
        >
          <a-select-option
            :value="oil.id"
            :key="oil.id"
            v-for="oil in oils"
          >{{oil.name}}{{oil.type==1?'汽':'柴'}}</a-select-option>
        </a-select>
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script>
import { mapState, mapMutations, mapActions } from "vuex";
import { message } from "ant-design-vue";
export default {
  name: "GunOperateWin",
  props: {
    gasId: {
      type: String
    },
    show: {
      type: Boolean
    },
    gun: {
      type: Object
    }
  },
  data() {
    return {
      init: false,
      gunForm: this.$form.createForm(this)
    };
  },
  updated() {
    let { init, gun } = this;
    if (!init && gun) {
      this.init = true;
      let obj = {
        name: gun.name,
        oilId: gun.oilId
      };
      this.gunForm.setFieldsValue(obj);
    }
  },
  computed: {
    ...mapState({
      oils: state => state.Oil.oils
    })
  },
  methods: {
    ...mapActions([
		'saveGun',
		'updateGun'
	]),
    submitGunWinHandler() {
      this.gunForm.validateFields((err, values) => {
        if (!err) {
          if (this.gun) {
            let obj = {
              gasId: this.gasId,
              gunId: this.gun.id,
              oilId: values.oilId,
              name: values.name
            };
            this.updateGun(obj).then(res=>{
              this.hideGunWinHanlder();
            }).catch(err=>{
              message.warn(err);
            });
          } else {
            let obj = {
              gasId: this.gasId,
              name: values.name,
              oilId: values.oilId
            };
            this.saveGun(obj).then(res=>{
              this.hideGunWinHanlder();
            }).catch(err=>{
              message.warn(err);
            });
          }
        }
      });
    },
    hideGunWinHanlder() {
      this.init = false;
      this.gunForm.resetFields();
      this.$emit("hide");
    }
  }
};
</script>
