<template>
  <div v-loading="loading">
    <div>
      <el-form
        ref="queryForm"
        :model="queryParams"
        :inline="true"
        label-width="98px"
      >
        <div class="app-container app-container--search">
          <el-form-item label="卡ID" prop="card16no">
            <el-input
              v-model.trim="queryParams.card16no"
              placeholder="请输入卡ID或读卡获取卡ID"
              clearable
              size="small"
              style="width: 228px"
            />

            <el-button
              class="ml10"
              size="small"
              type="primary"
              plain
              @click="getCardInfo"
            >读卡获取ID</el-button>
          </el-form-item>

          <el-form-item label="装货日期" prop="loadTime">

            <el-date-picker
              v-model.trim="queryParams.loadTime"
              type="datetime"
              style="width: 228px"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择日期时间"
              @change="(value)=>handleQuery(value, 'loadTime')"
            />
          </el-form-item>
          <el-form-item label="卸货日期" prop="unloadTime">

            <el-date-picker
              v-model.trim="queryParams.unloadTime"
              type="datetime"
              style="width: 228px"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择日期时间"
              @change="(value)=>handleQuery(value, 'unloadTime')"
            />
          </el-form-item>


          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini">
              搜索
            </el-button>
            <el-button type="primary" plain icon="el-icon-refresh" size="mini">
              重置
            </el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>

    <!-- 迁卡页面 -->
    <div class="app-container">
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button
            :type="isConnect ? 'danger' : 'primary'"
            icon="el-icon-turn-off"
            size="mini"
            @click="handlerCarConnect(isConnect)"
          >{{ !isConnect ? "连接本地服务" : "断开本地服务" }}</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="success"
            icon="el-icon-mouse"
            size="mini"
            :disabled="!(isConnect && selectedData.length>0 && dispatcherOptions.length>0)"
            @click="handlerqianka"
          >迁卡</el-button>
        </el-col>

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


      <el-table
        ref="multipleTable"
        :data="myDatafilter"
        tooltip-effect="dark"
        style="width: 100%"
        :height="540"
        row-key="waybillNo"
      >
        <!-- @selection-change="handleSelectionChange" -->

        <!--

            goodsTypeName: "石头"
            muckyardName: "0906渣一-石头"
            orderCode: "110949797271486aa198a8ff3e64153c"
            waybillCode: "b5d31fea8ba84eaea3c2ec30f4c5ce8b"
            waybillNo: "2110272051340701"

            loadUnloadType: "1001"
            loadUnloadTypeStr: "渣土场"
            loadTime: "2021-10-27 20:51:35"
            unloadTime: "2021-10-27 20:52:34"
            projectName: "100条项目"

             driverName: "测试"
            driverPhone: "15859101001"
            licenseNumber: "闽BQ7801"

       -->
        <el-table-column label="卡批号" width="55" align="center">
          <template slot="header" slot-scope="scope">
            <el-checkbox v-if="scope" v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange" />
          </template>
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.__isselected" />
          </template>
        </el-table-column>

        <!-- <el-table-column type="selection" width="55" /> -->
        <el-table-column prop="userInfo.issuing_pc" label="卡批号" />
        <el-table-column prop="projectName" label="项目" />

        <el-table-column prop="waybillNo" label="订单号" />

        <el-table-column prop="loadUnloadTypeStr" label="装卸类型" />

        <el-table-column prop="loadTime" label="装货时间" />
        <el-table-column prop="unloadTime" label="卸货时间" />

        <el-table-column prop="dispatcherName" label="调度组" />

        <el-table-column prop="driverName" label="司机">
          <template slot-scope="scope">
            {{ scope.row.driverName }}({{ scope.row.driverPhone }})
          </template>
        </el-table-column>

        <el-table-column prop="licenseNumber" label="车牌号" />
        <el-table-column prop="issuerName" label="发卡人" />
        <el-table-column prop="issuerTime" label="发卡时间">
          <template slot-scope="scope">
            <!-- {{ scope.row.userInfo.issuing_time }} -->
            {{ parseTime(scope.row.userInfo.issuing_time - 0, '{y}-{m}-{d} {h}:{i}:{s}') }}
          </template>
        </el-table-column>
      </el-table>
      <!-- <div>数据库:{{ total }} / 卡:{{ carTotal }}</div> -->
      <div>选中数据: {{ selectedData.length }} 条 / 卡:{{ myData.length }}</div>

      <!-- 已打款的回单 -->
      <el-dialog v-loading="loading" class="i-adjust" title="迁卡操作中, 请勿刷新页面或切换页面" :visible.sync="cardinfoOpen" width="500px" :close-on-click-modal="false" append-to-body :show-close="false">
        <div v-if="cardinfoOpen">
          <el-descriptions v-if="carUserInfo" title="当前卡信息" :column="2">
            <el-descriptions-item label="卡批号">{{ carUserInfo.cardBatchNo }}</el-descriptions-item>
            <el-descriptions-item label="调度组">{{ carUserInfo.teamTelno }}</el-descriptions-item>
            <el-descriptions-item label="调度电话">{{ carUserInfo.dispatcherName }}</el-descriptions-item>
            <el-descriptions-item label="发卡人">{{ carUserInfo.issuerName }}</el-descriptions-item>
            <el-descriptions-item label="发卡电话">{{ carUserInfo.issuerPhone }}</el-descriptions-item>
            <el-descriptions-item label="发卡时间">{{ carUserInfo.issuerTime }}</el-descriptions-item>
            <el-descriptions-item label="项目名称">{{ carUserInfo.projectName }}</el-descriptions-item>
          </el-descriptions>

          <el-divider />

          <div style="margin-bottom:20px;"> <span style="color:red;">请换迁入的卡</span> , 本次共抽取 {{ selectedData.length }} 条记录</div>

          <div>
            请选择要迁往的调度者:
            <el-select v-model="dispatcher" size="mini" filterable placeholder="请选择要迁往的调度者">
              <el-option
                v-for="(item, index) in dispatcherOptions"
                :key="index"
                :label="item.disUserName"
                :value="item.code"
              />
            </el-select>
          </div>

          <el-divider />
          <!--

              companyName: "深圳市凯意达建设工程有限公司"
            createCode: "280bc125660f4c39bccf91519f122880"
            createTime: "2021-08-05 16:00:00"
            disName: "辽宁合伟膨润土有限公司"
            disUserCode: "eec6a9ff7abb4753b10ba5eeb4ba3767"
            disUserName: "测试打款调度一"
            disUserPhone: "158****2001"
            id: 279
            isDel: 0
            isNotInvoice: 0
            isOften: 1
            tel: "15859102001"
            wayCount: 3025
           -->

          <el-descriptions v-if="dispat" title="调度者信息" :column="2">
            <el-descriptions-item label="调度者">{{ dispat.disUserName }}</el-descriptions-item>
            <el-descriptions-item label="调度者电话">{{ dispat.tel }}</el-descriptions-item>
            <el-descriptions-item label="调度组">{{ dispat.disName }}</el-descriptions-item>
          </el-descriptions>
        </div>

        <span slot="footer" class="dialog-footer">
          <el-button type="primary" :disabled="!dispatcher" @click="handlerRelocateCard">确 定</el-button>
        </span>
      </el-dialog>
    </div>

    <div v-if="percentage0" class="progress-box">
      <el-alert show-icon type="success" :closable="false">
        <div style="font-size: 20px">读取数据中, 请勿移动卡片 {{ percentage }}</div>
      </el-alert>
    </div>

    <div v-if="percentage1" class="progress-box">
      <el-alert show-icon type="success" :closable="false">
        <div style="font-size: 20px">数据抽取中, 请勿移动卡片 {{ selectedData.length }} / {{ myDatafilter.length - writeCont }}</div>
      </el-alert>
    </div>

    <div v-if="percentage2" class="progress-box">
      <el-alert show-icon type="success" :closable="false">
        <div style="font-size: 20px">迁卡中, 请勿移动卡片. {{ writeCont }} / {{ selectedData.length }}</div>
      </el-alert>
    </div>

  </div>
