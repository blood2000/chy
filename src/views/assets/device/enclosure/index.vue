<template>
  <div class="device-info ly-flex">
    <div class="device-info-left">
      <Tabs :tablist="tablist" @getActiveName="getActiveTab" />
      <div class="device-info-list-box">
        <el-checkbox-group v-model="checkList" @change="changeChecked">
          <ul v-infinite-scroll="loadMore" class="device-info-list infinite-list own-device-scroll-box">
            <li v-for="item in deviceList" :key="item.code" class="ly-flex-v ly-flex-pack-justify" :class="{active: activeCard === item.typeCode+item.factoryOnlyCode}">
              <div class="title ly-flex ly-flex-pack-justify ly-flex-align-center">
                <p class="label ly-flex ly-flex-align-center">
                  <el-checkbox :label="item.typeCode+','+item.factoryOnlyCode" :disabled="item.status !== 1" @click.native="handleActive(item.status, item.typeCode+item.factoryOnlyCode)" />
                  <span class="ml10">{{ item.data.deviceName }}</span>
                </p>
                <p class="status" :class="item.expireFlag === 0 ? '' : item.expireFlag === 0 ? 'red' : item.status === 1 ? 'green' : 'gray'">·
                  {{ item.expireFlag === 0 ? '未激活' : item.expireFlag === 0 ? '过期' : item.status === 1 ? '在线' : '离线' }}
                </p>
              </div>
              <div class="info-groud ly-flex ly-flex-align-center">
                <!-- <p class="ly-flex ly-flex-align-center">
                  <img class="mr5" src="@/assets/images/device/xh3.png">
                  信号
                </p> -->
                <!-- <p>安全围栏</p> -->
                <p v-if="item.data.electQuantity" class="ly-flex ly-flex-align-center">
                  <img v-if="item.data.electQuantity > 90" class="mr5" :src="require('@/assets/images/device/dl3'+ (activeCard === item.typeCode+item.factoryOnlyCode ? '_hov' : '') +'.png')">
                  <img v-else-if="item.data.electQuantity > 60" class="mr5" :src="require('@/assets/images/device/dl2'+ (activeCard === item.typeCode+item.factoryOnlyCode ? '_hov' : '') +'.png')">
                  <img v-else-if="item.data.electQuantity > 10" class="mr5" :src="require('@/assets/images/device/dl1'+ (activeCard === item.typeCode+item.factoryOnlyCode ? '_hov' : '') +'.png')">
                  <img v-else class="mr5" src="@/assets/images/device/dl1.png">
                  电量{{ item.data.electQuantity ? item.data.electQuantity + '%' : '-' }}
                </p>
              </div>
              <div class="ly-flex button-groud">
                <p>关注</p>
                <p>轨迹回放</p>
                <p>实时跟踪</p>
                <p>更多</p>
              </div>
            </li>
          </ul>
        </el-checkbox-group>
      </div>
    </div>
    <div class="device-info-right">
      <div class="device-info-map-info ly-flex ly-flex-pack-justify">
        <div>
          <h5 class="title">地图模式</h5>
          <div class="status-groud ly-flex">
            <p><span>15</span>秒后刷新</p>
            <p><span class="g-pot g-color-success" />在线 ({{ statisticsData.onlineNum }})</p>
            <p><span class="g-pot g-color-error" />过期 ({{ statisticsData.expireNum }})</p>
            <p><span class="g-pot g-color-gray" />离线 ({{ statisticsData.offlineNum }})</p>
            <!-- <p><span class="g-pot g-color-success" />激活 ({{ statisticsData.activeNum }})</p> -->
            <p><span class="g-pot g-color-light-gray" />未激活 ({{ statisticsData.noActiveNum }})</p>
          </div>
        </div>
        <div />
      </div>
      <MapBox ref="mapRef" class="device-info-map-box" />
    </div>
  </div>
</template>

<script>
import { getConsoleDeviceList, getConsoleDeviceLocation, getConsoleDeviceStatistics } from '@/api/assets/device.js';
import Tabs from './tabs.vue';
import MapBox from './map.vue';

