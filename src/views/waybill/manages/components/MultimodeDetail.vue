<template>
  <!-- <el-dialog class="waybill-detail-dialog i-add" :title="title" :visible="visible" width="1500px" append-to-body @close="cancel"> -->
  <el-drawer
    size="96%"
    :title="title"
    :visible.sync="visible"
    direction="rtl"
    append-to-body
    destroy-on-close
    :before-close="cancel"
    class="page-shipment-manage-dialog"
  >
    <el-tabs v-model="activeName"> <!-- @tab-click="handleClick" -->
      <el-tab-pane label="运单" name="first">
        <div class="waybill-title"><div class="waybill-icon" />运单<div class="waybill-divider" /></div>
        <el-row>
          <el-col :span="3" class="text-label">
            运单单号：
          </el-col>
          <el-col :span="5" class="text-row">
            {{ form.waybillInfo.waybillNo || '-' }}
          </el-col>
          <el-col :span="3" class="text-label">
            装货数量：
          </el-col>
          <el-col :span="5" class="text-row">
            <span v-if="form.waybillInfo.stowageStatus === '1'">{{ fixed(form.waybillInfo.loadWeight) || '0.000' }} 方</span>
            <span v-if="form.waybillInfo.stowageStatus === '2'">{{ Math.floor(form.waybillInfo.loadWeight) || '0' }} 车</span>
            <span v-if="form.waybillInfo.stowageStatus === '0' || !form.waybillInfo.stowageStatus">{{ fixed(form.waybillInfo.loadWeight) || '0.000' }} 吨</span>
          </el-col>
          <el-col :span="3" class="text-label">
            卸货数量：
          </el-col>
          <el-col :span="5" class="text-row">
            <span v-if="form.waybillInfo.stowageStatus === '1'">{{ fixed(form.waybillInfo.unloadWeight) || '0.000' }} 方</span>
            <span v-if="form.waybillInfo.stowageStatus === '2'">{{ Math.floor(form.waybillInfo.unloadWeight) || '0' }} 车</span>
            <span v-if="form.waybillInfo.stowageStatus === '0' || !form.waybillInfo.stowageStatus">{{ fixed(form.waybillInfo.unloadWeight) || '0.000' }} 吨</span>
          </el-col>
          <el-col :span="3" class="text-label">
            货物大类：
          </el-col>
          <el-col :span="5" class="text-row">
            {{ form.orderGoods.goodsBigTypeName || '-' }}
          </el-col>
          <el-col :span="3" class="text-label">
            货物小类：
          </el-col>
          <el-col :span="5" class="text-row">
            {{ form.orderGoods.goodsTypeName || '-' }}
          </el-col>
          <el-col :span="3" class="text-label">
            公里数：
          </el-col>
          <el-col :span="5" class="text-row">
            {{ form.waybillInfo.mileage || '0.00' }}
          </el-col>
          <el-col :span="3" class="text-label">
            装货日期：
          </el-col>
          <el-col :span="5" class="text-row">
            {{ form.waybillInfo.fillTime || '-' }}
          </el-col>
          <el-col :span="3" class="text-label">
            卸货日期：
          </el-col>
          <el-col :span="5" class="text-row">
            {{ form.waybillInfo.signTime || '-' }}
          </el-col>
          <!-- <el-col :span="3" class="text-label">
            货源备注：
          </el-col>
          <el-col :span="5" class="text-row">
            {{ form.orderRemark || '-' }}
          </el-col> -->
          <el-col :span="3" class="text-label">
            运单备注：
          </el-col>
          <el-col :span="5" class="text-row">
            {{ form.waybillInfo.shipperRemark || '-' }}
          </el-col>
          <el-col :span="3" class="text-label">
            运单总价(元)：
          </el-col>
          <el-col :span="5" class="text-row">
            {{ form.waybillBalanceInfo.shipperRealPay?floor(form.waybillBalanceInfo.shipperRealPay):'0.00' }}
          </el-col>
          <!-- <el-col :span="3" class="text-label">
            司机实收金额(元)：
          </el-col>
          <el-col :span="5" class="text-row">
            {{ form.waybillBalanceInfo.deliveryCashFee?floor(form.waybillBalanceInfo.deliveryCashFee):'0.00' }}
          </el-col>
          <el-col :span="3" class="text-label">
            司机实收运费(元)：
          </el-col>
          <el-col :span="5" class="text-row">
            {{ form.waybillBalanceInfo.deliveryFeePractical?floor(form.waybillBalanceInfo.deliveryFeePractical):'0.00' }}
          </el-col>
          <el-col :span="3" class="text-label">
            司机应收运费(元)：
          </el-col>
          <el-col :span="5" class="text-row">
            {{ form.waybillBalanceInfo.deliveryFeeDeserved?floor(form.waybillBalanceInfo.deliveryFeeDeserved):'0.00' }}
          </el-col>
          <el-col :span="3" class="text-label">
            平台服务费用(元)：
          </el-col>
          <el-col :span="5" class="text-row">
            {{ form.waybillBalanceInfo.serviceFee?floor(form.waybillBalanceInfo.serviceFee):'0.00' }}
          </el-col>
          <el-col :span="3" class="text-label">
            不含税价(元)：
          </el-col>
          <el-col :span="5" class="text-row">
            {{ form.waybillBalanceInfo.taxFreeFee?floor(form.waybillBalanceInfo.taxFreeFee):'0.00' }}
          </el-col>
          <el-col :span="3" class="text-label">
            留存运费(元)：
          </el-col>
          <el-col :span="5" class="text-row">
            {{ form.waybillBalanceInfo.taxPayment?floor(form.waybillBalanceInfo.taxPayment):'0.00' }}
          </el-col>
          <el-col :span="3" class="text-label">
            路耗(元)：
          </el-col>
          <el-col :span="5" class="text-row">
            {{ form.waybillBalanceInfo.lossDeductionFee?floor(form.waybillBalanceInfo.lossDeductionFee):'0.00' }}
          </el-col> -->
        </el-row>

        <div class="waybill-title"><div class="waybill-icon" />地址<div class="waybill-divider" /></div>
        <el-row>
          <el-col :span="3" class="text-label">
            装货地址：
          </el-col>
          <el-col :span="8" class="text-row">
            {{ form.waybillAddress?form.waybillAddress.loadDetail:'-' }}
            <div>
              {{ form.waybillAddress?form.waybillAddress.loadContact:'' }}
              {{ form.waybillAddress?form.waybillAddress.loadContactPhone:'' }}
            </div>
          </el-col>
          <el-col :span="3" class="text-label">
            卸货地址：
          </el-col>
          <el-col :span="8" class="text-row">
            {{ form.waybillAddress?form.waybillAddress.unloadDetail:'-' }}
            <div>
              {{ form.waybillAddress?form.waybillAddress.unloadContact:'' }}
              {{ form.waybillAddress?form.waybillAddress.unloadContactPhone:'' }}
            </div>
          </el-col>
        </el-row>
        <!-- 运单轨迹 -->
        <div class="waybill-title"><div class="waybill-icon" />运单轨迹<div class="waybill-divider" /></div>
        <div class="g-aligncenter marginlr">
          <div v-for="(item, index) in timelineList" :key="index" class="g-aligncenter">
            <img v-if="index !== 0" class="process-arrow" src="@/assets/images/location/icon_arrow.png" alt="">
            <div class="g-directioncenter">
              <div :class="index === 0 ? 'process-ondate':'process-date'">{{ parseTime(item.updateTime, '{y}/{m}/{d}') }}</div>
              <div :class="index === 0 ? 'process-ontitle':'process-title'">{{ parseTime(item.updateTime, '{h}:{i}:{s}') }}</div>
              <img v-if="index === 0" class="process-onicon" src="@/assets/images/location/icon_now.png" alt="">
              <img v-else class="process-icon" src="@/assets/images/location/icon_circle.png" alt="">
              <div :class="index === 0 ? 'process-ontitle':'process-title'">{{ item.content }}</div>
            </div>
          </div>
        </div>
        <div v-if="sonList.length>0">
          <ChildList v-for="(item, index) in sonList" :key="index" :info="item" @refresh="handleDetail" />
        </div>
      </el-tab-pane>
      <el-tab-pane label="地图轨迹" name="second">
        <Track v-if="activeName === 'second'" :waybill="sonList" />
      </el-tab-pane>
    </el-tabs>
    <!-- 详情对话框 -->
    <child-detail
      :title="'分运单信息'"
      :open.sync="detailOpen"
      :current-id="detailCurrentId"
      :type="detailtype"
    />
  </el-drawer>
  <!-- </el-dialog> -->
