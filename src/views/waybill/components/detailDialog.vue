<template>
  <el-dialog v-loading="loading" class="waybill-detail-dialog i-add" :title="title" :visible="visible" width="1200px" append-to-body @close="cancel">
    <el-tabs v-model="activeTab">
      <!-- 运单 -->
      <el-tab-pane label="运单" name="1">
        <div class="waybill-title"><div class="waybill-icon" />运单<div class="waybill-divider" /></div>
        <el-row>
          <el-col :span="3" class="text-label">
            运单单号：
          </el-col>
          <el-col :span="8" class="text-row">
            {{ form.waybillNo || '-' }}
          </el-col>
          <el-col :span="3" class="text-label">
            运单状态：
          </el-col>
          <el-col :span="8" class="text-row">
            {{ form.statusName || '-' }}
          </el-col>
          <el-col :span="2" class="text-row"><div style="height:22px" /></el-col>
          <el-col :span="3" class="text-label">
            项目名称：
          </el-col>
          <el-col :span="8" class="text-row">
            {{ form.goodsBigType || '-' }}
          </el-col>
          <el-col :span="13" class="text-row"><div style="height:22px" /></el-col>
          <el-col :span="3" class="text-label">
            货物大类：
          </el-col>
          <el-col :span="8" class="text-row">
            {{ form.goodsBigType || '-' }}
          </el-col>
          <el-col :span="3" class="text-label">
            货物小类：
          </el-col>
          <el-col :span="8" class="text-row">
            {{ form.goodsBigType || '-' }}
          </el-col>
          <el-col :span="2" class="text-row"><div style="height:22px" /></el-col>
          <el-col :span="3" class="text-label">
            装货数量：
          </el-col>
          <el-col :span="8" class="text-row">
            <span v-if="form.stowageStatus === '1'">{{ form.loadWeight || '0.00' }} 方</span>
            <span v-if="form.stowageStatus === '2'">{{ form.loadWeight || '0.00' }} 车</span>
            <span v-if="form.stowageStatus === '0' || !form.stowageStatus">{{ form.loadWeight || '0.00' }} 吨</span>
          </el-col>
          <el-col :span="3" class="text-label">
            卸货数量：
          </el-col>
          <el-col :span="8" class="text-row">
            <span v-if="form.stowageStatus === '1'">{{ form.unloadWeight || '0.00' }} 方</span>
            <span v-if="form.stowageStatus === '2'">{{ form.unloadWeight || '0.00' }} 车</span>
            <span v-if="form.stowageStatus === '0' || !form.stowageStatus">{{ form.unloadWeight || '0.00' }} 吨</span>
          </el-col>
          <el-col :span="2" class="text-row"><div style="height:22px" /></el-col>
          <el-col :span="3" class="text-label">
            装货日期：
          </el-col>
          <el-col :span="8" class="text-row">
            {{ form.fillTime || '-' }}
          </el-col>
          <el-col :span="3" class="text-label">
            卸货日期：
          </el-col>
          <el-col :span="8" class="text-row">
            {{ form.signTime || '-' }}
          </el-col>
          <el-col :span="2" class="text-row"><div style="height:22px" /></el-col>
          <el-col :span="3" class="text-label">
            货源备注：
          </el-col>
          <el-col :span="8" class="text-row">
            {{ form.shipperRemark || '-' }}
          </el-col>
          <el-col :span="3" class="text-label">
            货主备注：
          </el-col>
          <el-col :span="8" class="text-row">
            {{ form.shipperRemark || '-' }}
          </el-col>
        </el-row>

        <!-- 地址 -->
        <div class="waybill-title"><div class="waybill-icon" />地址<div class="waybill-divider" /></div>
        <el-row>
          <el-col :span="3" class="text-label">
            装货地址：
          </el-col>
          <el-col :span="8" class="text-row">
            {{ form.waybillAddress?form.waybillAddress.loadFormattedAddress:'-' }}
            <div>
              {{ form.waybillAddress?form.waybillAddress.loadContact:'' }}
              {{ form.waybillAddress?form.waybillAddress.loadContactPhone:'' }}
            </div>
          </el-col>
          <el-col :span="3" class="text-label">
            卸货地址：
          </el-col>
          <el-col :span="8" class="text-row">
            {{ form.waybillAddress?form.waybillAddress.unloadFormattedAddress:'-' }}
            <div>
              {{ form.waybillAddress?form.waybillAddress.unloadContact:'' }}
              {{ form.waybillAddress?form.waybillAddress.unloadContactPhone:'' }}
            </div>
          </el-col>
          <!-- <el-col :span="12" class="text-row">
            <label>上传装货位置：</label>
          </el-col>
          <el-col :span="12" class="text-row">
            <label>上传卸货位置：</label>
          </el-col> -->
        </el-row>

        <!-- 费用 -->
        <div class="waybill-title"><div class="waybill-icon" />费用<div class="waybill-divider" /></div>
        <el-row>
          <el-col :span="3" class="text-label">
            货主实付金额（元）：
          </el-col>
          <el-col :span="8" class="text-row">
            {{ form.balanceVo.deliveryCashFee || '0.00' }}
          </el-col>
          <el-col :span="3" class="text-label">
            司机实收金额（元）：
          </el-col>
          <el-col :span="8" class="text-row">
            {{ form.balanceVo.deliveryCashFee || '0.00' }}
          </el-col>
          <el-col :span="2" class="text-row"><div style="height:22px" /></el-col>

          <el-col :span="3" class="text-label">
            平台服务费用：
          </el-col>
          <el-col :span="8" class="text-row">
            {{ form.balanceVo.serviceFee || '0.00' }}
          </el-col>
          <el-col :span="3" class="text-label">
            司机实收运费（元）：
          </el-col>
          <el-col :span="8" class="text-row">
            {{ form.balanceVo.deliveryFeePractical || '0.00' }}
          </el-col>
          <el-col :span="2" class="text-row"><div style="height:22px" /></el-col>

          <el-col :span="3" class="text-label">
            平台服务税费：
          </el-col>
          <el-col :span="8" class="text-row">
            {{ form.balanceVo.serviceTaxFee || '0.00' }}
          </el-col>
          <el-col :span="3" class="text-label">
            司机应收运费（元）：
          </el-col>
          <el-col :span="8" class="text-row">
            {{ form.balanceVo.deliveryFeeDeserved || '0.00' }}
          </el-col>
          <el-col :span="2" class="text-row"><div style="height:22px" /></el-col>

          <el-col :span="3" class="text-label">
            不含税价：
          </el-col>
          <el-col :span="8" class="text-row">
            {{ form.balanceVo.taxFreeFee || '0.00' }}
          </el-col>
          <el-col :span="3" class="text-label">
            纳税金额：
          </el-col>
          <el-col :span="8" class="text-row">
            {{ form.balanceVo.taxPayment || '0.00' }}
          </el-col>
          <el-col :span="2" class="text-row"><div style="height:22px" /></el-col>

          <el-col :span="3" class="text-label">
            装车费：
          </el-col>
          <el-col :span="8" class="text-row">
            {{ form.balanceVo.taxFreeFee || '0.00' }}
          </el-col>
          <el-col :span="3" class="text-label">
            卸车费：
          </el-col>
          <el-col :span="8" class="text-row">
            {{ form.balanceVo.taxPayment || '0.00' }}
          </el-col>
          <el-col :span="2" class="text-row"><div style="height:22px" /></el-col>

          <el-col :span="3" class="text-label">
            亏涨吨扣费：
          </el-col>
          <el-col :span="8" class="text-row">
            {{ form.balanceVo.taxFreeFee || '0.00' }}
          </el-col>
          <el-col :span="3" class="text-label">
            调度费：
          </el-col>
          <el-col :span="8" class="text-row">
            {{ form.balanceVo.taxPayment || '0.00' }}
          </el-col>
          <el-col :span="2" class="text-row"><div style="height:22px" /></el-col>

          <el-col :span="3" class="text-label">
            超时费：
          </el-col>
          <el-col :span="8" class="text-row">
            {{ form.balanceVo.taxFreeFee || '0.00' }}
          </el-col>
          <el-col :span="3" class="text-label">
            抹零金额：
          </el-col>
          <el-col :span="8" class="text-row">
            {{ form.balanceVo.taxPayment || '0.00' }}
          </el-col>
          <el-col :span="2" class="text-row"><div style="height:22px" /></el-col>

          <el-col :span="3" class="text-label">
            油气卡：
          </el-col>
          <el-col :span="8" class="text-row">
            {{ form.balanceVo.taxFreeFee || '0.00' }}
          </el-col>
        </el-row>
      </el-tab-pane>
      <!-- 回单 -->
      <el-tab-pane label="回单" name="2">
        <!-- 装货单 -->
        <div class="waybill-title"><div class="waybill-icon" />装货单<div class="waybill-divider" /></div>
        <el-row>
          <el-col :span="3" class="text-label">
            装货签到时间：
          </el-col>
          <el-col :span="8" class="text-row">
            {{ formAttachment?formAttachment.cargoTime:'暂无' }}
          </el-col>
          <el-col :span="3" class="text-label">
            装货数量：
          </el-col>
          <el-col :span="8" class="text-row">
            <span v-if="form.stowageStatus === '0' || !form.stowageStatus">{{ formAttachment?formAttachment.loadWeight:'0.00' }} 吨</span>
            <span v-if="form.stowageStatus === '1'">{{ formAttachment?formAttachment.loadWeight:'0.00' }} 方</span>
            <span v-if="form.stowageStatus === '2'">{{ formAttachment?formAttachment.loadWeight:'0.00' }} 车</span>
          </el-col>
          <el-col :span="2" class="text-row"><div style="height:22px" /></el-col>
          <el-col :span="3" class="text-label">
            装货签照片：
          </el-col>
          <el-col :span="19" class="text-row">
            <img v-for="(url, index) in formAttachmentUrl" :key="index" v-viewer :src="url ? url:''" class="img-box">
          </el-col>
        </el-row>
        <!-- 卸货单 -->
        <div class="waybill-title"><div class="waybill-icon" />卸货单<div class="waybill-divider" /></div>
        <el-row>
          <el-col :span="3" class="text-label">
            卸货签到时间：
          </el-col>
          <el-col :span="8" class="text-row">
            {{ formAttachmentUp?formAttachmentUp.unloadTime:'暂无' }}
          </el-col>
          <el-col :span="3" class="text-label">
            卸货数量：
          </el-col>
          <el-col :span="8" class="text-row">
            <span v-if="form.stowageStatus === '0' || !form.stowageStatus">{{ formAttachmentUp?formAttachmentUp.unloadWeight:'0.00' }} 吨</span>
            <span v-if="form.stowageStatus === '1'">{{ formAttachmentUp?formAttachmentUp.unloadWeight:'0.00' }} 方</span>
            <span v-if="form.stowageStatus === '2'">{{ formAttachmentUp?formAttachmentUp.unloadWeight:'0.00' }} 车</span>
          </el-col>
          <el-col :span="2" class="text-row"><div style="height:22px" /></el-col>
          <el-col :span="3" class="text-label">
            卸货签照片：
          </el-col>
          <el-col :span="19" class="text-row">
            <img v-for="(url, index) in formAttachmentUpUrl" :key="index" v-viewer :src="url ? url:''" class="img-box">
          </el-col>
        </el-row>
      </el-tab-pane>
      <!-- 轨迹 -->
      <el-tab-pane label="轨迹" name="3">
        <div v-if="activeTab === '3'" style="height:600px;width:100%;">
          <Track :waybill="form" />
          <div class="waybill-detail-card">
            <div class="waybill-licenseNumber">{{ form.licenseNumber }}</div>
            <h5>
              {{ form.driverName }}
              <span>{{ form.driverPhone }}</span>
            </h5>
            <el-row>
              <!-- <el-col :span="8" class="text-label">
                      货物大类：
                    </el-col>
                    <el-col :span="16" class="text-row">
                      {{ form.goodsBigType }}
                    </el-col> -->
              <el-col :span="8" class="text-label">
                运输单号：
              </el-col>
              <el-col :span="16" class="text-row">
                {{ form.waybillNo || '-' }}
              </el-col>
              <el-col :span="8" class="text-label">
                接单时间：
              </el-col>
              <el-col :span="16" class="text-row">
                {{ parseTime(form.receiveTime) || '-' }}
              </el-col>
              <el-col :span="8" class="text-label">
                装货地：
              </el-col>
              <el-col :span="16" class="text-row">
                {{ form.waybillAddress?form.waybillAddress.unloadFormattedAddress:'-' }}
              </el-col>
              <el-col :span="8" class="text-label">
                卸货地：
              </el-col>
              <el-col :span="16" class="text-row">
                {{ form.waybillAddress?form.waybillAddress.loadFormattedAddress:'-' }}
              </el-col>
            </el-row>
          </div>
        </div>
      </el-tab-pane>
      <!-- 评价 -->
      <el-tab-pane label="评价" name="4">
        <el-row>
          <el-col :span="3" class="text-label">
            司机评价货主：
          </el-col>
          <el-col :span="9" class="text-row" style="height:300px">
            {{ formCommentDriver?formCommentDriver.content:'' }}
            <DataNull v-if="!formCommentDriver" />
          </el-col>
          <el-col :span="3" class="text-label">
            货主评价司机：
          </el-col>
          <el-col :span="9" class="text-row" style="height:300px">
            {{ formCommentShipment?formCommentShipment.content:'' }}
            <DataNull v-if="!formCommentShipment" />
          </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>

