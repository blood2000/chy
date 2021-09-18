<template>
  <div class="device-info ly-flex">
    <div class="device-info-left">
      <Tabs :tablist="bigTablist" @getActiveName="getBigActiveTab" />
      <div class="device-search-box">
        <el-input
          v-model.trim="queryParams.imei"
          class="device-search-input"
          placeholder="请输入IMEI/车牌号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
        <i class="device-search-button el-icon-search" @click="handleQuery" />
      </div>
      <ul class="btn-list-box">
        <li v-for="item in tablist" :key="item.code" :class="{active: item.code === activeTab}" @click="getActiveTab(item.code)">{{ `${item.tabName}` }}</li>
      </ul>
      <div class="device-info-list-box">
        <el-checkbox-group v-if="deviceList.length > 0" v-model="checkList" @change="changeChecked">
          <ul v-infinite-scroll="loadMore" class="device-info-list infinite-list own-device-scroll-box">
            <li
              v-for="item in deviceList"
              :key="item.code"
              class="ly-flex-v ly-flex-pack-justify"
              :class="{active: activeCard === item.typeCode+item.factoryOnlyCode}"
              @click="handleCardClick(item)"
            >
              <div class="title ly-flex ly-flex-pack-justify ly-flex-align-center">
                <p class="label ly-flex ly-flex-align-center">
                  <el-checkbox :label="item.typeCode+','+item.factoryOnlyCode" :disabled="item.activationFlag !== 1" @click.native.stop="handleCheckActive(item.activationFlag, item.typeCode+item.factoryOnlyCode)" />
                  <span class="ml10">{{ item.factoryOnlyCode }}</span>
                </p>
                <p class="status" :class="item.activationFlag === 0 ? '' : item.expireFlag === 0 ? 'red' : item.status === 1 ? 'green' : 'gray'">·
                  {{ item.activationFlag === 0 ? '未激活' : item.expireFlag === 0 ? '过期' : item.status === 1 ? '在线' : '离线' }}
                </p>
              </div>
              <div class="info-groud ly-flex ly-flex-align-center">
                <div v-if="item.vendorCode" class="info-groud-item">
                  <p class="label">厂家</p>
                  {{ selectDictLabel(deviceVendorOptions, item.vendorCode) }}
                </div>
                <div v-if="item.name" class="info-groud-item">
                  <p class="label">设备名称</p>
                  {{ item.name }}
                </div>
              </div>
              <div class="info-groud ly-flex ly-flex-align-center">
                <div v-if="item.data && item.data.electQuantity" class="info-groud-item">
                  <p class="label">设备电量</p>
                  <div class="ly-flex ly-flex-align-center">
                    <img v-if="item.data.electQuantity > 90" class="mr5" :src="require('@/assets/images/device/dl3'+ (activeCard === item.typeCode+item.factoryOnlyCode ? '_hov' : '') +'.png')">
                    <img v-else-if="item.data.electQuantity > 60" class="mr5" :src="require('@/assets/images/device/dl2'+ (activeCard === item.typeCode+item.factoryOnlyCode ? '_hov' : '') +'.png')">
                    <img v-else-if="item.data.electQuantity > 10" class="mr5" :src="require('@/assets/images/device/dl1'+ (activeCard === item.typeCode+item.factoryOnlyCode ? '_hov' : '') +'.png')">
                    <img v-else class="mr5" src="@/assets/images/device/dl1.png">
                    电量{{ item.data.electQuantity ? item.data.electQuantity + '%' : '-' }}
                  </div>
                </div>
                <div v-if="item.licenseNumber" class="info-groud-item">
                  <p class="label">绑定车辆</p>
                  {{ item.licenseNumber }}
                </div>
              </div>
              <div class="ly-flex button-groud">
                <p @click.stop="handleInfo()">关注</p>
                <p @click.stop="handleTrackPlayback(item)">轨迹回放</p>
                <p @click.stop="handleInfo()">实时跟踪</p>
                <p @click.stop="handleInfo()">更多</p>
                <!-- <el-dropdown trigger="click" size="small">
                  <span class="el-dropdown-link">
                    更多
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item>
                      <span @click="handleInfo()">电子围栏</span>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown> -->
              </div>
            </li>
          </ul>
        </el-checkbox-group>
        <div v-if="!loading && deviceList.length === 0" class="device-info-list-none">暂无数据</div>
      </div>
    </div>
    <div class="device-info-right">
      <div class="device-info-map-info ly-flex ly-flex-pack-justify">
        <div>
          <h5 class="title">地图模式</h5>
          <div class="status-groud ly-flex">
            <p><span>{{ currentTime }}</span>秒后刷新</p>
            <p><span class="g-pot g-color-success" />在线 ({{ statisticsData.onlineNum ? statisticsData.onlineNum : 0 }})</p>
            <p><span class="g-pot g-color-error" />过期 ({{ statisticsData.expireNum ? statisticsData.expireNum : 0 }})</p>
            <p><span class="g-pot g-color-gray" />离线 ({{ statisticsData.offlineNum ? statisticsData.offlineNum : 0 }})</p>
            <!-- <p><span class="g-pot g-color-success" />激活 ({{ statisticsData.activeNum ? statisticsData.activeNum : 0 }})</p> -->
            <p><span class="g-pot g-color-light-gray" />未激活 ({{ statisticsData.noActiveNum ? statisticsData.noActiveNum : 0 }})</p>
            <p><span class="g-pot g-color-blue" />已绑定 ({{ statisticsData.bindNum ? statisticsData.bindNum : 0 }})</p>
            <p><span class="g-pot g-color-blue-light" />未绑定 ({{ statisticsData.noBindNum ? statisticsData.noBindNum : 0 }})</p>
          </div>
        </div>
        <div class="device-config-box ly-flex">
          <el-select
            v-model="refreshTime"
            style="width: 74px"
            size="small"
            @change="changeRefreshTime"
          >
            <el-option
              v-for="dict in refreshTimeOptions"
              :key="dict"
              :label="dict + 's'"
              :value="dict"
            />
          </el-select>
          <p style="line-height: 32px; margin-left: 6px;color: #606266;">刷新</p>
          <div class="show-button" :class="{active: isShowDeviceName}" @click="showDeviceName">显示设备名称</div>
        </div>
      </div>
      <MapBox ref="mapRef" :current-map="currentMap" :is-show-device-name="isShowDeviceName" class="device-info-map-box" @onCloseTrack="onCloseTrack" />
    </div>
  </div>
