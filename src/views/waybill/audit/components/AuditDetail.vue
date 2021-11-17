<template>
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
    <el-row>
      <el-col :span="18">
        <div v-if="form.code" style="height:880px;width:100%;padding: 0 30px;overflow: hidden;">
          <Track :waybill="form" />
          <div class="waybill-detail-frame">
            <div class="waybill-detail-card">
              <div class="waybill-title" style="justify-content: space-between; border-bottom: 1px solid #F5F5F5;">
                <div class="g-aligncenter">
                  <div class="waybill-icon" />费用<span class="waybill-unit">单位（元）</span>
                </div>
                <el-row v-if="form.balanceVo.ruleFormulaDictLabel" class="waybill-mark">
                  注：{{ form.balanceVo.ruleFormulaDictLabel }}（{{ form.balanceVo.driverRealFeeStr }}）
                </el-row>
              </div>
              <el-row>
                <el-col :span="3" class="text-label">
                  货主实付金额(元)：
                </el-col>
                <el-col :span="5" class="text-row">
                  {{ floor(form.balanceVo.shipperRealPay) || '0.00' }}
                </el-col>
                <el-col :span="3" class="text-label">
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
                  留存运费(元)：
                </el-col>
                <el-col :span="5" class="text-row">
                  {{ floor(form.balanceVo.taxPayment) || '0.00' }}
                </el-col>
                <el-col :span="3" class="text-label">
                  路耗(元)：
                </el-col>
                <el-col :span="5" class="text-row">
                  {{ floor(form.balanceVo.lossDeductionFee) || '0.00' }}
                </el-col>

                <div v-for="(item, index) in freightList" :key="index">
                  <el-col :span="3" class="text-label">
                    {{ item.cnName }}：
                  </el-col>
                  <el-col :span="5" class="text-row">
                    {{ floor(item.ruleValue) || '0.00' }}
                  </el-col>
                </div>
              </el-row>
            </div>
          </div>

        </div>
      </el-col>
      <el-col :span="6">
        <div class="waybill-title"><div class="waybill-icon" />货源信息</div>
        <el-row>
          <el-col :span="4" class="text-label">
            货主：
          </el-col>
          <el-col :span="20" class="text-row">
            {{ form.shipmentInfo? form.shipmentInfo.companyName:'-' }}
          </el-col>
          <el-col :span="4" class="text-label">
            货物大类：
          </el-col>
          <el-col :span="8" class="text-row">
            {{ form.goodsBigType || '-' }}
          </el-col>
          <el-col :span="4" class="text-label">
            货物小类：
          </el-col>
          <el-col :span="8" class="text-row">
            {{ form.goodsType || '-' }}
          </el-col>
        </el-row>

        <div class="waybill-title"><div class="waybill-icon" />运单信息 <span class="g-color-blue">（{{ form.statusName }}）</span></div>
        <el-row v-viewer>
          <el-col :span="4" class="text-label">
            运单单号：
          </el-col>
          <el-col :span="20" class="text-row">
            {{ form.waybillNo || '-' }}
          </el-col>
          <el-col :span="4" class="text-label">
            司机：
          </el-col>
          <el-col :span="20" class="text-row">
            <span style="margin-right: 10px;">{{ form.driverName || '-' }}</span>
            <span>{{ form.driverPhone || '-' }}</span>
          </el-col>
          <el-col :span="4" class="text-label">
            车牌号：
          </el-col>
          <el-col :span="8" class="text-row">
            {{ form.licenseNumber || '-' }}
          </el-col>
          <el-col :span="4" class="text-label">
            公里数：
          </el-col>
          <el-col :span="8" class="text-row">
            {{ form.mileage || '-' }}
          </el-col>
          <el-col :span="4" class="text-label">
            运单备注：
          </el-col>
          <el-col :span="20" class="text-row">
            {{ form.shipperRemark || '-' }}
          </el-col>
          <!-- 装货信息 -->
          <el-col :span="2" class="padding-top">
            <svg-icon icon-class="detail-iload" class="text-img" />
          </el-col>
          <el-col :span="16">
            <el-tooltip class="item" effect="light" :content="form.waybillAddress?form.waybillAddress.loadFormattedAddress:'-'" placement="bottom">
              <div class="text-row" style="margin-bottom:0;">{{ form.waybillAddress?form.waybillAddress.loadFormattedAddress:'-' }}</div>
            </el-tooltip>
            <div class="text-time">装货时间：{{ form.fillTime || '-' }}</div>
          </el-col>
          <el-col :span="6" class="padding-top">
            <span v-if="form.stowageStatus === '1'" class="text-num">{{ fixed(form.loadWeight) || '0.000' }} 方</span>
            <span v-if="form.stowageStatus === '2'" class="text-num">{{ Math.floor(form.loadWeight) || '0' }} 车</span>
            <span v-if="form.stowageStatus === '0' || !form.stowageStatus" class="text-num">{{ fixed(form.loadWeight) || '0.000' }} 吨</span>
          </el-col>
          <el-col :span="22" :offset="2" class="img-frame">
            <div v-for="(url, index) in formAttachmentUrl" :key="index">
              <img :src="url ? url:''" class="img-box">
            </div>
            <DataNull v-if="formAttachmentUrl.length === 0" :null-title="'暂无装货凭证'" class="img-box" />
          </el-col>
          <!-- 卸货信息 -->
          <el-col :span="2" class="padding-top">
            <svg-icon icon-class="detail-iunload" class="text-img" />
          </el-col>
          <el-col :span="16">
            <el-tooltip class="item" effect="light" :content="form.waybillAddress?form.waybillAddress.unloadFormattedAddress:'-'" placement="bottom">
              <div class="text-row" style="margin-bottom:0;">{{ form.waybillAddress?form.waybillAddress.unloadFormattedAddress:'-' }}</div>
            </el-tooltip>
            <div class="text-time">卸货时间：{{ form.signTime || '-' }}</div>
          </el-col>
          <el-col :span="6" class="padding-top">
            <span v-if="form.stowageStatus === '1'" class="text-num">{{ fixed(form.unloadWeight) || '0.000' }} 方</span>
            <span v-if="form.stowageStatus === '2'" class="text-num">{{ Math.floor(form.unloadWeight) || '0' }} 车</span>
            <span v-if="form.stowageStatus === '0' || !form.stowageStatus" class="text-num">{{ fixed(form.unloadWeight) || '0.000' }} 吨</span>
          </el-col>
          <el-col :span="22" :offset="2" class="img-frame">
            <div v-for="(url, index) in formAttachmentUpUrl" :key="index">
              <img :src="url ? url:''" class="img-box">
            </div>
            <DataNull v-if="formAttachmentUpUrl.length === 0" :null-title="'暂无卸货凭证'" class="img-box" />
          </el-col>
        </el-row>

        <div class="waybill-title"><div class="waybill-icon" />稽核</div>
        <el-tabs v-model="activeName">
          <el-tab-pane label="轨迹情况" name="first">
            <el-select
              v-model="trackSituationForm[0].situation"
              placeholder="请选择轨迹情况"
              clearable
              filterable
              size="small"
              style="width: 90%;margin-bottom: 10px;"
            >
              <el-option
                v-for="dict in trackOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
            <el-button
              type="primary"
              icon="el-icon-document-checked"
              size="mini"
              :loading="loadingBtn"
              @click="handleMark(trackSituationForm)"
            >确认稽核轨迹</el-button>
          </el-tab-pane>
          <el-tab-pane label="磅单情况" name="second">
            <el-select
              v-model="receiptSituation"
              placeholder="请选择磅单情况"
              clearable
              multiple
              collapse-tags
              filterable
              size="small"
              style="width: 90%;margin-bottom: 10px;"
              @change="handleReceiptChange"
            >
              <el-option
                v-for="dict in receiptSituationOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
            <el-button
              type="primary"
              icon="el-icon-document-checked"
              size="mini"
              :loading="loadingBtn"
              @click="handleMark(receiptSituationForm)"
            >确认稽核磅单</el-button>
          </el-tab-pane>
          <el-tab-pane label="装卸情况" name="third">
            <el-select
              v-model="loadUnloadSituation"
              placeholder="请选择装卸情况"
              clearable
              multiple
              collapse-tags
              filterable
              size="small"
              style="width: 90%;margin-bottom: 10px;"
              @change="handleLoadUnloadChange"
            >
              <el-option
                v-for="dict in loadUnloadSituationOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
            <el-button
              type="primary"
              icon="el-icon-document-checked"
              size="mini"
              :loading="loadingBtn"
              @click="handleMark(loadUnloadSituationForm)"
            >确认稽核装卸</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
  </el-drawer>
