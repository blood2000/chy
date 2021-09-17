<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="18">
        <div style="width:100%; height: 600px;border-radius: 6px">
          <div class="g-flex g-justifyend" style="width:100%; height: 0;border-radius: 6px">
            <div class="legend-frame">
              <el-checkbox v-model="lyChecked" style="margin-bottom:10px;">
                <div class="g-aligncenter">APP轨迹<div class="legend-color" style="background:#1990FF;" /></div>
              </el-checkbox>
              <el-checkbox v-model="jmChecked" style="margin-bottom:10px;">
                <div class="g-aligncenter">硬件轨迹<div class="legend-color" style="background:#08B8A7;" /></div>
              </el-checkbox>
              <el-checkbox v-model="zjChecked" style="margin-bottom:10px;">
                <div class="g-aligncenter">北斗轨迹<div class="legend-color" style="background:#67C23A;" /></div>
              </el-checkbox>
              <el-checkbox v-model="checked" style="margin-bottom:10px;">
                <div class="g-aligncenter">规划轨迹<div class="legend-color" style="background:#FB8720;" /></div>
              </el-checkbox>
            </div>
          </div>
          <el-amap ref="map" v-loading="loading" vid="DDCmap" :zoom="zoom" :center="center" />
          <div :class="isPlan? 'noliston-frame':'nolist-frame'">
            <div :class="isPlan? 'noliston':'nolist'" />
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <!-- <div class="g-flex g-justifyaround">
          <div class="g-flex g-aligncenter g-justifycenter" :class="trackChange === 0 ? 'track-onbtn' : 'track-btn'" @click="handleTrackChange(0)">
            <div :class="trackChange === 0 ? 'track-onicon' : 'track-icon'" />APP轨迹
          </div>
          <div class="g-flex g-aligncenter g-justifycenter" :class="trackChange === 1 ? 'track-onbtn' : 'track-btn'" @click="handleTrackChange(1)">
            <div :class="trackChange === 1 ? 'track-onicon' : 'track-icon'" />硬件轨迹
          </div>
          <div v-if="!isShipment" class="g-flex g-aligncenter g-justifycenter" :class="trackChange === 2 ? 'track-onbtn' : 'track-btn'" @click="handleTrackChange(2)">
            <div :class="trackChange === 2 ? 'track-onicon' : 'track-icon'" />北斗轨迹
          </div>
        </div> -->
        <div v-if="zjChecked">
          <div>
            开始时间：
            <el-date-picker
              v-model="zjxlTime.qryBtm"
              clearable
              size="small"
              type="datetime"
              style="width: 228px;margin-bottom: 15px"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="请选择开始时间"
            />
          </div>
          <div>
            结束时间：
            <el-date-picker
              v-model="zjxlTime.qryEtm"
              clearable
              size="small"
              type="datetime"
              style="width: 228px;margin-bottom: 15px"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="请选择结束时间"
              class="mr10"
            />
            <el-button type="primary" size="mini" @click="getZjxlByTime">查 询</el-button>
          </div>
        </div>
        <ul class="time-line-content">
          <li v-for="(item, index) in timeLineList" :key="index" :class="index===0?'light':''">
            <p class="g-strong g-text">{{ parseTime(item.createTime, '{y}-{m}-{d} {h}:{i}') }}</p>
            <p class="g-color-gray g-text">{{ item.content }}</p>
            <!-- <p class="g-color-warning g-text">状态</p> -->
          </li>
        </ul>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { jimiTrackLocation, zjxlTrackLocation, getWebDetail, getWaybillTrace, addZjxl, queryZjxl, getDevice } from '@/api/waybill/tracklist';
import axios from 'axios';
import { getUserInfo } from '@/utils/auth';

