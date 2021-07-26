<template>
  <el-dialog
    v-loading
    :title="`发卡人: ${ userInfo.issuing_name || ''} 【承运司机: ${userInfo.user_name ||''}】【调度组: ${userInfo.team_name ||''}】 【发卡时间: ${ parseTime(userInfo.issuing_time - 0) || ''}】 【卡批次号: ${ userInfo.issuing_pc || ''}】 ` "
    :visible="visible"
    width="90%"
    append-to-body
    :close-on-click-modal="false"
    @close="handlerClose"
  >
    <div v-show="false" class="mb20" style="padding: 20px;">
      <el-button type="primary" @click="handler('getCardInfo')">获取卡片基本信息</el-button>
      <el-button type="primary" @click="handler('cancellation')">注销卡片(清空使用者信息)</el-button>
      <el-button type="primary" @click="handler('issuingCard')">发卡</el-button>
      <el-button type="primary" @click="handler('readUserinfo')">读取用户信息</el-button>
      <el-button type="primary" @click="handler('writeData')">写数据</el-button>
      <el-button type="primary" @click="handler('readData')">读取数据</el-button>
    </div>

    <RefactorTable
      :loading="loading"
      :data="list"
      :table-columns-config="[
        {
          prop: 'driverName',
          isShow: true,
          tooltip: true,
          label: '驾驶员姓名'
        },
        {
          prop: 'driverPhone',
          isShow: true,
          tooltip: true,
          label: '联系手机号'
        },
        {
          prop: 'licenseNumber',
          isShow: true,
          tooltip: true,
          label: '车牌号'
        },
        {
          prop: 'projectName',
          isShow: true,
          tooltip: true,
          label: '项目(装货地)'
        },
        {
          prop: 'fillTimeDate',
          isShow: true,
          tooltip: true,
          label: '入场时间'
        },
        {
          prop: 'signTimeDate',
          isShow: true,
          tooltip: true,
          label: '卸货时间'
        },
        {
          prop: 'orderId',
          isShow: true,
          tooltip: true,
          label: '货源单号'
        },
        {
          prop: 'waybillNo',
          isShow: true,
          tooltip: true,
          label: '运单编号'
        },
        {
          prop: 'ztcName',
          isShow: true,
          tooltip: true,
          label: '渣土场'
        },
        {
          prop: 'writeOffStatus',
          isShow: true,
          tooltip: true,
          label: '异常标记'
        },
        {
          prop: 'writeOffRemark',
          isShow: true,
          label: '异常备注',
          width: 200,
        },
      ]"
    >
      <!-- {
          prop: 'mudtail',
          isShow: true,
          label: '泥尾'
        }, -->
      <template #writeOffStatus="{row}">
        <el-switch
          v-model="row.writeOffStatus"
          :disabled="row.$_disable"
          active-color="#13ce66"
          inactive-color="#ff4949"
        />
      </template>
      <template #writeOffRemark="{row}">
        <span v-if="row.writeOffStatus"><i class="el-icon-check" /></span>
        <el-input v-else v-model="row.writeOffRemark" :disabled="row.$_disable" placeholder="请输入异常备注" />
      </template>

      <!-- <template v-if="!isError" #status="{row}">
        <span v-if="row.status === 0"><i class="el-icon-check" /></span>
        <el-button v-else size="mini" type="danger" plain @click="absenceOpen(row)">不存在</el-button>
      </template> -->
    </RefactorTable>


    <div slot="footer" class="dialog-footer ly-flex-pack-center">
      <el-button type="primary" :disabled="isFilter || loading || !list.length || isUserInfo " @click="submitForm">保存并清空</el-button>
      <!-- <el-button type="primary" :disabled="loading || !list.length || isUserInfo || isError || isWart" @click="submitForm">保存并清空</el-button> -->
    </div>
  </el-dialog>
</template>

<script>
// import { listInfo } from '@/api/assets/team';
// import { listDriver } from '@/api/assets/driver';
import { getUserByPhoneNum } from '@/api/system/user';
import CardReader, { USERINFO, versionMark } from '@/libs/ICCard/CardReader';
import { checkList, check } from '@/api/settlement/adjustDregs';
const { action, fn } = CardReader;

