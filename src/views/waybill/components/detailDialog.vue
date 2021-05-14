<template>
  <el-dialog class="waybill-detail-dialog" :title="title" :visible="visible" width="1200px" append-to-body @close="cancel">
    <el-tabs v-model="activeTab">
      <!-- 运单 -->
      <el-tab-pane label="运单" name="1">
        <el-divider content-position="left" class="m40">
          <h5 class="g-title-medium">运单</h5>
        </el-divider>
        <el-row>
          <el-col :span="12" class="text-row">
            <label>运单单号：</label>
            {{ form.waybillNo }}
          </el-col>
          <el-col :span="12" class="text-row">
            <label>运单状态：</label>
            {{ form.statusName }}
          </el-col>
          <el-col :span="12" class="text-row">
            <label>装货重量(吨)：</label>
            {{ form.loadWeight }}
          </el-col>
          <el-col :span="12" class="text-row">
            <label>货品类别：</label>
            {{ form.goodsBigType }}
          </el-col>
          <el-col :span="12" class="text-row">
            <label>装货日期：</label>
            {{ form.fillTime }}
          </el-col>
          <el-col :span="12" class="text-row">
            <label>卸货日期：</label>
            {{ form.signTime }}
          </el-col>
          <el-col :span="12" class="text-row">
            <label>货主备注：</label>
            {{ form.shipperRemark }}
          </el-col>
        </el-row>
        <el-divider content-position="left" class="m40">
          <h5 class="g-title-medium">地址</h5>
        </el-divider>
        <el-row :gutter="20">
          <el-col :span="2" class="text-row">
            <label>装货地址：</label>
          </el-col>
          <el-col :span="10" class="text-row">
            {{ form.waybillAddress?form.waybillAddress.loadFormattedAddress:'' }}
            {{ form.waybillAddress?form.waybillAddress.loadContact:'' }}
            {{ form.waybillAddress?form.waybillAddress.loadContactPhone:'' }}
          </el-col>
          <el-col :span="2" class="text-row">
            <label>卸货地址：</label>
          </el-col>
          <el-col :span="10" class="text-row">
            {{ form.waybillAddress?form.waybillAddress.unloadFormattedAddress:'' }}
            {{ form.waybillAddress?form.waybillAddress.unloadContact:'' }}
            {{ form.waybillAddress?form.waybillAddress.unloadContactPhone:'' }}
          </el-col>
          <!-- <el-col :span="12" class="text-row">
            <label>上传装货位置：</label>
          </el-col>
          <el-col :span="12" class="text-row">
            <label>上传卸货位置：</label>
          </el-col> -->
        </el-row>
        <el-divider content-position="left" class="m40">
          <h5 class="g-title-medium">费用</h5>
        </el-divider>
        <el-row>
          <el-col :span="12" class="text-row">
            <label>实收现金（元）：</label>
            {{ form.balanceVo.deliveryCashFee }}
          </el-col>
          <el-col :span="12" class="text-row">
            <label>应收运费（元）：</label>
            {{ form.balanceVo.deliveryFeeDeserved }}
          </el-col>
          <el-col :span="12" class="text-row">
            <label>实收运费（元）：</label>
            {{ form.balanceVo.deliveryFeePractical }}
          </el-col>
          <el-col :span="12" class="text-row">
            <label>服务费：</label>
            {{ form.balanceVo.serviceFee }}
          </el-col>
          <el-col :span="12" class="text-row">
            <label>服务税费：</label>
            {{ form.balanceVo.serviceTaxFee }}
          </el-col>
          <el-col :span="12" class="text-row">
            <label>不含税价：</label>
            {{ form.balanceVo.taxFreeFee }}
          </el-col>
          <el-col :span="12" class="text-row">
            <label>纳税金额：</label>
            {{ form.balanceVo.taxPayment }}
          </el-col>
        </el-row>
      </el-tab-pane>
      <!-- 回单 -->
      <el-tab-pane label="回单" name="2">
        <el-divider content-position="left" class="m40">
          <h5 class="g-title-medium">装货单</h5>
        </el-divider>
        <el-row>
          <el-col :span="12" class="text-row">
            <label>装货签到时间：</label>
            {{ formAttachment?formAttachment.cargoTime:'' }}
          </el-col>
          <el-col :span="12" class="text-row">
            <label>装货重量（吨）：</label>
            {{ formAttachment?formAttachment.loadWeight:'' }}
          </el-col>
          <el-col :span="2" class="text-row">
            <label>装货签照片：</label>
          </el-col>
          <el-col :span="22" class="text-row">
            <img v-for="(url, index) in formAttachmentUrl" :key="index" v-viewer :src="url ? url:''" class="img-box">
          </el-col>
        </el-row>
        <el-divider content-position="left" class="m40">
          <h5 class="g-title-medium">卸货单</h5>
        </el-divider>
        <el-row>
          <el-col :span="12" class="text-row">
            <label>卸货签到时间：</label>
            {{ formAttachmentUp?formAttachmentUp.unloadTime:'' }}
          </el-col>
          <el-col :span="12" class="text-row">
            <label>卸货重量（吨）：</label>
            {{ formAttachmentUp?formAttachmentUp.unloadWeight:'' }}
          </el-col>
          <el-col :span="2" class="text-row">
            <label>卸货签照片：</label>
          </el-col>
          <el-col :span="22" class="text-row">
            <img v-for="(url, index) in formAttachmentUpUrl" :key="index" v-viewer :src="url ? url:''" class="img-box">
          </el-col>
        </el-row>
      </el-tab-pane>
      <!-- 轨迹 -->
      <el-tab-pane label="轨迹" name="3">
        <el-divider content-position="left">
          <h5 class="g-title-medium">运单轨迹</h5>
        </el-divider>
        <el-row v-if="activeTab === '3'" :gutter="20">
          <el-col :span="18">
            <div class="map-content">
              <el-amap vid="amapDemo" :zoom="zoom" :center="center" style="height:600px">
                <div class="waybill-detail-card">
                  <h5>
                    {{ form.driverName }}
                    <span>{{ form.driverPhone }}</span>
                    <span class="license">{{ form.licenseNumber }}</span>
                  </h5>
                  <p>
                    <label>货物大类：</label>
                    {{ form.goodsBigType }}
                  </p>
                  <p>
                    <label>运单号：</label>
                    {{ form.waybillNo }}
                  </p>
                  <p>
                    <label>接单时间：</label>
                    {{ parseTime(form.receiveTime) }}
                  </p>
                  <p>
                    <label>装货地：</label>
                    {{ form.waybillAddress?form.waybillAddress.unloadFormattedAddress:'' }}
                  </p>
                  <p>
                    <label>卸货地：</label>
                    {{ form.waybillAddress?form.waybillAddress.loadFormattedAddress:'' }}
                  </p>
                </div>
                <el-amap-polyline :path="polyline.path" :stroke-weight="8" :stroke-opacity="0.8" :stroke-color="'#0091ea'" />
                <el-amap-marker v-for="(marker, index) in markers" :key="index" :position="marker.position" :icon="marker.icon" />
              </el-amap>
            </div>
          </el-col>
          <el-col :span="6">
            <ul class="time-line-content">
              <li v-for="(item, index) in timeLineList" :key="item.id" :class="index===0?'light':''">
                <p class="g-strong g-text">{{ parseTime(item.createTime, '{y}-{m}-{d} {h}:{i}') }}</p>
                <p class="g-color-gray g-text">{{ item.content }}</p>
                <!-- <p class="g-color-warning g-text">状态</p> -->
              </li>
            </ul>
          </el-col>
        </el-row>
      </el-tab-pane>
      <!-- 评价 -->
      <el-tab-pane label="评价" name="4">
        <el-divider content-position="left" class="m40">
          <h5 class="g-title-medium">评价</h5>
        </el-divider>
        <el-row>
          <el-col :span="12" class="text-row">
            <label>司机评价货主：</label>
            {{ formCommentDriver?formCommentDriver.content:'暂无任何评价~' }}
          </el-col>
          <el-col :span="12" class="text-row">
            <label>货主评价司机：</label>
            {{ formCommentShipment?formCommentShipment.content:'暂无任何评价~' }}
          </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>

