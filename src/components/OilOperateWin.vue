<template>
  <a-modal
    :title="'油品'+(null==oil?'添加':'更新')"
    :visible="show"
    :closable="false"
    :maskClosable="false"
    @ok="submitOilWinHandler"
    @cancel="hideOilWinHanlder"
  >
    <a-form :form="oilForm">
      <a-form-item label="油号名称" :label-col="{ span: 5 }" :wrapper-col="{ span: 16 }">
        <a-input
          autocomplete="off"
          v-decorator="[
              'name',
              {
                rules: [{ 
                  required: true, 
                  message: '请输入姓名' 
                },{ 
                  min:2, 
                  message: '用户名长度需要大于2' 
                },{ 
                  max:10, 
                  message: '用户名长度需要小于10' 
                }]
              }
            ]"
        />
      </a-form-item>
      <a-form-item label="油品价格" :label-col="{ span: 5 }" :wrapper-col="{ span: 16 }">
        <a-input-number
          v-decorator="['marketPrice', { initialValue: 1 }]"
          :min="0"
          :precision="2"
          :formatter="value => `¥${value}`"
        />
      </a-form-item>
      <a-form-item label="油品类型" :label-col="{ span: 5 }" :wrapper-col="{ span: 16 }">
        <a-select
          v-decorator="[
          'type',
          {
            initialValue:'1'
          }]"
        >
          <a-select-option value="1">汽油</a-select-option>
          <a-select-option value="2">柴油</a-select-option>
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
    oil: {
      type: Object
    }
  },
  data() {
    return {
      init: false,
      oilForm: this.$form.createForm(this)
    };
  },
  updated() {
    let { init, oil } = this;
    if (!init && oil) {
      this.init = true;
      let obj = {
          marketPrice:oil.marketPrice,
          name:oil.name,
          type: oil.type+''
        };
      this.oilForm.setFieldsValue(obj);
    }
  },
  computed: {
    ...mapState({
      oils: state => state.Oil.oils
    })
  },
  methods: {
    ...mapActions([
		"saveOil",
      "updateOil"]),
    submitOilWinHandler() {
      this.oilForm.validateFields((err, values) => {
        if(!err){
          if(this.oil){
            let obj = {
              gasId:this.gasId,
              oilId:this.oil.id,
              name:values.name,
              marketPrice:values.marketPrice,
              type:values.type
            };
            this.updateOil(obj).then(res=>{
              this.hideOilWinHanlder();
            }).catch(err=>{
              message.warn(err);
            });
          }else{
            let obj = {
              gasId:this.gasId,
              name:values.name,
              marketPrice:values.marketPrice,
              type:values.type
            };
            this.saveOil(obj).then(res=>{
              this.hideOilWinHanlder();
            }).catch(err=>{
              message.warn(err);
            });
          }
        }
      });
    },
    hideOilWinHanlder() {
      this.init = false;
      this.oilForm.resetFields();
      this.$emit("hide");
    }
  }
};
</script>