export default {
  name: 'Enclosure',
  components: {
    Tabs,
    MapBox
  },
  data() {
    return {
      // tab
      activeTab: '0',
      tablist: [{
        code: '0',
        tabName: '全部',
        num: 0
      }, {
        code: '1',
        tabName: '在线',
        num: 0
      }, {
        code: '2',
        tabName: '离线',
        num: 0
      }],
      // 设备列表
      loading: true,
      deviceList: [],
      total: 0,
      isMore: true,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        typeCode: undefined,
        status: undefined,
        deviceNumber: undefined,
        name: undefined
      },
      // 设备位置参数
      factoryList: [],
      // 缓存设备位置信息
      deviceLocation: {},
      // 定时器
      timer: null,
      // 勾选的设备-code
      checkList: [],
      // 勾选的设备-带信息
      checkedDeviceList: [],
      // 选中的卡片
      activeCard: '',
      // 统计
      statisticsData: {}
      // 地图

    };
  },
  mounted() {
    this.getList();
    this.getStatistics();
    this.getLocationByTime(15);
  },
  beforeDestroy() {
    this.clearTimer();
  },
  methods: {
    // 切换tab
    getActiveTab(val) {
      if (this.activeTab === val) return;
      this.activeTab = val;
      if (val === '0') {
        this.queryParams.status = undefined;
      } else if (val === '1') {
        this.queryParams.status = 1;
      } else if (val === '2') {
        this.queryParams.status = 0;
      }
      this.isMore = true;
      this.queryParams.pageNum = 1;
      this.deviceList = [];
      this.getList();
    },
    /** 获取列表数据 */
    getList() {
      if (!this.isMore) return;
      this.loading = true;
      getConsoleDeviceList(this.queryParams).then(response => {
        if (response.data.list && response.data.list.length > 0) {
          this.deviceList = [...this.deviceList, ...response.data.list];
          this.total = response.data.total;
          // 更新tab数
          if (this.queryParams.status === 1) {
            this.tablist[1].num = this.total;
          } else if (this.queryParams.status === 0) {
            this.tablist[2].num = this.total;
          } else {
            this.tablist[0].num = this.total;
          }
          // 获取当前全部设备定位数据
          this.getLocationParams();
          this.getLocation();
        } else {
          this.isMore = false;
        }
        this.loading = false;
      });
    },
    loadMore() {
      this.queryParams.pageNum++;
      this.getList();
    },
    /** 获取统计数据 */
    getStatistics() {
      getConsoleDeviceStatistics().then(response => {
        this.statisticsData = response.data;
        this.tablist[1].num = this.statisticsData.onlineNum;
        this.tablist[2].num = this.statisticsData.offlineNum;
      });
    },
    /** 获取设备位置信息-构造参数 */
    getLocationParams() {
      const _this = this;
      this.factoryList = [];
      const obj = {};
      this.deviceList.forEach(el => {
        if (obj[el.typeCode]) {
          obj[el.typeCode].push(el.factoryOnlyCode);
        } else {
          obj[el.typeCode] = [];
          obj[el.typeCode].push(el.factoryOnlyCode);
        }
      });
      for (const key in obj) {
        _this.factoryList.push({
          typeCode: key,
          factoryOnlyCodeList: obj[key]
        });
      }
    },
    /** 获取设备位置信息-接口 */
    getLocation() {
      getConsoleDeviceLocation(this.factoryList).then(response => {
        this.deviceLocation = response.data;
      });
    },
    /**
     * 定时获取设备位置信息
     * @param {number} time 单位:秒
     */
    getLocationByTime(time) {
      const _this = this;
      this.clearTimer();
      this.timer = setInterval(() => {
        _this.getLocation();
      }, time * 1000);
    },
    /** 清除定时器 */
    clearTimer() {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
    },
    /** 获取勾选的设备 */
    changeChecked(dataList) {
      const list = dataList.map(el => {
        return el.split(',');
      });
      this.checkedDeviceList = [];
      list.forEach(el => {
        this.deviceLocation[el[0]][el[1]].typeCode = el[0];
        this.deviceLocation[el[0]][el[1]].factoryOnlyCode = el[1];
        this.checkedDeviceList.push(this.deviceLocation[el[0]][el[1]]);
      });
      // 回显地图定位
      console.log(this.checkedDeviceList);
      this.$refs.mapRef.removeAllMarker();
      this.checkedDeviceList.forEach(el => {
        if (el.lng && el.lng !== 0 && el.lat && el.lat !== 0) {
          this.$refs.mapRef.drawMarker(el.factoryOnlyCode, [el.lng, el.lat], el);
        }
      });
    },
    /** 选中设备卡片 */
    handleActive(status, index) {
      if (status !== 1) {
        this.msgInfo('没有找到该设备的位置信息');
        return;
      }
      this.activeCard = index;
    }
  }
};
</script>

