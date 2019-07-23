<template>
  <div>
    <a-card class="card" title="油站信息" :bordered="false">
     
    </a-card>
    <gas-employ v-if="gasId != 'save'" :gasId="gasId"/>
  </div>
</template>
<script>
import GasEmploy from "./GasEmploy";
import { mapState, mapMutations, mapActions } from "vuex";
import { message } from "ant-design-vue";
export default {
  name: "GasEdit",
  components: {
    GasEmploy
  },
  data() {
    return {
        contentEl:null,
        gasId:null,
    };
  },
  created() {
    let tempGasId = this.$route.params.id;
    this.gasId = tempGasId;
    console.log(tempGasId);
  },
  mounted(){
    this.contentEl = document.querySelector('#components-layout-demo-custom-trigger .main-container');
    this.contentEl.classList.add("main-container-gasedit");
  }, 
  methods: {},
  destroyed(){
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
</style>
