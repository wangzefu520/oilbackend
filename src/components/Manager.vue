<template>
  <a-card :bordered="false" :bodyStyle="{ padding: 0 }">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row type="flex" justify="space-around" :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="用户名">
              <a-input style="width:300px;" v-model="queryParams.userName" placeholder="请输入查询用户名" />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="昵称">
              <a-input style="width:300px;" v-model="queryParams.nickName" placeholder="请输入查询昵称" />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-button type="primary" @click="searchHandler">查询</a-button>
            <a-button style="margin-left: 8px" @click="resetSearchHandler">重置</a-button>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <div class="table-operations">
      <a-button @click="showManagerWinHandler">添加</a-button>
    </div>
    <a-table
      rowKey="id"
      :loading="loading"
      :columns="managerColumn"
      bordered
      :dataSource="datas"
      :pagination="managerPagination"
    >
      <!-- @click="updateBuyerClickHandler(record)" -->
      <span slot="action" slot-scope="text, record">
        <a-popconfirm
          title="确定要重置密码?"
          @confirm="resetPasswordConfirmHandler(record.id)"
          okText="确认"
          cancelText="取消"
        >
          <a href="#">密码重置</a>
        </a-popconfirm>
        <template v-if="record.username!='admin'">
          <a-divider type="vertical" />
          <a href="javascript:;" :data-id="record.id" @click="showManagerWinHandler">修改</a>
          <a-divider type="vertical" />
          <a-popconfirm
            :title="'确定'+(record.enable?'禁用':'启用')+'用户?'"
            @confirm="changeManagerStateHandler(record.id,record.enable)"
            okText="确认"
            cancelText="取消"
          >
            <a href="#">{{record.enable?'禁用':'启用'}}</a>
          </a-popconfirm>
          <a-divider type="vertical" />
          <a-popconfirm
            :title="'确定删除管理员用户?'"
            @confirm="deleteManagerHandler(record.id)"
            okText="确认"
            cancelText="取消"
          >
            <a href="#">删除</a>
          </a-popconfirm>
        </template>
      </span>
      <a-tag
        slot="status"
        slot-scope="text, record"
        :color="record.enable?'cyan':'pink'"
      >{{record.enable?'正常':'禁用'}}</a-tag>
      <a-tag
        slot="role"
        slot-scope="text, record"
        color="cyan"
      >{{record.roleType == 1?'管理员':'站点管理员'}}</a-tag>
    </a-table>
    <a-modal
      :title="'管理员'+(currentManagerId?'更新':'添加')"
      :visible="managerWinVisible"
      :confirmLoading="modelLoading"
      :closable="false"
      :maskClosable="false"
      @ok="submitManagerFormHandler"
      @cancel="hideManagerWinHandler"
    >
      <a-form :form="managerForm">
        <a-form-item label="用户名" :label-col="{ span: 5 }" :wrapper-col="{ span: 16 }">
          <a-input
            autocomplete="off"
            :read-only="currentManagerId?true:false"
            v-decorator="[
              'username',
              {
                rules: [{ 
                  required: true, 
                  message: '请输入用户名' 
                },{ 
                  min:5, 
                  message: '用户名长度需要大于5' 
                },{ 
                  max:20, 
                  message: '用户名长度需要小于20' 
                }]
              }
            ]"
          />
        </a-form-item>
        <a-form-item label="昵称" :label-col="{ span: 5 }" :wrapper-col="{ span: 16 }">
          <a-input
            autocomplete="off"
            v-decorator="[
              'nickname',
              {rules: [
                { required: true, message: '请输入昵称' },
                { min:2, message: '昵称长度需要大于2' },
                { max:20, message: '昵称长度需要小于20' }
                ]}
            ]"
          />
        </a-form-item>
        <a-form-item
          v-if="currentManagerId==null"
          label="密码"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 16 }"
        >
          <a-input
            autocomplete="off"
            v-decorator="[
              'password',
              {rules: [
                { required: true, message: '请输入密码' },
                { min:5, message: '密码长度需要大于5' },
                { max:20, message: '密码长度需要小于20' }
                ]}
            ]"
          />
        </a-form-item>
        <a-form-item label="角色" :label-col="{ span: 5 }" :wrapper-col="{ span: 16 }">
          <a-select
            v-decorator="[
              'role',
              {
                initialValue: '2',
                rules: [{ 
                  required: true, 
                  message: '请选择用户角色'
                }]
              }
            ]"
          >
            <a-select-option value="1">管理员</a-select-option>
            <a-select-option value="2">站点管理员</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
  </a-card>