export default {
  name: 'Track',
  props: {
    waybill: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      zoom: 16,
      center: [119.358267, 26.04577],
      loading: false,
      graspRoad: '',
      // 运单信息
      wayBillInfo: {},
      // 设备信息
      deviceInfo: {},
      // 日期
      time: '',
      // 装卸货地经纬度
      loadAddress: [],
      unloadAddress: [],
      // 轨迹切换 0：app轨迹、1：硬件轨迹、2：北斗轨迹
      trackChange: 0,
      timeLineList: [],
      // 轨迹查询参数结束时间
      queryEndtime: '',
      isPlan: false,
      isShipment: false,
      roles: [],
      // 轨迹参数
      lineParams: {
        showDir: true,
        isOutline: true, // 是否描边
        outlineColor: '#fff', // 描边颜色
        strokeOpacity: 0.7, // 线透明度
        strokeWeight: 10, // 线宽
        strokeStyle: 'solid', // 线样式
        lineJoin: 'round', // 折线拐点的绘制样式
        zIndex: 101
      },
      markParams: {
        icon: 'https://css-backup-1579076150310.obs.cn-south-1.myhuaweicloud.com/image_directory/icon_car1624672021156.png',
        autoFitView: true,
        autoRotation: true,
        offset: new AMap.Pixel(-35, -17)
      },
      // 是否显示规划轨迹
      checked: false,
      planline: {
        path: []
      },
      // 猎鹰轨迹相关参数
      lyChecked: false, // 是否显示猎鹰轨迹
      lyTracklist: [], // 猎鹰轨迹列表
      lyPolyline: {}, // 猎鹰轨迹线
      lyMark: undefined, // 猎鹰轨迹车辆定位
      lyTimePoor: undefined, // 猎鹰轨迹时间差
      lieyingQueryParams: { // 猎鹰查询参数
        key: undefined,
        sid: undefined, // sid为终端所属service唯一编号
        tid: undefined, // tid为终端唯一编号
        trid: undefined, // trid为轨迹唯一编号
        starttime: undefined, // 必须为Unix时间戳精确到毫秒
        endtime: undefined, // 必须为Unix时间戳精确到毫秒
        correction: 'denoise=1,mapmatch=1,attribute=0,threshold=0,mode=driving', // 对轨迹进行处理
        recoup: 1, // 对轨迹进行补点
        page: 1,
        pagesize: 999
      },
      // 几米轨迹相关参数
      jmChecked: false, // 是否显示几米轨迹
      jmTracklist: [], // 几米轨迹列表
      jmPolyline: { // 几米轨迹线
        path: []
      },
      jmMark: undefined, // 几米车辆定位
      jmTimePoor: undefined, // 几米轨迹时间差
      jimiQueryParams: { // jimi查询参数 mapType:GOOGOLE或BAIDU
        beginTime: '', // 2021-07-31 00:00:00
        endTime: '', // 2021-08-02 17:00:00
        imeis: '', // 868120274644936
        mapType: 'GOOGLE'
      },
      // 中交兴路轨迹相关参数
      zjChecked: false, // 是否显示中交兴路轨迹
      zjTracklist: [], // 中交兴路轨迹列表
      zjPolyline: { // 中交兴路轨迹线
        path: []
      },
      zjMark: undefined, // 中交兴路轨迹车辆定位
      zjTimePoor: undefined, // 中交兴路轨迹时间差
      zjxlQueryParams: { // 中交兴路轨迹查询参数
        qryBtm: undefined,
        qryEtm: undefined,
        vclN: '陕YH0008'
      },
      zjxlTime: {
        qryBtm: undefined,
        qryEtm: undefined
      },
      zjxlAddParams: { // 中交兴路轨迹存储参数
        licenseNumber: undefined,
        startTime: undefined,
        endTime: undefined,
        trackData: undefined,
        type: 'zjxl'
      },
      passedPolyline: [], // 移动轨迹
      moveMarker: undefined // 移动车辆
    };
  },
  computed: {
    visible: {
      get() {
        return this.open;
      },
      set(v) {
        this.$emit('update:open', v);
      }
    }
  },
  watch: {
    checked(val) {
      if (val) {
        // 获取高德地图路线规划
        this.getRoutePlan();
      } else {
        const that = this;
        that.$refs.map.$$getInstance().remove(that.planline);
      }
    },
    // 获取猎鹰轨迹
    lyChecked(val) {
      if (val) {
        this.loading = true;
        if (this.wayBillInfo.trackNumber) {
          this.getLieyingTime();
        } else {
          if (this.roles[0] === 'd1f7988f060c4f00b2861b37693bd384') {
            this.getLyRoutePlan();
          } else {
            this.loading = false;
            this.msgInfo('暂无APP轨迹！');
          }
        }
      } else {
        const that = this;
        that.$refs.map.$$getInstance().remove(that.lyPolyline);
        if (!that.wayBillInfo.signTime && that.lyMark) {
          that.$refs.map.$$getInstance().remove(that.lyMark);
        }
      }
    },
    // 获取几米轨迹
    jmChecked(val) {
      if (val) {
        this.loading = true;
        if (this.jimiQueryParams.imeis) {
          this.getJimiTime();
        } else {
          this.loading = false;
          this.msgInfo('暂无硬件轨迹！');
        }
      } else {
        const that = this;
        that.$refs.map.$$getInstance().remove(that.jmPolyline);
        if (!that.wayBillInfo.signTime && that.jmMark) {
          that.$refs.map.$$getInstance().remove(that.jmMark);
        }
      }
    },
    // 获取中交兴路轨迹
    zjChecked(val) {
      if (val) {
        this.loading = true;
        this.zjxlList();
      } else {
        const that = this;
        that.$refs.map.$$getInstance().remove(that.zjPolyline);
        if (!that.wayBillInfo.signTime && that.zjMark) {
          that.$refs.map.$$getInstance().remove(that.zjMark);
        }
        // 重置时间控件
        that.$set(that.zjxlTime, 'qryBtm', undefined);
        that.$set(that.zjxlTime, 'qryEtm', undefined);
        // 重置查询轨迹时间
        this.zjxlQueryParams.qryBtm = this.parseTime(this.wayBillInfo.fillTime, '{y}-{m}-{d} {h}:{i}:{s}');
        this.zjxlAddParams.startTime = this.parseTime(this.wayBillInfo.fillTime, '{y}-{m}-{d} {h}:{i}:{s}');
        if (this.wayBillInfo.signTime) {
          this.zjxlQueryParams.qryEtm = this.parseTime(this.wayBillInfo.signTime, '{y}-{m}-{d} {h}:{i}:{s}');
          this.zjxlAddParams.endTime = this.parseTime(this.wayBillInfo.signTime, '{y}-{m}-{d} {h}:{i}:{s}');
          this.queryEndtime = new Date(this.wayBillInfo.signTime);
        } else {
          this.zjxlQueryParams.qryEtm = this.time;
          this.zjxlAddParams.endTime = this.time;
          this.queryEndtime = new Date();
        }
      }
    }
  },
  created() {
    const { isShipment = false, roles = [] } = getUserInfo() || {};
    this.isShipment = isShipment;
    this.roles = roles;
    console.log(this.roles);
    // console.log(this.waybill);
    this.setForm(this.waybill);
  },
  methods: {
    // 轨迹切换
    // handleTrackChange(e) {
    //   this.trackChange = e;
    //   this.getTrackLocation();
    //   const that = this;
    //   if (this.vehicleMark) {
    //     that.$refs.map.$$getInstance().remove(this.vehicleMark);
    //   }
    // },
    /** 获取轨迹 */
    // getTrackLocation() {
    //   this.isPlan = false;
    //   if (this.wayBillInfo.fillTime) {
    //     if (this.trackChange === 0) {
    //       // 获取APP轨迹
    //       this.getLieyingTime();
    //     } else if (this.trackChange === 1) {
    //       // 获取硬件轨迹
    //       this.getJimi();
    //     } else if (this.trackChange === 2) {
    //       this.zjxlList();
    //     }
    //   }
    // },
    // 猎鹰循环判断开始时间与结束时间
    getLieyingTime() {
      this.lyTimePoor = this.lieyingQueryParams.endtime - this.lieyingQueryParams.starttime;
      if (this.lyTimePoor > 24 * 60 * 60 * 1000) {
        this.lieyingQueryParams.endtime = this.lieyingQueryParams.starttime + 24 * 60 * 60 * 1000;
        this.getLieying();
      } else if (this.lyTimePoor === 0) {
        if (this.lyTracklist.length !== 0) {
          // 绘制轨迹
          const that = this;
          const path = that.lyTracklist;
          that.lyPolyline = new window.AMap.Polyline({
            map: that.$refs.map.$$getInstance(),
            path,
            strokeColor: '#1990FF', // 线颜色
            ...that.lineParams
          });
          that.lyPolyline.setMap(that.$refs.map.$$getInstance());
          that.$refs.map.$$getInstance().setFitView(that.lyPolyline); // 执行定位
          that.getMoveLine(path);
          // 显示车辆定位
          if (!that.wayBillInfo.signTime) {
            that.lyMark = new AMap.Marker({
              position: that.lyTracklist[that.lyTracklist.length - 1],
              ...that.markParams
            });
            that.lyMark.setMap(that.$refs.map.$$getInstance()); // 点标记
          }
          this.loading = false;
        } else {
          if (this.roles[0] === 'd1f7988f060c4f00b2861b37693bd384') {
            this.getLyRoutePlan();
          } else {
            this.loading = false;
            this.msgInfo('暂无APP轨迹！');
          }
        }
      } else if (this.lyTimePoor !== 0 && this.lyTimePoor < 24 * 60 * 60 * 1000) {
        this.getLieying();
      } else {
        this.loading = false;
        this.msgInfo('暂无APP轨迹！');
      }
    },
    // 猎鹰加载更多
    lyLoadmore() {
      this.lieyingQueryParams.page++;
      // console.log(this.lieyingQueryParams);
      this.getLieying();
    },
    // 调用猎鹰获取轨迹
    getLieying() {
      axios.get('https://tsapi.amap.com/v1/track/terminal/trsearch', { params: this.lieyingQueryParams }).then(response => {
        if (response.data.data) {
          if (response.data.data.tracks[0].points.length > 0) {
            this.lyTracklist = [
              ...this.lyTracklist,
              ...response.data.data.tracks[0].points.map(function(response) {
                return response.location.split(',');
              })
            ];
            this.lyLoadmore();
          } else {
            this.lieyingQueryParams.starttime = this.lieyingQueryParams.endtime;
            this.lieyingQueryParams.endtime = new Date(this.queryEndtime).getTime();
            this.lieyingQueryParams.page = 1;
            // console.log(this.lieyingQueryParams);
            this.getLieyingTime();
          }
        } else {
          this.loading = false;
          this.msgInfo('暂无APP轨迹！');
        }
      }).catch(() => { this.loading = false; });
    },
    // 几米循环判断开始时间与结束时间
    getJimiTime() {
      this.jmTimePoor = new Date(this.jimiQueryParams.endTime).getTime() - new Date(this.jimiQueryParams.beginTime).getTime();

      if (this.jmTimePoor > 24 * 60 * 60 * 1000 * 2) {
        this.jimiQueryParams.endTime = this.parseTime(new Date(this.jimiQueryParams.beginTime).getTime() + 24 * 60 * 60 * 1000 * 2, '{y}-{m}-{d} {h}:{i}:{s}');
        this.getJimi();
      } else if (this.jmTimePoor === 0) {
        // console.log(this.jmTracklist);
        if (this.jmTracklist.length !== 0) {
          // 绘制轨迹
          const that = this;
          const path = that.jmTracklist;
          that.jmPolyline = new window.AMap.Polyline({
            map: that.$refs.map.$$getInstance(),
            path,
            strokeColor: '#08B8A7', // 线颜色
            ...that.lineParams
          });
          that.jmPolyline.setMap(that.$refs.map.$$getInstance());
          that.$refs.map.$$getInstance().setFitView(that.jmPolyline); // 执行定位
          that.getMoveLine(path);
          // 显示车辆定位
          if (!that.wayBillInfo.signTime) {
            that.jmMark = new AMap.Marker({
              position: that.jmTracklist[that.jmTracklist.length - 1],
              ...that.markParams
            });
            that.jmMark.setMap(that.$refs.map.$$getInstance()); // 点标记
          }
          this.loading = false;
        } else {
          this.loading = false;
          this.msgInfo('暂无硬件轨迹！');
        }
      } else if (this.jmTimePoor !== 0 && this.jmTimePoor < 24 * 60 * 60 * 1000 * 2) {
        this.getJimi();
      }
    },
    // 获取硬件轨迹
    getJimi() {
      jimiTrackLocation(this.jimiQueryParams).then(response => {
        // console.log(response.data);
        if (response.data) {
          this.jmTracklist = [
            ...this.jmTracklist,
            ...response.data.map(function(response) {
              return [response.lng, response.lat];
            })
          ];
        }
        this.jimiQueryParams.beginTime = this.jimiQueryParams.endTime;
        this.jimiQueryParams.endTime = this.parseTime(this.queryEndtime, '{y}-{m}-{d} {h}:{i}:{s}');
        this.getJimiTime();
      }).catch(() => { this.loading = false; });
    },
    // 中交兴路轨迹
    zjxlList() {
      queryZjxl(this.zjxlAddParams).then(res => {
        // console.log(res);
        if (res.data) {
          this.zjTracklist = res.data.trackDataList;
          if (!this.wayBillInfo.signTime || (new Date(this.wayBillInfo.signTime).getTime() > new Date(res.data.endTime).getTime())) {
            this.zjxlQueryParams.qryBtm = this.parseTime(res.data.endTime, '{y}-{m}-{d} {h}:{i}:{s}');
            // 获取中交兴路轨迹
            this.getZjxlTime();
          } else {
            // 绘制轨迹
            this.drawZj();
          }
        } else {
          // 获取中交兴路轨迹
          this.getZjxlTime();
        }
      });
    },
    // 中交兴路循环判断开始时间与结束时间
    getZjxlTime() {
      this.zjTimePoor = new Date(this.zjxlQueryParams.qryEtm).getTime() - new Date(this.zjxlQueryParams.qryBtm).getTime();
      if (this.zjTimePoor > 24 * 60 * 60 * 1000) {
        this.zjxlQueryParams.qryEtm = this.parseTime(new Date(this.zjxlQueryParams.qryBtm).getTime() + 24 * 60 * 60 * 1000, '{y}-{m}-{d} {h}:{i}:{s}');
        this.getZjxl();
      } else if (this.zjTimePoor === 0) {
        if (this.zjTracklist.length !== 0) {
          // 绘制轨迹
          this.drawZj();
        } else {
          this.loading = false;
          this.msgInfo('暂无北斗轨迹！');
        }
      } else if (this.zjTimePoor !== 0 && this.zjTimePoor < 24 * 60 * 60 * 1000) {
        this.getZjxl();
      }
    },
    // 调用中交兴路获取轨迹
    getZjxl() {
      zjxlTrackLocation(this.zjxlQueryParams).then(response => {
        var str = JSON.parse(response.msg);
        // console.log(str);
        // 坐标系转换
        var list = str.result.map(res => {
          return this.wgs84_to_gcj02(res.lon / 600000, res.lat / 600000);
        });
        if (str.result.length !== 0) {
          addZjxl({ ...this.zjxlAddParams, trackDataList: list }).then(res => {
            // console.log(res);
          });
          this.zjTracklist = [
            ...this.zjTracklist,
            ...list
          ];
        }
        this.zjxlQueryParams.qryBtm = this.zjxlQueryParams.qryEtm;
        this.zjxlQueryParams.qryEtm = this.parseTime(this.queryEndtime, '{y}-{m}-{d} {h}:{i}:{s}');
        // console.log(this.zjxlQueryParams);
        this.getZjxlTime();
      }).catch(() => { this.loading = false; });
    },
    // 绘制中交兴路轨迹
    drawZj() {
      const that = this;
      const path = that.zjTracklist;
      that.zjPolyline = new window.AMap.Polyline({
        map: that.$refs.map.$$getInstance(),
        path,
        strokeColor: '#67C23A', // 线颜色
        ...that.lineParams
      });
      that.zjPolyline.setMap(that.$refs.map.$$getInstance());
      that.$refs.map.$$getInstance().setFitView(that.zjPolyline); // 执行定位
      that.getMoveLine(path);
      // 显示车辆定位
      if (!that.wayBillInfo.signTime) {
        that.zjMark = new AMap.Marker({
          position: that.zjTracklist[that.zjTracklist.length - 1],
          ...that.markParams
        });
        that.zjMark.setMap(that.$refs.map.$$getInstance()); // 点标记
      }
      this.loading = false;
    },
    // 获取高德地图路线规划
    getRoutePlan() {
      const that = this;
      that.isPlan = true;
      const driving = new AMap.Driving({
        policy: AMap.DrivingPolicy.LEAST_TIME
        // map 指定将路线规划方案绘制到对应的AMap.Map对象上
        // map: that.$refs.map.$$getInstance()
        // panel: 'DDCmap',
      });
      driving.search(that.loadAddress, that.unloadAddress, function(status, result) {
        if (status === 'complete') {
          const { routes = [] } = result;
          const { steps = [] } = routes[0];
          const pathArr = [];
          steps.map(i => {
            pathArr.push(i.path);
            return pathArr;
          });
          const path = [].concat.apply([], pathArr);
          // 绘制轨迹
          that.planline = new window.AMap.Polyline({
            map: that.$refs.map.$$getInstance(),
            path,
            strokeColor: '#FB8720', // 线颜色
            ...that.lineParams
          });
          that.planline.setMap(that.$refs.map.$$getInstance());
          that.$refs.map.$$getInstance().setFitView(that.planline); // 执行定位
          that.getMoveLine(path);
        } else {
          this.msgInfo('规划轨迹失败！');
        }
        // 未出错时，result即是对应的路线规划方案
      });
    },
    // 获取猎鹰数据为空时路线规划
    getLyRoutePlan() {
      const that = this;
      that.isPlan = true;
      const driving = new AMap.Driving({
        policy: AMap.DrivingPolicy.LEAST_TIME
        // map 指定将路线规划方案绘制到对应的AMap.Map对象上
        // map: that.$refs.map.$$getInstance()
        // panel: 'DDCmap',
      });
      driving.search(that.loadAddress, that.unloadAddress, function(status, result) {
        if (status === 'complete') {
          const { routes = [] } = result;
          const { steps = [] } = routes[0];
          const pathArr = [];
          steps.map(i => {
            pathArr.push(i.path);
            return pathArr;
          });
          const path = [].concat.apply([], pathArr);
          // 绘制轨迹
          that.lyPolyline = new window.AMap.Polyline({
            map: that.$refs.map.$$getInstance(),
            path,
            strokeColor: '#1990FF', // 线颜色
            ...that.lineParams
          });
          that.lyPolyline.setMap(that.$refs.map.$$getInstance());
          that.$refs.map.$$getInstance().setFitView(that.lyPolyline); // 执行定位
          that.loading = false;
        } else {
          that.loading = false;
          this.msgInfo('暂无APP轨迹！');
        }
        // 未出错时，result即是对应的路线规划方案
      });
    },
    // 回放轨迹
    getMoveLine(line) {
      const _this = this;
      // this.moveMarker.stopMove(); // 停止移动
      this.passedPolyline = [];
      this.moveMarker = undefined;
      this.passedPolyline = new AMap.Polyline({
        map: _this.$refs.map.$$getInstance(),
        strokeColor: '#AF5',
        showDir: true,
        strokeWeight: 10,
        zIndex: 102
      });
      // 绘制车
      this.moveMarker = new AMap.Marker({
        map: _this.$refs.map.$$getInstance(),
        position: line[0],
        icon: 'https://css-backup-1579076150310.obs.cn-south-1.myhuaweicloud.com/image_directory/16316738189596cbbf5.png',
        offset: new AMap.Pixel(-29, -10),
        autoRotation: true,
        angle: -90,
        zIndex: 103
      });
      // 绑定车辆移动事件
      this.moveMarker.on('moving', function(e) {
        _this.passedPolyline.setPath(e.passedPath);
        // 车超出视野范围后重新定位
        if (!_this.isPointInRing(e.target.getPosition())) {
          _this.$refs.map.$$getInstance().setCenter(e.target.getPosition());
        }
        // 播放结束
        if (e.target.getPosition() === line[line.length - 1]) {
          _this.$refs.map.$$getInstance().remove(_this.moveMarker);
          _this.$refs.map.$$getInstance().remove(_this.passedPolyline);
        }
      });
      _this.$refs.map.$$getInstance().setZoomAndCenter(13, line[0]);
      this.moveMarker.moveAlong(line, 3000); // 开始移动 speed 千米/小时
    },
    /** 判断当前位置是否在可视区域 */
    isPointInRing(position) {
      const bounds = this.$refs.map.$$getInstance().getBounds();
      const NorthEast = bounds.getNorthEast();
      const SouthWest = bounds.getSouthWest();
      const SouthEast = [NorthEast.lng, SouthWest.lat];
      const NorthWest = [SouthWest.lng, NorthEast.lat];
      const path = [[NorthEast.lng, NorthEast.lat], SouthEast, [SouthWest.lng, SouthWest.lat], NorthWest]; // 将地图可视区域四个角位置按照顺序放入path，用于判断point是否在可视区域
      const isPointInRing = AMap.GeometryUtil.isPointInRing(position, path); // 判断point是否在可视区域
      return isPointInRing;
    },
    // 起点终点
    getMark() {
      const that = this;
      // 装货地marker
      const startPosition = that.loadAddress;
      const startMark = new AMap.Marker({
        position: startPosition,
        icon: 'https://css-backup-1579076150310.obs.cn-south-1.myhuaweicloud.com/image_directory/icon_load1624672027526.png',
        autoFitView: true,
        autoRotation: true,
        offset: new AMap.Pixel(-17, -35)
      });
      startMark.setMap(that.$refs.map.$$getInstance()); // 点标记
      // 卸货地marker
      const endPosition = that.unloadAddress;
      const endMark = new AMap.Marker({
        position: endPosition,
        icon: 'https://css-backup-1579076150310.obs.cn-south-1.myhuaweicloud.com/image_directory/icon_unload1624672033390.png',
        autoFitView: true,
        autoRotation: true,
        offset: new AMap.Pixel(-17, -35)
      });
      endMark.setMap(that.$refs.map.$$getInstance()); // 点标记
      that.$refs.map.$$getInstance().setFitView([startMark, endMark]); // 执行定位
    },
    // 获取车辆设备信息
    getDeviceInfo() {
      getDevice({ vehicleCode: this.wayBillInfo.vehicleCode, vendorCode: 'jimilot' }).then(response => {
        if (response.data.length > 0) {
          this.deviceInfo = response.data[0];
          this.jimiQueryParams.imeis = response.data[0].factoryOnlyCode;
        }
        // console.log(this.deviceInfo);
      });
    },
    /** 取消按钮 */
    cancel() {
      this.close();
    },
    // 关闭弹窗
    close() {
      this.$emit('update:open', false);
      this.loadAddress = [];
      this.unloadAddress = [];
      this.lyTracklist = [];
      this.jmTracklist = [];
      this.zjTracklist = [];
    },
    // 表单赋值
    setForm(data) {
      // console.log(data);
      // 获取运单信息，并标记装卸货地
      getWebDetail(data.code).then(response => {
        this.wayBillInfo = response.data;
        this.getDeviceInfo();
        // 中交车牌号参数赋值
        this.zjxlQueryParams.vclN = this.wayBillInfo.licenseNumber;
        this.zjxlAddParams.licenseNumber = this.wayBillInfo.licenseNumber;
        // console.log(this.wayBillInfo);
        // 猎鹰参数赋值
        if (this.wayBillInfo.trackNumber) {
          const trackNumber = this.wayBillInfo.trackNumber.split('|');
          // console.log(trackNumber);
          this.lieyingQueryParams = {
            ...this.lieyingQueryParams,
            key: trackNumber[0],
            sid: trackNumber[1], // sid为终端所属service唯一编号
            tid: trackNumber[2], // tid为终端唯一编号
            trid: trackNumber[3] // trid为轨迹唯一编号
          };
          // console.log(this.lieyingQueryParams);
        }
        // 获取装卸货地址经纬度
        if (this.wayBillInfo.waybillAddress.loadLocation) {
          this.loadAddress = this.wayBillInfo.waybillAddress.loadLocation.replace('(', '').replace(')', '').split(',');
          // console.log(this.loadAddress);
        } else {
          // this.loadAddress = [119.358267, 26.04577];
          this.loadAddress = [];
        }
        if (this.wayBillInfo.waybillAddress.unloadLocation) {
          this.unloadAddress = this.wayBillInfo.waybillAddress.unloadLocation.replace('(', '').replace(')', '').split(',');
          // console.log(this.unloadAddress);
        } else {
          // this.unloadAddress = [119.344435, 25.721053];
          this.unloadAddress = [];
        }
        // 获取查询轨迹时间
        this.time = this.parseTime(new Date(), '{y}-{m}-{d} {h}:{i}:{s}');
        this.jimiQueryParams.beginTime = this.parseTime(this.wayBillInfo.fillTime, '{y}-{m}-{d} {h}:{i}:{s}');
        this.zjxlQueryParams.qryBtm = this.parseTime(this.wayBillInfo.fillTime, '{y}-{m}-{d} {h}:{i}:{s}');
        this.zjxlAddParams.startTime = this.parseTime(this.wayBillInfo.fillTime, '{y}-{m}-{d} {h}:{i}:{s}');
        this.lieyingQueryParams.starttime = new Date(this.wayBillInfo.fillTime).getTime();
        if (this.wayBillInfo.signTime) {
          this.jimiQueryParams.endTime = this.parseTime(this.wayBillInfo.signTime, '{y}-{m}-{d} {h}:{i}:{s}');
          this.zjxlQueryParams.qryEtm = this.parseTime(this.wayBillInfo.signTime, '{y}-{m}-{d} {h}:{i}:{s}');
          this.zjxlAddParams.endTime = this.parseTime(this.wayBillInfo.signTime, '{y}-{m}-{d} {h}:{i}:{s}');
          this.lieyingQueryParams.endtime = new Date(this.wayBillInfo.signTime).getTime();
          this.queryEndtime = new Date(this.wayBillInfo.signTime);
        } else {
          this.jimiQueryParams.endTime = this.time;
          this.zjxlQueryParams.qryEtm = this.time;
          this.zjxlAddParams.endTime = this.time;
          this.lieyingQueryParams.endtime = new Date().getTime();
          this.queryEndtime = new Date();
        }
        if (this.loadAddress.length !== 0 && this.unloadAddress.length !== 0) {
          // 标记装卸货地址
          this.getMark();
          // 获取路线
          this.lyChecked = true;
        }
      });
      // 轨迹时间线
      getWaybillTrace(data.code).then(response => {
        this.timeLineList = response.data;
        // response.data.forEach(el => {
        //   this.timeLineList.unshift(el);
        // });
      });
    },
    // 根据时间控件查北斗
    getZjxlByTime() {
      if (!this.zjxlTime.qryBtm || this.zjxlTime.qryBtm === '') {
        this.msgWarning('请选择开始时间');
        return;
      }
      if (!this.zjxlTime.qryEtm || this.zjxlTime.qryEtm === '') {
        this.msgWarning('请选择结束时间');
        return;
      }
      this.$set(this.zjxlAddParams, 'startTime', this.zjxlTime.qryBtm);
      this.$set(this.zjxlAddParams, 'endTime', this.zjxlTime.qryEtm);
      this.$set(this.zjxlQueryParams, 'qryBtm', this.zjxlTime.qryBtm);
      this.$set(this.zjxlQueryParams, 'qryEtm', this.zjxlTime.qryEtm);
      this.queryEndtime = this.zjxlTime.qryEtm;
      this.zjxlList();
    }
  }
};
</script>

