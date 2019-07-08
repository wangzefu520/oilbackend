<template>
  <a-card :bordered="false" :bodyStyle="{ padding: 0 }">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row type="flex" justify="space-around" :gutter="{md:48}">
          <a-col :md="6">
            <a-form-item label="姓名">
              <a-input style="width: 100%" v-model="queryParam.name" placeholder="请输入查询名称"/>
            </a-form-item>
          </a-col>
          <a-col :md="6">
            <a-form-item label="电话">
              <a-input style="width: 100%" v-model="queryParam.phone" placeholder="请输入查询电话"/>
            </a-form-item>
          </a-col>
          <a-col :md="6">
            <a-form-item label="意向户型">
              <a-select style="width: 120px" v-model="queryParam.houseType" placeholder="请选择意向户型" default-value="0">
                <a-select-option v-for="type in houseTypes" :key="type.val" :value="type.val" >{{type.name}}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="6">
              <a-button type="primary" @click="searchBuyerHandler">查询</a-button>
              <a-button style="margin-left: 8px" @click="resetSearchBuyerHandler">重置</a-button>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <div class="table-operations">
      <a-button @click="showBuyerWinHandler">添加</a-button>
      <a-button>删除</a-button>
    </div>
    <a-table
      rowKey="id"
      :rowSelection="buyerSelection"
      :expandedRowKeys="buyerExpandRowKeys"
      :loading="buyerLoading"
      :columns="buyerColumn"
      bordered
      :dataSource="buyer"
      :pagination="buyerPagination"
      @change="buyerPageChangeHandler"
      @expandedRowsChange="buyerExpandRowsChange"
    >
      <span slot="action" slot-scope="text, record">
        <a href="javascript:;" :data-id="record.id" @click="updateBuyerClickHandler(record)">修改</a>
        <a-divider type="vertical"/>
        <a href="javascript:;" @click="returnVisitShowWinHandler(record)">回访</a>
        <a-divider type="vertical"/>
        <a href="javascript:;">删除</a>
      </span>
      <a-tag slot="status" slot-scope="text" :color="text==1?'cyan':'pink'">{{text==1?'正常':text==2?'已购':'放弃'}}</a-tag>
      <a-table
        slot="expandedRowRender"
        :loading="visitLoading"
        :columns="visitColumn"
        :dataSource="visit"
        :pagination="visitPagination"
        @change="visitPageChangeHandler"
      ></a-table>
    </a-table>
    <a-drawer
      :title="'购房者信息'+(updateBuyerId==-1?'添加':'更新')"
      placement="right"
      :width="720"
      :closable="false"
      @close="closeBuyerOptionWinHandler"
      :visible="showBuyerOptionWin"
      :wrapStyle="{height: 'calc(100% - 108px)',overflow: 'auto',paddingBottom: '108px'}"
    >
      <a-form :form="form" layout="vertical">
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="姓名">
              <a-input
                v-decorator="['name', {
                    rules: [{ required: true, message: '请输入姓名' }]
                  }]"
                placeholder="请输入姓名"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="电话">
              <a-input
                v-decorator="['phone', {
                    rules: [{ required: true, message: '请输入电话' }]
                  }]"
                placeholder="请输入电话"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="户型">
              <a-select
                v-decorator="['houseType', {
                  rules: [{ required: true, message: '请选择户型' }],
                  initialValue:0
                }]"
                placeholder="请选择户型"
              >
                <a-select-option
                  v-for="type in houseTypes"
                  :key="type.val"
                  :value="type.val"
                >{{type.name}}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="购房意向价">
              <a-input-number
                v-decorator="['price', {
                  rules: [{ required: true, message: '请输入购房意向价' }],
                  initialValue:0
                }]"
                style="width: 100%"
                placeholder="请输入购房意向价"
                :precision="2"
                :formatter="value => {
                    let reg = /^¥/;
                    if(reg.test(value)){
                      return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                    }else{
                      return `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                    }
                }"
                :parser="value => value.replace(/¥\s?|(,*)/g, '')"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="24">
            <a-form-item label="备注">
              <a-textarea
                v-decorator="['remark', {
                  rules: [{ message: '请输入购买备注' }]
                }]"
                :rows="4"
                placeholder="请输入购买备注"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <div
        :style="{
          position: 'absolute',
          left: 0,
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e9e9e9',
          padding: '10px 16px',
          background: '#fff',
          textAlign: 'right',
        }"
      >
        <a-button :style="{marginRight: '8px'}" @click="closeBuyerOptionWinHandler">取消</a-button>
        <a-button
          type="primary"
          @click="triggerFormSubmitHandler"
          :loading="buyerOptionWinSubmitLoading"
        >{{updateBuyerId==-1?'添加':'更新'}}</a-button>
      </div>
    </a-drawer>
    <a-modal
      title="回访"
      :visible="returnVisitWinShow"
      :closable = "false"
      :maskClosable="false"
      :confirmLoading="visitSubmitLoading"
      @ok="returnVisitSubmitHandler"
      @cancel="returnVisitHideWinHandler"
      cancelText="取消"
      okText="提交"
    >
      <a-form :form="visitForm">
        <a-form-item>
          <a-textarea
            v-decorator="['content', {
                  rules: [
                    {required: true, message: '请输入回访内容' },
                    {min: 5, message: '回访内容不能小于5个字符' },
                    {max: 255, message: '回访内容应该小于255个字符' },
                  ]
                }]"
            :rows="6"
            placeholder="请输入回访内容"
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
  name: "Buyer",
  data() {
    return {
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {
        name:'',
        phone:'',
        houseType:0
      },
      form: this.$form.createForm(this),
      visitForm:this.$form.createForm(this),
      buyerColumn: [
        {
          width: 100,
          title: "编号",
          dataIndex: "id",
          align: "center",
          key: "id"
        },
        {
          width: 100,
          title: "姓名",
          dataIndex: "name",
          align: "center",
          key: "name"
        },
        {
          width: 120,
          title: "手机",
          dataIndex: "phone",
          align: "center",
          key: "phone"
        },
        {
          title: "意向户型",
          dataIndex: "houseType",
          align: "center",
          width: 120,
          key: "houseType",
          customRender:(type)=>{
            let {houseTypes} = this;
            for(let index=0;index<houseTypes.length;index++){
              let houseType = houseTypes[index];
              if(houseType.val == type){
                return houseType.name;
              }
            }
          }
        },
        {
          title: "意向价格",
          dataIndex: "price",
          align: "center",
          width: 120,
          key: "price"
        },
        {
          title: "状态",
          dataIndex: "status",
          align: "center",
          width: 120,
          key: "status",
          scopedSlots: { customRender: 'status' }
        },
        {
          title: "备注",
          dataIndex: "remark",
          align: "center",
          key: "remark"
        },
        {
          title: "操作",
          key: "operation",
          align: "center",
          width: 200,
          scopedSlots: { customRender: "action" }
        }
      ],
      houseTypes: [
        {
          name: "不限",
          val: 0
        },
        {
          name: "一室一厅",
          val: 1
        },
        {
          name: "二室一厅",
          val: 2
        },
        {
          name: "三室一厅",
          val: 3
        },
        {
          name: "三室一厅",
          val: 4
        }
      ],
      visitColumn: [
        {
          width: 250,
          title: "回访时间",
          dataIndex: "created",
          align: "center",
          key: "created"
        },
        {
          width: 100,
          title: "回访人",
          dataIndex: "userId",
          align: "center",
          key: "userId"
        },
        {
          title: "回访内容",
          dataIndex: "content",
          align: "center",
          key: "content"
        }
      ]
    };
  },
  computed: {
    ...mapState({
      buyer: state => state.Buyer.buyer,
      buyerCount: state => state.Buyer.buyerCount,
      buyerCurrentPageNo: state => state.Buyer.buyerCurrentPageNo,
      updateBuyerId: state => state.Buyer.updateBuyerId,
      buySelectRow: state => state.Buyer.buySelectRow,
      buyerLoading: state => state.Buyer.buyerLoading,
      buyerPagination: state => state.Buyer.buyerPagination,
      buyerSelectRowKeys: state => state.Buyer.buyerSelectRowKeys,
      buyerExpandRowKeys: state => state.Buyer.buyerExpandRowKeys,
      buyerExpandRowKey: state => state.Buyer.buyerExpandRowKey,
      visitLoading: state => state.Buyer.visitLoading,
      visit: state => state.Buyer.visit,
      visitCount: state => state.Buyer.visitCount,
      visitCurrentPageNo: state => state.Buyer.visitCurrentPageNo,
      visitSubmitLoading:state=>state.Buyer.visitSubmitLoading,
      returnVisitWinShow: state => state.Buyer.returnVisitWinShow,
      selectBuyer: state => state.Buyer.selectBuyer,
      updateBuyerAction: state => state.Buyer.updateBuyerAction,
      buyerOptionWinSubmitLoading: state =>
        state.Buyer.buyerOptionWinSubmitLoading,
      showBuyerOptionWin: state => state.Buyer.showBuyerOptionWin
    }),
    buyerPagination() {
      return {
        current: this.buyerCurrentPageNo,
        pageSize: 10,
        total: this.buyerCount
      };
    },
    buyerSelection() {
      return {
        selectedRowKeys: this.buyerSelectRowKeys,
        onChange: this.buyerSelectHandler,
        hideDefaultSelections: false
      };
    },
    visitPagination() {
      return {
        current: this.visitCurrentPageNo,
        pageSize: 6,
        total: this.visitCount
      };
    }
  },
  created() {
    this.loadBuyer().catch(err => {
      message.warn(err);
    });
  },
  methods: {
    ...mapActions([
      "loadBuyer",
      "buyerSelectRows",
      "buyerExpandRows",
      "loadVisit",
      "buyerSubmitLoading",
      "showBuyerWinHandler",
      "buyerSubmitUnloading",
      "closeBuyerWinHandler",
      "buyerOptionHandler",
      "buyerOptionIdHandler",
      "buyerOptionIdResetHandler",
      "returnVisitWinShowHandler",
      "returnVisitWinHideHandler",
      "returnVisitFormSubmitUnLoadHandler",
      "returnVisitFormSubmitLoadHandler",
      "returnVisitSaveHandler"
    ]),
    buyerPageChangeHandler(pageInfo) {
      let {queryParam} = this;
      if(queryParam.name){
        pageInfo.name = queryParam.name;
      }
      if(queryParam.phone){
        pageInfo.phone = queryParam.phone;
      }
      if(queryParam.houseType>0){
        pageInfo.houseType = queryParam.houseType;
      }
      this.loadBuyer(pageInfo).catch(err => {
        message.warn(err);
      });
    },
    buyerSelectHandler(rows) {
      this.buyerSelectRows(rows);
    },
    buyerExpandRowsChange(rows) {
      let len = rows.length;
      if (len > 0) {
        this.buyerExpandRows([rows[len - 1]]);
      } else {
        this.buyerExpandRows([]);
      }
    },
    visitPageChangeHandler(pageInfo) {
      if (pageInfo) {
        pageInfo.buyerId = this.buyerExpandRowKey;
      }
      pageInfo.pageNo = pageInfo.current;
      this.loadVisit(pageInfo).catch(err => {
        message.warn(err);
      });
    },
    toggleAdvanced() {
      this.advanced = !this.advanced;
    },
    updateBuyerClickHandler(buyer) {
      this.showBuyerWinHandler();
      let id = buyer.id;
      this.buyerOptionIdHandler(id);
      setTimeout(()=> this.form.setFieldsValue(buyer),50);
    },
    triggerFormSubmitHandler() {
      this.buyerSubmitLoading();
      this.form.validateFields((err, values) => {
        if (!err) {
          let update = this.updateBuyerId > 0;
          if (update) {
            values.id = this.updateBuyerId;
          }
          this.buyerOptionHandler(values)
            .then(res => {
              if (!update) {
                this.form.resetFields();
              }
            })
            .catch(err => {
              message.warn(err);
            });
        } else {
          this.buyerSubmitUnloading();
        }
      });
    },
    closeBuyerOptionWinHandler() {
      this.buyerOptionIdResetHandler();
      this.closeBuyerWinHandler();
      this.form.resetFields();
    },
    returnVisitShowWinHandler(record) {
      this.returnVisitWinShowHandler(record.id);
    },
    returnVisitSubmitHandler() {
      this.returnVisitFormSubmitLoadHandler();
      this.visitForm.validateFields((err, values) => {
        if (!err) {
            this.returnVisitSaveHandler(values).then(res=>{
              this.visitForm.resetFields();
              this.returnVisitWinHideHandler();
            }).catch(err=>{
              message.warn(err);
              this.returnVisitFormSubmitUnLoadHandler();
            });
        } else {
          this.returnVisitFormSubmitUnLoadHandler();
        }
      });
    },
    returnVisitHideWinHandler(){
      this.visitForm.resetFields();
      this.returnVisitWinHideHandler();
    },
    searchBuyerHandler(){
      let {queryParam} =this;
      let info = {current:1};
      if(queryParam.name){
        info.name = queryParam.name;
      }
      if(queryParam.phone){
        info.phone = queryParam.phone;
      }
      if(queryParam.houseType>0){
        info.houseType = queryParam.houseType;
      }
      this.loadBuyer(info).catch(err => {
        message.warn(err);
      });
    },
    resetSearchBuyerHandler(){
        let {queryParam} = this;
        if(queryParam.name||queryParam.phone||queryParam.houseType >0){
          this.queryParam = {name:'',phone:'',houseType:0};
          this.loadBuyer();
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
