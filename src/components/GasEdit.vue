<template>
  <div>
    <a-card class="card" title="油站信息" :bordered="false">
      <a-form :form="gasForm" class="form">
        <a-row class="form-row" :gutter="16">
          <a-col :lg="6" :md="12" :sm="24">
            <a-form-item label="油站名">
              <a-input
                placeholder="请输入油站名称"
                v-decorator="[
              'name',
              {
                rules: [{ required: true, message: '请输入油站名称', whitespace: true}]}
            ]"
              />
            </a-form-item>
          </a-col>
          <a-col :xl="{span: 7, offset: 1}" :lg="{span: 8}" :md="{span: 12}" :sm="24">
            <a-form-item label="联系人">
              <a-input
                placeholder="请输入联系人"
                v-decorator="[
              'username',
              {
                rules: [{ required: true, message: '请输入联系人', whitespace: true}]}
            ]"
              />
            </a-form-item>
          </a-col>
          <a-col :xl="{span: 9, offset: 1}" :lg="{span: 10}" :md="{span: 24}" :sm="24">
            <a-form-item label="联系电话">
              <a-input
                placeholder="请输入联系电话"
                v-decorator="[
              'phone',
              {
                rules: [{ required: true, message: '请输入联系电话', whitespace: true}]}
            ]"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row class="form-row" :gutter="16">
          <a-col :lg="14" :md="12" :sm="24">
            <a-form-item label="油站地址">
              <a-input
                placeholder="请输入油站地址"
                v-decorator="[
              'address',
              {
                rules: [{ required: true, message: '请输入油站地址', whitespace: true}]}
            ]"
              >
                <a-icon slot="addonAfter" type="environment" @click="showMapWinHandler" />
              </a-input>
            </a-form-item>
          </a-col>
          <a-col :xl="{span: 9, offset: 1}" :lg="{span: 10}" :md="{span: 24}" :sm="24">
            <a-form-item label="经纬度">
              <a-input
                placeholder="请输入经纬度"
                v-decorator="[
              'latLng',
              {
                rules: [{ required: true, message: '请输入经纬度', whitespace: true}]}
            ]"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row v-if="gasId != 'save'">
          <a-col :span="24">
            <h4 style="margin-bottom: 8px">油号:</h4>
            <div class="blockList">
              <div
                :class="'blockdiv '+ (oil.enable?'':'disable')"
                @click="showUpdateOilWinHanlder(oil)"
                v-for="oil in oils"
                :key="oil.id"
              >
                <div class="closebtn" @click.stop="deleteOilHandler(oil)">
                  <a-icon type="close" />
                </div>
                <div class="statusbtn" @click.stop="changeOilStatuHandler(oil)">
                  <a-icon :type="oil.enable?'unlock':'lock'" />
                </div>
                <div class="oilType">{{oil.type==1?'汽':'柴'}}</div>
                <div class="titlediv">{{oil.name}}</div>
                <div class="pricediv">¥{{oil.marketPrice}}</div>
              </div>
              <div class="blockdiv">
                <div class="optionbtn" @click="showAddOilWinHandler">
                  <a-icon type="plus" />
                </div>
              </div>
            </div>
          </a-col>
        </a-row>
        <a-row v-if="gasId != 'save'">
          <a-col :span="24">
            <h4 style="margin-bottom: 8px">油枪:</h4>
            <div class="blockList">
              <div
                :class="'blockdiv '+ (gun.enable?'':'disable')"
                v-for="gun in guns"
                :key="gun.id"
                @click="showUpdateGunWinHanlder(gun)"
              >
                <div class="closebtn" @click.stop="deleteGunHandler(gun)">
                  <a-icon type="close" />
                </div>
                <div class="statusbtn" @click.stop="changeGunStatuHandler(gun)">
                  <a-icon :type="gun.enable?'unlock':'lock'" />
                </div>
                <div class="titlediv">{{gun.name}}</div>
                <div class="pricediv">{{gun.oilName}}</div>
              </div>
              <div class="blockdiv">
                <div class="optionbtn" @click.stop="showAddGunWinHandler">
                  <a-icon type="plus" />
                </div>
              </div>
            </div>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24" :style="{ textAlign: 'right' }">
            <a-button type="primary" @click="submitGasFormHandler">提交</a-button>
            <a-button :style="{ marginLeft: '8px' }" @click="resetGasFormHandler">重置</a-button>
          </a-col>
        </a-row>
      </a-form>
    </a-card>
    <gas-employ v-if="gasId != 'save'" :gasId="gasId" />
    <a-modal
      title="油站地址选择"
      :width="800"
      :visible="mapWinVisible"
      :closable="false"
      :maskClosable="false"
      @ok="submitMapWinHandler"
      @cancel="hideMapWinHanlder"
    >
      <div style="overflow:hidden;">
        <div class="mapToolBar">
          <a-form :form="searchForm" layout="inline">
            <a-form-item label="地址">
              <a-auto-complete
                :dropdownMatchSelectWidth="false"
                :dropdownStyle="{width: '300px'}"
                :value="searchObj.address"
                style="width: 300px;"
                placeholder="请输入油站地址"
                optionLabelProp="value"
                @search="autoCompleteChangeHandler"
                @select="autoCompleteSelectHandler"
              >
                <template slot="dataSource">
                  <a-select-option v-for="item in searchList" :key="item.id" :value="item.address">
                    {{item.name}}
                    <br />
                    {{item.address}}
                    <br />
                    (纬度：{{item.lat}} 经度{{item.lng}})
                  </a-select-option>
                </template>
                <a-input>
                  <a-icon
                    slot="suffix"
                    type="search"
                    class="certain-category-icon"
                    @click="autoCompleteSearchHandler"
                  />
                </a-input>
              </a-auto-complete>
            </a-form-item>
            <a-form-item label="经纬度">
              <a-input autocomplete="off" style="width: 300px" :value="searchObj.latLng" />
            </a-form-item>
          </a-form>
        </div>
        <div class="mapContainer" id="mapContainer"></div>
      </div>
    </a-modal>
    <oil-operate-win :gasId="gasId" :oil="oil" :show="oilWinVisible" @hide="hideOilWinHanlder" />
    <gun-operate-win :gasId="gasId" :gun="gun" :show="gunWinVisible" @hide="hideGunWinHanlder" />
  </div>
