<template>
  <el-dialog
    v-loading
    :title="`发卡人: ${ userInfo.issuing_name || ''} ${userInfo.user_name? '【承运司机: '+ userInfo.user_name + '】' :''}【调度组: ${userInfo.team_name ||''}】 【发卡时间: ${ parseTime(userInfo.issuing_time - 0) || ''}】 【卡批次号: ${ userInfo.issuing_pc || ''}】 ` "
    :visible="visible"
    width="90%"
    append-to-body
    :close-on-click-modal="false"
    @close="handlerClose"
  >
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
          label: '运输单号'
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

    </RefactorTable>


    <div slot="footer" class="dialog-footer ly-flex-pack-center">
      <el-button type="primary" :disabled="isFilter || loading || !list.length || isUserInfo " @click="submitForm">保存并清空</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getUserByPhoneNum } from '@/api/system/user';
import CardReader, { versionMark } from '@/libs/ICCard/CardReader';
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

        console.log(ret);

        // 读卡失败
        if (!ret.success) {
          this.errorCount++;
          this._reqerror(ret);
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

        // 司机(版本3的时候才出现)
        if (ret.userMark === '1000|3|') {
          try {
            const driver = await getUserByPhoneNum(this.userInfo.user_telno);
            if (driver.data) {
              this.userInfo.user_name = driver.data.nickName || driver.data.userName || driver.data.phonenumber;
            } else {
              this.userInfo.user_name = '';
              this.msgError('司机用户不存在');
            }
          } catch (error) {
            console.log(error);
            this.userInfo.user_name = '';
          }
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





        // this.userInfo.issuing_pc = this.userInfo.issuing_pc || Date.now() + '000';
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
        // console.log(this.getLocalStorage(this.carId));

        // 后端交互(处理一下, 如果只有用户数据, 没有运单数据的情况)
        if (this.IClist && this.IClist.length > 0) {
          this.initData();
        } else {
          this.msgWarning(ret.msg || '无运单相关信息');
          this.loading = false;
        }
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
        console.log(error);
        this.loading = false;
      }
    },

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
              const res = await this.handlerCheck();

              console.log(res);
              // 数据发送给父组件
              this.$emit('listData', (this.list.filter(e => e.writeOffStatus)).map(e => {
                e.batchWayBillBalanceInfoVo.icStatus = '1';
                e.batchWayBillBalanceInfoVo.teamName = res.data;
                e.icStatus = '1';
                e.$_userInfo = this.userInfo;
                return e;
              }));
              this.msgSuccess('核销成功');
              this.handlerClose();
            } else {
              this.msgError('核销失败');
            }
          } catch (error) {
            this.loading = false;
          }
        }).catch(() => {
          const queArr = (this.list.filter(ee => !ee.$_disable)).map(e => {
            return {
              card16no: this.carId,
              teamTelno: this.userInfo.team_telno,
              cardBatchNo: this.userInfo.issuing_pc,
              waybillNo: e.waybillNo,
              waybillCode: e.batchWayBillBalanceInfoVo.wayBillCode,
              writeOffStatus: e.writeOffStatus ? 0 : 1,
              writeOffRemark: e.writeOffStatus ? '' : e.writeOffRemark
            };
          });

          console.log(queArr);
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
          teamTelno: this.userInfo.team_telno,
          cardBatchNo: this.userInfo.issuing_pc,
          waybillNo: e.waybillNo,
          waybillCode: e.batchWayBillBalanceInfoVo.wayBillCode,
          writeOffStatus: e.writeOffStatus ? 0 : 1,
          writeOffRemark: e.writeOffStatus ? '' : e.writeOffRemark
        };
      });



      return await check(queArr);
    },

    // 异常要做写回卡的操作 filterArr 是异常的数据
    async errorHexiaoCheck(filterArr) {
      // 走发卡-写卡
      if (!this.userInfo) return;
      // console.log(this.userInfo);

      try {
        this.loading = true;
        const cancellation = await action.cancellation();
        if (!cancellation.success || cancellation.code !== '9000') {
          this.loading = false;
          this.msgError(cancellation.msg || '核销失败');
          return;
        }
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
        console.log(fn.setData(meter, e), '要写回的数据');

        this['time' + index] = setTimeout(() => {
          action.writeData(fn.setData(meter, e)).then(res => {
            clearTimeout(this['time' + index]);
            if (res.success) {
              if (res.code === '9000') {
                arr.push(true);
              } else {
                arr.push(false);
                this.msgError(res.msg);
              }
              // 执行到最后一步走这里
            } else {
              arr.push(false);
              // this.msgError(res.msg);
            }
            if (arr.length === filterArr.length) {
              if (arr.every(e => e)) {
                this.handlerCheck().then((res) => {
                  console.log(res);
                  this.loading = false;
                  this.msgSuccess('核销成功');

                  // 数据发送给父组件
                  this.$emit('listData', (this.list.filter(e => e.writeOffStatus)).map(e => {
                    e.batchWayBillBalanceInfoVo.icStatus = '1';
                    e.batchWayBillBalanceInfoVo.teamName = res.data;
                    e.icStatus = '1';
                    e.$_userInfo = this.userInfo;
                    return e;
                  }));


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

    _reqerror(ret) {
      let msg = '';
      if (ret.code) {
        msg = ret.msg;
      } else {
        msg = '请将【数据IC卡】放至有效位置!';
      }

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

    handlerClose() {
      this.$emit('update:open', false);
    }
  }
};
</script>

<style>

</style>
