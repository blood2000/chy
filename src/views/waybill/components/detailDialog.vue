<template>
  <el-dialog class="waybill-detail-dialog i-add" :title="title" :visible="visible" width="1500px" append-to-body @close="cancel">
    <div class="waybill-title"><div class="waybill-icon" />运单<div class="waybill-divider" /></div>
    <el-row>
      <el-col :span="3" class="text-label">
        运单单号：
      </el-col>
      <el-col :span="5" class="text-row">
        {{ form.waybillNo || '-' }}
      </el-col>
      <el-col :span="3" class="text-label">
        运单状态：
      </el-col>
      <el-col :span="5" class="text-row">
        {{ form.statusName || '-' }}
      </el-col>
      <el-col :span="3" class="text-label">
        项目名称：
      </el-col>
      <el-col :span="5" class="text-row">
        {{ form.projectName || '-' }}
      </el-col>
      <el-col :span="3" class="text-label">
        装货数量：
      </el-col>
      <el-col :span="5" class="text-row">
        <span v-if="form.stowageStatus === '1'">{{ form.loadWeight || '0.000' }} 方</span>
        <span v-if="form.stowageStatus === '2'">{{ Math.floor(form.loadWeight) || '0' }} 车</span>
        <span v-if="form.stowageStatus === '0' || !form.stowageStatus">{{ form.loadWeight || '0.000' }} 吨</span>
      </el-col>
      <el-col :span="3" class="text-label">
        卸货数量：
      </el-col>
      <el-col :span="5" class="text-row">
        <span v-if="form.stowageStatus === '1'">{{ form.unloadWeight || '0.000' }} 方</span>
        <span v-if="form.stowageStatus === '2'">{{ Math.floor(form.unloadWeight) || '0' }} 车</span>
        <span v-if="form.stowageStatus === '0' || !form.stowageStatus">{{ form.unloadWeight || '0.000' }} 吨</span>
      </el-col>
      <el-col :span="3" class="text-label">
        货物大类：
      </el-col>
      <el-col :span="5" class="text-row">
        {{ form.goodsBigType || '-' }}
      </el-col>
      <el-col :span="3" class="text-label">
        装货日期：
      </el-col>
      <el-col :span="5" class="text-row">
        {{ form.fillTime || '-' }}
      </el-col>
      <el-col :span="3" class="text-label">
        卸货日期：
      </el-col>
      <el-col :span="5" class="text-row">
        {{ form.signTime || '-' }}
      </el-col>
      <el-col :span="3" class="text-label">
        货物小类：
      </el-col>
      <el-col :span="5" class="text-row">
        {{ form.goodsType || '-' }}
      </el-col>
      <el-col :span="3" class="text-label">
        货源备注：
      </el-col>
      <el-col :span="5" class="text-row">
        {{ form.orderRemark || '-' }}
      </el-col>
      <el-col :span="3" class="text-label">
        运单备注：
      </el-col>
      <el-col :span="5" class="text-row">
        {{ form.shipperRemark || '-' }}
      </el-col>
      <el-col :span="3" class="text-label">
        公里数：
      </el-col>
      <el-col :span="5" class="text-row">
        {{ form.mileage || '-' }}
      </el-col>
    </el-row>

    <!-- 回单 -->
    <div class="waybill-title"><div class="waybill-icon" />回单<div class="waybill-divider" /></div>
    <el-row>
      <el-col :span="3" class="text-label">
        装货地址：
      </el-col>
      <el-col :span="9" class="text-row">
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
    </el-row>
    <el-row v-viewer>
      <el-col :span="3" class="text-label">
        装货签照片：
      </el-col>
      <el-col :span="9" class="text-row">
        <img v-for="(url, index) in formAttachmentUrl" :key="index" :src="url ? url:''" class="img-box">
      </el-col>
      <el-col :span="3" class="text-label">
        卸货签照片：
      </el-col>
      <el-col :span="9" class="text-row">
        <img v-for="(url, index) in formAttachmentUpUrl" :key="index" :src="url ? url:''" class="img-box">
      </el-col>
    </el-row>
    <!-- 费用 -->
    <div class="waybill-title"><div class="waybill-icon" />费用<div class="waybill-divider" /></div>
    <el-row>
      <el-col :span="3" class="text-label">
        货主实付金额（元）：
      </el-col>
      <el-col :span="5" class="text-row">
        {{ form.balanceVo.shipperRealPay || '0.00' }}
      </el-col>
      <el-col :span="3" class="text-label">
        司机实收金额（元）：
      </el-col>
      <el-col :span="5" class="text-row">
        {{ form.balanceVo.deliveryCashFee || '0.00' }}
      </el-col>
      <el-col :span="3" class="text-label">
        司机实收运费（元）：
      </el-col>
      <el-col :span="5" class="text-row">
        {{ form.balanceVo.deliveryFeePractical || '0.00' }}
      </el-col>

      <!-- <el-col :span="3" class="text-label">
        平台服务税费：
      </el-col>
      <el-col :span="5" class="text-row">
        {{ form.balanceVo.serviceTaxFee || '0.00' }}
      </el-col> -->
      <el-col :span="3" class="text-label">
        司机应收运费（元）：
      </el-col>
      <el-col :span="5" class="text-row">
        {{ form.balanceVo.deliveryFeeDeserved || '0.00' }}
      </el-col>
      <el-col :span="3" class="text-label">
        平台服务费用：
      </el-col>
      <el-col :span="5" class="text-row">
        {{ form.balanceVo.serviceFee || '0.00' }}
      </el-col>
      <el-col :span="3" class="text-label">
        不含税价：
      </el-col>
      <el-col :span="5" class="text-row">
        {{ form.balanceVo.taxFreeFee || '0.00' }}
      </el-col>
      <el-col :span="3" class="text-label">
        纳税金额：
      </el-col>
      <el-col :span="5" class="text-row">
        {{ form.balanceVo.taxPayment || '0.00' }}
      </el-col>

      <div v-for="(item, index) in freightList" :key="index">
        <el-col :span="3" class="text-label">
          {{ item.cnName || '0.00' }}：
        </el-col>
        <el-col :span="5" class="text-row">
          {{ item.ruleValue || '0.00' }}
        </el-col>
      </div>

    </el-row>

    <div class="waybill-title"><div class="waybill-icon" />轨迹<div class="waybill-divider" /></div>
    <div v-if="form.code" style="height:600px;width:100%;padding: 0 30px;overflow: hidden;">
      <Track :waybill="form" />
      <div class="waybill-detail-frame">
        <div class="waybill-detail-card">
          <div class="waybill-licenseNumber">{{ form.licenseNumber }}</div>
          <h5>
            {{ form.driverName }}
            <span>{{ form.driverPhone }}</span>
          </h5>
          <el-row>
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
              {{ form.waybillAddress?form.waybillAddress.loadFormattedAddress:'-' }}
            </el-col>
            <el-col :span="8" class="text-label">
              卸货地：
            </el-col>
            <el-col :span="16" class="text-row">
              {{ form.waybillAddress?form.waybillAddress.unloadFormattedAddress:'-' }}
            </el-col>
          </el-row>
        </div>
      </div>

    </div>
    <div class="waybill-title"><div class="waybill-icon" />评价<div class="waybill-divider" /></div>
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

  </el-dialog>