</template>
<script>
import GasEmploy from "./GasEmploy";
import OilOperateWin from "./OilOperateWin";
import GunOperateWin from "./GunOperateWin";
import { mapState, mapMutations, mapActions } from "vuex";
import { message } from "ant-design-vue";
const key = "SPNBZ-KSLKX-WKL4K-7OXYC-PNQGF-4WFIB";
export default {
  name: "GasEdit",
  components: {
    GasEmploy,
    OilOperateWin,
    GunOperateWin
  },
  data() {
    return {
      contentEl: null,
      gasId: null,
      gas: null,
      oil: null,
      gun: null,
      gasForm: this.$form.createForm(this),
      oilWinVisible: false,
      gunWinVisible: false,
      mapWinVisible: false,
      qqmap: null,
      mapSearch: null,
      isSearching: false,
      searchForm: this.$form.createForm(this),
      searchObj: {
        address: null,
        latLng: null
      },
      searchValue: null,
      searchList: []
    };
  },
  created() {
    let tempGasId = this.$route.params.id;
    this.gasId = tempGasId;
    if (tempGasId != "save") {
      this.loadSingleGas(tempGasId)
        .then(() => {
          let obj = {
            name: this.editGas.name,
            username: this.editGas.username,
            phone: this.editGas.phone,
            address: this.editGas.address,
            latLng: this.editGas.latitude + "," + this.editGas.longitude
          };
          this.gasForm.setFieldsValue(obj);
          this.loadAllOil(tempGasId).catch(err => {
            message.warn(err);
          });
          this.loadAllGun(tempGasId).catch(err => {
            message.warn(err);
          });
        })
        .catch(err => {
          message.warn(err);
        });
    }else{
      this.clearOil();
      this.clearGuns();
    }
  },
  mounted() {
    this.contentEl = document.querySelector(
      "#components-layout-demo-custom-trigger .main-container"
    );
    this.contentEl.classList.add("main-container-gasedit");
    if (typeof qq != "object") {
      this.loadQQMapLib();
    }
    window.onMapFileLoad = function() {
      console.log("qqmap加载完成");
    };
  },
  computed: {
    ...mapState({
      editGas: state => state.Gas.editGas,
      oils: state => state.Oil.oils,
      guns: state => state.OilGun.guns
    })
  },
  methods: {
    ...mapActions([
      "loadSingleGas",
      "clearOil",
      "clearGuns",
      "saveGas",
      "updateGas",
      "loadAllOil",
      "deleteOil",
      "enableOil",
      "disableOil",
      "loadAllGun",
      "enableGun",
      "disableGun"
    ]),
    loadQQMapLib() {
      let script = document.createElement("script");
      //设置标签的type属性
      script.type = "text/javascript";
      //设置标签的链接地址
      script.src =
        "https://map.qq.com/api/js?v=2.exp&key=" +
        key +
        "&callback=onMapFileLoad";
      //添加标签到dom
      document.body.appendChild(script);
    },
    createMap() {
      let that = this;
      this.qqmap = new qq.maps.Map(document.getElementById("mapContainer"), {
        center: new qq.maps.LatLng(39.916527, 116.397128), // 地图的中心地理坐标。
        zoom: 12 // 地图的中心地理坐标。
      });
      let localQQMap = this.qqmap;
      if (this.gasId == "save") {
        let citylocation = new qq.maps.CityService({
          complete: function(result) {
            localQQMap.setCenter(result.detail.latLng);
          }
        });
        //调用searchLocalCity();方法    根据用户IP查询城市信息。
        citylocation.searchLocalCity();
      }
      let localThis = this;
      let searchService = new qq.maps.SearchService({
        complete: function(results) {
          if (results.type === "CITY_LIST") {
            searchService.setLocation(results.detail.cities[0].cityName);
            searchService.search(localThis.searchValue);
            return;
          }
          localThis.searchList = [];
          let pois = results.detail.pois;
          let map = {};
          for (let i = 0, l = pois.length; i < l; i++) {
            let poi = pois[i];
            let latLng = poi.latLng;
            let id = poi.id;
            if (!map[id] && id) {
              localThis.searchList.push({
                id: poi.id,
                name: poi.name,
                address: poi.address,
                lat: latLng.lat,
                lng: latLng.lng
              });
              map[id] = 1;
            }
          }
        }
      });
      this.mapSearch = searchService;
      if (this.gasId != "save") {
        this.searchValue = this.editGas.address;
        // this.mapSearch.search(this.editGas.address);
        this.searchObj = {
          address: this.editGas.address,
          latLng: this.editGas.latitude + "," + this.editGas.longitude
        };
        let point = new qq.maps.LatLng(
          this.editGas.latitude,
          this.editGas.longitude
        );
        let marker = new qq.maps.Marker({
          map: this.qqmap,
          position: point
        });
        localQQMap.setCenter(point);
      }
    },
    showMapWinHandler() {
      this.mapWinVisible = true;
      setTimeout(() => {
        this.createMap();
      }, 500);
    },
    hideMapWinHanlder() {
      this.mapWinVisible = false;
      this.searchForm.resetFields();
      this.searchList = [];
      this.searchValue = null;
      this.searchObj = {
        address: null,
        latLng: null
      };
    },
    submitMapWinHandler() {
      let tempGasId = this.$route.params.id;
      let latLng = this.searchObj.latLng;
      let arr = latLng.split(",");
      if(tempGasId != "save"){
        let obj = {
          name: this.editGas.name,
          username: this.editGas.username,
          phone: this.editGas.phone,
          address: this.searchObj.address,
          latLng: arr[0] + "," + arr[1]
        };
        this.gasForm.setFieldsValue(obj);
      }else{
        let obj = {
          address: this.searchObj.address,
          latLng: arr[0] + "," + arr[1]
        }
        this.gasForm.setFieldsValue(obj);
      }
      this.mapWinVisible = false;
    },
    autoCompleteChangeHandler(value) {
      if (value && value.length > 2) {
        this.searchValue = value;
      }
      this.searchObj.address = value;
    },
    autoCompleteSearchHandler() {
      this.mapSearch.search(this.searchValue);
    },
    autoCompleteSelectHandler(value, e) {
      let key = e.key;
      let item = this.searchList.filter(it => it.id == key)[0];
      if (item) {
        this.qqmap.panTo(new qq.maps.LatLng(item.lat, item.lng));
        let latLng = item.lat + "," + item.lng;
        this.searchObj = {
          address: item.address,
          latLng: latLng
        };
        let point = new qq.maps.LatLng(item.lat, item.lng);
        let marker = new qq.maps.Marker({
          map: this.qqmap,
          position: point
        });
      }
    },
    hideMapWinHandler() {
      this.mapWinVisible = false;
    },
    resetGasFormHandler() {
      let obj = {
        name: this.editGas.name,
        username: this.editGas.username,
        phone: this.editGas.phone,
        address: this.editGas.address,
        latLng: this.editGas.latitude + "," + this.editGas.longitude
      };
      this.gasForm.setFieldsValue(obj);
    },
    submitGasFormHandler() {
      let tempGasId = this.$route.params.id;
      this.gasForm.validateFields((err, values) => {
        if (!err) {
          let latLng = values.latLng;
          let arr = latLng.split(",");
          let lat = arr[0];
          let lng = arr[1];
          let gas = {
            name: values.name,
            phone: values.phone,
            username: values.username,
            address: values.address,
            latitude: lat,
            longitude: lng
          };
          if (tempGasId != "save") {
            gas.gasId=tempGasId;
            this.updateGas(gas)
              .then(res => {
                message.success("更新成功");
              })
              .catch(err => {
                message.warn("操作失败",err);
              });
          } else {
            this.saveGas(gas)
              .then(res => {
                message.success("保存成功");
                this.$router.back(-1);
              })
              .catch(err => {
                message.warn("操作失败",err);
              });
          }
        }
      });
    },
    deleteOilHandler(oil) {
      let thisLocal = this;
      this.$confirm({
        title: "系统提示",
        content: "确认删除（" + oil.name + "）油品",
        okText: "确定",
        okType: "danger",
        cancelText: "取消",
        onOk() {
          thisLocal
            .deleteOil({ gasId: oil.gasId, oilId: oil.id })
            .catch(err => {
              message.warn(err);
            });
        }
      });
    },
    deleteGunHandler(gun) {
      let thisLocal = this;
      this.$confirm({
        title: "系统提示",
        content: "确认删除（" + gun.name + "）油枪",
        okText: "确定",
        okType: "danger",
        cancelText: "取消",
        onOk() {}
      });
    },
    changeOilStatuHandler(oil) {
      if (oil.enable) {
        this.disableOil({ gasId: oil.gasId, oilId: oil.id }).catch(err => {
          message.warn(err);
        });
      } else {
        this.enableOil({ gasId: oil.gasId, oilId: oil.id }).catch(err => {
          message.warn(err);
        });
      }
    },
    changeGunStatuHandler(gun) {
      if (gun.enable) {
        this.disableGun({ gasId: gun.gasId, gunId: gun.id }).catch(err => {
          message.warn(err);
        });
      } else {
        this.enableGun({ gasId: gun.gasId, gunId: gun.id }).catch(err => {
          message.warn(err);
        });
      }
    },
    showAddOilWinHandler() {
      this.oilWinVisible = true;
    },
    showAddGunWinHandler() {
      this.gunWinVisible = true;
    },
    showUpdateOilWinHanlder(oil) {
      if (oil.enable) {
        this.oilWinVisible = true;
        this.oil = oil;
      } else {
        message.warn("油品已被禁用");
      }
    },
    showUpdateGunWinHanlder(gun) {
      if (gun.enable) {
        this.gunWinVisible = true;
        this.gun = gun;
      } else {
        message.warn("油抢已被禁用");
      }
    },
    hideOilWinHanlder() {
      this.oil = null;
      this.oilWinVisible = false;
    },
    hideGunWinHanlder() {
      this.gun = null;
      this.gunWinVisible = false;
    }
  },
  destroyed() {
    this.contentEl.classList.remove("main-container-gasedit");
  }
};
</script>
<style scoped>
.ant-layout-content {
  background: #f0f2f5;
}
.card {
  margin-bottom: 24px;
}
.table-operations {
  padding-bottom: 8px;
}
.table-page-search-wrapper {
  padding-bottom: 8px;
}
.mapToolBar {
  margin-bottom: 10px;
}
.mapContainer {
  height: 350px;
}
.blockList {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin-bottom: 16px;
}
.blockdiv {
  cursor: pointer;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background-color: #fff7e6;
  border: 1px solid #ffd591;
  margin: 5px 10px;
  width: 65px;
  height: 65px;
  color: #fa8c16;
}
.disable {
  background-color: #fff;
  border: 1px solid #d9d9d9;
  color: rgba(0, 0, 0, 0.65);
}
.blockdiv > div {
  text-align: center;
}
.blockdiv > div.closebtn,
.blockdiv > div.statusbtn {
  cursor: pointer;
  font-size: 11px;
  position: absolute;
  right: -8px;
  top: -8px;
  width: 16px;
  height: 16px;
  padding: 0px;
  margin: 0px;
  border: 1px solid #d9d9d9;
  /* border-radius: 50%; */
  background-color: #fafafa;
  color: rgba(0, 0, 0, 0.45);
}
.blockdiv > div.statusbtn {
  top: -1px;
  left: -1px;
}
.blockdiv > div.closebtn:hover,
.blockdiv > div.statusbtn:hover {
  color: rgba(0, 0, 0, 0.65);
}
.blockdiv > div.oilType {
  position: absolute;
  font-size: 10px;
  color: #f5222d;
  left: -4px;
  width: 20px;
  height: 20px;
  border: 1px solid #ebedf0;
  background-color: #fff;
  border-radius: 50%;
  bottom: -4px;
}
.blockdiv > div.titlediv {
  font-size: 17px;
  color: #fa8c16;
}
.blockdiv > div.titlediv.disable {
  color: rgba(0, 0, 0, 0.65);
}
.blockdiv > div.pricediv {
  margin-top: 5px;
  font-size: 12px;
  color: #fa8c16;
}
.blockdiv > div.optionbtn {
  font-size: 20px;
  height: 55px;
  width: 55px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.blockdiv > div.optionbtn:hover {
  opacity: 0.5;
}
</style>
