<template>
  <a-card :bordered="false" :bodyStyle="{ padding: 0 }">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row type="flex" justify="space-around" :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="订单编号" style="height:57px;line-height:21px;">
              <a-input style="width:300px;" v-model="queryParam.no" placeholder="请输入查询订单号" />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="查询日期" style="height:57px;line-height:21px;">
              <a-range-picker
                style="width:300px;"
                v-model="queryParam.rangeTime"
                :showTime="true"
                format="YYYY-MM-DD HH:mm:ss"
              />
            </a-form-item>
          </a-col>
          <template v-if="advanced">
            <a-col :md="8" :sm="24">
              <a-form-item label="支付类型" style="height:57px;line-height:21px;">
                <a-select
                  style="width:300px;"
                  v-model="queryParam.payType"
                  placeholder="请选择查询的支付类型"
                  default-value="0"
                >
                  <a-select-option value="0">全部</a-select-option>
                  <a-select-option value="1">小程序支付</a-select-option>
                  <a-select-option value="2">公众号支付</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="油站名称" style="height:57px;line-height:21px;">
                <a-select
                  showSearch
                  v-model="queryParam.gasId"
                  placeholder="请输入油站名称"
                  :defaultActiveFirstOption="false"
                  :showArrow="true"
                  :filterOption="false"
                  notFoundContent="未查询到数据"
                  @search="gasSearchHandler"
                  style="width:300px;"
                >
                  <a-select-option v-for="gas in searchGas" :key="gas.id">{{gas.name}}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </template>

          <a-col :md="!advanced? 8:16" :sm="24">
            <span
              class="table-page-search-submitButtons"
              :style="advanced && { float: 'right', overflow: 'hidden' } || {} "
            >
              <a-button type="primary" @click="orderSearchHandler">查询</a-button>
              <a-button style="margin-left: 8px" @click="orderSearchResetHandler">重置</a-button>
              <a @click="toggleAdvanced" style="margin-left: 8px">
                {{ advanced ? '收起' : '展开' }}
                <a-icon :type="advanced ? 'up' : 'down'" />
              </a>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <div class="table-operations">
      <a-button type="primary" icon="download" @click="orderExportHandler">导出</a-button>
    </div>
    <a-table
      rowKey="id"
      :loading="loading"
      :columns="orderColumn"
      bordered
      :dataSource="datas"
      :pagination="orderPagination"
      @change="changePageHandler"
    >
      <a-tooltip slot="orderNo" slot-scope="text,record" placement="top">
        <template slot="title">
          <span>电话：{{record.phone}}</span>
          <br />
          <span>车牌：{{record.carLicence}}</span>
        </template>
        {{record.no}}
      </a-tooltip>
      <a-tooltip slot="gasInfo" slot-scope="text,record" placement="top">
        <template slot="title">
          <span>地址：{{record.gasAddr}}</span>
        </template>
        {{record.gasName}}
      </a-tooltip>
      <span slot="oilType" slot-scope="text,record">
        {{record.gunName}}
        <span style="padding-left:10px;font-size:8px;">
          <a-tag
            :color="record.oilName=='90'?'pink':record.oilName=='92'?'orange':record.oilName=='95'?'red':record.oilName=='98'?'#f50':'purple'"
          >{{record.oilName+(record.oilType==1?'汽油':'柴油')}}</a-tag>
        </span>
      </span>
      <span slot="oilPrice" slot-scope="text, record">
        {{record.price}}元
        <span style="padding-left:10px;font-size:8px;color:#c41d7f;">
          <span style="text-decoration:line-through;">{{record.marketPrice}}</span>元
        </span>
      </span>
      <span slot="oilTotal" slot-scope="text, record">
        {{record.oilNum}}升
        <span style="padding-left:10px;font-size:8px;color:#c41d7f;">
          <span style="text-decoration:line-through;">{{record.totalOilNum}}</span>升
        </span>
      </span>
      <span slot="totalPrice" slot-scope="text, record">
        {{record.amount}}元
        <span style="padding-left:10px;font-size:8px;color:#c41d7f;">
          <span style="text-decoration:line-through;">{{record.totalAmount}}</span>元
        </span>
      </span>
      <span slot="payType" slot-scope="text,record">{{record.payType==1?'小程序':'公众号'}}</span>
    </a-table>
  </a-card>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
import { message } from "ant-design-vue";
export default {
  name: "Order",
  data() {
    return {
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {
        no: "",
        rangeTime: null,
        payType: "0",
        gasId: ""
      },
      orderColumn: [
        {
          width: 100,
          title: "订单编号",
          align: "center",
          key: "no",
          scopedSlots: { customRender: "orderNo" }
        },
        {
          width: 80,
          title: "油站名称",
          align: "center",
          key: "gasInfo",
          scopedSlots: { customRender: "gasInfo" }
        },
        {
          width: 20,
          title: "油枪油号",
          align: "center",
          key: "oilType",
          scopedSlots: { customRender: "oilType" }
        },
        {
          width: 20,
          title: "单价",
          align: "center",
          key: "oilPrice",
          scopedSlots: { customRender: "oilPrice" }
        },
        {
          width: 20,
          title: "加油量",
          align: "center",
          key: "totalOilNum",
          scopedSlots: { customRender: "oilTotal" }
        },
        {
          width: 20,
          title: "总价",
          align: "center",
          key: "totalPrice",
          scopedSlots: { customRender: "totalPrice" }
        },
        {
          width: 20,
          title: "支付类型",
          align: "center",
          key: "payType",
          scopedSlots: { customRender: "payType" }
        },
        {
          width: 120,
          title: "创建时间",
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
      total: state => state.Manager.total,
      searchGas: state => state.Gas.searchGas
    }),
    orderPagination() {
      return {
        current: this.currentPageNo,
        pageSize: this.pageSize,
        total: this.total
      };
    }
  },
  created() {
    this.loadOrder().catch(err => {
      message.warn(err);
    });
  },
  methods: {
    ...mapActions(["loadOrder", "exportOrder", "loadAllGas"]),
    orderExportHandler() {
      this.exportOrder(this.queryParam);
    },
    orderSearchHandler() {
      this.loadOrder(this.queryParam).catch(err => {
        message.warn(err);
      });
    },
    orderSearchResetHandler() {
      this.queryParam = {
        no: "",
        gasId: "",
        rangeTime: null,
        payType: "0"
      };
      this.loadOrder().catch(err => {
        message.warn(err);
      });
    },
    toggleAdvanced() {
      this.advanced = !this.advanced;
    },
    gasSearchHandler(value) {
      let keyword = value;
      if (keyword && keyword.length > 2) {
        this.loadAllGas(keyword).catch(err => {
          message.warn(err);
        });
      }
    },
    changePageHandler(paging) {
      let { current, pageSize } = paging;
      let obj = this.queryParam;
      obj.pageNo = current;
      obj.pageSize = pageSize;
      this.loadOrder(obj).catch(err => {
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