export default {
  name: 'NuclearCard',
  props: {
    open: Boolean
  },
  data() {
    return {
      loading: false,
      isWart: false,
      userInfo: {},
      list: [],
      IClist: [],
      delData: [], // 保存删除的数据
      meter: null,
      userMark: null,
      carId: undefined,
      errorCount: 0,

      // 渣土场 1001 场内1002 自倒 1003
      loadUnloadType_op: [
        // { 'dictLabel': '渣土场', 'dictValue': '1001' },
        { 'dictLabel': '场内', 'dictValue': '1002' },
        { 'dictLabel': '自倒', 'dictValue': '1003' }
      ]
    };
  },
  computed: {
    visible: {
      get() {
        if (this.open) {
          this._minit();
        } else {
          this._close();
        }
        return this.open;
      },
      set(v) {
        this.$emit('update:open', v);
      }
    },

    isUserInfo() {
      return JSON.stringify(this.userInfo) === '{}';
    },

    isFilter() {
      let bool = false;

      if (this.list && this.list.length) {
        const filterArr = this.list.filter(e => {
          return !e.writeOffStatus;
        });

        bool = this.list.length === filterArr.length;
      }
      return bool;
    }
  },

  methods: {
    init() {},
    // 连接` 读卡(卡id + 当前卡信息 + 卡存储的运单)
    _minit() {
      CardReader.fn.connect(async() => {
        this.loading = true;

        const ret = await action.readUserInfoAndreadData();

        // console.log(ret, '肯定是有数据进来不管成功还是失败---');

        // 读卡失败
        if (!ret.success) {
          this.errorCount++;
          this._reqerror();
          this.loading = false;
          return;
        }

        // 读取文件失败
        if (ret.code === '6A82') {
          if (ret.userInfo) {
            this.userInfo = ret.userInfo;
          }
          this.msgWarning(ret.msg);
          this.loading = false;
          return;
        }

        // 其他失败
        if (ret.code !== '9000') {
          this.msgError(ret.msg);
          this.loading = false;
          return;
        }

        // 成功 的数据
        this.userInfo = ret.userInfo;

        try {
          const issuing = await getUserByPhoneNum(this.userInfo.issuing_telno);
          if (issuing.data) {
            this.userInfo.issuing_name = issuing.data.nickName || issuing.data.userName || issuing.data.phonenumber;
          } else {
            this.userInfo.issuing_name = '--';
            this.msgError('发卡者用户不存在');
          }
        } catch (error) {
          console.log(error);
          this.userInfo.issuing_name = '--';
        }

        // 司机
        try {
          const driver = await getUserByPhoneNum(this.userInfo.user_telno);
          if (driver.data) {
            this.userInfo.user_name = driver.data.nickName || driver.data.userName || driver.data.phonenumber;
          } else {
            this.userInfo.user_name = '--';
            this.msgError('司机用户不存在');
          }
        } catch (error) {
          console.log(error);
          this.userInfo.user_name = '--';
        }


        // 承运者
        try {
          const team = await getUserByPhoneNum(this.userInfo.team_telno);
          if (team.data) {
            this.userInfo.team_name = team.data.nickName || team.data.userName || team.data.phonenumber;
          } else {
            this.userInfo.team_name = '--';
            this.msgError('承运者用户不存在');
          }
        } catch (error) {
          console.log(error);
          this.userInfo.team_name = '--';
        }





        this.userInfo.issuing_pc = this.userInfo.issuing_pc || Date.now() + '000';
        this.IClist = ret.dataList;
        this.meter = ret.meter;
        this.userMark = ret.userMark;
        this.carId = ret.GetCardNo.data;

        console.log([this.userInfo], '----------持卡者信息');
        console.log([this.IClist], '----------当前卡数据');
        console.log([this.meter], '----------卡版本');
        console.log([this.userMark], '----------用户版本');
        console.log([this.carId], '----------ka标识');

        this.setLocalStorage(this.carId, { [this.userInfo.issuing_pc]: { data: this.IClist, meter: this.meter, userMark: this.userMark, userInfo: this.userInfo }}); // 本地存储
        console.log(this.getLocalStorage(this.carId));

        // 后端交互
        this.initData();
      }, () => {
        this.loading = false;
        this.$emit('update:open', false);
      });
    },

    // 请求
    async initData() {
      // 参数
      const que = {
        icList: this.IClist.map(e => {
          return {
            ...e,
            fillTimeDate: e.fillTime,
            signTimeDate: e.signTime,
            other: undefined
          };
        }),
        icCode: this.carId
      };

      try {
        const res = await checkList(que);

        // 处理数据
        this.list = res.data.map(e => {
          const batchInfo = e.batchWayBillBalanceInfoVo || {};


          let ztcName = batchInfo.ztcName || '-';
          if (batchInfo.loadUnloadType !== '1001') {
            ztcName = this.selectDictLabel(this.loadUnloadType_op, batchInfo.loadUnloadType) || '-';
          }


          return {
            ...e,
            driverName: batchInfo.driverName || '-',
            projectName: batchInfo.projectName || '-',
            ztcName,
            // serialNumber: batchInfo.ztcName || e.serialNumber,
            mudtail: batchInfo.unloadAddress || '-',
            writeOffStatus: e.writeOffStatus === 0,
            $_disable: e.writeOffStatus === -1,
            fillTimeDate: this.parseTime(e.fillTime - 0),
            signTimeDate: batchInfo.signTime
          };
        });

        console.log(this.list);

        // 排序
        this.list.sort((m, n) => {
          if (m.writeOffStatus > n.writeOffStatus) return -1;
        });
        this.loading = false;
      } catch (error) {
        this.loading = false;
      }
    },

    /**
      // absenceOpen(row) {
      //   this.$confirm('运单不存在', `运单: ${row.waybillId}`, {
      //     confirmButtonText: '转为正常单',
      //     cancelButtonText: '删除该条记录',
      //     distinguishCancelAndClose: true,
      //     type: 'warning',
      //     center: true
      //   }).then(() => {
      //     // console.log('转为正常单- 接口欠着');
      //     row.status = 0;
      //   }).catch((action) => {
      //     if (action === 'cancel') {
      //      { waybillId: row.waybillId - 0 }).then(res => {
      //         this.msgSuccess('删除该条记录成功');
      //         this.list = this.list.filter(e => e.waybillId !== row.waybillId);
      //         this.delData.push(row.waybillId);
      //         // console.log('当前删除的数据是', this.delData);
      //       });
      //     }
      //   });
      // },
    */
    /** 核销 */
    async submitForm() {
      // 判断异常的数据 条件 writeOffStatus 为false的时候是异常
      const filterArr = this.list.filter(e => {
        return !e.writeOffStatus;
      });

      // 数据有异常提示
      if (filterArr.length > 0) {
        this.$confirm(`运单存在${filterArr.length} 条异常单, 确定将会把异常单数据写回卡中, 并核销正常单`, '数据存在异常', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          try {
            // 写卡
            this.errorHexiaoCheck(filterArr);
          } catch (error) {
            this.loading = false;
          }
        }).catch(() => {});
      } else {
        this.$confirm(`确定立即核销`, '数据正常', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          try {
            // 无异常做核销动作
            this.loading = true;
            const res = await action.cancellation();
            this.loading = false;
            if (!res.success) {
              this.msgError('核销失败, 请不要移动IC卡!');
              this.handlerClose();
              return;
            }

            if (res.success && res.code === '9000') {
              await this.handlerCheck();
              this.msgSuccess('核销成功');
              this.handlerClose();
            } else {
              this.msgError('核销失败');
            }
          } catch (error) {
            this.loading = false;
          }
        });
      }
    },

    // 核销请求
    async handlerCheck() {
      this.loading = true;

      // 过滤出异常$_disable 为true的数据

      // console.log((this.list.filter(ee => !ee.$_disable)));
      const queArr = (this.list.filter(ee => !ee.$_disable)).map(e => {
        return {
          card16no: this.carId,
          cardBatchNo: this.userInfo.issuing_pc,
          waybillNo: e.waybillNo,
          waybillCode: e.batchWayBillBalanceInfoVo.wayBillCode,
          writeOffStatus: e.writeOffStatus ? 0 : 1,
          writeOffRemark: e.writeOffStatus ? '' : e.writeOffRemark
        };
      });

      // 数据发送给父组件

      this.$emit('listData', (this.list.filter(e => e.writeOffStatus)).map(e => {
        e.batchWayBillBalanceInfoVo.icStatus = '1';
        e.icStatus = '1';
        e.$_userInfo = this.userInfo;
        return e;
      }));

      return await check(queArr);
    },


    // 异常要做写回卡的操作 filterArr 是异常的数据
    async errorHexiaoCheck(filterArr) {
      // 走发卡-写卡
      if (!this.userInfo) return;
      // console.log(this.userInfo);

      try {
        this.loading = true;
        const res = await action.issuingCard(this.userInfo, this.userMark);


        if (!res.success) {
          this.loading = false;
          this.msgError('核销失败, 请不要移动IC卡!');
          this.handlerClose();
          return;
        }

        if (res.success && res.code !== '9000') {
          this.loading = false;
          this.msgError(res.msg);
          return;
        }
      } catch (error) {
        this.msgError('核销失败, 请不要移动IC卡!');
        this.handlerClose();
        this.loading = false;
        return;
      }
      // 写卡
      // 定义 版本标识
      const meter = this.meter ? this.meter.join('|') + '|' : versionMark;

      // 通过时间来
      const arr = [];
      filterArr.forEach(async(e, index) => {
        this['time' + index] = setTimeout(() => {
          action.writeData(fn.setData(meter, e)).then(res => {
            clearTimeout(this['time' + index]);
            if (res.success && res.code === '9000') {
              arr.push(true);
              // 执行到最后一步走这里
            } else {
              arr.push(false);
              this.msgError(res.msg);
            }
            if (arr.length === filterArr.length) {
              if (arr.every(e => e)) {
                this.handlerCheck().then(() => {
                  this.loading = false;
                  this.msgSuccess('核销成功');
                  this.handlerClose();
                }).catch(() => { this.loading = false; });
              } else {
                this.loading = false;
                this.msgError('核销失败');
              }
            }
          });
        }, (index + 1) * 500);
      });
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

    _reqerror() {
      const msg = '请将【数据IC卡】放至有效位置!';

      this.$confirm(msg, '不能读取到数据', {
        confirmButtonText: '知道了',
        type: 'warning',
        showCancelButton: false,
        center: true
      }).then(() => {
        this.$emit('update:open', false);
      }).catch(() => {
        this.$emit('update:open', false);
      });
    },

    // _returnWrite(userData, infoDataList) {
    //   this.loading = true;
    //   this.isWart = true;
    //   action.issuingCard({
    //     user_code: userData.user_code,
    //     user_telno: userData.user_telno,
    //     user_name: userData.user_name,
    //     issuing_code: userData.issuing_code,
    //     issuing_name: userData.issuing_name
    //   }).then(res => {
    //     // console.log(infoDataList);
    //     let meter = '1010|1|';
    //     if (this.meter) {
    //       meter = this.meter.join('|') + '|';
    //     }

    //     const arr = [];
    //     infoDataList.forEach(async(e, index) => {
    //       // 1010|1|30273;2977608;测试项目3;闽AQ8001;测试独立强;15859109001;1623177000000;1623177480000;;妈湾
    //       // '1010|1|30273;2977608;测试项目3;闽AQ8001;测试独立强;15859109001;1623177000000;1623177480000;;妈湾';
    //       this['time' + index] = setTimeout(() => {
    //         action.writeData(fn.setData(meter, e)).then(res => {
    //           // console.log('写入成功' + index);
    //           clearTimeout(this['time' + index]);
    //           arr.push(true);
    //           if (arr.length === infoDataList.length && arr.every(e => e)) {
    //             this.loading = false;
    //             this.isWart = false;
    //             this.msgSuccess(res.msg, '操作成功');
    //             this.delData = [];
    //             this.handlerClose();
    //           }
    //         });
    //       }, (index) * 1500);
    //     });
    //   });
    // },
    handlerClose() {
      this.$emit('update:open', false);
    },

    /** 卡的操作 */
    async handler(key) {
      const mobj = {};
      // 当前用户测试数据
      const arr = '14700000001;120;15859102001;15859109601;1626253668656;1626253668656386;r';

      const dataList = [
        '1010|2|2105272013285561;2106231554010424;110;鄂ALF106;13812345678;1621648441990;1621648441990;2614710',
        '1010|2|2105272013285561;2106231554010425;110;鄂ALF106;13812345678;1621648441990;1621648441990;2614710',
        '1010|2|2105272013285561;2106231554010426;110;鄂ALF106;13812345678;1621648441990;1621648441990;2614710',
        '1010|2|2105272013285561;2106231554010427;110;鄂ALF106;13812345678;1621648441990;1621648441990;2614710',
        '1010|2|2105272013285561;2106231554010428;110;鄂ALF106;13812345678;1621648441990;1621648441990;2614710',
        '1010|2|2105272013285561;2106231554010418;110;鄂ALF106;13812345678;1621648441990;1621648441990;2614710',
        '1010|2|2105272013285561;2106231554010418;110;鄂ALF106;13812345678;1621648441990;1621648441990;2614710',
        '1010|2|2105272013285561;2106231554010418;110;鄂ALF106;13812345678;1621648441990;1621648441990;2614710',
        '1010|2|2105272013285561;2106231554010418;110;鄂ALF106;13812345678;1621648441990;1621648441990;2614710',
        '1010|2|2105272013285561;2106231554010418;110;鄂ALF106;13812345678;1621648441990;1621648441990;2614710',

        '1010|2|2105272013285561;2106231554010418;110;鄂ALF106;13812345678;1621648441990;1621648441990;2614710',
        '1010|2|2105272013285561;2106231554010418;110;鄂ALF106;13812345678;1621648441990;1621648441990;2614710',
        '1010|2|2105272013285561;2106231554010418;110;鄂ALF106;13812345678;1621648441990;1621648441990;2614710',
        '1010|2|2105272013285561;2106231554010418;110;鄂ALF106;13812345678;1621648441990;1621648441990;2614710',
        '1010|2|2105272013285561;2106231554010418;110;鄂ALF106;13812345678;1621648441990;1621648441990;2614710',
        '1010|2|2105272013285561;2106231554010418;110;鄂ALF106;13812345678;1621648441990;1621648441990;2614710',
        '1010|2|2105272013285561;2106231554010418;110;鄂ALF106;13812345678;1621648441990;1621648441990;2614710',
        '1010|2|2105272013285561;2106231554010418;110;鄂ALF106;13812345678;1621648441990;1621648441990;2614710',
        '1010|2|2105272013285561;2106231554010418;110;鄂ALF106;13812345678;1621648441990;1621648441990;2614710',
        '1010|2|2105272013285561;2106231554010418;110;鄂ALF106;13812345678;1621648441990;1621648441990;2614710',

        '1010|2|2105272013285561;2106231554010418;110;鄂ALF106;13812345678;1621648441990;1621648441990;2614710',
        '1010|2|2105272013285561;2106231554010418;110;鄂ALF106;13812345678;1621648441990;1621648441990;2614710',
        '1010|2|2105272013285561;2106231554010418;110;鄂ALF106;13812345678;1621648441990;1621648441990;2614710',
        '1010|2|2105272013285561;2106231554010418;110;鄂ALF106;13812345678;1621648441990;1621648441990;2614710',
        '1010|2|2105272013285561;2106231554010418;110;鄂ALF106;13812345678;1621648441990;1621648441990;2614710',
        '1010|2|2105272013285561;2106231554010418;110;鄂ALF106;13812345678;1621648441990;1621648441990;2614710',
        '1010|2|2105272013285561;2106231554010418;110;鄂ALF106;13812345678;1621648441990;1621648441990;2614710',
        '1010|2|2105272013285561;2106231554010418;110;鄂ALF106;13812345678;1621648441990;1621648441990;2614710',
        '1010|2|2105272013285561;2106231554010418;110;鄂ALF106;13812345678;1621648441990;1621648441990;2614710',
        '1010|2|2105272013285561;2106231554010418;110;鄂ALF106;13812345678;1621648441990;1621648441990;2614710',

        '1010|2|2105272013285561;2106231554010418;110;鄂ALF106;13812345678;1621648441990;1621648441990;2614710',
        '1010|2|2105272013285561;2106231554010418;110;鄂ALF106;13812345678;1621648441990;1621648441990;2614710',
        '1010|2|2105272013285561;2106231554010418;110;鄂ALF106;13812345678;1621648441990;1621648441990;2614710',
        '1010|2|2105272013285561;2106231554010418;110;鄂ALF106;13812345678;1621648441990;1621648441990;2614710',
        '1010|2|2105272013285561;2106231554010418;110;鄂ALF106;13812345678;1621648441990;1621648441990;2614710',
        '1010|2|2105272013285561;2106231554010418;110;鄂ALF106;13812345678;1621648441990;1621648441990;2614710',
        '1010|2|2105272013285561;2106231554010418;110;鄂ALF106;13812345678;1621648441990;1621648441990;2614710',
        '1010|2|2105272013285561;2106231554010418;110;鄂ALF106;13812345678;1621648441990;1621648441990;2614710',
        '1010|2|2105272013285561;2106231554010418;110;鄂ALF106;13812345678;1621648441990;1621648441990;2614710',
        '1010|2|2105272013285561;2106231554010418;110;鄂ALF106;13812345678;1621648441990;1621648441990;2614710'


      ];

      const icData = this.getLocalStorage(this.carId) ? this.getLocalStorage(this.carId)[this.userInfo.issuing_pc] : null;

      let res = '';
      switch (key) {
        case 'getCardInfo':
          // 获取卡信息
          action.getCardInfo().then(res => {
            console.log(res);
          });
          break;
        case 'cancellation':
          // 注销卡片
          action.cancellation().then(res => {
            console.log(res);
          });
          break;
        case 'issuingCard':
          // 发卡
          if (icData) {
            action.issuingCard(icData.userInfo, icData.userMark).then(res => {
              console.log(res);
            });
          } else {
            // 测试的发卡
            USERINFO.forEach((e, index) => {
              mobj[e] = (arr.split(';'))[index];
            });

            action.issuingCard(mobj).then(res => {
              console.log(res);
            });
          }
          break;
        case 'readUserinfo':
          // 读取用户信息
          action.readUserInfo().then(res => {
            console.log(res);
          });

          break;
        case 'readData':
          // 读取卡数据
          action.readUserInfoAndreadData().then(res => {
            console.log(res);
          });
          break;
        case 'writeData':
          // 写数据
          if (icData) {
            // icData.data;
            for (let index = 0; index < icData.data.length; index++) {
              const e = icData.data[index];
              res = await action.writeData(fn.setData(icData.meter.join('|') + '|', e));
              console.log(res);
            }
          } else {
            const arr1 = [];
            dataList.forEach(async(e, index) => {
              this['time' + index] = setTimeout(() => {
                action.writeData(e).then(res => {
                  clearTimeout(this['time' + index]);
                  if (res.success && res.code === '9000') {
                    arr1.push(true);
                    // 执行到最后一步走这里
                  } else {
                    arr1.push(false);
                    this.msgSuccess(res.msg);
                  }

                  if (arr1.length === dataList.length) {
                    if (arr1.every(e => e)) {
                      console.log('写入成功');
                    } else {
                      this.loading = false;
                      this.msgError('写入失败');
                    }
                  }
                });
              }, (index + 1) * 500);
            });
          }
          break;
        default:
          break;
      }
    }
  }
};
</script>

<style>

</style>