</template>

<script>
import { getConsoleDeviceList, getConsoleDeviceLocation, getConsoleDeviceStatistics, getAllMapping } from '@/api/assets/device.js';
import { getFencePlatList } from '@/api/assets/device';
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
      bigTablist: [{
        code: '0',
        tabName: '全部',
        num: null
      }, {
        code: '1',
        tabName: '关注',
        num: null
      }],
      // tab
      activeTab: '0',
      tablist: [{
        code: '0',
        tabName: '全部'
      }, {
        code: '1',
        tabName: '在线'
      }, {
        code: '2',
        tabName: '离线'
      }, {
        code: '3',
        tabName: '已绑定'
      }, {
        code: '4',
        tabName: '未绑定'
      }],
      // 设备列表
      loading: false,
      deviceList: [],
      total: 0,
      isMore: true,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        typeCode: undefined,
        status: undefined,
        bind: undefined,
        deviceNumber: undefined,
        imei: undefined
      },
      // 设备位置参数
      factoryList: [],
      // 缓存设备位置信息
      deviceLocation: {},
      // 定时器
      timer: null,
      readTimer: null,
      currentTime: 20,
      // 勾选的设备-code
      checkList: [],
      // 勾选的设备-带信息
      checkedDeviceList: [],
      // 选中的卡片
      activeCard: '',
      // 统计
      statisticsData: {},
      // 全部映射字段
      allMapping: {},
      // 判断当前显示的是轨迹track还是定位point
      currentMap: '',
      // 是否显示设备名称
      isShowDeviceName: false,
      // 配置n秒刷新
      refreshTime: 20,
      refreshTimeOptions: [10, 20, 30],
      // 厂家字典
      deviceVendorOptions: []
    };
  },
  mounted() {
    this.getDictsList();
    this.getList(true);
    this.getMapping();
    this.getStatistics();
    this.getLocationByTime();
  },
  beforeDestroy() {
    this.clearTimer();
    this.clearReadTime();
  },
  methods: {
    getDictsList() {
      this.getDicts('device_vendors').then(response => {
        this.deviceVendorOptions = response.data;
      });
    },
    getBigActiveTab(val) {

    },
    // 切换tab
    getActiveTab(val) {
      if (this.activeTab === val) return;
      this.activeTab = val;
      this.queryParams.status = undefined;
      this.queryParams.bind = undefined;
      if (val === '1') {
        this.queryParams.status = 1; // 在线
      } else if (val === '2') {
        this.queryParams.status = 0; // 离线
      } else if (val === '3') {
        this.queryParams.bind = 1; // 已绑定
      } else if (val === '4') {
        this.queryParams.bind = 0; // 未绑定
      }
      this.isMore = true;
      this.queryParams.pageNum = 1;
      this.deviceList = [];
      this.getList();
    },
    /** 获取列表数据 */
    async getList(isFirst) {
      if (!this.isMore) return;
      if (this.loading) return;
      this.loading = true;
      const { data } = await getConsoleDeviceList(this.queryParams);
      if (data.list && data.list.length > 0) {
        this.deviceList = [...this.deviceList, ...data.list];
        this.total = data.total;
        if (isFirst) {
          // 更新tab数
          this.bigTablist[0].num = this.total;
          // 获取当前全部设备定位数据
          this.getLocationParams();
          this.getLocation();
        }
      }
      this.loading = false;
    },
    loadMore() {
      this.queryParams.pageNum++;
      this.getList();
    },
    /** 设备搜索 */
    handleQuery() {
      this.isMore = true;
      this.queryParams.pageNum = 1;
      this.deviceList = [];
      this.getList();
    },
    /** 获取统计数据 */
    async getStatistics() {
      const { data } = await getConsoleDeviceStatistics();
      this.statisticsData = data;
    },
    /** 获取设备全部映射字段 */
    async getMapping() {
      const { data } = await getAllMapping();
      this.allMapping = data;
    },
    /** 获取设备位置信息-构造参数 */
    getLocationParams() {
      const _this = this;
      this.factoryList = [];
      // 获取勾选的数据
      const checkList = this.checkList.map(el => {
        const arr = el.split(',');
        return {
          typeCode: arr[0],
          factoryOnlyCode: arr[1]
        };
      });
      // 合并勾选的设备和当前设备列表数据
      const factoryList = [...checkList, ...this.deviceList];
      // 构造map
      const obj = {};
      factoryList.forEach(el => {
        if (obj[el.typeCode]) {
          obj[el.typeCode].push(el.factoryOnlyCode);
        } else {
          obj[el.typeCode] = [];
          obj[el.typeCode].push(el.factoryOnlyCode);
        }
      });
      // map转成数组
      for (const key in obj) {
        _this.factoryList.push({
          typeCode: key,
          factoryOnlyCodeList: Array.from(new Set(obj[key]))
        });
      }
    },
    /** 获取设备位置信息-接口 */
    async getLocation() {
      const { data } = await getConsoleDeviceLocation(this.factoryList);
      this.deviceLocation = data;
      // 重新渲染地图
      if (this.currentMap === 'point') {
        this.changeChecked(this.checkList, 'refresh');
      } else if (this.currentMap === 'track') {
        //
      }
      this.setReadTime();
    },
    /**
     * 定时获取设备位置信息
     */
    getLocationByTime() {
      const _this = this;
      this.clearTimer();
      this.timer = setInterval(() => {
        _this.getLocationParams();
        _this.getLocation();
      }, this.currentTime * 1000);
      this.setReadTime();
    },
    clearTimer() {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
    },
    /** 定时器读秒 */
    setReadTime() {
      const _this = this;
      this.clearReadTime();
      this.readTimer = setInterval(() => {
        if (_this.currentTime < 0) {
          _this.clearReadTime();
          return;
        }
        _this.currentTime = _this.currentTime - 1;
      }, 1000);
    },
    clearReadTime() {
      if (this.readTimer) {
        clearInterval(this.readTimer);
        this.readTimer = null;
        this.currentTime = this.refreshTime;
      }
    },
    /** 获取勾选的设备 */
    changeChecked(dataList, isRefresh) {
      this.currentMap = 'point';
      // 设置卡片选中
      if (dataList.length === 0) {
        this.activeCard = '';
      } else {
        const arr = dataList[dataList.length - 1].split(',');
        this.activeCard = arr[0] + arr[1];
      }
      // 构造回显数据list
      const list = dataList.map(el => {
        return el.split(',');
      });
      this.checkedDeviceList = [];
      list.forEach(el => {
        const deviceLocationObj = { ...this.deviceLocation[el[0]][el[1]] };
        deviceLocationObj.typeCode = el[0];
        deviceLocationObj.factoryOnlyCode = el[1];
        // 获取映射数据
        const labelArr = [];
        this.allMapping[el[0]].forEach(val => {
          labelArr.push({
            field_cnname: val.field_cnname,
            context: val.field_form_type === 2 ? (Number(deviceLocationObj[val.field_enname])).toFixed(val.field_dit) : deviceLocationObj[val.field_enname]
          });
        });
        deviceLocationObj.labelArr = labelArr;
        this.checkedDeviceList.push(deviceLocationObj);
      });
      // 回显地图定位
      this.$refs.mapRef.clearMap();
      this.checkedDeviceList.forEach(el => {
        if (el.lng && el.lng !== 0 && el.lat && el.lat !== 0) {
          this.$refs.mapRef.drawMarker(el.factoryOnlyCode, [el.lng, el.lat], el);
        }
      });
      if (isRefresh !== 'refresh' && this.checkedDeviceList.length > 0) {
        const el = this.checkedDeviceList[this.checkedDeviceList.length - 1];
        if (!el.lng || !el.lng) {
          this.msgInfo('没有找到该设备的位置信息');
        }
      }
    },
    /** 选中设备卡片 */
    handleCheckActive(status, index) {
      if (status !== 1) {
        this.msgInfo('没有找到该设备的位置信息');
        return;
      }
    },
    async handleCardClick(row) {
      if (this.activeCard === (row.typeCode + row.factoryOnlyCode)) return;
      if (row.activationFlag !== 1) {
        this.msgInfo('没有找到该设备的位置信息');
        return;
      }
      await this.handleCardActive(row.activationFlag, row.typeCode, row.factoryOnlyCode);
      this.changeChecked(this.checkList);
    },
    handleCardActive(status, typeCode, factoryOnlyCode) {
      this.activeCard = typeCode + factoryOnlyCode;
      if (status !== 1) return;
      this.checkList = this.checkList.filter(el => {
        return el !== (typeCode + ',' + factoryOnlyCode);
      });
      this.checkList.push(typeCode + ',' + factoryOnlyCode);
    },
    /** 轨迹回放 */
    async handleTrackPlayback(row) {
      await this.handleCardActive(row.activationFlag, row.typeCode, row.factoryOnlyCode);
      this.currentMap = 'track';
      const labelArr = [];
      this.allMapping[row.typeCode].forEach(val => {
        labelArr.push({
          field_cnname: val.field_cnname,
          context: val.field_form_type === 2 ? (Number(row.data[val.field_enname])).toFixed(val.field_dit) : row.data[val.field_enname]
        });
      });
      row.labelArr = labelArr;
      this.$refs.mapRef.onTrackPlayback(row);
      // 获取电子围栏
      this.getFencePlatList(row.factoryOnlyCode);
    },
    /** 退出轨迹回放 */
    onCloseTrack() {
      this.currentMap = 'point';
      this.changeChecked(this.checkList, 'refresh');
    },
    /** 显示设备名称 */
    showDeviceName() {
      this.isShowDeviceName = !this.isShowDeviceName;
      this.$nextTick(() => {
        this.checkedDeviceList.forEach(el => {
          if (el.lng && el.lng !== 0 && el.lat && el.lat !== 0) {
            this.$refs.mapRef.drawDeviceName(el.factoryOnlyCode);
          }
        });
      });
    },
    /** 配置刷新时间 */
    changeRefreshTime(val) {
      this.currentTime = val;
      this.getLocationByTime();
    },
    handleInfo() {
      this.msgInfo('功能未开发');
    },
    /** 获取平台围栏 */
    getFencePlatList(imei) {
      getFencePlatList({ imeiList: [imei] }).then(response => {
        const { data = [] } = response;
        // 保存电子围栏数据
        this.$refs.mapRef.saveFenceData(data);
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.device-info{
  margin: 0 15px 0;
  box-shadow: 0px 2px 3px 0px rgba(51, 153, 255, 0.1);
  height: calc(100vh - 146px);
  min-width: 1320px;
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

  // 小tab样式
  .btn-list-box{
    font-size: 0;
    background: #E9E9E9;
    opacity: 1;
    border-radius: 5px;
    overflow: hidden;
    margin: 0 12px 8px;
    width: 280px;
    >li{
      display: inline-block;
      width: 56px;
      height: 28px;
      opacity: 1;
      border-radius: 5px;
      font-size: 12px;
      font-family: PingFang SC;
      font-weight: bold;
      line-height: 28px;
      color: rgba(38, 38, 38, 0.37);
      text-align: center;
      cursor: pointer;
      &.active{
        background: #FFFFFF;
        color: #262626;
      }
    }
  }

  // 设备搜索
  .device-search-box{
    position: relative;
    .device-search-input{
      width: calc(100% - 24px);
      margin: 16px 12px;
      ::v-deep.el-input__inner{
        padding-right: 60px;
      }
      ::v-deep.el-input__suffix{
        right: 36px;
      }
    }
    .device-search-button{
      position: absolute;
      right: 12px;
      top: 16px;
      color: rgba(0, 0, 0, 0.25);
      font-size: 16px;
      cursor: pointer;
      padding: 8px 12px;
      font-weight: bold;
      transition: color 0.3s;
      &:hover{
        transition: color 0.3s;
        color: rgba(0, 0, 0, 0.35);
      }
    }
  }

  // 设备列表
  .device-info-list-box{
    height: calc(100vh - 286px);
    padding: 0 4px;
    overflow: hidden;
    position: relative;
    .device-info-list{
      height: calc(100vh - 286px);
      overflow-y: auto;
      font-size: 14px;
      >li{
        max-height: 162px;
        min-height: 124px;
        margin: 12px 20px 16px 20px;
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
          padding: 12px 16px 0;
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
          >.info-groud-item{
            width: 50%;
            font-size: 12px;
            font-family: PingFang SC;
            font-weight: bold;
            line-height: 20px;
            color: #262626;
            margin-bottom: 0;
            padding-left: 24px;
            >.label{
              font-weight: 400;
              color: rgba(38, 38, 38, 0.4);
              line-height: 18px;
            }
            img{
              padding-top: 2px;
            }
          }
        }
        .button-groud{
          position: relative;
          z-index: 1;
          margin-top: 4px;
          >p, >.el-dropdown{
            width: 25%;
            height: 30px;
            line-height: 29px;
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
            .status{
              color: #fff;
            }
          }
          .info-groud{
            >.info-groud-item{
              color: #fff;
              >.label{
                color: rgba(255, 255, 255, 0.5);
              }
            }
          }
          .button-groud{
            >p, >.el-dropdown{
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
    .device-info-list-none{
      font-size: 13px;
      color: #9FA2B5;
      text-align: center;
      position: absolute;
      left: 0;
      right: 0;
      top: 40%;
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
      text-align: left;
    }
    .status-groud{
      p{
        font-size: 12px;
        font-family: PingFang SC;
        font-weight: bold;
        line-height: 22px;
        color: #262626;
        >span{
          margin-right: 6px;
        }
        &:first-child{
          width: 78px;
          font-weight: normal;
          >span{
            font-weight: bold;
          }
        }
        &:not(:last-child){
          margin-right: 28px;
        }
      }
    }
    .device-config-box{
      .show-button{
        width: 136px;
        height: 32px;
        background: #e9ebee;
        opacity: 1;
        border-radius: 18px;
        font-size: 14px;
        font-family: PingFang SC;
        font-weight: bold;
        line-height: 32px;
        color: rgba(159, 162, 181, 0.65);
        padding-left: 12px;
        text-align: center;
        margin-left: 22px;
        position: relative;
        cursor: pointer;
        &::before{
          content: '';
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          width: 10px;
          height: 10px;
          background: #FFFFFF;
          border: 3px solid rgba(159, 162, 181, 0.65);
          border-radius: 50%;
        }
        &.active{
          background: #409EFF;
          color: #FFFFFF;
          &::before{
            background: #FFFFFF;
            border: 3px solid rgba(21, 112, 206, 0.9);
          }
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