<style lang="scss" scoped>
.device-info{
  margin: 0 15px 0;
  box-shadow: 0px 2px 3px 0px rgba(51, 153, 255, 0.1);
  height: calc(100vh - 146px);
  min-width: 1200px;
  overflow-x: auto;

  // 左
  .device-info-left{
    width: 364px;
    height: 100%;
    padding: 0;
    background-color: #F8F8F8;
    border-radius: 4px;
    overflow: hidden;
  }

  // 右
  .device-info-right{
    width: calc(100% - 364px);
    height: 100%;
    padding: 16px 12px 12px 34px;
    background: #fff;
    border-radius: 3px;
  }

  // 设备列表
  .device-info-list-box{
    height: 100%;
    padding: 4px 0 0 24px;
    overflow: hidden;
    .device-info-list{
      height: calc(100vh - 188px);
      overflow-y: auto;
      font-size: 14px;
      >li{
        height: 120px;
        margin: 12px 20px 16px 0;
        background: #fff;
        border-radius: 6px;
        overflow: hidden;
        cursor: default;
        ::v-deep.el-checkbox__label{
          display: none;
        }
        position: relative;
        &::after{
          content: '';
          width: 100%;
          height: 100%;
          background: url('~@/assets/images/device/card_bg.png') no-repeat;
          background-size: 100% 100%;
          position: absolute;
          top: 0;
          right: 0;
          z-index: 0;
          opacity: 0;
        }
        .title{
          position: relative;
          z-index: 1;
          padding: 12px 16px 4px;
          .label{
            font-size: 18px;
            font-family: PingFang SC;
            font-weight: bold;
            line-height: 22px;
            color: #262626;
          }
          .status{
            font-size: 14px;
            font-family: PingFang SC;
            font-weight: bold;
            line-height: 22px;
            // 未激活
            color: #D8D8D8;
            // 在线
            &.green{
              color: #67C23A;
            }
            // 过期
            &.red{
              color: #F56C6C;
            }
            // 离线
            &.gray{
              color: #9FA2B5;
            }
          }
        }
        .info-groud{
          position: relative;
          z-index: 1;
          padding: 0 16px;
          >p{
            width: 50%;
            font-size: 12px;
            font-family: PingFang SC;
            font-weight: 400;
            line-height: 22px;
            color: #9FA2B5;
            >img{
              padding-top: 2px;
            }
          }
        }
        .button-groud{
          position: relative;
          z-index: 1;
          >p{
            width: 25%;
            height: 36px;
            line-height: 35px;
            border-top: 1px solid rgba(159, 162, 181, 0.2);
            text-align: center;
            cursor: pointer;
            font-size: 12px;
            font-family: PingFang SC;
            font-weight: 400;
            color: #262626;
            &:not(:last-child){
              border-right: 1px solid rgba(159, 162, 181, 0.2);
            }
          }
        }
        &.active{
          box-shadow: 0px 3px 16px rgba(25, 144, 255, 0.32);
          &::after{
            opacity: 1;
          }
          .title{
            .label{
              color: #fff;
            }
          }
          .info-groud{
            padding: 0 16px;
            >p{
              color: #fff;
            }
          }
          .button-groud{
            >p{
              border-top: 1px solid #006CDB;
              color: #fff;
              &:not(:last-child){
                border-right: 1px solid #006CDB;
              }
            }
          }
        }
      }
    }
  }

  // 地图顶部信息
  .device-info-map-info{
    height: 50px;
    .title{
      font-size: 18px;
      font-family: PingFang SC;
      font-weight: bold;
      line-height: 22px;
      color: #262626;
      margin-bottom: 4px;
    }
    .status-groud{
      p{
        font-size: 12px;
        font-family: PingFang SC;
        font-weight: bold;
        line-height: 22px;
        color: #262626;
        >span{
          margin-right: 8px;
        }
        &:first-child{
          width: 78px;
          font-weight: normal;
          >span{
            font-weight: bold;
          }
        }
        &:not(:last-child){
          margin-right: 30px;
        }
      }
    }
  }

  // 地图
  .device-info-map-box{
    height: calc(100% - 50px);
  }
}
</style>

<style lang="scss">
// 滚动条样式
.own-device-scroll-box::-webkit-scrollbar {
  width: 6px;     /*高宽分别对应横竖滚动条的尺寸*/
  height: 6px;
}
.own-device-scroll-box::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
  border-radius: 6px;
  background: rgba(0, 0, 0, 0.1);
}
.own-device-scroll-box::-webkit-scrollbar-thumb:hover {
  background:rgba(0, 0, 0, 0.2);
}
</style>