</template>

<script>
import { getMultiDetail } from '@/api/waybill/manages'; // getWaybillComment  getWaybillAttachment
import ChildDetail from './ChildDetail';
import ChildList from './ChildList';
import Track from '../../components/MultimodeTrack';
export default {
  components: { Track, ChildDetail, ChildList }, // DataNull
  props: {
    title: {
      type: String,
      default: ''
    },
    open: Boolean,
    currentId: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      activeName: 'first',
      detailOpen: false,
      detailCurrentId: '',
      detailtype: '',
      // 表单参数
      form: {
        orderGoods: {},
        waybillAddress: {},
        waybillInfo: {},
        waybillBalanceInfo: {}
      },
      sonList: [],
      loading: false,
      timelineList: []
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
      getMultiDetail(this.currentId).then(response => {
        this.form.waybillInfo = response.data.waybillInfo || {};
        this.form.orderGoods = response.data.orderGoods || {};
        this.form.waybillAddress = response.data.waybillAddress || {};
        this.form.waybillBalanceInfo = response.data.waybillBalanceInfo || {};
        this.sonList = response.data.sonList;
        this.timelineList = response.data.waybillTraces;
        this.getTruckSonList();
        this.loading = false;
      }).catch(e => {
        this.loading = false;
      });
    },
    /** 详情按钮操作 */
    handleDetail(row) {
      this.detailCurrentId = row.wayBillCode;
      this.detailtype = row.mode;
      this.detailOpen = true;
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
      this.activeName = 'first';
      this.timelineList = [];
      this.sonList = [];
      this.form = {
        orderGoods: {},
        waybillInfo: {},
        waybillAddress: {},
        waybillBalanceInfo: {}
      };
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
.marginlr{
  margin: 0 35px 30px;
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
.waybill-mark{
  color: #ff4949;
  // font-size: 12px;
  margin: 0 0 10px 30px;
}
::v-deep .el-drawer__body{
  // padding: 0 20px;
  overflow-y: auto;
}
::v-deep .el-tabs__nav-wrap{
  padding: 0 20px;
}
.process-ondate{
  font-size: 12px;
  font-family: PingFang SC;
  font-weight: bold;
  line-height: 22px;
  color: #262626;
}
.process-date{
  font-size: 12px;
  font-family: PingFang SC;
  font-weight: bold;
  line-height: 22px;
  color: #7A8DA0;
}
.process-ontitle{
  font-size: 14px;
  font-family: PingFang SC;
  font-weight: bold;
  line-height: 22px;
  color: #262626;
}
.process-title{
  font-size: 14px;
  font-family: PingFang SC;
  font-weight: bold;
  line-height: 22px;
  color: #7A8DA0;
}
.process-onicon{
  width: 48px;
  height: 50px;
}
.process-icon{
  margin: 10px 0 17px;
  width: 20px;
  height: 20px;
}
.process-arrow{
  margin-top: 15px;
  width: 107px;
  height: 8px;
}
</style>>