<script>
import { getWayBill, getWaybillAttachment, getWaybillComment, getWaybillTrace } from '@/api/waybill/manages';
import { jimiTrackLocation } from '@/api/waybill/tracklist';
import DataNull from '@/components/DataNull/index';
import Track from './track';
export default {
  components: { DataNull, Track },
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
      }],
      loading: false
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
        this.loading = true;
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
        this.loading = false;
      });
      // 回单-装货
      getWaybillAttachment(this.currentId, 1).then(response => {
        // console.log(response);
        this.formAttachment = response.data ? response.data[0] : null;
        this.formAttachmentUrl = this.formAttachment ? this.formAttachment.attachUrls.split(',') : null;
      });
      // 回单-卸货
      getWaybillAttachment(this.currentId, 2).then(response => {
        // console.log(response);
        this.formAttachmentUp = response.data ? response.data[0] : null;
        this.formAttachmentUpUrl = this.formAttachmentUp ? this.formAttachmentUp.attachUrls.split(',') : null;
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
      jimiTrackLocation(this.queryParams).then(response => {
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
        // console.log(response);
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
  font-family: PingFang SC;
  font-weight: bold;
  line-height: 22px;
  color: #20273A;
  margin-bottom: 12px;
}
.text-label{
  text-align: end;
  font-family: PingFang SC;
  font-weight: 400;
  line-height: 22px;
  color: #909398;
}
.img-box{
  margin: 5px 5px 0 0;
  width: 150px;
  height: 150px;
  vertical-align: top;
  object-fit: contain;
  border-radius: 6px;
  border: 1px dashed #dddddd;
}
// 轨迹-运单详情卡片
.waybill-detail-card{
  position: absolute;
  top: 10px;
  left: 10px;
  width: 250px;
  background: #fff;
  padding: 15px;
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.15);
  border-radius: 2px;
  .waybill-licenseNumber{
    background: url('~@/assets/images/location/bg_lic.png') no-repeat;
    background-size: 100% 100%;
    height: 24px;
    width: 90px;
    font-weight: bold;
    line-height: 24px;
    text-align: center;
    color: #050407;
  }
  >h5{
    line-height: 30px;
    border-bottom: 1px solid #d2d4da;
    margin-bottom: 8px;
    font-size: 14px;
    color: #262626;
    font-weight: bold;
    >span{
      font-size: 14px;
      &.license{
        background: #ffba00;
        padding: 3px 4px 1px;
        margin-left: 6px;
        border-radius: 4px;
        border: 1px solid gray;
      }
    }
  }
  .text-label{
    margin-bottom: 6px;
  }
  .text-row{
    margin-bottom: 6px;
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
.waybill-title{
  display: flex;
  align-items: center;
  font-size: 14px;
  font-family: PingFang SC;
  font-weight: bold;
  line-height: 24px;
  color: #262626;
  margin: 15px 20px;
  .waybill-icon{
    margin-right: 6px;
    width: 2px;
    height: 16px;
    background: #1990FF;
    border-radius: 2px;
  }
  .waybill-divider{
    margin-left: 8px;
    height: 1px;
    width: 94%;
    border-bottom: 1px dashed #DAD3D3;
  }
}
</style>>
