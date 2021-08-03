<template>
  <div>
    <!-- 核算页面 -->
    <div v-show="showSearch">
      <QueryForm
        v-model="queryParams"
        :is-shipment="isShipment"
        @handleQuery="()=>{
          queryParams.pageNum = 1;
          getList()
        }"
        @getCardInfo="getCardInfo"
      />
    </div>

    <div class="app-container">
      <el-row
        :gutter="10"
        class="mb8"
      >
        <el-col :span="1.5">
          <el-button
            :type=" isConnect?'danger':'primary'"
            icon="el-icon-turn-off"
            size="mini"
            @click="handlerCarConnect(isConnect)"
          >{{ !isConnect? '连接本地服务' :'断开本地服务' }}</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="success"
            icon="el-icon-mouse"
            size="mini"
            :disabled="!isConnect || !multiple"
            @click="handlerMakeUp"
          >补卡</el-button>
        </el-col>

        <el-col v-if="true" :span="1.5">
          <el-button
            type="info"
            icon="el-icon-brush"
            size="mini"
            :disabled="!isConnect"
            @click="handlerReadUserinfo"
          >读卡用户信息</el-button>
        </el-col>
        <el-col v-if="true" :span="1.5">
          <el-button
            type="info"
            icon="el-icon-document"
            size="mini"
            :disabled="!isConnect"
            @click="handlerReadData"
          >读运单信息</el-button>
        </el-col>
        <el-col v-show="true" :span="1.5">
          <el-button
            type="info"
            icon="el-icon-document"
            size="mini"
            :disabled="!isConnect"
            @click="handlerReadData"
          >读卡</el-button>
        </el-col>

        <el-col v-show="true" :span="1.5">
          <el-button
            type="info"
            icon="el-icon-document"
            size="mini"
            :disabled="!isConnect"
            @click="handlerWriteUser"
          >清卡发卡用户</el-button>
        </el-col>

        <el-col v-show="true" :span="1.5">
          <el-button
            type="info"
            icon="el-icon-document"
            size="mini"
            :disabled="!isConnect"
            @click="handlerData"
          >写入运单数据</el-button>
        </el-col>
        <!-- <el-col :span="1.5" class="fr">
          <tablec-cascader v-model="tableColumnsConfig" :lcokey="api" />
        </el-col> -->
        <right-toolbar
          :show-search.sync="showSearch"
          @queryTable="getList"
        />
        <el-col :span="1.5" class="fr mr10">
          <el-button
            type="danger"
            icon="el-icon-brush"
            size="mini"
            :disabled="!isConnect"
            @click="handlerCardInit"
          >消卡</el-button>
        </el-col>
      </el-row>


      <AccountingTable
        ref="accountingRef"
        :loading="loading"
        :my-data="myData"
        :columns="tableColumnsConfig"
        @ismultiple="(bool)=> multiple = bool"
        @refresh="getList"
        @onAllSeleced="onAllSeleced"
      />

      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />

      <!-- 已打款的回单 -->
      <el-dialog class="i-adjust" title="卡信息" :visible.sync="cardinfoOpen" width="1200px" :close-on-click-modal="false" append-to-body>
        <div v-if="cardinfoOpen">
          <CarInfo :card-info-data="cardInfoData" />
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import QueryForm from './components/QueryForm';
import AccountingTable from './components/AccountingTable';
import CarInfo from './components/CarInfo';
import { cardHistoryList, cardReplacement } from '@/api/dregs/card';

import CardReader, { versionMark, userMark } from '@/libs/ICCard/CardReader';
const { action, fn } = CardReader;



// 方法 connect


