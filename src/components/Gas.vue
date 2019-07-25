<template>
  <a-card :bordered="false" :bodyStyle="{ padding: 0 }">
    <div class="table-operations">
      <a-button @click="saveGasHandler">添加</a-button>
    </div>
    <a-table
      rowKey="id"
      :loading="loading"
      :columns="bannerColumn"
      bordered
      :dataSource="datas"
      :pagination="bannerPagination"
    >
      <span slot="action" slot-scope="text, record">
        <a href="javascript:;" @click="updateGasHandler(record.id)">修改</a>
        <a-divider type="vertical" />
        <a-popconfirm
          :title="'确定'+(record.enable?'禁用':'启用')+'油站?'"
          @confirm="changeGasStatusHandler(record.id,record.enable)"
          okText="确认"
          cancelText="取消"
        >
          <a href="#">{{record.enable?'禁用':'启用'}}</a>
        </a-popconfirm>
        <a-divider type="vertical" />
        <a-popconfirm
          :title="'确定删除油站?'"
          @confirm="deleteGasHandler(record.id)"
          okText="确认"
          cancelText="取消"
        >
          <a href="#">删除</a>
        </a-popconfirm>
      </span>
      <a-tooltip slot="gasNameAddr" slot-scope="text,record" placement="top">
        <template slot="title">
          <span>{{record.address}}</span>
        </template>
        {{record.name}}
      </a-tooltip>
      <a-tag
        slot="status"
        slot-scope="text, record"
        :color="record.enable?'cyan':'pink'"
      >{{record.enable?'正常':'禁用'}}</a-tag>
    </a-table>
  </a-card>
</template>
<script>
import { mapState, mapMutations, mapActions } from "vuex";
import { message } from "ant-design-vue";
export default {
  name: "Gas",
  data() {
    return {
      bannerColumn: [
        {
          width: 120,
		  title: "油站名称",
          align: "center",
		  key: "name",
		  scopedSlots: { customRender: "gasNameAddr" }
        },
        {
          width: 80,
          title: "联系人",
          dataIndex: "username",
          align: "center",
          key: "username"
        },
        {
          width: 80,
          title: "联系电话",
          dataIndex: "phone",
          align: "center",
          key: "phone"
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
          width: 80,
          scopedSlots: { customRender: "action" }
        }
      ]
    };
  },
  created() {
    this.loadGas().catch(res => {
      message.warn(err);
    });
  },
  computed: {
    ...mapState({
      loading: state => state.Gas.loading,
      datas: state => state.Gas.datas,
      currentPageNo: state => state.Gas.currentPageNo,
      pageSize: state => state.Gas.pageSize,
      total: state => state.Gas.total
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
	...mapActions(["loadGas","enableGas","disableGas","deleteGas"]),
	saveGasHandler(){
		this.$router.push({ name: 'GasEdit', params: { id: 'save' }})
	},
	updateGasHandler(id){
		this.$router.push({ name: 'GasEdit', params: { id: id+"" }})
	},
    changeGasStatusHandler(id, enable) {
      if(enable){
        this.disableGas(id).catch(err=>{
          message.warn(err);
        });
      }else{
        this.enableGas(id).catch(err=>{
          message.warn(err);
        });
      }
    },
    deleteGasHandler(id) {
      this.deleteGas(id).catch(err=>{
        message.warn(err);
      })
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