</template>

<script>
import { getWayBill, getWaybillAttachment, getWaybillComment } from '@/api/waybill/manages';
// import { jimiTrackLocation } from '@/api/waybill/tracklist';
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
      freightList: [],
      formAttachment: {},
      formAttachmentUrl: [],
      formAttachmentUp: {},
      formAttachmentUpUrl: [],
      formCommentDriver: {},
      formCommentShipment: {},
      // timeLineList: [],
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
        this.freightList = response.data.freightList.filter(e => {
          const bool = (e.ruleItemCode === '6' || e.ruleItemCode === '11' || e.ruleItemCode === '12' || e.ruleItemCode === '13' || e.ruleItemCode === '14' || e.ruleItemCode === '15' || e.ruleItemCode === '16');
          return bool;
        });
        console.log(this.freightList);
        this.loading = false;
      }).catch(e => {
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
      this.formAttachmentUrl = [];
      this.formAttachment = {};
      this.formAttachmentUp = {};
      this.formCommentDriver = {};
      this.formCommentShipment = {};
      // this.timeLineList = [];
    }
  }
};
</script>

<style lang="scss">
.comment{
  position: relative;
}
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
.waybill-detail-frame{
  position: relative;
  top: -590px;
  left: 10px;
  height: 0;
}
.waybill-detail-card{
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
