<template>
  <el-dialog v-loading :title="`发卡人: ${ userInfo.issuing_name || ''} (承运司机: ${userInfo.user_name ||''})`" :visible="visible" width="80%" append-to-body :close-on-click-modal="false" @close="handlerClose">
    <div v-show="false" class="mb20" style="padding: 20px;">
      <!-- <el-button type="primary" @click="handler('cancellation')">注销卡片(清空使用者信息)</el-button> -->
      <el-button type="primary" @click="handler('issuingCard')">发卡(绑定卡用户)</el-button>
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
      <template v-if="!isError" #status="{row}">
        <span v-if="row.status === 0"><i class="el-icon-check" /></span>
        <el-button v-else size="mini" type="danger" plain @click="absenceOpen(row)">不存在</el-button>
      </template>
    </RefactorTable>


    <div slot="footer" class="dialog-footer ly-flex-pack-center">
      <el-button type="primary" :disabled="loading || !list.length || isUserInfo || isError || isWart" @click="submitForm">保存并清空</el-button>
    </div>
  </el-dialog>
</template>

<script>
import CardReader from '@/libs/ICCard/CardReader';
import { checkList, delWaybill, check } from '@/api/settlement/adjustDregs';
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
      isError: true,
      delData: [], // 保存删除的数据
      meter: null
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

        if (!ret.success && !ret.code) {
          this._reqerror();
          return;
        }
        // console.log(ret);

        if (ret.code === '6A82') {
          // 读取文件失败
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
        this.meter = ret.meter;

        // console.log(ret, '数据');
        this.setLocalStorage(this.userInfo.user_code, { [this.userInfo]: this.IClist, meter: this.meter });
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
        this.isError = false;
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
        this.isError = true;
        // this.list = this.IClist.map(e => {
        //   return {
        //     ...e,
        //     fillTimeDate: this.parseTime(e.fillTime - 0),
        //     signTimeDate: this.parseTime(e.signTime - 0)
        //   };
        // });
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
        // console.log('转为正常单- 接口欠着');
        row.status = 0;
      }).catch((action) => {
        if (action === 'cancel') {
          delWaybill({ waybillId: row.waybillId - 0 }).then(res => {
            this.msgSuccess('删除该条记录成功');
            this.list = this.list.filter(e => e.waybillId !== row.waybillId);
            this.delData.push(row.waybillId);
            // console.log('当前删除的数据是', this.delData);
          });
        }
      });
    },

    submitForm() {
      if (this.isError) return;
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
        this.$confirm('保存并清空后,将清空卡数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loading = true;
          check(this.list.map(e => e.waybillId)).then(res => {
            // 发卡
            // action.issuingCard({
            //   user_code: this.userInfo.user_code,
            //   user_telno: this.userInfo.user_telno,
            //   user_name: this.userInfo.user_name,
            //   issuing_code: this.userInfo.issuing_code,
            //   issuing_name: this.userInfo.issuing_name
            // })
            // 销卡
            action.cancellation().then(res => {
              if (res.code === 200) {
                this.msgSuccess('核销成功');
                this.removeLocalStorage(this.userInfo.user_code);
                this.userInfo = {};
                this.list = [];
                this.IClist = [];
                this.loading = false;
                this.$emit('refresh');
                this.delData = [];
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
            user_code: 'b059e2004be441508f8fdf561db6eb4b',
            user_telno: '15859109001',
            user_name: '测试独立强',
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
          // 1010|1|30419;2993353;测试项目;b42da668161f424e8309c2b6eb81a399;贺彩善;17712345678;1623482232031;1623482340000;17;鼓山大桥
          action.writeData('1010|1|30633;2975634;测试项目4;闽AQ8001;测试独立强;15859109001;1623177000000;1623177480000;;妈湾').then(res => {
            this.msgSuccess(res.msg);
          });

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
      }
    },

    _reqerror() {
      this.$confirm('请将【数据IC卡】放至有效位置!', '不能读取到数据', {
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

    _returnWrite(userData, infoDataList) {
      this.loading = true;
      this.isWart = true;
      action.issuingCard({
        user_code: userData.user_code,
        user_telno: userData.user_telno,
        user_name: userData.user_name,
        issuing_code: userData.issuing_code,
        issuing_name: userData.issuing_name
      }).then(res => {
        // console.log(infoDataList);
        let meter = '1010|1|';
        if (this.meter) {
          meter = this.meter.join('|') + '|';
        }

        const arr = [];
        infoDataList.forEach(async(e, index) => {
          // 1010|1|30273;2977608;测试项目3;闽AQ8001;测试独立强;15859109001;1623177000000;1623177480000;;妈湾
          // '1010|1|30273;2977608;测试项目3;闽AQ8001;测试独立强;15859109001;1623177000000;1623177480000;;妈湾';
          this['time' + index] = setTimeout(() => {
            action.writeData(fn.setData(meter, e)).then(res => {
              // console.log('写入成功' + index);
              clearTimeout(this['time' + index]);
              arr.push(true);
              if (arr.length === infoDataList.length && arr.every(e => e)) {
                this.loading = false;
                this.isWart = false;
                this.msgSuccess(res.msg, '操作成功');
                this.delData = [];
                this.handlerClose();
              }
            });
          }, (index) * 1500);
        });
      });
    },
    handlerClose() {
      if (this.isWart) return;
      if (this.delData.length > 0) {
        this.$confirm('删除数据要花费' + (this.list.length * 1500) / 1000 + '秒, 期间禁止移动卡片, 确定要删除' + this.delData.join(',') + '吗', '确定要从卡里面清除吗?', {
          confirmButtonText: '确定删除',
          cancelButtonText: '保留原记录',
          type: 'warning',
          center: true
        }).then(() => {
          this._returnWrite(this.userInfo, this.list);
          // console.log(this.list);
          // console.log(this.IClist);
        }).catch(() => {
          this.$emit('update:open', false);
        });
        this.delData = [];

        return;
      }

      this.$emit('update:open', false);
    }
  }
};
</script>

<style>

</style>
