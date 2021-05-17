<template>
  <div style="min-width: 1695px; overflow-x: scroll;height: 100%">
    <div class="top-tips g-flex g-aligncenter">
      <img class="marginright10" src="~@/assets/images/workbench/icon_notice.png" alt="">
      <img class="marginright10" src="~@/assets/images/workbench/font_notice.png" alt="">
      <span class="notic-tip g-color-gray">{{ tip }}</span>
    </div>

    <div class="g-flex" style="margin: 0 15px;height: calc(100% - 59px);">
      <div class="marginright15" style="width:calc(100% - 400px);height: 100%">
        <div class="g-flex">
          <!-- 用户信息 -->
          <div class="index-frame g-flex g-aligncenter  marginright15" style="width:330px;">
            <el-image class="user-avator" src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg" fit="cover" />
            <div style="margin-left:15px;">
              <div class="g-color-title g-strong g-title-big">余晨望</div>
              <div class="user-post g-margin-tb"><img src="~@/assets/images/workbench/icon_position.png" style="margin-right: 10px;" alt="">客服专员</div>
              <div class="g-color-tag">大道成物流 | 客服部</div>
            </div>
          </div>
          <!-- 便捷导航 -->
          <div class="index-frame g-flex g-aligncenter g-justifyaround" style="width:calc(100% - 345px);min-width:835px;">
            <div class="g-flex g-aligncenter g-flexdirection width10">
              <img class="nav-icon" src="~@/assets/images/workbench/icon_addcompany.png" alt="">
              <div class="g-color-title g-strong margintop5">新增企业</div>
            </div>
            <div class="g-flex g-aligncenter g-flexdirection width10">
              <img class="nav-icon" src="~@/assets/images/workbench/icon_report.png" alt="">
              <div class="g-color-title g-strong margintop5">数据上报</div>
            </div>
            <div class="g-flex g-aligncenter g-flexdirection width10">
              <img class="nav-icon" src="~@/assets/images/workbench/icon_order.png" alt="">
              <div class="g-color-title g-strong margintop5">发布货源</div>
            </div>
            <div class="g-flex g-aligncenter g-flexdirection width10">
              <img class="nav-icon" src="~@/assets/images/workbench/icon_addwaybill.png" alt="">
              <div class="g-color-title g-strong margintop5">新增运单</div>
            </div>
            <div class="g-flex g-aligncenter g-flexdirection width10">
              <img class="nav-icon" src="~@/assets/images/workbench/icon_waybillmanage.png" alt="">
              <div class="g-color-title g-strong margintop5">运单管理</div>
            </div>
            <div class="g-flex g-aligncenter g-flexdirection width10">
              <img class="nav-icon" src="~@/assets/images/workbench/icon_billing.png" alt="">
              <div class="g-color-title g-strong margintop5">开具发票</div>
            </div>
            <div class="g-flex g-aligncenter g-flexdirection width10">
              <img class="nav-icon" src="~@/assets/images/workbench/icon_invoicelist.png" alt="">
              <div class="g-color-title g-strong margintop5">发票列表</div>
            </div>
            <div class="g-flex g-aligncenter g-flexdirection width10">
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
            <el-calendar />
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
            <div v-for="(item, index) in 10" :key="index" class="trend-content g-flex g-alignend">
              <div style="margin-right: 12px;">
                <div class="g-color-tag g-title-smaller">5月17日</div>
                <div class="g-color-title g-strong margintop5">14:15</div>
              </div>
              <span class="g-color-blue marginright5">●</span>
              <div v-if="index != 0" class="trend-line" />
              <div style="margin-left: 12px;">
                <div class="g-color-tag g-title-smaller">余晨望</div>
                <div class="ellipsis g-color-title g-strong margintop5">取消订单（1092838191201）</div>
              </div>
            </div>
          </div>
          <!-- 货单动态 -->
          <div v-if="activeName === '2'" class="trend-frame">
            <div v-for="(item, index) in 10" :key="index" class="trend-content g-flex g-alignend">
              <div style="margin-right: 12px;">
                <div class="g-color-tag g-title-smaller">5月17日</div>
                <div class="g-color-title g-strong margintop5">14:15</div>
              </div>
              <span class="g-color-blue marginright5">●</span>
              <div v-if="index != 0" class="trend-line" />
              <div style="margin-left: 12px;">
                <div class="g-color-tag g-title-smaller">余晨望</div>
                <div class="ellipsis g-color-title g-strong margintop5">发布货源（1092838191201）</div>
              </div>
            </div>
          </div>
          <!-- 发票动态 -->
          <div v-if="activeName === '3'" class="trend-frame">
            <div v-for="(item, index) in 10" :key="index" class="trend-content g-flex g-alignend">
              <div style="margin-right: 12px;">
                <div class="g-color-tag g-title-smaller">5月17日</div>
                <div class="g-color-title g-strong margintop5">14:15</div>
              </div>
              <span class="g-color-blue marginright5">●</span>
              <div v-if="index != 0" class="trend-line" />
              <div style="margin-left: 12px;">
                <div class="g-color-tag g-title-smaller">余晨望</div>
                <div class="ellipsis g-color-title g-strong margintop5">货主申请开票（1092838191201）</div>
              </div>
            </div>
          </div>
          <!-- 消息通知 -->
          <div v-if="activeName === '4'" class="trend-frame">
            <div v-for="(item, index) in 10" :key="index" class="trend-content g-flex g-alignend">
              <div style="margin-right: 12px;">
                <div class="g-color-tag g-title-smaller">5月17日</div>
                <div class="g-color-title g-strong margintop5">14:15</div>
              </div>
              <span class="g-color-blue marginright5">●</span>
              <div v-if="index != 0" class="trend-line" />
              <div style="margin-left: 12px;">
                <div class="g-color-tag g-title-smaller">余晨望</div>
                <div class="ellipsis g-color-title g-strong margintop5">系统将在今晚22：00更新，请及时保存相关数据，以免数据丢失！</div>
              </div>
            </div>
          </div>
          <div class="notice-bottom" />
        </div>
      </div>
    </div>

  </div>