</template>
<script>
import { mapState, mapMutations, mapActions } from "vuex";
import { message } from "ant-design-vue";
export default {
  name: "Manager",
  data() {
    return {
      managerForm: this.$form.createForm(this),
      currentManagerId: null,
      queryParams: {
        userName: "",
        nickName: ""
      },
      managerColumn: [
        {
          width: 120,
          title: "用户名",
          dataIndex: "username",
          align: "center",
          key: "username"
        },
        {
          width: 120,
          title: "昵称",
          dataIndex: "nickName",
          align: "center",
          key: "nickName"
        },
        {
          width: 100,
          title: "角色",
          align: "center",
          key: "roleType",
          scopedSlots: { customRender: "role" }
        },
        {
          width: 100,
          title: "状态",
          dataIndex: "enable",
          align: "center",
          key: "enable",
          scopedSlots: { customRender: "status" }
        },
        {
          width: 120,
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
  computed: {
    ...mapState({
      loading: state => state.Manager.loading,
      modelLoading: state => state.Manager.modelLoading,
      managerWinVisible: state => state.Manager.managerWinVisible,
      datas: state => state.Manager.datas,
      currentPageNo: state => state.Manager.currentPageNo,
      pageSize: state => state.Manager.pageSize,
      total: state => state.Manager.total
    }),
    managerPagination() {
      return {
        current: this.currentPageNo,
        pageSize: this.pageSize,
        total: this.total
      };
    }
  },
  created() {
    this.loadManager().catch(err => {
      message.warn(err);
    });
  },
  methods: {
    ...mapActions([
      "loadManager",
      "resetPwd",
      "enableManager",
      "disableManager",
      "deleteManager",
      "managerWinShow",
      "managerWinHide",
      "saveManager",
      "updateManager"
    ]),
    showManagerWinHandler(e) {
      this.managerWinShow();
      let dataset = e.target.dataset;
      if (dataset && dataset.id) {
        let mamager = null;
        let managerId = dataset.id;
        this.datas.forEach(it => {
          let id = it.id;
          if (id == managerId) {
            mamager = it;
          }
        });
        this.currentManagerId = managerId;
        let obj = {
          username: mamager.username,
          nickname: mamager.nickName,
          role: "2"
        };
        setTimeout(() => {
          this.managerForm.setFieldsValue(obj);
        }, 100);
      }
    },
    hideManagerWinHandler() {
      this.managerForm.resetFields();
      this.currentManagerId = null;
      this.managerWinHide();
    },
    submitManagerFormHandler(e) {
      e.preventDefault();
      this.managerForm.validateFields((err, values) => {
        if (!err) {
          if (this.currentManagerId) {
            this.updateManager({
              id: this.currentManagerId,
              nickname: values.nickname,
              roleType: values.role
            })
              .then(res => {
                setTimeout(() => {
                  this.managerWinHide();
                }, 500);
              })
              .catch(err => {
                message.warn("更新管理员异常" + err);
              });
          } else {
            this.saveManager(values)
              .then(res => {
                setTimeout(() => {
                  this.managerWinHide();
                }, 500);
              })
              .catch(err => {
                message.warn("添加管理员异常" + err);
              });
          }
        }
      });
    },
    resetSearchHandler() {
      this.queryParams = {
        userName: "",
        nickName: ""
      };
      this.loadManager().catch(err => {
        message.warn(err);
      });
    },
    searchHandler() {
      let username = this.queryParams.userName;
      let nickname = this.queryParams.nickName;
      if (
        (username && username.replace(/\s/g, "").length > 0) ||
        (nickname && nickname.replace(/\s/g, "").length > 0)
      ) {
        this.loadManager({
          username: username,
          nickname: nickname
        }).catch(err => {
          message.warn(err);
        });
      } else {
        message.warn("请输入有效的查询参数");
        return;
      }
    },
    resetPasswordConfirmHandler(id) {
      this.resetPwd(id)
        .then(res => {
          message.success("重置密码成功,默认密码为111111");
        })
        .catch(err => {
          message.error("重置密码失败");
        });
    },
    changeManagerStateHandler(id, enable) {
      if (enable) {
        this.disableManager(id)
          .then(res => {
            message.success("禁用用户成功");
          })
          .catch(err => {
            message.error("禁用用户失败");
          });
      } else {
        this.enableManager(id)
          .then(res => {
            message.success("启用用户成功");
          })
          .catch(err => {
            message.error("启用用户失败");
          });
      }
    },
    deleteManagerHandler(id) {
      this.deleteManager(id)
        .then(res => {
          message.success("删除用户成功");
        })
        .catch(err => {
          message.error("删除用户失败");
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
