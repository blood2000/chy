<template>
  <div style="min-width: 1222px; overflow-x: scroll;height: 100%">
    <div class="top-tips g-flex g-aligncenter">
      <img class="marginright10" src="~@/assets/images/workbench/icon_notice.png" alt="">
      <img class="marginright10" src="~@/assets/images/workbench/font_notice.png" alt="">
      <span class="notic-tip g-color-gray">
        <NoticeCard :lists="['123']" />
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

      <div class="index-frame" style="minWidth: 320px;height:100%;min-height: 740px;padding:0px; maxWidth:400px;">
        <!-- 动态 -->
        <div style="height:100%; min-height: 609px;">
          <div style="height:300px">
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
          <!-- 运单动态 -->
          <div v-if="activeName === '1'" class="trend-frame">
            <div v-for="(item, index) in 10" :key="index" class="trend-content g-flex g-alignend" @click="handleWaybill(item)">
              <div style="margin-right: 12px;">
                <div class="g-color-tag g-title-smaller">5月17日</div>
                <div class="g-color-title g-strong margintop5">14:15</div>
              </div>
              <span class="g-color-blue marginright5">●</span>
              <div v-if="index != 0" class="trend-line" />
              <div style="margin-left: 12px;">
                <div class="g-color-tag g-title-smaller">余晨望</div>
                <div class="ellipsis g-color-title g-strong margintop5" style="width:250px;">取消订单（1092838191201）</div>
              </div>
            </div>
          </div>
          <!-- 货单动态 -->
          <div v-if="activeName === '2'" class="trend-frame">
            <div v-for="(item, index) in 10" :key="index" class="trend-content g-flex g-alignend" @click="handleOrder(item)">
              <div style="margin-right: 12px;">
                <div class="g-color-tag g-title-smaller">5月17日</div>
                <div class="g-color-title g-strong margintop5">14:15</div>
              </div>
              <span class="g-color-blue marginright5">●</span>
              <div v-if="index != 0" class="trend-line" />
              <div style="margin-left: 12px;">
                <div class="g-color-tag g-title-smaller">余晨望</div>
                <div class="ellipsis g-color-title g-strong margintop5" style="width:250px;">发布货源（1092838191201）</div>
              </div>
            </div>
          </div>
          <!-- 发票动态 -->
          <div v-if="activeName === '3'" class="trend-frame">
            <div v-for="(item, index) in 10" :key="index" class="trend-content g-flex g-alignend" @click="handleInvoice(item)">
              <div style="margin-right: 12px;">
                <div class="g-color-tag g-title-smaller">5月17日</div>
                <div class="g-color-title g-strong margintop5">14:15</div>
              </div>
              <span class="g-color-blue marginright5">●</span>
              <div v-if="index != 0" class="trend-line" />
              <div style="margin-left: 12px;">
                <div class="g-color-tag g-title-smaller">余晨望</div>
                <div class="ellipsis g-color-title g-strong margintop5" style="width:250px;">货主申请开票（1092838191201）</div>
              </div>
            </div>
          </div>
          <!-- 消息通知 -->
          <div v-if="activeName === '4'" class="trend-frame">
            <div v-for="(item, index) in noticeList1" :key="index" class="trend-content g-flex g-alignend">
              <div style="margin-right: 12px;">
                <div class="g-color-tag g-title-smaller">{{ parseTime(item.createTime, '{m}月{d}日') }}</div>
                <div class="g-color-title g-strong margintop5">{{ parseTime(item.createTime, '{h}:{i}') }}</div>
              </div>
              <span class="g-color-blue marginright5">●</span>
              <div v-if="index != 0" class="trend-line" />
              <div style="margin-left: 12px;">
                <div class="g-color-tag g-title-smaller">{{ item.remark }}</div>
                <div class="ellipsis g-color-title g-strong margintop5" style="width:250px;" v-html="item.noticeContent" />
              </div>
            </div>
          </div>
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
      // websocket参数
      websock: null,
      // 弹框 内容
      open: false,
      title: '',
      // 当前选中的运单id
      currentId: null,
      // 表单是否禁用
      formDisable: false,
      value: new Date(),

      // 货源的值
      dagaoItem: {},
      statiStical: {},
      rowContent: {}
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
    this.getNoticeList();

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
    // 查看运单详情
    handleWaybill(item) {
      this.$refs.DetailDialog.reset();
      this.currentId = '9715e39b88ec45cb9d125c44a67cab90';
      this.open = true;
      this.title = '运输单信息';
      this.formDisable = true;
    },
    handleOrder(item) {
      const code = '41dbe49a630644549d89aa8676fde6a3';
      this.$router.push({ name: 'Release', query: { id: code, t: '0' }});
    },
    handleInvoice(item) {
      this.$router.push({ name: 'Statement', query: { code: item.code }});
    },
    /** 查询通知公告列表 */
    getNoticeList() {
      // 通知
      listNoticeAll({ noticeType: '1' }).then(response => {
        this.noticeList1 = response.data;
        // console.log(this.noticeList1);
      });
      // 公告
      listNoticeAll({ noticeType: '2' }).then(response => {
        this.noticeList2 = response.data.map(response => {
          return response.noticeContent;
        });
        // console.log(this.noticeList2);
      });
    },

    goTarget(href) {
      window.open(href, '_blank');
    },
    // 切换动态
    handleClick(tab) {
      this.activeName = tab;
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
        companyCode: this.shipment.info.companyCode
      });

      const {
        // balanceAccount, //	账号余额	number
        driver, //	合作司机	integer(int32)	integer(int32)
        frequentlyAddress, //	常用地址	integer(int32)	integer(int32)
        // frozenCapital, //	冻结余额	number
        invoice: { // 发票	货主工作台-发票统计	货主工作台-发票统计
          applyInvoice, //	申请发票数	integer(int32)
          applyInvoiceAmount, //	申请金额	number
          auditInvoice, //	待审核发票数	integer(int32)
          auditInvoiceAmount, //	待审核金额	number
          openInvoice, //	已开票	integer(int32)
          openInvoiceAmount, //	已开票金额	number
          openInvoiceAmountToday, //	今日已开票金额	number
          openInvoiceToday //	今日开票
        },
        item,	// 项目	integer(int32)	integer(int32)
        order: { // 货源	货主工作台-货源统计Vo	货主工作台-货源统计Vo
          artificialClose, //	手动关闭	integer(int32)
          privateOrder, //	非公开货源	integer(int32)
          publicOrder, //	发布中货单	integer(int32)
          soldOut //	完成关闭
        },
        rule,	// 计算规则	integer(int32)	integer(int32)
        team,	// 合作车队	integer(int32)	integer(int32)
        vehicle,	// 合作车辆	integer(int32)	integer(int32)
        waybill: { // 运单
          orderBalance, //	已核算	integer(int32)
          orderBalanceAmount, //	已核算金额	number
          orderLoading, //	已装货	integer(int32)
          orderReceiving, //	已接单	integer(int32)
          orderReceivingToday, //	今日接单	integer(int32)
          orderRemit, //	已打款	integer(int32)
          orderRemitAmount, //	已打款金额	number
          orderRemitAmountToday, //	今日打款金额	number
          orderRemitToday, //	今日打款	integer(int32)
          orderReviewer, //	已复核	integer(int32)
          orderUnload, //	已卸货	integer(int32)
          transportToday //	今日运输
        }
      } = res.data;


      // 项目模块
      this.dagaoItem = {
        item,
        frequentlyAddress,
        rule
      };

      // 接单模块
      this.statiStical = {
        orderReceivingToday,
        transportToday,

        orderRemitToday,
        orderRemitAmountToday,

        openInvoiceToday,
        openInvoiceAmountToday,

        team,
        vehicle,
        driver

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

      // this.$set(this.rowContent, 'balanceAccount', amount);
      this.rowContent.balanceAccount = amount;
      this.rowContent.frozenCapital = freezeAmount;
      this.$forceUpdate();
    },
    // 获取今日
    async getToday() {

    }
  }
};
</script>

<style scoped lang="scss">
@import '../Css/WorkBanch.scss';

.middle-row-content{
  // padding: 5px 0 5px 0px;
}
.shipper_left.my-impo{
  min-width: 290px;
  max-width: 330px;
  width: auto;
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
  .shipper-middle{
    .middle-row-content{
      margin-left: 10px !important;

    }
    .middle-row-content-item{
      background-color: red !important;
    }
  }
}


</style>