const com = [
  {
    'label': '卡ID',
    'prop': 'card16no',
    'isShow': true,
    'sortNum': 0,
    'width': '120',
    'tooltip': true,
    'isChild': false
  },
  {
    'label': 'IC卡核对状态',
    'prop': 'icStatus',
    'isShow': true,
    'sortNum': 0,
    'width': '100',
    'tooltip': true,
    'isChild': false
  },
  {
    'label': '配载方式',
    'prop': 'stowageStatus',
    'isShow': false,
    'sortNum': 0,
    'width': '120',
    'tooltip': true,
    'isChild': false
  },
  {
    'label': '装货截止时间',
    'prop': 'lastLoadingTime',
    'isShow': false,
    'sortNum': 0,
    'width': '120',
    'tooltip': true,
    'isChild': false
  },
  {
    'label': '运费单价',
    'prop': 'freightPrice',
    'isShow': false,
    'sortNum': 0,
    'width': '180',
    'tooltip': true,
    'isChild': false
  },
  {
    'label': '实收现金',
    'prop': 'deliveryCashFee',
    'isShow': false,
    'sortNum': 0,
    'width': '120',
    'tooltip': true,
    'isChild': false
  },
  {
    'label': '服务费',
    'prop': 'serviceFee',
    'isShow': false,
    'sortNum': 0,
    'width': '120',
    'tooltip': true,
    'isChild': false
  },
  {
    'label': '服务税费',
    'prop': 'serviceTaxFee',
    'isShow': false,
    'sortNum': 0,
    'width': '120',
    'tooltip': true,
    'isChild': false
  },
  {
    'label': '纳税金额',
    'prop': 'taxPayment',
    'isShow': false,
    'sortNum': 0,
    'width': '120',
    'tooltip': true,
    'isChild': false
  },
  {
    'label': '打款驳回理由',
    'prop': 'applyMoneyBackRemark',
    'isShow': false,
    'sortNum': 0,
    'width': '120',
    'tooltip': true,
    'isChild': false
  },
  {
    'label': '不含税价',
    'prop': 'taxFreeFee',
    'isShow': false,
    'sortNum': 0,
    'width': '120',
    'tooltip': true,
    'isChild': false
  },
  {
    'label': '重量',
    'prop': 'weight',
    'isShow': false,
    'sortNum': 0,
    'width': '120',
    'tooltip': true,
    'isChild': false
  },
  {
    'label': '含税价',
    'prop': 'taxFee',
    'isShow': false,
    'sortNum': 0,
    'width': '120',
    'tooltip': true,
    'isChild': false
  },
  {
    'label': '装货地',
    'prop': 'loadAddress',
    'isShow': false,
    'sortNum': 0,
    'width': '120',
    'tooltip': true,
    'isChild': false
  },
  {
    'label': '卸货地',
    'prop': 'unloadAddress',
    'isShow': false,
    'sortNum': 0,
    'width': '120',
    'tooltip': true,
    'isChild': false
  },
  {
    'label': '发货企业',
    'prop': 'deliveryCompany',
    'isShow': false,
    'sortNum': 0,
    'width': '120',
    'tooltip': true,
    'isChild': false
  },
  {
    'label': '下单客户',
    'prop': 'orderClient',
    'isShow': false,
    'sortNum': 0,
    'width': '120',
    'tooltip': true,
    'isChild': false
  },
  {
    'label': '项目名称',
    'prop': 'projectName',
    'isShow': true,
    'sortNum': 1,
    'width': '120',
    'tooltip': true,
    'isChild': false
  },

  {
    'label': '渣土场名称',
    'prop': 'ztcName',
    'isShow': true,
    'sortNum': 2,
    'width': '120',
    'tooltip': true,
    'isChild': false
  },
  {
    'label': '车队名称',
    'prop': 'teamName',
    'isShow': true,
    'sortNum': 3,
    'width': '120',
    'tooltip': true,
    'isChild': false
  },
  {
    'label': '车队管理者',
    'prop': 'teamLeaderName',
    'isShow': true,
    'sortNum': 3,
    'width': '120',
    'tooltip': true,
    'isChild': false
  },
  {
    'label': '司机名称',
    'prop': 'driverName',
    'isShow': true,
    'sortNum': 3,
    'width': '120',
    'tooltip': true,
    'isChild': false
  },
  {
    'label': '车牌号',
    'prop': 'licenseNumber',
    'isShow': true,
    'sortNum': 3,
    'width': '120',
    'tooltip': true,
    'isChild': false
  },
  {
    'label': '司机电话',
    'prop': 'driverPhone',
    'isShow': true,
    'sortNum': 3,
    'width': '120',
    'tooltip': true,
    'isChild': false
  },
  {
    'label': '运输单号',
    'prop': 'waybillNo',
    'isShow': true,
    'sortNum': 3,
    'width': '120',
    'tooltip': true,
    'isChild': false
  },

  {
    'prop': 'loadWeight',
    'isShow': false,
    'tooltip': false,
    'sortNum': 5,
    'label': '装车数量',
    'width': 120
  },
  {
    'prop': 'unloadWeight',
    'isShow': false,
    'tooltip': false,
    'sortNum': 6,
    'label': '卸车数量',
    'width': 120
  },
  {
    'label': '货物类型',
    'prop': 'goodsBigType',
    'isShow': false,
    'sortNum': 8,
    'width': '120',
    'tooltip': true,
    'isChild': false
  },
  {
    'label': '发布货源时间',
    'prop': 'orderTime',
    'isShow': true,
    'sortNum': 10,
    'width': '120',
    'tooltip': true,
    'isChild': false
  },
  {
    'label': '接单时间',
    'prop': 'receiveTime',
    'isShow': true,
    'sortNum': 11,
    'width': '120',
    'tooltip': true,
    'isChild': false
  },
  {
    'label': '最后操作时间',
    'prop': 'wayBillUpdateTime',
    'isShow': false,
    'sortNum': 12,
    'width': '120',
    'tooltip': true,
    'isChild': false
  },
  {
    'label': '货主备注',
    'prop': 'shipperRemark',
    'isShow': true,
    'sortNum': 50,
    'width': '120',
    'tooltip': true,
    'isChild': false
  },
  {
    'label': '货物单价',
    'prop': 'goodsPrice',
    'isShow': false,
    'sortNum': 99,
    'width': '120',
    'tooltip': true,
    'isChild': false
  },
  {
    'prop': 'shipperCopeFee',
    'isShow': false,
    'tooltip': false,
    'sortNum': 100,
    'label': '货主应付金额',
    'width': 120
  },
  {
    'prop': 'isReturn',
    'isShow': false,
    'tooltip': false,
    'sortNum': 100,
    'label': '纸质回单状态',
    'width': 120
  },
  {
    'prop': 'edit',
    'isShow': false,
    'tooltip': false,
    'label': '操作',
    'width': 240,
    'fixed': 'left'
  }
];
export default {
  // name: 'Card',
  components: { QueryForm, AccountingTable, CarInfo },

  // beforeRouteLeave: (to, from, next) => {
  //   CardReader.socket.onclose = function() {}; // disable onclose handler first
  //   CardReader.socket.close();
  //   CardReader.socket = null;
  //   next();
  // },

  data() {
    return {
      'showSearch': true,
      'loading': false,
      'total': 0,
      'queryParams': {
        // 固定--
        'pageNum': 1,
        'pageSize': 10,
        'driverNameOrPhone': undefined,
        'licenseNumber': undefined,
        'card16no': undefined,
        'receiveTime': []
      },

      isShipment: true,
      tableColumnsConfig: com,

      myData: [],
      multiple: false,
      selectedData: [],

      // 卡
      isConnect: false,
      cardinfoOpen: false,
      cardInfoData: null

    };
  },

  computed: {
    api() {
      return '454545';
    },

    que() {
      return {
        ...this.queryParams,
        beginTime: this.queryParams.receiveTime ? this.queryParams.receiveTime[0] : undefined,
        endTime: this.queryParams.receiveTime ? this.queryParams.receiveTime[1] : undefined,
        receiveTime: undefined
      };
    }
  },

  created() {
    this.getList();
  },

  beforeDestroy() {
    this._close();
  },



  methods: {
    getList() {
      this.loading = true;
      cardHistoryList(this.que).then(response => {
        this.total = response.data.total;
        this.myData = response.data.list;
        this.loading = false;
      }).catch(() => { this.loading = false; });
    },

    // 连接本地WebSocket服务
    handlerCarConnect(isConnect) {
      if (isConnect) {
        this._close();
        this.msgSuccess('断开连接成功');
        this.isConnect = false;
      } else {
        CardReader.fn.connect(() => {
          this.msgSuccess('连接成功');
          this.isConnect = true;
        }, () => {
          this.isConnect = false;
        });
      }
    },

    // 读取卡基本数据
    getCardInfo() {
      if (this.isConnect) {
        action.getCardInfo(undefined, true).then(res => {
          if (res.success) {
            if (res.code === '9000') {
              this.$set(this.queryParams, 'card16no', res.GetCardNo.data);
              this.getList();
            }
          } else {
            this.msgError(res.msg);
          }
        });
      } else {
        // 重新连接
        CardReader.fn.connect(() => {
          this.isConnect = true;
          this.getCardInfo();
        });
      }
    },

    // 补卡
    handlerMakeUp() {
      // console.log(this.selectedData, '数据');
      if (!this.isConnect) {
        this.msgWarning('未连接本地服务');
        return;
      }
      // console.log(USERINFO);
      action.getCardInfo(undefined, false).then(res => {
        console.log(res, '先获取卡信息');

        if (res.success) {
          if (res.code === '9000') {
            const user = this.selectedData[0];
            const cardData = {
              card16no: user.card16no,
              newCard16no: res.GetCardNo.data + '', // 获取当前卡的id
              cardBatchNo: user.cardBatchNo
            };

            // 用户数据
            const userInfo = {
              icType: 'r',
              issuing_name: user.orderClient || '-', // orderClient	下单客户
              issuing_pc: user.cardBatchNo || '-', // cardBatchNo	卡批次
              issuing_telno: user.sipperPhone || '-', // sipperPhone	货主手机号
              issuing_time: this.setTimestamp(user.loadingTime) || '-', // loadingTime	装货时间
              project_id: user.projectId || '-', // projectId	项目Id
              team_name: user.teamName || '-', // teamName	车队名称
              team_telno: user.dispatchNumber || '-', // dispatchNumber	调度者手机号
              user_name: user.driverName || '-', // driverName	司机名字
              user_telno: user.driverPhone || '-' // driverPhone	司机电话
            };

            // 数据
            const data = this.selectedData.map(e => {
              return {
                driverPhone: e.driverPhone || '-', // driverPhone	司机电话
                fillTime: this.setTimestamp(e.receiveTime) || '-', // loadingTime	接单时间
                licenseNumber: e.licenseNumber || '-', // '鄂ALF106',
                orderId: e.mainOrderNumber || '-', // mainOrderNumber	货源编号
                projectName: e.projectId || '-', // projectId	项目Id
                serialNumber: e.shipmentMuckyardNo || '-', // shipmentMuckyardNo	渣土场编号
                signTime: this.setTimestamp(e.loadingTime) || '-', // signTime	装货时间
                waybillNo: e.waybillNo || '-' // waybillNo	运单号
              };
            });

            // console.log(userMark, userInfo, versionMark, data, cardData);

            // 提示, 需要白卡

            this.$confirm('此操作将初始化本卡后,再写入数据, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.xexiaoCheck(userMark, userInfo, versionMark, data, cardData);
            }).catch(() => {});
          }
        } else {
          this.msgError(res.msg);
        }
      });
    },

    // 初始卡功能
    handlerCardInit() {
      if (!this.isConnect) {
        this.msgWarning('未连接本地服务');
        return;
      }
      // ??
      this.$confirm('此操作将格式化本卡, 恢复到出厂状态, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        action.cancellation().then(res => {
          if (res.success) {
            console.log(res);
            this.msgSuccess(res.msg || '初始化成功');
          } else {
            this.msgError(res.msg);
          }
          // console.log(res);
        });
      }).catch(() => {});
    },

    // 读取卡用户
    handlerReadUserinfo() {
      if (!this.isConnect) {
        this.msgWarning('未连接本地服务');
        return;
      }
      action.readUserInfo().then(res => {
        if (res.success) {
          if (res.code === '9000') {
            this.cardInfoData = res;
            this.cardinfoOpen = true;
            this.msgSuccess(res.msg);
          } else {
            this.msgWarning(res.msg);
          }
        } else {
          this.msgError(res.msg);
        }
      });
    },

    // 读卡
    handlerReadData() {
      if (!this.isConnect) {
        this.msgWarning('未连接本地服务');
        return;
      }
      // 读取卡数据
      action.readUserInfoAndreadData().then(res => {
        if (res.success) {
          if (res.code === '9000') {
            this.cardInfoData = res;
            this.cardinfoOpen = true;
          } else {
            this.msgWarning(res.msg);
          }
        } else {
          this.msgError(res.msg);
        }
      });
    },

    // 写用户信息
    async handlerWriteUser() {
      const userInfo = {
        icType: 'r',
        //   issuing_name: user.orderClient || "-", // orderClient	下单客户
        issuing_pc: 1627559938998505 || '-', // cardBatchNo	卡批次
        issuing_telno: 15859109601 || '-', // sipperPhone	货主手机号
        issuing_time: 1627559820000, // loadingTime	装货时间
        project_id: 72276 || '-', // projectId	项目Id
        //   team_name:  "-", // teamName	车队名称
        team_telno: 15859102001 || '-' // dispatchNumber	调度者手机号
        //   user_name:  "-", // driverName	司机名字
        // user_telno: 15859101001 || '-' // driverPhone	司机电话
      };

      const cancellation = await action.cancellation();
      if (!cancellation.success || cancellation.code !== '9000') {
        this.msgError(cancellation.msg || '核销失败');
        return;
      }
      action.issuingCard(userInfo, userMark).then((res) => {
        console.log(res);
      });
    },
    // 写运单信息
    async handlerData() {
      const data = {
        driverPhone: '15859101001' || '-', // driverPhone	司机电话
        fillTime: '1627559820000' || '-', // loadingTime	接单时间
        licenseNumber: '闽BQ7801' || '-', // '鄂ALF106',
        orderId: '2107291757184088' || '-', // mainOrderNumber	货源编号
        projectName: '72276' || '-', // projectId	项目Id
        serialNumber: '74' || '-', // shipmentMuckyardNo	渣土场编号
        signTime: '1627559820000' || '-', // signTime	装货时间
        waybillNo: '2107291957141395' || '-' // waybillNo	运单号
      };
      //   console.log(fn.setData(versionMark, data)); // 1010|2|2107291757184088;2107291957141395;72276;闽BQ7801;15859101001;1627559820000;1627559820000;74
      //   return;

      action.writeData(fn.setData(versionMark, data)).then((res) => {
        console.log(res);
      });
    },

    // 选择的数据
    onAllSeleced(lists) {
      const arr = [];
      lists.forEach(e => {
        e.childs.forEach((ee) => {
          arr.push(ee);
        });
      });
      // 判断是不是同一个调度者
      const object = {};
      arr.forEach(e => {
        const str = e['cardBatchNo'];
        const array = object[str];
        if (array) {
          array.push(e);
        } else {
          const suibian = [e];
          object[str] = suibian;
        }
      });
      if (Object.keys(object).length > 1) {
        if (this.multiple) {
          // this.multiple = false;
          this.msgWarning('只能选择同批次的进行写卡');
        }
        this.multiple = false;
      } else {
        // console.log(arr);
        this.selectedData = arr;
      }
    },

    // 关闭
    _close() {
      if (CardReader.socket) {
        CardReader.socket.onclose = function() {}; // disable onclose handler first
        CardReader.socket.close();
        CardReader.socket = null;
        this.isConnect = false;
        // this.userInfo = {};
        // this.list = [];
        // this.IClist = [];
      }
    },

    // 写回卡的操作
    async xexiaoCheck(userMark = userMark, userInfo, meter = versionMark, data, cardData) {
      // 走发卡-写卡
      if (!userInfo) return;
      try {
        this.loading = true;

        const cancellation = await action.cancellation();
        if (!cancellation.success || cancellation.code !== '9000') {
          this.msgError(cancellation.msg || '清卡失败');
          return;
        }

        const res = await action.issuingCard(userInfo, userMark);

        if (!res.success) {
          this.loading = false;
          this.msgError(res.code ? res.msg : '写卡失败, 请不要移动IC卡!');
          return;
        }

        if (res.success && res.code !== '9000') {
          this.loading = false;
          this.msgError(res.msg);
          return;
        }

        // console.log(res, '发卡成功');
      } catch (error) {
        this.msgError('写卡失败, 请不要移动IC卡!');
        this.loading = false;
        return;
      }


      // 写卡
      // 定义 版本标识
      // const meter = this.meter ? this.meter.join('|') + '|' : versionMark;

      // 通过时间来
      const arr = [];
      data.forEach(async(e, index) => {
        this['time' + index] = setTimeout(() => {
          action.writeData(fn.setData(meter, e)).then(res => {
            console.log(res);

            clearTimeout(this['time' + index]);
            if (res.success) {
              if (res.code === '9000') {
                arr.push(true);
                // 执行到最后一步走这里
              } else {
                arr.push(false);
                this.msgError(res.msg);
              }
            } else {
              arr.push(false);
              // this.msgError('写卡失败, 请不要移动IC卡!');
            }

            if (arr.length === data.length) {
              // console.log(arr, '写入结束');

              if (arr.every(e => e)) {
                cardReplacement({
                  card16no: cardData.card16no,
                  newCard16no: cardData.newCard16no,
                  cardBatchNo: cardData.cardBatchNo
                }).then(res => {
                  this.loading = false;
                  this.msgSuccess(res.msg || '补卡成功');
                  this.getList();
                }).catch(() => { this.loading = false; });
              } else {
                this.loading = false;
                this.msgError('写入失败');
              }
            }
          });
        }, (index + 1) * 500);
      });
    },

    // 转时间戳
    setTimestamp(yyyyMMddHHmmss) {
      if (!yyyyMMddHHmmss) return '';
      let date = yyyyMMddHHmmss + '';
      if (date.indexOf('-') !== -1) {
        var data = new Date(yyyyMMddHHmmss);
        date = data.getTime();
      }
      return date + '';
    }
  }
};
</script>

<style>

</style>