</template>
<script>



// import AccountingTable from './components/AccountingTable';

// import CarInfo from './components/CarInfo';

// /transportation/cpuCard/listCardData /transportation/shipmentTeam/list
import { cardHistoryList, cardReplacement, getCpuCardListCardData, cpuCardListCardData, getShipmentTeamList, cpuCardGetCardUserInfo, cpuCardSaveCardLog, cpuCardUpdateCardWaybillRel } from '@/api/dregs/card';

import CardReader, { versionMark, userMark } from '@/libs/ICCard/CardReader';
const { action, fn } = CardReader;

import { deepClone } from '@/utils';
import store from '@/store';
import TreeNodeDialogVue from '../../tool/build/TreeNodeDialog.vue';



export default {
  data() {
    return {
      loading: false,
      total: 0,
      carTotal: 0,
      queryParams: {
        // 固定--
        pageNum: 1,
        pageSize: 10,
        driverNameOrPhone: undefined,
        licenseNumber: undefined,
        card16no: undefined,
        loadTime: undefined,
        unloadTime: undefined
      },

      //   isShipment: true,
      //   tableColumnsConfig: com,

      myData: [],
      myDatafilter: [],
      checkAll: false,
      isIndeterminate: false,

      selectedData: [],
      noSelectArr: [],

      //   multiple: false,

      // 卡
      isConnect: false,
      cardinfoOpen: false,
      cardInfoData: null,

      percentage0: false,
      percentage1: false,
      percentage2: false,
      // 数据写回
      writeCont: 0,

      // 迁卡调度者
      dispatcher: undefined,
      dispatcherOptions: [],

      noShipment: false, // 是否有调度者

      // 当前卡信息
      carUserInfo: null
    };
  },

  computed: {
    // api() {
    //   return '454545';
    // },
    percentage() {
      // console.log('读取中...,' + this.$store.state.icCard.percentage);
      return this.$store.state.icCard.percentage;
    },

    que() {
      return {
        ...this.queryParams,
        beginTime: this.queryParams.receiveTime
          ? this.queryParams.receiveTime[0]
          : undefined,
        endTime: this.queryParams.receiveTime
          ? this.queryParams.receiveTime[1]
          : undefined,
        receiveTime: undefined
      };
    },

    dispat() {
      console.log(this.dispatcherOptions.find(e => e.code === this.dispatcher));
      return this.dispatcherOptions.find(e => e.code === this.dispatcher) || undefined;
    }

    // testProcess() {
    //   return process.env.NODE_ENV === 'development';
    // }
  },

  watch: {
    myDatafilter: {
      handler(e) {
        if (e) {
          this.handlerUpDate();
          this.handleCheckedCitiesChange();
        }
      },
      deep: true
    }
  },

  created() {
    // this.getList();
    // console.log(this.parseTime(1635403138000, '{y}-{m}-{d} {h}:{i}:{s}'));

    this.getShipmentTeamList();
  },

  beforeDestroy() {
    console.log('离开页面了');
    this._close();
  },

  methods: {
    // s= 读取卡基本数据
    getCardInfo() {
      if (this.isConnect) {
        this.loading = true;

        this.percentage0 = true;
        // const _message = this.$message({
        //   duration: 0,
        //   message: '读卡中, 请勿移动卡片',
        //   offset: 400
        // });

        // 读取卡数据
        action.readUserInfoAndreadData().then((res) => {
          if (res.success && res.code === '9000') {
            const { dataList } = res;

            if (Array.isArray(dataList)) {
            //   const myData = dataList.map(e => e.waybillNo);
              this.carTotal = dataList.length;

              this.getList(dataList, res);
            } else {
              console.log('数据不是一个数组');
            }
          } else {
            this.msgWarning(res.msg);
            this.loading = false;

            this.carTotal = 0;
            this.total = 0;
            this.myDatafilter = [];
            this.myData = [];
          }

          // _message.close();
          this.percentage0 = false;
        });

        // action.getCardInfo(undefined, true).then((res) => {
        //   console.log(res);
        //   if (res.success) {
        //     if (res.code === '9000') {
        //       this.$set(this.queryParams, 'card16no', res.GetCardNo.data);
        //       this.getList();
        //     }
        //   } else {
        //     this.msgError(res.msg);
        //   }
        // });
      }
    },

    // 获取迁卡数据(参数waybillNos, 卡的订单号)
    getList(mdataList, CarData) {
      const { GetCardNo, dataList, userInfo, meter, userMark } = CarData;
      // 测试数据
      console.log(CarData);
      const waybillNos = mdataList.map(e => e.waybillNo);


      // getCpuCardListCardData({ waybillNos: waybillNos.join(',') }).then(async res => {
      cpuCardListCardData({ waybillNos: waybillNos }).then(async res => {
        await this.cpuCardGetCardUserInfo(userInfo);

        this.myData = res.data.map(e => {
          mdataList.forEach(carData => {
            if (carData.waybillNo === e.waybillNo) {
              e.carData = carData;
            }
          });

          e.GetCardNo = GetCardNo;
          e.userInfo = userInfo;
          e.meter = meter;
          e.userMark = userMark;
          e.dispatcherName = this.carUserInfo.dispatcherName;
          e.issuerName = this.carUserInfo.issuerName;
          e.issuerTime = this.carUserInfo.issuerTime; // 发卡时间

          return e;
        });

        console.log(this.myData, '卡数据基本信息~!');

        this.myDatafilter = this.myData;
        this.total = res.data.length;
        // this.msgSuccess('读卡成功, 读取' + dataList.length + '条, 数据库存在 ' + this.total + '条');
        this.loading = false;
      });
    },

    // 获取当前卡调度者信息
    cpuCardGetCardUserInfo(userInfo) {
      // 获取当前持卡用户信息
      const que = {
        // driverPhone: userInfo., //	是	司机电话
        dispatcherPhone: userInfo.team_telno, //	是	调度者电话
        issuerPhone: userInfo.issuing_telno, //	是	发卡人电话
        projectId: userInfo.project_id, //	是	项目id
        issuerTime: userInfo.issuing_time, //	是	发卡时间
        cardBatchNo: userInfo.issuing_pc //	是	批次编号
      };
      return cpuCardGetCardUserInfo(que).then(res => {
        this.carUserInfo = {
          ...res.data,
          teamTelno: userInfo.team_telno
        };
        console.log(this.carUserInfo, '当前卡用户信息');
        return res.data;
      });
    },

    // e=

    // s= 时间筛选
    handleQuery(value, type) {
      if (value) {
        if (type === 'loadTime') {
          this.queryParams.unloadTime = undefined;
        } else {
          this.queryParams.loadTime = undefined;
        }

        this.myDatafilter = this.myData.filter(e => {
          return this.bjDate(value, e[type]) === '0';
        });
      } else {
        this.myDatafilter = this.myData;
      }
    },

    bjDate(date_0, date_1) {
      const date = new Date(date_0);
      const date1 = new Date(date_1);
      if (date.getTime() - date1.getTime() < 0) {
        return '0'; // 第二个时间大
      } else {
        return '1'; // 第一个时间大
      }
    },
    // e=

    // s= 表格选中
    handleSelectionChange(selected) {
      this.myDatafilter.forEach(file => {
        // 当前展示的
        file.__isselected = false;

        selected.forEach(ee => {
          if (ee.waybillNo === file.waybillNo) {
            file.__isselected = true;
          }
        });
      });

      this.myData.forEach(my => {
        this.myDatafilter.forEach(file => {
          if (my.waybillNo === file.waybillNo) {
            my.__isselected = file.__isselected;
          }
        });
      });
    },

    handleCheckedCitiesChange(value) {
      const arr = [];
      this.myDatafilter.forEach(e => {
        if (e.__isselected) {
          arr.push(true);
        }
      });
      const checkedCount = arr.length;

      this.checkAll = checkedCount !== 0 && (checkedCount === this.myDatafilter.length);
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.myDatafilter.length;
      console.log(this.isIndeterminate);
    },

    handleCheckAllChange(value) {
      this.myDatafilter.forEach(e => {
        this.$set(e, '__isselected', value);
      });

      this.isIndeterminate = false;
    },

    // 新旧数据同步
    handlerUpDate() {
      const selectArr = [];
      const noSelectArr = [];

      this.myData.forEach(e => {
        this.myDatafilter.forEach(ee => {
          if (ee.waybillNo === e.waybillNo) {
            this.$set(e, '__isselected', ee.__isselected);
          }
        });


        if (e.__isselected) {
          selectArr.push(e);
        } else {
          noSelectArr.push(e);
        }

        this.selectedData = selectArr;
        this.noSelectArr = noSelectArr;
      });
    },

    /* 数组对象去重 */
    _deduplication(arr = [], key) {
      var result = [];
      var obj = {};

      for (var i = 0; i < arr.length; i++) {
        if (!obj[arr[i][key]]) {
          result.push(arr[i]);
          obj[arr[i][key]] = true;
        }
      }

      return result;
    },
    // e==


    // s= 迁卡
    handlerqianka() {
      // 进一步提示
      const h = this.$createElement;
      this.$msgbox({
        title: '消息',
        message: h('p', null, [
          h('h3', null, '迁卡步骤: '),
          h('p', null, '①筛选及提取数据，勾选出需要迁移的“签卡”数据，点击下方“确定” 开始， 提取数据过程中卡片不能离开读卡器，直至提示“提取成功”语音提示，否则为提取失败。'),
          h('p', null, '②迁移数据 从读卡器上移除已提取数据的“原始卡”，放置一张新卡用于储存提取的数据，之后点击“确定，开始迁卡”，迁移数据过程中卡片不能离开读卡器，直至提示“迁卡成功”语音提示，否则为迁卡失败。')
        ]),
        showCancelButton: true,
        closeOnClickModal: false,
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        // this.isWrite = false;
        this.loading = true; // 遮罩层
        this.percentage1 = true; // 显示提示框
        this.writeCont = 0; // 写会的数据
        // 迁卡读取 清空,回填

        if (this.isConnect) {
          if (this.selectedData.length > 0) {
            const qiankaData = this.xiekaData(this.selectedData);
            this.setLocalStorage('t_' + qiankaData.cardData.card16no, qiankaData);
          }

          if (this.noSelectArr.length > 0) {
            const { userMark, userInfo, versionMark, data, cardData } = this.xiekaData(this.noSelectArr);
            this.xexiaoCheck(
              userMark,
              userInfo,
              versionMark,
              data,
              cardData,
              (success) => {
                // 第二次剩余的数据写回 保存卡日志
                setTimeout(() => {
                  this.percentage1 = false; // 关闭提示
                  this.cardinfoOpen = true; // 打开下一步窗口
                }, 1000);
              },
              () => {
                this.loading = false; // 关闭第一出loading
                this.percentage1 = false; // 关闭提示
              });
          } else {
            // 直接清卡
            action.cancellation().then(res => {
              if (res.success) {
                setTimeout(() => {
                  this.percentage1 = false; // 关闭提示
                  this.cardinfoOpen = true; // 打开下一步窗口
                }, 1000);
              } else {
                this.loading = false; // 关闭第一出loading
                this.percentage1 = false; // 关闭提示
                this.msgError(res.msg);
              }
            });
          }
          return;

          // 先跳过日记


          // 第一次保存卡日志(原始卡数据)
          this.handlerCpuCardSaveCardLog(this.myData, 1, () => {
            // 继续
            if (this.selectedData.length > 0) {
              const qiankaData = this.xiekaData(this.selectedData);
              // console.log(qiankaData);
              this.setLocalStorage('t_' + qiankaData.cardData.card16no, qiankaData);
            }

            if (this.noSelectArr.length > 0) {
              const { userMark, userInfo, versionMark, data, cardData } = this.xiekaData(this.noSelectArr);
              this.xexiaoCheck(
                userMark,
                userInfo,
                versionMark,
                data,
                cardData,
                (success) => {
                  // 第二次剩余的数据写回 保存卡日志
                  this.handlerCpuCardSaveCardLog(this.noSelectArr, 2, () => {
                    this.loading = false; // 关闭第一出loading
                    this.percentage1 = false; // 关闭提示
                    this.cardinfoOpen = true; // 打开下一步窗口
                  });
                },
                () => {
                  this.loading = false; // 关闭第一出loading
                  this.percentage1 = false; // 关闭提示
                });
            } else {
              // 直接清卡
              action.cancellation().then(res => {
                if (res.success) {
                  // 清卡也记录一下吧
                  const { cardData } = this.xiekaData(this.myData);
                  const que = {
                    'batchCode': cardData.card16no,
                    'cardBatchNo': cardData.cardBatchNo,
                    'cardData': JSON.stringify([]),
                    'stepNo': 2
                  };
                  cpuCardSaveCardLog(que).then(res => {
                    this.loading = false; // 关闭第一出loading
                    this.percentage1 = false; // 关闭提示
                    this.cardinfoOpen = true; // 打开下一步窗口
                  });
                } else {
                  this.loading = false; // 关闭第一出loading
                  this.percentage1 = false; // 关闭提示
                  this.msgError(res.msg);
                }
              });
            }
          });
        }
      });
    },

    // 保存卡日志
    handlerCpuCardSaveCardLog(arr, stepNo, successfn) {
      if (Array.isArray(arr) && arr.length > 0) {
        const { data, cardData } = this.xiekaData(arr);
        const que = {
          'batchCode': cardData.card16no,
          'cardBatchNo': cardData.cardBatchNo,
          'cardData': JSON.stringify(data),
          'stepNo': stepNo
        };
        cpuCardSaveCardLog(que).then(res => {
          successfn && successfn();
        });
      }
    },

    // 数据收集
    xiekaData(arr, newUser, newCard16no) {
      if (Array.isArray(arr) && arr.length > 0) {
        const user = deepClone(arr[0]);
        const cardData = {
          card16no: (newCard16no || user.GetCardNo.data) + '',
          newCard16no: (newCard16no || user.GetCardNo.data) + '', // 获取当前卡的id
          cardBatchNo: user.userInfo.issuing_pc
        };
        // 用户数据
        // icType: 'r',
        // issuing_pc: user.cardBatchNo || '-', // cardBatchNo	卡批次
        // issuing_telno: user.sipperPhone || '-', // sipperPhone	货主手机号
        // issuing_time: this.setTimestamp(user.loadingTime) || '-', // loadingTime	发卡时间(白卡为当前时间戳)
        // project_id: user.projectId || '-', // projectId	项目Id
        // team_telno: user.dispatchNumber || '-', // dispatchNumber	调度者手机号
        const userInfo = user.userInfo;

        // 不修改原来的值 arr中userInfo的值
        if (newUser) {
          userInfo.team_telno = newUser.tel;
          userInfo.issuing_time = Date.now() + '';
        }

        // 数据
        const data = arr.map(e => e.carData);
        // const userMark = user.userMark || userMark;
        return {
          userMark: user.userMark || userMark,
          userInfo,
          versionMark: user.meter ? user.meter.join('|') + '|' : versionMark,
          data,
          cardData
        };
      } else {
        return undefined;
      }
    },

    // e=

    // s= 迁卡二 -- 把选中的数据写入新卡(或者)
    handlerRelocateCard() {
      // 获取新的调度者
      this.writeCont = 0; // 写会的数据
      const newTem = this.dispatcherOptions.find(e => e.code === this.dispatcher);

      this.handlerReadUserinfo((res) => {
        console.log(res, '存在数据');
        const team_telno = res.userInfo.team_telno;
        const new_team_telno = newTem.tel;

        if (team_telno === new_team_telno) {
          // 同一个调度者
          this.$confirm('确定继续写入本卡?', '当前卡中已存在数据了', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.percentage2 = true;
            this.cardinfoOpen = false;
            action.getCardInfo(undefined, false).then((res) => {
              if (res.success && res.code === '9000') {
                const __data = this.xiekaData(this.selectedData, newTem, res.GetCardNo.data);
                this.handlerWriteData(
                  __data.data,
                  __data.versionMark,
                  (res) => {
                    this.handlerEndres(res);
                    console.log('写卡成功~!');
                    console.log(__data);
                    this.cpuCardUpdateCardWaybillRel(__data.cardData.card16no, __data.cardData.cardBatchNo, __data.data.map(e => e.waybillNo));
                  },
                  () => {
                    console.log('写入失败~!');
                  }
                );
              } else {
                this.msgError(res.msg);
              }
            }).catch(() => {});
          });
        } else {
          this.msgError('请选择 相同的调度者~!' + '当前卡调度者电话是:' + team_telno);
        }
      }, () => {
        // 获取卡信息
        this.$confirm('确定换了要迁移的新卡了吗？', '当前是一张空白卡，', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.percentage2 = true;
          this.cardinfoOpen = false;
          action.getCardInfo(undefined, false).then((res) => {
            if (res.success && res.code === '9000') {
              const __data = this.xiekaData(this.selectedData, newTem, res.GetCardNo.data);

              this.xexiaoCheck(
                __data.userMark,
                __data.userInfo,
                __data.versionMark,
                __data.data,
                __data.cardData,
                (res) => {
                  // 成功
                  this.handlerEndres(res);

                  console.log('迁卡成功, 卡内现有' + this.writeCont + '条记录');
                  console.log(__data);
                  this.cpuCardUpdateCardWaybillRel(__data.cardData.card16no, __data.cardData.cardBatchNo, __data.data.map(e => e.waybillNo));
                },
                () => { this.percentage2 = true; },
                (data, alreadyWriteData) => {
                  this.percentage2 = false;
                  // 弹出换卡框
                  console.log(res, '暂停写卡');
                }
              );
            } else {
              this.msgError(res.msg);
            }
          }).catch(() => {});
        });
      });
    },

    // 最后成功处理
    handlerEndres(res) {
      if (res && res.data && Array.isArray(res.data.indexNow)) {
        const shi = res.data.indexNow[0] - 3;
        const tiao = res.data.indexNow[1];
        const writeNmber = shi * 30 + tiao;
        this.msgSuccess('迁卡成功, 卡内现有' + writeNmber + '条记录');
      } else {
        this.msgSuccess('迁卡成功');
      }
      this.loading = false;
      this.percentage2 = false;
      this.myData = this.myData.filter(e => !e.__isselected);
      this.myDatafilter = this.myData;
    },

    // e=

    // s= 获取常用调度者
    getShipmentTeamList() {
      const que = {
        'pageNum': 1,
        'pageSize': 1000
      };
      this.loading = true;
      getShipmentTeamList(que).then(res => {
        this.loading = false;
        this.noShipment = true;
        this.dispatcherOptions = res.data;
        console.log(this.dispatcherOptions);
      }).catch(() => {
        this.loading = false;
        this.msgError('请求不到当前用户下的调度组! 无法进行迁卡操作~!');
        this.noShipment = false;
      });
    },

    // e=

    // s= 更新运单关联信息
    cpuCardUpdateCardWaybillRel(card16no, cardBatchNo, waybillNos) {
      const que = {
        card16no, //	string	 必须  卡原始编号
        cardBatchNo, //	string	 必须  批次编号
        waybillNos //	string []	 必须  运单编号集合
      };

      cpuCardUpdateCardWaybillRel(que).then(res => {
        console.log(res);
      });
    },
    // e=



    // s= 连接本地WebSocket服务
    handlerCarConnect(isConnect) {
      if (isConnect) {
        this._close();
        this.msgSuccess('断开连接成功');
        this.isConnect = false;
      } else {
        CardReader.fn.connect(
          () => {
            this.msgSuccess('连接成功');
            this.isConnect = true;
          },
          () => {
            this.isConnect = false;
          }
        );
      }
    },

    // e=



    // 写卡
    handlerMakeUp() {
      // console.log(this.selectedData, '数据');
      if (!this.isConnect) {
        this.msgWarning('未连接本地服务');
        return;
      }
      // console.log(USERINFO);
      action.getCardInfo(undefined, false).then((res) => {
        // console.log(res, '先获取卡信息');

        // console.log(this.selectedData);
        if (res.success) {
          if (res.code === '9000' && this.selectedData[0]) {
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
            const data = this.selectedData.map((e) => {
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

            this.$confirm(
              '此操作将初始化本卡后,再写入数据, 是否继续?',
              '提示',
              {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }
            )
              .then(() => {
                this.xexiaoCheck(
                  userMark,
                  userInfo,
                  versionMark,
                  data,
                  cardData
                );
              })
              .catch(() => {});
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
      })
        .then(() => {
          action.cancellation().then((res) => {
            if (res.success) {
              console.log(res);
              this.msgSuccess(res.msg || '初始化成功');
            } else {
              this.msgError(res.msg);
            }
            // console.log(res);
          });
        })
        .catch(() => {});
    },

    // 读取卡用户
    handlerReadUserinfo(successfn, errorfn) {
      if (!this.isConnect) {
        this.msgWarning('未连接本地服务');
        return;
      }
      action.readUserInfo().then((res) => {
        if (res.success && res.code === '9000') {
          this.cardInfoData = res;
          //   this.cardinfoOpen = true;
          // this.msgSuccess(res.msg);
          //   successfn && successfn(res);
          successfn && successfn(res);
        } else {
        //   this.msgWarning(res.msg);
          errorfn && errorfn(res);
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
      action.readUserInfoAndreadData().then((res) => {
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
        team_telno: 15859102001 || '-', // dispatchNumber	调度者手机号
        //   user_name:  "-", // driverName	司机名字
        user_telno: 15859101001 || '-' // driverPhone	司机电话
      };

      const cancellation = await action.cancellation();
      if (!cancellation.success || cancellation.code !== '9000') {
        this.msgError(cancellation.msg || '核销失败');
        return;
      }
      console.log(userMark);
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
      lists.forEach((e) => {
        e.childs.forEach((ee) => {
          arr.push(ee);
        });
      });
      // 判断是不是同一个调度者
      const object = {};
      arr.forEach((e) => {
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
      }
    },

    // 第一次写回卡的操作
    async xexiaoCheck(
      userMark,
      userInfo,
      meter = versionMark,
      data,
      cardData,
      successfn,
      errorfn,
      pauseWrite
    ) {
      this.writeCont = 0; // 下卡成功 + 1

      const arr = []; // 成功 + 1

      const arrtime = []; // 定时器标识

      const indexc = [3, 3]; // 定义多少条写满数据

      const alreadyWriteData = []; // 写入成功的订单集合


      try { // async await 用try..catch.. 捕获
        // 第一步 销卡
        const cancellation = await action.cancellation();
        if (!cancellation.success || cancellation.code !== '9000') {
          this.loading = false;
          errorfn && errorfn();
          this.msgError(cancellation.msg || '清卡失败');
          return;
        }
        // 第二步 发卡
        const res = await action.issuingCard(userInfo, userMark);
        if (!res.success || (res.success && res.code !== '9000')) {
          this.loading = false;
          errorfn && errorfn();
          this.msgError(res.code ? res.msg : '写卡失败!');
          return;
        }
      } catch (error) {
        this.msgError('写卡失败!');
        errorfn && errorfn();
        this.loading = false;
        return;
      }
      // 第三步 写卡 时间间隔 500(太快会失败)

      data.forEach(async(e, index) => {
        arrtime[index] = setTimeout(() => {
          action.writeData(fn.setData(meter, e)).then((res) => {
            if (res.success) {
              if (res.code === '9000') {
                arr.push(true);
                this.writeCont++;
                alreadyWriteData.push(e.waybillNo);
              } else {
                arr.push(false);
                this.msgError(res.msg);
              }
            } else {
              arr.push(false);
            }

            if (res.data.indexNow[0] === indexc[0] && res.data.indexNow[1] === indexc[1]) {
              for (let i = 0; i < arrtime.length; i++) {
                clearTimeout(arrtime[i]);
              }

              pauseWrite && pauseWrite(data, alreadyWriteData);
            } else {
              if (arr.length === data.length) {
                if (arr.every((e) => e)) {
                  successfn && successfn(res);
                } else {
                  this.loading = false;
                  this.msgError('写入失败: ' + arr.filter(e => !e).length + '条');
                  errorfn && errorfn();
                }
              }
            }
          });
        }, (index + 1) * 1000);
      });
    },

    // 数据继续写入
    handlerWriteData(data, meter, successfn, errorfn) {
      const _message = this.$message({
        duration: 0,
        message: '读卡中, 请勿移动卡片',
        offset: 400
      });

      this.isWrite = true;
      this.writeCont = 0;
      // 第三步 写卡 时间间隔 500(太快会失败)
      const arr = [];

      console.log(data, meter, successfn);

      data.forEach(async(e, index) => {
        this['time' + index] = setTimeout(() => {
          // 写入一条数据

          action.writeData(fn.setData(meter, e)).then((res) => {
            clearTimeout(this['time' + index]);
            if (res.success) {
              if (res.code === '9000') {
                arr.push(true);
                this.writeCont++;
              } else {
                arr.push(false);
                this.msgError(res.msg);
              }
            } else {
              arr.push(false);
            }

            if (arr.length === data.length) {
              // console.log(arr, '写入结束');

              if (arr.every((e) => e)) {
                this.loading = false;
                // this.msgSuccess('写回卡成功');
                _message.close();

                successfn && successfn(res);
                // cardReplacement({
                //   card16no: cardData.card16no,
                //   newCard16no: cardData.newCard16no,
                //   cardBatchNo: cardData.cardBatchNo
                // })
                //   .then((res) => {
                //     this.loading = false;
                //     this.msgSuccess(res.msg || '补卡成功');
                //     this.getList();
                //   })
                //   .catch(() => {
                //     this.loading = false;
                //   });
              } else {
                this.loading = false;
                this.msgError('写入失败: ' + arr.filter(e => !e).length + '条');
                errorfn && errorfn();
              }
            }
          });
        }, (index + 1) * 1000);
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


<style scoped>
.progress-box{
    width: 50vw;
    position: fixed;
    top: 30%;
    left: 0;
    right: 0;
    z-index: 20212021;
    transform: translate(50%);
    padding: 50px;
}
</style>
