<template>
  <!-- <div class="app-container home">
    <el-row :gutter="20">
      <el-col :sm="24" :lg="12" style="padding-left: 20px">
        <h2>大道成物流后台管理框架</h2>
        <p>
          <b>当前版本:</b> <span>v{{ version }}</span>
        </p>
      </el-col>

      <el-col :sm="24" :lg="12" style="padding-left: 50px">
        <el-row>
          <el-col :span="12">
            <h2>技术选型</h2>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <h4>后端技术</h4>
            <ul>
              <li>SpringBoot</li>
              <li>SpringCloud</li>
              <li>Nacos</li>
              <li>Sentinel</li>
              <li>MyBatis</li>
              <li>Fastjson</li>
              <li>...</li>
            </ul>
          </el-col>
          <el-col :span="6">
            <h4>前端技术</h4>
            <ul>
              <li>Vue</li>
              <li>Vuex</li>
              <li>Element-ui</li>
              <li>Axios</li>
              <li>Sass</li>
              <li>Quill</li>
              <li>...</li>
            </ul>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-divider />
  </div> -->
  <div style="min-width:1450px; overflow-x: scroll;">
    <div class="top-tips">
      <el-row :gutter="20">
        <el-col :span="24">
          <i class="el-icon-warning g-color-warning" style="margin-right: 10px;" />
          <span class="g-color-gray">{{ tip }}</span>
        </el-col>
      </el-row>
    </div>

    <div class="margin15">
      <el-row :gutter="20">
        <!-- 用户信息 -->
        <el-col :span="4">
          <div class="index-frame g-flex g-aligncenter" style="height:144px;">
            <el-image class="user-avator" src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg" fit="cover" />
            <div style="margin-left:15px;">
              <div class="g-color-title g-strong g-title-big">余晨望</div>
              <div class="user-post g-margin-tb"><img src="~@/assets/images/workbench/icon_position.png" style="margin-right: 10px;" alt="">客服专员</div>
              <div class="g-color-tag">大道成物流 | 客服部</div>
            </div>
          </div>
        </el-col>
        <!-- 便捷导航 -->
        <el-col :span="14">
          <div class="index-frame" style="height:144px">
            <div class="g-color-bigtitle g-strong g-title-medium">便捷导航</div>
            <div class="g-flex g-aligncenter g-flexwrap" style="margin-top: 10px;">
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
        </el-col>
        <!-- 系统公告 -->
        <el-col :span="6">
          <div class="index-frame" style="height:144px; padding: 0;">
            <div class="notice-img">
              <div class="notice-content">
                <div class="g-color-title g-strong g-title-medium">系统公告</div>
                <div class="g-color-title notice-tip">{{ tip }}</div>
              </div>
            </div>
            <div class="notice-bottom" />
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="margintop20">
        <el-col :span="18">
          <el-row :gutter="20">
            <!-- 运单 -->
            <el-col :span="13">
              <div class="index-frame" style="height: 400px">
                <div class="g-color-bigtitle g-strong g-title-medium">运单</div>
                <div class="g-flex">
                  <div style="width:35%; margin-left: 10px; margin-top: 30px;">
                    <div class="g-flex g-aligncenter">
                      <img class="marginright20" src="~@/assets/images/workbench/icon_waybillnum.png" alt="">
                      <div>
                        <div class="g-color-title">运单总数</div>
                        <div class="g-color-tag g-title-smaller"><span class="g-color-title g-strong g-title-larger">23436</span> 单</div>
                      </div>
                    </div>
                    <div class="g-flex g-aligncenter" style="margin-top:50px;">
                      <img class="marginright20" src="~@/assets/images/workbench/icon_waybillnum.png" alt="">
                      <div>
                        <div class="g-color-title">今日运单数</div>
                        <div class="g-color-tag g-title-smaller"><span class="g-color-title g-strong g-title-larger">436</span> 单</div>
                      </div>
                    </div>
                    <img class="waybill-bg" src="~@/assets/images/workbench/icon_waybillbg.png" alt="">
                  </div>
                  <div style="width: 60%">
                    <div class="g-color-title g-title-smaller">
                      <span class="g-color-blue marginright5">●</span>今日已装货
                      <span class="g-color-title g-strong g-title-medium">334</span>单
                    </div>
                    <el-progress class="margintop5" :percentage="70" :show-text="false" />
                    <div class="g-color-title g-title-smaller margintop20">
                      <span class="g-color-blue marginright5">●</span>今日已卸货
                      <span class="g-color-title g-strong g-title-medium">200</span>单
                    </div>
                    <el-progress class="margintop5" :percentage="60" :show-text="false" />
                    <div class="g-color-title g-title-smaller margintop20">
                      <span class="g-color-blue marginright5">●</span>今日已复核
                      <span class="g-color-title g-strong g-title-medium">160</span>单
                    </div>
                    <el-progress class="margintop5" :percentage="50" :show-text="false" />
                    <div class="g-color-title g-title-smaller margintop20">
                      <span class="g-color-blue marginright5">●</span>今日已结算
                      <span class="g-color-title g-strong g-title-medium">120</span>单
                    </div>
                    <el-progress class="margintop5" :percentage="40" :show-text="false" />
                    <div class="g-color-title g-title-smaller margintop20">
                      <span class="g-color-blue marginright5">●</span>今日已打款
                      <span class="g-color-title g-strong g-title-medium">100</span>单
                    </div>
                    <el-progress class="margintop5" :percentage="30" :show-text="false" />
                  </div>
                </div>
              </div>
            </el-col>
            <el-col :span="11">
              <!-- 货单 -->
              <div class="index-frame" style="height: 190px;">
                <div class="g-color-bigtitle g-strong g-title-medium">货单</div>
                <div class="g-flex" style="margin-top: 8px; margin-left:5px">
                  <div style="margin-right: 30px;">
                    <div class="g-color-title">货单总数</div>
                    <div class="g-color-tag g-title-smaller"><span class="g-color-title g-strong g-title-larger">23436</span> 单</div>
                    <div class="g-color-title margintop20">今日货单</div>
                    <div class="g-color-tag g-title-smaller"><span class="g-color-title g-strong g-title-larger">436</span> 单</div>
                  </div>
                  <div class="order-frame" style="margin-right: 20px;">
                    <img src="~@/assets/images/workbench/icon_publishorder.png" alt="">
                    <div class="g-color-title margintop20">发布中</div>
                    <div class="g-color-tag g-title-smaller"><span class="g-color-title g-strong g-title-medium">436</span> 单</div>
                  </div>
                  <div class="order-frame">
                    <img src="~@/assets/images/workbench/icon_closeorder.png" alt="">
                    <div class="g-color-title margintop20">已关闭</div>
                    <div class="g-color-tag g-title-smaller"><span class="g-color-title g-strong g-title-medium">436</span> 单</div>
                  </div>
                </div>
              </div>
              <!-- 发票 -->
              <div class="index-frame margintop20" style="height: 190px;">
                <div class="g-color-bigtitle g-strong g-title-medium">发票</div>
                <div class="g-flex" style="margin-top: 8px; margin-left:5px">
                  <div style="margin-right: 30px;">
                    <div class="g-color-title">发票总数</div>
                    <div class="g-color-tag g-title-smaller"><span class="g-color-title g-strong g-title-larger">23436</span> 单</div>
                    <div class="g-color-title margintop20">今日发票</div>
                    <div class="g-color-tag g-title-smaller"><span class="g-color-title g-strong g-title-larger">436</span> 单</div>
                  </div>
                  <div class="order-frame" style="margin-right: 20px;">
                    <img src="~@/assets/images/workbench/icon_ask.png" alt="">
                    <div class="g-color-title margintop20">今日已索票</div>
                    <div class="g-color-tag g-title-smaller"><span class="g-color-title g-strong g-title-medium">436</span> 单</div>
                  </div>
                  <div class="order-frame" style="margin-right: 20px;">
                    <img src="~@/assets/images/workbench/icon_examine.png" alt="">
                    <div class="g-color-title margintop20">今日已审核</div>
                    <div class="g-color-tag g-title-smaller"><span class="g-color-title g-strong g-title-medium">436</span> 单</div>
                  </div>
                  <div class="order-frame">
                    <img src="~@/assets/images/workbench/icon_onbilling.png" alt="">
                    <div class="g-color-title margintop20">已开票</div>
                    <div class="g-color-tag g-title-smaller"><span class="g-color-title g-strong g-title-medium">436</span> 单</div>
                  </div>
                </div>
              </div>
            </el-col>
          </el-row>
          <!-- 平台概览 -->
          <div class="index-frame margintop20">
            <div class="g-color-bigtitle g-strong g-title-medium">平台概览</div>
            <div class="g-flex g-aligncenter margintop5">
              <div class="g-flex g-aligncenter g-flexdirection" style="width:25%">
                <el-progress type="circle" :percentage="80" :stroke-width="20" :width="160" color="#409EFF" :show-text="false" />
                <div class="platform-num g-flex g-aligncenter g-flexdirection">
                  <div class="g-color-title g-strong g-title-medium">4514</div>
                  <div class="g-color-title">平台货主数</div>
                </div>
                <div style="margin-top:18px;"><span class="g-color-blue marginright5">●</span>活跃货主</div>
                <div class="g-flex g-aligncenter g-justifyaround" style="margin-top:18px; width: 80%">
                  <div>
                    <div class="g-color-title g-strong g-title-big">260</div>
                    <div class="g-color-tag">企业数</div>
                  </div>
                  <div>
                    <div class="g-color-title g-strong g-title-big">300</div>
                    <div class="g-color-tag">账号数</div>
                  </div>
                  <div>
                    <div class="g-color-title g-strong g-title-big">160</div>
                    <div class="g-color-tag">活跃企业</div>
                  </div>
                </div>
              </div>
              <div class="g-flex g-aligncenter g-flexdirection" style="width:25%">
                <el-progress type="circle" :percentage="70" :stroke-width="20" :width="160" color="#40CBFF" :show-text="false" />
                <div class="platform-num g-flex g-aligncenter g-flexdirection">
                  <div class="g-color-title g-strong g-title-medium">15067</div>
                  <div class="g-color-title">平台司机数</div>
                </div>
                <div style="margin-top:18px;"><span class="g-color-blue marginright5">●</span>活跃司机</div>
                <div class="g-flex g-aligncenter g-justifyaround" style="margin-top:18px; width: 80%">
                  <div>
                    <div class="g-color-title g-strong g-title-big">260</div>
                    <div class="g-color-tag">零散司机</div>
                  </div>
                  <div>
                    <div class="g-color-title g-strong g-title-big">300</div>
                    <div class="g-color-tag">聘用司机</div>
                  </div>
                  <div>
                    <div class="g-color-title g-strong g-title-big">15067</div>
                    <div class="g-color-tag">活跃司机</div>
                  </div>
                </div>
              </div>
              <div class="g-flex g-aligncenter g-flexdirection" style="width:25%">
                <el-progress type="circle" :percentage="30" :stroke-width="20" :width="160" color="#67C23A" :show-text="false" />
                <div class="platform-num g-flex g-aligncenter g-flexdirection">
                  <div class="g-color-title g-strong g-title-medium">15099</div>
                  <div class="g-color-title">平台车辆数</div>
                </div>
                <div style="margin-top:18px;"><span class="g-color-success marginright5">●</span>活跃车辆</div>
                <div class="g-flex g-aligncenter g-justifyaround" style="margin-top:18px; width: 80%">
                  <div>
                    <div class="g-color-title g-strong g-title-big">260</div>
                    <div class="g-color-tag">活跃车辆</div>
                  </div>
                </div>
              </div>
              <div class="g-flex g-aligncenter g-flexdirection" style="width:25%">
                <el-progress type="circle" :percentage="60" :stroke-width="20" :width="160" color="#FFBB00" :show-text="false" />
                <div class="platform-num g-flex g-aligncenter g-flexdirection">
                  <div class="g-color-title g-strong g-title-medium">13067</div>
                  <div class="g-color-title">平台调度者数</div>
                </div>
                <div style="margin-top:18px;"><span class="g-color-warning marginright5">●</span>活跃调度者</div>
                <div class="g-flex g-aligncenter g-justifyaround" style="margin-top:18px; width: 80%">
                  <div>
                    <div class="g-color-title g-strong g-title-big">160</div>
                    <div class="g-color-tag">活跃调度者</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-col>
        <!-- 动态 -->
        <el-col :span="6">
          <div class="index-frame" style="height:740px;">
            <div class="g-color-bigtitle g-strong g-title-medium">动态</div>
            <el-row class="trend-tab">
              <el-col :span="8">
                <div :class="activeName === '1' ? 'trend-onbottom': 'trend-bottom'" @click="handleClick('1')">货单动态</div>
              </el-col>
              <el-col :span="8">
                <div :class="activeName === '2' ? 'trend-onbottom': 'trend-bottom'" @click="handleClick('2')">运单动态</div>
              </el-col>
              <el-col :span="8">
                <div :class="activeName === '3' ? 'trend-onbottom': 'trend-bottom'" @click="handleClick('3')">发票动态</div>
              </el-col>
            </el-row>
            <!-- 货单动态 -->
            <div v-if="activeName === '1'" class="trend-frame">
              <div class="trend-oncontent g-flex g-aligncenter">
                <img src="~@/assets/images/workbench/icon_publishorder1.png" alt="">
                <div style="margin-left: 12px;">
                  <div class="g-color-blue g-title-smaller">2分钟前 2021-01-28 09:49:23</div>
                  <div class="g-color-blue g-strong margintop5">余晨望 发布货源（1092838191201）</div>
                </div>
              </div>
              <div class="trend-content g-flex g-aligncenter">
                <div class="trend-line" />
                <img src="~@/assets/images/workbench/icon_closeorder1.png" alt="">
                <div style="margin-left: 12px;">
                  <div class="g-color-tag g-title-smaller">2分钟前 2021-01-28 09:49:23</div>
                  <div class="g-color-title g-strong margintop5">余晨望 关闭货源（1092838191201）</div>
                </div>
              </div>
              <div v-for="(item, index) in 10" :key="index" class="trend-content g-flex g-aligncenter">
                <div class="trend-line" />
                <img src="~@/assets/images/workbench/icon_publishorder1.png" alt="">
                <div style="margin-left: 12px;">
                  <div class="g-color-tag g-title-smaller">2分钟前 2021-01-28 09:49:23</div>
                  <div class="g-color-title g-strong margintop5">余晨望 发布货源（1092838191201）</div>
                </div>
              </div>
            </div>
            <!-- 运单动态 -->
            <div v-if="activeName === '2'" class="trend-frame">
              <div class="trend-content g-flex g-aligncenter">
                <img src="~@/assets/images/workbench/icon_addwaybill1.png" alt="">
                <div style="margin-left: 12px;">
                  <div class="g-color-tag g-title-smaller">2分钟前 2021-01-28 09:49:23</div>
                  <div class="g-color-title g-strong margintop5">余晨望 创建订单（1092838191201）</div>
                </div>
              </div>
              <div class="trend-content g-flex g-aligncenter">
                <div class="trend-line" />
                <img src="~@/assets/images/workbench/icon_closewaybill.png" alt="">
                <div style="margin-left: 12px;">
                  <div class="g-color-tag g-title-smaller">2分钟前 2021-01-28 09:49:23</div>
                  <div class="g-color-title g-strong margintop5">余晨望 取消订单（1092838191201）</div>
                </div>
              </div>
              <div class="trend-content g-flex g-aligncenter">
                <div class="trend-line" />
                <img src="~@/assets/images/workbench/icon_load.png" alt="">
                <div style="margin-left: 12px;">
                  <div class="g-color-tag g-title-smaller">2分钟前 2021-01-28 09:49:23</div>
                  <div class="g-color-title g-strong margintop5">余晨望 运单装货（1092838191201）</div>
                </div>
              </div>
              <div v-for="(item, index) in 10" :key="index" class="trend-content g-flex g-aligncenter">
                <div class="trend-line" />
                <img src="~@/assets/images/workbench/icon_unload.png" alt="">
                <div style="margin-left: 12px;">
                  <div class="g-color-tag g-title-smaller">2分钟前 2021-01-28 09:49:23</div>
                  <div class="g-color-title g-strong margintop5">余晨望 运单卸货（1092838191201）</div>
                </div>
              </div>
            </div>
            <!-- 发票动态 -->
            <div v-if="activeName === '3'" class="trend-frame">
              <div class="trend-content g-flex g-aligncenter">
                <img src="~@/assets/images/workbench/icon_applyinvoice.png" alt="">
                <div style="margin-left: 12px;">
                  <div class="g-color-tag g-title-smaller">2分钟前 2021-01-28 09:49:23</div>
                  <div class="g-color-title g-strong margintop5">余晨望 货主申请开票（1092838191201）</div>
                </div>
              </div>
              <div v-for="(item, index) in 10" :key="index" class="trend-content g-flex g-aligncenter">
                <div class="trend-line" />
                <img src="~@/assets/images/workbench/icon_applyinvoice.png" alt="">
                <div style="margin-left: 12px;">
                  <div class="g-color-tag g-title-smaller">2分钟前 2021-01-28 09:49:23</div>
                  <div class="g-color-title g-strong margintop5">余晨望 货主申请开票（1092838191201）</div>
                </div>
              </div>
            </div>
            <div class="notice-bottom" />
          </div>
        </el-col>
      </el-row>
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
.index-frame{
  padding: 15px;
  background: #fff;
  border-radius: 4px;
}
.margintop20{
  margin-top: 20px;
}
.margintop5{
  margin-top: 5px;
}
.marginright20{
  margin-right: 20px;
}
.marginright5{
  margin-right: 5px;
}
.margin15{
  margin: 0 15px 15px;
}
.width10{
  width: 10%;
}
.nav-icon{
  height: 44px;
  width: 44px;
}
.top-tips{
  background: #FFFBE6;
  border: 1px solid #FFE58F;
  border-radius: 2px;
  margin: 0 15px 15px;
  padding: 9px 12px;
}
// 用户信息
.user-avator{
  width: 72px;
  height: 72px;
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
// 系统公告
.notice-bottom{
  width: 100%;
  height: 50px;
  background: linear-gradient(180deg, rgba(255,255,255,0) 0%, #FFFFFF 100%);
  border-radius: 4px;
  position: relative;
  bottom: 50px;
}
.notice-img{
  background: url('~@/assets/images/workbench/icon_notice.png') no-repeat;
  background-size: 197px 144px;
  height: 144px;
}
.notice-content{
  margin-top: 10px;
  float: right;
  width: 70%;
}
.notice-tip{
  margin-top: 10px;
  font-family: PingFang SC;
  height: 80px;
  overflow: hidden; //超出隐藏
}
// 运单
.waybill-bg{
  position: relative;
  top: 40px;
  left: -25px;
}
::v-deep .el-progress-bar__inner {
  background: linear-gradient(270deg, #409EFF 0%, rgba(64, 158, 255, 0.51) 100%);
}
// 货单
.order-frame{
  width: 120px;
  height: 120px;
  background: #F3F3F3;
  border-radius: 9px;
  padding: 12px;
}
// 平台概览
.platform-num{
  position: relative;
  bottom: 100px;
  left: 0;
  height: 0;
}
// 动态
.trend-tab{
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
  height: 630px;
  overflow: hidden;
}
.trend-line{
  position: relative;
  bottom: 30px;
  left: 12px;
  width: 0px;
  height: 24px;
  border: 1px dashed #E6E6E6;
}
.trend-oncontent{
  height: 60px;
  padding: 10px 15px;
  background: #F9FBFC;
}
.trend-content{
  height: 60px;
  padding: 10px 15px;
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

  font-family: "open sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
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