<script>
import { getWayBill, getWaybillAttachment, getWaybillComment, getWaybillTrace } from '@/api/waybill/manages';
import { trackLocation } from '@/api/waybill/tracklist';
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    open: Boolean,
    currentId: {
      type: String,
      default: null
    },
    disable: Boolean,
    currentRow: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  data() {
    return {
      activeTab: '1',
      // 表单参数
      form: {
        waybillAddress: {},
        // unloadAddress: {},
        balanceVo: {}
      },
      formAttachment: {},
      formAttachmentUrl: [],
      formAttachmentUp: {},
      formAttachmentUpUrl: [],
      formCommentDriver: {},
      formCommentShipment: {},
      timeLineList: [],
      // 地图
      queryParams: {
        begin_time: '2021-03-22 08:00:00',
        end_time: '2021-03-22 09:00:00',
        imeis: '867567047562525',
        map_type: 'GOOGLE' // GOOGOLE或BAIDU
      },
      zoom: 16,
      center: [116.478928, 39.997761],
      polyline: {
        path: []
      },
      markers: [{
        icon: 'https://webapi.amap.com/theme/v1.3/markers/n/start.png',
        position: []
      }, {
        icon: 'https://webapi.amap.com/theme/v1.3/markers/n/end.png',
        position: []
      }]
    };
  },
  computed: {
    visible: {
      get() {
        return this.open;
      },
      set(v) {
        this.$emit('update:open', v);
      }
    }
  },
  watch: {
    open(val) {
      if (val) {
        this.reset();
        this.getDetail();
      }
    }
  },
  methods: {
    // 获取运单详情
    getDetail() {
      // 运单
      getWayBill(this.currentId).then(response => {
        this.form = response.data || {};
        this.form.waybillAddress = response.data.waybillAddress || {};
        // this.form.unloadAddress = response.data.waybillAddress || {};
        this.form.balanceVo = response.data.balanceVo || {};
        // console.log(response);
      });
      // 回单-装货
      getWaybillAttachment(this.currentId, 1).then(response => {
        // console.log(response);
        this.formAttachment = response.data ? response.data[0] : null;
        this.formAttachmentUrl = this.formAttachment.attachUrls.split(',');
        console.log(this.formAttachment);
      });
      // 回单-卸货
      getWaybillAttachment(this.currentId, 2).then(response => {
        // console.log(response);
        this.formAttachmentUp = response.data ? response.data[0] : null;
        this.formAttachmentUpUrl = this.formAttachmentUp.attachUrls.split(',');
        console.log(this.formAttachmentUp);
      });
      // 评价-司机
      getWaybillComment(this.currentId, 1).then(response => {
        this.formCommentDriver = response.data ? response.data[0] : null;
      });
      // 评价-货主
      getWaybillComment(this.currentId, 0).then(response => {
        this.formCommentShipment = response.data ? response.data[0] : null;
      });
      // 轨迹
      trackLocation(this.queryParams).then(response => {
        const tracklist = response.data.result.map(function(response) {
          return [response.lng, response.lat];
        });
        this.polyline.path = tracklist || [];
        if (tracklist.length > 0) {
          this.center = tracklist[0];
          this.markers[0].position = tracklist[0];
          this.markers[1].position = tracklist[tracklist.length - 1];
        }
      });
      // 轨迹时间线
      getWaybillTrace(this.currentId).then(response => {
        console.log(response);
        response.data.forEach(el => {
          this.timeLineList.unshift(el);
        });
      });
    },
    // 取消按钮
    cancel() {
      this.close();
      this.reset();
    },
    // 关闭弹窗
    close() {
      this.$emit('update:open', false);
    },
    // 表单重置
    reset() {
      this.activeTab = '1';
      this.form = {
        loadAddress: {},
        unloadAddress: {},
        balanceVo: {}
      };
      this.formAttachment = {};
      this.formAttachmentUp = {};
      this.formCommentDriver = {};
      this.formCommentShipment = {};
      this.timeLineList = [];
    }
  }
};
</script>

