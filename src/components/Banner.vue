<template>
  <a-card :bordered="false" :bodyStyle="{ padding: 0 }">
    <div class="table-operations">
      <a-button @click="showBannerOperateWinHandler">添加</a-button>
    </div>
    <a-table
      rowKey="id"
      :loading="loading"
      :columns="bannerColumn"
      bordered
      :dataSource="datas"
      :pagination="bannerPagination"
      @change="changePageHandler"
    >
      <template slot="action" slot-scope="text, record">
        <a href="javascript:;" @click="changeBannerHandler(record)">修改</a>
        <a-divider type="vertical" />
        <a-popconfirm
          :title="'确定'+(record.enable?'禁用':'启用')+'banner?'"
          @confirm="changeBannerStatusHandler(record.id,record.enable)"
          okText="确认"
          cancelText="取消"
        >
          <a href="#">{{record.enable?'禁用':'启用'}}</a>
        </a-popconfirm>
        <a-divider type="vertical" />
        <a-popconfirm
          :title="'确定删除banner?'"
          @confirm="deleteBannerHandler(record.id)"
          okText="确认"
          cancelText="取消"
        >
          <a href="#">删除</a>
        </a-popconfirm>
      </template>
      <img
        slot="picRender"
        slot-scope="text, record"
        width="300"
        :alt="record.des"
        :src="record.pic"
      />
      <a-tag
        slot="status"
        slot-scope="text, record"
        :color="record.enable?'cyan':'pink'"
      >{{record.enable?'正常':'禁用'}}</a-tag>
    </a-table>
    <banner-operate-win
      :show="bannerWinVisible"
      :banner="editBanner"
      @hide="hideBannerOperateWinHandler"
    />
  </a-card>
</template>
<script>
import { mapState, mapMutations, mapActions } from "vuex";
import { message } from "ant-design-vue";
import BannerOperateWin from "./BannerOperateWin";
export default {
  name: "Banner",
  components: {
    BannerOperateWin
  },
  data() {
    return {
      bannerWinVisible: false,
      editBanner: null,
      bannerColumn: [
        {
          width: 100,
          title: "banner图",
          align: "center",
          key: "pic",
          scopedSlots: { customRender: "picRender" }
        },
        {
          width: 80,
          title: "h5跳转",
          dataIndex: "redirect",
          align: "center",
          key: "redirect"
        },
        {
          width: 80,
          title: "小程序跳转",
          dataIndex: "miniRedirect",
          align: "center",
          key: "miniRedirect"
        },
        {
          width: 80,
          title: "状态",
          align: "center",
          key: "status",
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
          width: 120,
          scopedSlots: { customRender: "action" }
        }
      ]
    };
  },
  created() {
    this.loadBanner().catch(res => {
      message.warn(err);
    });
  },
  computed: {
    ...mapState({
      loading: state => state.Banner.loading,
      datas: state => state.Banner.datas,
      currentPageNo: state => state.Banner.currentPageNo,
      pageSize: state => state.Banner.pageSize,
      total: state => state.Banner.total
    }),
    bannerPagination() {
      return {
        current: this.currentPageNo,
        pageSize: this.pageSize,
        total: this.total
      };
    }
  },
  methods: {
    ...mapActions([
      "loadBanner",
      "enableBanner",
      "disableBanner",
      "deleteBanner"
    ]),
    showBannerOperateWinHandler() {
      this.bannerWinVisible = true;
    },
    hideBannerOperateWinHandler() {
      this.bannerWinVisible = false;
      this.editBanner = null;
    },
    changeBannerHandler(banner) {
      this.bannerWinVisible = true;
      this.editBanner = banner;
    },
    changeBannerStatusHandler(id, enable) {
      if (enable) {
        this.disableBanner(id).catch(err => {
          message.warn(err);
        });
      } else {
        this.enableBanner(id).catch(err => {
          message.warn(err);
        });
      }
    },
    deleteBannerHandler(id) {
      this.deleteBanner(id).catch(err => {
        message.warn(err);
      });
    },
    changePageHandler(paging) {
      let { current, pageSize } = paging;
      this.loadBanner({ pageNo: current, pageSize: pageSize }).catch(res => {
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
