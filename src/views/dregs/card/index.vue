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
            type="primary"
            icon="el-icon-document-checked"
            size="mini"
            :disabled="!multiple"
            @click="handlerMakeUp"
          >补卡</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="primary"
            icon="el-icon-document-checked"
            size="mini"
            @click="handlerCardInit"
          >卡初始化</el-button>
        </el-col>
        <!-- <el-col :span="1.5" class="fr">
          <tablec-cascader v-model="tableColumnsConfig" :lcokey="api" />
        </el-col> -->
        <right-toolbar
          :show-search.sync="showSearch"
          @queryTable="getList"
        />
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

      <!-- 核销IC卡 -->
      <!-- <nuclear-card ref="NuclearCard" :open.sync="nuclearCardDialog" @listData="listData" /> -->
    </div>
  </div>
</template>
<script>
import QueryForm from './components/QueryForm';
import AccountingTable from './components/AccountingTable';
import { cardHistoryList } from '@/api/acaredit';

import CardReader, { USERINFO, versionMark, userMark } from '@/libs/ICCard/CardReader';
const { action, fn } = CardReader;

console.log(action);

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
    'width': '120',
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
    'prop': 'icStatus',
    'isShow': true,
    'tooltip': false,
    'sortNum': 2,
    'label': 'IC卡核对状态',
    'width': 120
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
    'label': '车牌号',
    'prop': 'licenseNumber',
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
    'label': '车队管理者',
    'prop': 'teamLeaderName',
    'isShow': true,
    'sortNum': 3,
    'width': '120',
    'tooltip': true,
    'isChild': false
  },
  {
    'prop': 'loadWeight',
    'isShow': true,
    'tooltip': false,
    'sortNum': 5,
    'label': '装车数量',
    'width': 120
  },
  {
    'prop': 'unloadWeight',
    'isShow': true,
    'tooltip': false,
    'sortNum': 6,
    'label': '卸车数量',
    'width': 120
  },
  {
    'label': '货物类型',
    'prop': 'goodsBigType',
    'isShow': true,
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
  name: 'Acaredit',
  components: { QueryForm, AccountingTable },

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
      isConnect: false

    };
  },

  computed: {
    api() {
      return '454545';
    },

    que() {
      return {
        ...this.queryParams,
        beginTime: this.queryParams.receiveTime[0],
        endTime: this.queryParams.receiveTime[1],
        receiveTime: undefined
      };
    }
  },

  created() {
    this.getList();
    CardReader.fn.connect(() => {
      console.log('连接成功');
      this.isConnect = true;
    }, () => {
      this.isConnect = false;
    });
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

    // 读取卡基本数据
    getCardInfo() {
      if (this.isConnect) {
        action.getCardInfo().then(res => {
          console.log(res);
          if (res.code === '9000') {
            this.$set(this.queryParams, 'card16no', res.GetCardNo.data);
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
      console.log(this.selectedData);
      // console.log(USERINFO);

      const user = this.selectedData[0];

      // const userMark = userMark;

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
          fillTime: this.setTimestamp(e.loadingTime) || '-', // loadingTime	装货时间
          licenseNumber: e.licenseNumber || '-', // '鄂ALF106',
          orderId: e.mainOrderNumber || '-', // mainOrderNumber	货源编号
          projectName: e.projectId || '-', // projectId	项目Id
          serialNumber: e.shipmentMuckyardNo || '-', // shipmentMuckyardNo	渣土场编号
          signTime: this.setTimestamp(e.signTime) || '-', // signTime	卸货时间
          waybillNo: e.waybillNo || '-' // waybillNo	运单号
        };
      });


      console.log(userMark, userInfo, versionMark, data);

      // 提示, 需要白卡

      this.$confirm('此操作将初始化本卡后,再写入数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.xexiaoCheck(userMark, userInfo, versionMark, data);
      }).catch(() => {});
    },

    // 初始卡功能
    handlerCardInit() {
      // ??
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
        this.msgWarning('只能选择同批次的');
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
        this.userInfo = {};
        this.list = [];
        this.IClist = [];
      }
    },

    // 写回卡的操作
    async xexiaoCheck(userMark = userMark, userInfo, meter = versionMark, data) {
      // 走发卡-写卡
      if (!userInfo) return;
      try {
        this.loading = true;
        const res = await action.issuingCard(userInfo, userMark);

        if (!res.success) {
          this.loading = false;
          this.msgError('核销失败, 请不要移动IC卡!');
          return;
        }

        if (res.success && res.code !== '9000') {
          this.loading = false;
          this.msgError(res.msg);
          return;
        }
      } catch (error) {
        this.msgError('核销失败, 请不要移动IC卡!');
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
            clearTimeout(this['time' + index]);
            if (res.success && res.code === '9000') {
              arr.push(true);
              // 执行到最后一步走这里
            } else {
              arr.push(false);
              this.msgSuccess(res.msg);
            }

            if (arr.length === data.length) {
              if (arr.every(e => e)) {
                this.loading = false;
                this.msgSuccess('写入成功');
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
