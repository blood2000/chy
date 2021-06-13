<template>
  <div style="overflow-x: scroll;height: 100%">
    <!-- 系统公告 -->
    <div class="top-tips g-aligncenter">
      <img class="marginright10" src="~@/assets/images/workbench/icon_notice.png" alt="">
      <img v-if="width>1366" class="marginright10" src="~@/assets/images/workbench/font_notice.png" alt="">
      <span class="notic-tip g-color-gray">
        <NoticeCard :notice="noticeSys" />
      </span>
    </div>

    <div class="g-flex" style="margin: 0 15px;height: calc(100% - 59px);">

      <!-- 左边 -->
      <div class="marginright15 shipper ly-flex-1" style="height: 100%;min-height: 740px;">
        <div class="shipper_left my-impo">
          <!-- 用户信息 -->
          <div class="g-flex">
            <div class="index-frame g-flex g-aligncenter  marginright15" style="width: 100%;">
              <img v-if="user.avatar != null" class="user-avator" :src="user.avatar">
              <img v-else class="user-avator" src="~@/assets/images/workbench/icon_noavator.png">
              <div style="margin-left:15px;max-width:205px;">
                <div class="g-color-title g-strong g-title-big">{{ user.nickName }}</div>
                <div class="user-post g-margin-tb">
                  <img src="~@/assets/images/workbench/icon_position.png" style="margin-right: 10px;" alt="">
                  {{ user.roles[0].roleName }}
                </div>
                <div class="g-color-tag">{{ user.org.orgName }}</div>
              </div>
            </div>
          </div>

          <!-- 左中 -->
          <div class="index-frame marginright15 mt12">
            <div class="dagao ly-flex ly-flex-w">
              <DagaoItem
                :layout="{
                  iconfont: 'icon-22800',
                  unit: '个',
                  title: '项目'
                }"
                :value="dagaoItem.item || 0"
                @click="handlerClick('Project','0')"
              />
              <DagaoItem
                :layout="{
                  iconfont: 'icon-22801',
                  unit: '个',
                  title: '常用地址'
                }"
                :value="dagaoItem.frequentlyAddress || 0"
                @click="handlerClick('CompanyAddress','0')"
              />
              <DagaoItem
                :layout="{
                  iconfont: 'icon-22803',
                  unit: '个',
                  title: '计算规则'
                }"
                :value="dagaoItem.rule || 0"
                @click="handlerClick('Rules','0')"
              />



            </div>
          </div>
          <!-- 左下 -->
          <div class="index-frame mt12 marginright15 ly-flex-1 shujubox-bg">
            <div class="shujubox ly-flex">

              <StatiStical
                :datas="[
                  {
                    name: '今日接单',
                    value: statiStical.orderReceivingToday || '0',
                    unit: '单'
                  },
                  {
                    name: '今日运输',
                    value: statiStical.transportToday || '0',
                    unit: '单'
                  },

                ]"
              />

              <StatiStical
                :datas="[
                  {
                    name: '今日打款',
                    value: statiStical.orderRemitToday || '0',
                    unit: '单'
                  },
                  {
                    name: '',
                    value: statiStical.orderRemitAmountToday || '0',
                    unit: '万元'
                  },

                ]"
              />

              <StatiStical
                :datas="[
                  {
                    name: '今日开票',
                    value: statiStical.openInvoiceToday || '0',
                    unit: '单'
                  },
                  {
                    name: '',
                    value: statiStical.openInvoiceAmountToday || '0',
                    unit: '万元'
                  },

                ]"
              />

              <StatiStical
                :datas="[
                  {
                    name: '合作车队',
                    value: statiStical.team || '0',
                    unit: '个'
                  },
                  {
                    name: '合作车辆',
                    value: statiStical.vehicle || '0',
                    unit: '辆'
                  },
                  {
                    name: '合作司机',
                    value: statiStical.driver || '0',
                    unit: '个'
                  }
                ]"
              />

            </div>
          </div>
        </div>

        <!-- 中间 -->
        <div class="shipper-middle" style="minWidth: 600px;">
          <div class="middle-row">
            <RowTitle v-once index="1">账户充值</RowTitle>
            <div class="middle-row-content">
              <div class="middle-row-content-rowitem">
                <RowContent
                  :layout="{
                    paIcon: 'icon-zhanghu', // 定位的图标
                    title: '现金账户余额',
                    color: 'g-color-error',
                    z30d: false,
                    primary1: '充值', // 显示正常的值
                    primary2: '提现'
                  }"

                  :datas="[
                    {
                      mt_show: '',
                      value: rowContent.balanceAccount || '0',
                      unit: '元'
                    }
                  ]"

                  @click1="handlerClick('RechargeDescription')"
                  @click2="handlerClick('MyWallet')"
                />

                <RowContent
                  :layout="{
                    paIcon: 'icon-donjie', // 定位的图标
                    title: '冻结金额',
                    color: 'g-color-error',
                    z30d: false,
                    primary1: '', // 显示正常的值
                    primary2: ''
                  }"

                  :datas="[
                    {
                      mt_show: '',
                      value: rowContent.frozenCapital || 0,
                      unit: '元'
                    }
                  ]"
                />

              </div>
            </div>
          </div>

          <!-- 第二层 -->
          <div class="middle-row">
            <RowTitle v-once index="2">发布货源</RowTitle>
            <div class="middle-row-content">
              <div class="middle-row-content-rowitem">

                <RowContent
                  :layout="{
                    paIcon: 'icon-fabu', // 定位的图标
                    title: '发布中货源',
                    color: 'g-color-blue',
                    z30d: false,
                    primary1: '发布', // 显示正常的值
                    primary2: '查看'
                  }"

                  :datas="[
                    {
                      mt_show: '公开货源',
                      value: rowContent.publicOrder || '0',
                      unit: '单'
                    },
                    {
                      mt_show: '非公开货源',
                      value: rowContent.privateOrder || '0',
                      unit: '单'
                    }
                  ]"

                  @click1="handlerClick('Release')"
                  @click2="handlerClick('Manage', '0')"
                />

                <RowContent
                  :layout="{
                    paIcon: 'icon-guanbi', // 定位的图标
                    title: '已关闭货源',
                    color: 'g-color-blue',
                    z30d: true,
                    primary1: '', // 显示正常的值
                    primary2: '查看'
                  }"

                  :datas="[
                    {
                      mt_show: '完成',
                      value: rowContent.soldOut || '0',
                      unit: '单'
                    },
                    {
                      mt_show: '手动关闭',
                      value: rowContent.artificialClose || '0',
                      unit: '单'
                    }
                  ]"

                  @click2="handlerClick('Manage', '1')"
                />

              </div>
            </div>
          </div>

          <!-- 第三层 -->
          <div class="middle-row">
            <RowTitle v-once index="3">运单运输</RowTitle>
            <div class="middle-row-content">
              <div class="middle-row-content-rowitem">

                <RowContent
                  col="3"
                  :layout="{
                    paIcon: 'icon-yijiedan', // 定位的图标
                    title: '已接单运单',
                    color: 'g-color-success',
                    z30d: false,
                    primary1: '', // 显示正常的值
                    primary2: '查看'
                  }"

                  :datas="[
                    {
                      mt_show: '',
                      value: rowContent.orderReceiving || '0',
                      unit: '单'
                    }
                  ]"

                  @click2="handlerClick('Tracklist', '1')"
                />
                <RowContent
                  col="3"
                  :layout="{
                    paIcon: 'icon-yizhuanhuo', // 定位的图标
                    title: '已装货运单',
                    color: 'g-color-success',
                    z30d: false,
                    primary1: '', // 显示正常的值
                    primary2: '查看'
                  }"

                  :datas="[
                    {
                      mt_show: '',
                      value: rowContent.orderLoading || '0',
                      unit: '单'
                    }
                  ]"

                  @click2="handlerClick('Tracklist', '2')"
                />
                <RowContent
                  col="3"
                  :layout="{
                    paIcon: 'icon-yixie', // 定位的图标
                    title: '已卸货运单',
                    color: 'g-color-success',
                    z30d: false,
                    primary1: '', // 显示正常的值
                    primary2: '查看'
                  }"

                  :datas="[
                    {
                      mt_show: '',
                      value: rowContent.orderUnload || '0',
                      unit: '单'
                    }
                  ]"

                  @click2="handlerClick('Tracklist', '3')"
                />

              </div>
            </div>

          </div>

          <!-- 第四层 -->
          <div class="middle-row">
            <RowTitle v-once index="4">支付运费</RowTitle>
            <div class="middle-row-content">
              <div class="middle-row-content-rowitem">

                <RowContent
                  col="3"
                  :layout="{
                    paIcon: 'icon-yifuhe', // 定位的图标
                    title: '已复核运单',
                    color: 'g-color-warning',
                    z30d: false,
                    primary1: '去核算', // 显示正常的值
                    primary2: ''
                  }"

                  :datas="[
                    {
                      mt_show: '',
                      value: rowContent.orderReviewer || '0',
                      unit: '单'
                    }
                  ]"

                  @click1="handlerClick('Adjust', '4')"
                />

                <RowContent
                  col="3"
                  :layout="{
                    paIcon: 'icon-hesuan', // 定位的图标
                    title: '已核算运费',
                    color: 'g-color-warning',
                    z30d: false,
                    primary1: '去打款', // 显示正常的值
                    primary2: ''
                  }"

                  :datas="[
                    {
                      mt_show: '',
                      value: rowContent.orderBalance || '0',
                      unit: '单'
                    },
                    {
                      mt_show: '',
                      value: rowContent.orderBalanceAmount || '0',
                      unit: '万元'
                    },
                  ]"

                  @click1="handlerClick('Adjust', '5')"
                />

                <RowContent
                  col="3"
                  :layout="{
                    paIcon: 'icon-yidakuan', // 定位的图标
                    title: '已打款运费',
                    color: 'g-color-warning',
                    z30d: false,
                    primary1: '去评价', // 显示正常的值
                    primary2: ''
                  }"

                  :datas="[
                    {
                      mt_show: '',
                      value: rowContent.orderRemit || '0',
                      unit: '单'
                    },
                    {
                      mt_show: '',
                      value: rowContent.orderRemitAmount || '0',
                      unit: '万元'
                    },
                  ]"

                  @click1="handlerClick('Adjust', '7')"
                />

              </div>
            </div>
          </div>

          <!-- 第五层 -->
          <div class="middle-row">
            <RowTitle v-once index="5">开具发票</RowTitle>
            <div class="middle-row-content last-row">
              <div class="middle-row-content-rowitem">

                <RowContent
                  col="3"
                  :layout="{
                    paIcon: 'icon-yishenqing', // 定位的图标
                    title: '待申请发票',
                    color: 'g-color-purple',
                    z30d: false,
                    primary1: '去索票', // 显示正常的值
                    primary2: ''
                  }"

                  :datas="[
                    {
                      mt_show: '',
                      value:rowContent.applyInvoice || '0',
                      unit: '单'
                    },
                    {
                      mt_show: '',
                      value:rowContent.applyInvoiceAmount || '0',
                      unit: '万元'
                    },
                  ]"

                  @click1="handlerClick('Askfor')"
                />
                <RowContent
                  col="3"
                  :layout="{
                    paIcon: 'icon-daihesuan', // 定位的图标
                    title: '待审核发票',
                    color: 'g-color-purple',
                    z30d: false,
                    primary1: '', // 显示正常的值
                    primary2: '查看'
                  }"

                  :datas="[
                    {
                      mt_show: '',
                      value: rowContent.auditInvoice || '0',
                      unit: '单'
                    },
                    {
                      mt_show: '',
                      value: rowContent.auditInvoiceAmount || '0',
                      unit: '万元'
                    },
                  ]"

                  @click2="handlerClick('List','1')"
                />
                <RowContent
                  col="3"
                  :layout="{
                    paIcon: 'icon-yikai', // 定位的图标
                    title: '已开票发票',
                    color: 'g-color-purple',
                    z30d: true,
                    primary1: '', // 显示正常的值
                    primary2: '查看'
                  }"

                  :datas="[
                    {
                      mt_show: '',
                      value: rowContent.openInvoice || '0',
                      unit: '单'
                    },
                    {
                      mt_show: '',
                      value: rowContent.openInvoiceAmount || '0',
                      unit: '万元'
                    },
                  ]"

                  @click2="handlerClick('List','5')"
                />


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
                  <div class="g-color-tag g-title-smaller">{{ parseTime(item.wayBillUpdateTime, '{m}月{d}日') || parseTime(item.receiveTime, '{m}月{d}日') }}</div>
                  <div class="g-strong margintop5">{{ parseTime(item.wayBillUpdateTime, '{h}:{i}') || parseTime(item.receiveTime, '{h}:{i}') }}</div>
                </div>
                <span class="g-color-blue marginright5">●</span>
                <div v-if="index != 0" class="trend-line" />
                <div style="margin-left: 12px;">
                  <div class="g-color-tag g-title-smaller">{{ item.driverName }}</div>
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
            <div v-if="activeName === '2'" class="cursor-point">
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
            <div v-if="activeName === '3'" class="cursor-point">
              <li v-for="(item, index) in billList" :key="index" class="trend-content g-flex g-alignend" @click="handleInvoice(item)">
                <div style="margin-right: 12px;width:51px;">
                  <div class="g-color-tag g-title-smaller">{{ parseTime(item.invoiceApplyTime, '{m}月{d}日') }}</div>
                  <div class="g-strong margintop5">{{ parseTime(item.invoiceApplyTime, '{h}:{i}') }}</div>
                </div>
                <span class="g-color-blue marginright5">●</span>
                <div v-if="index != 0" class="trend-line" />
                <div style="margin-left: 12px;">
                  <div class="g-color-tag g-title-smaller">{{ item.invoiceTitle }}</div>
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
            <div v-if="activeName === '4'" class="cursor-point">
              <li v-for="(item, index) in noticeList1" :key="index" class="trend-content g-flex g-alignend">
                <div style="margin-right: 12px;width:51px;">
                  <div class="g-color-tag g-title-smaller">{{ parseTime(item.createTime, '{m}月{d}日') }}</div>
                  <div class="g-strong margintop5">{{ parseTime(item.createTime, '{h}:{i}') }}</div>
                </div>
                <span class="g-color-blue marginright5">●</span>
                <div v-if="index != 0" class="trend-line" />
                <div style="margin-left: 12px;">
                  <div class="g-color-tag g-title-smaller">{{ item.remark || '管理员' }}</div>

                  <div class="active-cont ellipsis g-strong">
                    <NoticeCard :key="index" speed="5s" :notice="item.noticeContent" />
                  </div>
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
import { waybillList, orderList, billList, shipmentWaybillBehavior } from '@/api/workBanch';
import { getUserInfo } from '@/utils/auth';
import { listNoticeAll } from '@/api/system/notice';
// 运单详情弹窗
import DetailDialog from '@/views/waybill/components/detailDialog';
// 运单详情弹窗
import NoticeCard from './NoticeCard';
// import { color } from 'echarts';