<style scoped lang="scss">
.shadow{
  box-shadow: 10px 10px 5px #888888;
}
.nolist-frame{
	position: relative;
  bottom: 70px;
	z-index: 999;
	height: 0;
	width: 100%;
	background: linear-gradient(#FFFFFF00 20%, #FFFFFF 80%);
}
.nolist{
	height: 70px;
	width: 100%;
	background: linear-gradient(#FFFFFF00 20%, #FFFFFF 80%);
}
.noliston-frame{
	position: relative;
  bottom: 55px;
	z-index: 999;
	height: 0;
	width: 100%;
	background: linear-gradient(#FFFFFF00 20%, #FFFFFF 80%);
}
.noliston{
	height: 55px;
	width: 100%;
	background: linear-gradient(#FFFFFF00 20%, #FFFFFF 80%);
}
.mr3 {
  margin-right: 3%;
}
.width90 {
  width: 90%;
}
.width28 {
  width: 28%;
}
.el-input-number ::v-deep.el-input__inner {
  text-align: left;
}
.el-rate{
  margin-top: 8px;
}
.track-onbtn{
  cursor: pointer;
  padding: 0 15px;
  height: 32px;
  background: #409EFF;
  border-radius: 18px;
  line-height: 22px;
  color: #FFFFFF;
  .track-onicon{
    margin-right: 10px;
    height: 10px;
    width: 10px;
    border-radius: 50%;
    background: #FFFFFF;
    border: 3px solid #1570CE;
  }
}
.track-btn{
  cursor: pointer;
  // width: 124px;
  padding: 0 15px;
  height: 32px;
  background: #F6F6F6;
  border-radius: 18px;
  line-height: 22px;
  color: #000000;
  .track-icon{
    margin-right: 10px;
    height: 10px;
    width: 10px;
    border-radius: 50%;
    background: #B2B4B9;
  }
}



/* 轨迹-时间线 */
.time-line-content{
  padding: 20px;
  border: 1px solid rgba(0, 0, 0, 0);
  box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.09);
  max-height: 600px;
  overflow: scroll;
  >li{
    position: relative;
    padding: 0 0 20px 20px;
    border-left: 1px dashed #d2d4da;
    &::before{
      content: '';
      position: absolute;
      top: 5px;
      left: -6px;
      width: 11px;
      height: 11px;
      border-radius: 100%;
      background: #d2d4da;
    }
    &.light{
      &::before{
        content: '';
        background: #409EFF;
      }
    }
  }
}

// ::v-deep .amap-icon img{
//   height: 35px;
// }

.legend-frame{
  position: relative;
  right: 10px;
  top: 10px;
  z-index: 10;
  width: 165px;
  height: 130px;
  background: #FFFFFF;
  padding: 15px;
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.15);
  border-radius: 2px;
}
.legend-color{
  margin-left: 10px;
  height: 15px;
  width: 50px;
  border-radius: 4px;
  opacity: 0.7;
}
</style>
