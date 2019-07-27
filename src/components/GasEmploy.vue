<template>
  <a-card class="card" :bordered="false">
    <div class="table-operations">
      <a-button @click="showGasEmployWinHandler">添加</a-button>
    </div>
    <a-table
      rowKey="id"
      :loading="loading"
      :columns="gasEmployColumn"
      bordered
      :dataSource="datas"
      :pagination="gasEmployPagination"
    >
      <a-tag
        slot="canBind"
        slot-scope="text, record"
        :color="record.canBind?'cyan':'pink'"
      >{{record.canBind?'可绑定（'+record.secretCode+'）':'已绑定'}}</a-tag>
      <a-tag
        slot="enable"
        slot-scope="text, record"
        :color="record.enable?'cyan':'pink'"
      >{{record.enable?'启用':'禁用'}}</a-tag>
      <a-tag
        slot="triggerMessage"
        slot-scope="text, record"
        :color="record.triggerMessage?'cyan':'pink'"
      >{{record.triggerMessage?'触发':'免扰'}}</a-tag>
      <template slot="action" slot-scope="text, record">
        <a href="javascript:;" :data-id="record.id" @click="showGasEmployWinHandler">修改</a>
        <a-divider type="vertical" v-if="!record.canBind"/>
        <a-popconfirm
          v-if="!record.canBind"
          :title="'确定重绑员工?'"
          @confirm="resetGasEmployBindHandler(record.id,record.enable)"
          okText="确认"
          cancelText="取消"
        >
          <a href="#">重绑</a>
        </a-popconfirm>
        <a-divider type="vertical" />
        <a-popconfirm
          :title="'确定'+(record.enable?'禁用':'启用')+'员工?'"
          @confirm="changeGasEmployStatusHandler(record.id,record.enable)"
          okText="确认"
          cancelText="取消"
        >
          <a href="#">{{record.enable?'禁用':'启用'}}</a>
        </a-popconfirm>
        <a-divider type="vertical" />
        <a-popconfirm
          :title="'确定删除员工?'"
          @confirm="deleteGasEmployHandler(record.id)"
          okText="确认"
          cancelText="取消"
        >
          <a href="#">删除</a>
        </a-popconfirm>
      </template>
    </a-table>
    <a-modal
      :title="'员工'+(currentGasEmployId?'更新':'添加')"
      :visible="gasEmployWinVisible"
      :confirmLoading="gasEmployWinLoading"
      :closable="false"
      :maskClosable="false"
      @ok="submitGasEmloyFormHandler"
      @cancel="hideGasEmployWinHandler"
    >
      <a-form :form="currentGasEmployForm">
        <a-form-item label="姓名" :label-col="{ span: 5 }" :wrapper-col="{ span: 16 }">
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
        <a-form-item label="电话" :label-col="{ span: 5 }" :wrapper-col="{ span: 16 }">
          <a-input
            autocomplete="off"
            v-decorator="[
              'phone',
              {rules: [
                { required: true, message: '请输入电话' },
                { min:11, message: '昵称长度应为11' },
                { max:11, message: '昵称长度应为11' }
                ]}
            ]"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </a-card>