// 货主组件
import RowTitle from './WprkComponent/RowTitle';
import RowContent from './WprkComponent/RowContent';
import DagaoItem from './WprkComponent/DagaoItem';
import StatiStical from './WprkComponent/StatiStical';

import { shipmentInformation } from '@/api/workBanch';

import { getWalletInfo } from '@/api/wallet/wallet';

export default {
  name: 'Index',
  components: { DetailDialog, NoticeCard, RowTitle, RowContent, DagaoItem, StatiStical },
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
      noticeSys: '',
      // websocket参数
      websock: null,
      // 弹框 内容
      open: false,
      title: '',
      // 当前选中的运单id
      currentId: null,
      // 表单是否禁用
      formDisable: false,

      // 货源的值
      dagaoItem: {},
      statiStical: {},
      rowContent: {},

      // 选中时间
      value: new Date(),
      dataTime: null,
      queryParams: {
        pageNum: 1,
        pageSize: 10
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
      disabled: true
    };
  },
  watch: {
    value(val) {
      // console.log(val);
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

    this.isShipment && this.getList();
    this.isShipment && this.paymentWallet();
    this.isShipment && this.getToday();
    // 页面刚进入时开启长连接
    // this.initWebSocket();
  },
  destroyed: function() {
    // 页面销毁时关闭长连接
    // this.websocketclose();
  },
  methods: {
    getInfo() {
      this.getNoticeList2();
      this.getWaybillList();
    },
    /** 查询通知列表 */
    getNoticeList1() {
      // 通知
      listNoticeAll({ ...this.queryParams, noticeType: '1' }).then(response => {
        this.dataOver = !response.data.length;
        const notice = response.data.filter(response => {
          return response.status === '0';
        });
        this.noticeList1 = this.noticeList1.concat(notice);
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
        this.noticeList2 = response.data.filter(response => {
          return response.status === '0';
        });
        this.noticeSys = this.noticeList2[0].noticeContent;
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
      waybillList({ ...this.queryParams, statusList: '1,2,3,4,5,6,7' }).then(response => {
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

    goTarget(href) {
      window.open(href, '_blank');
    },

    /** --> 货主端 页面跳转  */
    handlerClick(url, param) {
      if (param) {
        this.$router.push({ name: url, query: { [url.toLowerCase()]: param }});
      } else {
        this.$router.push({ name: url });
      }
    },

    // 获取数据
    async getList() {
      const res = await shipmentInformation({
        branchCode: this.shipment.info.branchCode,
        shipmentCode: this.shipment.info.code,
        companyCode: this.shipment.info.companyCode ? this.shipment.info.companyCode : undefined
      });

      const {
        // balanceAccount, //	账号余额	number
        // driver, //	合作司机	integer(int32)	integer(int32)
        frequentlyAddress, //	常用地址	integer(int32)	integer(int32)
        // frozenCapital, //	冻结余额	number
        invoice: { // 发票	货主工作台-发票统计	货主工作台-发票统计
          applyInvoice, //	申请发票数	integer(int32)
          applyInvoiceAmount, //	申请金额	number
          auditInvoice, //	待审核发票数	integer(int32)
          auditInvoiceAmount, //	待审核金额	number
          openInvoice, //	已开票	integer(int32)
          openInvoiceAmount //	已开票金额	number
          // openInvoiceAmountToday, //	今日已开票金额	number
          // openInvoiceToday //	今日开票
        },
        item,	// 项目	integer(int32)	integer(int32)
        order: { // 货源	货主工作台-货源统计Vo	货主工作台-货源统计Vo
          artificialClose, //	手动关闭	integer(int32)
          privateOrder, //	非公开货源	integer(int32)
          publicOrder, //	发布中货单	integer(int32)
          soldOut //	完成关闭
        },
        rule	// 计算规则	integer(int32)	integer(int32)
        // team,	// 合作车队	integer(int32)	integer(int32)
        // vehicle,	// 合作车辆	integer(int32)	integer(int32)
        // waybill:
      } = res.data;

      const { // 运单
        orderBalance, //	已核算	integer(int32)
        orderBalanceAmount, //	已核算金额	number
        orderLoading, //	已装货	integer(int32)
        orderReceiving, //	已接单	integer(int32)
        // orderReceivingToday, //	今日接单	integer(int32)
        orderRemit, //	已打款	integer(int32)
        orderRemitAmount, //	已打款金额	number
        // orderRemitAmountToday, //	今日打款金额	number
        // orderRemitToday, //	今日打款	integer(int32)
        orderReviewer, //	已复核	integer(int32)
        orderUnload, //	已卸货	integer(int32)
        // transportToday //	今日运输

        partnerDriver, // : 4
        partnerTeam, // 10
        partnerVehicle // : 4
      } = res.data.waybill || {};


      this.statiStical.team = partnerTeam;
      this.statiStical.vehicle = partnerVehicle;
      this.statiStical.driver = partnerDriver;
      // this.statiStical.1212
      // 项目模块
      this.dagaoItem = {
        item,
        frequentlyAddress,
        rule
      };


      // 中间
      this.rowContent = {
        // balanceAccount,
        // frozenCapital,

        publicOrder,
        privateOrder,

        soldOut,
        artificialClose,

        orderReceiving,

        orderLoading,

        orderUnload,

        orderReviewer,

        orderBalance,
        orderBalanceAmount,

        orderRemit,
        orderRemitAmount,

        applyInvoice,
        applyInvoiceAmount,

        auditInvoice,
        auditInvoiceAmount,

        openInvoice,
        openInvoiceAmount
      };

      this.$forceUpdate();
    },
    // 获取账户钱
    async paymentWallet() {
      const res = await getWalletInfo({
        code: this.user.userCode
      });

      const {
        amount,
        freezeAmount
      } = res.data;

      this.rowContent.balanceAccount = amount;
      this.rowContent.frozenCapital = freezeAmount;
      this.$forceUpdate();
    },
    // 获取今日
    async getToday() {
      const res = await shipmentWaybillBehavior({
        branchCode: this.shipment.info.branchCode,
        shipmentCode: this.shipment.info.code,
        companyCode: this.shipment.info.companyCode ? this.shipment.info.companyCode : undefined
      });

      const {
        openInvoiceAmountToday = 0, //	今日已开票金额	number
        openInvoiceToday = 0, //	今日开票	integer(int32)	integer(int32)
        orderReceivingToday = 0, //	今日接单	integer(int32)	integer(int32)
        orderRemitAmountToday = 0, //	今日打款金额	number
        orderRemitToday = 0, //	今日打款	integer(int32)	integer(int32)
        transportToday = 0 //	今日运输	integer(int32)	integer(int32)

        // team = 0, //	合作车队	integer(int32)	integer(int32)
        // driver = 0, //	合作司机	integer(int32)	integer(int32)
        // vehicle = 0 //	合作车辆
      } = res.data;
      // 接单模块
      this.statiStical = {
        ...(this.statiStical || {}),
        orderReceivingToday,
        transportToday,

        orderRemitToday,
        orderRemitAmountToday,

        openInvoiceToday,
        openInvoiceAmountToday

        // team,
        // vehicle,
        // driver
      };
      this.$forceUpdate();
    }
  }
};
</script>

<style scoped lang="scss">
@import '../Css/WorkBanch.scss';


.shipper_left.my-impo{
  min-width: 330px;
}
// 追加的样式
.shipper{
  display: flex;
  &_left{
    width: 330px;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  &-middle{
    flex: 1;
    height: 100%;
  }

}

// 左中
.dagao{
  justify-content: space-between;
}

// 左下
.shujubox-bg{
  background:url('~@/assets/images/workbench/mengbantu.png') no-repeat, linear-gradient(180deg, #0C316F 0%, #1B3E80 100%);
  background-size: 100% 100%;
  background-position: center;
  height: 100%;
  min-height: 335px;
}
.shujubox{
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
}

// 中间
.shipper-middle{
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-left: -10px;

  .middle-row{
    height: 20%;
    display: flex;
    flex-direction: column;

    &-content{
      flex: 1;
      position: relative;
      margin-left: 12px;
      padding: 5px 0 5px 0px;


      &::before{
        content: '';
        height: 90%;
        position: absolute;
        left: 0;
        top: 7px;

        border-left: 1px dashed rgba(207, 206, 207, 1);
      }

      &-rowitem{
        height: 100%;
        display: flex;
        justify-content: space-between;
      }
    }

    &-content.last-row{
      padding-bottom: 0;
    }
  }
  .middle-row:nth-child(1){
    margin-top: 0;
  }
}


  // 公共
  .mt12{
    margin-top: 12px;
  }

@media (max-width:1324px) {
    .shipper_left.my-impo{
      min-width: 290px !important;
      width: 290px !important;
    }
    .active-frame{
      min-width: 320px !important;
    }
}


</style>

