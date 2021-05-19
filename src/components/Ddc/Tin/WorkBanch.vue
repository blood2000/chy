<template>
  <div style="min-width: 1695px; overflow-x: scroll;height: 100%">
    <div class="top-tips g-flex g-aligncenter">
      <img class="marginright10" src="~@/assets/images/workbench/icon_notice.png" alt="">
      <img class="marginright10" src="~@/assets/images/workbench/font_notice.png" alt="">
      <span class="notic-tip g-color-gray" v-html="noticeList2[0].noticeContent || '暂无公告~'" />
    </div>

    <div class="g-flex" style="margin: 0 15px;height: calc(100% - 59px);">
      <div class="marginright15" style="width:calc(100% - 400px);height: 100%">
        <div class="g-flex">
          <!-- 用户信息 -->
          <div class="index-frame g-flex g-aligncenter  marginright15" style="width:330px;">
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
          <!-- 便捷导航 -->
          <div class="index-frame g-flex g-aligncenter g-justifyaround" style="width:calc(100% - 345px);min-width:835px;">
            <div class="g-flex g-aligncenter g-flexdirection width10" @click="handleNav(1)">
              <img class="nav-icon" src="~@/assets/images/workbench/icon_addcompany.png" alt="">
              <div class="g-color-title g-strong margintop5">新增企业</div>
            </div>
            <div class="g-flex g-aligncenter g-flexdirection width10" @click="handleNav(2)">
              <img class="nav-icon" src="~@/assets/images/workbench/icon_report.png" alt="">
              <div class="g-color-title g-strong margintop5">数据上报</div>
            </div>
            <div class="g-flex g-aligncenter g-flexdirection width10" @click="handleNav(3)">
              <img class="nav-icon" src="~@/assets/images/workbench/icon_order.png" alt="">
              <div class="g-color-title g-strong margintop5">发布货源</div>
            </div>
            <div class="g-flex g-aligncenter g-flexdirection width10" @click="handleNav(4)">
              <img class="nav-icon" src="~@/assets/images/workbench/icon_addwaybill.png" alt="">
              <div class="g-color-title g-strong margintop5">新增运单</div>
            </div>
            <div class="g-flex g-aligncenter g-flexdirection width10" @click="handleNav(5)">
              <img class="nav-icon" src="~@/assets/images/workbench/icon_waybillmanage.png" alt="">
              <div class="g-color-title g-strong margintop5">运单管理</div>
            </div>
            <div class="g-flex g-aligncenter g-flexdirection width10" @click="handleNav(6)">
              <img class="nav-icon" src="~@/assets/images/workbench/icon_billing.png" alt="">
              <div class="g-color-title g-strong margintop5">开具发票</div>
            </div>
            <div class="g-flex g-aligncenter g-flexdirection width10" @click="handleNav(7)">
              <img class="nav-icon" src="~@/assets/images/workbench/icon_invoicelist.png" alt="">
              <div class="g-color-title g-strong margintop5">发票列表</div>
            </div>
            <div class="g-flex g-aligncenter g-flexdirection width10" @click="handleNav(8)">
              <img class="nav-icon" src="~@/assets/images/workbench/icon_waybillcp.png" alt="">
              <div class="g-color-title g-strong margintop5">运单投诉</div>
            </div>
          </div>
        </div>
        <div class="g-flex margintop15" style="height: 49%; min-height: 363px;">
          <!-- 货单 -->
          <div class="index-frame g-flex g-flexdirection g-justifybetween marginright15" style="width:330px; height: 100%;">
            <div>
              <div class="g-flex g-aligncenter">
                <img class="marginright15" src="~@/assets/images/workbench/icon_waybillnum.png" alt="">
                <div class="g-color-blue g-strong">货单统计</div>
              </div>
              <div class="g-flex g-justifybetween g-alignend">
                <div class="g-flex g-flexdirection g-aligncenter margintop15" style="width: 70%;">
                  <div class="g-title-smaller">
                    <div class="g-color-title">今日货单</div>
                    <div class="g-color-title"><span class="g-color-title g-strong g-title-max font-Bahnschrif">23436</span> 单</div>
                    <div class="g-color-tag">货单总数 / 89567 单</div>
                  </div>
                </div>
                <img class="waybill-bg" src="~@/assets/images/workbench/icon_waybillbg.png" alt="">
              </div>
            </div>
            <div class="g-flex g-justifybetween">
              <div class="order-frame g-title-smaller">
                <div class="g-color-title">发布中货单</div>
                <div class="g-color-tag"><span class="g-color-title g-strong g-title-large font-Bahnschrif">436</span> 单</div>
                <img class="margintop15" src="~@/assets/images/workbench/icon_publishorder.png" alt="">
              </div>
              <div class="order-frame g-title-smaller">
                <div class="g-color-title">已关闭货单</div>
                <div class="g-color-tag"><span class="g-color-title g-strong g-title-large font-Bahnschrif">436</span> 单</div>
                <img class="margintop15" src="~@/assets/images/workbench/icon_closeorder.png" alt="">
              </div>
            </div>
          </div>
          <!-- 发票 -->
          <div class="index-frame g-flex g-flexdirection g-justifybetween marginright15" style="width:460px; height: 100%;">
            <div>
              <div class="g-flex g-aligncenter">
                <img class="marginright15" src="~@/assets/images/workbench/icon_waybillnum.png" alt="">
                <div class="g-color-blue g-strong">发票统计</div>
              </div>
              <div class="g-flex g-justifybetween g-alignend">
                <div class="g-flex g-flexdirection g-aligncenter margintop15" style="width: 70%;">
                  <div class="g-title-smaller">
                    <div class="g-color-title">今日发票</div>
                    <div class="g-color-title"><span class="g-color-title g-strong g-title-max font-Bahnschrif">23436</span> 票</div>
                    <div class="g-color-tag">发票总数 / 89567 票</div>
                  </div>
                </div>
                <img class="waybill-bg" src="~@/assets/images/workbench/icon_waybillbg.png" alt="">
              </div>
            </div>
            <div class="g-flex g-justifybetween">
              <div class="order-frame">
                <div class="g-color-title">今日已索票</div>
                <div class="g-color-tag g-title-smaller"><span class="g-color-title g-strong g-title-large font-Bahnschrif">436</span> 单</div>
                <img class="margintop15" src="~@/assets/images/workbench/icon_ask.png" alt="">
              </div>
              <div class="order-frame">
                <div class="g-color-title">今日已审核</div>
                <div class="g-color-tag g-title-smaller"><span class="g-color-title g-strong g-title-large font-Bahnschrif">436</span> 单</div>
                <img class="margintop15" src="~@/assets/images/workbench/icon_examine.png" alt="">
              </div>
              <div class="order-frame">
                <div class="g-color-title">已开票</div>
                <div class="g-color-tag g-title-smaller"><span class="g-color-title g-strong g-title-large font-Bahnschrif">436</span> 单</div>
                <img class="margintop15" src="~@/assets/images/workbench/icon_onbilling.png" alt="">
              </div>
            </div>
          </div>
          <!-- 运单 -->
          <div class="index-frame g-flex g-flexdirection g-justifybetween" style="width:calc(100% - 820px);min-width:360px;height: 100%;">
            <div>
              <div class="g-flex g-aligncenter">
                <img class="marginright15" src="~@/assets/images/workbench/icon_waybillnum.png" alt="">
                <div class="g-color-blue g-strong">运单统计</div>
              </div>
              <div class="g-flex g-justifybetween g-alignend">
                <div class="g-flex g-flexdirection g-aligncenter margintop15" style="width: 70%;">
                  <div class="g-title-smaller">
                    <div class="g-color-title">今日运单</div>
                    <div class="g-color-title"><span class="g-color-title g-strong g-title-max font-Bahnschrif">23436</span> 单</div>
                    <div class="g-color-tag">运单总数 / 89567 单</div>
                  </div>
                </div>
                <img class="waybill-bg" src="~@/assets/images/workbench/icon_waybillbg.png" alt="">
              </div>
            </div>
            <div class="waybill-frame">
              <div class=" g-flex g-justifybetween">
                <div style="width: 100px">
                  <div class="g-color-title"><span class="g-color-blue g-title-smaller">●</span> 今日已装货</div>
                  <div class="g-color-title g-strong g-title-large font-Bahnschrif" style="margin-left:10px">334</div>
                </div>
                <div style="width: 100px">
                  <div class="g-color-title"><span class="g-color-blue g-title-smaller">●</span> 今日已卸货</div>
                  <div class="g-color-title g-strong g-title-large font-Bahnschrif" style="margin-left:10px">334</div>
                </div>
                <div style="width: 100px">
                  <div class="g-color-title"><span class="g-color-blue g-title-smaller">●</span> 今日已复核</div>
                  <div class="g-color-title g-strong g-title-large font-Bahnschrif" style="margin-left:10px">334</div>
                </div>
              </div>
              <div class=" g-flex g-justifybetween">
                <div style="width: 100px">
                  <div class="g-color-title"><span class="g-color-blue g-title-smaller">●</span> 今日已结算</div>
                  <div class="g-color-title g-strong g-title-large font-Bahnschrif" style="margin-left:10px">334</div>
                </div>
                <div style="width: 100px">
                  <div class="g-color-title"><span class="g-color-blue g-title-smaller">●</span> 今日已打款</div>
                  <div class="g-color-title g-strong g-title-large font-Bahnschrif" style="margin-left:10px">334</div>
                </div>
                <div style="width: 100px" />
              </div>
            </div>
          </div>
        </div>
        <div class="index-frame margintop15" style="height: calc(51% - 140px); min-height: 238px;">
          <!-- 平台概览 -->
          <div class="g-flex g-aligncenter" style="width:100%;height:100%">
            <div class="g-flex g-aligncenter g-flexdirection" style="width:25%">
              <el-progress type="circle" :percentage="80" :stroke-width="15" :width="130" color="#409EFF" :show-text="false" />
              <div class="platform-num g-flex g-aligncenter g-flexdirection">
                <div class="g-color-title g-strong g-title-big font-Bahnschrif">4514</div>
                <div class="g-color-title">平台货主数</div>
              </div>
              <div style="margin-top:10px;"><span class="g-color-blue marginright5">●</span>活跃货主</div>
              <div class="g-flex g-aligncenter g-justifyaround" style="width: 80%">
                <div>
                  <div class="g-color-title g-strong g-title-big font-Bahnschrif">260</div>
                  <div class="g-color-tag">企业数</div>
                </div>
                <div>
                  <div class="g-color-title g-strong g-title-big font-Bahnschrif">300</div>
                  <div class="g-color-tag">账号数</div>
                </div>
                <div>
                  <div class="g-color-title g-strong g-title-big font-Bahnschrif">160</div>
                  <div class="g-color-tag">活跃企业</div>
                </div>
              </div>
            </div>
            <div class="g-flex g-aligncenter g-flexdirection" style="width:25%">
              <el-progress type="circle" :percentage="70" :stroke-width="15" :width="130" color="#40CBFF" :show-text="false" />
              <div class="platform-num g-flex g-aligncenter g-flexdirection">
                <div class="g-color-title g-strong g-title-big font-Bahnschrif">15067</div>
                <div class="g-color-title">平台司机数</div>
              </div>
              <div style="margin-top:10px;"><span class="g-color-blue marginright5">●</span>活跃司机</div>
              <div class="g-flex g-aligncenter g-justifyaround" style="width: 80%">
                <div>
                  <div class="g-color-title g-strong g-title-big font-Bahnschrif">260</div>
                  <div class="g-color-tag">零散司机</div>
                </div>
                <div>
                  <div class="g-color-title g-strong g-title-big font-Bahnschrif">300</div>
                  <div class="g-color-tag">聘用司机</div>
                </div>
                <div>
                  <div class="g-color-title g-strong g-title-big font-Bahnschrif">15067</div>
                  <div class="g-color-tag">活跃司机</div>
                </div>
              </div>
            </div>
            <div class="g-flex g-aligncenter g-flexdirection" style="width:25%">
              <el-progress type="circle" :percentage="30" :stroke-width="15" :width="130" color="#67C23A" :show-text="false" />
              <div class="platform-num g-flex g-aligncenter g-flexdirection">
                <div class="g-color-title g-strong g-title-big font-Bahnschrif">15099</div>
                <div class="g-color-title">平台车辆数</div>
              </div>
              <div style="margin-top:10px;"><span class="g-color-success marginright5">●</span>活跃车辆</div>
              <div class="g-flex g-aligncenter g-justifyaround" style="width: 80%">
                <div>
                  <div class="g-color-title g-strong g-title-big font-Bahnschrif">260</div>
                  <div class="g-color-tag">活跃车辆</div>
                </div>
              </div>
            </div>
            <div class="g-flex g-aligncenter g-flexdirection" style="width:25%">
              <el-progress type="circle" :percentage="60" :stroke-width="15" :width="130" color="#FFBB00" :show-text="false" />
              <div class="platform-num g-flex g-aligncenter g-flexdirection">
                <div class="g-color-title g-strong g-title-big font-Bahnschrif">13067</div>
                <div class="g-color-title">平台调度者数</div>
              </div>
              <div style="margin-top:10px;"><span class="g-color-warning marginright5">●</span>活跃调度者</div>
              <div class="g-flex g-aligncenter g-justifyaround" style="width: 80%">
                <div>
                  <div class="g-color-title g-strong g-title-big font-Bahnschrif">160</div>
                  <div class="g-color-tag">活跃调度者</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="index-frame" style="width: 400px;height:100%;min-height: 740px;padding:0px;">
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
import { listNotice } from '@/api/system/notice';
// 运单详情弹窗
import DetailDialog from '@/views/waybill/components/detailDialog';
// import { color } from 'echarts';
export default {
  name: 'Index',
  components: { DetailDialog },
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
      noticeList2: [{
        noticeContent: ''
      }],
      // websocket参数
      websock: null,
      // 弹框 内容
      open: false,
      title: '',
      // 当前选中的运单id
      currentId: null,
      // 表单是否禁用
      formDisable: false,
      value: new Date()
    };
  },
  watch: {
    value(val) {
      console.log(val);
    }
  },
  created() {
    const { isAdmin = false, isShipment = false, user = {}, shipment = {}} = getUserInfo() || {};
    this.isAdmin = isAdmin;
    this.isShipment = isShipment;
    this.user = user;
    this.shipment = shipment;
    this.getNoticeList();
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
      listNotice({ noticeType: '1' }).then(response => {
        this.noticeList1 = response.rows;
        console.log(this.noticeList1);
      });
      listNotice({ noticeType: '2' }).then(response => {
        this.noticeList2 = response.rows;
        console.log(this.noticeList2);
      });
    },
    // weosocket调用方法
    initWebSocket() { // 初始化weosocket
      const wsuri = process.env.WS_API + '/websocket/threadsocket';// ws地址
      this.websock = new WebSocket(wsuri);
      this.websocket.onopen = this.websocketonopen;

      this.websocket.onerror = this.websocketonerror;

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
      const redata = JSON.parse(e.data);
      // 注意：长连接我们是后台直接1秒推送一条数据，
      // 但是点击某个列表时，会发送给后台一个标识，后台根据此标识返回相对应的数据，
      // 这个时候数据就只能从一个出口出，所以让后台加了一个键，例如键为1时，是每隔1秒推送的数据，为2时是发送标识后再推送的数据，以作区分
      console.log(redata.value);
    },
    websocketsend(agentData) { // 数据发送
      this.websock.send(agentData);
    },
    websocketclose(e) { // 关闭
      console.log('connection closed (' + e.code + ')');
    },

    goTarget(href) {
      window.open(href, '_blank');
    },
    // 切换动态
    handleClick(tab) {
      this.activeName = tab;
    },
    // 导航点击事件
    handleNav(index) {
      switch (index) {
        case 1:
          this.$router.push({ name: 'Shipment' });
          break;
        case 2:
          this.$router.push({ name: 'Report' });
          break;
        case 3:
          this.$router.push({ name: 'Release' });
          break;
        case 4:
          this.$router.push({ name: 'Supplement' });
          break;
        case 5:
          this.$router.push({ name: 'Manages' });
          break;
        case 6:
          this.$router.push({ name: 'Askfor' });
          break;
        case 7:
          this.$router.push({ name: 'List' });
          break;
        case 8:
          this.$router.push({ name: 'Complaint' });
          break;
        default:
          break;
      }
    }
  }
};
</script>

<style scoped lang="scss">
@import '../Css/WorkBanch.scss';
</style>