</template>

<script>
import { getWayBill, getWaybillAttachment, waybillInspectSave, findInspect } from '@/api/waybill/audit';
// import { jimiTrackLocation } from '@/api/waybill/tracklist';
import DataNull from '@/components/DataNull/index';
import Track from '../../components/track.vue';
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
        balanceVo: {},
        shipmentInfo: {}
      },
      freightList: [],
      formAttachment: {},
      formAttachmentUrl: [],
      formAttachmentUp: {},
      formAttachmentUpUrl: [],
      // timeLineList: [],
      loading: false,
      activeName: 'first',
      // 轨迹稽核情况
      trackOptions: [],
      receiptSituationOptions: [],
      loadUnloadSituationOptions: [],
      receiptSituation: [],
      loadUnloadSituation: [],
      trackSituationForm: [{
        situation: undefined,
        userGradeKpiId: 1,
        waybillCode: undefined
      }],
      receiptSituationForm: [{
        situation: undefined,
        userGradeKpiId: 2,
        waybillCode: undefined
      }],
      loadUnloadSituationForm: [{
        situation: undefined,
        userGradeKpiId: 3,
        waybillCode: undefined
      }],
      loadingBtn: false
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
      // 稽核情况字典获取
      this.getDicts('situation_track').then(response => {
        this.trackOptions = response.data;
      });
      this.getDicts('situation_load_unload').then(response => {
        this.loadUnloadSituationOptions = response.data;
      });
      this.getDicts('situation_receipt').then(response => {
        this.receiptSituationOptions = response.data;
      });
      this.trackSituationForm[0].waybillCode = this.currentId;
      this.receiptSituationForm[0].waybillCode = this.currentId;
      this.loadUnloadSituationForm[0].waybillCode = this.currentId;
      // 稽核情况
      findInspect(this.currentId).then(res => {
        const trackIndex = res.data.findIndex(item => item.userGradeKpiId === 1);
        const receiptIndex = res.data.findIndex(item => item.userGradeKpiId === 2);
        const loadUnloadIndex = res.data.findIndex(item => item.userGradeKpiId === 3);
        // console.log(trackIndex, receiptIndex, loadUnloadIndex);
        this.trackSituationForm[0].situation = trackIndex === -1 ? '' : res.data[trackIndex].situation;
        this.receiptSituationForm[0].situation = receiptIndex === -1 ? '' : res.data[receiptIndex].situation;
        this.loadUnloadSituationForm[0].situation = loadUnloadIndex === -1 ? '' : res.data[loadUnloadIndex].situation;
        // console.log(res.data);
        this.receiptSituation = receiptIndex === -1 ? [] : res.data[receiptIndex].situation.split(',');
        this.loadUnloadSituation = loadUnloadIndex === -1 ? [] : res.data[loadUnloadIndex].situation.split(',');
        // console.log(this.receiptSituation, this.loadUnloadSituation);
      });
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
        // console.log(this.freightList);
        this.loading = false;
      }).catch(e => {
        this.loading = false;
      });
      // 回单-装货
      getWaybillAttachment(this.currentId, 1).then(response => {
        // console.log(response);
        this.formAttachment = response.data ? response.data[0] : null;
        if (this.formAttachment) {
          this.formAttachmentUrl = this.formAttachment.attachUrlList ? this.formAttachment.attachUrlList : [];
        }
      });
      // 回单-卸货
      getWaybillAttachment(this.currentId, 2).then(response => {
        // console.log(response);
        this.formAttachmentUp = response.data ? response.data[0] : null;
        if (this.formAttachmentUp) {
          this.formAttachmentUpUrl = this.formAttachmentUp.attachUrlList ? this.formAttachmentUp.attachUrlList : [];
        }
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
      this.formAttachmentUpUrl = [];
      this.formAttachment = {};
      this.formAttachmentUp = {};
      this.formCommentDriver = {};
      this.formCommentShipment = {};
      this.receiptSituation = [];
      this.loadUnloadSituation = [];
      this.loadUnloadSituation = [];
    },
    handleMark(form) {
      this.loadingBtn = true;
      waybillInspectSave(form).then(() => {
        this.msgSuccess('稽核成功');
        this.$emit('refresh');
        this.loadingBtn = false;
      });
    },
    handleReceiptChange(value) {
      this.receiptSituationForm[0].situation = value.join(',');
    },
    handleLoadUnloadChange(value) {
      this.loadUnloadSituationForm[0].situation = value.join(',');
    }
  }
};
</script>

