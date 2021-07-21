<template>
  <div class="census-page">
    <div v-if="projectList.length === 0 && !loading" class="app-container" style="margin: 0">
      <DataNull style="margin: 40px 0" />
    </div>
    <el-row v-if="projectList.length > 0 && !loading" :gutter="15">
      <el-col :xl="6" :lg="7" :md="8" :xs="24">
        <div
          v-loading="projectLoading"
          class="app-container census-page-left"
          element-loading-background="rgba(255, 255, 255, 0)"
        >
          <ul class="project-list census-scroll-box">
            <li v-for="(item, index) in projectList" :key="item.projectCode" :class="{active: projectActive === index}" class="project-list-item" @click="handleClickProjectItem(item, index)">
              <h5>项目：{{ item.projectName }}</h5>
              <el-row>
                <el-col :span="8">
                  <p class="count">
                    <span v-show="projectActive !== index">今日完成：</span>
                    <span class="num">{{ item.todayFinishCount || 0 }}</span>
                  </p>
                  <p v-if="projectActive === index" class="count">今日完成</p>
                </el-col>
                <el-col :span="8">
                  <p class="count">
                    <span v-show="projectActive !== index">今日进场：</span>
                    <span class="num">{{ item.todayApproachCount || 0 }}</span>
                  </p>
                  <p v-if="projectActive === index" class="count">今日进场</p>
                </el-col>
                <el-col :span="8">
                  <p class="count">
                    <span v-show="projectActive !== index">累计完成：</span>
                    <span class="num">{{ item.cumulativeCount || 0 }}</span>
                  </p>
                  <p v-if="projectActive === index" class="count">累计完成</p>
                </el-col>
              </el-row>
            </li>
          </ul>
        </div>
      </el-col>
      <el-col :xl="18" :lg="17" :md="16" :xs="24">
        <div class="census-page-right">
          <el-date-picker v-model="queryDate" value-format="yyyy-MM-dd" class="census-date-picker" size="large" type="date" :clearable="false" placeholder="选择日期" @change="changeDetail" />
          <Tabs :tablist="tablist" @getActiveName="getActiveTab" />
          <div class="app-container">
            <div class="tab-page-wrap census-scroll-box">
              <!-- 1.项目统计 -->
              <div v-if="activeTab === '项目统计'" v-loading="projectStatisticLoading" class="tab-page width60 own-census-table">
                <el-row class="total_bg">
                  <el-col :span="2">
                    <img src="@/assets/images/icon/total.png" alt="">
                  </el-col>
                  <el-col :span="5">
                    <p style="line-height: 30px">车队：<span class="num">{{ projectStatistic.teamCount }}</span></p>
                  </el-col>
                  <el-col :span="5">
                    <p style="line-height: 30px">车辆：<span class="num">{{ projectStatistic.vehicleCount }}</span></p>
                  </el-col>
                  <el-col :span="5">
                    <p style="line-height: 30px">车次：<span class="num">{{ projectStatistic.trainNumber }}</span></p>
                  </el-col>
                </el-row>
                <el-collapse v-model="vechicleCode" accordion class="census-collapse" @change="changeProjectCollapse">
                  <el-collapse-item v-for="(item, index) in projectStatisticList" :key="index" :name="item.vehicleCode">
                    <template slot="title">
                      <h5>
                        {{ item.licenseNumber }}
                        <span>车次：{{ item.trainNumber }}</span>
                      </h5>
                    </template>
                    <el-table v-loading="vechicleLoading" :data="carDetailList">
                      <el-table-column type="index" label="编号" width="100" />
                      <el-table-column label="卸货地" align="left" prop="unloadAddress" />
                      <el-table-column label="装货时间" align="left" prop="loadTime" />
                      <el-table-column label="经手人" align="left" prop="noteTaker" />
                    </el-table>
                  </el-collapse-item>
                </el-collapse>
              </div>
              <!-- 2.进出明细 -->
              <div v-if="activeTab === '进出明细'" class="tab-page">
                <el-table v-loading="inOutLoading" highlight-current-row :data="inOutList">
                  <el-table-column type="index" label="编号" width="60" />
                  <el-table-column label="车牌号" align="left" prop="licenseNumber" />
                  <el-table-column label="进场时间" align="left" prop="inTime" />
                  <el-table-column label="出场时间" align="left" prop="outTime" />
                  <el-table-column label="驾驶员姓名" align="left" prop="driverName" />
                  <el-table-column label="土石方量(m)²" align="left" prop="loadWeight" min-width="90" />
                  <el-table-column label="超高超载" align="left" prop="overload">
                    <template slot-scope="scope">
                      <p v-if="scope.row.overload === 1" class="text">
                        <span class="g-color-error g-pot" />
                        是
                      </p>
                      <p v-else-if="scope.row.overload === 0" class="text">
                        <span class="g-color-success g-pot" />
                        否
                      </p>
                      <p v-else class="text">未装货</p>
                    </template>
                  </el-table-column>
                  <el-table-column label="泥尾" align="left" prop="mudtail" />
                  <el-table-column label="记录人" align="left" prop="noteTaker" />
                </el-table>
              </div>
              <!-- 3.泥尾统计 -->
              <div v-if="activeTab === '泥尾统计'" v-loading="muckardLoading" class="tab-page width60 own-census-table">
                <el-row class="total_bg">
                  <el-col :span="2">
                    <img src="@/assets/images/icon/total.png" alt="">
                  </el-col>
                  <el-col v-for="(item, index) in muckardCounts" :key="index" :span="5">
                    <p style="line-height: 30px">{{ item.mudtail + '：' }}<span class="num">{{ item.trainNumber }}</span></p>
                  </el-col>
                  <el-col :span="5">
                    <p style="line-height: 30px">合计: <span class="num">{{ muckardTotal }}</span></p>
                  </el-col>
                </el-row>
                <el-collapse v-model="muckardCollapse" class="census-collapse">
                  <el-collapse-item v-for="(item, index) in muckardList" :key="index" :name="item.licenseNumber">
                    <template slot="title">
                      <h5>{{ item.licenseNumber }}</h5>
                    </template>
                    <el-table :data="item.muckardCounts">
                      <el-table-column type="index" label="编号" width="100" />
                      <el-table-column label="泥尾" align="left" prop="mudtail" />
                      <el-table-column label="车次" align="left" prop="trainNumber" />
                    </el-table>
                  </el-collapse-item>
                </el-collapse>
              </div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { ListStatistics, ProjectDetails, InOutDetails, MudtailDetails, ListVechicleDetails } from '@/api/dregs/census';