<style lang="scss">
.waybill-detail-dialog{
  .el-dialog__body{
    padding: 10px 20px 30px !important;
    min-height: 70vh;
  }
}
</style>
<style lang="scss" scoped>
.mr3{
  margin-right: 3%;
}
.input-width{
  width: 60%;
}
.mb{
  margin-bottom: 22px;
}
.m40{
  margin: 30px 0 40px;
}
.text-row{
  margin-bottom: 22px;
}
.img-box{
  margin: 5px 5px 0 0;
  width: 200px;
  height: 200px;
  vertical-align: top;
  object-fit: contain;
  border-radius: 6px;
  border: 1px dashed #dddddd;
}
// 轨迹-运单详情卡片
.map-content{
  position: relative;
  height: 600px;
  .waybill-detail-card{
    position: absolute;
    top: 10px;
    left: 10px;
    width: 240px;
    background: #fff;
    padding: 15px;
    box-shadow: 0 2px 2px rgba(0, 0, 0, 0.15);
    >h5{
      line-height: 30px;
      border-bottom: 1px solid #d2d4da;
      margin-bottom: 5px;
      font-size: 14px;
      >span{
        font-size: 13px;
        &.license{
          background: #ffba00;
          padding: 3px 4px 1px;
          margin-left: 6px;
          border-radius: 4px;
          border: 1px solid gray;
        }
      }
    }
    >p{
      line-height: 28px;
      >label{
        font-weight: normal;
        color: gray;
      }
    }
  }
}
// 轨迹-时间线
.time-line-content{
  >li{
    position: relative;
    padding: 0 0 20px 20px;
    border-left: 1px solid #d2d4da;
    &::before{
      content: '';
      position: absolute;
      top: 5px;
      left: -6px;
      width: 11px;
      height: 11px;
      border-radius: 100%;
      background: #d2d4da;
    }
    &.light{
      &::before{
        content: '';
        background: #00bd93;
      }
    }
  }
}
</style>>