<style lang="scss" scope>
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
.padding-top{
  padding-top: 10px;
}
.text-img{
  height: 20px;
  width: 22px;
}
.text-num{
  background: #EDF5FE;
  border-radius: 4px;
  font-weight: bold;
  color: #20273A;
  padding: 4px 10px;
}
.text-time{
  font-family: PingFang SC;
  font-weight: 400;
  // line-height: 22px;
  color: #909398;
}
.text-row{
  font-family: PingFang SC;
  font-weight: bold;
  line-height: 22px;
  color: #20273A;
  margin-bottom: 12px;
  overflow: hidden; //超出隐藏
  white-space: nowrap; //
  text-overflow: ellipsis;
}
.text-label{
  text-align: end;
  font-family: PingFang SC;
  font-weight: 400;
  line-height: 22px;
  color: #909398;
}
.img-frame{
  overflow-x: scroll;
  display: flex;
}
.img-box{
  margin: 5px 5px 0 0;
  width: 150px;
  height: 120px;
  vertical-align: top;
  object-fit: contain;
  border-radius: 6px;
  border: 1px dashed #dddddd;
}
// 轨迹-运单详情卡片
.waybill-detail-frame{
  position: relative;
  bottom: 225px;
  left: 10px;
  height: 0;
  z-index: 999;
}
.waybill-detail-card{
  width: calc(100% - 20px);;
  background: rgba(255, 255, 255, 0.9);
  padding: 15px;
  box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.16);
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
  margin: 0 0 15px;
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
.waybill-unit{
  margin-left: 10px;
  color: #909398;
  font-weight: 400;
}
.waybill-mark{
  font-size: 12px;
  font-weight: 400;
  color: #F56C6C;
  margin: 0 0 10px 30px;
}
 ::v-deep .el-drawer__body{
    // padding: 0 20px;
    overflow-y: auto;
}
</style>>