import Tabs from '@/components/Tabs/index';
import DataNull from '@/components/DataNull/index';
export default {
  name: 'Census',
  components: {
    Tabs,
    DataNull
  },
  data() {
    return {
      // 项目列表
      loading: true,
      projectActive: 0,
      projectList: [],
      projectLoading: false,
      projectQueryParams: {
        // pageNum: 1,
        // pageSize: 10
      },
      // 全局控制
      activeTab: '项目统计',
      tablist: [
        { tabName: '项目统计' },
        { tabName: '进出明细' },
        { tabName: '泥尾统计' }
      ],
      queryDate: '',
      projectCode: null,
      // 项目统计
      projectStatistic: {},
      projectStatisticLoading: false,
      projectStatisticList: [],
      // 车辆明细
      vehicleQuery: {
        // pageNum: 1,
        // pageSize: 10,
        projectCode: '',
        queryDate: '',
        vechicleCode: ''
      },
      vechicleCode: '',
      vechicleLoading: false,
      carDetailList: [],
      // 进出明细
      inOutLoading: false,
      inOutList: [],
      // 泥尾统计
      muckardTotal: 0,
      muckardCounts: [],
      muckardLoading: false,
      muckardList: [],
      muckardCollapse: []
    };
  },
  mounted() {
    this.queryDate = this.parseTime(new Date(), '{y}-{m}-{d}');
    this.getProgectList();
  },
  methods: {
    /* 项目列表 */
    getProgectList() {
      this.loading = true;
      ListStatistics(this.projectQueryParams).then(response => {
        this.projectList = response.data.list || [];
        // 根据code获取详情，默认展示第一条的
        if (this.projectList.length > 0) {
          this.projectCode = this.projectList[0].projectCode;
          this.changeDetail();
        }
        this.loading = false;
      }).catch(() => {
        this.loading = false;
      });
    },
    /* 选中项目 */
    handleClickProjectItem(row, index) {
      if (index === this.projectActive) return;
      this.projectActive = index;
      this.projectCode = row.projectCode;
      this.projectLoading = true;
      this.changeDetail();
    },
    /* 选中tab */
    getActiveTab(val) {
      if (this.activeTab === val) return;
      this.activeTab = val;
      this.changeDetail();
    },
    /* 根据项目code/tab/时间切换详情*/
    changeDetail() {
      if (this.activeTab === '项目统计') {
        this.getProjectStatistic();
      } else if (this.activeTab === '进出明细') {
        this.getInOutList();
      } else if (this.activeTab === '泥尾统计') {
        this.getMudtailList();
      }
    },
    /* 获取项目统计 */
    getProjectStatistic() {
      this.projectStatisticLoading = true;
      ProjectDetails({
        projectCode: this.projectCode,
        queryDate: this.queryDate
      }).then(response => {
        this.projectLoading = false;
        this.projectStatisticLoading = false;
        this.projectStatistic = response.data || {};
        this.projectStatisticList = this.projectStatistic.vehicleCounts || [];
        if (this.projectStatisticList.length > 0) {
          this.vechicleCode = this.projectStatisticList[0].vehicleCode;
          this.getCarDetailList();
        } else {
          this.vechicleCode = '';
        }
      }).catch(() => {
        this.projectLoading = false;
        this.projectStatisticLoading = false;
      });
    },
    /* 项目统计-选中车辆 */
    changeProjectCollapse(activeName) {
      if (!activeName || activeName === '') return;
      this.vechicleCode = activeName;
      this.getCarDetailList();
    },
    /* 获取车辆明细 */
    getCarDetailList() {
      this.vechicleLoading = true;
      this.carDetailList = [];
      this.vehicleQuery.projectCode = this.projectCode;
      this.vehicleQuery.queryDate = this.queryDate;
      this.vehicleQuery.vechicleCode = this.vechicleCode;
      ListVechicleDetails(this.vehicleQuery).then(response => {
        this.vechicleLoading = false;
        this.carDetailList = response.data || [];
      }).catch(() => {
        this.vechicleLoading = false;
      });
    },
    /* 获取进出明细 */
    getInOutList() {
      this.inOutLoading = true;
      InOutDetails({
        projectCode: this.projectCode,
        queryDate: this.queryDate
      }).then(response => {
        this.projectLoading = false;
        this.inOutLoading = false;
        this.inOutList = response.data.vechicleWaybillInfos || [];
      }).catch(() => {
        this.projectLoading = false;
        this.inOutLoading = false;
      });
    },
    /* 获取泥尾统计 */
    getMudtailList() {
      this.muckardLoading = true;
      MudtailDetails({
        projectCode: this.projectCode,
        queryDate: this.queryDate
      }).then(response => {
        this.projectLoading = false;
        this.muckardLoading = false;
        this.muckardTotal = response.data.total || 0;
        this.muckardCounts = response.data.muckardCounts || [];
        this.muckardList = response.data.vechicleMuckards || [];
        if (this.muckardList.length > 0) {
          this.muckardList.forEach(el => {
            this.muckardCollapse.push(el.licenseNumber);
          });
        } else {
          this.muckardCollapse = [];
        }
      }).catch(() => {
        this.projectLoading = false;
        this.muckardLoading = false;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.census-page{
  margin: 0 15px;

  // 项目列表
  .census-page-left{
    margin: 0 0 15px;
    height: calc(100vh - 210px);
    padding: 20px 0 20px 20px;
    .project-list{
      height: 100%;
      overflow-y: auto;
      padding-right: 15px;
      .project-list-item{
        margin-bottom: 24px;
        cursor: pointer;
        >h5{
          font-size: 16px;
          font-family: PingFang SC;
          font-weight: bold;
          line-height: 30px;
          color: #262626;
        }
        .count{
          font-size: 14px;
          font-family: PingFang SC;
          font-weight: 400;
          line-height: 22px;
          color: rgba(144, 147, 152, 0.7);
        }
        &.active{
          min-height: 154px;
          background: #0672D9;
          box-shadow: 0px 3px 6px rgba(67, 110, 207, 0.4);
          border-radius: 6px;
          padding: 20px;
          >h5{
            font-size: 20px;
            color: #fff;
            margin-bottom: 30px;
          }
          .count{
            color: #fff;
            text-align: center;
            .num{
              font-size: 30px;
              font-weight: bold;
            }
          }
        }
      }
    }
  }

  // 统计
  .census-page-right{
    margin: 0 0 15px;
    .census-date-picker{
      margin-bottom: 18px;
      ::v-deep .el-input__inner{
        border-radius: 22px;
        font-size: 18px;
        font-family: PingFang SC;
        font-weight: bold;
        line-height: 22px;
        color: #262626;
        padding-left: 48px;
        border: 1px solid rgba(144, 147, 152, 0.15);
      }
      ::v-deep .el-input__prefix{
        width: 46px;
        background: url('~@/assets/images/icon/date.png') no-repeat center center;
        background-size: 22px 22px;
        .el-input__icon{
          display: none;
        }
      }
    }
    >.app-container{
      margin: 0;
      height: calc(100vh - 302px);
      padding: 20px 0 20px 20px;
      .tab-page-wrap{
        height: 100%;
        padding-right: 20px;
        overflow-y: auto;
      }
      .total_bg{
        background: #F8F9FA;
        border-radius: 4px;
        padding: 15px 20px 13px;
        margin-bottom: 10px;
        .num{
          font-size: 16px;
          font-weight: bold;
        }
      }
      .width60{
        width: 100%;
        min-width: 544px;
        max-width: 900px;
      }
      // 折叠面板
      .census-collapse{
        border-top: none;
        border-bottom: none;
        ::v-deep .el-collapse-item__header{
          border-bottom: none;
          height: 54px;
          line-height: 54px;
          .el-collapse-item__arrow{
            display: none;
          }
          >h5{
            font-size: 18px;
            font-family: PingFang SC;
            font-weight: bold;
            line-height: 22px;
            color: #262626 !important;
            padding-left: 32px;
            position: relative;
            &::before{
              content: '';
              width: 24px;
              height: 24px;
              position: absolute;
              left: 0;
              top: 50%;
              margin-top: -12px;
              background: url('~@/assets/images/icon/collapse.png') no-repeat;
              background-size: 100% 100%;
              transform: rotate(-180deg);
              transition: transform 0.3s;
            }
            >span{
              font-size: 14px;
              font-weight: 400;
              vertical-align: middle;
              margin-left: 16px;
            }
          }
          &.is-active{
            >h5{
              &::before{
                transform: rotate(0deg);
                transition: transform 0.3s;
              }
            }
          }
        }
        ::v-deep .el-collapse-item__wrap{
          border-bottom: none;
          .el-collapse-item__content{
            padding-bottom: 12px;
          }
        }
      }
    }
  }
}
</style>

<style lang="scss">
// 表格
.own-census-table{
  .el-table .el-table__header-wrapper th,
  .el-table .el-table__fixed-header-wrapper th,
  .el-table__body td{
    background-color: rgba(25, 144, 255, 0.05) !important;
    border-bottom: 1px solid #E4EBF1;
    color: #262626;
    padding: 14px 0;
  }
  .el-table__body td{
    color: rgba(0, 0, 0, 0.7);
  }
}
// 滚动条样式
.census-scroll-box::-webkit-scrollbar {
  width: 6px;     /*高宽分别对应横竖滚动条的尺寸*/
  height: 6px;
}
.census-scroll-box::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
  border-radius: 6px;
  background: rgba(0, 0, 0, 0.1);
}
.census-scroll-box::-webkit-scrollbar-thumb:hover {
  background:rgba(0, 0, 0, 0.2);
}
// projectLoading
.census-page{
  .census-page-left{
    >.el-loading-mask{
      .el-loading-spinner{
        display: none;
      }
    }
  }
}
</style>