</template>
<script>
import { mapState, mapMutations, mapActions } from "vuex";
import { message } from "ant-design-vue";
export default {
  name: "GasEmploy",
  props: {
    gasId: {
      type: String
    }
  },
  data() {
    return {
      currentGasId: null,
      currentGasEmployId:null,
      currentGasEmployForm:this.$form.createForm(this),
      gasEmployColumn: [
        {
          width: 60,
          title: "编号",
          dataIndex: "no",
          align: "center",
          key: "no"
        },
        {
          width: 60,
          title: "姓名",
          dataIndex: "name",
          align: "center",
          key: "name"
        },
        {
          width: 60,
          title: "电话",
          dataIndex: "phone",
          align: "center",
          key: "phone"
        },
        {
          width: 60,
          title: "绑定状态",
          dataIndex: "canBind",
          align: "center",
          key: "canBind",
          scopedSlots: { customRender: "canBind" }
        },
        {
          width: 60,
          title: "状态",
          dataIndex: "enable",
          align: "center",
          key: "enable",
          scopedSlots: { customRender: "enable" }
        },
        {
          width: 60,
          title: "触发消息",
          dataIndex: "triggerMessage",
          align: "center",
          key: "triggerMessage",
          scopedSlots: { customRender: "triggerMessage" }
        },
        {
          width: 110,
          title: "创建时间",
          dataIndex: "created",
          align: "center",
          key: "created"
        },
        {
          title: "操作",
          key: "operation",
          align: "center",
          width: 150,
          scopedSlots: { customRender: "action" }
        }
      ]
    };
  },
  created() {
    let tempGasId = this.$props.gasId;
    if (tempGasId != "save") {
      this.currentGasId = tempGasId;
      this.loadGasEmploy(tempGasId).catch(err => {
        message.warn(err);
      });
    }
  },
  computed: {
    ...mapState({
      loading: state => state.GasEmploy.loading,
      datas: state => state.GasEmploy.datas,
      currentPageNo: state => state.GasEmploy.currentPageNo,
      pageSize: state => state.GasEmploy.pageSize,
      total: state => state.GasEmploy.total,
      gasEmployWinLoading:state=>state.GasEmploy.gasEmployWinLoading,
      gasEmployWinVisible:state=>state.GasEmploy.gasEmployWinVisible
    }),
    gasEmployPagination() {
      return {
        current: this.currentPageNo,
        pageSize: this.pageSize,
        total: this.total
      };
    }
  },
  methods: {
    ...mapActions([
      "loadGasEmploy",
      "enableGasEmploy",
      "disableGasEmploy",
      "deleteGasEmploy",
      "resetGasEmployBind",
      "gasEmployWinShow",
      "gasEmployWinHide",
      "saveGasEmploy",
      "updateGasEmploy"
    ]),
    showGasEmployWinHandler(e){
      this.gasEmployWinShow();
      let dataset = e.target.dataset;
      if (dataset && dataset.id) {
        let gasEmploy = null;
        let gasEmployId = dataset.id;
        this.datas.forEach(it => {
          let id = it.id;
          if (id == gasEmployId) {
            gasEmploy = it;
          }
        });
        this.currentGasEmployId = gasEmployId;
        let obj = {
          name: gasEmploy.name,
          phone: gasEmploy.phone
        };
        setTimeout(() => {
          this.currentGasEmployForm.setFieldsValue(obj);
        }, 100);
      }
    },
    hideGasEmployWinHandler(){
      this.currentGasEmployForm.resetFields();
      this.currentGasEmployId = null;
      this.gasEmployWinHide();
    },
    submitGasEmloyFormHandler(e){
      e.preventDefault();
      this.currentGasEmployForm.validateFields((err, values) => {
        if (!err) {
          if (this.currentGasEmployId) {
            let obj = {
              gasId:this.currentGasId,
              gasEmployId:this.currentGasEmployId,
              ...values
            };
            this.updateGasEmploy(obj)
              .then(res => {
                setTimeout(() => {
                  this.hideGasEmployWinHandler();
                }, 500);
              })
              .catch(err => {
                message.warn("更新油站员工异常" + err);
              });
          } else {
            let obj = {
              gasId:this.currentGasId,
              ...values
            };
            this.saveGasEmploy(obj)
              .then(res => {
                setTimeout(() => {
                  this.hideGasEmployWinHandler();
                }, 500);
              })
              .catch(err => {
                message.warn("添加油站员工异常" + err);
              });
          }
        }
      });
    },
    resetGasEmployBindHandler(employId){
      this.resetGasEmployBind({
          gasId: this.currentGasId,
          employId: employId
        }).catch(err => {
          message.warn(err);
        });
    },
    changeGasEmployStatusHandler(employId, enable) {
      if (enable) {
        this.disableGasEmploy({
          gasId: this.currentGasId,
          employId: employId
        }).catch(err => {
          message.warn(err);
        });
      } else {
        this.enableGasEmploy({
          gasId: this.currentGasId,
          employId: employId
        }).catch(err => {
          message.warn(err);
        });
      }
    },
    deleteGasEmployHandler(employId) {
      this.deleteGasEmploy({
        gasId: this.currentGasId,
        employId: employId
      }).catch(err => {
        message.warn(err);
      });
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
