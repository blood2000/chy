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
              placeholder="请点击读卡按钮"
              clearable
              size="small"
              style="width: 228px"
              disabled
            />

            <el-button
              class="ml10"
              size="small"
              type="primary"
              plain
              @click="getCardInfo"
            >读卡</el-button>
          </el-form-item>

          <el-form-item label="装货日期" prop="loadTime">

            <el-date-picker
              v-model.trim="queryParams.loadTime"
              type="date"
              style="width: 228px"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择日期时间"
              @change="(value)=>handleQuery(value, 'loadTime')"
            />
          </el-form-item>
          <el-form-item label="卸货日期" prop="unloadTime">

            <el-date-picker
              v-model.trim="queryParams.unloadTime"
              type="date"
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
            :disabled="!(isConnect && selectedData.length>0)"
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

        <el-table-column
          type="index"
          width="50"
        />

        <!-- <el-table-column type="selection" width="55" /> -->
        <el-table-column prop="userInfo.issuing_pc" label="卡批号" />
        <el-table-column prop="projectName" label="项目" />

        <el-table-column prop="waybillNo" label="运单号" />

        <el-table-column prop="loadUnloadTypeStr" label="装卸类型" />

        <el-table-column sortable prop="loadTime" label="装货时间" />
        <el-table-column sortable prop="unloadTime" label="卸货时间" />

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
      <div style="paddingTop:10px">选中数据: {{ selectedData.length }} 条 / 卡:{{ myData.length }}</div>

      <!-- 已打款的回单 -->
      <el-dialog v-loading="loading" class="i-adjust" title="迁卡操作中, 请勿刷新页面或切换页面" :visible.sync="cardinfoOpen" width="500px" :close-on-click-modal="false" append-to-body :show-close="true">
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
            <el-select v-if="false" v-model="dispatcher" size="mini" filterable placeholder="请选择要迁往的调度者">
              <el-option
                v-for="(item, index) in dispatcherOptions"
                :key="index"
                :label="item.disUserName"
                :value="item.code"
              />
            </el-select>
            <el-button type="primary" @click="open = true">选择调度者</el-button>
          </div>

          <el-divider />
          <!--
              disName: "测试打款调度二组"
              disUserCode: "e9a1c08f51d7431bb1046b33dabc91ee"
              disUserName: "测试打款调度二"
              disUserPhone: "15859102002"
              tel: null
           -->

          <el-descriptions v-if="schedSelect" title="调度者信息" :column="2">
            <el-descriptions-item label="调度者">{{ schedSelect.disUserName }}</el-descriptions-item>
            <el-descriptions-item label="调度者电话">{{ schedSelect.disUserPhone }}</el-descriptions-item>
            <el-descriptions-item label="调度组">{{ schedSelect.disName }}</el-descriptions-item>
            <!-- <el-descriptions-item label="调度组">{{ dispat.disName }}</el-descriptions-item> -->
          </el-descriptions>
        </div>

        <span slot="footer" class="dialog-footer">
          <el-button type="primary" :disabled="!carUserInfo" @click="handlerRelocateCard()">确 定</el-button>
        </span>
      </el-dialog>
    </div>

    <div v-if="percentage0" class="progress-box">
      <el-alert show-icon type="success" :closable="false">
        <div style="font-size: 20px">读取数据中, 请勿移动卡片 {{ percentage }}</div>
      </el-alert>
    </div>

    <div v-if="noSelectArr.length && percentage1" class="progress-box">
      <el-alert show-icon type="success" :closable="false">
        <div style="font-size: 20px">数据抽取中, 请勿移动卡片 {{ writeCont }} / {{ noSelectArr.length }}</div>
      </el-alert>
    </div>

    <div v-if="percentage2" class="progress-box">
      <el-alert show-icon type="success" :closable="false">
        <div style="font-size: 20px">迁卡中, 请勿移动卡片. {{ writeCont }} / {{ selectedData.length }}</div>
      </el-alert>
    </div>


    <ChooseTeam :open.sync="open" @handlerScheduling="(_dieobj)=> schedSelect = _dieobj" />

  </div>
