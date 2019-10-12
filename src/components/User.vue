<template>
  <a-card :bordered="false" :bodyStyle="{ padding: 0 }">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row type="flex" justify="space-around" :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="昵称">
              <a-input style="width:300px;" v-model="queryParams.nickName" placeholder="请输入查询昵称" />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="登陆方式">
              <a-select defaultValue="0" v-model="queryParams.authType" style="width:300px;">
                <a-select-option value="0">全部</a-select-option>
                <a-select-option value="1">微信</a-select-option>
                <a-select-option value="2">小程序</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-button type="primary" @click="searchHandler">查询</a-button>
            <a-button style="margin-left: 8px" @click="resetSearchHandler">重置</a-button>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <a-table
      rowKey="id"
      :loading="loading"
      :columns="userColumn"
      bordered
      :dataSource="datas"
      :pagination="userPagination"
      @change="changePageHandler"
    >
      <a-avatar slot="avatar" slot-scope="text,record" :src="record.avatar" />
      <a-tag
        slot="sex"
        slot-scope="text, record"
        :color="record.sex==0?'pink':'cyan'"
      >{{record.sex==0?'未知':record.sex==1?'男':'女'}}</a-tag>
      <a-tag
        slot="authType"
        slot-scope="text, record"
        color="cyan"
      >{{record.authType==1?'微信':'小程序'}}</a-tag>
    </a-table>
  </a-card>
</template>
<script>
import { mapState, mapMutations, mapActions } from "vuex";
import { message } from "ant-design-vue";
export default {
  name: "User",
  data() {
    return {
      queryParams: {
        nickName: "",
        authType: "0"
      },
      userColumn: [
        {
          width: 80,
          title: "昵称",
          dataIndex: "nickname",
          align: "center",
          key: "nickname"
        },
        {
          width: 30,
          title: "头像",
          dataIndex: "avater",
          align: "center",
          key: "avater",
          scopedSlots: { customRender: "avatar" }
        },
        {
          width: 30,
          title: "登陆类型",
          dataIndex: "authType",
          align: "center",
          key: "authType",
          scopedSlots: { customRender: "authType" }
        },
        {
          width: 100,
          title: "电话",
          dataIndex: "phone",
          align: "center",
          key: "phone"
        },
        {
          width: 100,
          title: "车牌号",
          dataIndex: "carLicense",
          align: "center",
          key: "carLicense"
        },
        {
          width: 30,
          title: "性别",
          dataIndex: "sex",
          align: "center",
          key: "sex",
          scopedSlots: { customRender: "sex" }
        },
        {
          width: 30,
          title: "省",
          dataIndex: "province",
          align: "center",
          key: "province"
        },
        {
          width: 30,
          title: "市",
          dataIndex: "city",
          align: "center",
          key: "city"
        },

        {
          width: 100,
          title: "录入时间",
          dataIndex: "created",
          align: "center",
          key: "created"
        }
      ]
    };
  },
  computed: {
    ...mapState({
      loading: state => state.Manager.loading,
      datas: state => state.Manager.datas,
      currentPageNo: state => state.Manager.currentPageNo,
      pageSize: state => state.Manager.pageSize,
      total: state => state.Manager.total
    }),
    userPagination() {
      return {
        current: this.currentPageNo,
        pageSize: this.pageSize,
        total: this.total
      };
    }
  },
  created() {
    this.loadUser().catch(res => {
      message.warn("加载用户信息失败");
    });
  },
  methods: {
    ...mapActions(["loadUser"]),
    resetSearchHandler() {
      this.queryParams = {
        nickName: "",
        authType: "0"
      };
      this.loadUser().catch(err => {
        message.warn(err);
      });
    },
    searchHandler() {
      let authType = this.queryParams.authType;
      let nickname = this.queryParams.nickName;
      if (
        parseInt(authType) > 0 ||
        (nickname && nickname.replace(/\s/g, "").length > 0)
      ) {
        this.loadUser({
          authType: authType,
          nickname: nickname
        }).catch(err => {
          message.warn(err);
        });
      } else {
        message.warn("请输入有效的查询参数");
        return;
      }
    },
    changePageHandler(paging) {
      let { current, pageSize } = paging;
      let authType = this.queryParams.authType;
      let nickname = this.queryParams.nickName;
      let obj = {
        pageNo: current,
        pageSize: pageSize
      };
      if (
        parseInt(authType) > 0 ||
        (nickname && nickname.replace(/\s/g, "").length > 0)
      ) {
        obj = {
          authType: authType,
          nickname: nickname
        };
      }
      this.loadUser(obj).catch(err => {
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
