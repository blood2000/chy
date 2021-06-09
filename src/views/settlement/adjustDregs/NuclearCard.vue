<template>
  <el-dialog :title="`发卡人: ${ userInfo.issuing_name || ''} (承运司机: ${userInfo.user_name ||''})`" :visible="visible" width="80%" append-to-body :close-on-click-modal="false" @close="$emit('update:open', false)">
    <div v-if="true" class="mb20" style="padding: 20px;">
      <!-- <el-button type="primary" @click="handler('cancellation')">注销卡片(清空使用者信息)</el-button> -->
      <el-button type="primary" @click="handler('issuingCard')">核销并发卡(绑定卡用户)</el-button>
      <!-- <el-button type="primary" @click="handler('readUserinfo')">读取用户信息</el-button> -->
      <!-- <el-button type="primary" @click="handler('readData')">读取数据</el-button> -->
      <el-button type="primary" @click="handler('writeData')">写数据</el-button>
      <!-- <el-button type="primary" @click="handler('readUserInfoAndreadData')">读取数据</el-button> -->
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
          label: '项目(装货地)'
        },
        {
          prop: 'mudtail',
          isShow: true,
          label: '泥尾'
        },
        {
          prop: 'fillTimeDate',
          isShow: true,
          label: '入场时间'
        },
        {
          prop: 'signTimeDate',
          isShow: true,
          label: '出场时间'
        },
        {
          prop: 'orderId',
          isShow: true,
          label: '货源编号'
        },
        {
          prop: 'waybillId',
          isShow: true,
          label: '运单编号'
        },
        {
          prop: 'serialNumber',
          isShow: true,
          label: '渣土场编号'
        },
        {
          prop: 'status',
          isShow: true,
          label: '核对状态'
        }
      ]"
    >
      <template #status="{row}">
        <span v-if="row.status === 0"><i class="el-icon-check" /></span>
        <el-button v-else size="mini" type="danger" plain @click="absenceOpen(row)">不存在</el-button>
      </template>
    </RefactorTable>


    <div slot="footer" class="dialog-footer ly-flex-pack-center">
      <el-button type="primary" :disabled="!list.length || isUserInfo" @click="submitForm">保存并清空</el-button>
    </div>
  </el-dialog>
</template>

<script>
import CardReader from '@/libs/ICCard/CardReader';
import { checkList, delWaybill, check } from '@/api/settlement/adjustDregs';
const { action } = CardReader;
export default {
  name: 'NuclearCard',
  props: {
    open: Boolean
  },
  data() {
    return {
      loading: false,
      userInfo: {},
      list: [],
      IClist: []
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
    }
  },

  methods: {
    init() {},
    // 连接 读取
    _minit() {
      CardReader.fn.connect(async() => {
        this.loading = true;
        const ret = await action.readUserInfoAndreadData();

        console.log(ret);
        if (!ret.success && !ret.code) {
          this._reqerror();
          return;
        }

        if (ret.code === '6A82') {
          if (ret.userInfo) {
            this.userInfo = ret.userInfo;
          }
          this.msgWarning(ret.msg);
          return;
        }

        if (ret.code !== '9000') {
          this.msgError(ret.msg);
          return;
        }

        this.userInfo = ret.userInfo;
        this.IClist = ret.dataList;
        this.setLocalStorage(ret.userInfo.user_code, { [ret.userInfo]: ret.dataList });
        this.initData();
      }, () => {
        this.loading = false;
        this.$emit('update:open', false);
      });
    },

    async initData() {
      const que = {
        icList: this.IClist.map(e => {
          return {
            ...e,
            other: undefined
          };
        }),
        userCode: this.userInfo.user_code //	用户CODE
      };

      try {
        const res = await checkList(que);
        this.list = res.data.map(e => {
          return {
            ...e,
            fillTimeDate: this.parseTime(e.fillTime - 0),
            signTimeDate: this.parseTime(e.signTime - 0)
          };
        });

        this.list.sort((m, n) => {
          if (m.status > n.status) return -1;
        });
        this.loading = false;
      } catch (error) {
        this.loading = false;
      }
    },

    absenceOpen(row) {
      this.$confirm('运单不存在', `运单: ${row.waybillId}`, {
        confirmButtonText: '转为正常单',
        cancelButtonText: '删除该条记录',
        distinguishCancelAndClose: true,
        type: 'warning',
        center: true
      }).then(() => {
        console.log('转为正常单- 接口欠着');
        row.status = 0;
      }).catch((action) => {
        if (action === 'cancel') {
          delWaybill({ waybillId: row.waybillId - 0 }).then(res => {
            this.msgSuccess('删除该条记录成功');
            this.list = this.list.filter(e => e.waybillId !== row.waybillId);
          });
        }
      });
    },

    submitForm() {
      const filterArr = this.list.filter(e => {
        return e.status !== 0;
      });

      if (filterArr.length > 0) {
        this.$alert(`运单${filterArr[0].waybillId} 平台未能核对成功`, '数据存在异常', {
          confirmButtonText: '好的',
          type: 'warning',
          center: true,
          callback: action => {}
        });
      } else {
        this.$confirm('确认保存并清空, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loading = true;
          check(this.list.map(e => e.waybillId)).then(res => {
            action.issuingCard({
              user_code: this.userInfo.user_code,
              user_telno: this.userInfo.user_telno,
              user_name: this.userInfo.user_name,
              issuing_code: this.userInfo.issuing_code,
              issuing_name: this.userInfo.issuing_name
            }).then(res => {
              if (res.code === 200) {
                this.msgSuccess('保存并核销成功');
                this.userInfo = {};
                this.list = [];
                this.IClist = [];
                this.loading = false;
                this.$emit('refresh');
                this.$emit('update:open', false);
              }
            }).catch(error => {
              this.msgError(error);
            });
          });
        }).catch(() => {

        });
      }
    },

    async handler(key) {
      switch (key) {
        case 'cancellation':
          // 注销卡片
          action.cancellation().then(res => { console.log(res); });
          break;
        case 'issuingCard':
          // 发卡
          action.issuingCard({
            user_code: 'b0d285c8b68a46f7a93c0039a0242d20',
            user_telno: '18415451845',
            user_name: '林先生',
            issuing_code: '94671e0bff6647e88db777427d700e32',
            issuing_name: '陈大帅'
          }).then(res => {
            this.msgSuccess(res.msg);
          });
          break;
        case 'readUserinfo':
          // 读取用户信息
          action.readUserInfo().then(res => console.log(res));

          break;
        case 'readData':
          break;
        case 'readUserInfoAndreadData':
          // 读取数据e
          action.readUserInfoAndreadData();
          break;
        case 'writeData':
          // 写数据
          await action.writeData('1010|1|30273;2977608;国脉时代广场二期;闽j45678;林先生;;1623177000000;1623177480000;;妈湾');
          break;
        default:
          break;
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
        console.log('关闭');
      }
    },

    _reqerror() {
      this.$confirm('请将【数据IC卡】放至有效位置!', '为能读取到数据', {
        confirmButtonText: '知道了',
        type: 'warning',
        showCancelButton: false,
        center: true
      }).then(() => {
        this.$emit('update:open', false);
      }).catch(() => {
        this.$emit('update:open', false);
      });
    }
  }
};
</script>

<style>

</style>
