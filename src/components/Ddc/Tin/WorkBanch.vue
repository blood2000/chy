<template>
  <div class="g-color-title" :class="width<=1366 ? 'minworkbanch' : 'workbanch'">
    <div class="top-tips g-aligncenter">
      <img class="marginright10" src="~@/assets/images/workbench/icon_notice.png" alt="">
      <img v-if="width>1366" class="marginright10" src="~@/assets/images/workbench/font_notice.png" alt="">
      <span class="notic-tip g-color-gray">
        <NoticeCard :lists="noticeList2" />
      </span>
    </div>

    <div class="content-frame g-flex">
      <div class="left-frame">
        <div class="g-flex">
          <!-- 用户信息 -->
          <div class="index-frame user-frame g-aligncenter">
            <img v-if="user.avatar != null" class="user-avator" :src="user.avatar">
            <img v-else class="user-avator" src="~@/assets/images/workbench/icon_noavator.png">
            <div class="user-info">
              <div class="g-strong g-title-big">{{ user.nickName }}</div>
              <div class="user-post g-margin-tb">
                <img src="~@/assets/images/workbench/icon_position.png" style="margin-right: 10px;" alt="">
                {{ user.roles[0].roleName }}
              </div>
              <div class="g-color-tag">{{ user.org.orgName }}</div>
            </div>
          </div>
          <!-- 便捷导航 -->
          <div class="index-frame nav-frame g-flexaround">
            <div v-for="(item, index) in navList" :key="index" class="g-directioncenter width10" @click="handleNav(item.name)">
              <div v-once class="nav-icon" :class="'icon-' + item.name" />
              <div class="g-strong margintop5">{{ item.label }}</div>
            </div>
          </div>
        </div>
        <div class="g-flex middle-frame">
          <!-- 货单 -->
          <div class="index-frame order-frame g-directionbetween">
            <div>
              <div class="g-aligncenter">
                <img class="statistic-img" src="~@/assets/images/workbench/icon_waybillnum.png" alt="">
                <div class="g-color-blue g-strong">货单统计</div>
              </div>
              <div class="g-flex g-justifybetween g-alignend">
                <div class="g-directioncenter margintop15" style="width: 70%;">
                  <div class="g-title-smaller">
                    <div>今日货单</div>
                    <div>
                      <span class="g-strong g-title-max"><count-to :end-val="statistic.order?statistic.order.newOrder:0" :decimal-places="0" /></span>
                      单
                    </div>
                    <div class="g-color-tag">货单总数 / <count-to :end-val="statistic.order?statistic.order.orderCount:0" :decimal-places="0" /> 单</div>
                  </div>
                </div>
                <img class="waybill-bg" src="~@/assets/images/workbench/icon_waybillbg.png" alt="">
              </div>
            </div>
            <div class="g-flex g-justifybetween g-title-smaller">
              <div class="statistic-frame">
                <div>发布中货单</div>
                <div class="g-color-tag">
                  <span class="g-color-title g-strong g-title-large"><count-to :end-val="statistic.order?statistic.order.publishedCount:0" :decimal-places="0" /></span>
                  单
                </div>
                <img class="order-img" src="~@/assets/images/workbench/icon_publishorder.png" alt="">
              </div>
              <div class="statistic-frame">
                <div>已关闭货单</div>
                <div class="g-color-tag">
                  <span class="g-color-title g-strong g-title-large"><count-to :end-val="statistic.order?statistic.order.soldOut:0" :decimal-places="0" /></span>
                  单
                </div>
                <img class="order-img" src="~@/assets/images/workbench/icon_closeorder.png" alt="">
              </div>
            </div>
          </div>
          <!-- 发票 -->
          <div class="index-frame invoice-frame g-directionbetween">
            <div>
              <div class="g-aligncenter">
                <img class="statistic-img" src="~@/assets/images/workbench/icon_waybillnum.png" alt="">
                <div class="g-color-blue g-strong">发票统计</div>
              </div>
              <div class="g-flex g-justifybetween g-alignend">
                <div class="g-directioncenter margintop15" style="width: 70%;">
                  <div class="g-title-smaller">
                    <div>今日发票</div>
                    <div>
                      <span class="g-strong g-title-max"><count-to :end-val="statistic.invoice?statistic.invoice.newInvoiceCount:0" :decimal-places="0" /></span>
                      票
                    </div>
                    <div class="g-color-tag">发票总数 / <count-to :end-val="statistic.invoice?statistic.invoice.invoiceCount:0" :decimal-places="0" /> 票</div>
                  </div>
                </div>
                <img class="waybill-bg" src="~@/assets/images/workbench/icon_waybillbg.png" alt="">
              </div>
            </div>
            <div class="g-flex g-justifybetween g-title-smaller">
              <div class="statistic-frame">
                <div>今日已索票</div>
                <div class="g-color-tag">
                  <span class="g-color-title g-strong g-title-large"><count-to :end-val="statistic.invoice?statistic.invoice.applyInvoiceCount:0" :decimal-places="0" /></span>
                  单
                </div>
                <img class="order-img" src="~@/assets/images/workbench/icon_ask.png" alt="">
              </div>
              <div class="statistic-frame">
                <div>今日已审核</div>
                <div class="g-color-tag">
                  <span class="g-color-title g-strong g-title-large"><count-to :end-val="statistic.invoice?statistic.invoice.auditInvoiceCount:0" :decimal-places="0" /></span>
                  单
                </div>
                <img class="order-img" src="~@/assets/images/workbench/icon_examine.png" alt="">
              </div>
              <div class="statistic-frame">
                <div>今日已开票</div>
                <div class="g-color-tag">
                  <span class="g-color-title g-strong g-title-large"><count-to :end-val="statistic.invoice?statistic.invoice.openInvoiceCount:0" :decimal-places="0" /></span>
                  单
                </div>
                <img class="order-img" src="~@/assets/images/workbench/icon_onbilling.png" alt="">
              </div>
            </div>
          </div>
          <!-- 运单 -->
          <div class="index-frame way-frame g-directionbetween">
            <div>
              <div class="g-aligncenter">
                <img class="statistic-img" src="~@/assets/images/workbench/icon_waybillnum.png" alt="">
                <div class="g-color-blue g-strong">运单统计</div>
              </div>
              <div class="g-flex g-justifybetween g-alignend">
                <div class="g-directioncenter margintop15" style="width: 70%;">
                  <div class="g-title-smaller">
                    <div>今日运单</div>
                    <div>
                      <span class="g-strong g-title-max"><count-to :end-val="statistic.waybill?statistic.waybill.newWaybillCount:0" :decimal-places="0" /></span>
                      单
                    </div>
                    <div class="g-color-tag">运单总数 / <count-to :end-val="statistic.waybill?statistic.waybill.waybillCount:0" :decimal-places="0" /> 单</div>
                  </div>
                </div>
                <img class="waybill-bg" src="~@/assets/images/workbench/icon_waybillbg.png" alt="">
              </div>
            </div>
            <div class="waybill-frame g-title-smaller">
              <div class=" g-flex g-justifybetween">
                <div style="width: 100px">
                  <div><span class="g-color-blue">●</span> 今日已装货</div>
                  <div class="g-strong g-title-large" style="margin-left:10px"><count-to :end-val="statistic.waybill?statistic.waybill.orderLoading:0" :decimal-places="0" /></div>
                </div>
                <div style="width: 100px">
                  <div><span class="g-color-blue">●</span> 今日已卸货</div>
                  <div class="g-strong g-title-large" style="margin-left:10px"><count-to :end-val="statistic.waybill?statistic.waybill.orderUnload:0" :decimal-places="0" /></div>
                </div>
                <div style="width: 100px">
                  <div><span class="g-color-blue">●</span> 今日已复核</div>
                  <div class="g-strong g-title-large" style="margin-left:10px"><count-to :end-val="statistic.waybill?statistic.waybill.orderReviewer:0" :decimal-places="0" /></div>
                </div>
              </div>
              <div class=" g-flex g-justifybetween">
                <div style="width: 100px">
                  <div><span class="g-color-blue">●</span> 今日已结算</div>
                  <div class="g-strong g-title-large" style="margin-left:10px"><count-to :end-val="statistic.waybill?statistic.waybill.orderBalance:0" :decimal-places="0" /></div>
                </div>
                <div style="width: 100px">
                  <div><span class="g-color-blue">●</span> 今日已打款</div>
                  <div class="g-strong g-title-large" style="margin-left:10px"><count-to :end-val="statistic.waybill?statistic.waybill.orderRemit:0" :decimal-places="0" /></div>
                </div>
                <div style="width: 100px;text-align:end;">
                  <img class="waybill-img" src="~@/assets/images/workbench/icon_waybilling.png" alt="">
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="index-frame platform-frame">
          <!-- 平台概览 -->
          <div class="g-aligncenter" style="width:100%;height:100%">
            <div class="g-directioncenter" style="width:25%">
              <el-progress type="circle" :percentage="shipmentPersent" :stroke-width="width>1366 ? 15:10" :width="width>1366 ? 130:90" color="#409EFF" :show-text="false" />
              <div class="platform-num g-directioncenter">
                <div class="g-strong g-title-big"><count-to :end-val="statistic.user?statistic.user.shipmentCount:0" :decimal-places="0" /></div>
                <div>平台货主</div>
              </div>
              <div style="margin-top:10px;"><span class="g-color-blue marginright5">●</span>活跃货主</div>
              <div class="g-flex g-aligncenter g-justifyaround" style="width: 80%">
                <div>
                  <div class="g-strong g-title-big"><count-to :end-val="statistic.user?statistic.user.companyCount:0" :decimal-places="0" /></div>
                  <div class="g-color-tag">企业数</div>
                </div>
                <div>
                  <div class="g-strong g-title-big"><count-to :end-val="statistic.user?statistic.user.accountCount:0" :decimal-places="0" /></div>
                  <div class="g-color-tag">账号数</div>
                </div>
                <div>
                  <div class="g-strong g-title-big"><count-to :end-val="statistic.user?statistic.user.activeCompany:0" :decimal-places="0" /></div>
                  <div class="g-color-tag">活跃企业</div>
                </div>
              </div>
            </div>
            <div class="g-directioncenter" style="width:25%">
              <el-progress type="circle" :percentage="driverPersent" :stroke-width="width>1366 ? 15:10" :width="width>1366 ? 130:90" color="#40CBFF" :show-text="false" />
              <div class="platform-num g-directioncenter">
                <div class="g-strong g-title-big"><count-to :end-val="statistic.user?statistic.user.driverCount:0" :decimal-places="0" /></div>
                <div>平台司机</div>
              </div>
              <div style="margin-top:10px;"><span class="g-color-blue marginright5">●</span>活跃司机</div>
              <div class="g-flex g-aligncenter g-justifyaround" style="width: 80%">
                <div>
                  <div class="g-strong g-title-big"><count-to :end-val="statistic.user?statistic.user.temporaryDriver:0" :decimal-places="0" /></div>
                  <div class="g-color-tag">零散司机</div>
                </div>
                <div>
                  <div class="g-strong g-title-big"><count-to :end-val="statistic.user?statistic.user.employmentDriver:0" :decimal-places="0" /></div>
                  <div class="g-color-tag">聘用司机</div>
                </div>
                <div>
                  <div class="g-strong g-title-big"><count-to :end-val="statistic.user?statistic.user.activeDriver:0" :decimal-places="0" /></div>
                  <div class="g-color-tag">活跃司机</div>
                </div>
              </div>
            </div>
            <div class="g-directioncenter" style="width:25%">
              <el-progress type="circle" :percentage="vehiclePersent" :stroke-width="width>1366 ? 15:10" :width="width>1366 ? 130:90" color="#67C23A" :show-text="false" />
              <div class="platform-num g-directioncenter">
                <div class="g-strong g-title-big"><count-to :end-val="statistic.user?statistic.user.vehicleCount:0" :decimal-places="0" /></div>
                <div>平台车辆</div>
              </div>
              <div style="margin-top:10px;"><span class="g-color-success marginright5">●</span>活跃车辆</div>
              <div class="g-flex g-aligncenter g-justifyaround" style="width: 80%">
                <div>
                  <div class="g-strong g-title-big"><count-to :end-val="statistic.user?statistic.user.activeVehicle:0" :decimal-places="0" /></div>
                  <div class="g-color-tag">活跃车辆</div>
                </div>
              </div>
            </div>
            <div class="g-directioncenter" style="width:25%">
              <el-progress type="circle" :percentage="teamPersent" :stroke-width="width>1366 ? 15:10" :width="width>1366 ? 130:90" color="#FFBB00" :show-text="false" />
              <div class="platform-num g-directioncenter">
                <div class="g-strong g-title-big"><count-to :end-val="statistic.user?statistic.user.teamCount:0" :decimal-places="0" /></div>
                <div>平台调度者</div>
              </div>
              <div style="margin-top:10px;"><span class="g-color-warning marginright5">●</span>活跃调度者</div>
              <div class="g-flex g-aligncenter g-justifyaround" style="width: 80%">
                <div>
                  <div class="g-strong g-title-big"><count-to :end-val="statistic.user?statistic.user.activeTeam:0" :decimal-places="0" /></div>
                  <div class="g-color-tag">活跃调度者</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="index-frame active-frame">
        <!-- 动态 -->
        <div style="height:100%;">
          <div>
            <el-calendar v-model="value" />
          </div>
          <el-row class="trend-tab">
            <el-col :span="6">
              <div :class="activeName === '1' ? 'trend-onbottom': 'trend-bottom'" @click="handleClick('1')">运单动态</div>
            </el-col>
            <el-col :span="6">
              <div :class="activeName === '2' ? 'trend-onbottom': 'trend-bottom'" @click="handleClick('2')">货单动态</div>
            </el-col>
            <el-col :span="6">
              <div :class="activeName === '3' ? 'trend-onbottom': 'trend-bottom'" @click="handleClick('3')">发票动态</div>
            </el-col>
            <el-col :span="6">
              <div :class="activeName === '4' ? 'trend-onbottom': 'trend-bottom'" @click="handleClick('4')">消息通知</div>
            </el-col>
          </el-row>

          <ul v-infinite-scroll="loadmore" infinite-scroll-delay="500" :infinite-scroll-disabled="disabled" class="trend-frame">
            <!-- 运单动态 -->
            <div v-if="activeName === '1'" class="cursor-point">
              <li v-for="(item, index) in waybillList" :key="index" class="trend-content g-flex g-alignend" @click="handleWaybill(item)">
                <div style="margin-right: 12px;width:51px;">
                  <div class="g-color-tag g-title-smaller">{{ parseTime(item.wayBillUpdateTime, '{m}月{d}日') }}</div>
                  <div class="g-strong margintop5">{{ parseTime(item.wayBillUpdateTime, '{h}:{i}') }}</div>
                </div>
                <span class="g-color-blue marginright5">●</span>
                <div v-if="index != 0" class="trend-line" />
                <div style="margin-left: 12px;">
                  <div class="g-color-tag g-title-smaller">余晨望</div>
                  <div class="active-cont ellipsis g-strong">
                    <span v-if="item.status === '1'">已接单</span>
                    <span v-if="item.status === '2'">已装货</span>
                    <span v-if="item.status === '3'">已卸货</span>
                    <span v-if="item.status === '4'">已回单</span>
                    <span v-if="item.status === '5'">已结算</span>
                    <span v-if="item.status === '6'">申请打款</span>
                    <span v-if="item.status === '7'">已打款</span>
                    （{{ item.waybillNo }}）
                  </div>
                </div>
              </li>
            </div>
            <!-- 货单动态 -->
            <div v-if="activeName === '2'">
              <li v-for="(item, index) in orderList" :key="index" class="trend-content g-flex g-alignend" @click="handleOrder(item)">
                <div style="margin-right: 12px;width:51px;">
                  <div class="g-color-tag g-title-smaller">{{ parseTime(item.redisOrderInfoListVoList[0].createTime, '{m}月{d}日') }}</div>
                  <div class="g-strong margintop5">{{ parseTime(item.redisOrderInfoListVoList[0].createTime, '{h}:{i}') }}</div>
                </div>
                <span class="g-color-blue marginright5">●</span>
                <div v-if="index != 0" class="trend-line" />
                <div style="margin-left: 12px;">
                  <div class="g-color-tag g-title-smaller">{{ item.redisOrderInfoListVoList[0].adminName }}</div>
                  <div class="active-cont ellipsis g-strong">发布货源（{{ item.redisOrderInfoListVoList[0].mainOrderNumber }}）</div>
                </div>
              </li>
            </div>
            <!-- 发票动态 -->
            <div v-if="activeName === '3'">
              <li v-for="(item, index) in billList" :key="index" class="trend-content g-flex g-alignend" @click="handleInvoice(item)">
                <div style="margin-right: 12px;width:51px;">
                  <div class="g-color-tag g-title-smaller">{{ parseTime(item.invoiceApplyTime, '{m}月{d}日') }}</div>
                  <div class="g-strong margintop5">{{ parseTime(item.invoiceApplyTime, '{h}:{i}') }}</div>
                </div>
                <span class="g-color-blue marginright5">●</span>
                <div v-if="index != 0" class="trend-line" />
                <div style="margin-left: 12px;">
                  <div class="g-color-tag g-title-smaller">余晨望</div>
                  <div class="active-cont ellipsis g-strong">
                    <span v-if="item.invoiceStatus === '1'">货主申请开票</span>
                    <span v-if="item.invoiceStatus === '2'">货主已取消</span>
                    <span v-if="item.invoiceStatus === '3'">审核不通过</span>
                    <span v-if="item.invoiceStatus === '4'">审核通过</span>
                    <span v-if="item.invoiceStatus === '5'">已开票</span>
                    （{{ item.askForNo }}）
                  </div>
                </div>
              </li>
            </div>
            <!-- 消息通知 -->
            <div v-if="activeName === '4'">
              <li v-for="(item, index) in noticeList1" :key="index" class="trend-content g-flex g-alignend">
                <div style="margin-right: 12px;width:51px;">
                  <div class="g-color-tag g-title-smaller">{{ parseTime(item.createTime, '{m}月{d}日') }}</div>
                  <div class="g-strong margintop5">{{ parseTime(item.createTime, '{h}:{i}') }}</div>
                </div>
                <span class="g-color-blue marginright5">●</span>
                <div v-if="index != 0" class="trend-line" />
                <div style="margin-left: 12px;">
                  <div class="g-color-tag g-title-smaller">{{ item.remark }}</div>
                  <div class="active-cont ellipsis g-strong" v-html="item.noticeContent" />
                </div>
              </li>
            </div>
            <li v-if="loading" class="g-flex g-justifycenter">加载中...</li>
            <li v-if="dataOver" class="g-flex g-justifycenter">没有更多了</li>
          </ul>
          <div class="notice-bottom" />
        </div>
      </div>
    </div>
    <!-- 运单详情 对话框 -->
    <detail-dialog ref="DetailDialog" :current-id="currentId" :title="title" :open.sync="open" :disable="formDisable" />
  </div>
