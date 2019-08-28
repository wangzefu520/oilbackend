<template>
  <a-card :bordered="false" :bodyStyle="{ padding: 0 }">
    <a-form :form="configForm">
      <a-form-item label="每升节省" :label-col="{ span: 5 }" :wrapper-col="{ span: 16 }">
        <a-input-number
          autocomplete="off"
          v-model="config.number"
          :formatter="value => `${value}${msg}`"
          :parser="value => value.replace(msg, '')"
          :precision="2"
          :step="0.01"
          :max="1.5"
        />
      </a-form-item>
      <a-form-item :label-col="{ span: 5 }" :wrapper-col="{ span: 16 }" style="text-align:center;">
        <a-button type="primary" :loading="btnLoading" @click="submitHandler">提交</a-button>
      </a-form-item>
    </a-form>
  </a-card>
</template>
<script>
import { mapState, mapMutations, mapActions } from "vuex";
import { message } from "ant-design-vue";
export default {
  name: "Config",
  data() {
    return {
      configForm: this.$form.createForm(this),
      btnLoading:false,
      preConfig:{
      },
      config: {
        type: "1",
        number: 0
      },
      msg: "元"
    };
  },
  created() {
    this.loadConfig()
      .then(arr => {
        let obj = {};
        arr.forEach(it => {
          if (it.key == "thrift_num") {
            obj.number = it.val;
          }
        });
        this.config.number = obj.number;
        this.preConfig.preNumber=obj.number;
      })
      .catch(err => {
        message.warn(err);
      });
  },
  watch: {
    "config.type"(val) {
      this.msg = val == 1 ? "分" : "%";
    }
  },
  methods: {
    ...mapActions(["loadConfig","updateConfig"]),
    submitHandler(){
      this.btnLoading=true;
      let {preNumber} =this.preConfig;
      let {number} = this.config;
      if(preNumber == number){
        message.success("操作成功");
        this.btnLoading=false;
      }else{
        let arr = [{key:'thrift_num',val:number}]
        this.updateConfig(arr).then(res=>{
            message.success("操作成功");
            this.btnLoading=false;
            this.preConfig.preNumber=number;
        }).catch(err=>{
          message.warn("操作失败"+err);
          this.btnLoading=false;
        })
      }
    }
  }
};
</script>
<style scoped>
.table-operations {
  padding-bottom: 8px;
}
.table-page-search-wrapper {
  padding-bottom: 8px;
}
</style>