</template>
<script>

import { deepClone } from '@/utils';

import { cpuCardListCardData, getShipmentTeamList, cpuCardGetCardUserInfo, cpuCardSaveCardLog, cpuCardUpdateCardWaybillRel } from '@/api/dregs/card';

import { listInfoApi } from '@/api/enterprise/group';

import CardReader, { versionMark, userMark, USERINFO } from '@/libs/ICCard/CardReader';

const { action, fn } = CardReader;

import ChooseTeam from './ChooseTeam.vue';


export default {

  components: { ChooseTeam },

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

      // 卡
      isConnect: false,
      cardinfoOpen: false,
      cardInfoData: null, // 要迁移的卡用户信息

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
      carUserInfo: null,
      user_info: '', // 字符串信息
      creatCardBatchNo: 0,
      this_sourceData: null,
      ccarNo: null,
      newTeamInfo: null, // 新选的调度者

      open: false,
      'schedSelect': null // 选中的调度
    };
  },

  computed: {
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
      return this.dispatcherOptions.find(e => e.code === this.dispatcher) || undefined;
    }
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
    // this.getShipmentTeamList();
    // this.listInfoApi();
  },

  beforeDestroy() {
    this._close();
  },

  methods: {
    groupSelected(data) {
      console.log(data);
    },
    oneSelected(data) {
      console.log(data);
    },


    // s= 一初始读取卡基本数据
    getCardInfo() {
      if (this.isConnect) {
        this.loading = true;
        this.percentage0 = true;
        // 读取卡数据
        action.readUserInfoAndreadData().then((res) => {
          if (res.success && res.code === '9000') {
            // 成功处理
            const { dataList, userInfo, userMark } = res;

            // 存当前用户信息(记录的时候使用)
            this.user_info = userMark + (USERINFO.map(e => userInfo[e])).join(';');

            if (Array.isArray(dataList)) {
              this.carTotal = dataList.length;
              this.percentage0 = false;
              this.getList(dataList, res);
            }
          } else {
            this.ccarNo = null;
            this.queryParams.card16no = undefined;
            // 空卡的情况
            this.msgWarning(res.msg);
            this.loading = false;
            this.percentage0 = false;
            this.myData = [];
            this.myDatafilter = [];
          }
        });
      }
    },

    // 获取迁卡数据(参数waybillNos, 卡的订单号)
    getList(mdataList, CarData) {
      // getCpuCardListCardData({ waybillNos: waybillNos.join(',') }).then(async res => { // 原来的接口
      cpuCardListCardData({ waybillNos: mdataList.map(e => e.waybillNo) }).then(async res => {
        const { GetCardNo, userInfo, meter, userMark } = CarData;

        // console.log(CarData);

        this.ccarNo = {
          cardBatchNo: userInfo.issuing_pc,
          card16no: GetCardNo.data,
          versionMark: meter.join('|') + '|'
        }; // 存一下当前的卡信息

        this.queryParams.card16no = GetCardNo.data;

        await this.cpuCardGetCardUserInfo(userInfo); // 通过接口获取当前卡调度者信息 存到 this.carUserInfo

        this.myData = res.data.map(e => {
          mdataList.forEach(carData => {
            if (carData.waybillNo === e.waybillNo) {
              e.carData = carData;
            }
          });

          // 列表展示的额外数据
          e.GetCardNo = GetCardNo;
          e.userInfo = userInfo;
          e.meter = meter;
          e.userMark = userMark;
          e.dispatcherName = this.carUserInfo.dispatcherName;
          e.issuerName = this.carUserInfo.issuerName;
          e.issuerTime = this.carUserInfo.issuerTime; // 发卡时间

          return e;
        });

        this.myDatafilter = this.myData; // 数据备份
        this.total = res.data.length; // 返回数据条数(有可能数据有相同的)
        this.loading = false; // 完成第一步读卡
      });
    },

    // 获取当前卡调度者信息(到app的接口)
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
        return res.data;
      });
    },
    // e=

    // s= 二迁卡
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
        this.loading = true; // 显示遮罩层(一直到迁卡结束为止)
        this.percentage1 = true; // 显示显示提示框(第一阶段)
        this.writeCont = 0; // 初始写卡的数据
        // 迁卡读取 清空/回填
        if (this.isConnect) {
          // if (this.selectedData.length > 0) {
          //   const qiankaData = this.xiekaData(this.selectedData);
          //   this.setLocalStorage('t_' + qiankaData.cardData.card16no, qiankaData); // 保存当前写卡的信息(如果写卡失败, 可以找回)
          // }

          // // 2中情况(全选和选中部分)
          // if (this.noSelectArr.length > 0) {
          //   const { userMark, userInfo, versionMark, data, cardData } = this.xiekaData(this.noSelectArr);
          //   this.xexiaoCheck(
          //     userMark,
          //     userInfo,
          //     versionMark,
          //     data,
          //     cardData,
          //     (success) => {
          //       // 第二次剩余的数据写回 保存卡日志
          //       setTimeout(() => {
          //         this.percentage1 = false; // 关闭提示
          //         this.cardinfoOpen = true; // 打开下一步窗口
          //       }, 1000);
          //     });
          // } else {
          //   // 直接清卡
          //   action.cancellation().then(res => {
          //     if (res.success) {
          //       setTimeout(() => {
          //         this.percentage1 = false; // 关闭提示
          //         this.cardinfoOpen = true; // 打开下一步窗口
          //       }, 1000);
          //     }
          //   });
          // }
          // return;

          // 先跳过日记

          // 第一次先保存卡日志(原始卡数据)
          this.creatCardBatchNo = Date.now() + '999'; // 创建唯一值

          this.handlerCpuCardSaveCardLog(this.creatCardBatchNo, 1, (success) => {
            // 保存成功继续
            if (this.selectedData.length > 0) {
              const qiankaData = this.xiekaData(this.selectedData);
              this.setLocalStorage('t_' + qiankaData.cardData.card16no, qiankaData); // 保存当前写卡的信息(如果写卡失败, 可用于找回)
            }

            // 2中情况(全选/选中部分)
            if (this.noSelectArr.length > 0) {
              // 整理数据
              const { userMark, userInfo, versionMark, data, cardData } = this.xiekaData(this.noSelectArr);
              // 写卡操作(这里只要处理成功回调, 不存在写满状态)
              this.xexiaoCheck(
                userMark,
                userInfo,
                versionMark,
                data,
                cardData,
                (success) => {
                  // 第二次剩余的数据写回 保存卡日志
                  this.handlerCpuCardSaveCardLog(this.creatCardBatchNo, 2, () => {
                    setTimeout(() => {
                      this.percentage1 = false; // 关闭第一阶段提示
                      this.cardinfoOpen = true; // 打开下一步窗口
                    }, 1000);
                  }, this.selectedData, success.writeData);
                });
            } else {
              // 直接清卡
              action.cancellation().then(res => {
                if (res.success) {
                  // 第二次剩余的数据写回 保存卡日志
                  this.handlerCpuCardSaveCardLog(this.creatCardBatchNo, 2, () => {
                    setTimeout(() => {
                      this.percentage1 = false; // 关闭第一阶段提示
                      this.cardinfoOpen = true; // 打开下一步窗口
                    }, 1000);
                  }, this.selectedData, []);
                }
              }).catch(err => {
                console.log(err);
                this.msgError(err.msg);
              });
            }
          }, this.selectedData);
        }
      });
    },
    // e=

    // s= 三迁卡 -- 把选中的数据写入新卡 handlerAlreadyWriteData__data满卡后继续迁移的数据
    handlerRelocateCard(handlerAlreadyWriteData__data) {
      this.writeCont = 0; // 重新开始计算
      // 获取新的调度者(找不到的情况? 问APP接口)
      const newTem = this.schedSelect; // this.dispatcherOptions.find(e => e.code === this.dispatcher);

      console.log(newTem);

      this.newTeamInfo = newTem;

      // 先读下卡用户信息
      this.handlerReadUserinfo((res) => {
        // 已存在用户(有数据了)
        const team_telno = res.userInfo.team_telno;
        const new_team_telno = newTem.tel;

        // 判断是否同一个调度者才能进行下一步操作
        if (team_telno === new_team_telno) {
          this.$confirm('确定继续写入本卡?', '当前卡中已存在数据了', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.percentage2 = true; // 提示框(第二阶段)
            this.cardinfoOpen = false; // 关闭对话框(没的返回了)
            // 开始读卡用户
            action.getCardInfo(undefined, false).then((res) => {
              if (res.success && res.code === '9000') {
                // 开始读卡数据(如果是空数据呢???)
                action.readUserInfoAndreadData().then((readDataRes) => {
                  if (readDataRes.success && readDataRes.code === '9000') {
                    // 写死判断
                    if (readDataRes.dataList.length >= 200) {
                      this.$confirm('请换新卡?', '提示', {
                        confirmButtonText: '确定',
                        type: 'warning'
                      }).then(() => {
                        this.handlerRelocateCard();
                      });
                      return;
                    }

                    // 整理数据 handlerAlreadyWriteData__data存在说明满卡操作
                    const __data = handlerAlreadyWriteData__data || this.xiekaData(this.selectedData, newTem, res.GetCardNo.data);

                    // s= 调用写卡函数
                    this.handlerWriteData(
                      __data.data,
                      __data.versionMark,
                      (success) => {
                        // 更新数据库(??)
                        this.cpuCardUpdateCardWaybillRel(res.GetCardNo.data, __data.cardData.cardBatchNo, __data.data.map(e => e.waybillNo));

                        // 保存步骤3
                        const target = {
                          'user': __data.userMark + (USERINFO.map(e => __data.userInfo[e])).join(';'),
                          'data': {
                            'all': readDataRes.dataList.map(data => fn.setData(readDataRes.meter.join('|') + '|', data)),
                            'write': success.writeData
                          }
                        };
                        this.handlerCpuCardSaveCardLog(this.creatCardBatchNo, 3, () => {}, this.selectedData, [], target);

                        this.handlerEndres(success); // 写卡成功
                      },
                      () => { this.percentage2 = true; }, // 失败(刷新吧!~)
                      (data, alreadyWriteData) => { // 卡满
                        // 更新数据库(??)
                        this.cpuCardUpdateCardWaybillRel(res.GetCardNo.data, __data.cardData.cardBatchNo, alreadyWriteData);
                        // 处理数据
                        this.handlerAlreadyWriteData(data, alreadyWriteData, __data);
                      }
                    );

                    // e= 调用写卡函数
                  } else {
                    this.msgError(readDataRes.msg);
                  }
                });
              } else {
                this.msgError(res.msg);
              }
            }).catch(() => {});
          });
        } else {
          this.msgError('请选择 相同的调度者~!' + '当前卡调度者电话是:' + team_telno); // 提示一下
          // 卡满的情况提示换新卡
          if (handlerAlreadyWriteData__data) {
            this.$confirm('请换新卡?', '提示', {
              confirmButtonText: '确定',
              type: 'warning'
            }).then(() => {
              this.handlerRelocateCard(handlerAlreadyWriteData__data);
            });
          }
        }
      }, () => {
        // 白卡处理
        this.$confirm('确定换了要迁移的新卡了吗？', '当前是一张空白卡，', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then((errres) => {
          this.percentage2 = true; // 提示框(第二阶段)
          this.cardinfoOpen = false; // 关闭对话框(没的返回了)

          console.log(errres); // 无用信息(能获取到卡信息吗?----------------------------------todo)

          action.getCardInfo(undefined, false).then((res) => {
            if (res.success && res.code === '9000') {
              // 整理数据
              const __data = handlerAlreadyWriteData__data || this.xiekaData(this.selectedData, newTem, res.GetCardNo.data);

              // s= 调用写卡函数
              this.xexiaoCheck(
                __data.userMark,
                __data.userInfo,
                __data.versionMark,
                __data.data,
                __data.cardData,
                (success) => {
                  // 同上
                  this.cpuCardUpdateCardWaybillRel(res.GetCardNo.data, __data.cardData.cardBatchNo, __data.data.map(e => e.waybillNo));

                  // 同上
                  const target = {
                    'user': __data.userMark + (USERINFO.map(e => __data.userInfo[e])).join(';'),
                    'data': {
                      'all': [],
                      'write': success.writeData
                    }
                  };

                  this.handlerCpuCardSaveCardLog(this.creatCardBatchNo, 3, () => {}, this.selectedData, [], target);

                  // 成功
                  this.handlerEndres(success);
                },
                () => { this.percentage2 = true; }, // 失败
                (data, alreadyWriteData) => { // 卡满(迁到新卡不存在写满的问题吧?)
                  this.cpuCardUpdateCardWaybillRel(res.GetCardNo.data, __data.cardData.cardBatchNo, alreadyWriteData);

                  this.handlerAlreadyWriteData(data, alreadyWriteData, __data);
                }
              );
              // e= 调用写卡函数
            } else {
              this.msgError(res.msg);
            }
          });
        });
      });
    },

    // 找出未写完的数据并提示换卡
    handlerAlreadyWriteData(data, alreadyWriteData, __data) {
      this.percentage2 = false;

      const xixuWriteData = [];

      data.forEach((e) => {
        if (!alreadyWriteData.includes(e.waybillNo)) {
          xixuWriteData.push(e);
        }
      });

      __data.data = xixuWriteData; // 赋值剩余的数据

      this.$confirm('已满200条,请换卡?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 重复去写卡
        this.handlerRelocateCard(__data);
      }).catch(() => {});
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
      this.myData = [];
      this.myDatafilter = [];
      this.dispatcher = undefined;
    },

    // 写卡操作(重要)
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

      this.handlerWriteData(data, meter, successfn, errorfn, pauseWrite);
    },

    // 数据写入
    handlerWriteData(data, meter, successfn, errorfn, pauseWrite) {
      const _message = this.$message({
        duration: 0,
        message: '读卡中, 请勿移动卡片',
        offset: 400
      });

      this.writeCont = 0; // 下卡成功 + 1

      const arr = []; // 成功 + 1

      const arrtime = []; // 定时器标识

      const indexc = [9, 20]; // 定义多少条写满数据

      const alreadyWriteData = []; // 写入成功的订单集合

      let stop = false;

      const writeData = [];

      let isok = false;

      data.forEach(async(e, index) => {
        arrtime[index] = setTimeout(() => {
          if (stop) return;
          if (isok) return;
          isok = true;
          action.writeData(fn.setData(meter, e)).then((res) => {
            isok = false;
            if (res.success) {
              if (res.code === '9000') {
                arr.push(true);
                this.writeCont++;
                writeData.push({ data: fn.setData(meter, e), status: 1 });
                alreadyWriteData.push(e.waybillNo);

                if (res.data.indexNow[0] >= indexc[0] && res.data.indexNow[1] >= indexc[1]) {
                  stop = true;
                  for (let i = 0; i < arrtime.length; i++) {
                    clearTimeout(arrtime[i]);
                  }
                  // 抛出写卡满了
                  _message.close();
                  pauseWrite && pauseWrite(data, alreadyWriteData, writeData);
                }
              } else {
                arr.push(false);
                writeData.push({ data: fn.setData(meter, e), status: 0 });
                this.msgError(res.msg);
              }
            } else {
              arr.push(false);
            }

            if (arr.length === data.length) {
              _message.close();

              if (arr.every((e) => e)) {
                successfn && successfn({ ...res, writeData });
              } else {
                this.loading = false;
                this.msgError('写入失败: ' + arr.filter(e => !e).length + '条');
                errorfn && errorfn();
              }
            }
          });
        }, (index + 1) * 500);
      });
    },
    // e=

    // s= 获取常用调度者
    // listInfoApi() {
    //   const que = {
    //     pageNum: 1,
    //     pageSize: 10,
    //     disName: null,
    //     disUserName: null,
    //     disUserPhone: null
    //   };


    //   listInfoApi(que).then(res => {
    //     console.log(res);
    //   });
    // },


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
        card16no: card16no, //	string	 必须  卡原始编号
        cardBatchNo, //	string	 必须  批次编号(新卡,创建,旧卡继续使用)
        waybillNos, //	string []	 必须  运单编号集合
        dispatcherCode: this.newTeamInfo.disUserCode, // 新调度者code
        teanPhone: this.newTeamInfo.tel // 新调度者电话
      };

      console.log(que);

      cpuCardUpdateCardWaybillRel(que).then(res => {});
    },
    // e=

    // s=保存卡日志
    // select 选中的数据  write 写回卡的数据  target目标的数据
    handlerCpuCardSaveCardLog(creatCardBatchNo, stepNo, successfn, select, write, target) {
      const obj = {
        sourceData_1: undefined,
        sourceData_2: undefined,
        sourceData_3: undefined
      };


      if (stepNo === 1) {
        obj.sourceData_1 = {
          'qk_code': creatCardBatchNo,
          'step': 1,
          'source': {
            'user': this.user_info,
            'data': {
              'all': this.xiekaData(this.myData).data.map(data1 => fn.setData(this.ccarNo.versionMark, data1)),
              'select': this.xiekaData(select).data.map(data1 => fn.setData(this.ccarNo.versionMark, data1))
            }
          }
        };
      } else if (stepNo === 2) {
        obj.sourceData_2 = {
          'qk_code': creatCardBatchNo,
          'step': 2,
          'source': {
            'user': this.user_info,
            'data': {
              'all': this.xiekaData(this.myData).data.map(data1 => fn.setData(this.ccarNo.versionMark, data1)),
              'select': this.xiekaData(select).data.map(data1 => fn.setData(this.ccarNo.versionMark, data1)),
              'write': write.length > 0 ? write : []
            }
          }
        };
        this.this_sourceData = obj.sourceData_2;
      } else {
        obj.sourceData_3 = {
          ...this.this_sourceData,
          'step': 3,
          'target': target
        };
      }

      const que = {
        'batchCode': creatCardBatchNo,
        'cardBatchNo': this.ccarNo.cardBatchNo,
        'stepNo': stepNo,
        'cardData': JSON.stringify(obj['sourceData_' + stepNo])
      };


      cpuCardSaveCardLog(que).then(res => {
        successfn && successfn(res);
      });
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
          cardData.cardBatchNo = Date.now() + '999';
          userInfo.issuing_pc = cardData.cardBatchNo;
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

    // s= 其他的方法
    // 销卡功能
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
              this.msgSuccess(res.msg || '初始化成功');
            } else {
              this.msgError(res.msg);
            }
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
          successfn && successfn(res);
        } else {
          errorfn && errorfn(res);
        }
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

    // 转时间戳
    setTimestamp(yyyyMMddHHmmss) {
      if (!yyyyMMddHHmmss) return '';
      let date = yyyyMMddHHmmss + '';
      if (date.indexOf('-') !== -1) {
        var data = new Date(yyyyMMddHHmmss);
        date = data.getTime();
      }
      return date + '';
    },

    // 时间筛选
    handleQuery(value, type) {
      if (value) {
        if (type === 'loadTime') {
          this.queryParams.unloadTime = undefined;
        } else {
          this.queryParams.loadTime = undefined;
        }

        // 加一天
        var date = new Date(value);
        const newvalue = date.setDate(date.getDate() + 1);


        this.myDatafilter = this.myData.filter(e => {
          return this.bjDate(value, e[type]) === '0' && this.bjDate(newvalue, e[type]) === '1';
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

    // 表格选中
    handleSelectionChange(selected) {
      this.myDatafilter.forEach(file => {
        // 默认为未选中
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
    // e==

    // 废弃方法========================
    // 写卡
    handlerMakeUp() {
      if (!this.isConnect) {
        this.msgWarning('未连接本地服务');
        return;
      }
      action.getCardInfo(undefined, false).then((res) => {
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
      action.issuingCard(userInfo, userMark).then((res) => {});
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

      action.writeData(fn.setData(versionMark, data)).then((res) => { });
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
