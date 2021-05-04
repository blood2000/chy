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
  <div>
    <div class="top-tips">
      <el-row :gutter="20">
        <el-col :span="24">
          <i class="el-icon-warning g-color-warning" style="margin-right: 10px;" />
          <span class="g-color-gray">
            亲爱的用户，2021年4月22日（周四晚）21:30至23:00,银行系统升级，这期可能存在部分运单支付后较长时间处于“支付中”，
            处于“支付中”的您可以待系统升级以后反馈销售让我们处理，为了您能正常支付运单，建议您避开此时段操作支付感谢您的支持！
          </span>
        </el-col>
      </el-row>
    </div>

    <div class="margin15">
      <el-row :gutter="20">
        <!-- 用户信息 -->
        <el-col :span="4">
          <div class="index-frame">
            <div class="g-flex g-aligncenter">
              <el-image class="user-avator" src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg" fit="cover" />
              <div style="margin-left:15px;">
                <div class="g-color-title g-strong g-title-big">余晨望</div>
                <div class="user-post g-margin-tb"><i class="el-icon-warning g-color-warning" style="margin-right: 10px;" />客服专员</div>
                <div class="g-color-tag">大道成物流 | 客服部</div>
              </div>
            </div>
          </div>
        </el-col>
        <!-- 便捷导航 -->
        <el-col :span="14">
          <div class="index-frame">
            <div class="g-color-tag g-strong g-title-medium">便捷导航</div>
            <el-row :gutter="20">
              <el-col :span="2.5">
                <div>
                  <img class="nav-icon" src="~@/assets/images/workbench/icon_addcompany.png" alt="">
                  <div class="g-color-title g-strong">新增企业</div>
                </div>
              </el-col>
              <el-col :span="2.5">
                <div>
                  <img class="nav-icon" src="~@/assets/images/workbench/icon_report.png" alt="">
                  <div class="g-color-title g-strong">数据上报</div>
                </div>
              </el-col>
              <el-col :span="2.5">
                <div>
                  <img class="nav-icon" src="~@/assets/images/workbench/icon_order.png" alt="">
                  <div class="g-color-title g-strong">发布货源</div>
                </div>
              </el-col>
              <el-col :span="2.5">
                <div>
                  <img class="nav-icon" src="~@/assets/images/workbench/icon_addwaybill.png" alt="">
                  <div class="g-color-title g-strong">新增运单</div>
                </div>
              </el-col>
              <el-col :span="2.5">
                <div>
                  <img class="nav-icon" src="~@/assets/images/workbench/icon_waybillmanage.png" alt="">
                  <div class="g-color-title g-strong">运单管理</div>
                </div>
              </el-col>
              <el-col :span="2.5">
                <div>
                  <img class="nav-icon" src="~@/assets/images/workbench/icon_billing.png" alt="">
                  <div class="g-color-title g-strong">开具发票</div>
                </div>
              </el-col>
              <el-col :span="2.5">
                <div>
                  <img class="nav-icon" src="~@/assets/images/workbench/icon_invoicelist.png" alt="">
                  <div class="g-color-title g-strong">发票列表</div>
                </div>
              </el-col>
              <el-col :span="2.5">
                <div>
                  <img class="nav-icon" src="~@/assets/images/workbench/icon_waybillcp.png" alt="">
                  <div class="g-color-title g-strong">运单投诉</div>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-col>
        <!-- 系统公告 -->
        <el-col :span="6">
          <div class="index-frame">
            <el-image class="user-avator" src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg" fit="cover" />
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="margin-top20">
        <el-col :span="18">
          <el-row :gutter="20">
            <el-col :span="14">
              <div class="index-frame">
                <el-image class="user-avator" src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg" fit="cover" />
              </div>
            </el-col>
            <el-col :span="10">
              <div class="index-frame">
                <el-image class="user-avator" src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg" fit="cover" />
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="20" class="margin-top20">
            <el-col :span="24">
              <div class="index-frame">
                <el-image class="user-avator" src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg" fit="cover" />
              </div>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="6">
          <div class="index-frame">
            <el-image class="user-avator" src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg" fit="cover" />
          </div>
        </el-col>
      </el-row>
    </div>

  </div>
</template>

<script>
export default {
  name: 'Index',
  data() {
    return {
      // 版本号
      version: '1.2.4.0'
    };
  },
  methods: {
    goTarget(href) {
      window.open(href, '_blank');
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
.margin-top20{
  margin-top: 20px;
}
.margin15{
  margin: 0 15px 15px;
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
  padding: 0 10px;
  height: 22px;
  background: #EBF4FD;
  border-radius: 11px;
  font-size: 14px;
  font-weight: 500;
  line-height: 22px;
  color: #409EFF;
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

