<template>
  <el-drawer
    size="70%"
    :title="title"
    :visible.sync="visible"
    direction="rtl"
    append-to-body
    destroy-on-close
    :before-close="cancel"
    class="page-shipment-manage-dialog"
  >
    <div class="waybill-title"><div class="waybill-icon" />运单<div class="waybill-divider" /></div>
    <el-row>
      <el-col :span="3" class="text-label">
        运单单号：
      </el-col>
      <el-col :span="5" class="text-row">
        {{ form.waybillNo || '-' }}
      </el-col>
      <el-col :span="3" class="text-label">
        状态：
      </el-col>
      <el-col :span="5" class="text-row">
        <span v-if="form.isAbnormal === 1" class="g-color-error">● 异常</span>
        <span v-else class="g-color-success">● 正常</span>
      </el-col>
      <el-col :span="3" class="text-label">
        物流状态：
      </el-col>
      <el-col :span="5" class="text-row">
        {{ form.statusName || '-' }}
      </el-col>
      <el-col :span="3" class="text-label">
        装货数量：
      </el-col>
      <el-col :span="5" class="text-row">
        <span v-if="form.stowageStatus === '1'">{{ fixed(form.loadWeight) || '0.000' }} 方</span>
        <span v-if="form.stowageStatus === '2'">{{ Math.floor(form.loadWeight) || '0' }} 车</span>
        <span v-if="form.stowageStatus === '0' || !form.stowageStatus">{{ fixed(form.loadWeight) || '0.000' }} 吨</span>
      </el-col>
      <el-col :span="3" class="text-label">
        卸货数量：
      </el-col>
      <el-col :span="5" class="text-row">
        <span v-if="form.stowageStatus === '1'">{{ fixed(form.unloadWeight) || '0.000' }} 方</span>
        <span v-if="form.stowageStatus === '2'">{{ Math.floor(form.unloadWeight) || '0' }} 车</span>
        <span v-if="form.stowageStatus === '0' || !form.stowageStatus">{{ fixed(form.unloadWeight) || '0.000' }} 吨</span>
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
        公里数：
      </el-col>
      <el-col :span="5" class="text-row">
        {{ form.mileage || '0.00' }}
      </el-col>
      <el-col :span="3" class="text-label">
        运单总价(元)：
      </el-col>
      <el-col :span="5" class="text-row">
        {{ floor(form.balanceVo.shipperRealPay) || '0.00' }}
      </el-col>
      <!-- <el-col :span="3" class="text-label">
        司机实收金额(元)：
      </el-col>
      <el-col :span="5" class="text-row">
        {{ floor(form.balanceVo.deliveryCashFee) || '0.00' }}
      </el-col>
      <el-col :span="3" class="text-label">
        司机实收运费(元)：
      </el-col>
      <el-col :span="5" class="text-row">
        {{ floor(form.balanceVo.deliveryFeePractical) || '0.00' }}
      </el-col>
      <el-col :span="3" class="text-label">
        司机应收运费(元)：
      </el-col>
      <el-col :span="5" class="text-row">
        {{ floor(form.balanceVo.deliveryFeeDeserved) || '0.00' }}
      </el-col>
      <el-col :span="3" class="text-label">
        平台服务费用(元)：
      </el-col>
      <el-col :span="5" class="text-row">
        {{ floor(form.balanceVo.serviceFee) || '0.00' }}
      </el-col>
      <el-col :span="3" class="text-label">
        不含税价(元)：
      </el-col>
      <el-col :span="5" class="text-row">
        {{ floor(form.balanceVo.taxFreeFee) || '0.00' }}
      </el-col>
      <el-col :span="3" class="text-label">
        纳税金额(元)：
      </el-col>
      <el-col :span="5" class="text-row">
        {{ floor(form.balanceVo.taxPayment) || '0.00' }}
      </el-col>
      <el-col :span="3" class="text-label">
        路耗(元)：
      </el-col>
      <el-col :span="5" class="text-row">
        {{ floor(form.balanceVo.lossDeductionFee) || '0.00' }}
      </el-col> -->

      <!-- <div v-for="(item, index) in freightList" :key="index">
        <el-col :span="3" class="text-label">
          {{ item.cnName }}：
        </el-col>
        <el-col :span="5" class="text-row">
          {{ floor(item.ruleValue) || '0.00' }}
        </el-col>
      </div> -->
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
    <div class="waybill-title"><div class="waybill-icon" />轨迹<div class="waybill-divider" /></div>
    <div v-if="form.code" style="width:100%;padding: 0 30px;overflow: hidden; margin-bottom: 10px;">
      <Track :waybill="sonList" />
    </div>
  </el-drawer>
</template>

<script>
import { getWayBill } from '@/api/waybill/manages'; // getWaybillComment
// import { jimiTrackLocation } from '@/api/waybill/tracklist';
// import DataNull from '@/components/DataNull/index';
import Track from '../../components/MultimodeTrack';
export default {
  components: { Track }, // DataNull
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
    type: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      activeName: 'first',
      // 表单参数
      form: {
        waybillAddress: {},
        // unloadAddress: {},
        balanceVo: {}
      },
      freightList: [],
      // formCommentDriver: {},
      // formCommentShipment: {},
      // timeLineList: [],
      loading: false,
      sonList: [{
        mtransMode: null,
        waybillAddressList: []
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
        this.sonList[0].mtransMode = this.type;
        this.sonList[0].waybillAddressList.push(response.data.waybillAddress);
        this.form = response.data || {};
        this.form.waybillAddress = response.data.waybillAddress || {};
        this.form.balanceVo = response.data.balanceVo || {};
        this.freightList = response.data.freightList.filter(e => {
          const bool = (e.ruleItemCode === '6' || e.ruleItemCode === '11' || e.ruleItemCode === '12' || e.ruleItemCode === '13' || e.ruleItemCode === '14' || e.ruleItemCode === '15' || e.ruleItemCode === '16');
          return bool;
        });
        // console.log(this.freightList);
        this.loading = false;
      }).catch(e => {
        this.loading = false;
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
      this.activeName = 'first';
      this.form = {
        loadAddress: {},
        unloadAddress: {},
        balanceVo: {}
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