</template>

<script>
// import { color } from 'echarts';
export default {
  name: 'Index',
  data() {
    return {
      // 版本号
      version: '1.2.4.0',
      activeName: '1',
      customColor: 'linear-gradient(180deg, #409EFF 0%, #006FE2 100%)',
      tip: '亲爱的用户，2021年4月22日（周四晚）21:30至23:00,银行系统升级，这期可能存在部分运单支付后较长时间处于“支付中”，处于“支付中”的您可以待系统升级以后反馈销售让我们处理，为了您能正常支付运单，建议您避开此时段操作支付感谢您的支持！'
    };
  },
  methods: {
    goTarget(href) {
      window.open(href, '_blank');
    },
    handleClick(tab) {
      this.activeName = tab;
    }
  }
};
</script>

<style scoped lang="scss">
.notic-tip{
  width: calc(100% - 100px);
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.font-Bahnschrif{
  font-family: "Bahnschrif";
}
.index-frame{
  padding: 15px;
  background: #fff;
  border-radius: 4px;
}
.margintop15{
  margin-top: 15px;
}
.margintop5{
  margin-top: 5px;
}
.marginright15{
  margin-right: 15px;
}
.marginright5{
  margin-right: 5px;
}
.marginright10{
  margin-right: 10px;
}
.margin15{
  margin: 0 15px 15px;
}
.width10{
  width: 10%;
}
.nav-icon{
  height: 28px;
  width: 28px;
}
.top-tips{
  background: #FFFBE6;
  border: 1px solid #FFE58F;
  border-radius: 2px;
  margin: 0 15px 15px;
  padding: 10px;
}
// 用户信息
.user-avator{
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 10px solid #F9F9F9;
}
.user-post{
  display: flex;
  padding: 0 10px;
  height: 22px;
  background: #EBF4FD;
  border-radius: 11px;
  font-size: 14px;
  font-weight: 500;
  line-height: 22px;
  color: #409EFF;
}
// 运单
.waybill-bg{
  height: 64px;
  width: 120px;
}
.waybill-frame{
  height: 140px;
  background: #F1F3F5;
  border-radius: 4px;
  padding: 15px;
}
::v-deep .el-progress-bar__inner {
  background: linear-gradient(270deg, #409EFF 0%, rgba(64, 158, 255, 0.51) 100%);
}
// 货单
.order-frame{
  width: 140px;
  height: 140px;
  background: #F1F3F5;
  border-radius: 4px;
  padding: 25px 15px 15px;
}
// 平台概览
.platform-num{
  position: relative;
  bottom: 90px;
  left: 0;
  height: 0;
}
// 日历
::v-deep .el-calendar-table .el-calendar-day{
  height: auto;
  // padding: 0;
}
::v-deep .el-calendar-table tr td{
  border: 0px;
  text-align: center;
}
::v-deep .el-calendar-table td.is-selected{
  background: #fff;
  .el-calendar-day{
    padding: 0;
    margin: 0 auto;
    width: 30px;
    height: 30px;
    background: linear-gradient(180deg, #68B1FC 0%, #007DFF 100%);
    box-shadow: 0px 1px 6px rgba(64, 158, 255, 0.38);
    border-radius: 50%;
    font-family: PingFang SC;
    font-weight: bold;
    line-height: 30px;
    color: #FFFFFF;
  }
}
::v-deep .el-calendar-table td :hover{
  background: none;
  color: #409EFF;
}
::v-deep .el-calendar-table td.is-selected :hover{
  background: #68B1FC;
  color: #fff;
}
// 动态
.notice-bottom{
  width: 100%;
  height: 50px;
  background: linear-gradient(180deg, rgba(255,255,255,0) 0%, #FFFFFF 100%);
  border-radius: 4px;
  position: relative;
  bottom: 50px;
}
.trend-tab{
  cursor: pointer;
  height: 32px;
  background: #F3F3F3;
  border-radius: 16px;
  overflow: hidden;
  margin: 16px 20px;
}
.trend-onbottom{
  height: 32px;
  background: #409EFF;
  color: #fff;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
}
.trend-bottom{
  height: 32px;
  color: #9FA2B5;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
}
.trend-frame{
  height: calc(100% - 365px);
  overflow: scroll;
  padding: 0 10px 0 20px;
  margin-right: 5px;
}
.trend-frame :hover{
  background: #F8FBFE;
}
.trend-line{
  position: relative;
  bottom: 25px;
  left: -10px;
  width: 0px;
  height: 30px;
  border: 1px dashed #E6E6E6;
}
.trend-oncontent{
  height: 60px;
  padding: 10px 0 10px 15px;
  background: #F9FBFC;
}
.trend-content{
  height: 60px;
  padding: 10px 0 10px 15px;
}
.ellipsis{
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  width: 255px;
}

.home {
  blockquote {
    padding: 10px 20px;
    margin: 0 0 20px;
    font-size: 17.5px;
    border-left: 5px solid #eee;
  }
  hr {
    margin-top: 20px;
    margin-bottom: 20px;
    border: 0;
    border-top: 1px solid #eee;
  }
  .col-item {
    margin-bottom: 20px;
  }

  ul {
    padding: 0;
    margin: 0;
  }

  font-family: "Bahnschrif";
  font-size: 13px;
  color: #676a6c;
  overflow-x: hidden;

  ul {
    list-style-type: none;
  }

  h4 {
    margin-top: 0px;
  }

  h2 {
    margin-top: 10px;
    font-size: 26px;
    font-weight: 100;
  }

  p {
    margin-top: 10px;

    b {
      font-weight: 700;
    }
  }

  .update-log {
    ol {
      display: block;
      list-style-type: decimal;
      margin-block-start: 1em;
      margin-block-end: 1em;
      margin-inline-start: 0;
      margin-inline-end: 0;
      padding-inline-start: 40px;
    }
  }
}
</style>

