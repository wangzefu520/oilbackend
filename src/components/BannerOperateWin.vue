<template>
  <a-modal
    :title="'banner'+(null==banner?'添加':'更新')+'(375px X 150px)'"
    :visible="show"
    :closable="false"
    :maskClosable="false"
    :bodyStyle="{'display': 'flex','justify-content': 'center','flex-direction': 'row'}"
    @ok="submitBannerWinHandler"
    @cancel="hideBannerWinHanlder"
  >
    <a-upload
      listType="picture-card"
      class="avatar-uploader"
      :showUploadList="false"
      :beforeUpload="beforeUpload"
      @change="handleChange"
    >
      <img v-if="imageUrl" :src="imageUrl" alt="avatar" style="width:300px;height:85px;" />
      <div v-else>
        <a-icon :type="loading ? 'loading' : 'plus'" />
        <div class="ant-upload-text">Upload</div>
      </div>
    </a-upload>
  </a-modal>
</template>
<script>
import api from "../api";
import { mapState, mapMutations, mapActions } from "vuex";
import { message } from "ant-design-vue";
function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
}
export default {
  name: "BannerOperateWin",
  props: {
    show: {
      type: Boolean
    },
    banner: {
      type: Object
    }
  },
  data() {
    return {
      init: false,
      reading: false,
      loading: false,
      imageUrl: "",
      file: null,
      width: 0,
      height: 0
    };
  },
  updated() {
    let { init } = this;
    if (!init) {
      this.init = true;
      let banner = this.$props.banner;
      this.imageUrl = banner.pic;
    }
  },
  computed: {
    ...mapState({
      accessToken: state => state.Login.accessToken
    })
  },
  methods: {
    ...mapActions(["saveBanner", "updateBanner"]),
    handleChange(info) {
      getBase64(info.fileList[0].originFileObj, imageUrl => {
        let img = new Image();
        img.onload = () => {
          let width = img.width;
          let height = img.height;
          this.height = height;
          this.width = width;
        };
        img.src = imageUrl;
        this.imageUrl = imageUrl;
        this.loading = false;
        this.reading = true;
      });
    },
    beforeUpload(file) {
      const isJPG = file.type === "image/jpeg" || file.type === "image/png";
      if (!isJPG) {
        this.$message.error("请上传JPG图片");
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error("图片大小需要小于2M");
      }
      if (isJPG && isLt2M) {
        this.file = file;
      }
      return false;
    },
    submitBannerWinHandler() {
      let { width, height, file } = this;
      // if(width!=350||height !=150){
      //   this.$message.error("请上传350px X 150px的图片");
      //   return ;
      // }
      api.upload(file)
        .then(res => {
          let { data } = res;
          let code = data.code;
          if (code == 200) {
            this.imageUrl = data.data;
            let banner = this.$props.banner;
            if (!banner) {
              this.saveBanner({ pic: this.imageUrl })
                .then(res => {
                  this.hideBannerWinHanlder();
                })
                .catch(err => {
                  message.warn("保存banner异常");
                });
            } else {
              let obj = { id: banner.id, pic: this.imageUrl };
              this.updateBanner(obj)
                .then(res => {
                  this.hideBannerWinHanlder();
                })
                .catch(err => {
                  message.warn("更新banner异常");
                });
            }
          } else {
            message.warn(data.msg);
          }
        })
        .catch(err => {
          message.warn("上传banner异常");
        });
    },
    hideBannerWinHanlder() {
      this.imageUrl = null;
      this.$emit("hide");
    }
  }
};
</script>
<style>
.avatar-uploader > .ant-upload {
  width: 128px;
  height: 128px;
}
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
</style>