</template>

<script>
import { getUserInfo } from '@/utils/auth';
import { listNoticeAll } from '@/api/system/notice';
import { statisticInfo, waybillList, orderList, billList } from '@/api/workBanch';
import CountTo from '@/components/CountTo';
// 运单详情弹窗
import DetailDialog from '@/views/waybill/components/detailDialog';
// 运单详情弹窗
import NoticeCard from './NoticeCard';
// import { color } from 'echarts';
export default {
  name: 'Index',
  components: { DetailDialog, NoticeCard, CountTo },
  props: {
    width: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      activeName: '1',
      // 账号信息
      isAdmin: false,
      isShipment: false,
      user: {},
      shipment: {},
      // 通知列表
      noticeList1: [],
      // 公告列表
      noticeList2: [],
      // websocket参数
      websock: null,
      // 弹框 内容
      open: false,
      title: '',
      // 当前选中的运单id
      currentId: null,
      // 表单是否禁用
      formDisable: false,
      // 选中时间
      value: new Date(),
      dataTime: null,
      queryParams: {
        pageNum: 1,
        pageSize: 15
        // updateTime: null
      },
      // 动态列表
      waybillList: [],
      orderList: [],
      billList: [],
      // 是否全部加载
      dataOver: false,
      // 加载中
      loading: false,
      // 禁用加载
      disabled: true,
      // 统计数据
      statistic: {},
      shipmentPersent: 0,
      driverPersent: 0,
      vehiclePersent: 0,
      teamPersent: 0,
      navList: [{
        label: '新增企业',
        name: 'Shipment'
      }, {
        label: '数据上报',
        name: 'Report'
      }, {
        label: '发布货源',
        name: 'Release'
      }, {
        label: '新增运单',
        name: 'Supplement'
      }, {
        label: '运单管理',
        name: 'Manages'
      }, {
        label: '开具发票',
        name: 'Askfor'
      }, {
        label: '发票列表',
        name: 'List'
      }, {
        label: '运单投诉',
        name: 'Complaint'
      }]
    };
  },
  watch: {
    value(val) {
      this.dataTime = this.parseTime(val, '{y}-{m}-{d}');
      // console.log(this.dataTime);
      this.getStatisticInfo();
    }
  },
  created() {
    const { isAdmin = false, isShipment = false, user = {}, shipment = {}} = getUserInfo() || {};
    this.isAdmin = isAdmin;
    this.isShipment = isShipment;
    this.user = user;
    this.shipment = shipment;
    // console.log(this.user);
    this.dataTime = this.parseTime(new Date(), '{y}-{m}-{d}');
    this.getInfo();
    // 页面刚进入时开启长连接
    // this.initWebSocket();
  },
  destroyed: function() {
    // 页面销毁时关闭长连接
    // this.websocketclose();
  },
  methods: {
    getInfo() {
      this.getStatisticInfo();
      this.getNoticeList2();
      this.getWaybillList();
    },
    // 查询统计数据
    getStatisticInfo() {
      statisticInfo(this.user.branch.code, this.dataTime).then(response => {
        console.log(response);
        this.statistic = response.data;
        if (response.data.user.shipmentCount !== 0) {
          this.shipmentPersent = Math.round((response.data.user.activeCompany * 100) / response.data.user.shipmentCount);
        }
        if (response.data.user.driverCount !== 0) {
          this.driverPersent = Math.round((response.data.user.activeDriver * 100) / response.data.user.driverCount);
        }
        if (response.data.user.vehicleCount !== 0) {
          this.vehiclePersent = Math.round((response.data.user.activeVehicle * 100) / response.data.user.vehicleCount);
        }
        if (response.data.user.teamCount !== 0) {
          this.teamPersent = Math.round((response.data.user.activeTeam * 100) / response.data.user.teamCount);
        }
      });
    },
    /** 查询通知列表 */
    getNoticeList1() {
      // 通知
      listNoticeAll({ ...this.queryParams, noticeType: '1' }).then(response => {
        this.dataOver = !response.data.length;
        this.noticeList1 = this.noticeList1.concat(response.data);
        // console.log(this.noticeList1);
        this.loading = false;
        if (this.noticeList1) {
          this.disabled = false;
        }
      });
    },
    /** 查询公告列表 */
    getNoticeList2() {
      listNoticeAll({ noticeType: '2' }).then(response => {
        this.noticeList2 = response.data.map(response => {
          return response.noticeContent;
        });
        // console.log(this.noticeList2);
      });
    },
    loadmore() {
      if (this.dataOver) return;
      this.queryParams.pageNum++;
      this.loading = true;
      this.disabled = true;
      if (this.activeName === '1') {
        this.getWaybillList();
      } else if (this.activeName === '2') {
        this.getOrderList();
      } else if (this.activeName === '3') {
        this.getBillList();
      } else if (this.activeName === '4') {
        this.getNoticeList1();
      }
    },
    // 查询运单列表
    getWaybillList() {
      waybillList(this.queryParams).then(response => {
        this.dataOver = !response.rows.length;
        this.waybillList = this.waybillList.concat(response.rows);
        this.loading = false;
        if (this.waybillList) {
          this.disabled = false;
        }
      });
    },
    // 查询货源列表
    getOrderList() {
      orderList(this.queryParams).then(response => {
        this.dataOver = !response.data.list.length;
        this.orderList = this.orderList.concat(response.data.list);
        // console.log(this.orderList);
        this.loading = false;
        if (this.orderList) {
          this.disabled = false;
        }
      });
    },
    // 查询发票列表
    getBillList() {
      billList(this.queryParams).then(response => {
        this.dataOver = !response.data.rows.length;
        this.billList = this.billList.concat(response.data.rows);
        this.loading = false;
        if (this.billList) {
          this.disabled = false;
        }
      });
    },
    // 查看运单详情
    handleWaybill(item) {
      this.$refs.DetailDialog.reset();
      this.currentId = item.wayBillCode;
      this.open = true;
      this.title = '运输单信息';
      this.formDisable = true;
    },
    handleOrder(item) {
      const code = item.code;
      this.$router.push({ name: 'Release', query: { id: code, t: '0' }});
    },
    handleInvoice(item) {
      this.$router.push({ name: 'Statement', query: { code: item.code }});
    },
    // weosocket调用方法
    initWebSocket() { // 初始化weosocket
      const wsuri = 'ws://10.0.0.75:8080/websocket/chy';// ws地址
      this.websock = new WebSocket(wsuri);
      this.websock.onopen = this.websocketonopen;

      this.websock.onerror = this.websocketonerror;

      this.websock.onmessage = this.websocketonmessage;
      this.websock.onclose = this.websocketclose;
    },
    websocketonopen() {
      console.log('WebSocket连接成功');
    },
    websocketonerror(e) { // 错误
      console.log('WebSocket连接发生错误');
    },
    websocketonmessage(e) { // 数据接收
      console.log(e);
      // const redata = JSON.parse(e.data);
      // 注意：长连接我们是后台直接1秒推送一条数据，
      // 但是点击某个列表时，会发送给后台一个标识，后台根据此标识返回相对应的数据，
      // 这个时候数据就只能从一个出口出，所以让后台加了一个键，例如键为1时，是每隔1秒推送的数据，为2时是发送标识后再推送的数据，以作区分
      // console.log(redata.value);
    },
    websocketsend(agentData) { // 数据发送
      this.websock.send(agentData);
    },
    websocketclose(e) { // 关闭
      console.log(e);
      // console.log('connection closed (' + e.code + ')');
    },

    goTarget(href) {
      window.open(href, '_blank');
    },
    // 切换动态
    handleClick(tab) {
      this.waybillList = [];
      this.orderList = [];
      this.billList = [];
      this.noticeList1 = [];
      this.activeName = tab;
      this.queryParams.pageNum = 1;
      this.dataOver = false;
      if (tab === '1') {
        this.getWaybillList();
      } else if (tab === '2') {
        this.getOrderList();
      } else if (tab === '3') {
        this.getBillList();
      } else if (tab === '4') {
        this.getNoticeList1();
      }
    },
    // 导航点击事件
    handleNav(e) {
      this.$router.push({ name: e });
    }
  }
};
</script>

<style scoped lang="scss">
@import '../Css/WorkBanch.scss';
</style>

